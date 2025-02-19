async function getWeather(city) {
  const apiKey = "457ecd51db60a77bdcab547d055c4a89"; // Moj klucz api
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=pl`;

  try {
    let response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Błąd: ${response.status}`);
    }
    let data = await response.json();
    displayWeather(data);
  } catch (error) {
    console.error(error);
    document.getElementById(
      "weatherResult"
    ).innerHTML = `<p style="color:red;">Nie znaleziono miasta</p>`;
  }
}

// Obsługa przycisku
document.getElementById("searchBtn").addEventListener("click", function () {
  let city = document.getElementById("cityInput").value;
  if (city) {
    getWeather(city);
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
