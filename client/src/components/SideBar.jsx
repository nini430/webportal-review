import React from 'react'
import { useSelector } from 'react-redux'
import {Image,Nav,Button} from "react-bootstrap"
import { keys } from '../env';
import { Link } from 'react-router-dom';

const SideBar = () => {
    const {currentUser}=useSelector(state=>state.auth);
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
               <div className="requests position-absolute d-flex justify-content-center align-items-center">3</div>
            </Link>
            
        </Nav>
        <Button >Log Out</Button>

        
    </div>
  )
}

export default SideBar