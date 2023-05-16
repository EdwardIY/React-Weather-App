import Loader from "./comps/Loader";
import Search from "./comps/Search";
import Time from "./comps/Time";
import Week from "./comps/Week";

import { useState, useEffect } from 'react';
import Today from "./comps/Today";

export default function App() {
    const [homeCoords,setHomeCoords] = useState<number[] | null>(null)
    const [searchType, setSearchType] = useState<number>(0) //0 = MyLocation   1 = UseCityName   2 = UseCoordinates
    const [searchDetails,setSearchDetails] = useState<string | number[]>([-1])
    const [searching, isSearching] = useState<boolean>(false)
    const [loading, isLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | boolean>(false)
    
    useEffect(() => {   // On Page Load get home coords
        isLoading(true)
        if (!homeCoords) {
            navigator.geolocation.getCurrentPosition((position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                setHomeCoords([lat, lon])
                isLoading(false)
            })
        }
    }, [])

    useEffect(() => { 
        if (searching) isLoading(true);
        else isLoading(false)
    },[searching])

    return (
        <>
{/*COMP 1 */}<Loader loading={loading} /> 
{/*COMP 2 */}<Search                   
                searchType={searchType}
                setSearchType={setSearchType}
                setSearchDetails={setSearchDetails}
                isSearching={isSearching}
                error={error}
                setError={setError}
            />
{/*COMP 3 */}<Time
                searchType={searchType}
                setSearchType={setSearchType}
                searching={searching}
                isSearching={isSearching}
                searchDetails={searchDetails}
                error={error}
                setError={setError}

             />
{/*COMP 4 */}<Today
                searchType={searchType}
                setSearchType={setSearchType}
                searching={searching}
                isSearching={isSearching}
                searchDetails={searchDetails}
                error={error}
                setError={setError}
                homeCoords={homeCoords}
                setHomeCoords={setHomeCoords}               
             />
{/*COMP 5 */}<Week
                searchType={searchType}
                setSearchType={setSearchType}
                searching={searching}
                isSearching={isSearching}
                searchDetails={searchDetails}
                error={error}
                setError={setError}
                homeCoords={homeCoords}
                setHomeCoords={setHomeCoords} />
 
        </>

    )
}