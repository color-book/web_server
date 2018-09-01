package main

import (
	"context"
	"flag"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"time"
	"database/sql"
	"strings"
	"encoding/json"

	"github.com/gorilla/mux"
	gorillaContex "github.com/gorilla/context"
	"github.com/rs/cors"
	"github.com/dgrijalva/jwt-go"

	_ "github.com/lib/pq"

	"github.com/color-book/web_server/dataStore"
	"github.com/color-book/web_server/handlers"
	"github.com/color-book/web_server/configVars"
)

var (
	listenAddr string
)

type MiddlewareException struct {
	Success bool `json:"success"`
	ErrorMessage string `json:"errorMessage"`
}

func runServer() {
	flag.StringVar(&listenAddr, "listen-addr", ":5050", "server listen address")
	flag.Parse()

	// INITIALIZE CONFIG VARIABLES
	configVars.InitConfigVars()

	// LOGGING
	logger := log.New(os.Stdout, "http: ", log.LstdFlags)
	logger.Println("Colorbook server is starting...")

	// INITIALIZE DATABASE
	connString := configVars.Config.DB_CONNECTION_STRING
	db, err := sql.Open("postgres", connString)

	if err != nil {
		panic(err)
	}
	err = db.Ping()

	if err != nil {
		panic(err)
	}

	dataStore.InitStore(&dataStore.DBStore{DB: db})

	// ROUTES
	router := mux.NewRouter().StrictSlash(true)
	router.HandleFunc("/", handlers.Index).Methods("GET")
	router.HandleFunc("/get-positions", ensureAuthenticated(handlers.GetPositions)).Methods("GET")
	router.HandleFunc("/register", handlers.Register).Methods("POST")
	router.HandleFunc("/login", handlers.Login).Methods("POST")
	router.HandleFunc("/calculate-job", ensureAuthenticated(handlers.CalculateJob)).Methods("POST")

	c := cors.New(cors.Options{
		AllowedOrigins: []string{"http://localhost:3000"},
		AllowedMethods: []string{"GET", "HEAD", "POST", "PUT", "OPTIONS"},
    // Enable Debugging for testing, consider disabling in production
    Debug: true,
	})

	server := &http.Server{
		Addr:         listenAddr,
		Handler:      c.Handler(router),
		ErrorLog:     logger,
		ReadTimeout:  5 * time.Second,
		WriteTimeout: 10 * time.Second,
		IdleTimeout:  15 * time.Second,
	}

	done := make(chan bool)
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, os.Interrupt)

	go func() {
		<-quit
		logger.Println("Server is shutting down...")

		ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
		defer cancel()

		server.SetKeepAlivesEnabled(false)
		if err := server.Shutdown(ctx); err != nil {
			logger.Fatalf("Could not gracefully shutdown the server: %v\n", err)
		}
		close(done)
	}()

	logger.Println("Server is ready to handle requests at", listenAddr)

	if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
		logger.Fatalf("Could not listen on %s: %v\n", listenAddr, err)
	}

	<-done
	logger.Println("Colorbook server stopped")
}

func main() {
	runServer()
}

/* ----------------- Middleware ------------------ */

func ensureAuthenticated(next http.HandlerFunc) http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, req *http.Request) {
		authorizationHeader := req.Header.Get("Authorization")
		if authorizationHeader != "" {
			bearerToken := strings.Split(authorizationHeader, " ")

			// TODO: VERIFY THIS IS THE CASE WITH AXIOS
			if len(bearerToken) == 1 {
				token, error := jwt.Parse(bearerToken[0], func(token *jwt.Token) (interface{}, error) {
					if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
						return nil, fmt.Errorf("There was an error")
					}
					return []byte(configVars.Config.JWT_TOKEN_SECRET), nil
				})
				if error != nil {
					json.NewEncoder(w).Encode(MiddlewareException{ErrorMessage: error.Error(), Success: false})
					return
				}
				if token.Valid {
					gorillaContex.Set(req, "decoded", token.Claims)
					next(w, req)
				} else {
					json.NewEncoder(w).Encode(MiddlewareException{ErrorMessage: "Invalid authorization token", Success: false})
				}
			} else {
				json.NewEncoder(w).Encode(MiddlewareException{ErrorMessage: "Improper authorization header", Success: false})
			}
		} else {
			json.NewEncoder(w).Encode(MiddlewareException{ErrorMessage: "An authorization header is required", Success: false})
		}
	})
}