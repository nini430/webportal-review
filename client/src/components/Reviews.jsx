import React from 'react'
import {useQuery} from "@tanstack/react-query"
import {ClipLoader} from "react-spinners"

import {axiosFetch} from ".././axios"
import {TableComponent} from "../components"
import {adminReviewColumns} from "../columns"

const Reviews = () => {
  const {isLoading,data}=useQuery(["allReviews"],()=>{
    return axiosFetch.get("/reviews/all",{withCredentials:true})
  })
  if(isLoading) return <ClipLoader size={150}/>
  return (
    <div className="p-5">
      <h1>List Of Reviews</h1>
      <TableComponent data={data?.data} columns={adminReviewColumns}/>
    </div>
   
  )
}

export default Reviews