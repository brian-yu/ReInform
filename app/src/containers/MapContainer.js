import { connect } from 'react-redux';
import { selectCongressman, selectState, reset } from '../actions';
import Map from '../components/Map';

const mapStateToProps = (state) => ({
  view: state.view,
  currState: state.currState,
  currCid: state.currCid,
  // center: state.center,
  // zoom: state.zoom,
});

const mapDispatchToProps = {
  onCongressmanClick: selectCongressman,
  onStateClick: selectState,
  reset: reset,
  // onMapModification: modifyMap,
}

const MapContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Map);

export default MapContainer;
