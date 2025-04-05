import { getMetrics, clearMetrics } from "@/lib/performance";
import { NextResponse } from "next/server";

// API路由查看性能指标
export async function GET() {
  const metrics = getMetrics();
  
  // 提取关键的性能数据
  const summary = {
    totalMetrics: metrics.length,
    slowestOperations: metrics
      .filter(m => m.duration !== undefined)
      .sort((a, b) => (b.duration || 0) - (a.duration || 0))
      .slice(0, 10)
      .map(m => ({
        name: m.name,
        duration: m.duration,
        metadata: m.metadata
      })),
    operationsByType: Object.fromEntries(
      Array.from(
        metrics.reduce((acc, metric) => {
          const type = metric.name.split('-')[0];
          if (!acc.has(type)) {
            acc.set(type, {
              count: 0,
              totalDuration: 0,
              avgDuration: 0,
              maxDuration: 0
            });
          }
          
          const typeStats = acc.get(type)!;
          typeStats.count++;
          if (metric.duration) {
            typeStats.totalDuration += metric.duration;
            typeStats.avgDuration = typeStats.totalDuration / typeStats.count;
            typeStats.maxDuration = Math.max(typeStats.maxDuration, metric.duration);
          }
          
          return acc;
        }, new Map())
      ).map(([k, v]) => [k, v])
    )
  };

  return NextResponse.json({ summary, details: metrics });
}

// API路由清除性能指标
export async function DELETE() {
  clearMetrics();
  return NextResponse.json({ success: true });
} 