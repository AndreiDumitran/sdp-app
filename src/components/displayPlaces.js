import React, { Component } from "react";
import { Card, Accordion, Container } from "react-bootstrap";
export let radius = 200;

export class DisplayPlacesList extends Component {
  constructor() {
    super();
    this.state = {
      places: [],
      placeType: ["point_of_interest"],
      location: {
        lat: 1,
        lng: 1,
      },
    };
  }
  // componentDidMount() {
  //   fetch(`"https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" +
  // ${this.location && this.location.lat} +
  // "," +
  // ${this.location && this.location.lng} +
  // "&radius=" +
  // ${radius} +
  // "&type=" +
  // ${this.placeType} +
  // "&key=" +
  // ${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`)
  //     .then((res) => {
  //       return res.json();
  //     })
  //     .then((res) => {
  //       let array = [];
  //       for (let googlePlace of res.results) {
  //         var place = {};
  //         var myLat = googlePlace.geometry.location.lat;
  //         var myLong = googlePlace.geometry.location.lng;
  //         var coordinate = {
  //           latitude: myLat,
  //           longitude: myLong,
  //         };
  //         place["placeTypes"] = googlePlace.types;
  //         place["coordinate"] = coordinate;
  //         place["placeId"] = googlePlace.place_id;
  //         place["placeName"] = googlePlace.name;
  //         place["formattedAddress"] = googlePlace.vicinity;
  //         place["businessStatus"] = googlePlace.business_status;
  //         place["rating"] = googlePlace.rating;
  //         place["userRating"] = googlePlace.user_ratings_total;
  //         array.push(place);
  //       }
  //       this.setState({ ...this.state, places: array });
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  //  }

  render() {
    console.log(this.props);
    return (
      <Container>
        <Accordion defaultActiveKey="0">
          {this.places &&
            this.places.map((nearbyPlaces) => (
              <Card key={nearbyPlaces.placeId}>
                <Accordion.Toggle as={Card.Header} eventKey="0">
                  {nearbyPlaces.placeName}
                </Accordion.Toggle>
                <Accordion.Collapse eventKey="0">
                  <Card.Body>
                    <p>
                      Address: {nearbyPlaces.formattedAddress} <br />
                      Business Status: {nearbyPlaces.businessStatus}
                      <br />
                      Rating: {nearbyPlaces.rating} out of{" "}
                      {nearbyPlaces.userRating}
                    </p>
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
            ))}
        </Accordion>
      </Container>
    );
  }
}
