import { connect } from 'react-redux'
import { updateCreateJobInput, asyncVerifyJobInfo, asyncGenerateJobID } from '../../../actions/dashboardActions'
import CreateAJob from '../presentation/createAJob';

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

const CreateAJobContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateAJob)

export default CreateAJobContainer