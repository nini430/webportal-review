import React from 'react'
import {Review} from "./"
import Slider from "react-slick"


const ReviewList = ({reviews}) => {

 const settings={
  infinite:false,
  responsive:[
    {
      breakpoint:480,
      settings:{
        slidesToShow:1,
        slidesToScroll:1,
        dots:true
      }
    }
  ]
 }

  return (
    <Slider {...settings}  autoplay autoplaySpeed={2000} className='cards' slidesToShow={4}>
      {reviews?.data.map(review=>(
        <Review review={review}/>
      ))}
    </Slider>
  )
}

export default ReviewList;