async function getWeather(city) {
  const apiKey = "457ecd51db60a77bdcab547d055c4a89"; // Moj klucz api
  const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=pl`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric&lang=pl`;

  try {
    let weatherResponse = await fetch(currentWeatherUrl);
    let forecastResponse = await fetch(forecastUrl);

    if (!weatherResponse.ok || !forecastResponse.ok) {
      throw new Error(
        `Błąd: ${weatherResponse.status} | ${forecastResponse.status}`
      );
    }

    let weatherData = await weatherResponse.json();
    let forecastData = await forecastResponse.json();

    displayWeather(weatherData);
    displayForecast(forecastData);
  } catch (error) {
    console.error(error);
    document.getElementById(
      "weatherResult"
    ).innerHTML = `<p style="color:red;">Nie znaleziono miasta</p>`;
    document.getElementById("forecastResault").innerHTML = "";
  }
}

// Funkcja do wyświetlania prognozy na 5 dni
function displayForecast(data) {
  let forecastHTML = `<h3>Prognoza na 5 dni:</h3><div class="forecast-container">`;
  let days = {};

  data.list.forEach((entry) => {
    let date = new Date(entry.dt * 1000);
    let day = date.toLocaleDateString("pl-PL", { weekday: "long" });

    if (!days[day]) {
      days[day] = `
                <div class="forecast-card">
                    <p><strong>${day}</strong></p>
                    <img src="https://openweathermap.org/img/wn/${entry.weather[0].icon}.png" alt="Ikona">
                    <p>${entry.main.temp}°C</p>
                    <p>${entry.weather[0].description}</p>
                </div>
            `;
    }
  });

  forecastHTML += Object.values(days).join("") + "</div>";
  document.getElementById("forecastResult").innerHTML = forecastHTML;
}

// funkcja do pobierania lokalizacji użytkownika

function getLocation() {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      async function (position) {
        let lat = position.coords.latitude;
        let lon = position.coords.longitude;
        getWeatherByCoords(lat, lon);
      },
      function (error) {
        console.error("Błąd w geolokalizacji", error);
        document.getElementById(
          "weatherResult"
        ).innerHTML = `<p style ="color: red;">Nie można pobrać lokalizacji</p>`;
      }
    );
  } else {
    console.error("Geolokalizacja nie jest wspierana przez tę przeglądarkę.");
  }
}

// Pobieranie pogody na podstawie współrzędnych
async function getWeatherByCoords(lat, lon) {
  const apiKey = "457ecd51db60a77bdcab547d055c4a89"; // Moj klucz api
  const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=pl`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=pl`;

  try {
    let weatherResponse = await fetch(currentWeatherUrl);
    let forecastResponse = await fetch(forecastUrl);

    if (!weatherResponse.ok || !forecastResponse.ok) {
      throw new Error(
        `Błąd: ${weatherResponse.status} | ${forecastResponse.status}`
      );
    }

    let weatherData = await weatherResponse.json();
    let forecastData = await forecastResponse.json();

    displayWeather(weatherData);
    displayForecast(forecastData);
  } catch (error) {
    console.error(error);
    document.getElementById(
      "weatherResult"
    ).innerHTML = `<p style="color:red;">Błąd podczas pobierania pogody</p>`;
  }
}

// Obsługa przycisku
document.getElementById("searchBtn").addEventListener("click", function () {
  let city = document.getElementById("cityInput").value;
  if (city) {
    localStorage.setItem("lastCity", city);
    getWeather(city);
  }
});

// Obsługa przycisku 2

document.getElementById("geoBtn").addEventListener("click", getLocation);

//Pobieranie zapisanego miasta przy starcie strony

document.addEventListener("DOMContentLoaded", () => {
  let lastCity = localStorage.getItem("lastCity");
  if (lastCity) {
    getWeather(lastCity);
  } else {
    getLocation();
  }
});

//Funkcja do wyswietlenia danych

function displayWeather(data) {
  document.getElementById("weatherResult").innerHTML = `
        <h2>${data.name}, ${data.sys.country}</h2>
        <p>Temperatura: ${data.main.temp}°C</p>
        <p>Wilgotność: ${data.main.humidity}%</p>
        <p>Wiatr: ${data.wind.speed} m/s</p>
        <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="Ikona pogody">
    `;
}
