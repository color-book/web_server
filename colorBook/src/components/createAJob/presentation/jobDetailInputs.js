import React from 'react'
import PropTypes from 'prop-types'
import { Form, FormGroup, Label, Input, Button } from 'reactstrap'
// import DatePicker from 'react-datepicker';
import moment from 'moment';

// import 'react-datepicker/dist/react-datepicker.css';

import 'react-dates/initialize';
import { SingleDatePicker } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';

const JobDetailInputs = (props) =>  {

  return (
    <div className="detail-inputs-main">
      <span className="detail-inputs-looks-good-msg">Looks good so far!</span>
      <Form className="detail-inputs-form">
        <div className="client-info-well">
          <Label>Client Information</Label>
          <FormGroup>
            <Label for="clientName">Name</Label>
            <Input type="text" name="clientName" id="clientName" onChange={props.updateClientName} />
          </FormGroup>
          <FormGroup>
            <Label for="clientPhoneNumber">Phone Number</Label>
            <Input type="text" name="clientPhoneNumber" id="clientPhoneNumber" onChange={props.updateClientPhoneNumber} />
          </FormGroup>
          <FormGroup>
            <Label for="clientStreet">Street Address</Label>
            <Input type="text" name="clientStreet" id="clientStreet" onChange={props.updateClientStreet} />
          </FormGroup>
          <FormGroup>
            <Label for="clientCity">City</Label>
            <Input type="text" name="clientCity" id="clientCity" onChange={props.updateClientCity} />
          </FormGroup>
          <FormGroup>
            <Label for="clientState">State</Label>
            <Input type="text" name="clientState" id="clientState" onChange={props.updateClientState} />
          </FormGroup>
        </div>
        <FormGroup>
          <Label for="estimatedTotalHours" className="start-date-label">Estimated Start Date</Label>
          <SingleDatePicker
            date={props.estimatedStartDate}
            onDateChange={props.updateEstimatedStartDate}
            focused={props.estimatedStartDateFocused}
            onFocusChange={props.focusStartDate}
            id="start-date-picker"
            orientation="vertical"
            numberOfMonths={1}
            placeholder="Select a Date"
            block={true}
          />
        </FormGroup>
        <FormGroup>
          <Label for="estimatedTotalHours">Estimated Total Hours</Label>
          <Input type="text" name="estimatedTotalHours" id="estimatedTotalHours" onChange={props.updateEstimatedTotalHours} />
        </FormGroup>
        <FormGroup>
          <Label for="jobTotal">Job Total</Label>
          <Input type="text" name="jobTotal" id="jobTotal" onChange={props.updateJobTotal} />
        </FormGroup>
        <FormGroup>
          <Label for="downPaymentPercentage">Down Payment Percentage</Label>
          <Input type="text" name="downPaymentPercentage" id="downPaymentPercentage" onChange={props.updateDownPaymentPercentage} />
        </FormGroup>
        <FormGroup>
          <Label for="downPaymentAmount">Down Payment Amount</Label>
          <Input type="text" name="downPaymentAmount" id="downPaymentAmount" onChange={props.updateDownPaymentAmount} />
        </FormGroup>
      </Form>
      <Button className="verify-btn" size="sm" onClick={props.createJob}>Create Job</Button>
    </div>
  )
}

JobDetailInputs.propTypes = {
};

export default JobDetailInputs;