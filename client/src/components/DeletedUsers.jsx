import { useQuery } from '@tanstack/react-query';
import React from 'react'
import { axiosFetch } from '../axios';
import { userColumns } from '../columns';
import TableComponent from './Table';
import {ClipLoader} from "react-spinners"

const DeletedUsers = () => {
    const {data,isLoading,refetch}=useQuery(["deleted"],()=>{
        return axiosFetch.get('/admin/allusers/?deleted=true',{withCredentials:true})
    })
    if(isLoading) return <ClipLoader size={150}/>
  return (
    <div className='p-5'>
        <h1>Deleted Users</h1>
        <TableComponent refetch={refetch} deleted columns={userColumns} data={data?.data}/>
    </div>
  )
}

export default DeletedUsers;