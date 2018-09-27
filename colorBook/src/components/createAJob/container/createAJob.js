import { connect } from 'react-redux'
import CreateAJob from '../presentation/createAJob';

const mapStateToProps = (state, ownProps) => {

  return {
    jobValidated: state.createAJob.jobValidated,
    jobCreated: state.createAJob.jobCreated,
    jobID: state.createAJob.jobID
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {

  }
}

const CreateAJobContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateAJob)

export default CreateAJobContainer