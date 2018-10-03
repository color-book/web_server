import { connect } from 'react-redux'
import {  } from '../../../actions/dashboardActions'
import AddUsers from '../presentation/addUsers';

const mapStateToProps = (state, ownProps) => {
  return {

  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
   
  }
}

const AddUsersContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(AddUsers)

export default AddUsersContainer