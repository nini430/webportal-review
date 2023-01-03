import React from 'react'
import {Image,Button, OverlayTrigger, Tooltip} from "react-bootstrap"
import {RxCross2} from "react-icons/rx"
import {MdDone} from "react-icons/md"
import {ClipLoader} from "react-spinners"

import {keys} from "../env"


const Requests = () => {
  
  return (
    <div className='requestPage p-5 d-flex flex-column gap-3'>
      <h1>Admin Requests</h1>
      {[1,2,3].map(item=>{
      return (
        <>
        <div className='request  d-flex  align-items-center'>
          <div className="candidate">
            <Image thumbnail rounded src="https://images.prismic.io/mystique/2169f182-86e2-41ad-a527-8a79b322c6ce_IMG_2.jpg?auto=compress%2Cformat&w=1200&h=450&q=75&crop=faces&fm=webp&rect=0,0,1600,999"/>
            <span>John Doe</span>
          </div>
          <div className="icons">
           
           <OverlayTrigger placement="bottom" overlay={<Tooltip>Accept</Tooltip>}>
           <Button><MdDone color="limegreen"/></Button>
           </OverlayTrigger>
          <OverlayTrigger placement="bottom" overlay={<Tooltip>Decline</Tooltip>}>
          <Button><RxCross2 color="orangered"/></Button> 
            </OverlayTrigger> 
          </div>
          

        </div>
        <hr/>
        </>
        
      ) 
      })}
    </div>
  )
}

export default Requests