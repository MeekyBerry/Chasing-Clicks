// Build a web page  with a clickable button and a click count. Every time that the button is clicked, the number increases by 1. When the web page is refreshed, the click count number should reflect all previous clicks. That means, refreshing the page should not reset the count to 0 or any other default number.
import React, { useState, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
// import Cookies from "js-cookie";
import app from "../config";
import "firebase/compat/firestore";
import firebase from "firebase/compat/app";

// const db = app.firestore();

mapboxgl.accessToken =
  "pk.eyJ1IjoibWlra3lsYW5reSIsImEiOiJjbGV2dXI3eTQwYTg2M3JvNGVxbWptNmJ3In0.xuQVWBqJAcjqBOTa_CbJgA";
  import { useEffect, useState, useRef } from 'react';
  import mapboxgl from 'mapbox-gl';
  import firebase from 'firebase/app';
  import 'firebase/firestore';

  const ClickCounter = () => {
    const [map, setMap] = useState(null);
    const [buttonCount, setButtonCount] = useState(0);
    const [clicksByLocation, setClicksByLocation] = useState({});
    const [firebaseError, setFirebaseError] = useState('');

    const mapContainerRef = useRef(null);

    useEffect(() => {
      const initializeMap = ({ setMap, mapContainer }) => {
        const mapboxMap = new mapboxgl.Map({
          container: mapContainer,
          style: 'mapbox://styles/mapbox/streets-v11',
          center: [-96, 37.8],
          zoom: 3
        });

        mapboxMap.on('load', () => {
          setMap(mapboxMap);
        });
      };

      if (!map) {
        initializeMap({ setMap, mapContainer: mapContainerRef.current });
      }

      const incrementCount = () => {
        setButtonCount(prevCount => prevCount + 1);
      };

      const handleClick = ({ lngLat }) => {
        const { lng, lat } = lngLat;

        incrementCount();

        const db = firebase.firestore();
        const locationString = `${lng.toFixed(6)},${lat.toFixed(6)}`;

        db.collection('clicks')
          .doc(locationString)
          .set({ count: firebase.firestore.FieldValue.increment(1) }, { merge: true })
          .then(() => {
            console.log(`Click recorded at ${locationString}`);
          })
          .catch(error => {
            setFirebaseError(`Error saving count: ${error.message}`);
          });
      };

      if (map) {
        map.on('click', handleClick);
      }

      return () => {
        if (map) {
          map.off('click', handleClick);
        }
      };
    }, [map]);

    useEffect(() => {
      const db = firebase.firestore();

      db.collection('clicks')
        .get()
        .then(querySnapshot => {
          const clicksByLocation = {};

          querySnapshot.forEach(doc => {
            clicksByLocation[doc.id] = doc.data().count;
          });

          setClicksByLocation(clicksByLocation);
        })
        .catch(error => {
          console.error(`Error retrieving clicks by location: ${error}`);
          setFirebaseError(`Error retrieving clicks by location: ${error.message}`);
        });
    }, []);

    return (
      <div>
        <div ref={mapContainerRef} style={{ width: '100%', height: '200px' }}></div>
        <div>
          <p>Button clicked {buttonCount} times</p>
          <ul>
            {Object.entries(clicksByLocation).map(([location, count]) => (
              <li key={location}>
                {location}: {count} clicks
              </li>
            ))}
          </ul>
          {firebaseError && <p>{firebaseError}</p>}
        </div>
      </div>
    );
  };
  // const [count, setCount] = useState(() => {
  //   const value = localStorage.getItem("count");
  //   return value !== null ? JSON.parse(value) : 0;
  // });
  // const [state, setState] = useState(() => {
  //   const value = localStorage.getItem("state");
  //   return value !== null ? JSON.parse(value) : "";
  // });
  // const [country, setCountry] = useState(() => {
  //   const value = localStorage.getItem("country");
  //   return value !== null ? JSON.parse(value) : "";
  // });
  // const [clicksByLocation, setClicksByLocation] = useState(() => {
  //   const value = localStorage.getItem("clicksByLocation");
  //   return value !== null ? JSON.parse(value) : {};
  // });
  // const [map, setMap] = useState(null);


  // useEffect(() => {
  //   db.collection("clicks")
  //     .doc("count")
  //     .get()
  //     .then((doc) => {
  //       if (doc.exists) {
  //         const data = doc.data();
  //         console.log(data);
  //         setCount(data.count);
  //       }
  //     });

  //   db.collection("clicks")
  //     .doc("clicksByLocation")
  //     .get()
  //     .then((doc) => {
  //       if (doc.exists) {
  //         const data = doc.data();
  //         console.log(data);
  //         setClicksByLocation(data);
  //       }
  //     });

  //   const map = new mapboxgl.Map({
  //     container: "map",
  //     style: "mapbox://styles/mapbox/streets-v11",
  //     center: [-74.5, 40],
  //     zoom: 9,
  //   });
  //   setMap(map);

  //   return () => map.remove();
  // }, []);

  // useEffect(() => {
  //   console.log("clicksByLocation", clicksByLocation);
  //   // Get previous count from database
  //   db.collection("clicks")
  //     .doc("count")
  //     .get()
  //     .then((doc) => {
  //       const previousCount = doc.data().count;
  //       // Add new count to previous count`
  //       const updatedCount = previousCount + count;

  //       db.collection("clicks")
  //         .doc("count")
  //         .set({ count: updatedCount })
  //         .then(() => {
  //           console.log("Count saved!");
  //         })
  //         .catch((error) => {
  //           console.log("Error saving count: ", error);
  //         })
  //         .catch((error) => {
  //           console.log("Error getting count: ", error);
  //         });
  //     });

  //   db.collection("clicks")
  //     .doc("clicksByLocation")
  //     .get()
  //     .then((doc) => {
  //       const previousClicksByLocation = doc.data();
  //       // Add new count to previous count`
  //       const updatedClicksByLocation = {
  //         ...previousClicksByLocation,
  //         ...clicksByLocation,
  //       };

  //       db.collection("clicks")
  //         .doc("clicksByLocation")
  //         .set(updatedClicksByLocation)
  //         .then(() => {
  //           console.log("Clicks by location saved!");
  //         })
  //         .catch((error) => {
  //           console.log("Error saving clicks by location: ", error);
  //         })
  //         .catch((error) => {
  //           console.log("Error getting clicks by location: ", error);
  //         });
  //     });

  // }, [count, clicksByLocation]);

  // //   localStorage.setItem("count", JSON.stringify(count));
  // //   localStorage.setItem("state", JSON.stringify(state));
  // // localStorage.setItem("country", JSON.stringify(country));
  // // localStorage.setItem("clicksByLocation", JSON.stringify(clicksByLocation));

  // useEffect(() => {
  //   localStorage.setItem("count", JSON.stringify(count));
  //   localStorage.setItem("state", JSON.stringify(state));
  //   localStorage.setItem("country", JSON.stringify(country));
  //   localStorage.setItem("clicksByLocation", JSON.stringify(clicksByLocation));
  // }, [count, state, country, clicksByLocation]);


  // const handleButtonClick = async () => {
  //   const increasedCount = count + 1;
  //   navigator.geolocation.getCurrentPosition(
  //     async (position) => {
  //       const { latitude, longitude } = position.coords;
  //       const response = await fetch(
  //         `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${mapboxgl.accessToken}`
  //       );
  //       const data = await response.json();
  //       console.log(data);
  //       const { place_name } = data.features[0];
  //       const [country, state] = place_name.split(",").reverse();
  //       setState(state);
  //       setCountry(country);
  //       const newClicksByLocation = {
  //         ...clicksByLocation,
  //         [increasedCount]: {
  //           location: place_name,
  //           count: increasedCount,
  //         },
  //       };
  //       setClicksByLocation(newClicksByLocation);
  //       map.flyTo({
  //         center: [longitude, latitude],
  //         essential: true,
  //       });
  //       new mapboxgl.Marker().setLngLat([longitude, latitude]).addTo(map);
  //     },
  //     (error) => {
  //       console.log(error);
  //     }
  //   );
  //   setCount(increasedCount);
  // };

  // //reset function for both local storage and databse;
  // const reset = () => {
  //   setCount(0);
  //   setState("");
  //   setCountry("");
  //   setClicksByLocation({});
  //   localStorage.clear();
  //   db.collection("clicks")
  //     .doc("count")
  //     .set({ count: 0 })
  //     .then(() => {
  //       console.log("Count cleared!");
  //     })
  //     .catch((error) => {
  //       console.log("Error clear: ", error);
  //     })
  //     .catch((error) => {
  //       console.log("Error clearing: ", error);
  //     });
  //   db.collection("clicks")
  //     .doc("clicksByLocation")
  //     .set({})
  //     .then(() => {
  //       console.log("Clicks by location saved!");
  //     })
  //     .catch((error) => {
  //       console.log("Error saving clicks by location: ", error);
  //     })
  //     .catch((error) => {
  //       console.log("Error getting clicks by location: ", error);
  //     });
  // };

  // return (
  //   <div className="click">
  //     <h1 className="click--title">Chasing D clicks</h1>
  //     {count > 0 && (
  //       <p className="click--text">
  //         You have clicked the button{" "}
  //         <strong className="click--text__count">{count}</strong> times.
  //       </p>
  //     )}
  //     {state && country && (
  //       <p className="click--text">
  //         Your last click was in{" "}
  //         <strong className="click--text__location">{state}</strong>,{" "}
  //         <strong className="click--text__location">{country}</strong>
  //         <span className="click--text__location__mark">!</span>
  //       </p>
  //     )}
  //     <button onClick={handleButtonClick} className="click--btn">
  //       Click Me
  //     </button>
  //     <button onClick={reset} className="click--btn">
  //       Reset
  //     </button>
  //     <div className="click--map">
  //       <div
  //         id="map"
  //         style={{ width: "100%", height: "100%", borderRadius: ".5rem" }}
  //       ></div>
  //     </div>
  //     {Object.keys(clicksByLocation).length > 0 && (
  //       <div className="click--locationCount">
  //         <h2 className="click--locationCount__head">Clicked Locations</h2>
  //         <ul className="click--locationCount__list">
  //           <li className="click--locationCount__list--container">
  //             <h2 className="click--locationCount__list--container__title">
  //               Locations
  //             </h2>
  //             <h2 className="click--locationCount__list--container__title">
  //               Clicks #
  //             </h2>
  //           </li>
  //           {Object.keys(clicksByLocation).map((key) => (
  //             <li key={key} className="click--locationCount__list__item">
  //               <p className="click--locationCount__list__item__location">
  //                 {clicksByLocation[key].location}
  //               </p>
  //               <p className="click--locationCount__list__item__count">
  //                 {clicksByLocation[key].count}
  //               </p>
  //             </li>
  //           ))}
  //         </ul>
  //       </div>
  //     )}
  //   </div>
  // );
};

