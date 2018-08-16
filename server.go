package main

import (
	"context"
	"fmt"
	"flag"
	"log"
	"net/http"
	"os"
	"os/signal"
	"time"
	"database/sql"

	"github.com/gorilla/mux"
	"github.com/rs/cors"

	_ "github.com/lib/pq"

	"github.com/color-book/web_server/dataStore"
	"github.com/color-book/web_server/indexHandler"
	"github.com/color-book/web_server/jobCostingHandler"
)

var (
	listenAddr string
)

func runServer() {
	flag.StringVar(&listenAddr, "listen-addr", ":5050", "server listen address")
	flag.Parse()

	// LOGGING
	logger := log.New(os.Stdout, "http: ", log.LstdFlags)
	logger.Println("Colorbook server is starting...")

	// INITIALIZE DATABASE
	connString := fmt.Sprintf("host=%s port=%d user=%s "+
	"password=%s dbname=%s sslmode=disable",
	"localhost", 5432, "postgres", "", "color-book")
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
	router.HandleFunc("/", indexHandler.Index).Methods("GET")
	router.HandleFunc("/calculate-job", jobCostingHandler.CalculateJob).Methods("POST")

	c := cors.New(cors.Options{
		AllowedOrigins: []string{"http://localhost:3000"},
		AllowedMethods: []string{"GET", "HEAD", "POST", "PUT", "OPTIONS"},
    // Enable Debugging for testing, consider disabling in production
    Debug: true,
})

	// handler := c.Handler(router)
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