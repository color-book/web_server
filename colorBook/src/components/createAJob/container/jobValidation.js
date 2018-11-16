import { connect } from 'react-redux'
import { updateCreateJobInput, asyncVerifyJobInfo, asyncGenerateJobID } from '../../../actions/createAJobActions'
import JobValidation from '../presentation/jobValidation';

const mapStateToProps = (state, ownProps) => {

  return {
    jobValidated: state.createAJob.jobValidated,
    jobID: state.createAJob.jobID
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    updateJobTitle: (e) => {dispatch(updateCreateJobInput('title', e.target.value))},
    updateProjectTitle: (e) => {dispatch(updateCreateJobInput('projectTitle', e.target.value))},
    updateJobID: (e) => {dispatch(updateCreateJobInput('jobID', e.target.value))},
    verifyJobInfo: () => {dispatch(asyncVerifyJobInfo())},
    generateJobID: () => {dispatch(asyncGenerateJobID())}
  }
}

const JobValidationContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(JobValidation)

export default JobValidationContainer