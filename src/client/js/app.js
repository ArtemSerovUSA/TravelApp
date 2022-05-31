import {getMyLocation} from "./getMyLocation.js";
/* Global Variables */
// Geonames API
const geonamesUsername = '&username=artemserovusa';
const geonamesBase = 'http://api.geonames.org/searchJSON?name_equals=';
const geonamesMaxRows = '&maxRows=1'
// Weatherbit API
const weatherbitCurrentBase = 'https://api.weatherbit.io/v2.0/current?'
const weatherbitForecastBase = 'https://api.weatherbit.io/v2.0/forecast/daily?'
const weatherbitKey = '&key=e4469fb48f184e38ba74734979d06061'
// Pixabay API
const pixabayKey = '&key=27421307-60b6a0b5527370cac8e4aff35&q='
const pixabayBase = 'https://pixabay.com/api/?image_type=photo&category=travel'
// ApiOcean API
const rapidApiKey ="6dea080f29msh8ffc60412466852p14b9d8jsn5f3968e543a3"
const apiOceanOptions = {
	method: 'GET',
	headers: {
		'Content-Type': 'application/json',
		'X-RapidAPI-Host': 'distance-calculator.p.rapidapi.com',
		'X-RapidAPI-Key': rapidApiKey
	}
}
const apiOceanBase = 'https://distance-calculator.p.rapidapi.com/distance/simple?unit=miles'
// Function to calculate distance between coordinates
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1);
  var a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ;
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = R * c * 0.6214; // Distance in miles
  return Math.round(d);
}
function deg2rad(deg) {
  return deg * (Math.PI/180)
}

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = (d.getMonth()+1) +'/'+ d.getDate()+'/'+ d.getFullYear();
// Update current Date
document.getElementById("current_date").innerHTML = `Today's date is <br>${newDate}`

