import React from 'react'
import { Form, FormGroup, Label, Input, Button } from 'reactstrap'

const JobValidation = ({updateJobTitle, updateProjectTitle, updateJobID, verifyJobInfo, jobValidated, generateJobID, jobID}) =>  {


  return (
    <div>
      <h5>Add Job Info <i>(Step 1 of 3)</i></h5>
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
    </div>
  )
}

JobValidation.propTypes = {

};

export default JobValidation;