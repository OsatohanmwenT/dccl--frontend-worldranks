import { useEffect, useState } from "react"
import { useLocation, useOutletContext, Link } from "react-router-dom"

export default function Country() {
    const { data } = useOutletContext()
    const location =  useLocation()
    const country = location.state?.country || ""
    const [borderingCountries, setBorderingCountries] = useState([]);
    console.log(location)

    useEffect(() => {
        if (country.borders) {
            const borderCountries = country.borders?.map((border) => {
                return data.find((country) => country.cca3 === border);
            }).filter(Boolean);
            setBorderingCountries(borderCountries);
        }
    }, [country.borders,data]);

    return(
        <div className="flex flex-col relative lg:min-w-[700px] lg:max-w-[700px] pb-10">
            <div className="relative mx-auto  -top-[50px]">
                <img className="w-[250px] h-[200px] rounded-xl" src={country.flags.png} alt={country.name.common} />
            </div>
            <h1 className="text-white text-4xl text-center font-semibold">{country.name.common}</h1>
            <p className="text-white text-center mb-4">{country.name.official}</p>
            <div className="flex max-md:flex-col items-center justify-center gap-10 max-md:gap-4">
               <div className="flex items-center justify-center gap-4 px-3 rounded-xl py-2 bg-grey/20">
                    <span className="text-white font-semibold">Population</span>
                    <div className="w-[1px] h-[36px] bg-very-dark-grey rounded-md"></div>
                    <span className="text-white font-semibold">{country.population.toLocaleString()}</span>
                </div>
               <div className="flex items-center justify-center gap-4 px-3 rounded-xl py-2 bg-grey/20">
                    <span className="text-white font-semibold">Area(km²)</span>
                    <div className="w-[1px] h-[36px] bg-very-dark-grey rounded-md"></div>
                    <span className="text-white font-semibold">{country.area.toLocaleString()}</span>
                </div>
            </div>
            <div className="mt-8 grid grid-rows-5">
                <div className="flex items-center justify-between p-4 border-t-[1px] border-grey">
                    <span className="text-white/50">Capital</span>
                    {country.capital.map((cap)=> (<span className="text-white" key={cap}>{cap}</span>))}
                </div>
                <div className="flex items-center justify-between p-4 border-t-[1px] border-grey">
                    <span className="text-white/50">Subregion</span>
                    <span className="text-white">{country.subregion}</span>
                </div>
                <div className="flex items-center justify-between p-4 border-t-[1px] border-grey">
                    <span className="text-white/50">Languages</span>
                    <div>
                        {Object.values(country.languages).map((language, index , array) => (
                            <span className="text-white" key={index}>{language}{index < array.length - 1 ? ', ' : ''}</span>
                        ))}
                    </div>
                </div>
                <div className="flex items-center justify-between p-4 border-t-[1px] border-grey">
                    <span className="text-white/50">Currency</span>
                    <div>
                        {Object.values(country.currencies).map((currency, index, array) => (
                        <span className="text-white" key={index}>{currency.name} {index < array.length - 1 ? ', ' : ''}</span>
                        ))}
                    </div>
                </div>
                <div className="flex items-center justify-between p-4 border-y-[1px] border-grey">
                    <span className="text-white/50">Continent</span>
                    {country.continents.map((continent) => (<span className="text-white" key={continent}>{continent}</span>))}
                </div>
            </div>
            {borderingCountries.length !== 0 ?
                <div className="flex flex-col px-6 mt-5 gap-2 justify-start">
                    <p className="text-lg text-white/50">Neighbouring Countries</p>
                    <div className="flex gap-4 justify-start flex-wrap">
                        {borderingCountries.map((border) => (
                            <div key={border.cca3}>
                                <img className="h-[60px] w-[90px] rounded-sm" src={border.flags.png} alt={border.name.common} />
                                <Link 
                                to={`/country/${border.name.common}`}
                                state={{ 
                                    country: border,
                                }}
                                >
                                    <p className="text-white pt-2 max-w-[88px] text-sm text-wrap whitespace-nowrap">{border.name.common}</p>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
                 : <h1 className="text-white text-2xl mt-5 font-semibold">No Neighbouring Countries Found</h1>
            }
            
        </div>
    )
}