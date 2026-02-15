// Fetch weather data for a city
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
      `https://api.weatherstack.com/current?access_key=c75bf33bdfadb866249268012fc13b7e&units=f&query=${encodeURIComponent(city)}`,
    );
    const data = await response.json();
    console.log("API Response:", data);
    if (data.error) {
      throw new Error(data.error.info || "city not found or API error");
    }
    outputDiv.innerHTML = `
      <h3>Weather in ${data.location.name}, ${data.location.country}</h3>
      <p><strong>Temperature:</strong> ${data.current.temperature}°F</p>
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
    // Request a batch of random poems, then pick one with <= maxLines
    const maxLines = 4;
    const batchSize = 30;
    const response = await fetch(`https://poetrydb.org/random/${batchSize}`);
    let data;
    try {
      data = await response.json();
    } catch (e) {
      const text = await response.text();
      console.warn("Poetry API returned non-JSON response:", text);
      throw new Error("Poetry API returned unexpected response");
    }
    console.log("API Response (batch):", data);

    // Normalize to array of poems
    let poems = [];
    if (Array.isArray(data)) poems = data;
    else if (data.results && Array.isArray(data.results)) poems = data.results;
    else if (data.poem && typeof data.poem === "object") poems = [data.poem];

    if (!poems || poems.length === 0) {
      throw new Error("No poem found in API response");
    }

    // Prefer a poem with <= maxLines lines
    const fit = poems.find((p) => {
      if (p.linecount) return Number(p.linecount) <= maxLines;
      if (Array.isArray(p.lines)) return p.lines.length <= maxLines;
      return false;
    });

    let poem =
      fit ||
      poems.reduce((shortest, p) => {
        const a = Array.isArray(p.lines)
          ? p.lines.length
          : p.linecount
            ? Number(p.linecount)
            : Infinity;
        const b = Array.isArray(shortest.lines)
          ? shortest.lines.length
          : shortest.linecount
            ? Number(shortest.linecount)
            : Infinity;
        return a < b ? p : shortest;
      }, poems[0]);

    const title = poem.title || poem.name || "Untitled";
    const authorRaw = poem.author || poem.poet || "";
    let lines = [];
    if (Array.isArray(poem.lines) && poem.lines.length > 0) {
      lines = poem.lines;
    } else if (typeof poem.lines === "string" && poem.lines.trim()) {
      lines = poem.lines.split(/\r?\n/);
    } else if (typeof poem.line === "string") {
      lines = [poem.line];
    }

    const poemHtml = authorRaw ? `${title} by ${authorRaw}` : `${title}`;
    const poemBody =
      lines.length > 0
        ? `<pre>${lines.join("\n")}</pre>`
        : "<p>No poem lines available.</p>";
    outputDiv.innerHTML = `<h3>${poemHtml}</h3>${poemBody}`;
  } catch (error) {
    outputDiv.innerHTML = `<p class='error'>Error: ${error.message}</p>`;
  }
}
document.getElementById("getPoemBtn").addEventListener("click", getRandomPoem);

// fetch random emoji
async function getRandomEmoji() {
  const outputDiv = document.getElementById("quoteOutput");
  try {
    const response = await fetch("https://emojihub.yurace.pro/api/random");
    const data = await response.json();
    console.log("API Response:", data);
    if (!data || !data.htmlCode || data.htmlCode.length === 0) {
      throw new Error("No emoji found in API response");
    }
    const emojiHtml = data.htmlCode[0] || "No emoji available";
    outputDiv.innerHTML = `<h3>Random Emoji</h3><div class="emoji">${emojiHtml}</div>`;
  } catch (error) {
    outputDiv.innerHTML = `<p class='error'>Error: ${error.message}</p>`;
  }
}
document
  .getElementById("getQuoteBtn")
  .addEventListener("click", getRandomEmoji);

