import { connect } from 'react-redux'
import { asyncUpdateSelectedJob } from '../../../actions/dashboardActions'
import TimePunch from '../presentation/timePunch'

const mapStateToProps = (state, ownProps) => {
  return {
    jobOptions: state.jobNames,
    selectedJob: state.selectedJobToClockIn,
    redirect: state.redirect,
    redirectPath: state.redirectPath
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    updateSelectedJob: (selectedJob) => {dispatch(asyncUpdateSelectedJob(selectedJob))}
  }
}

const TimePunchContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(TimePunch)

export default TimePunchContainer