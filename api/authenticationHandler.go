package api

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/dgrijalva/jwt-go"
	"golang.org/x/crypto/bcrypt"

	"github.com/color-book/web_server/configVars"
	"github.com/color-book/web_server/dataStore"
	"github.com/color-book/web_server/sessionStore"
)

type JwtTokenResponse struct {
	Token        string `json:"token"`
	Sucess       bool   `json:"success"`
	ErrorMessage string `json:"errorMessage"`
}

/*
*
* REGISTER USER FUNCTION
 */
func Register(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/api/register" {
		http.Error(w, http.StatusText(http.StatusNotFound), http.StatusNotFound)
		return
	}

	var userInfo dataStore.User

	decoder := json.NewDecoder(r.Body)
	err := decoder.Decode(&userInfo)
	if err != nil {
		panic(err)
	}

	if len(userInfo.Password) > 0 {
		passwordByte := []byte(userInfo.Password)
		userInfo.Password = hashAndSalt(passwordByte)
	}

	successfullyCreated := true
	err = dataStore.Store.CreateUser(&userInfo)
	if err != nil {
		successfullyCreated = false
		panic(err)
	}

	w.Header().Set("Content-Type", "text/plain; charset=utf-8")
	w.WriteHeader(http.StatusOK)
	if successfullyCreated {
		w.Write([]byte(`{"success": "true"}`))
	} else {
		w.Write([]byte(`{"success": "false"}`))
	}
}

/*
*
* LOGIN FUNCTION
 */
func Login(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/api/login" {
		http.Error(w, http.StatusText(http.StatusNotFound), http.StatusNotFound)
		return
	}

	var userInfo dataStore.User

	err := json.NewDecoder(r.Body).Decode(&userInfo)
	if err != nil {
		panic(err)
	}

	users, err := dataStore.Store.GetUserByEmail(userInfo.Email)
	if err != nil {
		fmt.Println(fmt.Errorf("Error: %v", err))
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(fmt.Sprintf(`{"success": "false", "message": %v}`, err)))
		return
	}

	if len(users) > 0 {

		// Compare passwords
		pwdMatch := comparePasswords(users[0].Password, userInfo.Password)

		if pwdMatch {

			token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
				"uuid": users[0].UUID,
			})
			tokenString, error := token.SignedString([]byte(configVars.Config.JWT_TOKEN_SECRET))
			if error != nil {
				fmt.Println(error)
			}
			sessionStore.SetSessionValue(w, r, "user_uuid", *users[0].UUID)
			sessionStore.SetSessionValue(w, r, "user_token_string", tokenString)
			json.NewEncoder(w).Encode(JwtTokenResponse{Token: tokenString, Sucess: true, ErrorMessage: ""})
		} else {
			json.NewEncoder(w).Encode(JwtTokenResponse{Token: "", Sucess: false, ErrorMessage: "Incorrect Password"})
		}
	} else {
		json.NewEncoder(w).Encode(JwtTokenResponse{Token: "", Sucess: false, ErrorMessage: "A user with that email doesn't exist"})
	}

}

/*
*
* LOGOUT FUNCTION
 */
func Logout(w http.ResponseWriter, r *http.Request) {
	sessionStore.SetSessionValue(w, r, "user_token_string", "")
	json.NewEncoder(w).Encode(JwtTokenResponse{Token: "", Sucess: true, ErrorMessage: ""})
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

/* ----------------- PASSWORD HASHING ------------------ */

func hashAndSalt(pwd []byte) string {

	// Use GenerateFromPassword to hash & salt pwd
	// MinCost is just an integer constant provided by the bcrypt
	// package along with DefaultCost & MaxCost.
	// The cost can be any value you want provided it isn't lower
	// than the MinCost (4)
	hash, err := bcrypt.GenerateFromPassword(pwd, bcrypt.MinCost)
	if err != nil {
		log.Println(err)
	}
	// GenerateFromPassword returns a byte slice so we need to
	// convert the bytes to a string and return it
	return string(hash)
}

func comparePasswords(hashedPwd string, plainPwd string) bool {
	// Since we'll be getting the hashed password from the DB it
	// will be a string so we'll need to convert it to a byte slice
	byteHash := []byte(hashedPwd)
	bytePlainPwd := []byte(plainPwd)
	err := bcrypt.CompareHashAndPassword(byteHash, bytePlainPwd)
	if err != nil {
		log.Println(err)
		return false
	}

	return true
}
