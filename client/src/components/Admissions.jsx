import React from 'react'
import {useDispatch, useSelector} from "react-redux"
import {useQuery} from "@tanstack/react-query"
import {ClipLoader} from "react-spinners"

import { axiosFetch } from '../axios'
import { getRequests } from '../redux/slices/requests'

const Admissions = () => {
  const dispatch=useDispatch();
    const {isLoading}=useQuery(["userRequests"],()=>{
      return axiosFetch.get("/user/requests",{withCredentials:true})
    },
    {onSuccess:({data})=>{
        dispatch(getRequests(data));
    }}
  )
  const {requests,adminPin}=useSelector(state=>state.request);
  if(isLoading) return <ClipLoader size={150}/>
  return (
    <div className='position-absolute popover notify d-flex flex-column'>
      {requests.map(req=>(
        <div className="notif">
          <p>Admin {req.status}  your request {adminPin && `Your adminPin is ${adminPin},Please sign in as admin `}</p>
        </div>
      ))}
    </div>
  )
}

export default Admissions;