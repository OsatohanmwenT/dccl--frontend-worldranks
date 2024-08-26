import { useState, useEffect } from "react";

export default function useFetchData() {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchCountries = async() => {
            try{
                const response = await fetch("https://restcountries.com/v3.1/all")
                if(!response.ok){
                    throw new Error(`HTTP Status Error: ${Error.status}`)
                }
                const data = await response.json()
                setData(data)
            }catch(err){
                console.log(err)
            }
        }
        fetchCountries()
    },[])
    return data
}