import { connect } from 'react-redux'
import { updateCreateJobInput, focusStartDate, asyncCreateJob } from '../../../actions/dashboardActions'
import JobDetailInputs from '../presentation/JobDetailInputs';

const mapStateToProps = (state, ownProps) => {
  return {
    estimatedStartDate: state.createAJob.estimatedStartDate,
    estimatedStartDateFocused: state.createAJob.estimatedStartDateFocused
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    updateClientName: (e) => {dispatch(updateCreateJobInput('clientName', e.target.value))},
    updateClientPhoneNumber: (e) => {dispatch(updateCreateJobInput('clientPhoneNumber', e.target.value))},
    updateClientStreet: (e) => {dispatch(updateCreateJobInput('clientStreet', e.target.value))},
    updateClientCity: (e) => {dispatch(updateCreateJobInput('clientCity', e.target.value))},
    updateClientState: (e) => {dispatch(updateCreateJobInput('clientState', e.target.value))},
    updateJobTotal: (e) => {dispatch(updateCreateJobInput('jobTotal', e.target.value))},
    updateEstimatedTotalHours: (e) => {dispatch(updateCreateJobInput('estimatedTotalHours', e.target.value))},
    updateEstimatedStartDate: (date) => {dispatch(updateCreateJobInput('estimatedStartDate', date))},
    focusStartDate: () => {dispatch(focusStartDate())},
    updateDownPaymentPercentage: (e) => {dispatch(updateCreateJobInput('downPaymentPercentage', e.target.value))},
    updateDownPaymentAmount: (e) => {dispatch(updateCreateJobInput('downPaymentAmount', e.target.value))},
    createJob: () => {dispatch(asyncCreateJob())}
  }
}

const JobDetailInputsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(JobDetailInputs)

export default JobDetailInputsContainer