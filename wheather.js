const userLocation = document.getElementById("userLocation")
const wheatherIcon = document.querySelector(".icon")
const description = document.querySelector(".description");
const temperature = document.querySelector(".temperature")
const time = document.querySelector(".timer");
const address = document.querySelector(".address")
const forecastDay = document.querySelector(".forecast-day")
const windStatus = document.getElementById("wind")
const Humidity = document.getElementById("Humidity")
const Visibility = document.getElementById("Visibility")
const AirPressure = document.getElementById("Air-Pressure");
const forecastContainer = document.querySelector(".forecast-container");
const CurrenLocationButton = document.getElementById("current-location");
const cityDropdown = document.getElementById("city-dropdown");

const web_api_endpoint = "https://api.weatherbit.io/v2.0/current?key=18eade21f8a74c4380011d5be3188b5e&city=";

function findUserLocation() {
    const city = userLocation.value.trim();
    if (!city) {
        alert("Please enter a city name!");
        return;
    }

    fetch(web_api_endpoint + city)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error ! Status : ${response.status}`)
            }
            return response.json();
        })
        .then((data) => {
            const weather = data.data[0];
            address.innerHTML = `${weather.city_name}, ${weather.country_code}`;
            wheatherIcon.innerHTML = `<img src="https://www.weatherbit.io/static/img/icons/${weather.weather.icon}.png" alt="Weather icon">`
            temperature.innerHTML = `${weather.temp} °C`;
            description.innerHTML = weather.weather.description;
            time.innerHTML = ` date : ${weather.ob_time}`
            windStatus.innerHTML = `Wind Speed: ${weather.wind_spd} km/h`;
            Humidity.innerHTML = `Humidity: ${weather.rh}%`;
            Visibility.innerHTML = `${weather.vis} km`;
            AirPressure.innerHTML = `${weather.pres} mb`;
        })
        .catch((error) => {
            console.error("Error fetching data:", error);
        });

    fetch(`https://api.weatherbit.io/v2.0/forecast/daily?city=${city}&key=18eade21f8a74c4380011d5be3188b5e`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            forecastContainer.innerHTML = "";
            const forecastDays = data.data.slice(0, 5);
            forecastDays.forEach(day => {
                const date = new Date(day.datetime).toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                });
                const forecastHTML = `
                    <article class="forecast-day bg-gray-800 p-4 rounded text-center">
                        <p class="text-sm">${date}</p>
                        <i class="fas fa-cloud-sun text-4xl my-2"></i>
                        <p class="text-sm">${day.temp} °C</p>
                        <p class="text-sm">${day.weather.description}</p>
                    </article>`;
                forecastContainer.innerHTML += forecastHTML;
            });
        })
        .catch((error) => {
            console.error("Error fetching forecast:", error);
        });
    updateDropdown(city)
}

function fetchWheatherCurrentLocation() {
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            const APIUrl = `https://api.weatherbit.io/v2.0/current?key=18eade21f8a74c4380011d5be3188b5e&lat=${latitude}&lon=${longitude}`

            fetch(APIUrl).then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json()
            }).then(data => {
                const weather = data.data[0];
                address.innerHTML = `${weather.city_name}, ${weather.country_code}`;
                wheatherIcon.innerHTML = `<img src="https://www.weatherbit.io/static/img/icons/${weather.weather.icon}.png" alt="Weather icon">`
                temperature.innerHTML = `${weather.temp} °C`;
                description.innerHTML = weather.weather.description;
                time.innerHTML = ` date : ${weather.ob_time}`
                windStatus.innerHTML = `Wind Speed: ${weather.wind_spd} km/h`;
                Humidity.innerHTML = `Humidity: ${weather.rh}%`;
                Visibility.innerHTML = `${weather.vis} km`;
                AirPressure.innerHTML = `${weather.pres} mb`;
            })
                .catch(error => {
                    console.error("Error fetching current location weather:", error);
                });

            const forecastUrl = `https://api.weatherbit.io/v2.0/forecast/daily?key=18eade21f8a74c4380011d5be3188b5e&lat=${latitude}&lon=${longitude}`;
            fetch(forecastUrl).then(response => response.json())
            .then(data => {
                    forecastContainer.innerHTML = "";
                    const forecastDays = data.data.slice(0, 5);
                    forecastDays.forEach(day => {
                        const date = new Date(day.datetime).toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                        });
                        const forecastHTML = `
                        <article class="forecast-day bg-gray-800 p-4 rounded text-center">
                            <p class="text-sm">${date}</p>
                            <img src="https://www.weatherbit.io/static/img/icons/${day.weather.icon}.png" alt="Weather icon">
                            <p class="text-sm">${day.temp} °C</p>
                            <p class="text-sm">${day.weather.description}</p>
                        </article>`;
                        forecastContainer.innerHTML += forecastHTML;
                    });
                })
                .catch(error => {
                    console.error("Error fetching current location forecast:", error);
                });
        })
}
 
const updateDropdown = (city) => {
    let cities = JSON.parse(localStorage.getItem('recentCities')) || [];
    if (!cities.includes(city)) cities.unshift(city);
    if (cities.length > 5) cities = cities.slice(0, 5);
    localStorage.setItem('recentCities', JSON.stringify(cities));

    cityDropdown.innerHTML = cities
        .map(c => `<option class="dropdown-item" value="${c}">${c}</option>`) 
        .join('');
    cityDropdown.style.display = cities.length ? 'block' : 'none';

    cityDropdown.querySelectorAll('.dropdown-item').forEach(item => {
        item.addEventListener('click', () => {
            const selectedCity = item.value;
            userLocation.value = selectedCity; 
            findUserLocation(selectedCity); 
            cityDropdown.style.display = 'none'; 
        });
    });
};

document.getElementById("search-city").addEventListener("click", findUserLocation);
CurrenLocationButton.addEventListener("click", fetchWheatherCurrentLocation);



