import React from 'react'
import { useEffect } from 'react';
import {useSelector,useDispatch} from "react-redux"
import {useNavigate} from "react-router-dom"
import { ReviewList } from '../components';
import {useQuery} from "@tanstack/react-query"
import { axiosFetch } from '../axios';
import {useTranslation} from "react-i18next"
import axios from 'axios';
import { getUser } from '../redux/slices/auth';

const Home = () => {
  const dispatch=useDispatch();
  const {t}=useTranslation();
  const navigate=useNavigate();
  const {currentUser}=useSelector(state=>state.auth);

  useEffect(()=>{
    console.log("kaira")
    const fetchUser=async()=>{
      const response=await axios.get("http://localhost:8000/auth/login/success",{withCredentials:true});
      return response.data;
    }
    fetchUser().then(data=>{
      console.log(data);
      dispatch(getUser(data.user[0]))
    })
  },[dispatch])
  useEffect(()=>{
    if(!currentUser) {
      navigate("/login")
    }
  },[currentUser,navigate])

  const {data:latestReviews}=useQuery(["reviews"],()=>{
      return axiosFetch.get('/reviews?attribute=createdAt')
  })
  const {data:MostGradedReviews}=useQuery(["reviews"],()=>{
      return axiosFetch.get('/reviews?attribute=grade')
  })
  const {data:MostRatedReviews}=useQuery(["reviews"],()=>{
      return axiosFetch.get('/reviews?attribute=averageRating')
  })

  return (
    <div className='home'>
      <h1>{t("latest_reviews")}</h1>
      <hr/>
      <ReviewList reviews={latestReviews}/>
     
      <h1>{t("most_graded_reviews")}</h1>
      <hr/>
      <ReviewList reviews={MostGradedReviews}/>
      
      <h1>{t("most_rated_reviews")}</h1>
      <hr/>
      <ReviewList reviews={MostRatedReviews}/>
      
    </div>
  )
}

export default Home;