import { useState, useEffect } from 'react';

interface WeekProps  {
    searchType: number
    searching: boolean
    setSearchType: Function
    isSearching: Function
    searchDetails: string | number[]
    error:boolean | string
    setError: Function
    homeCoords: null | number[]
    setHomeCoords: Function
} 

// api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid=bf24319051981742cc7c6e9da6376dd2&units=imperial
// `https://api.openweathermap.org/data/2.5/forecast?q=phoenix,us&appid=bf24319051981742cc7c6e9da6376dd2&units=imperial`

export default function Week({ searchType, searching, setSearchType, isSearching, searchDetails, error, setError, homeCoords, setHomeCoords }: WeekProps) {
    const [weather, setWeather] = useState<any[] | null>(null);

    useEffect(() => {   // On Search
        if (searching) {
            if (!searchType) myLocation();
            else searchedLocation()
        }
    
    }, [searching]);

    async function myLocation() {
        let result;
        try { 
            const data = await fetchWeather(`https://api.openweathermap.org/data/2.5/forecast?lat=${homeCoords && homeCoords[0]}&lon=${homeCoords && homeCoords[1]}&appid=bf24319051981742cc7c6e9da6376dd2&units=imperial`);
            result = filterLists(data.list);

        }
        catch (err) {
            console.log(err)
        }
        if(result) setWeather(result)
    }


    async function searchedLocation() {
        let data;
        if (searchType === 2) {
            try {
                data = await fetchWeather(`https://api.openweathermap.org/data/2.5/forecast?lat=${searchDetails && searchDetails[0]}&lon=${searchDetails && searchDetails[1]}&appid=bf24319051981742cc7c6e9da6376dd2&units=imperial`);
            } catch (err) {
                console.log(err)
            }
        }
        else if (searchType === 1) {
            try {
                data = await fetchWeather(`https://api.openweathermap.org/data/2.5/forecast?q=${searchDetails[0]},${searchDetails[1]}&appid=bf24319051981742cc7c6e9da6376dd2&units=imperial`);
            } catch (err) {
                console.log(err)
            }
        }
        
            const result = filterLists(data.list);
            setWeather(result)
    }

    async function fetchWeather(url:string) {
        return await fetch(url)
            .then((res) => {
                if (res.status == 404) {
                    setTimeout(() => {
                        console.log('Error is false')
                        setError(false)
                    }, 1000)
                    setWeather(null)
                    setError(res.statusText)
                    isSearching(false)
                    setSearchType(0)
                }
                return res.json()
            }).then((data) => {
            isSearching(false)
            return data
            }).catch(err => console.log(err))
    }
    function filterLists(timeStamps: any) {
        const list = timeStamps
            .filter((timeStamp: any) => {
                let day = new Date(timeStamp.dt * 1000).toDateString()
                let time = new Date(timeStamp.dt * 1000).toLocaleTimeString();

                if (day.slice(0, 4) == new Date().toDateString().slice(0, 4)) return false;
                if (time.includes('8') && time.includes('AM')) return true;
                else if (time.includes('11') && time.includes('AM')) return true;
                else if (time.includes('5') && time.includes('PM')) return true;
            });
        const Tomorrow = list.slice(0, 3);
        let RestOfWeek = [];

        const restOfWeeklist_unFormatted = list.slice(3);
        for (let i = 0; i < restOfWeeklist_unFormatted.length; i+=3){
            RestOfWeek.push(restOfWeeklist_unFormatted.slice(i,i+3))
        }

            return [Tomorrow,RestOfWeek]
    }

    return <>
        {weather && <section className='week'>
    <div className="Tomorrow">
        <img src={`https://openweathermap.org/img/wn/${weather[0][1].weather[0].icon}@2x.png`} alt="Tomorrows Weather" />
                {
                  <div className="info">
                        <span>Tomorrow</span>
                        <span><b>Description</b>: {weather[0][1].weather[0].description}</span>
                        <span><b>Morning</b>: {weather[0][0].main.temp + ' °F'} </span>
                        <span><b>Noon</b>: {weather[0][1].main.temp + ' °F'}</span>
                        <span><b>Evening</b>: {weather[0][2].main.temp + ' °F'}</span>
                </div>            
                }
        </div>            

        {
            weather[1].map((day:any)=>{
                return  <div key={day.dt} className="day">
                            <span>{new Date(day[0].dt * 1000).toDateString().slice(0,4)}</span>
                            <img src={`https://openweathermap.org/img/wn/${day[0].weather[0].icon}@2x.png`} alt="" />
                            <span><b>Description</b>: {day[0] ? day[0].weather[0].description : ' . . .' }</span>
                            <span><b>Morning</b>: {day[0] ? day[0].main.temp  + ' °F' : ' . . .' }</span>
                            <span><b>Noon</b>: {day[1] ? day[1].main.temp + ' °F' : ' . . .' }</span>
                            <span><b>Evening</b>: {day[2] ? day[2].main.temp + ' °F': ' . . .' }</span>
                        </div>
            })
        }

</section>}
    </>
}