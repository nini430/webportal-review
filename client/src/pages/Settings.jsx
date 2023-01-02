
import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { Parameter } from '../components';

const Settings = () => {
    const {currentUser}=useSelector(state=>state.auth);
    
   
  return (
   <div className="settings">
    <h1>Update Your Personal Info</h1>
      <div className="attributes">
        <Parameter label="First Name" accessor="firstName" value={currentUser.firstName}  />
        <Parameter label="Last Name" accessor="lastName" value={currentUser.lastName}  />
        {!currentUser.withSocials && <Parameter label="Password" accessor="password" value="*******" isPassword  /> }
      </div>
   </div>
  )
}

export default Settings;