// Система получения реальных расстояний через API
// Поддерживает несколько источников с fallback

class DistanceAPI {
  constructor() {
    // Приоритет источников данных
    this.providers = [
      'static',         // Статическая база - мгновенно
      'openrouteservice', // OpenRouteService - 2000 запросов/день
      'osrm',          // OSRM - бесплатный, но умеренное использование
      'haversine'      // Формула по координатам - fallback
    ];
    
    // Кэш для избежания повторных запросов
    this.cache = new Map();
    this.cacheKey = (from, to) => `${from}-${to}`;
    
    // Счетчики использования
    this.usage = {
      static: 0,
      openrouteservice: 0,
      osrm: 0,
      haversine: 0
    };
  }

  // Главная функция получения расстояния
  async getDistance(fromCity, toCity) {
    const cacheKey = this.cacheKey(fromCity, toCity);
    
    // Проверяем кэш
    if (this.cache.has(cacheKey)) {
      console.log(`📦 Кэш: ${fromCity} → ${toCity} = ${this.cache.get(cacheKey)}км`);
      return this.cache.get(cacheKey);
    }

    let distance = null;
    let usedProvider = null;
    
    // Пробуем разные источники
    for (const provider of this.providers) {
      try {
        distance = await this.getFromProvider(provider, fromCity, toCity);
        if (distance) {
          usedProvider = provider;
          this.usage[provider]++;
          break;
        }
      } catch (error) {
        console.warn(`⚠️ Provider ${provider} failed:`, error.message);
        continue;
      }
    }
    
    // Кэшируем результат
    if (distance) {
      this.cache.set(cacheKey, distance);
      console.log(`✅ ${usedProvider}: ${fromCity} → ${toCity} = ${distance}км`);
    } else {
      console.error(`❌ Не удалось получить расстояние для ${fromCity} → ${toCity}`);
    }
    
    return distance || 0;
  }

  // Получение от конкретного провайдера
  async getFromProvider(provider, fromCity, toCity) {
    switch (provider) {
      case 'static':
        return this.getFromStatic(fromCity, toCity);
      case 'openrouteservice':
        return await this.getFromOpenRouteService(fromCity, toCity);
      case 'osrm':
        return await this.getFromOSRM(fromCity, toCity);
      case 'haversine':
        return this.getFromHaversine(fromCity, toCity);
      default:
        return null;
    }
  }

  // Статическая таблица (приоритет)
  getFromStatic(fromCity, toCity) {
    if (typeof getRealDistance === 'function') {
      return getRealDistance(fromCity, toCity);
    }
    return null;
  }

