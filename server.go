package main

import (
	"context"
	"flag"
	"log"
	"net/http"
	"os"
	"os/signal"
	"time"
	"database/sql"
	"encoding/json"

	"github.com/gorilla/mux"
	"github.com/rs/cors"

	_ "github.com/lib/pq"

	"github.com/color-book/web_server/dataStore"
	"github.com/color-book/web_server/handlers"
)

type Configuration struct {
	DB_CONNECTION_STRING string
}

var (
	listenAddr string
	configuration Configuration
)

func initializeConfigVariables() {

	file, err := os.Open("./config.json") 
	if err != nil {  
		panic(err) 
	}  

	decoder := json.NewDecoder(file) 
	err = decoder.Decode(&configuration) 
	if err != nil {  
		panic(err) 
	}

}

func runServer() {
	flag.StringVar(&listenAddr, "listen-addr", ":5050", "server listen address")
	flag.Parse()

	// INITIALIZE CONFIG VARIABLES
	initializeConfigVariables()

	// LOGGING
	logger := log.New(os.Stdout, "http: ", log.LstdFlags)
	logger.Println("Colorbook server is starting...")

	// INITIALIZE DATABASE
	connString := configuration.DB_CONNECTION_STRING
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
	router.HandleFunc("/get-positions", handlers.GetPositions).Methods("GET")
	router.HandleFunc("/register", handlers.Register).Methods("POST")
	router.HandleFunc("/calculate-job",handlers.CalculateJob).Methods("POST")

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