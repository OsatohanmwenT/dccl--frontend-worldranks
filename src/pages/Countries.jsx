import { useState, useMemo } from "react"
import searchIcon from "../assets/images/Search.svg"
import { useOutletContext, useSearchParams, Link } from "react-router-dom"
import usePagination from "../hooks/usePagination"
import useWindowSize from "../hooks/useWindowSize"

export default function Countries() {
    const { data } = useOutletContext()
    const width  =useWindowSize()
    const [searchParams, setSearchParams] = useSearchParams()
    const [selectedRegion, setSelectedRegion] = useState( searchParams.getAll('region') || []);
    const [searchQuery, setSearchQuery] = useState( searchParams.get('query') || "");
    const [sortType, setSortType] = useState( searchParams.get('sort') || 'Population');
    const [status, setStatus] = useState({
        united: searchParams && searchParams.get('united') === 'true',
        independent: searchParams && searchParams.get('independent') === 'true',
    });

    const filterCountries = useMemo(() => {
        return data.filter((item) => {
            const name = item.name?.common?.toLowerCase() || '';
            const region = item.region?.toLowerCase() || '';
            const subregion = item.subregion?.toLowerCase() || '';
            const queryLower = searchQuery?.toLowerCase() || "";
    
            return (
                name.includes(queryLower) ||
                region.includes(queryLower) ||
                subregion.includes(queryLower)
            );
        });
    }, [searchQuery, data]);
     

    const sortedCountries = useMemo(() => {
        return(
            filterCountries.sort((a,b) => {
                if(sortType === "Population") return  b.population - a.population
                if (sortType === 'Alphabetical Order') return a.name.common.localeCompare(b.name.common)
                if(sortType === "Area (km²)") return b.area - a.area
            })        
        )
    },[filterCountries,sortType])

    const filteredByRegion = sortedCountries.filter((item) => 
        selectedRegion.length === 0 || selectedRegion.includes(item.region)
    )

    const filterByStatus = useMemo(() => filteredByRegion.filter(item => {
            if(status.united && !item.unMember)  return false
            if(status.independent && !item.independent) return false
            return true
    }),[filteredByRegion,status])

    const { paginationNum, currentPage, setCurrentPage, currentItems } = usePagination(filterByStatus)

    const regions = ["Americas","Antarctic","Africa","Asia","Europe","Oceania"]

    function handleFilterChange(key, value) {
        setSearchParams(prevParams => {
            if(value === null) {
                prevParams.delete(key)
            }else if(Array.isArray(value)) {
                prevParams.delete(key);
                value.forEach(v => prevParams.append(key, v))
            }else {
                prevParams.set(key, value)
            }
            return prevParams
        })
    }

    const handleClick = (region) => {
        setSelectedRegion(prevSelected => {
            const newSelected = prevSelected.includes(region)
                ? prevSelected.filter(r => r !== region)
                : [...prevSelected, region];
        
                handleFilterChange('region', newSelected);
                setCurrentPage(1)
                return newSelected
        })
    };

    const checkedFilter = (e) => {
        const {name, checked} = e.target
        setStatus(prevStatus => {
            return {
                ...prevStatus,
                [name]: checked,
            }
        })
        handleFilterChange(name, checked);
        setCurrentPage(1)
    }

    const handleSortTypeChange = (e) => {
        setSortType(e.target.value);
        handleFilterChange('sort', e.target.value);
        setCurrentPage(1);
    };

    const changePage = (num) => {
        setCurrentPage(num)
    }

    const searchCountry = (e) => {
        setSearchQuery(e.target.value)
        handleFilterChange('query', e.target.value);
        setCurrentPage(1)
    }

    const numOfCountries = filterByStatus.length;

    return(
        <main className="flex flex-col mx-auto gap-6 p-6">
            <div className="flex items-center justify-between">
                <p className="text-grey font-bold text-base">Found {numOfCountries} countries</p>
                <div className="bg-grey/30 rounded-xl p-2 flex gap-2 w-[max(40%,250px)]">
                    <img src={searchIcon} alt="search icon" />
                    <input value={searchQuery || ""} onChange={searchCountry} className="bg-transparent outline-none text-white p-1 w-full" placeholder="Search by Name, Region, Subregion" type="text" />
                </div>
            </div>
            <div className="flex max-lg:flex-col gap-8">
                <div className="flex flex-col gap-8  basis-72">
                    <div>
                        <label className="text-grey font-bold" htmlFor="sort">Sort by</label>
                        <select value={sortType || "Population"} onChange={handleSortTypeChange} className="appearance-none font-semibold mt-2 bg-dark-grey border-[2px] outline-none rounded-xl p-2 border-white/20 w-full text-white" name="sort" id="sort">
                            <option value="Population">population</option>
                            <option value="Alphabetical Order">Alphabetical Order</option>
                            <option value="Area (km²)">Area (km²)</option>
                        </select>
                    </div>
                    <div>
                        <p className="text-grey font-bold mb-2">Region</p>
                        <div className="flex flex-1 flex-wrap gap-3">
                            {regions.map((region,index) => (
                                <button key={index} onClick={() => handleClick(region)} className={`text-white font-semibold py-2 px-3 rounded-2xl ${selectedRegion.includes(region) ? "bg-grey/30" : ""} `}>{region}</button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <p className="text-grey font-bold mb-1">status</p>
                        <form className="flex flex-col gap-2">
                            <label className="flex items-center gap-2" htmlFor="united">
                                <input className="checkbox checked:check" type="checkbox" name="united" id="united" checked={status.united} onChange={checkedFilter} />
                                <span className="text-white font-semibold ">Member of the United Nations</span>
                            </label>
                            <label className="flex items-center gap-2" htmlFor="independent">
                                <input className="checkbox checked:check" type="checkbox" name="independent" id="independent" checked={status.independent} onChange={checkedFilter} />
                                <span className="text-white font-semibold ">Independent</span>
                            </label>
                        </form>
                    </div>
                </div>
                <div className="flex-1">
                    <table className="text-left w-full">
                        <thead className="text-white/50 w-full">
                            <tr>
                                <th className="pb-4 border-b-[2px] border-white/25">Flag</th>
                                <th className="pb-4 border-b-[2px] border-white/25">Name</th>
                                <th className="pb-4 border-b-[2px] border-white/25">Population</th>
                                <th className="pb-4 border-b-[2px] border-white/25">Area</th>
                                {width > 768 && (
                                    <th className="pb-4 border-b-[2px] border-white/25">Region</th>
                                )}
                                
                            </tr>
                        </thead>
                        <tbody className="w-full">
                            {currentItems.map((item) => (
                                <tr key={item.name.common}>
                                    <td className="max-w-[190px] pr-1 py-3">
                                        <img className="w-[50px] rounded-sm object-cover" src={item.flags.png} alt={item.name.common} />
                                    </td>
                                    <td className="max-w-[130px] py-6">
                                        <Link
                                         to={`/country/${item.name.common}`}

                                         state={{ 
                                            country: item,
                                            search: `?${searchParams.toString()}`
                                          }}
                                         >
                                            <p className="text-white max-[425px]:text-[12px] text-sm font-semibold">{item.name.common}</p>
                                        </Link>
                                    </td>
                                    <td className="max-w-[190px] py-6">
                                        <p className="text-white max-[425px]:text-[12px] text-sm font-semibold">{item.population.toLocaleString()}</p>
                                    </td>
                                    <td className="max-w-[190px] py-6">
                                        <p className="text-white max-[425px]:text-[12px] text-sm font-semibold">{item.area.toLocaleString()}</p>
                                    </td>
                                    {width > 768 && (
                                        <td className="max-w-[190px] py-6">
                                            <p className="text-white text-sm font-semibold">{item.region}</p>
                                        </td>
                                    )}
                                </tr>   
                            ))}
                        </tbody>
                    </table>

                    <div className="text-center max-w-[500px] mx-auto">
                {paginationNum.map((num) => (
                    <button key={num} onClick={() => changePage(num)} className={`text-white p-2 px-3 rounded-md ${currentPage === num ? "bg-white/30": ""}`}>{num}</button>
                ))}
            </div>
                </div>
            </div>
        </main>
    )
}
