// Performance Monitoring Utility - Database optimization validation
// Bu utility database optimization'ın etkisini ölçmek için kullanılır

interface PerformanceMetric {
  operation: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  success: boolean;
  error?: string;
}

class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: PerformanceMetric[] = [];
  private isEnabled: boolean = true;

  private constructor() {}

  public static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  // Performance tracking başlat
  public startTracking(operation: string): string {
    if (!this.isEnabled) return '';
    
    const trackingId = `${operation}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const metric: PerformanceMetric = {
      operation,
      startTime: performance.now(),
      success: false
    };
    
    this.metrics.push(metric);
    return trackingId;
  }

  // Performance tracking sonlandır
  public endTracking(operation: string, success: boolean = true, error?: string): number {
    if (!this.isEnabled) return 0;
    
    const metric = this.metrics
      .reverse()
      .find(m => m.operation === operation && !m.endTime);
    
    if (metric) {
      metric.endTime = performance.now();
      metric.duration = metric.endTime - metric.startTime;
      metric.success = success;
      metric.error = error;
      
      // Console'da raporla
      if (success) {
        console.log(`✅ ${operation}: ${metric.duration.toFixed(2)}ms`);
      } else {
        console.error(`❌ ${operation}: ${metric.duration.toFixed(2)}ms - ${error}`);
      }
      
      return metric.duration;
    }
    
    return 0;
  }

  // Async operation wrapper - otomatik tracking
  public async trackAsync<T>(
    operation: string, 
    asyncFn: () => Promise<T>
  ): Promise<T> {
    if (!this.isEnabled) return asyncFn();
    
    this.startTracking(operation);
    
    try {
      const result = await asyncFn();
      this.endTracking(operation, true);
      return result;
    } catch (error) {
      this.endTracking(operation, false, error instanceof Error ? error.message : 'Unknown error');
      throw error;
    }
  }

  // Performance raporu
  public getReport(): {
    totalOperations: number;
    successRate: number;
    averageDuration: number;
    slowestOperations: Array<{operation: string; duration: number}>;
    operationStats: Record<string, {count: number; avgDuration: number; successRate: number}>;
  } {
    const completedMetrics = this.metrics.filter(m => m.duration !== undefined);
    
    if (completedMetrics.length === 0) {
      return {
        totalOperations: 0,
        successRate: 100,
        averageDuration: 0,
        slowestOperations: [],
        operationStats: {}
      };
    }
    
    const totalOperations = completedMetrics.length;
    const successfulOperations = completedMetrics.filter(m => m.success).length;
    const successRate = (successfulOperations / totalOperations) * 100;
    const averageDuration = completedMetrics.reduce((sum, m) => sum + (m.duration || 0), 0) / totalOperations;
    
    // En yavaş 5 operasyon
    const slowestOperations = completedMetrics
      .sort((a, b) => (b.duration || 0) - (a.duration || 0))
      .slice(0, 5)
      .map(m => ({ operation: m.operation, duration: m.duration || 0 }));
    
    // Operasyon bazlı istatistikler
    const operationStats: Record<string, {count: number; avgDuration: number; successRate: number}> = {};
    
    completedMetrics.forEach(metric => {
      const op = metric.operation;
      if (!operationStats[op]) {
        operationStats[op] = { count: 0, avgDuration: 0, successRate: 0 };
      }
      operationStats[op].count++;
    });
    
    Object.keys(operationStats).forEach(op => {
      const opMetrics = completedMetrics.filter(m => m.operation === op);
      const opSuccessful = opMetrics.filter(m => m.success).length;
      
      operationStats[op].avgDuration = opMetrics.reduce((sum, m) => sum + (m.duration || 0), 0) / opMetrics.length;
      operationStats[op].successRate = (opSuccessful / opMetrics.length) * 100;
    });
    
    return {
      totalOperations,
      successRate,
      averageDuration,
      slowestOperations,
      operationStats
    };
  }

  // Performance raporu yazdır
  public printReport(): void {
    const report = this.getReport();
    
    console.group('📊 Performance Report');
    console.log(`Total Operations: ${report.totalOperations}`);
    console.log(`Success Rate: ${report.successRate.toFixed(2)}%`);
    console.log(`Average Duration: ${report.averageDuration.toFixed(2)}ms`);
    
    if (report.slowestOperations.length > 0) {
      console.group('🐌 Slowest Operations');
      report.slowestOperations.forEach(op => {
        console.log(`${op.operation}: ${op.duration.toFixed(2)}ms`);
      });
      console.groupEnd();
    }
    
    if (Object.keys(report.operationStats).length > 0) {
      console.group('📈 Operation Statistics');
      Object.entries(report.operationStats).forEach(([op, stats]) => {
        console.log(`${op}: ${stats.count} calls, avg ${stats.avgDuration.toFixed(2)}ms, ${stats.successRate.toFixed(1)}% success`);
      });
      console.groupEnd();
    }
    
    console.groupEnd();
  }

  // Metrics temizle
  public clearMetrics(): void {
    this.metrics = [];
  }

  // Enable/disable monitoring
  public setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
  }
}

// Singleton instance export
export const performanceMonitor = PerformanceMonitor.getInstance();

// Utility fonksiyonlar
export const trackDatabaseQuery = (queryName: string) => ({
  start: () => performanceMonitor.startTracking(`DB: ${queryName}`),
  end: (success: boolean = true, error?: string) => 
    performanceMonitor.endTracking(`DB: ${queryName}`, success, error)
});

export const trackAsyncOperation = <T>(
  operationName: string, 
  asyncFn: () => Promise<T>
): Promise<T> => {
  return performanceMonitor.trackAsync(operationName, asyncFn);
};

// Development mode'da otomatik rapor (her 10 saniyede bir)
if (import.meta.env.DEV) {
  setInterval(() => {
    const report = performanceMonitor.getReport();
    if (report.totalOperations > 0) {
      performanceMonitor.printReport();
      performanceMonitor.clearMetrics(); // Her rapor sonrası temizle
    }
  }, 10000); // 10 saniye
}

// Database optimization validation helper
export const validateOptimization = () => {
  const report = performanceMonitor.getReport();
  const dbOperations = Object.entries(report.operationStats)
    .filter(([op]) => op.startsWith('DB:'));
  
  console.group('🎯 Database Optimization Validation');
  
  dbOperations.forEach(([operation, stats]) => {
    const avgMs = stats.avgDuration;
    let status = '✅ OPTIMIZED';
    let color = 'green';
    
    if (avgMs > 500) {
      status = '🐌 NEEDS OPTIMIZATION';
      color = 'red';
    } else if (avgMs > 200) {
      status = '⚠️ COULD BE BETTER';
      color = 'orange';
    }
    
    console.log(`%c${operation}: ${avgMs.toFixed(2)}ms - ${status}`, `color: ${color}`);
  });
  
  const avgDbTime = dbOperations.length > 0 ? 
    dbOperations.reduce((sum, [, stats]) => sum + stats.avgDuration, 0) / dbOperations.length : 0;
  
  console.log(`\n📊 Overall DB Performance: ${avgDbTime.toFixed(2)}ms average`);
  
  if (avgDbTime < 100) {
    console.log('🚀 Excellent! Database is highly optimized.');
  } else if (avgDbTime < 300) {
    console.log('👍 Good performance, consider further optimization.');
  } else {
    console.log('⚠️ Database queries are slow, optimization needed.');
  }
  
  console.groupEnd();
}; 