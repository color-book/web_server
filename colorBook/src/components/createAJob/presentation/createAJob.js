import React from 'react'
import PropTypes from 'prop-types';

import JobDetailInputContainer from '../container/jobDetailInputs'
import JobValidationContainer from '../container/jobValidation'
import LineItemsContainer from '../container/lineItems'

const CreateAJob = ({jobValidated, jobCreated}) =>  {

  let pageComponents = <p>Hmm someting went wrong... Please try again</p>

  if (!jobCreated) {
    pageComponents = <div>
      <JobValidationContainer />
      {jobValidated && <JobDetailInputContainer />}
    </div>
  } else {
    pageComponents = <div>
      <LineItemsContainer />
    </div>
  }

  return (
    <div>
      <h5 className="create-job-title">Create a New Job</h5>
        {pageComponents}
    </div>
  )
}

CreateAJob.propTypes = {
  jobValidated: PropTypes.bool.isRequired,
  jobCreated: PropTypes.bool.isRequired
};

export default CreateAJob;