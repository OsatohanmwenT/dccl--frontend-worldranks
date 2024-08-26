import { RouterProvider, createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom"
import Layout from "./components/Layout"
import Countries from "./pages/Countries"
import Country from "./pages/Country"

const router = createBrowserRouter(createRoutesFromElements(
  <Route path="/" element={<Layout />}>
    <Route index element={<Countries />} />
    <Route path="country/:country" element={<Country />}/>
  </Route>
))

export default function App() {
  return (
    <RouterProvider router={router} />
  )
}