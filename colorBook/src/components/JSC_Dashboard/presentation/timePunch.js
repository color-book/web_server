import React from 'react'
import Select from 'react-select';

const TimePunch = ({jobNames, selectedJob, updateSelectedJob}) =>  {

  let jobOptions = jobNames.map((job, index) => {
      return { value: job.uuid, label: job.name }
  })

  return (
    <div>
      <label>Select a Job</label>
      <Select
        value={selectedJob}
        onChange={updateSelectedJob}
        options={jobOptions}
        isSearchable={true}
        isClearable={true}
        placeholder=""
      />
    </div>
  )
}

TimePunch.propTypes = {

};

export default TimePunch;