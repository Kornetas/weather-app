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
      // Pobieramy tylko pierwszą prognozę na dany dzień
      days[day] = `
              <div class="forecast-card">
                  <p><strong>${day}</strong></p>
                  <img src="${getIconUrl(entry.weather[0].icon)}" alt="Ikona">
                  <p>${Math.round(entry.main.temp)}°C</p>
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
        console.error("Błąd geolokalizacji:", error);
        document.getElementById(
          "weatherResult"
        ).innerHTML = `<p style="color:red;">Nie można pobrać lokalizacji</p>`;
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

// Pobieranie zapisanego miasta przy starcie strony

document.addEventListener("DOMContentLoaded", () => {
  let lastCity = localStorage.getItem("lastCity");
  if (lastCity) {
    getWeather(lastCity);
  } else {
    getLocation(); // Wywołujemy pobranie lokalizacji przy starcie strony
  }
});

//Funkcja do wyswietlenia danych

function displayWeather(data) {
  document.getElementById("weatherResult").innerHTML = `
      <h2>${data.name}, ${data.sys.country}</h2>
      <p>Temperatura: ${Math.round(data.main.temp)}°C</p>
      <p>Wilgotność: ${data.main.humidity}%</p>
      <p>Wiatr: ${data.wind.speed} m/s</p>
      <img src="${getIconUrl(data.weather[0].icon)}" alt="Ikona pogody">
  `;
}

document.addEventListener("DOMContentLoaded", () => {
  // Sprawdź, czy tryb ciemny był włączony wcześniej
  if (localStorage.getItem("darkMode") === "enabled") {
    document.body.classList.add("dark-mode");
  }

  let lastCity = localStorage.getItem("lastCity");
  if (lastCity) {
    getWeather(lastCity);
  }
});

// Obsługa przycisku trybu ciemnego
document
  .getElementById("darkModeToggle")
  .addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");

    // Sprawdź aktualny stan i zapisz w localStorage
    if (document.body.classList.contains("dark-mode")) {
      localStorage.setItem("darkMode", "enabled");
    } else {
      localStorage.setItem("darkMode", "disabled");
    }
  });

// Mapa kodów OpenWeatherMap do ikon kolorowych
const iconMap = {
  "01d": "https://img.icons8.com/color/96/sun.png",
  "01n": "https://img.icons8.com/color/96/full-moon.png",
  "02d": "https://img.icons8.com/color/96/partly-cloudy-day.png",
  "02n": "https://img.icons8.com/color/96/partly-cloudy-night.png",
  "03d": "https://img.icons8.com/color/96/cloud.png",
  "03n": "https://img.icons8.com/color/96/cloud.png",
  "04d": "https://img.icons8.com/color/96/clouds.png",
  "04n": "https://img.icons8.com/color/96/clouds.png",
  "09d": "https://img.icons8.com/color/96/rain.png",
  "09n": "https://img.icons8.com/color/96/rain.png",
  "10d": "https://img.icons8.com/color/96/light-rain.png",
  "10n": "https://img.icons8.com/color/96/light-rain.png",
  "11d": "https://img.icons8.com/color/96/storm.png",
  "11n": "https://img.icons8.com/color/96/storm.png",
  "13d": "https://img.icons8.com/color/96/snow.png",
  "13n": "https://img.icons8.com/color/96/snow.png",
  "50d": "https://img.icons8.com/color/96/fog-day.png",
  "50n": "https://img.icons8.com/color/96/fog-night.png",
};

// Funkcja zwracająca URL do kolorowej ikony
function getIconUrl(iconCode) {
  return (
    iconMap[iconCode] || `https://openweathermap.org/img/wn/${iconCode}@4x.png`
  ); // Domyślnie OpenWeatherMap
}
