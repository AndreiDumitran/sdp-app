import React from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox";
import { formatRelative } from "date-fns";
import { center, GetBrowserGeoLocation } from "./components/getBrowserLocation";

import "@reach/combobox/styles.css";
import { DisplayPlacesList, radius } from "./components/displayPlaces";

import { Button, Container, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const libraries = ["places"];
const mapContainerStyle = {
  width: "100vw",
  height: "60vh",
};

const options = {
  mapTypeControl: false,
  fullscreenControl: false,
  streetViewControl: false,
};

function App() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const [location, setLocation] = React.useState([]);
  React.useEffect(() => {
    if (navigator.geolocation) {
      //navigator.geolocation.getCurrentPosition(showPosition);
      navigator.geolocation.getCurrentPosition((data) => {
        setLocation({
          lat: data.coords.latitude,
          lng: data.coords.longitude,
        });
      });
    }
  }, []);

  GetBrowserGeoLocation();
  const [markers, setMarkers] = React.useState([]);
  const [selected, setSelected] = React.useState(null);
  const onMapClick = React.useCallback((event) => {
    setMarkers((current) => [
      ...current,
      {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
        time: new Date(),
      },
    ]);
  }, []);

  const mapRef = React.useRef();
  const onMapLoad = React.useCallback((map) => {
    mapRef.current = map;
  }, []);

  const panTo = React.useCallback(({ lat, lng }) => {
    mapRef.current.panTo({ lat, lng });
    mapRef.current.setZoom(17);
  }, []);
  if (loadError) return "Error loading maps";
  if (!isLoaded) return "Loading Maps";

  return (
    <Container>
      <Row>
        <Col>
          <Search panTo={panTo} />
        </Col>
        <Col>
          <Locate panTo={panTo} />
        </Col>
      </Row>
      <Row>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={15}
          center={location}
          options={options}
          onClick={onMapClick}
          onLoad={onMapLoad}
        >
          {markers.map((marker) => (
            <Marker
              key={marker.time.toISOString()}
              position={{ lat: marker.lat, lng: marker.lng }}
              onClick={() => {
                setSelected(marker);
              }}
            />
          ))}

          {selected ? (
            <InfoWindow
              position={{ lat: selected.lat, lng: selected.lng }}
              onCloseClick={() => {
                setSelected(null);
              }}
            >
              <div>
                <h1>Hello</h1>
                <p>Clicked {formatRelative(selected.time, new Date())}</p>
              </div>
            </InfoWindow>
          ) : null}
        </GoogleMap>
        <DisplayPlacesList location={location} />
      </Row>
    </Container>
  );
}
export default App;
function Locate({ panTo }) {
  return (
    <Button
      className="locate"
      onClick={() => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            panTo({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          () => null,
          options
        );
      }}
    >
      <img src="compass.svg" alt="compass - locate me" />
    </Button>
  );
}

function Search({ panTo }) {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      location: { lat: () => center.lat, lng: () => center.lng },
      radius: radius,
    },
  });

  return (
    <div className="search">
      <Combobox
        onSelect={async (address) => {
          setValue(address, false);
          clearSuggestions();
          try {
            const results = await getGeocode({ address });
            const { lat, lng } = await getLatLng(results[0]);
            panTo({ lat, lng });
          } catch (error) {
            console.log("error!");
          }
        }}
      >
        <ComboboxInput
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
          }}
          disable={!ready}
          placeholder="Enter your Point of Interest"
        />
        <ComboboxPopover>
          <ComboboxList>
            {status === "OK" &&
              data.map(({ id, description }) => (
                <ComboboxOption key={id} value={description} />
              ))}
          </ComboboxList>
        </ComboboxPopover>
      </Combobox>
    </div>
  );
}
