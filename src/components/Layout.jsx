import LogoIcon from "../assets/images/Logo.svg"
import { Outlet, Link } from "react-router-dom"
import useFetchData from "../hooks/useFetchData"

export default function Layout() {
    const data  = useFetchData()

    return(
        <div className="sm:px-10">
            <Link to="/">
                <img className='mx-auto my-24 ' width={300} height={100} src={LogoIcon} alt="World ranks logo" />
            </Link>
                <Outlet context={{ data }} />
        </div>
    )
}
