import {createBrowserRouter,Outlet,RouterProvider} from "react-router-dom"
import { NavBar } from "./components"
import {Profile,Auth,CreateReview,Home,ReviewDetails,Settings, PasswordReset, SearchResults} from "./pages"
import {useSelector} from "react-redux"

const Layout=()=>{
  return (
    <>
      <NavBar/>
      <Outlet/>
    </>
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
