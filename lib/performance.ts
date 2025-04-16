// 性能监控工具

export interface PerformanceMetric {
  name: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  metadata?: Record<string, any>;
}

// Web Vitals 指标
interface WebVitalsMetric {
  name: 'FCP' | 'LCP' | 'CLS' | 'FID' | 'TTFB';
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
}

// 存储性能指标
const metrics: PerformanceMetric[] = [];
const webVitalsMetrics: WebVitalsMetric[] = [];

// 性能指标阈值
const THRESHOLDS = {
  FCP: { good: 1800, poor: 3000 },
  LCP: { good: 2500, poor: 4000 },
  FID: { good: 100, poor: 300 },
  CLS: { good: 0.1, poor: 0.25 },
  TTFB: { good: 800, poor: 1800 }
};

/**
 * 开始测量性能指标
 */
export function startMeasure(name: string, metadata?: Record<string, any>): string {
  const id = `${name}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  metrics.push({
    name,
    startTime: Date.now(),
    metadata
  });
  return id;
}

/**
 * 结束测量性能指标
 */
export function endMeasure(id: string): void {
  const metric = metrics.find(m => m.name === id.split('-')[0]);
  if (metric) {
    metric.endTime = Date.now();
    metric.duration = metric.endTime - metric.startTime;
    logMetric(metric.name, metric.duration, metric.metadata);
  }
}

/**
 * 记录单个性能指标
 */
export function logMetric(name: string, duration: number, metadata?: Record<string, any>): void {
  const metric = {
    name,
    startTime: Date.now() - duration,
    endTime: Date.now(),
    duration,
    metadata
  };
  metrics.push(metric);
  
  // 如果持续时间超过阈值，记录性能警告
  if (duration > THRESHOLDS[name]?.poor || duration > 3000) {
    console.warn(`[Performance Warning] ${name} took ${duration}ms to complete`, metadata);
  }
}

/**
 * 记录 Web Vitals 指标
 */
export function reportWebVitals(metric: WebVitalsMetric): void {
  const value = Math.round(metric.value);
  let rating: 'good' | 'needs-improvement' | 'poor' = 'good';
  
  if (value >= THRESHOLDS[metric.name].poor) {
    rating = 'poor';
  } else if (value >= THRESHOLDS[metric.name].good) {
    rating = 'needs-improvement';
  }
  
  webVitalsMetrics.push({
    name: metric.name,
    value,
    rating
  });
  
  // 发送到分析服务
  console.log(`[Web Vitals] ${metric.name}:`, {
    value,
    rating
  });
}

/**
 * 获取所有记录的性能指标
 */
export function getMetrics(): PerformanceMetric[] {
  return [...metrics];
}

/**
 * 清除所有记录的性能指标
 */
export function clearMetrics(): void {
  metrics.length = 0;
}

/**
 * 测量异步函数执行时间的包装器
 */
export async function measureAsync<T>(
  name: string, 
  fn: () => Promise<T>, 
  metadata?: Record<string, any>
): Promise<T> {
  const start = Date.now();
  try {
    const result = await fn();
    const duration = Date.now() - start;
    logMetric(name, duration, metadata);
    return result;
  } catch (error) {
    const duration = Date.now() - start;
    logMetric(`${name}-error`, duration, { ...metadata, error: String(error) });
    throw error;
  }
}

/**
 * 测量同步函数执行时间的包装器
 */
export function measure<T>(
  name: string, 
  fn: () => T, 
  metadata?: Record<string, any>
): T {
  const start = Date.now();
  try {
    const result = fn();
    const duration = Date.now() - start;
    logMetric(name, duration, metadata);
    return result;
  } catch (error) {
    const duration = Date.now() - start;
    logMetric(`${name}-error`, duration, { ...metadata, error: String(error) });
    throw error;
  }
}

/**
 * 获取性能报告
 */
export function getPerformanceReport(): {
  metrics: PerformanceMetric[];
  webVitals: WebVitalsMetric[];
} {
  return {
    metrics: metrics.slice(),
    webVitals: webVitalsMetrics.slice()
  };
} 