(async function(){
  // 1. Load Google Fonts
  const fontLink = document.createElement('link');
  fontLink.href = 'https://api.fontshare.com/v2/css?f[]=satoshi@400,700&display=swap';
  fontLink.rel = 'stylesheet';
  document.head.appendChild(fontLink);

  // 2. Create styles
  const style = document.createElement('style');
  style.textContent = `
    #weather_widget_overlay {
      position: relative;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 9999;
      display: flex;
      justify-content: center;
      align-items: center;
      font-family: "Satoshi", sans-serif;
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(15px);
      -webkit-backdrop-filter: blur(15px);
      box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
      border: 1px solid rgba(255, 255, 255, 0.18);
    }

    #weather_widget_app {
      background: #101624;
      border-radius: 20px;
      padding: 40px;
      color: white;
      max-width: 700px;
      width: 100%;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
    }

    #weather_widget_header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
    }

    #weather_widget_search {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    #weather_widget_search input {
      padding: 10px 16px;
      border-radius: 12px;
      border: none;
      outline: none;
      background: rgba(255, 255, 255, 0.1);
      color: white;
      font-family: "Satoshi", sans-serif;
    }

    #weather_widget_search input::placeholder {
      color: rgba(255, 255, 255, 0.7);
    }

    #weather_widget_search button {
      background: white;
      color: black;
      padding: 10px 16px;
      border: none;
      border-radius: 12px;
      cursor: pointer;
      font-family: "Satoshi", sans-serif;
    }

    #weather_widget_location h1 {
      font-size: 2rem;
      margin: 0;
      font-family: "Satoshi", sans-serif;
    }

    #weather_widget_location p {
      opacity: 0.7;
      margin-top: 5px;
      font-family: "Satoshi", sans-serif;
    }

    #weather_widget_main {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 30px 0;
    }

    #weather_widget_temp {
      font-size: 5rem;
      font-weight: 700;
      font-family: "Satoshi", sans-serif;
    }

    #weather_widget_condition {
      font-size: 1.2rem;
      margin-top: 8px;
      opacity: 0.8;
      font-family: "Satoshi", sans-serif;
    }

    #weather_widget_icon img {
      width: 150px;
    }

    #weather_widget_details {
      display: flex;
      flex-direction: column;
      gap: 8px;
      font-size: 0.95rem;
      opacity: 0.85;
      font-family: "Satoshi", sans-serif;
    }

    #weather_widget_forecast {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
      gap: 15px;
      margin-top: 20px;
    }

    .weather_widget_forecast_day {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: first baseline;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 12px;
      padding: 16px;
      text-align: center;
      gap: 0px;
      font-family: "Satoshi", sans-serif;
    }

    .weather_widget_forecast_day img {
      width: 40px;
      margin: 10px 0;
    }

    .weather_widget_forecast_day p {
      font-size: 0.85rem;
      opacity: 0.75;
      margin: 0;
    }



    #weather_widget_forecast_title {
      margin-top: 30px;
      margin-bottom: 10px;
      font-size: 1.5rem;
      font-weight: 700;
      color: white;
      font-family: "Satoshi", sans-serif;
    }
  `;
  document.head.appendChild(style);

  // 3. Create main overlay container
  const overlay = document.createElement('div');
  overlay.id = 'weather_widget_overlay';
  
  // 4. Create weather app structure
  const weatherApp = document.createElement('div');
  weatherApp.id = 'weather_widget_app';

  // 5. Create HTML structure with exact same layout
  weatherApp.innerHTML = `
    <div id="weather_widget_header">
      <div id="weather_widget_location">
        <h1 id="w_city">City</h1>
        <p id="w_date">Date</p>
      </div>
    </div>

    <div id="weather_widget_main">
      <div>
        <div id="weather_widget_temp"><span id="w_temperature">--</span>°C</div>
        <div id="weather_widget_condition">--</div>
      </div>
      <div id="weather_widget_icon">
        <img id="w_icon" src="" alt="weather icon" />
      </div>
      <div id="weather_widget_details">
        <div>🌡️ Feels like: <span id="w_feelsLike">--</span>°C</div>
        <div>💧 Humidity: <span id="w_humidity">--</span>%</div>
        <div>💨 Wind: <span id="w_wind">--</span> km/h</div>
      </div>
    </div>

    <h2 id="weather_widget_forecast_title">Upcoming :</h2>
    <div id="weather_widget_forecast"></div>
  `;

  // 6. Assemble the widget
  overlay.appendChild(weatherApp);
  document.body.appendChild(overlay);
  document.body.style.cssText = "margin : 0;height:100vh;padding:0;box-sizing:border-box;overflow:hidden"
   

  // 7. Weather API - exact same as original
  const API_KEY = "7452af76a2793bc774b1e57b5c07f752";
  const BASE_URL = "https://api.openweathermap.org/data/2.5";

  async function fetchWeather(city) {
    try {
      const currentRes = await fetch(
        `${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      const forecastRes = await fetch(
        `${BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric`
      );
      const current = await currentRes.json();
      const forecast = await forecastRes.json();

      document.getElementById("w_city").textContent = current.name;
      const now = new Date();
      const formattedDate = `${now.getDate()}/${
        now.getMonth() + 1
      }/${now.getFullYear()}`;
      document.getElementById("w_date").textContent = formattedDate;

      document.getElementById("w_temperature").textContent = Math.round(
        current.main.temp
      );
      document.getElementById("w_feelsLike").textContent = Math.round(
        current.main.feels_like
      );
      document.getElementById("w_humidity").textContent =
        current.main.humidity;
      document.getElementById("w_wind").textContent = Math.round(
        current.wind.speed * 3.6
      );
      document.getElementById("weather_widget_condition").textContent =
        current.weather[0].description;
      document.getElementById(
        "w_icon"
      ).src = `https://openweathermap.org/img/wn/${current.weather[0].icon}@2x.png`;

      const today = new Date().toLocaleDateString("en-US", {
        weekday: "long",
      });
      const days = {};
      forecast.list.forEach((item) => {
        const date = new Date(item.dt_txt);
        const dayKey = date.toLocaleDateString("en-US", {
          weekday: "long",
        });

        if (dayKey === today) return; // skip current day

        if (!days[dayKey]) {
          days[dayKey] = item;
        } else {
          const existingHour = new Date(days[dayKey].dt_txt).getHours();
          const currentHour = date.getHours();
          if (Math.abs(currentHour - 12) < Math.abs(existingHour - 12)) {
            days[dayKey] = item;
          }
        }
      });

      const forecastContainer = document.getElementById("weather_widget_forecast");
      forecastContainer.innerHTML = "";
      Object.keys(days).forEach((day) => {
        const item = days[day];
        const forecastDay = document.createElement('div');
        forecastDay.className = 'weather_widget_forecast_day';
        forecastDay.innerHTML = `
          <strong>${day}</strong>
          <img src="https://openweathermap.org/img/wn/${
            item.weather[0].icon
          }.png">
          <div>${Math.round(item.main.temp_max)}° / ${Math.round(
            item.main.temp_min
          )}°</div>
          <p>${item.weather[0].description}</p>
        `;
        forecastContainer.appendChild(forecastDay);
      });
    } catch (error) {
      console.error('Weather fetch error:', error);
    }
  }

  // 8. Load default weather - same as original
  fetchWeather("goa");

})();