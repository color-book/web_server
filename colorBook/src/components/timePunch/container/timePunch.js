import { connect } from 'react-redux'
import { updateSelectedJob } from '../../../actions/dashboardActions'
import TimePunch from '../presentation/timePunch'

const mapStateToProps = (state, ownProps) => {
  return {
    jobNames: state.jobNames,
    selectedJob: state.selectedJobToClockIn
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    updateSelectedJob: (selectedJob) => {dispatch(updateSelectedJob(selectedJob))}
  }
}

const TimePunchContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(TimePunch)

export default TimePunchContainer