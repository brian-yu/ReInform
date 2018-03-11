import { connect } from 'react-redux'
import Sidebar from '../components/Sidebar'

const mapStateToProps = (state) => ({
  view: state.view,
  selectedState: state.selectedState,
  selectedCongressman: state.selectedCongressman,
  // center: state.center,
  // zoom: state.zoom,
})


const SidebarContainer = connect(
  mapStateToProps,
  // mapDispatchToProps
)(Sidebar)

export default SidebarContainer
