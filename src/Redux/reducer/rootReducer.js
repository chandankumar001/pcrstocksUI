import { combineReducers } from "redux"
import pcrstockReducer from "./pcrStock.reducer"

const rootReducer = combineReducers({
  pcrstockReducer :  pcrstockReducer
})

export default rootReducer;