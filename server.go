package main

import (
	"context"
	"flag"
	"log"
	"net/http"
	"os"
	"os/signal"
	"time"
	"github.com/gorilla/mux"
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
	logger.Println("Server is starting...")

	// ROUTES
	router := mux.NewRouter().StrictSlash(true)
	router.HandleFunc("/", indexHandler.Index).Methods("GET")
	router.HandleFunc("/calculate-job", jobCostingHandler.CalculateJob).Methods("POST")

	server := &http.Server{
		Addr:         listenAddr,
		Handler:      router,
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
	logger.Println("Server stopped")
}

func main() {
	runServer()
}