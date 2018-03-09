import { connect } from 'react-redux'
import { selectCongressman, selectState, reset } from '../actions'
import Map from '../components/Map'

const mapStateToProps = (state) => ({
  center: state.center,
  zoom: state.zoom,
})

const mapDispatchToProps = {
  onCongressmanClick: selectCongressman,
  onStateClick: selectState,
  reset: reset,
}

const MapContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Map)

export default MapContainer
