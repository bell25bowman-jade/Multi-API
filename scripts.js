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
      `https://api.weatherstack.com/current?access_key=c75bf33bdfadb866249268012fc13b7e&units=m&query=${encodeURIComponent(city)}`,
    );
    const data = await response.json();
    console.log("API Response:", data);
    if (data.error) {
      throw new Error(data.error.info || "city not found or API error");
    }
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
  .getElementById("cityInput")
  .addEventListener("keypress", function (event) {
    if ("Enter" === event.key) {
      getWeather();
    }
  });

// Generate random colors
async function getColorPalette() {
  const outputDiv = document.getElementById("colorOutput");
  try {
    const colors = [];
    for (let i = 0; i < 5; i++) {
      colors.push(
        Math.floor(Math.random() * 16777215)
          .toString(16)
          .padStart(6, "0"),
      );
    }
    console.log("Generated colors:", colors);
    outputDiv.innerHTML = `<h3>Random Color Palette</h3><div class="palette">`;
    colors.forEach((color) => {
      outputDiv.innerHTML += `<div class="color-box" style="background-color: #${color};"><p>#${color.toUpperCase()}</p></div>`;
    });
    outputDiv.innerHTML += `</div>`;
  } catch (error) {
    outputDiv.innerHTML = `<p class='error'>Error: ${error.message}</p>`;
  }
}
document
  .getElementById("getRandomColorBtn")
  .addEventListener("click", getColorPalette);

// Fetch a random poem
async function getRandomPoem() {
  const outputDiv = document.getElementById("poemOutput");
  try {
    const response = await fetch(
      "https://poetrydb.org/title/Ozymandias/lines.json",
    );
    const data = await response.json();
    console.log("API Response:", data);
    if (!data || data.length === 0) {
      throw new Error("No poem found");
    }
    const poem = data[0];
    outputDiv.innerHTML = `<h3>${poem.title} by ${poem.author}</h3><pre>${poem.lines.join("\n")}</pre>`;
  } catch (error) {
    outputDiv.innerHTML = `<p class='error'>Error: ${error.message}</p>`;
  }
}
document.getElementById("getPoemBtn").addEventListener("click", getRandomPoem);
