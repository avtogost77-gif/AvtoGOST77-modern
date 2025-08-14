// ========================================================
// 🎯 ОПТИМИЗАТОР SCHEMA.ORG - АВТОГОСТ V2.0
// Удаляет дублирующиеся рейтинги и оптимизирует разметку
// ========================================================

class SchemaOptimizer {
  constructor() {
    this.config = {
      ratingValue: "4.8",
      reviewCount: "1250",
      priceRange: "₽₽",
      companyName: "АвтоГОСТ"
    };
    this.init();
  }

  init() {
    this.optimizeSchema();
    this.removeDuplicateRatings();
    this.consolidateOrganizationData();
  }

  // Оптимизация Schema.org разметки
  optimizeSchema() {
    const scripts = document.querySelectorAll('script[type="application/ld+json"]');
    
    scripts.forEach(script => {
      try {
        const data = JSON.parse(script.textContent);
        
        // Оптимизация Organization
        if (data["@type"] === "Organization") {
          this.optimizeOrganization(data);
        }
        
        // Оптимизация Service
        if (data["@type"] === "Service") {
          this.optimizeService(data);
        }
        
        // Оптимизация WebSite
        if (data["@type"] === "WebSite") {
          this.optimizeWebSite(data);
        }
        
        script.textContent = JSON.stringify(data, null, 2);
      } catch (e) {
        console.warn('Schema optimization error:', e);
      }
    });
  }

  // Оптимизация Organization
  optimizeOrganization(org) {
    // Удаляем дублирующиеся рейтинги
    if (org.aggregateRating) {
      org.aggregateRating = {
        "@type": "AggregateRating",
        "ratingValue": this.config.ratingValue,
        "reviewCount": this.config.reviewCount
      };
    }
    
    // Стандартизируем название
    if (org.name) {
      org.name = this.config.companyName;
    }
    
    // Добавляем недостающие поля
    if (!org.priceRange) {
      org.priceRange = this.config.priceRange;
    }
  }

  // Оптимизация Service
  optimizeService(service) {
    // Удаляем дублирующиеся рейтинги
    if (service.aggregateRating) {
      service.aggregateRating = {
        "@type": "AggregateRating",
        "ratingValue": this.config.ratingValue,
        "reviewCount": this.config.reviewCount
      };
    }
    
    // Стандартизируем провайдера
    if (service.provider && service.provider["@type"] === "Organization") {
      this.optimizeOrganization(service.provider);
    }
  }

  // Оптимизация WebSite
  optimizeWebSite(website) {
    // Удаляем дублирующиеся рейтинги
    if (website.aggregateRating) {
      website.aggregateRating = {
        "@type": "AggregateRating",
        "ratingValue": this.config.ratingValue,
        "reviewCount": this.config.reviewCount
      };
    }
  }

  // Удаление дублирующихся рейтингов
  removeDuplicateRatings() {
    const ratings = document.querySelectorAll('[itemtype*="AggregateRating"]');
    let processedRatings = new Set();
    
    ratings.forEach(rating => {
      const ratingValue = rating.querySelector('[itemprop="ratingValue"]');
      const reviewCount = rating.querySelector('[itemprop="reviewCount"]');
      
      if (ratingValue && reviewCount) {
        const key = `${ratingValue.textContent}-${reviewCount.textContent}`;
        
        if (processedRatings.has(key)) {
          rating.remove();
        } else {
          processedRatings.add(key);
        }
      }
    });
  }

  // Консолидация данных организации
  consolidateOrganizationData() {
    const organizations = document.querySelectorAll('[itemtype*="Organization"]');
    
    organizations.forEach(org => {
      const name = org.querySelector('[itemprop="name"]');
      if (name && name.textContent !== this.config.companyName) {
        name.textContent = this.config.companyName;
      }
    });
  }

  // Получение статистики оптимизации
  getOptimizationStats() {
    const scripts = document.querySelectorAll('script[type="application/ld+json"]');
    const ratings = document.querySelectorAll('[itemtype*="AggregateRating"]');
    
    return {
      schemaScripts: scripts.length,
      ratings: ratings.length,
      optimizationDate: new Date().toISOString()
    };
  }
}

// Инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', () => {
  window.schemaOptimizer = new SchemaOptimizer();
  
  // Логирование статистики
  console.log('Schema optimization completed:', window.schemaOptimizer.getOptimizationStats());
});
