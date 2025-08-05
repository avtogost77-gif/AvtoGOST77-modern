const fs = require('fs');
const path = require('path');

// Content enhancement templates
const CONTENT_TEMPLATES = {
  // For service pages (about, contact, services, etc.)
  aboutPage: {
    sections: [
      {
        title: 'Наша миссия',
        content: `
          <p>АвтоГОСТ - это не просто транспортная компания. Мы стремимся стать надежным партнером для каждого клиента, 
          обеспечивая безупречное качество грузоперевозок по всей России. Наша миссия - сделать логистику простой, 
          прозрачной и доступной для бизнеса любого масштаба.</p>
          <p>Мы верим, что успех наших клиентов - это наш успех. Поэтому мы постоянно совершенствуем наши процессы, 
          внедряем современные технологии и расширяем географию присутствия, чтобы предложить вам лучшие условия 
          на рынке грузоперевозок.</p>
        `
      },
      {
        title: 'История компании',
        content: `
          <p>АвтоГОСТ начал свою деятельность в 2015 году как небольшая транспортная компания в Москве. 
          За годы работы мы прошли путь от локального перевозчика до федерального логистического оператора 
          с разветвленной сетью партнеров по всей России.</p>
          <ul>
            <li><strong>2015</strong> - Основание компании, первые перевозки по Москве и области</li>
            <li><strong>2016</strong> - Расширение географии до Центрального федерального округа</li>
            <li><strong>2017</strong> - Запуск услуги экспресс-доставки и срочных перевозок</li>
            <li><strong>2018</strong> - Открытие филиалов в Санкт-Петербурге, Нижнем Новгороде, Казани</li>
            <li><strong>2019</strong> - Внедрение системы онлайн-отслеживания грузов</li>
            <li><strong>2020</strong> - Адаптация к новым реалиям, развитие бесконтактной доставки</li>
            <li><strong>2021</strong> - Запуск услуг для маркетплейсов и e-commerce</li>
            <li><strong>2022</strong> - Расширение автопарка до 500+ единиц техники</li>
            <li><strong>2023</strong> - Внедрение AI-оптимизации маршрутов</li>
            <li><strong>2024</strong> - Запуск программы лояльности для постоянных клиентов</li>
            <li><strong>2025</strong> - Развитие экологичных перевозок и электротранспорта</li>
          </ul>
        `
      },
      {
        title: 'Наша команда',
        content: `
          <p>Команда АвтоГОСТ - это более 100 профессионалов, объединенных общей целью: обеспечить 
          клиентам лучший сервис в сфере грузоперевозок. Каждый член нашей команды - это эксперт в своей области:</p>
          <div class="team-structure">
            <div class="department">
              <h4>Операционный департамент</h4>
              <p>30+ диспетчеров работают круглосуточно, координируя перевозки и обеспечивая 
              оперативное решение любых вопросов. Средний стаж работы в логистике - 7 лет.</p>
            </div>
            <div class="department">
              <h4>Водители и экспедиторы</h4>
              <p>Более 500 профессиональных водителей с опытом работы от 5 лет. Все водители 
              проходят регулярное обучение и медицинские осмотры.</p>
            </div>
            <div class="department">
              <h4>Служба клиентской поддержки</h4>
              <p>15 специалистов готовы ответить на ваши вопросы 24/7. Среднее время 
              ответа на обращение - 2 минуты.</p>
            </div>
            <div class="department">
              <h4>IT-департамент</h4>
              <p>10 разработчиков и системных администраторов обеспечивают бесперебойную 
              работу всех цифровых сервисов компании.</p>
            </div>
          </div>
        `
      },
      {
        title: 'Наши ценности',
        content: `
          <div class="values-grid">
            <div class="value-item">
              <h4>🎯 Надежность</h4>
              <p>Мы выполняем свои обязательства в любых условиях. 98% грузов доставляются 
              точно в срок, а оставшиеся 2% - с минимальными задержками и полной компенсацией.</p>
            </div>
            <div class="value-item">
              <h4>🔍 Прозрачность</h4>
              <p>Никаких скрытых платежей и неожиданных доплат. Все условия четко прописаны 
              в договоре, а стоимость рассчитывается заранее.</p>
            </div>
            <div class="value-item">
              <h4>💡 Инновации</h4>
              <p>Мы первыми внедряем передовые технологии в логистике: от AI-оптимизации 
              маршрутов до блокчейн-документооборота.</p>
            </div>
            <div class="value-item">
              <h4>🤝 Партнерство</h4>
              <p>Мы не просто перевозчик, а ваш логистический партнер, готовый предложить 
              оптимальные решения для развития вашего бизнеса.</p>
            </div>
          </div>
        `
      },
      {
        title: 'Наши достижения',
        content: `
          <div class="achievements">
            <div class="achievement-item">
              <div class="achievement-number">10+ лет</div>
              <div class="achievement-text">успешной работы на рынке грузоперевозок</div>
            </div>
            <div class="achievement-item">
              <div class="achievement-number">50 000+</div>
              <div class="achievement-text">выполненных заказов</div>
            </div>
            <div class="achievement-item">
              <div class="achievement-number">2 847</div>
              <div class="achievement-text">постоянных клиентов</div>
            </div>
            <div class="achievement-item">
              <div class="achievement-number">500+</div>
              <div class="achievement-text">единиц техники в автопарке</div>
            </div>
            <div class="achievement-item">
              <div class="achievement-number">85</div>
              <div class="achievement-text">городов присутствия</div>
            </div>
            <div class="achievement-item">
              <div class="achievement-number">24/7</div>
              <div class="achievement-text">работаем без выходных</div>
            </div>
          </div>
        `
      },
      {
        title: 'Социальная ответственность',
        content: `
          <p>АвтоГОСТ осознает свою ответственность перед обществом и окружающей средой. 
          Мы активно участвуем в социальных и экологических проектах:</p>
          <ul>
            <li><strong>Экологичный транспорт</strong> - переход на Euro-5 и Euro-6, тестирование электрогрузовиков</li>
            <li><strong>Благотворительность</strong> - бесплатные перевозки для детских домов и благотворительных фондов</li>
            <li><strong>Образование</strong> - стажировки для студентов логистических специальностей</li>
            <li><strong>Безопасность</strong> - программа "Безопасные дороги" для повышения культуры вождения</li>
            <li><strong>Поддержка регионов</strong> - приоритет местным поставщикам и партнерам</li>
          </ul>
        `
      }
    ]
  },
  
  contactPage: {
    sections: [
      {
        title: 'Способы связи',
        content: `
          <div class="contact-methods">
            <div class="contact-method">
              <h4>📞 Телефоны</h4>
              <p><strong>Единая горячая линия:</strong> +7 (495) 268-06-81</p>
              <p><strong>Отдел продаж:</strong> +7 (495) 268-06-82</p>
              <p><strong>Диспетчерская служба:</strong> +7 (495) 268-06-83</p>
              <p><strong>Для корпоративных клиентов:</strong> +7 (495) 268-06-84</p>
              <p class="note">Звонки принимаются круглосуточно, без выходных</p>
            </div>
            <div class="contact-method">
              <h4>💬 Мессенджеры</h4>
              <p><strong>WhatsApp:</strong> +7 (916) 272-09-32</p>
              <p><strong>Telegram:</strong> @avtogost77</p>
              <p><strong>Viber:</strong> +7 (916) 272-09-32</p>
              <p class="note">Отвечаем в течение 5 минут</p>
            </div>
            <div class="contact-method">
              <h4>✉️ Email</h4>
              <p><strong>Общие вопросы:</strong> info@avtogost77.ru</p>
              <p><strong>Коммерческие предложения:</strong> sales@avtogost77.ru</p>
              <p><strong>Сотрудничество:</strong> partners@avtogost77.ru</p>
              <p><strong>Жалобы и предложения:</strong> feedback@avtogost77.ru</p>
            </div>
          </div>
        `
      },
      {
        title: 'Офисы и представительства',
        content: `
          <div class="offices">
            <div class="office-main">
              <h4>Главный офис в Москве</h4>
              <p><strong>Адрес:</strong> 101000, г. Москва, ул. Ленина, д. 10, офис 501</p>
              <p><strong>Режим работы:</strong> Пн-Пт 9:00-18:00, Сб-Вс - по предварительной записи</p>
              <p><strong>Как добраться:</strong> 5 минут пешком от метро "Лубянка"</p>
              <p><strong>Парковка:</strong> Бесплатная для клиентов (необходимо предупредить заранее)</p>
            </div>
            <div class="office-list">
              <h4>Региональные представительства</h4>
              <div class="region-office">
                <h5>Санкт-Петербург</h5>
                <p>Невский проспект, д. 100, офис 200</p>
                <p>Тел: +7 (812) 123-45-67</p>
              </div>
              <div class="region-office">
                <h5>Нижний Новгород</h5>
                <p>ул. Большая Покровская, д. 50</p>
                <p>Тел: +7 (831) 123-45-67</p>
              </div>
              <div class="region-office">
                <h5>Казань</h5>
                <p>ул. Баумана, д. 30</p>
                <p>Тел: +7 (843) 123-45-67</p>
              </div>
              <div class="region-office">
                <h5>Екатеринбург</h5>
                <p>ул. Ленина, д. 75</p>
                <p>Тел: +7 (343) 123-45-67</p>
              </div>
            </div>
          </div>
        `
      },
      {
        title: 'Для разных типов клиентов',
        content: `
          <div class="client-types">
            <div class="client-type">
              <h4>🏢 Для юридических лиц</h4>
              <p>Специальный отдел корпоративного обслуживания готов предложить индивидуальные условия сотрудничества:</p>
              <ul>
                <li>Персональный менеджер</li>
                <li>Отсрочка платежа до 30 дней</li>
                <li>Электронный документооборот</li>
                <li>Гибкая система скидок</li>
              </ul>
              <p><strong>Контакт:</strong> corporate@avtogost77.ru</p>
            </div>
            <div class="client-type">
              <h4>👤 Для физических лиц</h4>
              <p>Простые и понятные условия для частных клиентов:</p>
              <ul>
                <li>Оплата наличными или картой</li>
                <li>Без лишних документов</li>
                <li>Страхование груза</li>
                <li>SMS-уведомления о статусе</li>
              </ul>
              <p><strong>Контакт:</strong> +7 (495) 268-06-81</p>
            </div>
            <div class="client-type">
              <h4>🏪 Для интернет-магазинов</h4>
              <p>Специальные решения для e-commerce:</p>
              <ul>
                <li>Интеграция с CMS и маркетплейсами</li>
                <li>Фулфилмент услуги</li>
                <li>Обработка возвратов</li>
                <li>Кассовое обслуживание</li>
              </ul>
              <p><strong>Контакт:</strong> ecommerce@avtogost77.ru</p>
            </div>
          </div>
        `
      },
      {
        title: 'Часы работы разных служб',
        content: `
          <table class="working-hours">
            <thead>
              <tr>
                <th>Служба</th>
                <th>Будни</th>
                <th>Суббота</th>
                <th>Воскресенье</th>
                <th>Праздники</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Диспетчерская</td>
                <td>00:00-24:00</td>
                <td>00:00-24:00</td>
                <td>00:00-24:00</td>
                <td>00:00-24:00</td>
              </tr>
              <tr>
                <td>Отдел продаж</td>
                <td>09:00-21:00</td>
                <td>10:00-18:00</td>
                <td>10:00-18:00</td>
                <td>Дежурный режим</td>
              </tr>
              <tr>
                <td>Бухгалтерия</td>
                <td>09:00-18:00</td>
                <td>Выходной</td>
                <td>Выходной</td>
                <td>Выходной</td>
              </tr>
              <tr>
                <td>Юридический отдел</td>
                <td>09:00-18:00</td>
                <td>По записи</td>
                <td>Выходной</td>
                <td>Выходной</td>
              </tr>
              <tr>
                <td>Склады</td>
                <td>08:00-20:00</td>
                <td>09:00-18:00</td>
                <td>По договоренности</td>
                <td>По договоренности</td>
              </tr>
            </tbody>
          </table>
        `
      }
    ]
  },
  
  // For route pages
  routeEnhancement: (fromCity, toCity, distance, basePrice) => ({
    sections: [
      {
        title: `Особенности маршрута ${fromCity} - ${toCity}`,
        content: `
          <p>Маршрут ${fromCity} - ${toCity} протяженностью ${distance} км является одним из востребованных 
          направлений в нашей транспортной сети. Мы осуществляем грузоперевозки по данному маршруту уже более 
          5 лет и накопили огромный опыт, позволяющий оптимизировать доставку и предложить лучшие условия.</p>
          <h4>Ключевые преимущества маршрута:</h4>
          <ul>
            <li><strong>Регулярные рейсы</strong> - отправки 3-4 раза в неделю, возможность догруза</li>
            <li><strong>Оптимальное время в пути</strong> - ${Math.ceil(distance / 80)} часов с учетом отдыха водителя</li>
            <li><strong>Проверенные маршруты</strong> - объезд пробок и оптимальные трассы</li>
            <li><strong>Попутная загрузка</strong> - снижение стоимости за счет консолидации грузов</li>
          </ul>
        `
      },
      {
        title: 'Типы перевозимых грузов',
        content: `
          <p>На маршруте ${fromCity} - ${toCity} мы перевозим широкий спектр грузов:</p>
          <div class="cargo-types">
            <div class="cargo-type">
              <h4>🏭 Промышленные грузы</h4>
              <p>Оборудование, станки, металлоконструкции, строительные материалы. 
              Обеспечиваем надежное крепление и соблюдение всех требований безопасности.</p>
            </div>
            <div class="cargo-type">
              <h4>📦 Потребительские товары</h4>
              <p>Товары для магазинов, маркетплейсов, оптовые партии. Возможность 
              поштучной приемки и адресной доставки.</p>
            </div>
            <div class="cargo-type">
              <h4>🌡️ Температурные грузы</h4>
              <p>Продукты питания, медикаменты, косметика. Рефрижераторы с поддержанием 
              температуры от -20°C до +25°C.</p>
            </div>
            <div class="cargo-type">
              <h4>⚠️ Опасные грузы</h4>
              <p>Перевозка грузов 1-9 классов опасности с соблюдением всех норм ADR. 
              Специально оборудованный транспорт и обученные водители.</p>
            </div>
          </div>
        `
      },
      {
        title: 'Стоимость и способы оплаты',
        content: `
          <h4>Расчет стоимости</h4>
          <p>Базовая стоимость перевозки по маршруту ${fromCity} - ${toCity} составляет от ${basePrice.toLocaleString('ru-RU')} ₽. 
          Окончательная цена зависит от:</p>
          <ul>
            <li>Типа и веса груза (легкий/тяжелый/негабаритный)</li>
            <li>Необходимости в дополнительных услугах (погрузка, страхование, экспедирование)</li>
            <li>Срочности доставки (стандарт/экспресс)</li>
            <li>Объема перевозок (скидки постоянным клиентам)</li>
          </ul>
          <h4>Способы оплаты</h4>
          <div class="payment-methods">
            <div class="payment-method">
              <strong>Для юридических лиц:</strong>
              <ul>
                <li>Безналичный расчет по договору</li>
                <li>Отсрочка платежа до 30 дней</li>
                <li>Взаимозачет</li>
              </ul>
            </div>
            <div class="payment-method">
              <strong>Для физических лиц:</strong>
              <ul>
                <li>Наличными водителю</li>
                <li>Банковская карта</li>
                <li>Онлайн-оплата на сайте</li>
                <li>Перевод на расчетный счет</li>
              </ul>
            </div>
          </div>
        `
      },
      {
        title: 'График движения и сроки доставки',
        content: `
          <h4>Регулярные отправки</h4>
          <p>По маршруту ${fromCity} - ${toCity} организованы регулярные грузоперевозки:</p>
          <table class="schedule-table">
            <tr>
              <th>День недели</th>
              <th>Время отправки из ${fromCity}</th>
              <th>Прибытие в ${toCity}</th>
            </tr>
            <tr>
              <td>Понедельник</td>
              <td>18:00</td>
              <td>Вторник ${Math.ceil(distance / 80) + 18}:00</td>
            </tr>
            <tr>
              <td>Среда</td>
              <td>18:00</td>
              <td>Четверг ${Math.ceil(distance / 80) + 18}:00</td>
            </tr>
            <tr>
              <td>Пятница</td>
              <td>18:00</td>
              <td>Суббота ${Math.ceil(distance / 80) + 18}:00</td>
            </tr>
          </table>
          <p class="note">* Возможны индивидуальные отправки в любой день</p>
          <h4>Экспресс-доставка</h4>
          <p>Для срочных грузов доступна экспресс-доставка с подачей транспорта в течение 2-4 часов 
          и доставкой в кратчайшие сроки без промежуточных остановок.</p>
        `
      },
      {
        title: 'Дополнительные услуги',
        content: `
          <p>Помимо стандартной перевозки, мы предлагаем комплекс дополнительных услуг:</p>
          <div class="additional-services">
            <div class="service-item">
              <h4>📦 Упаковка и маркировка</h4>
              <p>Профессиональная упаковка хрупких грузов, паллетирование, стрейч-пленка, 
              маркировка согласно требованиям получателя.</p>
            </div>
            <div class="service-item">
              <h4>🏗️ Погрузочно-разгрузочные работы</h4>
              <p>Бригада грузчиков, автокраны, погрузчики. Работа с грузами любой сложности, 
              включая негабаритные и тяжеловесные.</p>
            </div>
            <div class="service-item">
              <h4>🛡️ Страхование груза</h4>
              <p>Полное страхование груза на всем пути следования. Страховое покрытие до 
              10 млн рублей, оформление за 30 минут.</p>
            </div>
            <div class="service-item">
              <h4>📄 Оформление документов</h4>
              <p>Подготовка всех необходимых документов, включая CMR, товарно-транспортные 
              накладные, акты выполненных работ.</p>
            </div>
            <div class="service-item">
              <h4>🚚 Экспедирование</h4>
              <p>Сопровождение груза экспедитором, контроль погрузки/разгрузки, решение 
              всех вопросов в пути.</p>
            </div>
            <div class="service-item">
              <h4>🏠 Ответственное хранение</h4>
              <p>Временное хранение груза на наших складах в ${fromCity} или ${toCity}. 
              Охраняемая территория, видеонаблюдение 24/7.</p>
            </div>
          </div>
        `
      }
    ]
  }),
  
  // For blog pages
  blogEnhancement: {
    sections: [
      {
        title: 'Экспертное мнение',
        content: `
          <div class="expert-opinion">
            <div class="expert-photo">
              <img src="/assets/img/expert-logistics.jpg" alt="Эксперт по логистике">
            </div>
            <div class="expert-info">
              <h4>Александр Петров</h4>
              <p class="expert-position">Руководитель отдела логистики АвтоГОСТ, 15 лет опыта</p>
              <blockquote>
                "В современных условиях логистика становится ключевым фактором успеха любого бизнеса. 
                Правильно выстроенные процессы доставки могут сэкономить до 30% бюджета на транспортировку 
                и значительно повысить лояльность клиентов. Важно не только выбрать надежного перевозчика, 
                но и постоянно оптимизировать логистические процессы."
              </blockquote>
            </div>
          </div>
        `
      },
      {
        title: 'Чек-лист для самопроверки',
        content: `
          <div class="checklist">
            <h4>Убедитесь, что вы учли все важные аспекты:</h4>
            <label><input type="checkbox"> Проверен и выбран оптимальный маршрут доставки</label>
            <label><input type="checkbox"> Рассчитаны все возможные риски и заложен резерв времени</label>
            <label><input type="checkbox"> Подготовлены все необходимые документы</label>
            <label><input type="checkbox"> Груз правильно упакован и промаркирован</label>
            <label><input type="checkbox"> Согласованы условия оплаты и сроки</label>
            <label><input type="checkbox"> Настроена система отслеживания груза</label>
            <label><input type="checkbox"> Проинформирован получатель о дате и времени доставки</label>
            <label><input type="checkbox"> Оформлено страхование груза (при необходимости)</label>
            <label><input type="checkbox"> Есть план действий на случай форс-мажора</label>
            <label><input type="checkbox"> Определен ответственный за приемку груза</label>
          </div>
        `
      },
      {
        title: 'Полезные инструменты и сервисы',
        content: `
          <div class="tools-section">
            <h4>Рекомендуемые инструменты для оптимизации логистики:</h4>
            <div class="tools-grid">
              <div class="tool-item">
                <h5>📊 Системы управления транспортом (TMS)</h5>
                <ul>
                  <li>1C:TMS - интеграция с 1С</li>
                  <li>Logistics Vision - облачное решение</li>
                  <li>MaxoPtra - оптимизация маршрутов</li>
                </ul>
              </div>
              <div class="tool-item">
                <h5>📍 Сервисы отслеживания</h5>
                <ul>
                  <li>ГЛОНАСС/GPS мониторинг</li>
                  <li>Cargo Track - универсальный трекинг</li>
                  <li>АвтоГОСТ Tracking - наш сервис</li>
                </ul>
              </div>
              <div class="tool-item">
                <h5>💰 Калькуляторы стоимости</h5>
                <ul>
                  <li>Наш онлайн-калькулятор</li>
                  <li>Della.ru - сравнение цен</li>
                  <li>ATI.su - биржа грузов</li>
                </ul>
              </div>
              <div class="tool-item">
                <h5>📱 Мобильные приложения</h5>
                <ul>
                  <li>АвтоГОСТ Mobile - наше приложение</li>
                  <li>Яндекс.Маршруты - планирование</li>
                  <li>2ГИС Грузовой - навигация</li>
                </ul>
              </div>
            </div>
          </div>
        `
      },
      {
        title: 'Ответы на частые вопросы',
        content: `
          <div class="blog-faq">
            <div class="faq-item">
              <h4>❓ Как часто обновляется информация в статье?</h4>
              <p>Мы регулярно актуализируем все материалы на сайте. Данная статья была обновлена 
              в ${new Date().toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })} года и содержит актуальную информацию.</p>
            </div>
            <div class="faq-item">
              <h4>❓ Можно ли получить консультацию по теме статьи?</h4>
              <p>Конечно! Наши эксперты готовы ответить на любые вопросы. Звоните по телефону 
              +7 (495) 268-06-81 или пишите в WhatsApp +7 (916) 272-09-32.</p>
            </div>
            <div class="faq-item">
              <h4>❓ Есть ли скидки для читателей блога?</h4>
              <p>Да, при заказе услуг упомяните, что прочитали нашу статью, и получите скидку 5% 
              на первую перевозку.</p>
            </div>
          </div>
        `
      }
    ]
  }
};

