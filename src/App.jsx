import { createBrowserRouter, RouterProvider } from "react-router-dom"
import SearchPage from "./SearchPage"
import CryptoDetail from "./componets/CryptoDetail"

export default function App(){
  const router = createBrowserRouter([
    {
      path: "/",
      element: <SearchPage/>
    },
    {
      path: "/:id",
      element: <CryptoDetail/>
    }
  ])

  return(<>
    <RouterProvider router={router}/>
  
  </>)
}