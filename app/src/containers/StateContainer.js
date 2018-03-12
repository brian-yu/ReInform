import { connect } from 'react-redux'
import State from '../components/State'
import {selectCongressman, fetchCongressmanIfNeeded} from '../actions'

const mapStateToProps = (state) => ({
  view: state.view,
  selectedState: state.selectedState,
  selectedCongressman: state.selectedCongressman,
  dataByState: state.dataByState,
})

const mapDispatchToProps = {
  onCongressmanClick: selectCongressman,
  fetchCongressmanIfNeeded: fetchCongressmanIfNeeded,
}

const StateContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(State)

export default StateContainer