export default ClickCounter;

// const ClickCounter = () => {
// const [count, setCount] = useState(() => {
//   const value = localStorage.getItem("count");
//   return value !== null ? JSON.parse(value) : 0;
// });
// const [count, setCount] = useState(() => {
//   const value = Cookies.get("count");
//   return value !== undefined ? parseInt(value) : 0;
// });
// const [state, setState] = useState(() => {
//   const value = localStorage.getItem("state");
//   return value !== null ? JSON.parse(value) : "";
// });
// const [country, setCountry] = useState(() => {
//   const value = localStorage.getItem("country");
//   return value !== null ? JSON.parse(value) : "";
// });
// const [clicks, setClicks] = useState(() => {
//   const value = Cookies.get("clicks");
//   return value !== undefined ? JSON.parse(value) : [];
// });
// const [lastClick, setLastClick] = useState({ location: "", count: 0 });
// const [lastClick, setLastClick] = useState(() => {
//   const value = Cookies.get("lastClick");
//   return value !== undefined ? JSON.parse(value) : { location: "", count: 0 };
// });
// const [clicksByLocation, setClicksByLocation] = useState(() => {
//   const value = localStorage.getItem("clicksByLocation");
//   return value !== null ? JSON.parse(value) : {};
// });
// const [clicksByLocation, setClicksByLocation] = useState(() => {
//   const value = Cookies.get("clicksByLocation");
//   return value !== undefined ? JSON.parse(value) : {};
// });
// const [map, setMap] = useState(null);

