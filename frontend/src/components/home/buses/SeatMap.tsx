import React from "react";
import { motion } from "framer-motion";

interface SeatMapProps {
  rows: number;
  cols: number;
  blockedSeats: string[];
  selected: string[];
  onChange: (seats: string[]) => void;
  pricePerSeat: number;
}

const SeatMap: React.FC<SeatMapProps> = ({
  rows,
  cols,
  blockedSeats,
  selected,
  onChange,
  pricePerSeat
}) => {
  function toggleSeat(seatId: string) {
    if (blockedSeats.includes(seatId)) return;
    if (selected.includes(seatId)) {
      onChange(selected.filter((s) => s !== seatId));
    } else {
      onChange([...selected, seatId]);
    }
  }

  const seats: JSX.Element[] = [];
  for (let r = 1; r <= rows; r++) {
    for (let c = 0; c < cols; c++) {
      const seatId = `${r}${String.fromCharCode(65 + c)}`;
      const isBlocked = blockedSeats.includes(seatId);
      const isSelected = selected.includes(seatId);

      seats.push(
        <motion.button
          key={seatId}
          type="button"
          onClick={() => toggleSeat(seatId)}
          className={[
            "w-9 h-9 rounded-md text-xs font-medium flex items-center justify-center border transition-colors",
            isBlocked && "bg-gray-300 dark:bg-gray-600 cursor-not-allowed opacity-60",
            !isBlocked && !isSelected && "bg-white dark:bg-gray-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200",
            isSelected && "bg-emerald-500 dark:bg-emerald-600 text-white border-emerald-600 dark:border-emerald-700"
          ]
            .filter(Boolean)
            .join(" ")}
          aria-disabled={isBlocked}
          aria-pressed={isSelected}
          whileTap={{ scale: isBlocked ? 1 : 0.9 }}
        >
          {seatId}
        </motion.button>
      );
    }
  }

  return (
    <div>
      <div className="flex justify-between mb-2 text-sm text-gray-700 dark:text-gray-300">
        <span className="font-semibold">Seat map</span>
        <span className="text-slate-500 dark:text-slate-400">₹{pricePerSeat} / seat (base)</span>
      </div>
      <div
        className="grid gap-2"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      >
        {seats}
      </div>
      <div className="mt-3 flex gap-4 text-xs text-slate-500 dark:text-slate-400">
        <span className="flex items-center gap-1">
          <span className="w-4 h-4 rounded border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 inline-block" /> Available
        </span>
        <span className="flex items-center gap-1">
          <span className="w-4 h-4 rounded border bg-emerald-500 dark:bg-emerald-600 inline-block" /> Selected
        </span>
        <span className="flex items-center gap-1">
          <span className="w-4 h-4 rounded border bg-gray-300 dark:bg-gray-600 inline-block" /> Blocked
        </span>
      </div>
    </div>
  );
};

export default SeatMap;