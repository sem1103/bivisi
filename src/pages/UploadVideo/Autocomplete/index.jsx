import { useEffect } from "react";


import usePlacesAutocomplete, {
    getGeocode,
    getLatLng,
    
  } from "use-places-autocomplete";
  import useOnclickOutside from "react-cool-onclickoutside";
  
  export default function Autocomplete({isLoaded, setCenter, mapLink, setMapLink}) {
    const {
      ready,
      value,
      init,
      suggestions: { status, data },
      setValue,
      clearSuggestions,
    } = usePlacesAutocomplete({
      initOnMount:false,
      debounce: 100,
    });
    const ref = useOnclickOutside(() => {
      // When the user clicks outside of the component, we can dismiss
      // the searched suggestions by calling this method
      clearSuggestions();
    });
  
    const handleInput = (e) => {
      // Update the keyword of the input element
      setValue(e.target.value);
    };
  
    const handleSelect =
      ({ description }) =>
      () => {
        // When the user selects a place, we can replace the keyword without request data from API
        // by setting the second parameter to "false"
        setValue(description, false);
        clearSuggestions();
  
        // Get latitude and longitude via utility functions
        getGeocode({ address: description }).then((results) => {
          const { lat, lng } = getLatLng(results[0]);
          const link = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

          setCenter({lat, lng})
          setMapLink({
            url: link,
            location: description
          });

        });
      };
  
    const renderSuggestions = () =>
      data.map((suggestion) => {
        const {
          place_id,
          structured_formatting: { main_text, secondary_text },
        } = suggestion;
  
        return (
          <li key={place_id} onClick={handleSelect(suggestion)}>
            <strong>{main_text}</strong> <small>{secondary_text}</small>
          </li>
        );
      });
  

      useEffect(() => {
        if(isLoaded){
            console.log(isLoaded);
            
            init()
        }
      
      }, [isLoaded, init]);

    return (
      <div ref={ref}>
        <input
          value={value}
          onChange={handleInput}
          disabled={!ready}
          placeholder={mapLink.location}
        />
        {/* We can use the "status" to decide whether we should display the dropdown or not */}
        {status === "OK" && <ul>{renderSuggestions()}</ul>}
      </div>
    );
  };