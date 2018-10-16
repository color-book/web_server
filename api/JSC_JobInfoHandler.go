package api

import (
	"encoding/json"
	"net/http"

	"github.com/twinj/uuid"

	"github.com/color-book/web_server/dataStore"
	"github.com/color-book/web_server/sessionStore"
)

type GenericResponse struct {
	Success      bool   `json:"success"`
	ErrorMessage string `json:"errorMessage"`
}

type CreateJobValidationResponse struct {
	Success      bool   `json:"success"`
	ErrorMessage string `json:"errorMessage"`
	JobValidated bool   `json:"jobValidated"`
}

type CreateGenerateJobIDResponse struct {
	Success        bool      `json:"success"`
	ErrorMessage   string    `json:"errorMessage"`
	GeneratedJobID uuid.Uuid `json:"generatedJobID"`
}

type CreateNewJobResponse struct {
	Success      bool   `json:"success"`
	ErrorMessage string `json:"errorMessage"`
	NewJobUUID   string `json:"newJobUUID"`
}

type GatherUsersResponse struct {
	Success      bool                    `json:"success"`
	ErrorMessage string                  `json:"errorMessage"`
	Users        []*dataStore.UserPublic `json:"users"`
}

/*
* POST
*
* VERIFY JOB TITLE AND ID FUNCTION
 */
func VerifyJobTitleAndID(w http.ResponseWriter, r *http.Request) {

	var initialJobInfo dataStore.InitialJobInfo

	err := json.NewDecoder(r.Body).Decode(&initialJobInfo)
	if err != nil {
		panic(err)
	}

	jobInfo, err := dataStore.Store.GatherInitialJobInfo(&initialJobInfo)

	if len(jobInfo) == 0 {
		json.NewEncoder(w).Encode(CreateJobValidationResponse{Success: true, ErrorMessage: "", JobValidated: true})
	} else {
		println(jobInfo)
		json.NewEncoder(w).Encode(CreateJobValidationResponse{Success: false, ErrorMessage: "", JobValidated: false})
	}

}

/*
* GET
*
* GENERATE JOB ID FUNCTION
 */
func GenerateJobID(w http.ResponseWriter, r *http.Request) {

	uuid := uuid.NewV4()

	json.NewEncoder(w).Encode(CreateGenerateJobIDResponse{Success: true, ErrorMessage: "", GeneratedJobID: uuid})
}

/*
* POST
*
* CREATE NEW JOB FUNCTION
 */
func CreateNewJob(w http.ResponseWriter, r *http.Request) {

	var jobInfo dataStore.JobInfo

	userUUID, ok := sessionStore.GetSessionValue(w, r, "user_uuid")
	if !ok {
		http.Redirect(w, r, "/login", http.StatusSeeOther)
	}

	err := json.NewDecoder(r.Body).Decode(&jobInfo)
	if err != nil {
		panic(err)
	}

	newJobUUID, err := dataStore.Store.CreateJob(&jobInfo, userUUID)
	if err != nil {
		json.NewEncoder(w).Encode(CreateNewJobResponse{Success: false, ErrorMessage: "An Error Occurred while creating a new job", NewJobUUID: ""})
		panic(err)
	} else {
		json.NewEncoder(w).Encode(CreateNewJobResponse{Success: true, ErrorMessage: "", NewJobUUID: newJobUUID})
	}

}

/*
* POST
*
* SAVE LINE ITEMS FUNCTION
 */
func SaveLineItems(w http.ResponseWriter, r *http.Request) {

	var lineItems dataStore.LineItems
	var err error = nil

	err = json.NewDecoder(r.Body).Decode(&lineItems)
	if err != nil {
		panic(err)
	}

	for index := 0; index < len(lineItems.LineItems); index++ {
		err = dataStore.Store.AddLineItem(&lineItems.LineItems[index])
	}

	if err != nil {
		json.NewEncoder(w).Encode(GenericResponse{Success: false, ErrorMessage: "An Error Occurred while adding line items"})
		panic(err)
	} else {
		json.NewEncoder(w).Encode(GenericResponse{Success: true, ErrorMessage: ""})
	}
}

/*
* GET
*
* GATHER USERS FUNCTION
 */
func GatherUsers(w http.ResponseWriter, r *http.Request) {
	users, err := dataStore.Store.GetUsers()
	if err != nil {
		json.NewEncoder(w).Encode(GenericResponse{Success: false, ErrorMessage: "An Error Occurred while adding line items"})
		panic(err)
	} else {
		json.NewEncoder(w).Encode(GatherUsersResponse{Success: true, ErrorMessage: "", Users: users})
	}

}

/*
* POST
*
* ADD USERS TO JOB
 */
func AddUsersToJob(w http.ResponseWriter, r *http.Request) {

	var usersToJob dataStore.UsersToJob
	var err error = nil

	err = json.NewDecoder(r.Body).Decode(&usersToJob)
	if err != nil {
		panic(err)
	}

	for index := 0; index < len(usersToJob.UsersToJob); index++ {
		println(&usersToJob.UsersToJob[index])
		err = dataStore.Store.AddUserToJob(&usersToJob.UsersToJob[index])
	}

	if err != nil {
		json.NewEncoder(w).Encode(GenericResponse{Success: false, ErrorMessage: "An Error Occurred while adding line items"})
		panic(err)
	} else {
		json.NewEncoder(w).Encode(GenericResponse{Success: true, ErrorMessage: ""})
	}

}