// useEffect(() => {
//   const savedCount = JSON.parse(localStorage.getItem("count"));

//   if (savedCount) {
//     setCount(savedCount);
//   }

//   const savedState = JSON.parse(localStorage.getItem("state"));

//   if (savedState) {
//     setState(savedState);
//   }

//   const savedCountry = JSON.parse(localStorage.getItem("country"));

//   if (savedCountry) {
//     setCountry(savedCountry);
//   }

//   const savedClicks = JSON.parse(localStorage.getItem("clicks"));

//   if (savedClicks) {
//     setClicks(savedClicks);
//   }

//   const savedClicksByLocation = JSON.parse(
//     localStorage.getItem("clicksByLocation")
//   );

//   if (savedClicksByLocation) {
//     setClicksByLocation(savedClicksByLocation);
//   }

//   const map = new mapboxgl.Map({
//     container: "map",
//     style: "mapbox://styles/mapbox/streets-v11",
//     center: [-74.5, 40],
//     zoom: 9,
//   });
//   setMap(map);

//   return () => map.remove();
// }, []);

// useEffect(() => {
//   localStorage.setItem("count", JSON.stringify(count));
// }, [count]);
// useEffect(() => {
//   Cookies.set("count", count);
// }, [count]);

// useEffect(() => {
//   localStorage.setItem("state", JSON.stringify(state));
// }, [state]);

