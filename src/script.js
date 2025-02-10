const city_input_element = document.getElementById("city");
const weather_element = document.getElementById("weather");
const temperature_main_element = document.getElementById("temperature-main");
const weather_description_element = document.getElementById("weather-description");
const weather_icon_element = document.getElementById("icon");
const temperature_element = document.getElementById("temperature");
const wind_speed_element = document.getElementById("wind-speed");
const humidity_element = document.getElementById("humidity");
const country_element = document.getElementById("country");
const town_element = document.getElementById("town");
const search_button_element = document.getElementById("searchBtn");
const date_element = document.getElementById("day");
const main_icon_element = document.getElementById("main-icon");
const five_days_forecast_element = document.getElementById("day-forecast");
const location_button_element = document.getElementById("locationBtn");


const apiKey = '0134ad125393361dbffedc2740a51d76';

function getWeatherDetails(name, lat,lon, country, state){
    let FORCAST_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`,
    WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`,
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
       let date = new Date().toDateString();
       const weather = data.weather[0].main;
       const  weather_description = data.weather[0].description;
       const weather_icon = data.weather[0].icon;
       const temperature = data.main.temp;
       const humidity = data.main.humidity;
       const wind_speed = data.wind.speed;
       const country = data.sys.country;
       const town = name;

       weather_element.innerText = weather;
       country_element.innerText = country;
       town_element.innerText = town;
       temperature_main_element.innerText = `${temperature}°C`;
       weather_description_element.innerText = weather_description;
       humidity_element.innerText = `${humidity}%`;
       wind_speed_element.innerText =`${wind_speed}m/s`;
       temperature_element.innerText = `${temperature}°C`;
       main_icon_element.src = `https://openweathermap.org/img/wn/${weather_icon}@2x.png`;
       weather_icon_element.src = `https://openweathermap.org/img/wn/${weather_icon}@2x.png`;
       date_element.innerText = date;



       console.log('weather',weather);
    }).catch(() => {
        alert(`failed to catch current weather`);
    });

    fetch(FORCAST_API_URL).then(res => res.json()).then(data => {
        console.log(data);
        let uniqueForecastDays = [];
        let fiveDaysForecast = data.list.filter(forecast => {
            let forecastDate = new Date(forecast.dt_txt).getDate();
            if(!uniqueForecastDays.includes(forecastDate)){
                return uniqueForecastDays.push(forecastDate);
            }
        });
        console.log(fiveDaysForecast);
        five_days_forecast_element.innerHTML ='';

        for(i=1;i<fiveDaysForecast.length;i++){
            let date = new Date(fiveDaysForecast[i].dt_txt);
            five_days_forecast_element.innerHTML += `
            <div class="flex flex-col items-center justify-center p-5 m-2 
             bg-white/20 rounded-2xl backdrop-blur-sm shadow-2xl">
                <p class="font-semibold text-lg text-white">${date.getDate()} ${months[date.getMonth()]}</p>
                <img class="h-20 w-20" src="https://openweathermap.org/img/wn/${fiveDaysForecast[i].weather[0].icon}@2x.png" alt="weather">
                <p id="weather" class="font-bold text-lg text-white">${fiveDaysForecast[i].weather[0].main}</p>
                <p class="font-bold text-lg text-white">${fiveDaysForecast[i].main.temp}°C</p>
            </div>`
        }

    }).catch(() => {
        alert(`failed to catch current weather`);
    });
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

function getUserLocationCoordinates(){
    navigator.geolocation.getCurrentPosition(position => {
        let {latitude, longitude} = position.coords;
        console.log(latitude,longitude);
        let REVERSE_GEOCODING_URL = `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${apiKey}`;

        fetch(REVERSE_GEOCODING_URL).then(res => res.json()).then(data =>{
            let{name,country,state} = data[0];
            console.log(name);
            getWeatherDetails(name, latitude, longitude, country, state);
        }).catch(()=>{
            alert(`failed to fetch user coordinates`);
        })
    },error => {
        if(error.code === error.PERMISSION_DENIED){
            alert(`geolocation permission denied. Please allow the location permission and try again`);
        }
    })
}

search_button_element.addEventListener('click', getCityCoordinates);

location_button_element.addEventListener('click',getUserLocationCoordinates);

//window.addEventListener('load',getUserLocationCoordinates);

