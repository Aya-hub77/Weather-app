import sunny from '../assets/icon-sunny.webp'
import rain from '../assets/icon-rain.webp'
import drizzle from '../assets/icon-drizzle.webp'
import partly from '../assets/icon-partly-cloudy.webp'
import storm from '../assets/icon-storm.webp'
import overcast from '../assets/icon-overcast.webp'
import snow from '../assets/icon-snow.webp'
import fog from '../assets/icon-fog.webp'
import { IoSearch } from "react-icons/io5";
import { useState, useEffect } from 'react'
import axios from 'axios'
import ApiError from './ApiError'

const Weather = () => {
    const [lat, setLat] = useState<number | null>(null);
    const [lon, setLon] = useState<number | null>(null);
    const [weather, setWeather] = useState<WeatherResponse | null>(null);
    const [city, setCity] = useState("");
    const [country, setCountry] = useState("");
    const [search, setSearch] = useState("");
    const [error, setError] = useState(false);
    useEffect (() => {
        if (!navigator.geolocation) return console.log("Geolocation not supported");
        navigator.geolocation.getCurrentPosition(
            (position) => {
                    setLat(position.coords.latitude);
                    setLon(position.coords.longitude);
                    console.log("Coords:", lat, lon);
                },
            (error) => {
                 if (error.code === error.PERMISSION_DENIED) { console.log("User denied permission for Geolocation")
                 } else if (error.code === error.POSITION_UNAVAILABLE) { console.log("Location information is unavailable")
                 } else { console.log("An unknown error occurred")}
            }
            )
        }, []);

type CurrentWeather = {
    temperature: number;
    windspeed: number;
    weathercode: number;
};
type HourlyWeather = {
    time: string[];
    temperature_2m: number[];
    apparent_temperature: number[];
    windspeed_10m: number[];
    precipitation_probability: number[];
    relativehumidity_2m: number[];
    weathercode: number[];
};
type DailyWeather = {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    apparent_temperature_max: number[];
    apparent_temperature_min: number[];
    precipitation_sum: number[];
    weathercode: number[];
};
type WeatherResponse = {
    current_weather: CurrentWeather;
    hourly: HourlyWeather;
    daily: DailyWeather;
};
useEffect(() => {
    if (lat != null && lon != null) {
        const fetchWeather = async () => {
            try {
                setError(false);
                const res = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=temperature_2m,apparent_temperature,windspeed_10m,precipitation,precipitation_probability,relativehumidity_2m,weathercode&daily=temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,precipitation_sum,weathercode&timezone=auto`);
                setWeather(res.data);
            } catch (err) {
                console.error(err);
                setError(true);
            }
        };
        fetchWeather();
    }
}, [lat, lon]);
useEffect(() => {
    if (lat != null && lon != null) {
        const fetchCity = async (lat: number, lon: number) => {
            try {
                const res = await axios.get(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`);
                setCity(res.data.city);
                setCountry(res.data.countryName);
            } catch (err) {
                console.error(err);
            }
        };
        fetchCity(lat, lon);
    }
}, [lat, lon]);
const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await axios.get(`https://api.geoapify.com/v1/geocode/search?text=${search}&apiKey=2d0841d096da467fb24bee7d3dcc2dbe`);
    const [lon, lat] = res.data.features[0].geometry.coordinates;
    setLat(lat);
    setLon(lon);
    setCity(res.data.features[0].properties.city || search);
    setCountry(res.data.features[0].properties.country);
}
    const date = new Date();
    const today = date.toDateString();
    const currentHourISO = date.toISOString().slice(0, 13) + ":00";
    const currentIndex: number = weather?.hourly.time.findIndex(t => t === currentHourISO) ?? 0;
    const next12Hours = weather?.hourly.time.slice(currentIndex, currentIndex + 12);
    const weatherCodeToIcon: Record<number, string> = { 0: sunny, 1:sunny, 2:partly, 3:overcast, 45:fog, 48:fog, 51:drizzle, 53:drizzle, 55:drizzle, 56:drizzle, 57:drizzle, 66:rain, 67:rain, 61:rain, 63:rain, 65:rain, 80:rain, 71:snow, 73:snow, 75:snow, 77:snow, 81:rain, 82:rain, 85:snow, 86:snow, 95:storm, 96:storm, 99:storm }
