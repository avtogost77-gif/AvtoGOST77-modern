// ===============================================
// ИНТЕРАКТИВНАЯ КАРТА ЛОГИСТИКИ v2.0
// Визуализация маршрутов и зон покрытия
// ===============================================

class InteractiveLogisticsMap {
  constructor() {
    this.map = null;
    this.routeLayer = null;
    this.coverageZones = [];
    this.markers = [];
    this.isInitialized = false;
    
    // Зоны покрытия компании
    this.zones = {
      moscow: {
        name: 'Москва и МО',
        center: [55.7558, 37.6176],
        radius: 150000, // 150 км
        color: '#2563eb',
        services: ['Экспресс-доставка', 'Аутсорсинг', 'Грузоперевозки']
      },
      spb: {
        name: 'Санкт-Петербург и ЛО',
        center: [59.9311, 30.3609],
        radius: 100000,
        color: '#7c3aed',
        services: ['Межрегиональные перевозки', 'Складская логистика']
      },
      central: {
        name: 'Центральная Россия',
        center: [54.7431, 35.2675],
        radius: 300000,
        color: '#059669',
        services: ['Магистральные перевозки', 'Дистрибуция']
      }
    };

    this.offices = [
      {
        name: 'Главный офис',
        coords: [55.7558, 37.6176],
        address: 'Москва, ул. Примерная, 1',
        phone: '+7 (495) 123-45-67',
        services: ['Все виды услуг'],
        type: 'main'
      },
      {
        name: 'Филиал СПб',
        coords: [59.9311, 30.3609],
        address: 'Санкт-Петербург, пр. Логистический, 25',
        phone: '+7 (812) 987-65-43',
        services: ['Региональная логистика'],
        type: 'branch'
      },
      {
        name: 'Склад Екатеринбург',
        coords: [56.8431, 60.6454],
        address: 'Екатеринбург, ул. Складская, 15',
        phone: '+7 (343) 555-12-34',
        services: ['Складские услуги', 'Кросс-докинг'],
        type: 'warehouse'
      }
    ];

    this.init();
  }

  async init() {
    try {
      await this.loadYandexMapsAPI();
      this.createMapContainer();
      this.initializeMap();
      this.addControls();
      this.bindEvents();
      this.isInitialized = true;
    } catch (error) {
      console.error('Ошибка инициализации карты:', error);
      this.showFallback();
    }
  }

  async loadYandexMapsAPI() {
    return new Promise((resolve, reject) => {
      if (window.ymaps) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://api-maps.yandex.ru/2.1/?apikey=ваш-api-ключ&lang=ru_RU';
      script.onload = () => {
        ymaps.ready(() => resolve());
      };
      script.onerror = () => reject(new Error('Не удалось загрузить Yandex Maps API'));
      document.head.appendChild(script);
    });
  }

