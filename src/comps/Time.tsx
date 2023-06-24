import { useEffect, useState } from 'react';


const months = ["January", "February", "March", "April", "May","June", "July", "August", "September", "October", "November", "December"];
const weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

interface TimeProps  {
  searchType: number
  searching: boolean
  setSearchType: Function
  isSearching: Function
  searchDetails: string | number[]
  error:boolean | string
  setError: Function
}
export default function Time({searchType,searching,setSearchType,isSearching,searchDetails,error,setError}:TimeProps) {
  const [time, setTime] = useState<string>();
  const [date, setDate] = useState<any[]>();
  //const [ready, setReady] = useState(false);

  let timeZone:number | null = null
  
  useEffect(() => myTime(), []) // On Initial Page Load get my time

  useEffect(() => { // If searching is false/finished > start clock
    let tick: any;
    timeZone = null

    if (!searching) { 
      if (!searchType) tick = setInterval(myTime, 1000);
      else if (searchType) tick = setInterval(searchedTime, 1000);
    }
    return () => clearInterval(tick) 
  }, [searching])
  

  useEffect(() => {   // On Search
    if (searching) {

      if (!searchType) myTime();
      else searchedTime()
    }

  }, [searching])


  function myTime() { 
    let timeDraft, dateDraft: string[];
    timeDraft = new Date().toLocaleTimeString().split(':');
    dateDraft = new Date().toDateString().split(' ')
    let timeInfo = getTimeInfo(timeDraft,dateDraft);

    updateDisplay(timeInfo[0],timeInfo.slice(1))
  }

  async function searchedTime() {
    if (searchType === 2) {
      if (timeZone === null) {
        try {
          await fetchTimeZone(`https://api.openweathermap.org/data/2.5/weather?lat=${searchDetails[0]}&lon=${searchDetails[1]}&appid=bf24319051981742cc7c6e9da6376dd2`)
        } catch (err) {
            console.log(err)
        }
      } 

      if (timeZone !== null) {
        let timeInfo = formatTimeZone(timeZone);
        updateDisplay(timeInfo[0], timeInfo.slice(1))

      } 
 
    }
    else if (searchType == 1) {
      if (timeZone === null) {
        try {
          await fetchTimeZone(`https://api.openweathermap.org/data/2.5/weather?q=${searchDetails[0]},${searchDetails[1]}&appid=bf24319051981742cc7c6e9da6376dd2`)
        } catch (err) {
          console.log(err)
        }
      } 

      if (timeZone !== null) {
        let timeInfo = formatTimeZone(timeZone);
        updateDisplay(timeInfo[0], timeInfo.slice(1))
      } 
    }




  }
  async function fetchTimeZone(url: string) {
    console.log('Fetched TimeZone')
    await fetch(url)
      .then(res => {
        if (res.status == 404) {
          setTimeout(() => {
            setError(false)
          }, 1000)
          setError(res.statusText)
          isSearching(false)
          setSearchType(0)
        }
        else return res.json()
      })
      .then((data) => {
        console.log(data)
        timeZone = data.timezone
      })
      .catch(err => console.log(err))

  }
  function formatTimeZone(timeZone: any) {
    let timeDraft, dateDraft: string[];

    const offsetSeconds = timeZone;
    const now = new Date();
    const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
    const offsetTime = utcTime + (offsetSeconds * 1000);
    const date = new Date(offsetTime);

    timeDraft = date.toLocaleTimeString().split(':');
    dateDraft = date.toDateString().split(' ');
    return getTimeInfo(timeDraft, dateDraft);
  }
  function getTimeInfo(timeDraft:string[], dateDraft:string[]) {
    let weekDay, month, day, year, time;
    weekDay = weekDays.filter((day) => day.includes(dateDraft[0])).join('');
    month = months.filter((month) => month.includes(dateDraft[1])).join('');
    day = dateDraft[2]
    year = dateDraft[3]
    time = `${timeDraft[0]}:${timeDraft[1]} ${timeDraft.slice(-1)[0].slice(-2)}`

    return [time,weekDay, month, day, year]
  }
  function updateDisplay(time: string, date: any[]) {
    setTime(time)
    setDate(date)
  }





    return <section className="timeContainer">
            <span className="time">{time && time}</span>
            <span className="date">{date && date[0]} <br /> {date && date[1]} {date && date[2]}, {date && date[3]}</span>
          </section>
}