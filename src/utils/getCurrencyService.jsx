
import axios from 'axios';
import { useEffect, useState } from 'react';

export default  function getCurrencyByCountry ()  {
    const [location , setLocation] = useState(false)
    const [countries, setCountries] = useState([]);
    let currencyCode = '';
    let countryCurrencySymbol = ''

    const getUserLocation =  () => {
      axios.get('https://restcountries.com/v3.1/all')
    .then((response) => {
      setCountries(response.data);
    })
      axios.get('http://ip-api.com/json/?fields=61439').then(res => {                   
        setLocation(res.data.countryCode)
        
      });
    };

   useEffect(() => {
    !location && getUserLocation()
   }, []) 

      
      countries.some(item => {
        if(item.cca2 == location) {
          
            currencyCode = Object.keys(item.currencies)[0]
            countryCurrencySymbol = Object.values(item.currencies)[0].symbol
        };
      })

      return {currencyCode, countryCurrencySymbol}
       
      
      
 
  };