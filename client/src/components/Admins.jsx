import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { useSelector } from 'react-redux'
import { axiosFetch } from '../axios'
import {ClipLoader} from "react-spinners"
import {TableComponent} from '../components'
import { userColumns } from '../columns'

const Admins = () => {
    const {isLoading,data}=useQuery(["admins"],()=>{
        return axiosFetch.get("/admin/allusers/?role=admin",{withCredentials:true},)
    })
    if(isLoading) return <ClipLoader size={150}/>
  return (
    <div className='p-5'>
       <h1>List Of Admins</h1> 
       <TableComponent data={data?.data} columns={userColumns}/>
    </div>
  )
}

export default Admins