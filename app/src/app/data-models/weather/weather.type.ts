export interface WeatherApiResponse {
    message: string;
    cod: string;
    count: number;
    list: CityWeather[];
}

export interface CityWeather {
    id: number; // City ID
    name: string; // City name
    coord: Coordinates;
    main: MainWeather;
    dt: number; // Time of data calculation, unix, UTC
    wind: Wind;
    sys: SystemInfo;
    rain: Rain | null;
    snow: Snow | null;
    clouds: Clouds;
    weather: Weather[];
    visibility?: number; // Visibility, meter. The maximum value of the visibility is 10 km
    timezone?: number; // Shift in seconds from UTC
}

interface Coordinates {
    lat: number;
    lon: number;
}

interface MainWeather {
    temp: number; // Temperature
    feels_like: number; // Temperature parameter that accounts for the human perception of weather
    temp_min: number; // Minimum temperature at the moment
    temp_max: number; // Maximum temperature at the moment
    pressure: number; // Atmospheric pressure on the sea level, hPa
    humidity: number; // Humidity, %
    sea_level?: number; // Atmospheric pressure on the sea level, hPa
    grnd_level?: number; // Atmospheric pressure on the ground level, hPa
}

interface Wind {
    speed: number; // Wind speed
    deg: number; // Wind direction, degrees (meteorological)
    gust?: number; // Wind gust
}

interface SystemInfo {
    country: string; // Country code 
    sunrise?: number; // Sunrise time, unix, UTC
    sunset?: number; // Sunset time, unix, UTC
}

interface Rain {
    [key: string]: number; // Rain volume for the last 1 hour/3 hours, mm
}

interface Snow {
    [key: string]: number; // Snow volume for the last 1 hour/3 hours, mm
}

interface Clouds {
    all: number; // Cloudiness, %
}

interface Weather {
    id: number; // Weather condition id
    main: string; // Group of weather parameters (Rain, Snow, Clouds etc.)
    description: string; // Weather condition within the group
    icon: string; // Weather icon id
}