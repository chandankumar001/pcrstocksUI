/* eslint-disable default-case */
/* eslint-disable no-unreachable */
import {FETCH_SUCCESS,FETCH_FAILURE,FETCH_REQUEST} from '../actionType/pcrstocks.type';

const initialState = {
  response : {},
  responsestocks:{},
  loader:0
}

const PcrReducer = (state = initialState , action) =>{
  switch(action.type){
    case FETCH_SUCCESS:
      switch(action.action){
        case 'fetch':
          return{
            ...state,
            loader:0,
            response : action.payload
          }
        break;
        case 'fetchstocks':
          return{
            ...state,
            loader:0,
            responsestocks : action.payload
          }
        break;
      }
     
    break;
    case FETCH_REQUEST:
      return{
        ...state,
        loader:1
      }
    break;
    default:
      return{
        ...state,
        loader:0
      }
    break;
  }
}

export default PcrReducer;