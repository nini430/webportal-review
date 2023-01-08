import React, { useEffect, useRef,useCallback } from 'react'
import {useDispatch, useSelector} from "react-redux"
import {useQuery} from "@tanstack/react-query"
import {ClipLoader} from "react-spinners"

import { axiosFetch } from '../axios'
import { getRequests } from '../redux/slices/requests'
import { t } from 'i18next'


const Admissions = ({setShowRequests}) => {
  const dispatch=useDispatch();
  const requestRef=useRef();
    const {isLoading}=useQuery(["userRequests"],()=>{
      return axiosFetch.get("/user/requests",{withCredentials:true})
    },
    {onSuccess:({data})=>{
        dispatch(getRequests(data));
    }}
  )
  
  const handleClickOutside=(e)=>{
    console.log("mianc")
    console.log(e.target.contains(requestRef.current));
    console.log(e.target);
    console.log(e.target.contains(document.getElementById("request")));
    console.log(requestRef.current);

    if(requestRef.current&&(!e.target.contains(requestRef.current)&&!e.target.contains(document.getElementById("request")))) {
        setShowRequests(false);
    }else{
      console.log("blabla")
    }
  }

  useEffect(()=>{
    document.addEventListener("click",handleClickOutside);
  },[])
 
  const {requests,adminPin}=useSelector(state=>state.request);
  if(isLoading) return <ClipLoader size={150}/>
  
  return (
    <div ref={requestRef} className='position-absolute popover notify d-flex flex-column'>
      {requests.length?requests.map(req=>(
        <div className="notif">
          <p>{t("admin")} {t(req.status)}  {t("your_request")} {adminPin && t("request_accepted",{adminPin})}</p>
        </div>
      )):<h1>{t("requests_empty")}</h1>}
    </div>
  )
}

export default Admissions;