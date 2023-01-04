import { useMutation, useQuery,useQueryClient} from '@tanstack/react-query'
import React from 'react'
import { Table } from 'react-bootstrap'
import {ClipLoader} from "react-spinners"

import { axiosFetch } from '../axios'
import {userColumns} from "../columns"
import {TableComponent} from '../components'

const Users = () => {
  const client=useQueryClient();
    const {isLoading,data}=useQuery(["users"],()=>{
        return axiosFetch.get("/admin/allusers/?role=user",{withCredentials:true})
    })
    if(isLoading) <ClipLoader size={150}/>
    
   

 
  return (
    <div className='p-5'>
        <h1 className='mb-3'>List Of Users</h1>
        <TableComponent users   data={data?.data} columns={userColumns}/>
    </div>
  )
}

export default Users;