package handlers

import (
	"net/http"
	"encoding/json"
	"fmt"

	"github.com/color-book/web_server/dataStore"
)

func Register(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/register" {
		http.Error(w, http.StatusText(http.StatusNotFound), http.StatusNotFound)
		return
	}

	var userInfo dataStore.User

	decoder := json.NewDecoder(r.Body)
	err := decoder.Decode(&userInfo)
	if err != nil {
		panic(err)
	}

	request_data, err := json.Marshal(userInfo)
	if err != nil {
		panic(err)
	}

	println(request_data)

	err = dataStore.Store.CreateUser(&userInfo)
	if err != nil {
		panic(err)
	}


	w.Header().Set("Content-Type", "text/plain; charset=utf-8")
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Hello, World!"))
}


func GetPositions(w http.ResponseWriter, r *http.Request) {
	positions, err := dataStore.Store.GetPositions()

	// Everything else is the same as before
	positionListBytes, err := json.Marshal(positions)

	if err != nil {
		fmt.Println(fmt.Errorf("Error: %v", err))
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	w.Write(positionListBytes)
}