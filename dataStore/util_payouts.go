package dataStore

type CurrentUserPayoutRawData struct {
	JobUUID                      string
	JobTitle                     string
	ProjectTitle                 string
	JobTotal                     float64
	SubContractorSplitPercentage float64
	EstimatedTotalHours          int64
	TotalHoursWorked             int64
	TotalMaterialsCost           float64
	UserDefaultWeight            float64
	UsersTotalHoursWorked        int64
}

type CurrentUserPayout struct {
	UserHourlyRate float64
	UserPayout     float64
}

/*
* GET USER'S CURRENT PAYOUT
*
* TODO: Make this real-time. Currently it's not at all - the user has to clock out of a job to see
* what their current payout is.
*
* This payout should be:
* 		Initial Cut = ((Job Total - Materials) * Sub Split / Total Job Hours) * Painter's Share Weight
*     Current Cut = User's clocked hours * Initial Cut
*
*	Also note:
* 		Materials = the estimated materials if actual materials < estimated materials else actual materials
*			Total Job Hours = the estimated job hours if actual hours < esitmated hours else actual hours
*
 */
func getUserCurrentPayout(store *DBStore, jobUUID string, userUUID string) (*CurrentUserPayout, error) {
	rows, err := store.DB.Query(`
		WITH total_hours AS (
			SELECT SUM(total_time) AS total_hours_worked, job_uuid
			FROM users_to_time_history
			WHERE job_uuid = $1
		),
		users_total_hours AS (
			SELECT SUM(total_time) AS users_total_hours_worked, job_uuid
			FROM users_to_time_history
			WHERE job_uuid = $2 AND user_uuid = $3
		),
		materials_cost AS (
			SELECT SUM(material_price) AS total_materials_cost, job_uuid
			FROM users_to_job_to_materials
			WHERE job_uuid = $4
		),
		users_weight AS (
			SELECT user_weight, job_uuid
			FROM users_to_job
			WHERE job_uuid = $5 and user_uuid = $6
		)
		SELECT jobs.uuid, jobs.title, jobs.project_title, jobs.total,
			jobs.sub_contractor_split_percentage, jobs.estimated_total_hours,
			total_hours.total_hours_worked, materials_cost.total_materials_cost,
			users_to_job.user_weight, users_total_hours.users_total_hours_worked
		FROM jobs
		LEFT JOIN total_hours ON jobs.uuid = total_hours.job_uuid
		LEFT JOIN users_total_hours ON jobs.uuid = users_total_hours.job_uuid
		LEFT JOIN materials_cost ON jobs.uuid = materials_cost.job_uuid
		LEFT JOIN users_weight ON jobs.uuid = users_weight.job_uuid
		WHERE jobs.uuid = $7`, jobUUID, jobUUID, userUUID, jobUUID, jobUUID, userUUID, jobUUID)

	if err != nil {
		return nil, err
	}

	defer rows.Close()

	rawData := &CurrentUserPayoutRawData{}
	payoutInfo := &CurrentUserPayout{}

	err = rows.Scan(&rawData.JobUUID, &rawData.JobTitle, &rawData.ProjectTitle, &rawData.JobTotal,
		&rawData.SubContractorSplitPercentage, &rawData.EstimatedTotalHours, &rawData.TotalHoursWorked,
		&rawData.TotalMaterialsCost, &rawData.UserDefaultWeight, &rawData.UsersTotalHoursWorked)
	if err != nil {
		panic(err)
		return nil, err
	}

	var initialCut = ((rawData.JobTotal - rawData.TotalMaterialsCost) * rawData.SubContractorSplitPercentage / float64(rawData.TotalHoursWorked)) * rawData.UserDefaultWeight

	payoutInfo.UserPayout = float64(rawData.UsersTotalHoursWorked) * initialCut
	payoutInfo.UserHourlyRate = initialCut

	return payoutInfo, nil

}

func getHourlyPayRating(payRate float64) string {
	if payRate > 25 {
		return "Great"
	} else if payRate > 15 && payRate < 25 {
		return "Average"
	} else if payRate < 15 {
		return "Poor"
	}
	return "Cannot Access Pay Rate"
}
