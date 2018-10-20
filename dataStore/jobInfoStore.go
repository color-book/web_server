package dataStore

import (
	"database/sql"
	"fmt"
	"log"
	"time"

	"github.com/twinj/uuid"
)

type InitialJobInfo struct {
	JobTitle     string `json:"title"`
	ProjectTitle string `json:"projectTitle"`
	JobID        string `json:"jobID"`
}

type NewJobInfo struct {
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

type JobTitles struct {
	JobTitle     string `json:"title"`
	JobUUID      string `json:"uuid"`
	ProjectTitle string `json:"project_title"`
}

type LineItems struct {
	LineItems []LineItem `json:"lineItems"`
}

type LineItem struct {
	Item        string `json:"item"`
	JobUUID     string `json:"jobUUID"`
	Description string `json:"description"`
	Hours       string `json:"hours"`
	Price       string `json:"price"`
}

type UsersToJob struct {
	UsersToJob []UserToJob `json:"usersToJob"`
}

type UserToJob struct {
	JobUUID  string `json:"jobUUID"`
	UserUUID string `json:"uuid"`
	Name     string `json:"name"`
}

type JobSplits struct {
	JobUUID            string `json:"jobUUID"`
	ContractorSplit    string `json:"contractorSplit"`
	SubContractorSplit string `json:"subContractorSplit"`
}

type JobClockInInfo struct {
	JobUUID             string     `json:"jobUUID"`
	JobTitle            string     `json:"jobTitle"`
	ProjectTitle        string     `json:"projectTitle"`
	ClockInTime         *time.Time `json:"clockInTime"`
	CurrentUserMinutes  float64    `json:"currentUserMinutes"`
	CurrentTeamMinutes  float64    `json:"currentTeamMinutes"`
	EstimatedTotalHours float64    `json:"estimatedTotalHours"`
}

type JobTimePunchInfo struct {
	JobUUID             string  `json:"jobUUID"`
	JobTitle            string  `json:"jobTitle"`
	ProjectTitle        string  `json:"projectTitle"`
	CurrentUserMinutes  float64 `json:"currentUserMinutes"`
	CurrentTeamMinutes  float64 `json:"currentTeamMinutes"`
	EstimatedTotalHours float64 `json:"estimatedTotalHours"`
}

/*
*
* GATHER JOB INFO FROM PROVIDED ID, TITLE, PROJECT TITLE
 */
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

/*
*
* CREATE A JOB
 */
func (store *DBStore) CreateJob(jobInfo *NewJobInfo, userUUID string) (string, error) {

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

/*
*
* ADD LINE ITEMS
 */
func (store *DBStore) AddLineItem(lineItem *LineItem) error {

	_, err := store.DB.Query(`INSERT INTO job_line_item (job_uuid, item, description, hours, price) values ($1,$2,$3,$4,$5)`,
		lineItem.JobUUID, lineItem.Item, lineItem.Description, lineItem.Hours, lineItem.Price)

	return err
}

/*
*
* Add User To Job
 */
func (store *DBStore) AddUserToJob(userToJob *UserToJob) error {

	jobUUID, err := uuid.Parse(userToJob.JobUUID)
	if err != nil {
		return err
	}

	err = addUserToJob_Helper(store, jobUUID, userToJob.UserUUID)

	return err
}

/*
*
* Update Job Splits
 */
func (store *DBStore) UpdateJobSplits(jobSplits *JobSplits) error {

	_, err := store.DB.Query(`UPDATE jobs SET contractor_split_percentage = $1 AND sub_contractor_split_percentage = $2 
														WHERE uuid = $3`, jobSplits.ContractorSplit, jobSplits.SubContractorSplit, jobSplits.JobUUID)

	return err
}

/*
*
* Get Job Title, Project Title, and UUID of Job
 */
func (store *DBStore) GetJobTitles() ([]*JobTitles, error) {

	rows, err := store.DB.Query(`SELECT title, project_title, uuid FROM jobs`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	jobs := []*JobTitles{}

	for rows.Next() {
		job := &JobTitles{}

		err := rows.Scan(&job.JobTitle, &job.ProjectTitle, &job.JobUUID)
		if err != nil {
			panic(err)
			// return nil, err
		}

		jobs = append(jobs, job)
	}

	return jobs, nil
}

/*
*
* Returns JobClockInInfo by Job UUID
 */
func (store *DBStore) GetClockedInJobByJobUUID(uuid string) ([]*JobClockInInfo, error) {
	rows, err := store.DB.Query(`SELECT users_clocked_in.job_uuid, users_to_job.user_current_job_hours, jobs.actual_total_hours, 
															jobs.estimated_total_hours, jobs.title, jobs.project_title 
															FROM jobs
															JOIN users_to_job ON users_to_job.job_uuid = jobs.uuid
															JOIN users_clocked_in ON users_clocked_in.job_uuid = jobs.uuid
															WHERE users_clocked_in.job_uuid = $1`, uuid)
	if err != nil {
		return nil, err
	}

	clockedInJobInfo, err := formatClockInJobQuery_Helper(rows)
	if err != nil {
		return nil, err
	}

	return clockedInJobInfo, nil
}

/*
*
* Returns JobClockInInfo by User UUID
 */
func (store *DBStore) GetClockedInJobByUserUUID(uuid string) ([]*JobClockInInfo, error) {
	rows, err := store.DB.Query(`SELECT users_clocked_in.job_uuid, users_to_job.user_current_job_hours, jobs.actual_total_hours, 
															jobs.estimated_total_hours, jobs.title, jobs.project_title 
															FROM jobs
															JOIN users_to_job ON users_to_job.job_uuid = jobs.uuid
															JOIN users_clocked_in ON users_clocked_in.job_uuid = jobs.uuid
															WHERE users_clocked_in.user_uuid = $1`, uuid)
	if err != nil {
		return nil, err
	}

	clockedInJobInfo, err := formatClockInJobQuery_Helper(rows)
	if err != nil {
		return nil, err
	}

	return clockedInJobInfo, nil

}

// func (store *DBStore) GetTimePunchJobInfoByJobUUID(uuid string) ([]*JobTimePunchInfo, error) {

// }

/* ----------------- Helper Functions ------------------ */

// This will associate a user with a job
func addUserToJob_Helper(store *DBStore, jobUUID uuid.Uuid, userUUID string) error {

	uuid := uuid.NewV4()

	_, err := store.DB.Query(`INSERT INTO users_to_job (uuid, user_uuid, job_uuid, user_weight, user_rental_fee, user_in_training, user_revenue_bonus) 
		(SELECT $1,$2,$3, user_default_weight, user_default_rental_fee, user_default_in_training, user_default_revenue_bonus
			FROM user_default_work_info WHERE user_uuid = $4);`,
		uuid, userUUID, jobUUID, userUUID)

	return err

}

func formatClockInJobQuery_Helper(rows *sql.Rows) ([]*JobClockInInfo, error) {
	defer rows.Close()

	jobs := []*JobClockInInfo{}

	for rows.Next() {
		job := &JobClockInInfo{}

		err := rows.Scan(&job.JobUUID, &job.CurrentUserMinutes, &job.CurrentTeamMinutes,
			&job.EstimatedTotalHours, &job.JobTitle, &job.ProjectTitle)
		if err != nil {
			panic(err)
			// return nil, err
		}

		jobs = append(jobs, job)
	}

	return jobs, nil
}
