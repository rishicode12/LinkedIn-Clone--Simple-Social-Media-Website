import React from "react";

const EMOJIS = [
  { key: "like", emoji: "👍", label: "Like" },
  { key: "love", emoji: "❤️", label: "Love" },
  { key: "clap", emoji: "👏", label: "Applaud" },
  { key: "celebrate", emoji: "🎉", label: "Celebrate" },
  { key: "idea", emoji: "💡", label: "Insightful" },
];

export default function ReactionBar({ selected, count = 0, onChange, disabled }) {
  function handleSelect(key) {
    if (disabled) return;
    const next = selected === key ? null : key;
    onChange?.(next);
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex gap-1">
        {EMOJIS.map((r) => (
          <button
            key={r.key}
            onClick={() => handleSelect(r.key)}
            title={r.label}
            disabled={disabled}
            className={`px-2 py-1 rounded-md hover:bg-gray-100 text-xl transition ${
              selected === r.key ? "ring-1 ring-blue-600 bg-blue-50" : ""
            }`}
          >
            {r.emoji}
          </button>
        ))}
      </div>
      <div className="text-sm text-gray-600">{count} reactions</div>
    </div>
  );
}

