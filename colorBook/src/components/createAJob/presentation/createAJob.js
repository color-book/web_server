import React from 'react'
import PropTypes from 'prop-types';

import JobDetailInputContainer from '../container/jobDetailInputs'
import JobValidationContainer from '../container/jobValidation'
import LineItemsContainer from '../container/lineItems'
import AddUsers from '../container/addUsers'

const CreateAJob = ({jobValidated, jobCreated, lineItemsCompleted, usersAdded}) =>  {

  let pageComponents = <p>Hmm someting went wrong... Please try again</p>

  if (jobCreated && lineItemsCompleted && usersAdded) {
    pageComponents = <p></p>
    window.location.href = '/dashboard'
  } else if (jobCreated && lineItemsCompleted) {
    pageComponents = <AddUsers />
  } else if (jobCreated && !lineItemsCompleted) {
    pageComponents = <LineItemsContainer />
  } else {
    pageComponents = <div>
      <JobValidationContainer />
      {jobValidated && <JobDetailInputContainer />}
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
  jobCreated: PropTypes.bool.isRequired,
  lineItemsCompleted: PropTypes.bool.isRequired
};

export default CreateAJob;