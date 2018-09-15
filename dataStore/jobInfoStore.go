package dataStore

import (
	"log"
);

type InitialJobInfo struct {
	JobTitle string `json:"title"`
	ProjectTitle string `json:"projectTitle"`
	JobID string `json:"jobID"`
}

func (store *DBStore) GatherInitialJobInfo(initialJobInfo *InitialJobInfo) ([]*InitialJobInfo, error) {

	rows, err := store.DB.Query(`select * from jobs where 
		provided_job_id = $1 or title = $2 and project_title = $3;`, initialJobInfo.JobID,
		initialJobInfo.JobTitle, initialJobInfo.ProjectTitle)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	jobInfo := []*InitialJobInfo{}
	for rows.Next() {

		jobInfoItem := &InitialJobInfo{}

		err := rows.Scan(&jobInfoItem.JobID,
			&jobInfoItem.JobTitle, &jobInfoItem.ProjectTitle); 
		if err != nil {
			log.Fatal(err)
			return nil, err
		}

		jobInfo = append(jobInfo, jobInfoItem)
	}

	return jobInfo, nil
}