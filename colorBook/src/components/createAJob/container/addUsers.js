import { connect } from 'react-redux'
import { updateSelectedUsers, asyncAddUsersToJob, quickUpdateSplitAmounts, updateContractorSplit } from '../../../actions/createAJobActions'
import AddUsers from '../presentation/addUsers';

const mapStateToProps = (state, ownProps) => {
  return {
    users: state.fullUserList,
    selectedUsers: state.selectedUsers,
    contractorSplit: state.contractorSplit? state.contractorSplit: '',
    subContractorSplit: state.subContractorSplit? state.subContractorSplit: ''
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    updateSelectedUsers: (selectedUser) => {dispatch(updateSelectedUsers(selectedUser))},
    quickAddSplit: (splitAmount) => {dispatch(quickUpdateSplitAmounts(splitAmount))},
    updateSubContractorSplit: (e) => {dispatch(updateContractorSplit('subContractorSplit', e.target.value))},
    updateContractorSplit: (e) => {dispatch(updateContractorSplit('contractorSplit', e.target.value))},
    addUsersToJob: () => {dispatch(asyncAddUsersToJob())}
  }
}

const AddUsersContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(AddUsers)

export default AddUsersContainer