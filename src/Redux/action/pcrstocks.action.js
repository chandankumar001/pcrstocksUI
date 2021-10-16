import {FETCH_SUCCESS,FETCH_FAILURE,FETCH_REQUEST} from '../actionType/pcrstocks.type';
import axios from "axios";
// import await from "await";


export const  fetch_success = (data,url) =>{
  return {
    type : FETCH_SUCCESS,
    payload : data,
    action:url
  }
}

export const  fetch_request = (data,url) =>{
  return {
    type : FETCH_REQUEST,
    payload : data,
    action:url
  }
}

export const  fetch_failure = (data,url) =>{
  return {
    type : FETCH_FAILURE,
    payload : data,
    action:url
  }
}

export const fetchData = (data) =>{
  let api = "http://localhost:8080/"+data["url"]
  return async (dispatch) =>{
    dispatch(fetch_request("request",data["url"]))
    try{
      let resdata = await axios.post(api,data)
      resdata["action"] = data["url"]
      dispatch(fetch_success(resdata,data["url"]))
    }
    catch(err){
      dispatch(fetch_failure(err,data["url"]))
    }
  }
}