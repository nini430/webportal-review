import React from 'react'
import {Review} from "./"
import Slider from "react-slick"


const ReviewList = ({reviews}) => {

 

  return (
    <Slider  infinite={false} autoplay autoplaySpeed={2000} className='cards' slidesToShow={4}>
      {reviews?.data.map(review=>(
        <Review review={review}/>
      ))}
    </Slider>
  )
}

export default ReviewList;