import {useState,useEffect} from 'react'

interface TodayProps  {
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

type weatherInfo = {
    Location: String,
    Description: String,
    Temperature: String,
    Humidity: String,
    Feels_Like: String,
    Wind_Speed: String
  }
export default function Today({ searchType, searching, setSearchType, isSearching, searchDetails, error, setError, homeCoords, setHomeCoords }: TodayProps) {
    const [weather, setWeather] = useState<weatherInfo | null>(null)

    useEffect(() => {   // On Search
        if (searching) {
            if (!searchType) myLocation();
            else searchedLocation()
        }
    
    }, [searching])
    
    async function myLocation() {
        let result:any;
        try {
            console.log(homeCoords)
            result = await fetchWeather(`https://api.openweathermap.org/data/2.5/weather?lat=${homeCoords && homeCoords[0]}&lon=${homeCoords && homeCoords[1]}&appid=bf24319051981742cc7c6e9da6376dd2&units=imperial`)
            result.Location = await fetch('https://ipapi.co/json/').then(response => response.json()).then((data) => data.city)
        } catch (err) {
            console.log(err)
        }
        
         if(result) setWeather(result)
    }

    async function searchedLocation() {
        let result:any;
        if (searchType === 2)
            result = await fetchWeather(`https://api.openweathermap.org/data/2.5/weather?lat=${searchDetails[0] && searchDetails[0]}&lon=${searchDetails[1] && searchDetails[1]}&appid=bf24319051981742cc7c6e9da6376dd2&units=imperial`)
        else if (searchType === 1 && typeof searchDetails[0] === 'string') {
            try {
                result = await fetchWeather(`https://api.openweathermap.org/data/2.5/weather?q=${searchDetails[0]},${searchDetails[1]}&appid=bf24319051981742cc7c6e9da6376dd2&units=imperial`)
                result.Location = searchDetails[0]
            } catch (err:any) {
                console.log(err)
            }

        } 

        if(result) setWeather(result)
    }

    async function fetchWeather(url: string) {
        console.log('Fetched Weather')
        return await fetch(url)
            .then(res => {
                if (res.status == 404) {
                    setTimeout(() => {
                        setError(false)
                    }, 1000)
                    setWeather(null)
                    setError(res.statusText)
                    isSearching(false)
                    setSearchType(0)
                }
                else return res.json()
            })
            .catch(err => console.log(err))
            .then(data => {
                console.log(data);                
                return {
                    Location:data.name,
                    Description: data.weather[0].description,
                    Temperature: Math.floor(data.main.temp) + '°F',
                    Humidity: Math.floor(data.main.humidity) + '%',
                    Feels_Like: Math.floor(data.main.feels_like) + '°F',
                    Wind_Speed: Math.floor(data.wind.speed) + 'Mph'
                }     
            }).catch(err => console.log(err))
    }


        return <section className="todayContainer">
            <div className="detail">
                <span>Location:</span>
                <span>{weather ? weather.Location : '. . .'}</span>
            </div>
            <div className="detail">
                <span>Description:</span>
                <span>{weather ? weather.Description : '. . .'}</span>
            </div>
            <div className="detail">
                <span>Temperature:</span>
                <span>{weather ? weather.Temperature : '. . .'}</span>
            </div>
            <div className="detail">
                <span>Feels Like:</span>
                <span>{weather ? weather.Feels_Like : '. . .'}</span>
            </div>
            <div className="detail">
                <span>Humidity:</span>
                <span>{weather ? weather.Humidity : '. . .'}</span>
            </div>
            <div className="detail">
                <span>Wind Speed:</span>
                <span>{weather ? weather.Wind_Speed : '. . .'}</span>
            </div>
        </section>
    }
