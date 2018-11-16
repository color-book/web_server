import React from 'react'
import { Form, FormGroup, Label, Input, Button } from 'reactstrap'
import Select from 'react-select';

const AddUsers = ({users, addUsersToJob, selectedUsers, updateSelectedUsers, quickAddSplit, subContractorSplit, contractorSplit, updateSubContractorSplit, updateContractorSplit}) =>  {

  let userOptions = users.map((user, index) => {
    return { value: user.uuid, label: user.name }
  })

  return (
    <div>
      <h5>Add Users <i>(Step 3 of 3)</i></h5>
      <Select
        isMulti={true}
        value={selectedUsers}
        onChange={updateSelectedUsers}
        options={userOptions}
        isSearchable={true}
        isClearable={true}
        placeholder=""
      />

      <div className="simple-well">
          <h5>Add Split Percentages</h5>
          <i className="job-id-text">Percentages must equal 100%. These percentages can be changed later</i>
          <div className="job-id-well margin-bottom-10">
            <p>Quick Add Percentages:</p> 
            <Button className="margin-right-5" size="sm" onClick={() => {quickAddSplit({contractor: 50, sub: 50})}}>50/50</Button>
            <Button size="sm" onClick={() => {quickAddSplit({contractor: 40, sub: 60})}}>60/40</Button>
          </div>
          <FormGroup>
            <Label for="clientName">Sub Contractor's Split</Label>
            <Input type="text" name="clientName" id="clientName" onChange={updateSubContractorSplit} value={subContractorSplit} />
          </FormGroup>
          <FormGroup>
            <Label for="clientPhoneNumber">Contractor's Split</Label>
            <Input type="text" name="clientPhoneNumber" id="clientPhoneNumber" onChange={updateContractorSplit} value={contractorSplit} />
          </FormGroup>
        </div>

      <Button className="margin-top-20 verify-btn" size="sm" onClick={addUsersToJob}>Finished!</Button>
    </div>
  )
}

AddUsers.propTypes = {

};

export default AddUsers;