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
  let weatherDescription = data.weather[0].description; // Pobieramy opis pogody
  changeBackground(weatherDescription); // Zmieniamy kolor tła

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

// Pobranie referencji do przycisku trybu ciemnego
const darkModeToggle = document.getElementById("darkModeToggle");

// Funkcja do przełączania trybu ciemnego
function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");

  // Sprawdzenie aktualnego trybu i zapisanie w localStorage
  if (document.body.classList.contains("dark-mode")) {
    localStorage.setItem("darkMode", "enabled");
    darkModeToggle.innerHTML = "☀️ Tryb jasny"; 
  } else {
    localStorage.setItem("darkMode", "disabled");
    darkModeToggle.innerHTML = "🌙 Tryb ciemny";
  }
}

// Dodanie event listenera do przycisku
darkModeToggle.addEventListener("click", toggleDarkMode);

//  Sprawdzenie zapisanych ustawień po załadowaniu strony
window.onload = function () {
  const savedTheme = localStorage.getItem("darkMode");

  if (savedTheme === "enabled") {
    document.body.classList.add("dark-mode");
    darkModeToggle.innerHTML = "☀️ Tryb jasny"; // Ustawienie poprawnego tekstu po załadowaniu
  } else {
    darkModeToggle.innerHTML = "🌙 Tryb ciemny"; // Domyślna wartość
  }
};

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

// Mapa kolorów dla różnych warunków pogodowych

const weatherBackgrounds = new Map([
  ["clear sky", "linear-gradient(to bottom, #87CEEB, #FFD700)"],
  ["bezchmurnie", "linear-gradient(to bottom, #A0E1FF, #FFA500)"],
  ["słonecznie", "linear-gradient(to bottom, #FFD700, #FFA500)"],

  ["pochmurno", "linear-gradient(to bottom, #A9A9A9, #707070)"],
  ["pochmurnie", "linear-gradient(to bottom, #B0B0B0, #808080)"],
  ["zachmurzenie małe", "linear-gradient(to bottom, #C0D8E0, #B0C4DE)"],
  ["lekkie zachmurzenie", "linear-gradient(to bottom, #B0C4DE, #A0C4FF)"],
  ["zachmurzenie duże", "linear-gradient(to bottom, #606060, #505050)"],

  ["rain", "linear-gradient(to bottom, #5A86C5, #2D4A74)"],
  ["lekki deszcz", "linear-gradient(to bottom, #A0BCE1, #5075A3)"],
  ["mżawka", "linear-gradient(to bottom, #A0BCE1, #5F9EA0)"],
  ["opady deszczu", "linear-gradient(to bottom, #5F9EA0, #4169E1)"],
  ["burza", "linear-gradient(to bottom, #2F2F2F, #1E1E1E)"],

  ["śnieg", "linear-gradient(to bottom, #E0E6FF, #B0C4DE)"],
  ["opady śniegu", "linear-gradient(to bottom, #DDEFFF, #FFFFFF)"],
  ["śnieżyca", "linear-gradient(to bottom, #D0E0FF, #C0C0C0)"],

  ["mgła", "linear-gradient(to bottom, #A9A9A9, #808080)"],
  ["gęsta mgła", "linear-gradient(to bottom, #808080, #606060)"],
  ["zamglenie", "linear-gradient(to bottom, #B0B0B0, #969696)"],

  ["zachód słońca", "linear-gradient(to bottom, #FF8C00, #FF4500)"],
  ["wschód słońca", "linear-gradient(to bottom, #FFB347, #FFD700)"],
]);

// Funkcja do zmiany koloru tła
function changeBackground(description) {
  let normalizedDescription = description
    .toLowerCase()
    .trim()
    .replace(/[^a-ząćęłńóśźż\s]/g, ""); // Usuwamy znaki specjalne

  let bgGradient =
    weatherBackgrounds.get(normalizedDescription) ||
    "linear-gradient(to bottom, #f4f4f4, #d3d3d3)";

  if (!weatherBackgrounds.has(normalizedDescription)) {
    for (let key of weatherBackgrounds.keys()) {
      if (normalizedDescription.includes(key)) {
        bgGradient = weatherBackgrounds.get(key);
        break;
      }
    }
  }

  document.body.style.transition = "background 1.5s ease-in-out";
  document.body.style.background = bgGradient;
}
