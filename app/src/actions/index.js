/*
 * action types
 */
 
export const SELECT_CONGRESSMAN = 'SELECT_CONGRESSMAN'
export const SELECT_STATE = 'SELECT_STATE'
export const RESET = 'RESET'
 
/*
 * other constants
 */
 
export const VisibilityFilters = {
  SHOW_ALL: 'SHOW_ALL',
  SHOW_COMPLETED: 'SHOW_COMPLETED',
  SHOW_ACTIVE: 'SHOW_ACTIVE'
}
 
/*
 * action creators
 */
 
export function selectCongressman(cid) {
  return { type: SELECT_CONGRESSMAN, cid }
}
 
export function selectState(stateName) {
  return { type: SELECT_STATE, stateName }
}
 
export function reset() {
  return { type: RESET }
}



// export const MODIFY_MAP = 'MODIFY_MAP'

// export function modifyMap(center, zoom) {
// 	return { type: MODIFY_MAP, center, zoom }
// }