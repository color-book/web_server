import React from 'react'
import Select from 'react-select';
import { Row, Col, Form, FormGroup, Label, Input, Button } from 'reactstrap'
import JobDetailInputContainer from '../container/jobDetailInputs'

const CreateAJob = ({updateJobTitle, updateProjectTitle, updateJobID, verifyJobInfo, jobValidated, generateJobID, jobID}) =>  {


  return (
    <div>
      <h5 className="create-job-title">Create a New Job</h5>

      <Form>
        <FormGroup>
          <Label for="jobTitle">Job Name</Label>
          <Input type="text" name="jobTitle" id="jobTitle" onChange={updateJobTitle} />
        </FormGroup>
        <FormGroup>
          <Label for="projectTitle">Project Name <i className="optional-label">(optional)</i></Label>
          <Input type="text" name="projectTitle" id="projectTitle" onChange={updateProjectTitle} />
        </FormGroup>
        <div className="job-id-well">
          <FormGroup>
            <Label for="jobID">Job ID</Label>
            <i className="job-id-text">Add an unique identification code for the Job. This can be a code you generate or one from a thrid-party, such as Estimate Rocket</i>
            <Input type="text" name="jobID" id="jobID" value={jobID} onChange={updateJobID} />
          </FormGroup>
          <span>Don't have a Job ID?</span><Button size="sm" className="generate-job-id-btn" onClick={generateJobID}>Generate One</Button>
        </div>
      </Form>
      {!jobValidated && <Button className="verify-btn" size="sm" onClick = {verifyJobInfo}>Verify and Continue</Button>}
      {jobValidated && <JobDetailInputContainer />}
    </div>
  )
}

CreateAJob.propTypes = {

};

export default CreateAJob;