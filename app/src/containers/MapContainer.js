import { connect } from 'react-redux';
import { selectCongressman, selectState, fetchStateIfNeeded, fetchCongressmanIfNeeded, reset } from '../actions';
import Map from '../components/Map';

const mapStateToProps = (state) => ({
  view: state.view,
  selectedState: state.selectedState,
  selectedCongressman: state.selectedCongressman,
  // center: state.center,
  // zoom: state.zoom,
});

const mapDispatchToProps = {
  onCongressmanClick: selectCongressman,
  onStateClick: selectState,
  fetchStateIfNeeded: fetchStateIfNeeded,
  fetchCongressmanIfNeeded: fetchCongressmanIfNeeded,
  reset: reset,
  // onMapModification: modifyMap,
}

const MapContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Map);

export default MapContainer;
