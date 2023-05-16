import { Search as SearchIcon } from 'react-bootstrap-icons';
import { useRef,useState,useEffect } from 'react';

interface SearchProps {
    setSearchType : Function,
    searchType: number,
    isSearching: Function,
    setSearchDetails:Function,
    error: string | boolean,
    setError: Function

             
}

export default function Search({setSearchType, searchType,setSearchDetails, isSearching, error, setError }: SearchProps) {
    const input_1 = useRef<any>() 
    const input_2 = useRef<any>()
    const [exampleBtn,setExampleBtn] = useState(false)

    const _InputConatinerStylesForCoords = {width:'initial'}
    const _InputStylesForCoords = {
        border: '1px solid white',
        width: 'initial',
        paddingLeft: '0em'
    };

    const cityExamples = ['Toronto,CA', 'Las Vegas,US', 'London,UK','Phoenix,US','Ottawa,CA'];
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
                let result:[boolean,string?] = type1_TEST(input_1.current.value)
                if (result[0]) {
                    setSearchDetails(input_1.current.value.split(','))

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
        setExampleBtn(false)
        setSearchType(0)
        isSearching(true)
        input_1.current.value = '';

    }
    function handleToggleSearchType(e: any) {
        setExampleBtn(false)
        if(!searchType || searchType === 1) setSearchType(2)
        else setSearchType(1)
        input_1.current.value = '';
    }
    function showExample() {
        if(searchType === 1 || searchType === 0)
            input_1.current.value = cityExamples[Math.floor(Math.random() * 5)]
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
                style={searchType === 2 ? _InputStylesForCoords : {}}
                type="text"
                placeholder={searchType === 2  ? 'Enter Latitude' : 'City Name,Country Code(Alpha-2)'}
            />
            {searchType === 2 &&
            <input
                ref={input_2}
                style={_InputStylesForCoords}
                type="text"
                placeholder='Enter Longitude' />
            }
            <SearchIcon onClick={() => handleStartSearch()} />
            
            </div>
            <div className="searchOC">
                <div className="btn btn-a" onClick={handleMyLocation}>My Location</div>
                <div className="btn btn-b" onClick={ handleToggleSearchType}>{!searchType || searchType === 1 ? 'Use Coordinates' : 'Use City Name' }</div>
        </div>
        {exampleBtn && <div onClick={()=> showExample()} className="btn btn-b">See Examples</div> }
        <div style={error ? { opacity: '1', marginTop: '-1em' } : {}} className="msg">{error}</div>
        {/* <div ref={exampleMessage} style={exampleVisable ? { opacity: '1', marginTop: '-3.5em' } : {}} className="msg msg_2"></div> */}
    </section>
}

function type1_TEST(city: String):[boolean,string?] {
    const chars = 'AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz, ';
    if (!city) return [false, 'Empty Search Query'];
    for (let i = 0; i < city.length; i++){
        if (!chars.includes(city[i])) return [false, 'Search Query contains invalid characters'];
    };
    if (!city.includes(',')) return [false, 'Comma must seperate City and Country'];

    let query = city.split(',').map((entry) =>entry.trim().toLocaleLowerCase());
    if (query[1].length !== 2) return [false, 'Invalid Country Code'];

    return [true];
}

function type2_TEST(lat: number, lon: number) {

    if ((lat && lon) && !isNaN(+lat + +lon)) {
        if (lat >= -90 && lat <= 90) {
            if(lon >= -180 && lon <= 180) return true
        }
    }
    return false
}

