import { WeatherInfo } from '@/app/backend/types/entities';
import { ServiceError } from './errors';

interface WeatherCacheEntry {
  data: WeatherInfo;
  expiresAt: number;
}

const weatherCache = new Map<string, WeatherCacheEntry>();

const WEATHER_CONDITION_MAP: Record<string, string> = {
  clear: 'clear',
  partly_cloudy: 'partly_cloudy',
  fog: 'fog',
  drizzle: 'drizzle',
  rain: 'rain',
  snow: 'snow',
  thunderstorm: 'thunderstorm',
};

function mapWmoCode(code: number): string {
  if (code === 0) return 'clear';
  if (code <= 3) return 'partly_cloudy';
  if (code <= 49) return 'fog';
  if (code <= 59) return 'drizzle';
  if (code <= 69) return 'rain';
  if (code <= 79) return 'snow';
  if (code <= 82) return 'rain';
  if (code <= 86) return 'snow';
  return 'thunderstorm';
}

export class WeatherService {
  private readonly cacheTtlMs: number;
  private readonly nominatimUserAgent: string;

  constructor() {
    this.cacheTtlMs = Number(process.env.WEATHER_CACHE_TTL_SECONDS ?? 1800) * 1000;
    this.nominatimUserAgent = process.env.NOMINATIM_USER_AGENT ?? 'sai-tcc-2026/1.0';
  }

  async getCurrentWeather(city: string): Promise<WeatherInfo> {
    const cacheKey = city.toLowerCase().trim();
    const cached = weatherCache.get(cacheKey);
    if (cached && Date.now() < cached.expiresAt) return cached.data;

    try {
      const { lat, lon } = await this.geocodeCity(city);
      const weather = await this.fetchWeather(lat, lon, city);
      weatherCache.set(cacheKey, { data: weather, expiresAt: Date.now() + this.cacheTtlMs });
      return weather;
    } catch (error) {
      if (error instanceof ServiceError) throw error;
      throw new ServiceError(`Failed to fetch weather for "${city}": ${error instanceof Error ? error.message : String(error)}`, 503);
    }
  }

  getTemperatureCategory(temp_c: number): 'summer' | 'spring_fall' | 'fall_layers' | 'winter' {
    if (temp_c >= 28) return 'summer';
    if (temp_c >= 18) return 'spring_fall';
    if (temp_c >= 10) return 'fall_layers';
    return 'winter';
  }

  buildWeatherFitNote(temp_c: number, condition: string): string {
    const category = this.getTemperatureCategory(temp_c);
    const condLabel = WEATHER_CONDITION_MAP[condition] ?? condition;
    const tempNote = `${temp_c.toFixed(0)}°C`;
    const categoryNote =
      category === 'summer' ? 'roupas leves' :
      category === 'spring_fall' ? 'roupas de meia-estação' :
      category === 'fall_layers' ? 'camadas e sobreposição' :
      'roupas de inverno';
    const condNote = condLabel === 'rain' || condLabel === 'drizzle' ? ' com chuva' :
      condLabel === 'snow' ? ' com neve' :
      condLabel === 'thunderstorm' ? ' com tempestade' : '';
    return `Adequado para ${tempNote}${condNote} — ${categoryNote}`;
  }

  private async geocodeCity(city: string): Promise<{ lat: number; lon: number }> {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': this.nominatimUserAgent,
        'Accept': 'application/json',
      },
    });
    if (!response.ok) {
      throw new ServiceError(`Nominatim geocoding failed with status ${response.status}`, 503);
    }
    const data = await response.json() as Array<{ lat: string; lon: string }>;
    if (!data.length) {
      throw new ServiceError(`City not found: "${city}"`, 404);
    }
    return { lat: Number(data[0].lat), lon: Number(data[0].lon) };
  }

  private async fetchWeather(lat: number, lon: number, city: string): Promise<WeatherInfo> {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new ServiceError(`Open-Meteo API failed with status ${response.status}`, 503);
    }
    const data = await response.json() as {
      current_weather?: { temperature: number; weathercode: number };
    };
    if (!data.current_weather) {
      throw new ServiceError('Open-Meteo response missing current_weather', 503);
    }
    return {
      temp_c: data.current_weather.temperature,
      condition: mapWmoCode(data.current_weather.weathercode),
      city,
    };
  }
}
