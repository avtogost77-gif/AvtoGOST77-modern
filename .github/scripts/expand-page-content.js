const fs = require('fs');
const path = require('path');

// Дополнительный контент для разных типов страниц
const contentExpansions = {
    contact: {
        afterTitle: `
        <section class="contact-intro section">
            <div class="container">
                <h2>Ваш надежный партнер в логистике</h2>
                <p>АвтоГОСТ - это не просто транспортная компания. Мы - ваш стратегический партнер в организации грузоперевозок по всей России. С 2010 года мы помогаем бизнесу оптимизировать логистические процессы, снижать затраты и обеспечивать своевременную доставку грузов.</p>
                
                <div class="why-contact-us">
                    <h3>Почему стоит связаться именно с нами?</h3>
                    <div class="benefits-grid">
                        <div class="benefit-card">
                            <div class="benefit-icon">🚀</div>
                            <h4>Скорость реагирования</h4>
                            <p>Отвечаем на заявки в течение 15 минут. Подача транспорта в Москве - от 2 часов. Мы понимаем, что в логистике время - это деньги, поэтому работаем максимально оперативно.</p>
                        </div>
                        <div class="benefit-card">
                            <div class="benefit-icon">🛡️</div>
                            <h4>Полная страховка груза</h4>
                            <p>Все грузы застрахованы на полную стоимость. Мы несем материальную ответственность за сохранность вашего имущества на всех этапах перевозки.</p>
                        </div>
                        <div class="benefit-card">
                            <div class="benefit-icon">📊</div>
                            <h4>Прозрачное ценообразование</h4>
                            <p>Никаких скрытых платежей и доплат. Вы получаете фиксированную цену до начала перевозки. Все условия прописываются в договоре.</p>
                        </div>
                        <div class="benefit-card">
                            <div class="benefit-icon">🤝</div>
                            <h4>Персональный менеджер</h4>
                            <p>За каждым клиентом закрепляется персональный менеджер, который знает особенности вашего бизнеса и может предложить оптимальные логистические решения.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="contact-process section bg-light">
            <div class="container">
                <h2>Как начать сотрудничество</h2>
                <div class="process-steps">
                    <div class="step">
                        <div class="step-number">1</div>
                        <h3>Оставьте заявку</h3>
                        <p>Позвоните по телефону +7 916 272-09-32, напишите в WhatsApp или заполните форму на сайте. Укажите маршрут, характеристики груза и желаемые сроки доставки.</p>
                    </div>
                    <div class="step">
                        <div class="step-number">2</div>
                        <h3>Получите расчет</h3>
                        <p>В течение 15 минут наш менеджер свяжется с вами, уточнит детали и предоставит точный расчет стоимости с учетом всех особенностей перевозки.</p>
                    </div>
                    <div class="step">
                        <div class="step-number">3</div>
                        <h3>Заключите договор</h3>
                        <p>После согласования условий мы подготовим договор с фиксированной ценой и гарантиями. Работаем как по разовым заявкам, так и по долгосрочным контрактам.</p>
                    </div>
                    <div class="step">
                        <div class="step-number">4</div>
                        <h3>Отслеживайте груз</h3>
                        <p>После отправки вы получите трек-номер для отслеживания. Менеджер будет информировать вас о статусе доставки на всех ключевых этапах.</p>
                    </div>
                </div>
            </div>
        </section>

        <section class="office-details section">
            <div class="container">
                <h2>Наш офис в Москве</h2>
                <div class="office-grid">
                    <div class="office-info">
                        <h3>Центральный офис</h3>
                        <p>Наш головной офис расположен в удобном месте с хорошей транспортной доступностью. Здесь работает команда опытных логистов, которые координируют перевозки по всей России.</p>
                        
                        <h4>Как добраться:</h4>
                        <ul class="transport-options">
                            <li><strong>На метро:</strong> станция "Бауманская", выход к Бауманской улице, далее 10 минут пешком</li>
                            <li><strong>На автомобиле:</strong> съезд с ТТК на улицу Радио, далее по навигатору. Есть парковка для клиентов</li>
                            <li><strong>На автобусе:</strong> остановка "Большая Почтовая улица", маршруты 78, 425</li>
                        </ul>
                        
                        <h4>Режим работы офиса:</h4>
                        <p><strong>Понедельник - Пятница:</strong> 9:00 - 19:00<br>
                        <strong>Суббота:</strong> 10:00 - 16:00<br>
                        <strong>Воскресенье:</strong> выходной<br>
                        <em>Диспетчерская служба работает круглосуточно 24/7</em></p>
                    </div>
                    
                    <div class="office-features">
                        <h3>Что вы найдете в нашем офисе</h3>
                        <ul class="features-list">
                            <li>✅ Комфортная переговорная для обсуждения крупных контрактов</li>
                            <li>✅ Демонстрационный зал с образцами упаковочных материалов</li>
                            <li>✅ Отдел по работе с документами для быстрого оформления</li>
                            <li>✅ Касса для оплаты наличными</li>
                            <li>✅ Кофе-зона для клиентов</li>
                            <li>✅ Парковка на 20 мест</li>
                        </ul>
                        
                        <div class="office-team">
                            <h4>Наша команда</h4>
                            <p>В московском офисе работает более 30 специалистов:</p>
                            <ul>
                                <li>10 опытных логистов</li>
                                <li>8 менеджеров по работе с клиентами</li>
                                <li>5 специалистов по документообороту</li>
                                <li>4 IT-специалиста</li>
                                <li>3 юриста</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>`,
        
        beforeFooter: `
        <section class="contact-advantages section bg-light">
            <div class="container">
                <h2>Преимущества работы с АвтоГОСТ</h2>
                <div class="advantages-detailed">
                    <div class="advantage-block">
                        <h3>🚛 Собственный автопарк и проверенные партнеры</h3>
                        <p>У нас есть собственные транспортные средства для самых востребованных направлений. Для остальных маршрутов мы работаем только с проверенными перевозчиками, которые прошли строгий отбор и имеют все необходимые лицензии и страховки.</p>
                        <ul>
                            <li>Более 50 собственных автомобилей</li>
                            <li>500+ проверенных партнеров-перевозчиков</li>
                            <li>Все виды транспорта: от каблуков до фур</li>
                            <li>Специализированный транспорт для особых грузов</li>
                        </ul>
                    </div>
                    
                    <div class="advantage-block">
                        <h3>📱 Современные технологии</h3>
                        <p>Мы инвестируем в технологии, чтобы сделать процесс заказа и отслеживания максимально удобным для клиентов:</p>
                        <ul>
                            <li>Онлайн-калькулятор с точным расчетом</li>
                            <li>GPS-трекинг всех грузов в реальном времени</li>
                            <li>Электронный документооборот</li>
                            <li>Мобильное приложение для постоянных клиентов</li>
                            <li>API для интеграции с вашими системами</li>
                        </ul>
                    </div>
                    
                    <div class="advantage-block">
                        <h3>💰 Гибкая система оплаты</h3>
                        <p>Мы предлагаем различные варианты оплаты, чтобы сотрудничество было максимально удобным:</p>
                        <ul>
                            <li>Наличная оплата в офисе или водителю</li>
                            <li>Безналичный расчет с НДС и без НДС</li>
                            <li>Отсрочка платежа для постоянных клиентов</li>
                            <li>Оплата картой через сайт</li>
                            <li>Работа с самозанятыми и ИП</li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>

        <section class="testimonials section">
            <div class="container">
                <h2>Отзывы наших клиентов</h2>
                <div class="testimonials-grid">
                    <div class="testimonial">
                        <div class="stars">⭐⭐⭐⭐⭐</div>
                        <p>"Работаем с АвтоГОСТ уже 3 года. За это время ни одного срыва поставки! Особенно радует оперативность менеджеров и прозрачность ценообразования."</p>
                        <div class="author">
                            <strong>Алексей Петров</strong>
                            <span>Директор по логистике, ООО "ТехноПром"</span>
                        </div>
                    </div>
                    <div class="testimonial">
                        <div class="stars">⭐⭐⭐⭐⭐</div>
                        <p>"Когда нужна срочная доставка - обращаюсь только в АвтоГОСТ. Подают машину за 2 часа, цены адекватные, водители вежливые."</p>
                        <div class="author">
                            <strong>Мария Иванова</strong>
                            <span>ИП, продавец на маркетплейсах</span>
                        </div>
                    </div>
                    <div class="testimonial">
                        <div class="stars">⭐⭐⭐⭐⭐</div>
                        <p>"Отличная компания! Помогли организовать сложную перевозку негабаритного оборудования. Все документы оформили быстро, доставили без повреждений."</p>
                        <div class="author">
                            <strong>Сергей Козлов</strong>
                            <span>Начальник отдела снабжения, завод "МеталлСтрой"</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>`
    },
    
    about: {
        afterTitle: `
        <section class="company-story section">
            <div class="container">
                <h2>История нашей компании</h2>
                <div class="timeline">
                    <div class="timeline-item">
                        <div class="year">2010</div>
                        <div class="content">
                            <h3>Начало пути</h3>
                            <p>АвтоГОСТ начал свою деятельность с небольшого автопарка из 5 машин. Основатели компании - опытные логисты, которые увидели потребность рынка в качественных и надежных грузоперевозках.</p>
                        </div>
                    </div>
                    <div class="timeline-item">
                        <div class="year">2013</div>
                        <div class="content">
                            <h3>Расширение географии</h3>
                            <p>Открыли представительства в 5 крупных городах России. Автопарк вырос до 20 единиц техники. Начали работать с крупными корпоративными клиентами.</p>
                        </div>
                    </div>
                    <div class="timeline-item">
                        <div class="year">2016</div>
                        <div class="content">
                            <h3>Технологический прорыв</h3>
                            <p>Запустили собственную CRM-систему и онлайн-калькулятор. Внедрили GPS-трекинг для всех грузов. Первыми на рынке предложили API для интеграции.</p>
                        </div>
                    </div>
                    <div class="timeline-item">
                        <div class="year">2019</div>
                        <div class="content">
                            <h3>Лидерство на рынке</h3>
                            <p>Вошли в ТОП-10 транспортных компаний Москвы. Автопарк - более 50 машин. География покрытия - вся Россия. Более 1000 постоянных клиентов.</p>
                        </div>
                    </div>
                    <div class="timeline-item">
                        <div class="year">2025</div>
                        <div class="content">
                            <h3>Новые горизонты</h3>
                            <p>Продолжаем развиваться: внедряем искусственный интеллект для оптимизации маршрутов, развиваем экспресс-доставку, работаем над экологичностью перевозок.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="mission-values section bg-light">
            <div class="container">
                <div class="mission-block">
                    <h2>Наша миссия</h2>
                    <p class="lead">Мы стремимся сделать грузоперевозки простыми, надежными и доступными для каждого бизнеса в России. Наша цель - стать связующим звеном между производителями и потребителями, обеспечивая бесперебойную цепочку поставок.</p>
                </div>
                
                <div class="values-block">
                    <h2>Наши ценности</h2>
                    <div class="values-grid">
                        <div class="value-card">
                            <div class="icon">🤝</div>
                            <h3>Надежность</h3>
                            <p>Мы всегда выполняем взятые на себя обязательства. Ваш груз будет доставлен в срок и в полной сохранности.</p>
                        </div>
                        <div class="value-card">
                            <div class="icon">💡</div>
                            <h3>Инновации</h3>
                            <p>Постоянно внедряем новые технологии и совершенствуем процессы, чтобы предоставлять лучший сервис.</p>
                        </div>
                        <div class="value-card">
                            <div class="icon">🌱</div>
                            <h3>Экологичность</h3>
                            <p>Оптимизируем маршруты, обновляем автопарк на более экологичный транспорт, заботимся об окружающей среде.</p>
                        </div>
                        <div class="value-card">
                            <div class="icon">👥</div>
                            <h3>Клиентоориентированность</h3>
                            <p>Каждый клиент важен для нас. Мы находим индивидуальный подход и оптимальное решение для любой задачи.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>`,
        
        beforeFooter: `
        <section class="team section">
            <div class="container">
                <h2>Наша команда</h2>
                <p class="section-desc">За успехом АвтоГОСТ стоят профессионалы своего дела - команда из более чем 200 человек, объединенных общей целью.</p>
                
                <div class="team-stats">
                    <div class="stat">
                        <div class="number">50+</div>
                        <div class="label">Профессиональных водителей</div>
                    </div>
                    <div class="stat">
                        <div class="number">30+</div>
                        <div class="label">Опытных логистов</div>
                    </div>
                    <div class="stat">
                        <div class="number">20+</div>
                        <div class="label">Менеджеров по работе с клиентами</div>
                    </div>
                    <div class="stat">
                        <div class="number">10+</div>
                        <div class="label">IT-специалистов</div>
                    </div>
                </div>
                
                <div class="team-benefits">
                    <h3>Почему сотрудники выбирают нас</h3>
                    <ul>
                        <li>Стабильная заработная плата и прозрачная система мотивации</li>
                        <li>Обучение и повышение квалификации за счет компании</li>
                        <li>Дружный коллектив и корпоративные мероприятия</li>
                        <li>Возможности карьерного роста</li>
                        <li>Современные условия труда</li>
                    </ul>
                </div>
            </div>
        </section>

        <section class="achievements section bg-light">
            <div class="container">
                <h2>Наши достижения</h2>
                <div class="achievements-grid">
                    <div class="achievement">
                        <div class="icon">🏆</div>
                        <h3>ТОП-10 транспортных компаний Москвы</h3>
                        <p>По версии рейтинга "Логистика и транспорт" 2024</p>
                    </div>
                    <div class="achievement">
                        <div class="icon">📜</div>
                        <h3>Сертификат ISO 9001:2015</h3>
                        <p>Международный стандарт качества управления</p>
                    </div>
                    <div class="achievement">
                        <div class="icon">🌟</div>
                        <h3>4.8 из 5 средний рейтинг</h3>
                        <p>На основе более 2000 отзывов клиентов</p>
                    </div>
                    <div class="achievement">
                        <div class="icon">🚚</div>
                        <h3>100 000+ успешных доставок</h3>
                        <p>За время работы компании</p>
                    </div>
                </div>
            </div>
        </section>

        <section class="social-responsibility section">
            <div class="container">
                <h2>Социальная ответственность</h2>
                <div class="responsibility-blocks">
                    <div class="block">
                        <h3>🌍 Забота об экологии</h3>
                        <p>Мы постепенно обновляем автопарк на транспорт с более высоким экологическим классом. Оптимизация маршрутов позволяет снизить выбросы CO2 на 20%.</p>
                    </div>
                    <div class="block">
                        <h3>🤲 Благотворительность</h3>
                        <p>Регулярно участвуем в благотворительных акциях, бесплатно перевозим гуманитарную помощь, поддерживаем социальные проекты.</p>
                    </div>
                    <div class="block">
                        <h3>👨‍🎓 Поддержка образования</h3>
                        <p>Сотрудничаем с профильными вузами, предоставляем места для стажировок студентам логистических специальностей.</p>
                    </div>
                </div>
            </div>
        </section>`
    },
    
    services: {
        afterHero: `
        <section class="services-overview section">
            <div class="container">
                <h2>Полный спектр логистических услуг</h2>
                <p class="lead">АвтоГОСТ предоставляет комплексные решения для грузоперевозок любой сложности. Мы работаем как с разовыми заказами частных лиц, так и обслуживаем крупные корпорации по долгосрочным контрактам.</p>
                
                <div class="service-categories">
                    <div class="category">
                        <h3>🚛 Типы перевозок</h3>
                        <ul>
                            <li><strong>Городские перевозки:</strong> доставка по Москве и области от 2 часов</li>
                            <li><strong>Междугородние перевозки:</strong> доставка между городами России</li>
                            <li><strong>Международные перевозки:</strong> доставка в страны СНГ и Европу</li>
                            <li><strong>Мультимодальные перевозки:</strong> комбинация различных видов транспорта</li>
                        </ul>
                    </div>
                    
                    <div class="category">
                        <h3>📦 Типы грузов</h3>
                        <ul>
                            <li><strong>Стандартные грузы:</strong> от документов до паллет</li>
                            <li><strong>Негабаритные грузы:</strong> спецтехника, оборудование</li>
                            <li><strong>Опасные грузы:</strong> ADR классы 1-9 с лицензией</li>
                            <li><strong>Температурные грузы:</strong> рефрижераторы от -20 до +25°C</li>
                            <li><strong>Хрупкие грузы:</strong> особая упаковка и крепление</li>
                        </ul>
                    </div>
                    
                    <div class="category">
                        <h3>🚐 Типы транспорта</h3>
                        <ul>
                            <li><strong>Каблук:</strong> до 1.5 тонн, 6 м³</li>
                            <li><strong>Газель:</strong> до 2 тонн, 16 м³</li>
                            <li><strong>3-тонник:</strong> до 3.5 тонн, 20 м³</li>
                            <li><strong>5-тонник:</strong> до 5 тонн, 36 м³</li>
                            <li><strong>10-тонник:</strong> до 10 тонн, 60 м³</li>
                            <li><strong>Фура:</strong> до 20 тонн, 90 м³</li>
                            <li><strong>Спецтранспорт:</strong> краны, тралы, рефрижераторы</li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>`,
        
        beforeCTA: `
        <section class="additional-services section bg-light">
            <div class="container">
                <h2>Дополнительные услуги</h2>
                <div class="add-services-grid">
                    <div class="add-service">
                        <div class="icon">📋</div>
                        <h3>Оформление документов</h3>
                        <p>Полное сопровождение документооборота: ТТН, УПД, акты, счета-фактуры. Электронный документооборот через ЭДО.</p>
                    </div>
                    <div class="add-service">
                        <div class="icon">📦</div>
                        <h3>Упаковка груза</h3>
                        <p>Профессиональная упаковка любых типов грузов. Стрейч-пленка, воздушно-пузырьковая пленка, деревянные короба, паллетирование.</p>
                    </div>
                    <div class="add-service">
                        <div class="icon">💪</div>
                        <h3>Погрузо-разгрузочные работы</h3>
                        <p>Опытные грузчики, такелажные работы, подъем на этаж. Работа с негабаритными и тяжелыми грузами.</p>
                    </div>
                    <div class="add-service">
                        <div class="icon">🏢</div>
                        <h3>Ответственное хранение</h3>
                        <p>Временное хранение грузов на наших складах. Теплый склад, охрана, видеонаблюдение, учет товара.</p>
                    </div>
                    <div class="add-service">
                        <div class="icon">🛡️</div>
                        <h3>Страхование груза</h3>
                        <p>Дополнительное страхование ценных грузов сверх базовой страховки. Покрытие до 10 млн рублей.</p>
                    </div>
                    <div class="add-service">
                        <div class="icon">🚨</div>
                        <h3>Экспедирование</h3>
                        <p>Сопровождение особо ценных грузов. Экспедитор едет с грузом, контролирует погрузку/разгрузку.</p>
                    </div>
                </div>
            </div>
        </section>

        <section class="industry-solutions section">
            <div class="container">
                <h2>Отраслевые решения</h2>
                <p class="section-desc">Мы разработали специализированные логистические решения для различных отраслей бизнеса</p>
                
                <div class="industries-detailed">
                    <div class="industry-card">
                        <h3>🛍️ Для интернет-магазинов</h3>
                        <ul>
                            <li>Доставка до клиента в день заказа</li>
                            <li>Интеграция с CMS и маркетплейсами</li>
                            <li>Прием оплаты от покупателей</li>
                            <li>Обработка возвратов</li>
                            <li>Фулфилмент услуги</li>
                        </ul>
                    </div>
                    
                    <div class="industry-card">
                        <h3>🏭 Для производства</h3>
                        <ul>
                            <li>Доставка сырья точно в срок (JIT)</li>
                            <li>Вывоз готовой продукции</li>
                            <li>Межцеховые перевозки</li>
                            <li>Перевозка оборудования</li>
                            <li>Контрактная логистика</li>
                        </ul>
                    </div>
                    
                    <div class="industry-card">
                        <h3>🏗️ Для строительства</h3>
                        <ul>
                            <li>Доставка стройматериалов на объекты</li>
                            <li>Перевозка спецтехники тралами</li>
                            <li>Вывоз строительного мусора</li>
                            <li>Доставка бетона и растворов</li>
                            <li>Снабжение строек по графику</li>
                        </ul>
                    </div>
                    
                    <div class="industry-card">
                        <h3>🏪 Для ритейла</h3>
                        <ul>
                            <li>Развозка по торговым точкам</li>
                            <li>Ночная доставка в магазины</li>
                            <li>Кросс-докинг</li>
                            <li>Централизованные поставки</li>
                            <li>Reverse logistics</li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>

        <section class="service-guarantees section bg-light">
            <div class="container">
                <h2>Наши гарантии</h2>
                <div class="guarantees-list">
                    <div class="guarantee">
                        <div class="icon">⏰</div>
                        <h3>Гарантия сроков</h3>
                        <p>Если мы опоздали по нашей вине - возвращаем 10% от стоимости перевозки. Все сроки фиксируются в договоре.</p>
                    </div>
                    <div class="guarantee">
                        <div class="icon">💰</div>
                        <h3>Гарантия цены</h3>
                        <p>Цена, озвученная при заказе, не изменится. Никаких скрытых платежей и доплат по прибытии.</p>
                    </div>
                    <div class="guarantee">
                        <div class="icon">📦</div>
                        <h3>Гарантия сохранности</h3>
                        <p>Полная материальная ответственность за груз. В случае повреждения - компенсация в течение 10 дней.</p>
                    </div>
                    <div class="guarantee">
                        <div class="icon">📞</div>
                        <h3>Гарантия связи</h3>
                        <p>Ваш персональный менеджер всегда на связи. Ответ на звонок в течение 3 гудков, на сообщение - в течение 15 минут.</p>
                    </div>
                </div>
            </div>
        </section>`
    },
    
    track: {
        afterForm: `
        <section class="tracking-info section">
            <div class="container">
                <h2>Как работает отслеживание груза</h2>
                <div class="tracking-features">
                    <div class="feature">
                        <div class="icon">📍</div>
                        <h3>GPS-мониторинг в реальном времени</h3>
                        <p>Все наши автомобили оборудованы GPS-трекерами. Вы можете видеть текущее местоположение груза с точностью до 10 метров, скорость движения и предполагаемое время прибытия.</p>
                    </div>
                    <div class="feature">
                        <div class="icon">📱</div>
                        <h3>SMS и Email уведомления</h3>
                        <p>Автоматические уведомления на ключевых этапах доставки: забор груза, выезд из города отправления, прибытие в город назначения, доставка получателю.</p>
                    </div>
                    <div class="feature">
                        <div class="icon">📸</div>
                        <h3>Фотофиксация</h3>
                        <p>По запросу предоставляем фотографии груза при погрузке и выгрузке. Это дополнительная гарантия сохранности и подтверждение доставки.</p>
                    </div>
                    <div class="feature">
                        <div class="icon">📊</div>
                        <h3>История перемещений</h3>
                        <p>Полная история маршрута с отметками времени. Вы можете посмотреть, где находился груз в любой момент времени.</p>
                    </div>
                </div>
            </div>
        </section>

        <section class="tracking-statuses section bg-light">
            <div class="container">
                <h2>Статусы доставки</h2>
                <p class="section-desc">Понимание статусов поможет вам лучше отслеживать процесс доставки</p>
                
                <div class="statuses-list">
                    <div class="status-item">
                        <div class="status-icon new">🆕</div>
                        <div class="status-info">
                            <h3>Заявка создана</h3>
                            <p>Ваш заказ принят в обработку. Менеджер подбирает оптимальный транспорт и маршрут.</p>
                        </div>
                    </div>
                    <div class="status-item">
                        <div class="status-icon confirmed">✅</div>
                        <div class="status-info">
                            <h3>Заявка подтверждена</h3>
                            <p>Транспорт назначен, водитель получил информацию о заказе. Ожидайте прибытия в указанное время.</p>
                        </div>
                    </div>
                    <div class="status-item">
                        <div class="status-icon loading">📦</div>
                        <div class="status-info">
                            <h3>Погрузка</h3>
                            <p>Водитель прибыл на адрес отправления. Производится погрузка и оформление документов.</p>
                        </div>
                    </div>
                    <div class="status-item">
                        <div class="status-icon transit">🚚</div>
                        <div class="status-info">
                            <h3>В пути</h3>
                            <p>Груз в дороге. Вы можете отслеживать движение в реальном времени через GPS.</p>
                        </div>
                    </div>
                    <div class="status-item">
                        <div class="status-icon arrived">📍</div>
                        <div class="status-info">
                            <h3>Прибыл в пункт назначения</h3>
                            <p>Транспорт прибыл по адресу доставки. Начинается процесс разгрузки.</p>
                        </div>
                    </div>
                    <div class="status-item">
                        <div class="status-icon delivered">✔️</div>
                        <div class="status-info">
                            <h3>Доставлено</h3>
                            <p>Груз успешно доставлен и передан получателю. Документы подписаны.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="tracking-benefits section">
            <div class="container">
                <h2>Преимущества нашей системы отслеживания</h2>
                <div class="benefits-comparison">
                    <div class="our-system">
                        <h3>✅ Наша система</h3>
                        <ul>
                            <li>Обновление локации каждые 5 минут</li>
                            <li>Точность позиционирования до 10 метров</li>
                            <li>Прогноз времени прибытия с учетом пробок</li>
                            <li>Push-уведомления в мобильном приложении</li>
                            <li>API для интеграции с вашими системами</li>
                            <li>История всех перевозок в личном кабинете</li>
                        </ul>
                    </div>
                    <div class="others">
                        <h3>❌ Другие компании</h3>
                        <ul>
                            <li>Обновление раз в час или реже</li>
                            <li>Приблизительное местоположение</li>
                            <li>Нет прогноза времени</li>
                            <li>Только SMS уведомления</li>
                            <li>Нет возможности интеграции</li>
                            <li>Данные хранятся ограниченное время</li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>

        <section class="tracking-faq section bg-light">
            <div class="container">
                <h2>Частые вопросы об отслеживании</h2>
                <div class="faq-grid">
                    <div class="faq-item">
                        <h3>Как получить трек-номер?</h3>
                        <p>Трек-номер автоматически отправляется на ваш телефон и email сразу после подтверждения заявки. Также его можно узнать у вашего персонального менеджера.</p>
                    </div>
                    <div class="faq-item">
                        <h3>Что делать, если трек-номер не работает?</h3>
                        <p>Убедитесь, что вводите номер без пробелов и лишних символов. Если проблема сохраняется, свяжитесь с менеджером по телефону +7 916 272-09-32.</p>
                    </div>
                    <div class="faq-item">
                        <h3>Можно ли отследить несколько грузов?</h3>
                        <p>Да, в личном кабинете вы можете отслеживать все ваши активные доставки на одной странице. Для корпоративных клиентов доступны расширенные возможности мониторинга.</p>
                    </div>
                    <div class="faq-item">
                        <h3>Как долго хранится история?</h3>
                        <p>История всех ваших перевозок хранится в системе не менее 3 лет. Вы можете скачать детальные отчеты для бухгалтерии или анализа.</p>
                    </div>
                </div>
            </div>
        </section>`
    }
};

