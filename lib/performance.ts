// 性能监控工具

export interface PerformanceMetric {
  name: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  metadata?: Record<string, any>;
}

// 存储性能指标
const metrics: PerformanceMetric[] = [];

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
export function endMeasure(id: string): PerformanceMetric | undefined {
  const index = metrics.findIndex(metric => `${metric.name}-${metric.startTime}` === id);
  if (index !== -1) {
    const endTime = Date.now();
    metrics[index].endTime = endTime;
    metrics[index].duration = endTime - metrics[index].startTime;
    return metrics[index];
  }
  return undefined;
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
  
  // 如果持续时间超过1秒，记录性能警告
  if (duration > 1000) {
    console.warn(`[Performance Warning] ${name} took ${duration}ms to complete`, metadata);
  }
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