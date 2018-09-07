import { connect } from 'react-redux'
import { updateSelectedJob, setSidebarOpen } from '../../../actions/dashboardActions'
import Dashboard from '../presentation/dashboardMain'

const mapStateToProps = (state, ownProps) => {
  return {
    usersName: state.usersName, 
    sidebarOpen: state.sidebarOpen,
    currentPage: state.page
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    setSidebarOpen: () => {dispatch(setSidebarOpen())}
  }
}

const DashboardContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard)

export default DashboardContainer