// fetch random dog image
async function getRandomDog() {
  const outputDiv = document.getElementById("dogOutput");
  try {
    // random.dog provides a JSON endpoint that returns { url: "..." }
    // User prefers to skip videos: retry until a non-video image is found.
    const maxAttempts = 10;
    let attempt = 0;
    let data = null;
    let dogUrl = null;
    while (attempt < maxAttempts) {
      const resp = await fetch("https://random.dog/woof.json");
      data = await resp.json();
      console.log("random.dog response (attempt", attempt + 1, "):", data);
      if (data && data.url) {
        dogUrl = data.url;
        // if it's not a video, break and use it
        if (!/\.(mp4|webm|ogg)$/i.test(dogUrl)) break;
      }
      attempt++;
    }

    if (!dogUrl) {
      throw new Error("No dog image found in API response");
    }

    if (/\.(mp4|webm|ogg)$/i.test(dogUrl)) {
      const placeholder =
        "https://via.placeholder.com/320x240?text=No+image+available";
      outputDiv.innerHTML = `<h3>Random Dog</h3><img src="${placeholder}" alt="No image available" class="dog-image"><p class="muted">Only video results were returned; showing a placeholder.</p>`;
      return;
    }

    outputDiv.innerHTML = `<h3>Random Dog</h3><img src="${dogUrl}" alt="Random Dog" class="dog-image">`;
  } catch (error) {
    outputDiv.innerHTML = `<p class='error'>Error: ${error.message}</p>`;
  }
}
document.getElementById("getDogBtn").addEventListener("click", getRandomDog);

// fetch random art from The Met Museum
async function getRandomArt() {
  const outputDiv = document.getElementById("artOutput");
  try {
    // Step 1: Get a list of all object IDs
    const idsResponse = await fetch(
      "https://collectionapi.metmuseum.org/public/collection/v1/objects",
    );
    const idsData = await idsResponse.json();
    console.log("Met Museum object IDs response:", idsData);
    if (!idsData || !idsData.objectIDs || idsData.objectIDs.length === 0) {
      throw new Error("No object IDs found in API response");
    }

    // Step 2: Retry until we find an artwork with an image
    const maxAttempts = 10;
    let attempt = 0;
    let artData = null;

    while (attempt < maxAttempts) {
      const randomId =
        idsData.objectIDs[Math.floor(Math.random() * idsData.objectIDs.length)];
      const artResponse = await fetch(
        `https://collectionapi.metmuseum.org/public/collection/v1/objects/${randomId}`,
      );
      artData = await artResponse.json();
      console.log(
        "Met Museum object details response (attempt",
        attempt + 1,
        "):",
        artData,
      );

      // Check if this artwork has an image
      if (
        artData &&
        artData.primaryImageSmall &&
        artData.primaryImageSmall.length > 0
      ) {
        break;
      }
      attempt++;
    }

    if (!artData || !artData.primaryImageSmall) {
      throw new Error("No artwork with an image found after multiple attempts");
    }

    const title = artData.title || "Untitled";
    const artist = artData.artistDisplayName || "Unknown Artist";
    const imageUrl = artData.primaryImageSmall;
    outputDiv.innerHTML = `<h3>${title} by ${artist}</h3><img src="${imageUrl}" alt="${title}" class="art-image">`;
  } catch (error) {
    outputDiv.innerHTML = `<p class='error'>Error: ${error.message}</p>`;
  }
}
document.getElementById("getArtBtn").addEventListener("click", getRandomArt);

