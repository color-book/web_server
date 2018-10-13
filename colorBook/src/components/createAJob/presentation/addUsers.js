import React from 'react'
import { Form, FormGroup, Label, Input, Button } from 'reactstrap'
import Select from 'react-select';

const AddUsers = ({users, addUsersToJob, selectedUsers, updateSelectedUsers}) =>  {

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

      <Button className="margin-top-20 verify-btn" size="sm" onClick={addUsersToJob}>Add Users and Continue</Button>
    </div>
  )
}

AddUsers.propTypes = {

};

export default AddUsers;