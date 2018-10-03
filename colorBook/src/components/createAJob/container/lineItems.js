import { connect } from 'react-redux'
import { addNewLineItem, updateLineItem, removeLineItem, asyncSaveLineItems } from '../../../actions/dashboardActions'
import LineItems from '../presentation/lineItems';

const mapStateToProps = (state, ownProps) => {
  return {
    lineItems: state.jobLineItems
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    addNewLineItem: () => {dispatch(addNewLineItem())},
    updateLineItem: (item, index) => (e) => {dispatch(updateLineItem(item, index, e.target.value))},
    removeLineItem: (index) => {dispatch(removeLineItem(index))},
    saveLineItems: () => {dispatch(asyncSaveLineItems())}
  }
}

const LineItemsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(LineItems)

export default LineItemsContainer