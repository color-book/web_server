import { connect } from 'react-redux'
import {  } from '../../../actions/dashboardActions'
import LineItems from '../presentation/lineItems';

const mapStateToProps = (state, ownProps) => {
  return {

  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {

  }
}

const LineItemsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(LineItems)

export default LineItemsContainer