// Функция для добавления стилей
function addStyles(html) {
    const styles = `
    <style>
    /* Дополнительные стили для расширенного контента */
    .section { padding: 60px 0; }
    .bg-light { background-color: #f8f9fa; }
    .lead { font-size: 1.2em; line-height: 1.6; color: #555; margin-bottom: 30px; }
    .section-desc { font-size: 1.1em; color: #666; text-align: center; margin-bottom: 40px; }
    
    /* Timeline */
    .timeline { position: relative; padding: 40px 0; }
    .timeline::before { content: ''; position: absolute; left: 50px; top: 0; bottom: 0; width: 2px; background: #2c5aa0; }
    .timeline-item { display: flex; margin-bottom: 40px; }
    .timeline-item .year { width: 100px; font-size: 24px; font-weight: bold; color: #2c5aa0; }
    .timeline-item .content { flex: 1; background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    
    /* Process steps */
    .process-steps { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 30px; }
    .step { text-align: center; padding: 30px; background: #fff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    .step-number { width: 60px; height: 60px; margin: 0 auto 20px; background: #2c5aa0; color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: bold; }
    
    /* Benefits grid */
    .benefits-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px; }
    .benefit-card { padding: 30px; background: #fff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    .benefit-icon { font-size: 48px; margin-bottom: 15px; }
    
    /* Values grid */
    .values-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 30px; }
    .value-card { text-align: center; padding: 30px; background: #fff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    .value-card .icon { font-size: 48px; margin-bottom: 15px; }
    
    /* Team stats */
    .team-stats { display: flex; justify-content: space-around; flex-wrap: wrap; margin: 40px 0; }
    .stat { text-align: center; padding: 20px; }
    .stat .number { font-size: 48px; font-weight: bold; color: #2c5aa0; }
    .stat .label { font-size: 16px; color: #666; }
    
    /* Testimonials */
    .testimonials-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 30px; }
    .testimonial { padding: 30px; background: #fff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    .testimonial .stars { color: #ffa500; font-size: 20px; margin-bottom: 15px; }
    .testimonial .author { margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee; }
    .testimonial .author strong { display: block; margin-bottom: 5px; }
    .testimonial .author span { color: #666; font-size: 14px; }
    
    /* Service categories */
    .service-categories { display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 30px; margin-top: 40px; }
    .category { padding: 30px; background: #fff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    .category h3 { margin-bottom: 20px; color: #2c5aa0; }
    .category ul { list-style: none; padding: 0; }
    .category li { padding: 10px 0; border-bottom: 1px solid #eee; }
    .category li:last-child { border-bottom: none; }
    
    /* Status items */
    .statuses-list { max-width: 800px; margin: 0 auto; }
    .status-item { display: flex; align-items: center; margin-bottom: 30px; padding: 20px; background: #fff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    .status-icon { width: 60px; height: 60px; margin-right: 20px; display: flex; align-items: center; justify-content: center; border-radius: 50%; font-size: 30px; }
    .status-icon.new { background: #e3f2fd; }
    .status-icon.confirmed { background: #e8f5e9; }
    .status-icon.loading { background: #fff3e0; }
    .status-icon.transit { background: #f3e5f5; }
    .status-icon.arrived { background: #fce4ec; }
    .status-icon.delivered { background: #e0f2f1; }
    
    /* Office grid */
    .office-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 40px; }
    .transport-options { list-style: none; padding: 0; }
    .transport-options li { padding: 10px 0; border-bottom: 1px solid #eee; }
    
    /* Responsive */
    @media (max-width: 768px) {
        .timeline::before { left: 20px; }
        .timeline-item .year { width: 60px; font-size: 18px; }
        .team-stats { flex-direction: column; }
        .stat { margin-bottom: 20px; }
    }
    </style>`;
    
    return html.replace('</head>', styles + '\n</head>');
}

