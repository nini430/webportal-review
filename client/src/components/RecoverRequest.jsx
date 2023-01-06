import React from 'react'
import {Button, Modal} from "react-bootstrap"
import {useMutation} from "@tanstack/react-query"
import {ToastContainer,toast} from "react-toastify"

import {axiosFetch} from ".././axios"
import {toastOptions} from ".././utils/toastOptions"
import { useSelector } from 'react-redux'


const RecoverRequest = ({show,onHide,email}) => {
  const {currentUser}=useSelector(state=>state.auth)
  const {socket}=useSelector(state=>state.socket);
  const {mutate}=useMutation(()=>{
    return axiosFetch.post("/user/userrequest",{email},{withCredentials:true})
  },{
    onSuccess:({data})=>{
      toast.success(data.msg,toastOptions);
      onHide();
    }
  })  
  return (
    <Modal show={show} onHide={onHide}>
        <Modal.Header closeButton>Request Account recovery</Modal.Header>
        <Modal.Body>Admin deleted your account for some reasons. All you can do is to request admin to recover your account</Modal.Body>
       
       <Modal.Footer>
       <Button onClick={()=>mutate()}>Request</Button>
        <Button onClick={onHide} variant='secondary'>Cancel</Button>
       </Modal.Footer>
       <ToastContainer/>
    </Modal>
  )
}

export default RecoverRequest;