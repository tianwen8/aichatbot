import { NextResponse } from "next/server";
import { getMetrics, clearMetrics } from "@/lib/performance";

// 生成性能报告
export async function GET() {
  try {
    const metrics = getMetrics();
    
    // 按组件分组
    const byComponent: Record<string, any[]> = {};
    metrics.forEach(metric => {
      const component = metric.metadata?.component || 'unknown';
      if (!byComponent[component]) {
        byComponent[component] = [];
      }
      byComponent[component].push(metric);
    });
    
    // 分析每个组件的性能
    const componentAnalysis = Object.entries(byComponent).map(([component, metrics]) => {
      // 计算每个组件的平均、最大、最小时间
      const durations = metrics.map(m => m.duration);
      const avgDuration = durations.reduce((sum, d) => sum + d, 0) / durations.length;
      const maxDuration = Math.max(...durations);
      const minDuration = Math.min(...durations);
      
      // 查找最慢的操作
      const slowestOp = metrics.reduce((prev, curr) => 
        prev.duration > curr.duration ? prev : curr, metrics[0]);
        
      return {
        component,
        metrics: {
          count: metrics.length,
          avgDuration: avgDuration.toFixed(2),
          maxDuration: maxDuration.toFixed(2),
          minDuration: minDuration.toFixed(2),
          slowestOperation: {
            name: slowestOp.name,
            duration: slowestOp.duration.toFixed(2),
            metadata: slowestOp.metadata
          }
        },
        operations: metrics.map(m => ({
          name: m.name,
          duration: m.duration.toFixed(2),
          timestamp: m.startTime,
          metadata: m.metadata
        }))
      };
    });
    
    // 计算整体的性能统计
    const allDurations = metrics.map(m => m.duration);
    const totalTime = allDurations.reduce((sum, d) => sum + d, 0);
    const avgTime = totalTime / allDurations.length;
    
    // 查找最慢的5个操作
    const slowestOps = [...metrics]
      .sort((a, b) => b.duration - a.duration)
      .slice(0, 5)
      .map(m => ({
        name: m.name,
        duration: m.duration.toFixed(2),
        component: m.metadata?.component || 'unknown',
        metadata: m.metadata
      }));
      
    // 按操作类型分组统计
    const byOperationType: Record<string, {count: number, totalTime: number, avgTime: number}> = {};
    metrics.forEach(metric => {
      // 从名称中提取操作类型（如FetchProject, UpdateClicks等）
      const opMatch = metric.name.match(/-([^-]+)-/);
      const opType = opMatch ? opMatch[1] : 'other';
      
      if (!byOperationType[opType]) {
        byOperationType[opType] = { count: 0, totalTime: 0, avgTime: 0 };
      }
      
      byOperationType[opType].count++;
      byOperationType[opType].totalTime += metric.duration;
    });
    
    // 计算平均时间
    Object.keys(byOperationType).forEach(key => {
      byOperationType[key].avgTime = byOperationType[key].totalTime / byOperationType[key].count;
    });
    
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      summary: {
        totalMetrics: metrics.length,
        totalTimeRecorded: totalTime.toFixed(2),
        averageOperationTime: avgTime.toFixed(2),
        slowestOperations: slowestOps
      },
      byOperationType: Object.entries(byOperationType).map(([type, stats]) => ({
        type,
        count: stats.count,
        totalTime: stats.totalTime.toFixed(2),
        avgTime: stats.avgTime.toFixed(2)
      })),
      componentAnalysis
    });
  } catch (error) {
    console.error("Error generating performance report:", error);
    return NextResponse.json(
      { error: "Failed to generate performance report" },
      { status: 500 }
    );
  }
}

// 清除所有性能指标
export async function DELETE() {
  clearMetrics();
  return NextResponse.json({ success: true, message: "Performance metrics cleared" });
} 