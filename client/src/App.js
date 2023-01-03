import {createBrowserRouter,Outlet,RouterProvider} from "react-router-dom"
import { AdminContent, Admins, NavBar, Requests, Reviews, SideBar, Users } from "./components"
import {Profile,Auth,CreateReview,Home,ReviewDetails,Settings, PasswordReset, SearchResults, AdminPage} from "./pages"
import {useSelector} from "react-redux"

const Layout=()=>{
  return (
    <>
      <NavBar/>
      <Outlet/>
    </>
  )
}

const AdminLayout=()=>{
  return (
    <div className="admin d-flex gap-4">
    <SideBar/>
    <Outlet/>
    </div>
  )
}
const router=createBrowserRouter([
    {
      path:"/",
      element:<Layout/>,
      children:[
        {
          path:"/",
          element:<Home/>
        },
        {
          path:"/register",
          element:<Auth isRegister/>
        },
        {
          path:"/login",
          element:<Auth/>
        },
        {
          path:"/write",
          element:<CreateReview/>
        },
        {
          path:"/update/:id",
          element:<CreateReview update/>
        },
        {
          path:"/profile/:userId",
          element:<Profile/>
        },
        {
          path:"/review/:id",
          element:<ReviewDetails/>
        },
        {
          path:"/settings",
          element:<Settings/>
        },
        {
          path:"/passwordReset/:resetToken",
          element:<PasswordReset/>
        },
        {
          path:"/search",
          element:<SearchResults/>
        },
        {
          path:"/admin",
          element:<AdminLayout/>,
          children:[
            {
       
              path:"/admin/*",
              element:<Users/>,
              index:true
            },
            {
              path:"/admin/reviews",
              element:<Reviews/>
            },
            {
              path:"/admin/admins",
              element:<Admins/>
            },
            {
              path:"/admin/requests",
              element:<Requests/>
          
            },
          ]
          
        }
      ]
    }
])

function App() {
  const {isLight}=useSelector(state=>state.theme);
  return (
    <div className={`bg-${isLight?"light":"dark"}`}>
        <RouterProvider router={router}/>
    </div>
  );
}

export default App;
