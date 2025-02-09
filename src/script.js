const city_input_element = document.getElementById("city");
const weather_element = document.getElementById("weather");
const temperature_main_element = document.getElementById("temperature_main");
const weather_description_element = document.getElementById("weather-description");
const weather_icon_element = document.getElementById("icon");
const temperature_element = document.getElementById("temperature");
const wind_speed_element = document.getElementById("wind-speed");
const humidity_element = document.getElementById("humidity");
const country_element = document.getElementById("country");
const town_element = document.getElementById("town");
const search_button_element = document.getElementById("searchBtn");


const apiKey = '0134ad125393361dbffedc2740a51d76';

function getWeatherDetails(name, lat,lon, country, state){
    let FORCAST_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`,
    WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`,
    days=[
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday'
    ],
    months = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec'

    ];

    fetch(WEATHER_API_URL).then(res => res.json()).then(data => {
       console.log(data);
       let date = new Date();
    }).catch(() => {
        alert(`failed to catch current weather`);
    })
}

function getCityCoordinates(){
    let cityName = city_input_element.value.trim();
    console.log(cityName);
    city_input_element.value = '';
    if(!cityName) return;

    let GEOCODING_API_URL =`http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`;

    fetch(GEOCODING_API_URL).then(res => res.json()).then(data => {
        console.log(data);
        let{name, lat, lon, country, state} = data[0];

        getWeatherDetails(name, lat, lon, country, state);
    }).catch(()=> {
        alert(`failed to fetch coordinates of ${cityName}`)
    });
}

search_button_element.addEventListener('click', getCityCoordinates);

