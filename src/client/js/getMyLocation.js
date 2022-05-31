// Get user location
const getMyLocation = () => new Promise(
  (resolve, reject) => {
    window.navigator.geolocation.getCurrentPosition(
      position => {
        const myLocation = {
          lat:position.coords.latitude,
          long:position.coords.longitude
        };
        resolve(myLocation); // Resolve with location. location can now be accessed in the .then method.
      },
      err => reject(err) // Reject with err. err can now be accessed in the .catch method.
    );
  }
);
export {getMyLocation}
