package dataStore

import (
	"fmt"
	"log"

	"github.com/twinj/uuid"
)

type InitialJobInfo struct {
	JobTitle     string `json:"title"`
	ProjectTitle string `json:"projectTitle"`
	JobID        string `json:"jobID"`
}

type JobInfo struct {
	JobTitle              string `json:"title"`
	ProjectTitle          string `json:"projectTitle"`
	JobID                 string `json:"jobID"`
	ClientName            string `json:"clientName"`
	ClientPhoneNumber     string `json:"clientPhoneNumber"`
	ClientStreet          string `json:"clientStreet"`
	ClientCity            string `json:"clientCity"`
	ClientState           string `json:"clientState"`
	EstimatedTotalHours   string `json:"estimatedTotalHours"`
	EstimatedStartDate    string `json:"estimatedStartDate"`
	JobTotal              string `json:"jobTotal"`
	DownPaymentPercentage string `json:"downPaymentPercentage"`
	DownPaymentAmount     string `json:"downPaymentAmount"`
}

func (store *DBStore) GatherInitialJobInfo(initialJobInfo *InitialJobInfo) ([]*InitialJobInfo, error) {

	rows, err := store.DB.Query(`SELECT * FROM jobs WHERE
		provided_job_id = $1 OR title = $2 AND project_title = $3;`, initialJobInfo.JobID,
		initialJobInfo.JobTitle, initialJobInfo.ProjectTitle)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	jobInfo := []*InitialJobInfo{}
	for rows.Next() {

		jobInfoItem := &InitialJobInfo{}

		err := rows.Scan(&jobInfoItem.JobID,
			&jobInfoItem.JobTitle, &jobInfoItem.ProjectTitle)
		if err != nil {
			log.Fatal(err)
			return nil, err
		}

		jobInfo = append(jobInfo, jobInfoItem)
	}

	return jobInfo, nil
}

func (store *DBStore) CreateJob(jobInfo *JobInfo, userUUID string) (string, error) {

	// NewV4 generates a new RFC4122 version 4 UUID a cryptographically secure random UUID.
	uuid := uuid.NewV4()

	_, err := store.DB.Query(`INSERT INTO jobs (uuid, title, project_title, provided_job_id, estimated_total_hours,
		estimated_start_date, street_address, city, state, client_phone_number, client_name, down_payment_amount, 
		down_payment_percentage, total, created_by) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15);`, uuid, jobInfo.JobTitle,
		jobInfo.ProjectTitle, jobInfo.JobID, jobInfo.EstimatedTotalHours, jobInfo.EstimatedStartDate, jobInfo.ClientStreet,
		jobInfo.ClientCity, jobInfo.ClientState, jobInfo.ClientPhoneNumber, jobInfo.ClientName, jobInfo.DownPaymentAmount,
		jobInfo.DownPaymentPercentage, jobInfo.JobTotal, userUUID)

	addUserToJobError := addUserToJob_Helper(store, uuid, userUUID)

	if addUserToJobError != nil {
		panic(addUserToJobError)
	}

	return fmt.Sprintf("%v", uuid), err
}

/* ----------------- Helper Functions ------------------ */

// This will associate a user with a job
func addUserToJob_Helper(store *DBStore, jobUUID uuid.Uuid, userUUID string) error {

	uuid := uuid.NewV4()

	_, err := store.DB.Query(`INSERT INTO users_to_job (uuid, user_uuid, job_uuid) VALUES ($1,$2,$3);`,
		uuid, userUUID, jobUUID)

	return err

}
