// Optimized template loader with lazy loading and caching
class TemplateLoader {
  constructor() {
    this.cache = new Map();
    this.loadTimes = new Map();
  }

  async loadTemplate(templateType, templateName) {
    const cacheKey = `${templateType}:${templateName}`;
    
    // Return cached template if available
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    const startTime = performance.now();
    let template;

    try {
      // Lazy load templates based on type
      switch (templateType) {
        case 'booking':
          const bookingModule = await import('./appointment/booking.js');
          template = bookingModule[templateName];
          break;
        
        case 'reminder':
          const reminderModule = await import('./appointment/reminders.js');
          template = reminderModule[templateName];
          break;
        
        case 'welcome':
          const welcomeModule = await import('./general/welcome.js');
          template = welcomeModule[templateName];
          break;
        
        case 'donation':
          const donationModule = await import('./general/donation.js');
          template = donationModule[templateName];
          break;
        
        default:
          // Fallback to legacy templates
          const legacyModule = await import('../../emailTemplates.js');
          template = legacyModule[templateName];
      }

      if (!template) {
        throw new Error(`Template ${templateName} not found in ${templateType}`);
      }

      // Cache the template
      this.cache.set(cacheKey, template);
      
      // Record load time for monitoring
      const loadTime = performance.now() - startTime;
      this.loadTimes.set(cacheKey, loadTime);
      
      console.log(`✅ Template ${cacheKey} loaded in ${loadTime.toFixed(2)}ms`);
      
      return template;
    } catch (error) {
      console.error(`❌ Failed to load template ${cacheKey}:`, error.message);
      throw error;
    }
  }

  // Get template loading statistics
  getStats() {
    return {
      cachedTemplates: this.cache.size,
      loadTimes: Object.fromEntries(this.loadTimes),
      averageLoadTime: this.getAverageLoadTime(),
      memoryUsage: this.getMemoryUsage()
    };
  }

  getAverageLoadTime() {
    if (this.loadTimes.size === 0) return 0;
    const total = Array.from(this.loadTimes.values()).reduce((sum, time) => sum + time, 0);
    return (total / this.loadTimes.size).toFixed(2);
  }

  getMemoryUsage() {
    let totalSize = 0;
    for (const template of this.cache.values()) {
      totalSize += JSON.stringify(template).length;
    }
    return `${(totalSize / 1024).toFixed(2)} KB`;
  }

  // Clear cache if needed (for memory management)
  clearCache() {
    const cacheSize = this.cache.size;
    this.cache.clear();
    this.loadTimes.clear();
    console.log(`🧹 Template cache cleared (${cacheSize} templates removed)`);
  }

  // Preload commonly used templates
  async preloadCommonTemplates() {
    const commonTemplates = [
      ['booking', 'bookingConfirmationParentTemplate'],
      ['booking', 'bookingConfirmationDoctorTemplate'],
      ['reminder', 'reminderParentTemplate'],
      ['reminder', 'reminderDoctorTemplate']
    ];

    const startTime = performance.now();
    const loadPromises = commonTemplates.map(([type, name]) => 
      this.loadTemplate(type, name).catch(err => console.warn(`Failed to preload ${type}:${name}`, err))
    );

    await Promise.all(loadPromises);
    const totalTime = performance.now() - startTime;
    console.log(`🚀 Preloaded ${commonTemplates.length} common templates in ${totalTime.toFixed(2)}ms`);
  }
}

// Singleton instance
export const templateLoader = new TemplateLoader();

// Helper function for backward compatibility
export async function getTemplate(templateType, templateName) {
  return await templateLoader.loadTemplate(templateType, templateName);
}