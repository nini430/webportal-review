import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import moment from "moment"
import { Button } from 'react-bootstrap';
import {  getNotifications } from '../redux/slices/notifications';
import { useQuery } from '@tanstack/react-query';
import { axiosFetch } from '../axios';
import {getReaction} from ".././utils/reactions"
import {Rating} from "react-simple-star-rating"


const Notifications = () => {
    const dispatch=useDispatch();
    const {notifications}=useSelector(state=>state.notification)
    useQuery(["notifications"],()=>{
        return axiosFetch.get("/user/notifications",{withCredentials:true})
    },{
        onSuccess:({data})=>{
            console.log(data);
            dispatch(getNotifications(data));
        }
    })
    
  return (
    <div className='position-absolute popover notify d-flex flex-column'>
    <div>
        {notifications.length ? (
            notifications.map(notif=>(
                <div key={notif.id} className="notif">
                    <p>{notif.message} {notif.reaction==="rate"&&<Rating readonly allowFraction initialValue={notif.value}/>} {notif.reaction==="react" && getReaction(notif.value) }</p>
                    <span>{moment(notif.createdAt).fromNow()}</span>
                    <hr/>
                </div>
            ))
        ):<h1 className='text-center text-small'>Notifications Empty</h1>}
            
    </div>
   
    </div>
    
  )
}

export default Notifications;