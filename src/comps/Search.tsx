import { Search as SearchIcon } from 'react-bootstrap-icons';
import { useRef,useState,useEffect } from 'react';

const countries:any = {
    unitedstates: "US",
    unitedstatesofamerica: "US",
    theunitedstatesofamerica: "US",
    theunitedstates: "US",
    northamerica: "US",
    canada: "CA",
    theunitedkingdom: "UK",
    unitedkingdom: "UK",
    germany: "DE",
    france: "FR",
    japan: "JP",
    italy: "IT",
    australia: "AU",
    newzealand: "NZ",
    spain: "ES",
    netherlands: "NL",
    belgium: "BE",
    sweden: "SE",
    switzerland: "CH",
    denmark: "DK",
    norway: "NO",
    finland: "FI",
    austria: "AT",
    ireland: "IE",
    iceland: "IS",
    luxembourg: "LU",
    singapore: "SG",
    hongkong: "HK",
    china: "CN",
  };
  
interface SearchProps {
    setSearchType : Function,
    searchType: number,
    isSearching: Function,
    setSearchDetails:Function,
    error: string | boolean,
    setError: Function
    permisson: boolean
    setPermission:Function
    // loading:boolean          
}

export default function Search({setSearchType, searchType,setSearchDetails, isSearching, error, setError, permisson, setPermission }: SearchProps) {
    const input_1 = useRef<any>() 
    const input_2 = useRef<any>()
    const [exampleBtn,setExampleBtn] = useState(false)

    const _InputConatinerStylesForCoords = {width:'initial'}
    const _InputStylesForCoords = {
        border: '1px solid rgba(255, 255, 255, 0.192)',
        borderRadius: '10px',
        width: 'initial',
        paddingLeft: '0em'
    };

    const cityExamples = [['Las Vegas','United States'], ['London','United Kingdom'], ['New York','United States'],['Phoenix','US'],['Ottawa','CA']];
    const coordExamples = [[40.7128, -74.0060], [36.1716, -115.1391], [51.5072, -0.1276]];

    useEffect(() => {
        function handleEnterBtn(e:any) {
            if (e.key === 'Enter')
                handleStartSearch()
        }

        document.addEventListener('keydown',(e)=> handleEnterBtn(e))
        
        return document.removeEventListener('keydown',(e)=> handleEnterBtn(e))
    },[])


    function handleStartSearch() {
        setExampleBtn(false)
            if (searchType === 2) {
                let result = type2_TEST(input_1.current.value,input_2.current.value)
                if (result) {
                    console.log(result)
                    console.log('set Searching to true: Search COMP : Searchtype 2')
                    setSearchDetails([input_1.current.value,input_2.current.value])
                   isSearching(true);
                } 
                else {
                    setExampleBtn(true)
                    console.log('Error is true')
                    setTimeout(() => {
                        console.log('Error is false')
                        setError(false)
                    }, 3000)
                    setError('Invalid Coordinates')
                }
            }
            else {
                console.log('set Searching to true: Search COMP')
                let result:[boolean,string?,string?] = type1_TEST(input_1.current.value,input_2.current.value)
                if (result[0]) {
                    console.log(result)
                    setSearchDetails([result[1],result[2]])

                    setSearchType(1)
                    isSearching(true);
                }
                else {
                    setExampleBtn(true);
                    console.log('Error is true')
                    setTimeout(() => {
                        console.log('Error is false')
                        setError(false)
                    }, 3000)
                    setError(result[1])
                }
            }

    }
    function handleMyLocation() {
            if (permisson) {
                setExampleBtn(false)
                setSearchType(0)
                isSearching(true)
                input_1.current.value = '';
                input_2.current.value = '';
            }
            else {
          
                if (typeof permisson == 'number')
                    setPermission(false)
                else setPermission(0)
                console.log("Set permission to false in Search to retrigger 'ASK'")
            }  // Trigger the useEffect that asks for permission
        
    }
    function handleToggleSearchType(e: any) {
        setExampleBtn(false)
        if(!searchType || searchType === 1) setSearchType(2)
        else setSearchType(1)
        input_1.current.value = '';
        input_2.current.value = '';
    }
    function showExample() {
        if (searchType === 1 || searchType === 0) {
            let chosen = Math.floor(Math.random() * 5)
            input_1.current.value = cityExamples[chosen][0]
            input_2.current.value = cityExamples[chosen][1]
        }
        else if (searchType === 2) {
            let chosen = Math.floor(Math.random() * 3);
            input_1.current.value = coordExamples[chosen][0];
            input_2.current.value = coordExamples[chosen][1];
        }
    }



    return <section className="search">
            <div
                style={searchType === 2 ? _InputConatinerStylesForCoords : {}}
                className="searchInput">
            <input
                ref={input_1}
                style={_InputStylesForCoords}
                type="text"
                required
                placeholder={searchType === 2  ? 'Enter Latitude' : 'City Name'}
            />
            <input
                ref={input_2}
                style={_InputStylesForCoords}
                type="text"
                required
                placeholder={searchType === 2  ? 'Enter Longitude' : 'Country Name'}
            />
            
            <SearchIcon type='submit' onClick={() => handleStartSearch()} />
            
            </div>
            <div className="searchOC">
                <div className="btn btn-a" onClick={handleMyLocation}>My Location</div>
                <div className="btn btn-b" onClick={ handleToggleSearchType}>{!searchType || searchType === 1 ? 'Use Coordinates' : 'Use City Name' }</div>
        </div>
        {exampleBtn && <div onClick={()=> showExample()} className="btn btn-b">See Examples</div> }
        <div style={error ? { opacity: '1', marginTop: '-.5em' } : {}} className="msg">{error}</div>
        {/* <div ref={exampleMessage} style={exampleVisable ? { opacity: '1', marginTop: '-3.5em' } : {}} className="msg msg_2"></div> */}
    </section>
}

function type1_TEST(city: string,country:string):[boolean,string?,string?] {
    const chars = 'AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz ';
    if (!city) return [false, 'Empty City Input'];
    if (!country) return [false, 'Empty Country Input'];


    // Check city name
    for (let i = 0; i < city.length; i++){
        if (!chars.includes(city[i])) return [false, 'City name contains invalid characters'];
    };
    // Check country name
    if (country.length == 2) {
        if (Object.values(countries).includes(country.toUpperCase())) {
            city = city.trim().toLocaleLowerCase()
            country = country.toLocaleLowerCase()
            return [true,city,country] // Both city and country Tests passed
        }
        else return [false, 'Country not found :('] 
    }
    else {
        for (let i = 0; i < country.length; i++){
            if (!chars.includes(country[i])) return [false, 'Country name contains invalid characters'];
        };
        if (countries[country.toLowerCase().trim().replace(/\s+/g, "")]) {
            city = city.trim().toLocaleLowerCase()
            country = countries[country.toLowerCase().trim().replace(/\s+/g, "")]
            return [true,city,country] // Both city and country Tests passed
        }
        else return [false, 'Country not found :(']
    }
}

function type2_TEST(lat: number, lon: number) {

    if ((lat && lon) && !isNaN(+lat + +lon)) {
        if (lat >= -90 && lat <= 90) {
            if(lon >= -180 && lon <= 180) return true
        }
    }
    return false
}