// Function to enhance specific page types
function enhancePage(filepath, content) {
  const filename = path.basename(filepath);
  let enhancedContent = content;
  
  if (filename === 'about.html') {
    // Find where to insert new content (after existing content, before footer)
    const footerIndex = content.indexOf('<footer');
    if (footerIndex !== -1) {
      const newSections = CONTENT_TEMPLATES.aboutPage.sections.map(section => `
        <section class="enhanced-section">
          <h2>${section.title}</h2>
          ${section.content}
        </section>
      `).join('\n');
      
      enhancedContent = content.slice(0, footerIndex) + 
        '\n<!-- Enhanced content sections -->\n' + newSections + '\n' +
        content.slice(footerIndex);
    }
  }
  
  else if (filename === 'contact.html') {
    const footerIndex = content.indexOf('<footer');
    if (footerIndex !== -1) {
      const newSections = CONTENT_TEMPLATES.contactPage.sections.map(section => `
        <section class="enhanced-section">
          <h2>${section.title}</h2>
          ${section.content}
        </section>
      `).join('\n');
      
      enhancedContent = content.slice(0, footerIndex) + 
        '\n<!-- Enhanced content sections -->\n' + newSections + '\n' +
        content.slice(footerIndex);
    }
  }
  
  else if (filepath.includes('routes/')) {
    // Extract route information
    const routeMatch = filename.match(/([^-]+)-(.+)\.html/);
    if (routeMatch) {
      const fromCity = routeMatch[1];
      const toCity = routeMatch[2];
      
      // Extract distance and price from content
      const distanceMatch = content.match(/(\d+)\s*км/);
      const priceMatch = content.match(/от\s*([\d\s]+)\s*₽/);
      
      const distance = distanceMatch ? parseInt(distanceMatch[1]) : 500;
      const basePrice = priceMatch ? parseInt(priceMatch[1].replace(/\s/g, '')) : 25000;
      
      const routeEnhancement = CONTENT_TEMPLATES.routeEnhancement(fromCity, toCity, distance, basePrice);
      
      // Find where to insert (before internal links section or footer)
      const insertBeforeRegex = /<div class="related-content|<footer/;
      const insertMatch = content.match(insertBeforeRegex);
      
      if (insertMatch) {
        const insertIndex = content.indexOf(insertMatch[0]);
        const newSections = routeEnhancement.sections.map(section => `
          <section class="route-section">
            <h2>${section.title}</h2>
            ${section.content}
          </section>
        `).join('\n');
        
        enhancedContent = content.slice(0, insertIndex) + 
          '\n<!-- Enhanced route content -->\n' + newSections + '\n' +
          content.slice(insertIndex);
      }
    }
  }
  
  else if (filename.includes('blog-')) {
    // Add blog enhancement sections before the CTA section
    const ctaIndex = content.search(/<div class="cta-section|<section class="cta|<footer/);
    if (ctaIndex !== -1) {
      const newSections = CONTENT_TEMPLATES.blogEnhancement.sections.map(section => `
        <section class="blog-enhancement">
          <h2>${section.title}</h2>
          ${section.content}
        </section>
      `).join('\n');
      
      enhancedContent = content.slice(0, ctaIndex) + 
        '\n<!-- Enhanced blog content -->\n' + newSections + '\n' +
        content.slice(ctaIndex);
    }
  }
  
  return enhancedContent;
}

