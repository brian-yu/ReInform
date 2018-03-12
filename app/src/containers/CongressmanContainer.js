import { connect } from 'react-redux'
import Congressman from '../components/Congressman'

const mapStateToProps = (state) => ({
  view: state.view,
  selectedState: state.selectedState,
  selectedCongressman: state.selectedCongressman,
  dataByCongressman: state.dataByCongressman,
})

const CongressmanContainer = connect(
  mapStateToProps
)(Congressman)

export default CongressmanContainer