// Функция для расширения контента страницы
function expandPageContent(filePath, pageType) {
    try {
        let html = fs.readFileSync(filePath, 'utf8');
        const expansion = contentExpansions[pageType];
        
        if (!expansion) {
            console.log(`⚠️  Нет расширения для типа: ${pageType}`);
            return false;
        }
        
        // Добавляем контент после заголовка/hero секции
        if (expansion.afterTitle) {
            const titleMatch = html.match(/(<h1[^>]*>.*?<\/h1>.*?)(<section|<div class="container">)/s);
            if (titleMatch) {
                html = html.replace(titleMatch[0], titleMatch[1] + expansion.afterTitle + titleMatch[2]);
            }
        }
        
        if (expansion.afterHero) {
            const heroMatch = html.match(/(<section class="[^"]*hero[^"]*".*?<\/section>)(.*?)(<section|<div class="container">)/s);
            if (heroMatch) {
                html = html.replace(heroMatch[0], heroMatch[1] + expansion.afterHero + heroMatch[3]);
            }
        }
        
        if (expansion.afterForm) {
            const formMatch = html.match(/(<form.*?<\/form>.*?)(<\/section>)/s);
            if (formMatch) {
                html = html.replace(formMatch[0], formMatch[1] + formMatch[2] + expansion.afterForm);
            }
        }
        
        // Добавляем контент перед footer
        if (expansion.beforeFooter) {
            html = html.replace('<footer', expansion.beforeFooter + '\n<footer');
        }
        
        // Добавляем контент перед CTA секцией
        if (expansion.beforeCTA) {
            const ctaMatch = html.match(/(<section class="[^"]*cta[^"]*")/);
            if (ctaMatch) {
                html = html.replace(ctaMatch[0], expansion.beforeCTA + '\n' + ctaMatch[0]);
            }
        }
        
        // Добавляем стили
        html = addStyles(html);
        
        fs.writeFileSync(filePath, html);
        console.log(`✅ Расширен контент: ${filePath}`);
        return true;
    } catch (error) {
        console.error(`❌ Ошибка при расширении ${filePath}:`, error.message);
        return false;
    }
}

// Основная функция
function main() {
    console.log('🚀 Начинаем расширение контента страниц...\n');
    
    const pagesToExpand = [
        { file: 'contact.html', type: 'contact' },
        { file: 'about.html', type: 'about' },
        { file: 'services.html', type: 'services' },
        { file: 'track.html', type: 'track' }
    ];
    
    let success = 0;
    let total = 0;
    
    pagesToExpand.forEach(page => {
        if (fs.existsSync(page.file)) {
            total++;
            if (expandPageContent(page.file, page.type)) {
                success++;
            }
        } else {
            console.log(`⚠️  Файл не найден: ${page.file}`);
        }
    });
    
    console.log(`\n📊 Итоги:`);
    console.log(`✅ Успешно расширено: ${success} страниц`);
    console.log(`📄 Всего обработано: ${total} страниц`);
}

main();