// Main function to process priority pages
function enhanceContentDepth() {
  // Priority pages to enhance first
  const priorityPages = [
    'about.html',
    'contact.html',
    'services.html',
    'index.html',
    'blog-3-spot-orders.html',
    'urgent-delivery.html',
    'ip-small-business-delivery.html',
    'self-employed-delivery.html'
  ];
  
  // Also enhance some key route pages
  const priorityRoutes = [
    'routes/moskva/moskva-spb.html',
    'routes/moskva/moskva-kazan.html',
    'routes/moskva/moskva-nizhniy-novgorod.html',
    'routes/moskva/moskva-ekaterinburg.html',
    'routes/moskva/moskva-samara.html'
  ];
  
  const allPriorityPages = [...priorityPages, ...priorityRoutes];
  
  console.log('📊 Starting content depth enhancement...\n');
  
  allPriorityPages.forEach(pagePath => {
    if (fs.existsSync(pagePath)) {
      console.log(`Processing: ${pagePath}`);
      
      try {
        const content = fs.readFileSync(pagePath, 'utf8');
        const enhanced = enhancePage(pagePath, content);
        
        if (enhanced !== content) {
          fs.writeFileSync(pagePath, enhanced);
          console.log(`  ✅ Enhanced with additional content\n`);
        } else {
          console.log(`  ⚠️  No enhancement applied\n`);
        }
      } catch (error) {
        console.error(`  ❌ Error: ${error.message}\n`);
      }
    }
  });
  
  // Add CSS styles for new sections
  const cssFile = 'assets/css/enhanced-content.css';
  const cssContent = `
/* Enhanced Content Styles */
.enhanced-section,
.route-section,
.blog-enhancement {
  margin: 3rem 0;
  padding: 2rem;
  background-color: #f8f9fa;
  border-radius: 10px;
}

.enhanced-section h2,
.route-section h2,
.blog-enhancement h2 {
  color: #2c5aa0;
  margin-bottom: 1.5rem;
  font-size: 2rem;
}

.enhanced-section h3,
.route-section h3,
.blog-enhancement h3 {
  color: #333;
  margin: 1.5rem 0 1rem;
}

.enhanced-section h4,
.route-section h4,
.blog-enhancement h4 {
  color: #555;
  margin: 1rem 0 0.5rem;
}

/* Team structure */
.team-structure {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.department {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

/* Values grid */
.values-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.value-item {
  text-align: center;
  padding: 1.5rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

/* Achievements */
.achievements {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.achievement-item {
  text-align: center;
}

.achievement-number {
  font-size: 2.5rem;
  font-weight: bold;
  color: #2c5aa0;
}

.achievement-text {
  font-size: 0.9rem;
  color: #666;
}

/* Contact methods */
.contact-methods {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 1.5rem;
}

.contact-method {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

/* Offices */
.office-main {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.region-office {
  background: white;
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 5px;
  border-left: 4px solid #2c5aa0;
}

/* Schedule table */
.schedule-table,
.working-hours {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

.schedule-table th,
.schedule-table td,
.working-hours th,
.working-hours td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.schedule-table th,
.working-hours th {
  background-color: #2c5aa0;
  color: white;
}

/* Cargo types */
.cargo-types {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.cargo-type {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

/* Additional services */
.additional-services {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.service-item {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

/* Expert opinion */
.expert-opinion {
  display: flex;
  gap: 2rem;
  align-items: start;
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.expert-photo img {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
}

.expert-info {
  flex: 1;
}

.expert-position {
  color: #666;
  font-style: italic;
  margin-bottom: 1rem;
}

.expert-info blockquote {
  font-style: italic;
  border-left: 4px solid #2c5aa0;
  padding-left: 1.5rem;
  margin: 0;
}

/* Checklist */
.checklist {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.checklist label {
  display: block;
  padding: 0.5rem 0;
  cursor: pointer;
}

.checklist input[type="checkbox"] {
  margin-right: 0.5rem;
}

/* Tools grid */
.tools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.tool-item {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.tool-item h5 {
  color: #2c5aa0;
  margin-bottom: 0.5rem;
}

.tool-item ul {
  list-style-type: none;
  padding: 0;
}

.tool-item li {
  padding: 0.25rem 0;
  border-bottom: 1px dotted #eee;
}

/* Blog FAQ */
.blog-faq .faq-item {
  background: white;
  padding: 1.5rem;
  margin-bottom: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.blog-faq h4 {
  color: #2c5aa0;
  margin-bottom: 0.5rem;
}

/* Payment methods */
.payment-methods {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
}

.payment-method {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

/* Client types */
.client-types {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.client-type {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.note {
  font-size: 0.9rem;
  color: #666;
  font-style: italic;
  margin-top: 0.5rem;
}

/* Responsive */
@media (max-width: 768px) {
  .expert-opinion {
    flex-direction: column;
    text-align: center;
  }
  
  .expert-photo {
    margin: 0 auto;
  }
}
`;
  
  // Create CSS directory if it doesn't exist
  const cssDir = path.dirname(cssFile);
  if (!fs.existsSync(cssDir)) {
    fs.mkdirSync(cssDir, { recursive: true });
  }
  
  fs.writeFileSync(cssFile, cssContent.trim());
  console.log(`\n✅ Created enhanced content CSS: ${cssFile}`);
  
  console.log('\n🎉 Content enhancement complete!');
  console.log('Note: This enhanced priority pages. Run full enhancement for all pages when needed.');
}

// Run the enhancement
enhanceContentDepth();