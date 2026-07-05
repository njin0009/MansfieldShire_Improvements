const MANSFIELD_LOCATION = {
  latitude: -37.052,
  longitude: 146.088,
};

const weatherLabels = {
  clear: "Clear",
  clouds: "Cloudy",
  rain: "Rain",
  snow: "Snow",
  thunderstorm: "Storm",
  mist: "Mist",
};

const mapWeatherCode = (code) => {
  if ([0, 1].includes(code)) return "clear";
  if ([2, 3].includes(code)) return "clouds";
  if ([45, 48].includes(code)) return "mist";
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return "rain";
  if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) return "snow";
  if (code >= 95) return "thunderstorm";
  return "clouds";
};

const formatTime = (isoTime) => {
  const date = isoTime ? new Date(isoTime) : new Date();

  return new Intl.DateTimeFormat("en-AU", {
    weekday: "short",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
};

export function initWeatherWidget() {
  const widget = document.querySelector("[data-weather-widget]");

  if (!widget) return;

  const temp = widget.querySelector("[data-weather-temp]");
  const city = widget.querySelector("[data-weather-city]");
  const time = widget.querySelector("[data-weather-time]");
  const icon = widget.querySelector("[data-weather-icon]");
  const refresh = widget.querySelector("[data-weather-refresh]");

  const renderWeather = ({ temperature, type, dateTime, location }) => {
    temp.textContent = `${Math.round(temperature)}°`;
    city.textContent = location;
    time.textContent = `${weatherLabels[type] || "Current weather"} · ${dateTime}`;
    icon.dataset.weather = type;
    widget.classList.remove("is-loading");
  };

  const renderFallback = () => {
    renderWeather({
      temperature: 9,
      type: "mist",
      dateTime: formatTime(),
      location: "Mansfield",
    });
  };

  const fetchWeather = async () => {
    widget.classList.add("is-loading");

    try {
      const url = new URL("https://api.open-meteo.com/v1/forecast");
      url.searchParams.set("latitude", String(MANSFIELD_LOCATION.latitude));
      url.searchParams.set("longitude", String(MANSFIELD_LOCATION.longitude));
      url.searchParams.set("current", "temperature_2m,weather_code,is_day");
      url.searchParams.set("timezone", "Australia/Sydney");

      const response = await fetch(url);

      if (!response.ok) throw new Error("Weather request failed");

      const data = await response.json();
      const current = data.current;

      renderWeather({
        temperature: current.temperature_2m,
        type: mapWeatherCode(current.weather_code),
        dateTime: formatTime(current.time),
        location: "Mansfield",
      });
    } catch {
      renderFallback();
    }
  };

  refresh.addEventListener("click", fetchWeather);
  fetchWeather();
}
