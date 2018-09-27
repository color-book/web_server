import React from 'react'
import { Form, FormGroup, Label, Input, Button } from 'reactstrap'

const LineItems = ({}) =>  {


  return (
    <div>
      <h6>Add Line Items</h6>
      <Form className="line-item-group">
        <FormGroup>
          <Label for="jobTitle">Line Item</Label>
          <Input type="text" name="jobTitle" id="jobTitle" onChange={() => {}} />
        </FormGroup>
        <FormGroup>
          <Label for="projectTitle">Description <i className="optional-label">(optional)</i></Label>
          <Input type="text" name="projectTitle" id="projectTitle" onChange={() => {}} />
        </FormGroup>
        <div className="line-item-hours-price">
          <FormGroup className="hours-price-items">
            <Label for="projectTitle">Hours</Label>
            <Input type="text" name="projectTitle" id="projectTitle" onChange={() => {}} />
          </FormGroup>
          <FormGroup className="hours-price-items">
            <Label for="projectTitle">Price</Label>
            <Input type="text" name="projectTitle" id="projectTitle" onChange={() => {}} />
          </FormGroup>
        </div>
      </Form>
      <Button size="sm" onClick={() => {}}>Add Another Item</Button>
    </div>
  )
}

LineItems.propTypes = {

};

export default LineItems;