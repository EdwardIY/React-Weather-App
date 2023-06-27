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
    const [loading, isLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | boolean>(false)
    const [permisson,setPermission] = useState(false) // location permission
    
    useEffect(() => {   // On Page Load get home coords
        if (!homeCoords || !permisson) {
            navigator.geolocation.getCurrentPosition((position) => {
                console.log('getting location ')
                setPermission(true)
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                setHomeCoords([lat, lon])
                isSearching(true)
            }, (err) => {
                console.log(err)
                setError('Location is denied')
                setTimeout(() => setError(false), 3000)
                setPermission(false)
                isLoading(false)
            })
        }
    }, [permisson])

    useEffect(() => { 
        if ((searchDetails[0] != -1) || homeCoords) {
            if (searching) isLoading(true);
            else isLoading(false)
        }
    },[searching])

    return (
        <>
{/*COMP 1 */}{loading  && <Loader/>  }
{/*COMP 2 */}<Search                   
                searchType={searchType}
                setSearchType={setSearchType}
                setSearchDetails={setSearchDetails}
                isSearching={isSearching}
                error={error}
                setError={setError}
                permisson={permisson}
                setPermission={setPermission}
                // loading={loading}
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