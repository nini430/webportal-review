import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {Image,Nav,Button} from "react-bootstrap"
import {useQuery, useQueryClient} from "@tanstack/react-query"
import { keys } from '../env';
import { Link } from 'react-router-dom';
import { axiosFetch } from '../axios';
import { getRequests } from '../redux/slices/requests';

const SideBar = () => {
    const client=useQueryClient();
    const {currentUser}=useSelector(state=>state.auth);
    const {requests}=useSelector(state=>state.request)
    const {socket}=useSelector(state=>state.socket)
    const dispatch=useDispatch();
    const unviewedReqs=requests.filter(item=>item.viewed===false).length;
   

    useQuery(
      ["requests"],
      () => {
        return axiosFetch.get("/admin/requests", { withCredentials: true });
      },
      {
        onSuccess: ({ data }) => {
          dispatch(getRequests(data));
        },
      }
    );

    useEffect(()=>{
        if(currentUser.role==="admin") {
            socket?.on("receive_request",()=>{
                    client.invalidateQueries(["requests"])
            })
        }
       
    },[dispatch,socket,currentUser,client])
  return (
    <div className='sidebar d-flex flex-column align-items-center'>
        <div className="adminProfile d-flex flex-column align-items-center">
            <Image thumbnail rounded src={keys.PF+currentUser.profileImg} alt="" />
            <p>{currentUser.firstName} {currentUser.lastName}</p>
        </div>
        <hr/>
        <Nav>
            <Link to="/admin/users" className='link p-3 border-bottom w-100'>users</Link>
            <Link to="/admin/reviews"  className='link p-3 border-bottom w-100' >
                Reviews
            </Link>
            <Link to="/admin/admins"  className='link p-3 border-bottom w-100' >
                Admins
            </Link>
            <Link to="/admin/requests" className='link p-3 position-relative border-bottom w-100' >
               Requests
             { unviewedReqs ? <div className="requests position-absolute d-flex justify-content-center align-items-center">{unviewedReqs}</div>:"" }
            </Link>
            <Link to="/admin/deleted" className='link p-3 border-bottom w-100' >
               Deleted Users
              
            </Link>
            
        </Nav>
        <Button >Log Out</Button>

        
    </div>
  )
}

export default SideBar