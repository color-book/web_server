import { connect } from 'react-redux'
import { updateSelectedUsers, asyncAddUsersToJob } from '../../../actions/createAJobActions'
import AddUsers from '../presentation/addUsers';

const mapStateToProps = (state, ownProps) => {
  return {
    users: state.fullUserList,
    selectedUsers: state.selectedUsers
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    updateSelectedUsers: (selectedUser) => {dispatch(updateSelectedUsers(selectedUser))},
    addUsersToJob: () => {dispatch(asyncAddUsersToJob())}
  }
}

const AddUsersContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(AddUsers)

export default AddUsersContainer