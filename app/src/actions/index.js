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
 
export function selectState(name) {
  return { type: SELECT_STATE, name }
}
 
export function reset() {
  return { type: RESET }
}