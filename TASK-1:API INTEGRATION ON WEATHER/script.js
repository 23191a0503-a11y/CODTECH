const apiKey = "6bc1657130fe1c3ab8e23bbbfc4ff726";

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const weatherCard = document.getElementById("weatherCard");
const errorMsg = document.getElementById("errorMsg");
const loader = document.getElementById("loader");
const forecastContainer = document.getElementById("forecastContainer");

const themeToggle = document.getElementById("themeToggle");
const locationBtn = document.getElementById("locationBtn");

// ---------- SEARCH WEATHER ----------
searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();

  if (city !== "") {
    getWeather(city);
    getForecast(city);
  }
});

// ENTER KEY SEARCH
cityInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    searchBtn.click();
  }
});

// ---------- CURRENT WEATHER ----------
async function getWeather(city) {
  showLoader();

  try {
    const url =
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.cod != 200) {
      throw new Error("City not found");
    }

    displayWeather(data);
    hideLoader();

  } catch (error) {
    showError(error.message);
  }
}

// ---------- DISPLAY WEATHER ----------
function displayWeather(data) {
  weatherCard.classList.remove("hidden");
  errorMsg.textContent = "";

  document.getElementById("cityName").innerText =
    `${data.name}, ${data.sys.country}`;

  document.getElementById("temperature").innerText =
    `${Math.round(data.main.temp)}°C`;

  document.getElementById("condition").innerText =
    data.weather[0].main;

  document.getElementById("feelsLike").innerText =
    `${Math.round(data.main.feels_like)}°C`;

  document.getElementById("humidity").innerText =
    `${data.main.humidity}%`;

  document.getElementById("windSpeed").innerText =
    `${data.wind.speed} km/h`;

  document.getElementById("pressure").innerText =
    `${data.main.pressure} hPa`;

  document.getElementById("weatherIcon").src =
    `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

  // Sunrise / Sunset
  document.getElementById("sunrise").innerText =
    convertTime(data.sys.sunrise);

  document.getElementById("sunset").innerText =
    convertTime(data.sys.sunset);

  // Date & Time
  const now = new Date();
  document.getElementById("dateTime").innerText =
    now.toLocaleString();

  // Dynamic Background
  changeBackground(data.weather[0].main);
}

// ---------- 5 DAY FORECAST ----------
async function getForecast(city) {
  try {
    const url =
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    const response = await fetch(url);
    const data = await response.json();

    forecastContainer.innerHTML = "";

    const dailyForecast = data.list.filter(item =>
      item.dt_txt.includes("12:00:00")
    );

    dailyForecast.slice(0, 5).forEach(day => {

      const date = new Date(day.dt_txt);

      const card = `
        <div class="forecast-card">
          <h4>${date.toLocaleDateString("en-US", { weekday: "short" })}</h4>

          <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png">

          <p>${Math.round(day.main.temp)}°C</p>

          <small>${day.weather[0].main}</small>
        </div>
      `;

      forecastContainer.innerHTML += card;
    });

  } catch (error) {
    console.log(error);
  }
}

// ---------- LOCATION DETECTION ----------
locationBtn.addEventListener("click", () => {

  navigator.geolocation.getCurrentPosition(
    async (position) => {

      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      const url =
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

      const response = await fetch(url);
      const data = await response.json();

      displayWeather(data);
      getForecast(data.name);
    },

    () => {
      alert("Location access denied");
    }
  );
});

// ---------- DARK MODE ----------
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");

  const icon = themeToggle.querySelector("i");

  if (document.body.classList.contains("dark")) {
    icon.className = "fas fa-sun";
  } else {
    icon.className = "fas fa-moon";
  }
});

// ---------- HELPERS ----------
function convertTime(timestamp) {
  const date = new Date(timestamp * 1000);

  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });
}

function showLoader() {
  loader.classList.remove("hidden");
}

function hideLoader() {
  loader.classList.add("hidden");
}

function showError(message) {
  weatherCard.classList.add("hidden");
  loader.classList.add("hidden");
  errorMsg.textContent = message;
}

// ---------- WEATHER BACKGROUND ----------
function changeBackground(weather) {

  if (weather.includes("Cloud")) {
    document.body.style.background =
      "linear-gradient(135deg,#757F9A,#D7DDE8)";
  }

  else if (weather.includes("Rain")) {
    document.body.style.background =
      "linear-gradient(135deg,#4B79A1,#283E51)";
  }

  else if (weather.includes("Clear")) {
    document.body.style.background =
      "linear-gradient(135deg,#56CCF2,#2F80ED)";
  }

  else {
    document.body.style.background =
      "linear-gradient(135deg,#4facfe,#00f2fe)";
  }
}

// DEFAULT CITY
getWeather("Hyderabad");
getForecast("Hyderabad");
