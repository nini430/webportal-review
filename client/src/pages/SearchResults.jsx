import React, { useEffect } from 'react'
import {useDispatch, useSelector} from "react-redux"
import {Link} from "react-router-dom"
import {Tab,Nav,Image, Card} from "react-bootstrap"
import { useState } from 'react'
import {Review} from "../components"
import Slider from 'react-slick'
import reactStringReplace from "string-replace-jsx"

import {keys} from ".././env"
import { useQuery } from '@tanstack/react-query'
import { axiosFetch } from '../axios'
import { getSearchResults } from '../redux/slices/search'

const SearchResults = () => {
  const dispatch=useDispatch();
  const [activeKey,setActiveKey]=useState("users")
  const {searchResults,searchWord}=useSelector(state=>state.search)

  const {refetch}=useQuery(["search"],()=>{
    return axiosFetch.get(`/reviews/search/?text=${searchWord}`);
  },{
    onSuccess:({data})=>{
        dispatch(getSearchResults(data))
    },
    enabled:false
    
    
  })
  useEffect(()=>{
    if(searchWord) {
      refetch();
    }
  },[searchWord])

  if(!searchResults) return <h1>No Searches</h1>
  return (
    <div className="search">
        <Tab.Container activeKey={activeKey} onSelect={setActiveKey}>
          <Nav variant="tabs">
          <Nav.Link eventKey="users">Users</Nav.Link>
          <Nav.Link eventKey="reviews">Reviews</Nav.Link>
          <Nav.Link eventKey="comments">Comments</Nav.Link>
          </Nav>
          <Tab.Content>
            <Tab.Pane eventKey="users">
              {searchResults.users.length? (
                <div className='d-flex flex-wrap gap-2'>
                  {searchResults.users.map(user=>(
                   <Link className='link' to={`/profile/${user.uuid}`}>
                   <div >
                      <Card className="userSearch">
                      <Card.Header className='text-center'>{user.firstName} {user.lastName}</Card.Header>
                      <Card.Body className='d-flex flex-column align-items-center'>
                      <Image thumbnail src={user.profUpdated?user.profileImg:keys.PF+user.profileImg}/>
                      </Card.Body>
                      <Card.Footer className='text-center'><strong>Personal Rating :</strong>{user.ratingNumber}</Card.Footer>
                      </Card>
                      

                    </div>
                   </Link> 
                  ))}
                </div>
              ):(<h1 className='text-center'>Users Are not Found</h1>)}
            </Tab.Pane>
            <Tab.Pane eventKey="reviews">
              {searchResults.reviews.length? (
               <Slider infinite={false} slidesToShow={4}>
                {searchResults.reviews.map(review=>(
                  <div className="reviewSearch">
                   <Review review={review}/>
                  </div>
                ))}
               </Slider> 
              ):(
                <h1 className='text-center'>Reviews Are not Found</h1>
              )}
            </Tab.Pane>
            <Tab.Pane eventKey="comments">
              
                {searchResults.comments.length? (
                  <div className="d-flex gap-1">{searchResults.comments.map(item=>{
                    const comm=item.comment.replace(new RegExp(searchWord,"gi"),(match)=>`<mark>${match}</mark>`).split(",")
                    console.log(comm);
                console.log(comm);  
                    return <div className="commentSearch">
                      <Review review={item.review}/>
                      <p>{reactStringReplace(item.comment,new RegExp(searchWord,"gi"),(match)=>{console.log(match);return <mark>{match}</mark>})}</p>
                    </div>
 })}</div>
                ):(
                  <h1 className='text-center'>No Comments Found </h1>
                )}
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
    </div>
  )
}

export default SearchResults;