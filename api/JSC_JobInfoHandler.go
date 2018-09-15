package api

import (
	"net/http"
	"encoding/json"

	"github.com/twinj/uuid"

	"github.com/color-book/web_server/dataStore"
)

type CreateJobValidationResponse struct {
	Success bool `json:"success"`
	ErrorMessage string `json:"errorMessage"`
	JobValidated bool `json:"jobValidated"`
}

type CreateGenerateJobIDResponse struct {
	Success bool `json:"success"`
	ErrorMessage string `json:"errorMessage"`
	GeneratedJobID uuid.Uuid `json:"generatedJobID"`
}

func VerifyJobTitleAndID(w http.ResponseWriter, r *http.Request) {

	var initialJobInfo dataStore.InitialJobInfo

	err := json.NewDecoder(r.Body).Decode(&initialJobInfo)
	if err != nil {
		panic(err)
	}

	jobInfo, err := dataStore.Store.GatherInitialJobInfo(&initialJobInfo)

	if (len(jobInfo) == 0) {
		json.NewEncoder(w).Encode(CreateJobValidationResponse{Success: true, ErrorMessage: "", JobValidated: true})
	}

}

func GenerateJobID(w http.ResponseWriter, r *http.Request) {

	uuid := uuid.NewV4()

	json.NewEncoder(w).Encode(CreateGenerateJobIDResponse{Success: true, ErrorMessage: "", GeneratedJobID: uuid})
}

