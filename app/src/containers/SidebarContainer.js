import { connect } from 'react-redux'
import Sidebar from '../components/Sidebar'

const mapStateToProps = (state) => ({
  view: state.view,
  selectedState: state.selectedState,
  selectedCongressman: state.selectedCongressman,
})


const SidebarContainer = connect(
  mapStateToProps,
)(Sidebar)

export default SidebarContainer
