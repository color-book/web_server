import React from 'react'
import { Form, FormGroup, Label, Input, Button } from 'reactstrap'
import Select from 'react-select';

const AddUsers = ({}) =>  {


  return (
    <div>
      <h5>Add Users <i>(Step 3 of 3)</i></h5>
      <Select
        isMulti={true}
      />
    </div>
  )
}

AddUsers.propTypes = {

};

export default AddUsers;