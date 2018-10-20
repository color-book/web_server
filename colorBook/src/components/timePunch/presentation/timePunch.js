import React from 'react'
import Select from 'react-select';
import { Row, Col, Label, Input, Button } from 'reactstrap'

const TimePunch = ({jobOptions, selectedJob, updateSelectedJob, redirect, redirectPath}) =>  {

  if (redirect) window.location.href = redirectPath

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

      <Row>
        <Label>Payout</Label>
        <span>$500</span>
      </Row>

      <Row>
        <Col xs="6">
          <Label>My Hours</Label>
          <span>25</span>
        </Col>
        <Col xs="6">
          <Label>Team Hours</Label>
          <span>70/75</span>
        </Col>
      </Row>
      
    </div>
  )
}

TimePunch.propTypes = {

};

export default TimePunch;