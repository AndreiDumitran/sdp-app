var center = {
  lat: 0,
  lng: 0,
};

export function GetBrowserGeoLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  }
}

function showPosition(position) {
  center.lat = position.coords.latitude;
  center.lng = position.coords.longitude;
}

export { center };
GetBrowserGeoLocation();

/** import React from "react";

export function GetBrowserGeoLocation() {
  const [location, setLocation] = React.useState([]);
  React.useEffect(() => {
    if (navigator.geolocation) {
      //navigator.geolocation.getCurrentPosition(showPosition);
      setLocation(navigator.geolocation.getCurrentPosition());
    }
  }, []);
  console.log(location);
  return location;
}*/
