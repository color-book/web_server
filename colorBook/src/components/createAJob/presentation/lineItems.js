import React from 'react'
import { Form, FormGroup, Label, Input, Button } from 'reactstrap'

const LineItems = ({lineItems, addNewLineItem, updateLineItem, removeLineItem, saveLineItems}) =>  {

  let lineItemElements;

  lineItemElements = lineItems.map((item, index) => {
    return <Form key={index} className="line-item-group">
      <div className="line-item-header">
        <h5>Line Item</h5><Button size="sm" className="delete-line-item" onClick={() => {removeLineItem(index)}}>X</Button>
      </div>
      <FormGroup>
        <Label for="item">Item</Label>
        <Input type="text" name="item" id="item" onChange={updateLineItem('item', index)} value={item.item} />
      </FormGroup>
      <FormGroup>
        <Label for="description">Description <i className="optional-label">(optional)</i></Label>
        <Input type="text" name="description" id="description" onChange={updateLineItem('description', index)} value={item.description} />
      </FormGroup>
      <div className="line-item-hours-price">
        <FormGroup className="hours-price-items">
          <Label for="hours">Hours</Label>
          <Input type="text" name="hours" id="hours" onChange={updateLineItem('hours', index)} value={item.hours} />
        </FormGroup>
        <FormGroup className="hours-price-items">
          <Label for="price">Price</Label>
          <Input type="text" name="price" id="price" onChange={updateLineItem('price', index)} value={item.price} />
        </FormGroup>
      </div>
    </Form>
  })

  return (
    <div>
      <h5>Add Line Items <i>(Step 2 of 3)</i></h5>
      {lineItemElements}
      <Button className="margin-top-20" size="sm" onClick={addNewLineItem}>Add Another Item</Button>
      <Button className="margin-top-20 verify-btn" size="sm" onClick={saveLineItems}>Save Line Items and Continue</Button>
    </div>
  )
}

LineItems.propTypes = {

};

export default LineItems;