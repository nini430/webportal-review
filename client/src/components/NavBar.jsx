import React from 'react'
import jsCookie from "js-cookie"
import { Form, InputGroup, Nav, Navbar, Button,NavDropdown, OverlayTrigger, Tooltip} from "react-bootstrap"
import {Link, useNavigate} from "react-router-dom"
import {BsFillMoonStarsFill,BsFillSunFill,BsSearch,BsMessenger,BsBellFill} from "react-icons/bs"
import {BiLogOut} from "react-icons/bi"
import {TbEditCircle} from "react-icons/tb"
import ReactSwitch from "react-switch"
import {useTranslation} from "react-i18next"
import i18next from 'i18next'
import {useDispatch,useSelector} from "react-redux"
import axios from "axios"
import {ToastContainer,toast} from "react-toastify"
import {useMutation} from "@tanstack/react-query"

import { countries } from '../utils/countries'
import {changeTheme} from "../redux/slices/theme"
import { keys } from '../env';
import {toastOptions} from ".././utils/toastOptions"
import {logout} from "../redux/slices/auth"
import { useState } from 'react'
import {axiosFetch} from ".././axios"
import { getSearchResults } from '../redux/slices/search'


const NavBar = () => {
  
  const {currentUser}=useSelector(state=>state.auth);
  const [search,setSearch]=useState("");
  console.log(currentUser);
  const navigate=useNavigate();
  const {isLight}=useSelector(state=>state.theme)
  const dispatch=useDispatch();
  const lang=jsCookie.get("i18next")==="en"?"gb":jsCookie.get("i18next");
  const {t}=useTranslation();
  const logoutHandler=async()=>{
      const response=await axios.get(`http://localhost:8000/${currentUser.withSocials?'auth/logout':'api/v1/auth/logout'}`,{withCredentials:true})
      toast.success(response.data.msg,toastOptions);
      dispatch(logout())
      navigate("/login")
  }

  const searchMutation=useMutation(()=>{
      return axiosFetch.get(`/reviews/search/?text=${search}`)
  },{
    onSuccess:(({data})=>{
      setSearch("")
      navigate("/search");
      dispatch(getSearchResults(data));
    })
  })
  return (
    <Navbar className='navbar'>
      <Link to="/" className='link'>
      <Navbar.Brand>
        
        <h1>{t('app_title')}</h1>
        
      </Navbar.Brand>
      </Link>
      <Nav className='d-flex gap-5 w-100'>
        <Nav.Item className='d-flex gap-1 align-items-center'>
          <BsFillSunFill className='icon' size={20}/>
              <ReactSwitch onChange={()=>dispatch(changeTheme())} onColor="#eee" checkedIcon={false} uncheckedIcon={false} checked={!isLight}/>
          <BsFillMoonStarsFill className='icon' size={20}/>
        </Nav.Item>
        <Nav.Item className='d-flex align-items-center'>
          <InputGroup>
          <Form.Control value={search||""} onChange={e=>setSearch(e.target.value)} className='searchInput' type="text" placeholder={t("nav_search")}/>
          <Button onClick={()=>searchMutation.mutate()} disabled={!search} variant="secondary"><BsSearch size={20}/></Button>
          </InputGroup>
        </Nav.Item>
        <Nav.Item className='endPart'>
            <NavDropdown title={<div className={`flag-icon flag-icon-${lang}`}></div>}>
                {countries.map(country=>(
                  <NavDropdown.Item key={country.country_code} onClick={()=>i18next.changeLanguage(country.locale)}>
                    <div className={`flag-icon flag-icon-${country.country_code}`}></div>
                  </NavDropdown.Item>
                ))}
              
            </NavDropdown>
            <BsMessenger className='icon' role="button" size={25}/>
            <BsBellFill className='icon' role="button" size={25}/>
            <OverlayTrigger placement='bottom' overlay={<Tooltip>Write a Review</Tooltip>} >
            <Link to="/write">
            <TbEditCircle className='icon' role="button" size={25}/>
            </Link>
            </OverlayTrigger>
          {currentUser ? (<NavDropdown variant="link" title={<img className='userImg' src={currentUser.profUpdated?currentUser?.profileImg:`${keys.PF}${currentUser?.profileImg}`} alt=""/>}>
              <NavDropdown.Item onClick={()=>window.location="/settings"}  >{t("settings")}</NavDropdown.Item>
              <NavDropdown.Divider/>
              <NavDropdown.Item onClick={logoutHandler}> <div><BiLogOut/><span>{t("logout")}</span></div> </NavDropdown.Item>
            </NavDropdown>):(
              <Link to="/login"><Button className='signin' >Sign In</Button></Link>
            )}  
        </Nav.Item>
      </Nav>

      
              <ToastContainer/>
    </Navbar>
  )
}

export default NavBar;