//fetch hotel data
async function getHotelData() {
  const outputDiv = document.getElementById("hotelOutput");
  try {
    // Mock hotel data
    const hotels = [
      {
        name: "Sunset Dreams Resort",
        location: "Bali, Indonesia",
        imageUrl:
          "https://via.placeholder.com/300x200?text=Sunset+Dreams+Resort",
        rating: "4.8/5",
      },
      {
        name: "Mountain View Lodge",
        location: "Swiss Alps, Switzerland",
        imageUrl:
          "https://via.placeholder.com/300x200?text=Mountain+View+Lodge",
        rating: "4.9/5",
      },
      {
        name: "Tropical Paradise Hotel",
        location: "Maldives",
        imageUrl: "https://via.placeholder.com/300x200?text=Tropical+Paradise",
        rating: "4.7/5",
      },
      {
        name: "Urban Elegance Boutique",
        location: "Paris, France",
        imageUrl: "https://via.placeholder.com/300x200?text=Urban+Elegance",
        rating: "4.6/5",
      },
      {
        name: "Beachfront Paradise Inn",
        location: "Cancun, Mexico",
        imageUrl:
          "https://via.placeholder.com/300x200?text=Beachfront+Paradise",
        rating: "4.5/5",
      },
    ];

    const randomHotel = hotels[Math.floor(Math.random() * hotels.length)];
    console.log("Hotel data:", randomHotel);

    outputDiv.innerHTML = `
      <h3>${randomHotel.name}</h3>
      <p><strong>Location:</strong> ${randomHotel.location}</p>
      <p><strong>Rating:</strong> ${randomHotel.rating}</p>
      <img src="${randomHotel.imageUrl}" alt="${randomHotel.name}" class="hotel-image">
    `;
  } catch (error) {
    outputDiv.innerHTML = `<p class='error'>Error: ${error.message}</p>`;
  }
}
document.getElementById("getHotelBtn").addEventListener("click", getHotelData);

//fetch random triva question
// Store trivia questions for random selection
let triviaQuestions = [];
let currentQuestionIndex = 0;

async function getTriviaQuestion() {
  const outputDiv = document.getElementById("triviaOutput");
  try {
    // Fetch a batch of questions if we don't have any or have used them all
    if (triviaQuestions.length === 0) {
      const response = await fetch(
        "https://www.otriviata.com/api.php?ids=1,50,100,150,200,250,300,350,400,450",
      );
      const data = await response.json();
      console.log("Trivia API response:", data);
      if (!data || !data.results || data.results.length === 0) {
        throw new Error("No trivia questions found in API response");
      }
      triviaQuestions = data.results;
      currentQuestionIndex = 0;
    }

    // Pick a random question from the batch
    const randomIndex = Math.floor(Math.random() * triviaQuestions.length);
    const questionData = triviaQuestions[randomIndex];

    const question = questionData.question;
    const correctAnswer = questionData.correct_answer;
    const incorrectAnswers = questionData.incorrect_answers;
    const allAnswers = [...incorrectAnswers, correctAnswer].sort(
      () => 0.5 - Math.random(),
    );
    outputDiv.innerHTML = `
      <h3>Trivia Question</h3>
      <p>${question}</p>
      <div class="trivia-answers">
        ${allAnswers.map((answer) => `<button class="trivia-answer-btn" data-answer="${answer}">${answer}</button>`).join("")}
      </div>
      <p class="trivia-result" id="triviaResult"></p>
    `;

    // Add event listeners to answer buttons
    document.querySelectorAll(".trivia-answer-btn").forEach((btn) => {
      btn.addEventListener("click", function () {
        const selectedAnswer = this.getAttribute("data-answer");
        const resultDiv = document.getElementById("triviaResult");

        // Disable all buttons after selection
        document.querySelectorAll(".trivia-answer-btn").forEach((b) => {
          b.disabled = true;
        });

        if (selectedAnswer === correctAnswer) {
          this.classList.add("correct");
          resultDiv.innerHTML = `<span class="success">✓ Correct! The answer is: ${correctAnswer}</span>`;
        } else {
          this.classList.add("incorrect");
          resultDiv.innerHTML = `<span class="failure">✗ Incorrect! The correct answer is: ${correctAnswer}</span>`;
        }
      });
    });
  } catch (error) {
    outputDiv.innerHTML = `<p class='error'>Error: ${error.message}</p>`;
  }
}
document
  .getElementById("getTriviaBtn")
  .addEventListener("click", getTriviaQuestion);