  // OpenRouteService API (2000 запросов/день)
  async getFromOpenRouteService(fromCity, toCity) {
    const coords = this.getCityCoords(fromCity, toCity);
    if (!coords) return null;

    // OpenRouteService API v2 endpoint
    const url = 'https://api.openrouteservice.org/v2/directions/driving-hgv';
    
    // API ключ (публичный демо-ключ, для продакшена нужен свой)
    const API_KEY = '5b3ce3597851110001cf6248d1bbcf73514c4d5e9a5b4d7e8a4a0a4f';
    
    const params = new URLSearchParams({
      start: `${coords.from.lng},${coords.from.lat}`,
      end: `${coords.to.lng},${coords.to.lat}`,
      api_key: API_KEY
    });

    try {
      console.log(`🌐 OpenRouteService: запрос ${fromCity} → ${toCity}`);
      
      const response = await fetch(`${url}?${params}`, {
        headers: {
          'Accept': 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.features && data.features[0] && data.features[0].properties) {
        const distanceMeters = data.features[0].properties.segments[0].distance;
        return Math.round(distanceMeters / 1000); // метры в километры
      }
      
      throw new Error('Неожиданный формат ответа от OpenRouteService');
      
    } catch (error) {
      console.warn('🚫 OpenRouteService API error:', error.message);
      return null;
    }
  }

  // Open Source Routing Machine (бесплатный)
  async getFromOSRM(fromCity, toCity) {
    const coords = this.getCityCoords(fromCity, toCity);
    if (!coords) return null;

    const url = `https://router.project-osrm.org/route/v1/driving/` +
      `${coords.from.lng},${coords.from.lat};${coords.to.lng},${coords.to.lat}` +
      `?overview=false&alternatives=false&steps=false`;

    try {
      console.log(`🛣️ OSRM: запрос ${fromCity} → ${toCity}`);
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.code === 'Ok' && data.routes && data.routes[0]) {
        return Math.round(data.routes[0].distance / 1000);
      }
      
      throw new Error(`OSRM error: ${data.message || 'Unknown error'}`);
      
    } catch (error) {
      console.warn('🚫 OSRM API error:', error.message);
      return null;
    }
  }

  // Формула Haversine (математический расчет)
  getFromHaversine(fromCity, toCity) {
    const coords = this.getCityCoords(fromCity, toCity);
    if (!coords) return null;

    const R = 6371; // Радиус Земли в км
    const dLat = (coords.to.lat - coords.from.lat) * Math.PI / 180;
    const dLon = (coords.to.lng - coords.from.lng) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(coords.from.lat * Math.PI / 180) * Math.cos(coords.to.lat * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    
    console.log(`📐 Haversine: ${fromCity} → ${toCity} = ${Math.round(R * c)}км (приблизительно)`);
    return Math.round(R * c);
  }

  // Получение координат городов (расширенная база)
  getCityCoords(fromCity, toCity) {
    const CITY_COORDS = {
      // Основные города России
      "moskva": { lat: 55.7558, lng: 37.6176 },
      "spb": { lat: 59.9311, lng: 30.3609 },
      "kazan": { lat: 55.8304, lng: 49.0661 },
      "voronezh": { lat: 51.6754, lng: 39.2088 },
      "samara": { lat: 53.2001, lng: 50.1500 },
      "nizhniy-novgorod": { lat: 56.3287, lng: 44.0020 },
      "ekaterinburg": { lat: 56.8431, lng: 60.6454 },
      "rostov": { lat: 47.2357, lng: 39.7015 },
      "chelyabinsk": { lat: 55.1644, lng: 61.4368 },
      "ufa": { lat: 54.7388, lng: 55.9721 },
      "ryazan": { lat: 54.6269, lng: 39.6916 },
      "tula": { lat: 54.1961, lng: 37.6182 },
      "yaroslavl": { lat: 57.6261, lng: 39.8845 },
      "vladimir": { lat: 56.1366, lng: 40.3966 },
      "kaluga": { lat: 54.5293, lng: 36.2754 },
      "smolensk": { lat: 54.7818, lng: 32.0401 },
      "bryansk": { lat: 53.2434, lng: 34.3641 },
      "orel": { lat: 52.9691, lng: 36.0699 },
      "kursk": { lat: 51.7373, lng: 36.1873 },
      "belgorod": { lat: 50.5952, lng: 36.5804 },
      "lipetsk": { lat: 52.6031, lng: 39.5708 },
      "tambov": { lat: 52.7213, lng: 41.4633 },
      "penza": { lat: 53.2001, lng: 45.0000 },
      "saransk": { lat: 54.1838, lng: 45.1749 },
      "cheboksary": { lat: 56.1439, lng: 47.2489 },
      "kirov": { lat: 58.6035, lng: 49.6679 },
      "izhevsk": { lat: 56.8431, lng: 53.2045 },
      "perm": { lat: 58.0105, lng: 56.2502 },
      "orenburg": { lat: 51.7727, lng: 55.0988 },
      "saratov": { lat: 51.5924, lng: 46.0348 },
      "volgograd": { lat: 48.7080, lng: 44.5133 },
      "astrakhan": { lat: 46.3497, lng: 48.0408 },
      "krasnodar": { lat: 45.0328, lng: 38.9769 },
      "sochi": { lat: 43.6028, lng: 39.7342 },
      "stavropol": { lat: 45.0428, lng: 41.9734 },
      "makhachkala": { lat: 42.9849, lng: 47.5047 },
      "grozny": { lat: 43.3181, lng: 45.6986 },
      "nalchik": { lat: 43.4981, lng: 43.6189 },
      
      // Расширение для других городов
      "kostroma": { lat: 57.7665, lng: 40.9269 },
      "tver": { lat: 56.8596, lng: 35.9007 },
      "pskov": { lat: 57.8136, lng: 28.3496 },
      "novgorod": { lat: 58.5218, lng: 31.2756 },
      "petrozavodsk": { lat: 61.7849, lng: 34.3469 },
      "arkhangelsk": { lat: 64.5401, lng: 40.5433 },
      "murmansk": { lat: 68.9585, lng: 33.0827 },
      "syktyvkar": { lat: 61.6681, lng: 50.8372 },
      "vologda": { lat: 59.2239, lng: 39.8839 },
      "ivanovo": { lat: 56.9999, lng: 40.9739 },
      
      // Сибирь и Дальний Восток
      "novosibirsk": { lat: 55.0084, lng: 82.9357 },
      "omsk": { lat: 54.9893, lng: 73.3682 },
      "krasnoyarsk": { lat: 56.0184, lng: 92.8672 },
      "irkutsk": { lat: 52.2978, lng: 104.2964 },
      "khabarovsk": { lat: 48.4827, lng: 135.0839 },
      "vladivostok": { lat: 43.1056, lng: 131.8735 },
      "tomsk": { lat: 56.5017, lng: 84.9563 },
      "kemerovo": { lat: 55.3331, lng: 86.0844 },
      "novokuznetsk": { lat: 53.7596, lng: 87.1216 },
      "barnaul": { lat: 53.3606, lng: 83.7636 },
      "chita": { lat: 52.0349, lng: 113.4695 },
      "yakutsk": { lat: 62.0355, lng: 129.6755 },
      "magadan": { lat: 59.5684, lng: 150.8048 },
      "petropavlovsk-kamchatsky": { lat: 53.0445, lng: 158.6475 },
      "yuzhno-sakhalinsk": { lat: 46.9588, lng: 142.7386 },
      "tyumen": { lat: 57.1522, lng: 65.5272 },
      "surgut": { lat: 61.2500, lng: 73.4167 },
      "kurgan": { lat: 55.4500, lng: 65.3333 }
    };

    const from = CITY_COORDS[fromCity];
    const to = CITY_COORDS[toCity];
    
    if (!from || !to) {
      console.warn(`⚠️ Координаты не найдены для ${fromCity} или ${toCity}`);
      return null;
    }
    
    return { from, to };
  }

  // Batch запрос для нескольких маршрутов
  async getDistancesBatch(routes) {
    const promises = routes.map(async (route) => {
      try {
        const distance = await this.getDistance(route.from, route.to);
        return { ...route, distance, status: 'success' };
      } catch (error) {
        return { ...route, distance: null, status: 'error', error: error.message };
      }
    });
    
    return await Promise.all(promises);
  }

  // Получение статистики использования
  getUsageStats() {
    const total = Object.values(this.usage).reduce((sum, count) => sum + count, 0);
    const stats = {};
    
    for (const [provider, count] of Object.entries(this.usage)) {
      stats[provider] = {
        count,
        percentage: total > 0 ? Math.round((count / total) * 100) : 0
      };
    }
    
    return {
      total,
      providers: stats,
      cacheSize: this.cache.size
    };
  }

  // Очистка кэша
  clearCache() {
    this.cache.clear();
    console.log('🗑️ Кэш расстояний очищен');
  }

  // Проверка лимитов API
  checkApiLimits() {
    const stats = this.getUsageStats();
    
    if (stats.providers.openrouteservice?.count > 1800) {
      console.warn('⚠️ OpenRouteService: приближаемся к дневному лимиту (2000)');
    }
    
    if (stats.providers.osrm?.count > 500) {
      console.warn('⚠️ OSRM: много запросов, возможна блокировка');
    }
    
    return stats;
  }
}

// Глобальный экземпляр
const distanceAPI = new DistanceAPI();

// Удобная функция для прямого использования
async function getRouteDistance(fromCity, toCity) {
  return await distanceAPI.getDistance(fromCity, toCity);
}

// Экспорт
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { DistanceAPI, distanceAPI, getRouteDistance };
}

// Для браузера
if (typeof window !== 'undefined') {
  window.DistanceAPI = DistanceAPI;
  window.distanceAPI = distanceAPI;
  window.getRouteDistance = getRouteDistance;
}