package jobCostingHandler

import (
	"fmt"
	"bytes"
	"net/http"
	"io/ioutil"
	"encoding/json"
)

type RequestCalcJobInfo struct {
	JobTotal int `json:"job_total"`
	DownPaymentPercentage float64 `json:"down_payment_percentage"`
	Materials []int `json:"materials"`
	CtSplit float64 `json:"ct_split"`
	SubSplit float64 `json:"sub_split"`
	LaborInfo []LaborInfo `json:"labor_info"`
}

type LaborInfo struct {
	Name string `json:"name"`
	Weight float64 `json:"weight"`
  Hours int `json:"hours"`
}

type ResponseJobCost struct {
	OverallCosts `json:"overall_costs"`
	PainterRates []PainterRates `json:"painter_rates"`
}

type OverallCosts struct {
	JobTotal float64 `json:"job_total"`
	DownPaymentPercentage float64 `json:"down_payment_percentage"`
	DownPayment float64 `json:"down_payment"`
	Materials []int `json:"materials"`
	MaterialsTotal int `json:"materials_total"`
	Labor float64 `json:"labor"`
	CtSplitPercentage float64 `json:"ct_split_percentage"`
	CtSplit float64 `json:"ct_split"`
	CtSplitFinalPayout float64 `json:"ct_split_final_payout"`
	SubSplitPercentage float64 `json:"sub_split_percentage"`
	SubSplit float64 `json:"sub_split`
}

type PainterRates struct {
	Name string `json:"name"`
	Weight float64 `json:"weight"`
	Hours float64 `json:"hours"`
	TotalHours float64 `json:"total_hours"`
	Payout float64 `json:"payout"`
	HourlyAverage float64 `json:"hourly_average"`
}


/*
		Calculate Job

		Desc: Sends Post request to Python Job Algorithm
					to calculate job values

		Returns: returns the json result

		TODO: Should maybe store result in database
*/
func CalculateJob(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/calculate-job" {
		http.Error(w, http.StatusText(http.StatusNotFound), http.StatusNotFound)
		return
	}
	var responseJobCost ResponseJobCost
	var requestCalcJobInfo RequestCalcJobInfo

	decoder := json.NewDecoder(r.Body)
	err := decoder.Decode(&requestCalcJobInfo)
	if err != nil {
		panic(err)
	}

	// Start Request to Job Costing Algo
	url := "http://localhost:5000/job-costing/v1/calculate-job"
	fmt.Println("Making Call to >>", url)

	request_data, err := json.Marshal(requestCalcJobInfo)
	var jsonStr = []byte(request_data)

	req, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonStr))
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
			panic(err)
	}
	defer resp.Body.Close()

	// Get Response Back from Job Costing Algo
	job_costing_body, _ := ioutil.ReadAll(resp.Body)
	unmarshalErr := json.Unmarshal(job_costing_body, &responseJobCost)
	if unmarshalErr != nil {
		w.Write([]byte("Response from Job Costing algorithm doesn't match expected pattern"))
		// TODO: Need to catch actual error and document it.
		return
	}

	fmt.Println("Completed Call to >>", url)

	// Send response back to front end
	w.Write([]byte(job_costing_body))
}
