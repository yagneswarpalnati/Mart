"use client";

interface NutritionRingMetric {
  label: string;
  value: number;
  target: number;
  unit: string;
  color: string;
}

function clampPercent(value: number, target: number) {
  if (target <= 0) return 0;
  return Math.max(0, Math.min(100, Math.round((value / target) * 100)));
}

function MetricRing({
  metric,
  compact,
}: {
  metric: NutritionRingMetric;
  compact?: boolean;
}) {
  const percent = clampPercent(metric.value, metric.target);

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div
        className="relative rounded-full shadow-[inset_0_0_0_1px_rgba(145,164,179,0.2)]"
        style={{
          width: compact ? 62 : 70,
          height: compact ? 62 : 70,
          background: `conic-gradient(${metric.color} ${percent * 3.6}deg, #dde7ef 0deg)`,
        }}
      >
        <div
          className="absolute rounded-full bg-white border border-[#e3eaf0]"
          style={{ inset: compact ? 7 : 8 }}
        />
        <div className="absolute inset-0 grid place-items-center text-[#1e1e1e] text-xs font-bold">
          {percent}%
        </div>
      </div>

      <p
        className={`text-center font-semibold text-gray-800 ${
          compact ? "text-[13px]" : "text-sm"
        }`}
      >
        {metric.label}
      </p>
      <p className={`text-[#6d7d8a] ${compact ? "text-[10px]" : "text-[11px]"}`}>
        {metric.value.toFixed(metric.unit === "mg" ? 0 : 1)}/
        {metric.target.toFixed(metric.unit === "mg" ? 0 : 1)}
        {metric.unit}
      </p>
    </div>
  );
}

export default function NutritionRingsCard({
  title,
  metrics,
  compact,
}: {
  title: string;
  metrics: NutritionRingMetric[];
  compact?: boolean;
}) {
  const topRow = metrics.slice(0, 3);
  const bottomRow = metrics.slice(3, 5);

  return (
    <div className="h-full rounded-2xl border border-[#dbe6ee] bg-[radial-gradient(circle_at_15%_0%,#ffffff_0%,#f3f8fc_45%,#edf5fb_100%)] p-4 overflow-hidden shadow-[0_12px_32px_rgba(38,76,96,0.08)]">
      <h3
        className={`text-center font-semibold text-gray-800 ${
          compact ? "text-[13px]" : "text-sm"
        }`}
      >
        {title}
      </h3>

      <div className="mt-3 h-[calc(100%-28px)] grid grid-rows-2 gap-3">
        <div className="grid grid-cols-3 gap-2 items-center">
          {topRow.map((metric) => (
            <MetricRing key={metric.label} metric={metric} compact={compact} />
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3 px-6 items-center">
          {bottomRow.map((metric) => (
            <MetricRing key={metric.label} metric={metric} compact={compact} />
          ))}
        </div>
      </div>
    </div>
  );
}