  createMapContainer() {
    const mapHTML = `
      <section class="interactive-map-section section">
        <div class="container">
          <div class="map-header text-center">
            <h2 class="reveal">🗺️ География наших услуг</h2>
            <p class="text-lg text-muted reveal">Интерактивная карта покрытия и маршрутов</p>
          </div>

          <div class="map-container reveal">
            <div class="map-sidebar">
              <div class="map-controls">
                <h4>Управление картой</h4>
                
                <div class="control-group">
                  <label class="control-label">Показать зоны покрытия</label>
                  <div class="control-buttons">
                    <button class="btn btn-sm zone-btn" data-zone="moscow">Москва</button>
                    <button class="btn btn-sm zone-btn" data-zone="spb">СПб</button>
                    <button class="btn btn-sm zone-btn" data-zone="central">Центр</button>
                    <button class="btn btn-sm btn-secondary" id="clear-zones">Очистить</button>
                  </div>
                </div>

                <div class="control-group">
                  <label class="control-label">Построить маршрут</label>
                  <div class="route-builder">
                    <input type="text" id="route-from" placeholder="Откуда" class="route-input">
                    <input type="text" id="route-to" placeholder="Куда" class="route-input">
                    <button class="btn btn-primary btn-sm" id="build-route">
                      <i class="bi bi-arrow-right"></i> Построить
                    </button>
                    <button class="btn btn-secondary btn-sm" id="clear-route">Очистить</button>
                  </div>
                </div>

                <div class="control-group">
                  <label class="control-label">Наши офисы</label>
                  <div class="offices-list">
                    ${this.offices.map((office, index) => `
                      <div class="office-item" data-office="${index}">
                        <div class="office-icon ${office.type}"></div>
                        <div class="office-info">
                          <div class="office-name">${office.name}</div>
                          <div class="office-address">${office.address}</div>
                        </div>
                      </div>
                    `).join('')}
                  </div>
                </div>
              </div>

              <div class="map-legend">
                <h5>Легенда</h5>
                <div class="legend-item">
                  <div class="legend-color" style="background: #2563eb;"></div>
                  <span>Зона экспресс-доставки</span>
                </div>
                <div class="legend-item">
                  <div class="legend-color" style="background: #7c3aed;"></div>
                  <span>Региональное покрытие</span>
                </div>
                <div class="legend-item">
                  <div class="legend-color" style="background: #059669;"></div>
                  <span>Федеральная сеть</span>
                </div>
              </div>
            </div>

            <div class="map-wrapper">
              <div id="yandex-map" class="map-canvas"></div>
              
              <div class="map-overlay">
                <div class="map-stats">
                  <div class="stat-item">
                    <div class="stat-number" id="covered-cities">150+</div>
                    <div class="stat-label">городов покрытия</div>
                  </div>
                  <div class="stat-item">
                    <div class="stat-number" id="total-distance">50000+</div>
                    <div class="stat-label">км маршрутов</div>
                  </div>
                  <div class="stat-item">
                    <div class="stat-number" id="delivery-time">24ч</div>
                    <div class="stat-label">средняя доставка</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="route-info" id="route-info" style="display: none;">
            <div class="route-card card">
              <h4>📍 Информация о маршруте</h4>
              <div class="route-details" id="route-details"></div>
              <div class="route-actions">
                <button class="btn btn-primary" onclick="window.smartCalculator && window.smartCalculator.prefillRoute()">
                  💰 Рассчитать стоимость
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;

    // Найдем место для вставки карты (после калькулятора)
    const calcSection = document.getElementById('smart-calculator');
    if (calcSection && calcSection.nextElementSibling) {
      calcSection.parentNode.insertBefore(
        this.createElementFromHTML(mapHTML), 
        calcSection.nextElementSibling
      );
    } else {
      document.body.appendChild(this.createElementFromHTML(mapHTML));
    }
  }

  createElementFromHTML(htmlString) {
    const div = document.createElement('div');
    div.innerHTML = htmlString.trim();
    return div.firstChild;
  }

  initializeMap() {
    this.map = new ymaps.Map('yandex-map', {
      center: [55.7558, 37.6176], // Москва
      zoom: 5,
      controls: ['zoomControl', 'typeSelector', 'fullscreenControl']
    }, {
      searchControlProvider: 'yandex#search'
    });

    // Добавляем офисы на карту
    this.addOfficesToMap();
    
    // Инициализируем кластеризатор для маркеров
    this.clusterer = new ymaps.Clusterer({
      preset: 'islands#blueClusterIcons',
      groupByCoordinates: false,
      clusterDisableClickZoom: false,
      clusterHideIconOnBalloonOpen: false,
      geoObjectHideIconOnBalloonOpen: false
    });

    this.map.geoObjects.add(this.clusterer);
  }

  addOfficesToMap() {
    this.offices.forEach((office, index) => {
      const iconType = this.getOfficeIcon(office.type);
      
      const placemark = new ymaps.Placemark(office.coords, {
        balloonContentHeader: office.name,
        balloonContentBody: `
          <div class="balloon-content">
            <p><strong>Адрес:</strong> ${office.address}</p>
            <p><strong>Телефон:</strong> ${office.phone}</p>
            <p><strong>Услуги:</strong> ${office.services.join(', ')}</p>
            <div class="balloon-actions">
              <button class="btn btn-sm btn-primary" onclick="window.interactiveMap.showOfficeRoute(${index})">
                Построить маршрут
              </button>
            </div>
          </div>
        `,
        hintContent: office.name
      }, {
        preset: iconType,
        iconColor: office.type === 'main' ? '#2563eb' : office.type === 'branch' ? '#7c3aed' : '#059669'
      });

      this.map.geoObjects.add(placemark);
      this.markers.push(placemark);
    });
  }

  getOfficeIcon(type) {
    switch(type) {
      case 'main': return 'islands#blueStarIcon';
      case 'branch': return 'islands#purpleHomeIcon';
      case 'warehouse': return 'islands#greenDotIconWithCaption';
      default: return 'islands#grayDotIcon';
    }
  }

  addControls() {
    // Обработчики для зон покрытия
    document.querySelectorAll('.zone-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const zone = e.target.dataset.zone;
        this.toggleZone(zone);
        btn.classList.toggle('active');
      });
    });

    // Очистка зон
    document.getElementById('clear-zones').addEventListener('click', () => {
      this.clearZones();
      document.querySelectorAll('.zone-btn').forEach(btn => btn.classList.remove('active'));
    });

    // Построение маршрута
    document.getElementById('build-route').addEventListener('click', () => {
      this.buildRoute();
    });

    // Очистка маршрута
    document.getElementById('clear-route').addEventListener('click', () => {
      this.clearRoute();
    });

    // Клики по офисам
    document.querySelectorAll('.office-item').forEach((item, index) => {
      item.addEventListener('click', () => {
        this.focusOnOffice(index);
      });
    });
  }

  toggleZone(zoneKey) {
    const zone = this.zones[zoneKey];
    if (!zone) return;

    const existingZone = this.coverageZones.find(z => z.key === zoneKey);
    
    if (existingZone) {
      // Удаляем зону
      this.map.geoObjects.remove(existingZone.circle);
      this.coverageZones = this.coverageZones.filter(z => z.key !== zoneKey);
    } else {
      // Добавляем зону
      const circle = new ymaps.Circle([zone.center, zone.radius], {
        balloonContent: `
          <div class="zone-balloon">
            <h4>${zone.name}</h4>
            <p><strong>Услуги:</strong></p>
            <ul>
              ${zone.services.map(service => `<li>${service}</li>`).join('')}
            </ul>
          </div>
        `
      }, {
        fillColor: zone.color + '30',
        strokeColor: zone.color,
        strokeOpacity: 0.8,
        strokeWidth: 2
      });

      this.map.geoObjects.add(circle);
      this.coverageZones.push({ key: zoneKey, circle, zone });
    }
  }

  clearZones() {
    this.coverageZones.forEach(({ circle }) => {
      this.map.geoObjects.remove(circle);
    });
    this.coverageZones = [];
  }

  async buildRoute() {
    const fromValue = document.getElementById('route-from').value;
    const toValue = document.getElementById('route-to').value;

    if (!fromValue || !toValue) {
      alert('Пожалуйста, укажите точки отправления и назначения');
      return;
    }

    try {
      // Геокодирование адресов
      const fromCoords = await this.geocodeAddress(fromValue);
      const toCoords = await this.geocodeAddress(toValue);

      if (!fromCoords || !toCoords) {
        alert('Не удалось найти один из адресов');
        return;
      }

      // Построение маршрута
      const route = await this.createRoute(fromCoords, toCoords);
      this.displayRoute(route, fromValue, toValue);

    } catch (error) {
      console.error('Ошибка построения маршрута:', error);
      alert('Не удалось построить маршрут');
    }
  }

  async geocodeAddress(address) {
    return new Promise((resolve) => {
      ymaps.geocode(address).then((result) => {
        const firstGeoObject = result.geoObjects.get(0);
        if (firstGeoObject) {
          resolve(firstGeoObject.geometry.getCoordinates());
        } else {
          resolve(null);
        }
      });
    });
  }

  async createRoute(fromCoords, toCoords) {
    return new Promise((resolve, reject) => {
      ymaps.route([fromCoords, toCoords], {
        mapStateAutoApply: true
      }).then((route) => {
        resolve(route);
      }, (error) => {
        reject(error);
      });
    });
  }

  displayRoute(route, fromAddress, toAddress) {
    // Удаляем предыдущий маршрут
    this.clearRoute();

    // Добавляем новый маршрут
    this.routeLayer = route;
    this.map.geoObjects.add(route);

    // Получаем информацию о маршруте
    const distance = route.getLength();
    const duration = route.getJamsTime();

    // Отображаем информацию
    this.showRouteInfo({
      from: fromAddress,
      to: toAddress,
      distance: Math.round(distance / 1000), // в км
      duration: Math.round(duration / 60) // в минутах
    });

    // Центрируем карту на маршруте
    this.map.setBounds(route.getBounds());
  }

  showRouteInfo(routeData) {
    const routeInfo = document.getElementById('route-info');
    const routeDetails = document.getElementById('route-details');

    routeDetails.innerHTML = `
      <div class="route-summary">
        <div class="route-endpoints">
          <div class="endpoint">
            <i class="bi bi-geo-alt-fill" style="color: #10b981;"></i>
            <span>${routeData.from}</span>
          </div>
          <div class="route-arrow">
            <i class="bi bi-arrow-down"></i>
          </div>
          <div class="endpoint">
            <i class="bi bi-geo-alt-fill" style="color: #ef4444;"></i>
            <span>${routeData.to}</span>
          </div>
        </div>
        
        <div class="route-metrics">
          <div class="metric">
            <i class="bi bi-speedometer2"></i>
            <span>${routeData.distance} км</span>
          </div>
          <div class="metric">
            <i class="bi bi-clock"></i>
            <span>${Math.floor(routeData.duration / 60)}ч ${routeData.duration % 60}м</span>
          </div>
          <div class="metric">
            <i class="bi bi-fuel-pump"></i>
            <span>~${Math.round(routeData.distance * 0.1)} л</span>
          </div>
        </div>
      </div>
    `;

    routeInfo.style.display = 'block';
    routeInfo.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    // Сохраняем данные маршрута для калькулятора
    this.lastRoute = routeData;
  }

  clearRoute() {
    if (this.routeLayer) {
      this.map.geoObjects.remove(this.routeLayer);
      this.routeLayer = null;
    }
    document.getElementById('route-info').style.display = 'none';
    this.lastRoute = null;
  }

  focusOnOffice(index) {
    const office = this.offices[index];
    if (office) {
      this.map.setCenter(office.coords, 12);
      this.markers[index].balloon.open();
    }
  }

  showOfficeRoute(officeIndex) {
    const office = this.offices[officeIndex];
    document.getElementById('route-to').value = office.address;
  }

  // Интеграция с калькулятором
  prefillCalculator() {
    if (this.lastRoute && window.smartCalculator) {
      // Заполняем поля калькулятора данными маршрута
      const fromInput = document.getElementById('from-city');
      const toInput = document.getElementById('to-city');
      
      if (fromInput && toInput) {
        fromInput.value = this.lastRoute.from;
        toInput.value = this.lastRoute.to;
        
        // Прокручиваем к калькулятору
        document.getElementById('smart-calculator').scrollIntoView({ 
          behavior: 'smooth' 
        });
      }
    }
  }

  showFallback() {
    // Показываем статичную карту в случае ошибки
    const mapContainer = document.getElementById('yandex-map');
    if (mapContainer) {
      mapContainer.innerHTML = `
        <div class="map-fallback">
          <div class="fallback-content">
            <i class="bi bi-map" style="font-size: 3rem; color: var(--neutral-400);"></i>
            <h4>Карта временно недоступна</h4>
            <p>Попробуйте обновить страницу или свяжитесь с нами для получения информации о маршрутах</p>
            <button class="btn btn-primary" onclick="location.reload()">
              Обновить страницу
            </button>
          </div>
        </div>
      `;
    }
  }

  bindEvents() {
    // Автодополнение для полей маршрута
    this.setupRouteAutocomplete();
    
    // Анимации при прокрутке
    this.initScrollAnimations();
  }

  setupRouteAutocomplete() {
    const cities = [
      'Москва', 'Санкт-Петербург', 'Новосибирск', 'Екатеринбург', 'Казань',
      'Нижний Новгород', 'Челябинск', 'Самара', 'Омск', 'Ростов-на-Дону'
    ];

    [{ id: 'route-from' }, { id: 'route-to' }].forEach(({ id }) => {
      const input = document.getElementById(id);
      if (!input) return;

      input.addEventListener('input', (e) => {
        const value = e.target.value.toLowerCase();
        // Простая реализация автодополнения
        // В реальном проекте лучше использовать API Яндекс.Карт
      });
    });
  }

  initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    });

    document.querySelectorAll('.reveal').forEach(el => {
      observer.observe(el);
    });
  }
}

// Инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', () => {
  window.interactiveMap = new InteractiveLogisticsMap();
});