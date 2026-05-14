import { useState } from "react";

type TimeRange = "7d" | "30d" | "90d" | "custom";

export function useDashboardFilters() {
  const [timeRange, setTimeRange] = useState<TimeRange>("7d");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [showCustomRange, setShowCustomRange] = useState(false);

  const handleTimeRangeChange = (range: TimeRange) => {
    if (range !== "custom") {
      setShowCustomRange(false);
      setTimeRange(range);
    }
  };

  const handleCustomRangeToggle = () => {
    setShowCustomRange(!showCustomRange);
    setTimeRange("custom");
  };

  return {
    timeRange,
    customFrom,
    customTo,
    showCustomRange,
    setTimeRange,
    setCustomFrom,
    setCustomTo,
    handleTimeRangeChange,
    handleCustomRangeToggle,
  };
}