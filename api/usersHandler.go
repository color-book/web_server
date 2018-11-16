package api

import (
	"encoding/json"
	"net/http"

	"github.com/color-book/web_server/dataStore"
)

type GatherUsersResponse struct {
	Success      bool                    `json:"success"`
	ErrorMessage string                  `json:"errorMessage"`
	Users        []*dataStore.UserPublic `json:"users"`
}

/*
* GET
*
* GATHER USERS FUNCTION
 */
func GatherUsers(w http.ResponseWriter, r *http.Request) {
	users, err := dataStore.Store.GetUsers()
	if err != nil {
		json.NewEncoder(w).Encode(GenericResponse{Success: false, ErrorMessage: "An Error Occurred while gathering users"})
		panic(err)
	} else {
		json.NewEncoder(w).Encode(GatherUsersResponse{Success: true, ErrorMessage: "", Users: users})
	}

}
