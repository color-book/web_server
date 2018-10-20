package api

import (
	"encoding/json"
	"net/http"

	"github.com/color-book/web_server/dataStore"
	"github.com/color-book/web_server/sessionStore"
	"github.com/gorilla/mux"
	// "github.com/gorilla/mux"
)

type GatherClockInJobInfoResponse struct {
	Success          bool                        `json:"success"`
	ErrorMessage     string                      `json:"errorMessage"`
	ClockedInJobInfo []*dataStore.JobClockInInfo `json:"clockedInJobInfo"`
}

/*
* GET
*
* GATHER JOB TITLES FUNCTION
*
* This will:
*  1) Check for the clocked in job uuid in the session. It will use that to get the job info
*  2) If that doesn't exist, then it will search the clocked in job table in the database using the user's uuid
*  3) If that isn't the case, then it will return a list of jobs
 */
func GatherClockedInJob(w http.ResponseWriter, r *http.Request) {
	var jobInfo = []*dataStore.JobClockInInfo{}
	var err error = nil
	clockedInJobUUID, ok := sessionStore.GetSessionValue(w, r, "clocked_in_job_uuid")

	if len(clockedInJobUUID) > 0 {
		// look up job info
		jobInfo, err = dataStore.Store.GetClockedInJobByJobUUID(clockedInJobUUID)
	} else if !ok {
		// check in clocked_in_job table
		userUUID, ok := sessionStore.GetSessionValue(w, r, "user_uuid")
		if !ok {
			// User technically isn't logged in.
			json.NewEncoder(w).Encode(GenericRedirectResponse{Success: false, ErrorMessage: "User Is Not Logged in", Redirect: "/login"})
			return
		}

		jobInfo, err = dataStore.Store.GetClockedInJobByUserUUID(userUUID)
	}

	// If Job Info is populated, send that. Otherwise, return the list of job titles
	if len(jobInfo) > 0 {
		if err != nil {
			json.NewEncoder(w).Encode(GenericResponse{Success: false, ErrorMessage: "An Error Occurred while gathering clocked in job"})
			return
		} else {
			json.NewEncoder(w).Encode(GatherClockInJobInfoResponse{Success: true, ErrorMessage: "", ClockedInJobInfo: jobInfo})
		}

	} else {

		jobTitles, err := dataStore.Store.GetJobTitles()
		if err != nil {
			json.NewEncoder(w).Encode(GenericResponse{Success: false, ErrorMessage: "An Error Occurred while gathering job titles"})
			panic(err)
		}

		json.NewEncoder(w).Encode(GatherJobTitlesResponse{Success: true, ErrorMessage: "", JobTitles: jobTitles})
		return
	}

}

/*
* GET
*
* Gathers Job Info for Time Punch
 */
func GatherTimePunchJobInfo(w http.ResponseWriter, r *http.Request) {
	jobUUID := mux.Vars(r)["jobUUID"]
	println(jobUUID)

	// jobInfo, err = dataStore.Store.GetTimePunchJobInfoByJobUUID(jobUUID)

}
