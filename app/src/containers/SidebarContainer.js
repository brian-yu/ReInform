import { connect } from 'react-redux'
import Sidebar from '../components/Sidebar'

const mapStateToProps = (state) => ({
  view: state.view,
})


const SidebarContainer = connect(
  mapStateToProps,
)(Sidebar)

export default SidebarContainer