// Capitallize function
function capitalize(str) {
  const lower = str.toLowerCase()
  return str.charAt(0).toUpperCase() + lower.slice(1)
}
// DateDiff in days
const dateDiff = (date1, date2) => {
  return (date2.getTime() - date1.getTime()) / (1000 * 3600 * 24);
}
// Add days function
Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}
// GET Request to geonames API
const getDataGeonames = async (geonamesBase, myCity, geonamesMaxRows, geonamesUsername) => {
    const url = geonamesBase+myCity+geonamesMaxRows+geonamesUsername;
    const request = await fetch(url);
    try {
        const allData = await request.json();
        return allData;
    }catch (e) {
        console.log("We've got an ERROR:", e);
    }
}
// GET Request to Weatherbit API
const getDataWeatherbit = async (base, weatherbitKey, lat, lon) => {
    const url = base + lat + lon + weatherbitKey
    const request = await fetch(url);
    try {
        const allData = await request.json();
        return allData;
    }catch (e) {
        console.log("We've got an ERROR:", e);
    }
}
// GET Request to Pixabay API
const getDataPixabay = async (pixabayBase, pixabayKey, city) => {
    const url = pixabayBase + pixabayKey + city
    const request = await fetch(url);
    try {
        const allData = await request.json();
        return allData;
    }catch (e) {
        console.log("We've got an ERROR:", e);
    }
}
// Get Request to ApiOcean to calculate the distance
const getDistance = async (apiOceanBase, lat1, long1, lat2, long2) => {
    const url = apiOceanBase + lat1 + long1 + lat2 + long2
    const request = await fetch(url, apiOceanOptions);
    try {
        const allData = await request.json();
        return allData;
    }catch (e) {
        console.log("We've got an ERROR:", e);
    }
}
// POST
const postData = async (url = '', data = {}) => {
    const response = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    try {
        const newData = await response.json();
        return newData
    }catch(e) {
        console.log("We've got an ERROR:", e);
    }
};
// Add Picture
const addPicture = async () => {
    const request = await fetch('/all');
    try {
        const data = await request.json();
        let img = document.createElement("img");
        img.setAttribute('id', 'myPicture');
        document.getElementById('picture').append(img);
        const myImage = document.getElementById('myPicture');
        myImage.src = data.picture_link;
    } catch (e) {
        console.log("We've got an ERROR:", e);
    }
}
// Add message that there is no Image for this city
const noImageMessage = () => {
	let p = document.createElement('p');
	document.getElementById('picture').append(p);
	document.getElementById("picture").lastChild.innerHTML = "Sorry, we don't have a picture for this city"
}
// Add message that we couldn't find such city
const noCityMessage = () => {
	let p = document.createElement('p');
	document.getElementById('picture').append(p);
	document.getElementById("picture").lastChild.innerHTML = "Sorry, we didn't find such city"
}
// Add message that we couldn't find such city
const emptyCityMessage = () => {
	let p = document.createElement('p');
	document.getElementById('picture').append(p);
	document.getElementById("picture").lastChild.innerHTML = "Sorry, you didn't fill out travel destination"
}
// Delete Childs of specified parent (by id)
const deleteChilds = (id) => {
  const p = document.getElementById(id);
  let f = p.firstElementChild;
  while (f) {
    f.remove();
    f = p.firstElementChild;
  }
}
// Clean UI
const cleanUI = () => {
    try {
        // Delete picture
        deleteChilds('picture');
        deleteChilds('distance');
				// Hide holder for weather
				let blank = document.getElementById("holder");
        blank.setAttribute('id', 'blank');
				let present = document.getElementById("present");
        present.setAttribute('id', 'hidden');
        // Delete parameters
        document.getElementById('title').innerHTML = "";
        document.getElementById('date').innerHTML = "";
        document.getElementById('temp').innerHTML = "";
        document.getElementById('wind').innerHTML = "";
        document.getElementById('clouds').innerHTML = "";
        // Delete values
        deleteChilds('values')
    } catch (e) {}
}
// Update UI with calcelated distance
const updateUIdistance = async (distance) => {
        const myCity = document.getElementById('myCity').value;
        let p = document.createElement("p");
        document.getElementById('distance').append(p);
        document.getElementById('distance').lastElementChild.innerHTML = `You are ${distance} miles away from ${capitalize(myCity)}`;
}
// Update UI with current weather
const updateUIcurrent = async () => {
    const request = await fetch('/all');
    try {
        const data = await request.json();
				let blank = document.getElementById("blank");
        blank.setAttribute('id', 'holder');
				let hidden = document.getElementById("hidden");
        hidden.setAttribute('id', 'present');
        const myCity = document.getElementById('myCity').value;
        document.getElementById('title').innerHTML = `Current Weather For ${capitalize(myCity)}, ${data.country}`;
        document.getElementById('date').innerHTML = `Date:`;
        document.getElementById('temp').innerHTML = `Temperature &#8451:`;
        document.getElementById('wind').innerHTML = `Wind speed(m/s):`;
        document.getElementById('clouds').innerHTML = `Clouds(%):`;
        let div = document.createElement("div");
        document.getElementById('values').append(div);
        document.getElementById('values').lastElementChild.innerHTML =
        `
        ${newDate}<br>
        ${data.temp}<br>
        ${data.wind}<br>
        ${data.clouds}
        `;
    } catch (e) {
        console.log("We've got an ERROR:", e);
    }
};
// Update UI with forecast weather
const updateUIforecast = async () => {
    const request = await fetch('/all');
    try {
        const data = await request.json();
				let blank = document.getElementById("blank");
        blank.setAttribute('id', 'holder');
				let hidden = document.getElementById("hidden");
        hidden.setAttribute('id', 'present');
        const myCity = document.getElementById('myCity').value;
        document.getElementById('title').innerHTML = `7 Days Weather Forecast For ${capitalize(myCity)}, ${data.country_code}`;
        document.getElementById('date').innerHTML = `Date:`;
        document.getElementById('temp').innerHTML = `Temperature &#8451:`;
        document.getElementById('wind').innerHTML = `Wind speed(m/s):`;
        document.getElementById('clouds').innerHTML = `Clouds(%):`;
        for (let i = 0; i < 7; i++) {
          let current_date = new Date(newDate);
          let div = document.createElement("div");
          document.getElementById('values').append(div);
          document.getElementById('values').lastElementChild.innerHTML =
          `
          ${current_date.addDays(i).toLocaleDateString("en-US")}<br>
          ${data.data[i].temp}<br>
          ${data.data[i].wind_spd}<br>
          ${data.data[i].clouds}
          `;
        }
    } catch (e) {
        console.log("We've got an ERROR:", e);
    }
};
function generate() {
    cleanUI();
		const myCity = document.getElementById('myCity').value;
    let myDate = document.getElementById('datepicker').value;
		if (myCity == '') {
			emptyCityMessage()
		}
		else {
			// Start the chain of requests with Get Data from Geonames
	    getDataGeonames(geonamesBase, myCity, geonamesMaxRows, geonamesUsername)
	        .then(function (data){
	            const lat = '&lat=' + data.geonames[0].lat;
	            const lon = '&lon=' + data.geonames[0].lng;
							// Get data from pixabay
					    getDataPixabay(pixabayBase, pixabayKey, myCity)
					        .then(function (data){
					          // Post Data
					          postData('/add',{
					              picture_link: data.hits[0].largeImageURL
					            });
									})
					        .then(() => addPicture())
									.catch((error) => {
										console.log('There is no picture for this city', error);
										noImageMessage();
									});
	            // Block to calculate distance
	            getMyLocation()
	              .then(myLocation => {
	                const myLat = myLocation.lat;
	                const myLong = myLocation.long;
	                const cityLat = data.geonames[0].lat;
	                const cityLong = data.geonames[0].lng;
	                updateUIdistance(getDistanceFromLatLonInKm(myLat, myLong, cityLat, cityLong));
	                })
	              .catch(error => console.log(error));
	            //
	            myDate = new Date(myDate);
	            const current_date = new Date(newDate);
	            if ((dateDiff(myDate, current_date) >= -7) && (dateDiff(myDate, current_date) <= 0))  {
	              console.log('within 7 days - show current')
	              // Get data from weatherbit
	              getDataWeatherbit(weatherbitCurrentBase, weatherbitKey, lat, lon)
	                  .then(function (data){
	                    // Post Data
	                    postData('/add',{
	                        country: data.data[0].country_code,
	                        temp: data.data[0].temp,
	                        wind: data.data[0].wind_spd,
	                        clouds: data.data[0].clouds
	                    });
	                  })
	                  // Update UI
	                .then(() => updateUIcurrent());
	            }else {
	              console.log('not within 7 days - show 7 forecast')
	              getDataWeatherbit(weatherbitForecastBase, weatherbitKey, lat, lon)
	                  .then(function (data){
	                    // Post Data
	                    postData('/add',data);
	                  })
	                  // Update UI
	                  .then(() => updateUIforecast());
	            }
						})
						//IF COULDN't FIND A CITY
						.catch((error) => {
							console.log('There is no such city');
							noCityMessage();
						});
			}
};

export {
	getDistanceFromLatLonInKm,
	deg2rad,
	getMyLocation,
	capitalize,
	dateDiff,
	/*addDays,*/
	getDataGeonames,
	getDataWeatherbit,
	getDataPixabay,
	getDistance,
	postData,
	addPicture,
	noImageMessage,
	noCityMessage,
	emptyCityMessage,
	deleteChilds,
	cleanUI,
	updateUIdistance,
	updateUIcurrent,
	updateUIforecast,
	generate
};
