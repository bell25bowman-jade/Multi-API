async function getWeather() {
  const city = document.getElementById("cityInput").value.trim();
  const outputDiv = document.getElementById("output");

  // Input check
  if (!city) {
    outputDiv.innerHTML = "<p class='error'>Please enter a city name.</p>";
    return;
  }
  try {
    outputDiv.innerHTML = "<p>Loading...</p>";
    const response = await fetch(
      `http://api.weatherstack.com/current?access_key=c75bf33bdfadb866249268012fc13b7e&units=metric&query=${encodeURIComponent(city)}`,
    );
    if (!response.ok) {
      throw new Error("city not found or API error");
    }
    const data = await response.json();
    outputDiv.innerHTML = `
      <h3>Weather in ${data.location.name}, ${data.location.country}</h3>
      <p><strong>Temperature:</strong> ${data.current.temperature}°C</p>
      <p><strong>Weather:</strong> ${data.current.weather_descriptions[0]}</p>
      <p><strong>Humidity:</strong> ${data.current.humidity}%</p>
    `;
  } catch (error) {
    outputDiv.innerHTML = `<p class='error'>Error: ${error.message}</p>`;
  }
}

document.getElementById("getWeatherBtn").addEventListener("click", getWeather);

document
  .getElementById("getWeatherBtn")
  .addEventListener("keypress", function (event) {
    if (`Enter` === event.key) {
      getWeather();
    }
  });