// useEffect(() => {
//   localStorage.setItem("country", JSON.stringify(country));
// }, [country]);

// useEffect(() => {
//   Cookies.set("clicks", JSON.stringify(clicks));
// }, [clicks]);

// useEffect(() => {
//   Cookies.set("lastClick", JSON.stringify(lastClick));
// }, [lastClick]);
// useEffect(() => {
//   localStorage.setItem("clicksByLocation", JSON.stringify(clicksByLocation));
//   setCount(
//     Object.values(clicksByLocation).reduce((acc, val) => acc + val, 0)
//   );
// }, [clicksByLocation]);
// useEffect(() => {
//   Cookies.set("clicksByLocation", JSON.stringify(clicksByLocation));
//   setCount(
//     Object.values(clicksByLocation).reduce((acc, val) => acc + val, 0)
//   );
// }, [clicksByLocation]);

// const handleButtonClick = async () => {
//   const increasedCount = count + 1;
//   navigator.geolocation.getCurrentPosition(
//     async (position) => {
//       const { latitude, longitude } = position.coords;
//       const response = await fetch(
//         `https://api.mapbox.com/geocoding/v5/mapbox.places/${
//           longitude + "," + latitude
//         }.json?access_token=${mapboxgl.accessToken}`
//       );
//       const data = await response.json();
//       const { place_name } = data.features[0];
//       const [country, state] = place_name.split(",").reverse();
//       setState(state);
//       setCountry(country);
//       setClicks((prevClicks) => [
//         ...prevClicks,
//         { location: place_name, count: increasedCount },
//       ]);
//       setLastClick({ location: place_name, count: increasedCount });
//       setClicksByLocation({
//         ...clicksByLocation,
//         [place_name]: increasedCount,
//       });
//       if (map) {
//         const popup = new mapboxgl.Popup().setHTML(place_name);
//         new mapboxgl.Marker()
//           .setLngLat([longitude, latitude])
//           .setPopup(popup)
//           .addTo(map);
//         map.flyTo({
//           center: [longitude, latitude],
//           essential: true,
//           zoom: 9,
//         });
//       }
//     },
//     (error) => {
//       console.error(error);
//     }
//   );
//   setCount((prevCount) => prevCount + 1);
// };

// return (
//   <div className="click">
//     <h1 className="click--title">Chasing D clicks</h1>
//     {lastClick.count > 0 && (
//       <p className="click--text">
//         I have been clicked{" "}
//         <strong className="click--text__count">{lastClick.count}</strong>{" "}
//         times in total.
//       </p>
//     )}
//     {state && country && (
//       <p className="click--text">
//         You clicked me from{" "}
//         <strong className="click--text__location">{state}</strong>,
//         <strong className="click--text__location">{country}</strong>
//         <span className="click--text__location__mark">!</span>
//       </p>
//     )}
{
  /* Conditionally render count
      {count > 0 && (
        <p className="click--text">
          I have been clicked{" "}
          <strong className="click--text__count">{count}</strong> times in
          total.
        </p> */
}
{
  /* )} */
}
{
  /* Conditionally render state and country */
}
{
  /* {state && country && (
        <p className="click--text">
          You clicked me from{" "}
          <strong className="click--text__location">{state},</strong>{" "}
          <strong className="click--text__location">{country}</strong>
          <span className="click--text__location__mark">!</span>
        </p> */
}
{
  /* )} */
}
// <button type="button" onClick={handleButtonClick} className="click--btn">
//   Click Me
// </button>
// <div className="click--map">
//   <div
//     id="map"
//     style={{ width: "100%", height: "100%", borderRadius: ".5rem" }}
//   ></div>
// </div>
// {/* Conditionally render clicks by location */}
// {Object.keys(clicksByLocation).length > 0 && (
//   <div className="click--locationCount">
//     <h2 className="click--locationCount__head">Clicked Locations</h2>
//     <ul className="click--locationCount__list">
//       <li className="click--locationCount__list--container">
//         <h2 className="click--locationCount__list--container__title">
//           Locations
//         </h2>
//         <h2 className="click--locationCount__list--container__title">
//           Clicks #
//         </h2>
//       </li>
//             {Object.keys(clicksByLocation).map((location) => (
//               <li key={location} className="click--locationCount__list__item">
//                 <p className="click--locationCount__list__item__location">
//                   {lastClick.location}
//                 </p>
//                 <p className="click--locationCount__list__item__count">
//                   {clicksByLocation[lastClick.location]}
//                 </p>
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ClickCounter;