const dailyForecast = weather?.daily.time.map((day, i) => ({
  id: i,
  day: new Date(day).toLocaleDateString('en-US', { weekday: 'short' }),
  high: Math.round(weather.daily.temperature_2m_max[i]),
  low: Math.round(weather.daily.temperature_2m_min[i]),
  icon: weather.daily.weathercode ? weatherCodeToIcon[weather.daily.weathercode[0]] : sunny,
}));
    if (error) {
        return <ApiError onRetry={() => window.location.reload()} />;
    }
   return (
      <section>
      <main className="px-5 py-10">
        <h1 className="text-white text-[60px] text-center font-bold leading-tight mb-10 font-gro">How's the sky looking today?</h1>
        <form onSubmit={handleSearch} className="flex flex-col gap-3 media:flex-row justify-center">
            <div className="relative w-[100%] flex items-center media:max-w-[40%]"><IoSearch className="text-white absolute text-2xl left-4 " /><input className="w-[100%] bg-bgWhite py-3 rounded-[10px] text-xl text-white pl-14" type="text" placeholder="Search for a place..." value={search} onChange={e => setSearch(e.target.value)} required /></div>
            <button className="w-[100%] text-white bg-pur py-3 rounded-[10px] text-xl media:max-w-[150px] hover:bg-bgB" type="submit">Search</button>
        </form>
      </main>
      <div className='pb-10 flex flex-col media:justify-center media:flex-row media:gap-6 media:items-center'>
        <div>
            {weather && (
            <div className="bg-[url('./src/assets/bg-today-small.png')] media:bg-[url('./src/assets/bg-today-large.png')] bg-no-repeat bg-cover m-3 flex flex-col py-10 text-white text-center media:flex-row media:justify-between media:items-center media:px-6 media:py-14 media:w-[100%] ">
                <div className='flex flex-col'>
                <h3 className='text-[30px] font-bold'>{city}, {country} </h3>
                <p className='text-bold text-[20px] text-offWhite'>{today}</p>
                </div>
                <div className='flex flex-row items-center justify-center gap-5'>
                    <img className='w-[150px]' src={weather?.current_weather?.weathercode ? weatherCodeToIcon[weather.current_weather.weathercode] : sunny} alt="text" loading='lazy'/>
                    <h2 className='text-[80px] font-bold italic'>{weather?.current_weather.temperature}°</h2>
                </div>
            </div>
            )}
            <div className='columns-2 gap-4 m-4 media:columns-4 media:my-8 media:w-[100%]'>
                <div className='flex flex-col gap-4 p-[20px] w-[100%] bg-bgWhite rounded-[10px] mb-4 border border-gray-500'>
                    <p className='text-white text-[20px]'>Feels Liks</p>
                    <h5 className='text-white text-[36px]'>{weather?.hourly.apparent_temperature[0]} °C</h5>
                </div>
                <div className='flex flex-col gap-4 p-[20px] w-[100%] bg-bgWhite rounded-[10px] mb-4 border border-gray-500'>
                    <p className='text-white text-[20px]'>Wind</p>
                    <h5 className='text-white text-[36px]'>{weather?.current_weather.windspeed} Km</h5>
                </div>
                <div className='flex flex-col gap-4 p-[20px] w-[100%] bg-bgWhite rounded-[10px] mb-4 border border-gray-500'>
                    <p className='text-white text-[20px]'>Humidity</p>
                    <h5 className='text-white text-[36px]'>{weather?.hourly.relativehumidity_2m[0]} %</h5>
                </div>
                <div className='flex flex-col gap-4 p-[20px] w-[100%] bg-bgWhite rounded-[10px] mb-4 border border-gray-500'>
                    <p className='text-white text-[20px]'>Rain Chance</p>
                    <h5 className='text-white text-[36px]'>{weather?.hourly.precipitation_probability[0]} %</h5>
                </div>
            </div>
            <h3 className='text-white text-[24px] font-medium ml-4'>Daily forecast</h3>
            <div className='flex flex-row flex-wrap gap-4 p-4 media:w-[108%]'>
                {dailyForecast?.map((daily) =>(
                <div key={daily.id} className='flex flex-col gap-3 items-center bg-bgWhite text-white py-4 px-2 rounded-[10px] w-[30%] media:w-[12%] border border-gray-500'>
                    <p className='text-[18px]'>{daily.day}</p>
                    <img src={daily.icon} className='w-[70px]' alt="weather icon" loading='lazy'/>
                    <div className='flex flex-row items-center justify-between gap-6'>
                        <p>{daily.high}°C</p>
                        <p>{daily.low}°C</p>
                    </div>
                </div>
                ))}
            </div>
        </div>
        <div className='bg-bgPur rounded-[20px] m-4 text-white py-8 px-4 min-w-[350px] media:py-4'>
            <div className='flex flex-row items-center justify-between mb-5'>
                <h3 className='text-[22px] font-medium'>Hourly forecast</h3>
            </div>
            <div className='flex flex-col gap-4'>
                {next12Hours?.map((t, i) => {
                    return (
                <div key={t} className='flex flex-row items-center justify-between bg-bgWhite rounded-[10px] px-4 py-1 border border-gray-500'>
                    <div className='flex flex-row items-center gap-4'>
                        <img src={weather?.hourly.weathercode ? weatherCodeToIcon[weather.hourly.weathercode[i]] : sunny} className='w-[30px]' loading='lazy'/>
                        <p className='text-[22px]'>{t.slice(11, 16)}</p>
                    </div>
                    <p className='text-[18px]'>{weather?.hourly.temperature_2m[currentIndex + i]}°C</p>
                </div>
                    )
                })}
            </div>
        </div>
        </div>
      </section>
   )
}
export default Weather