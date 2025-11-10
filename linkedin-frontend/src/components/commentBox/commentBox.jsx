import React, { useState } from "react";

const EMOJI_SET = ["🙂", "😍", "🔥", "👏", "🎉", "👍", "💡", "😄"];

export default function CommentBox({ onSubmit, submitting }) {
  const [showPicker, setShowPicker] = useState(false);
  const [value, setValue] = useState("");

  function addEmoji(e) {
    setValue((v) => v + e);
    setShowPicker(false);
  }

  function submit() {
    const text = value.trim();
    if (!text || submitting) return;
    onSubmit?.(text);
    setValue("");
  }

  return (
    <div className="w-full">
      <div className="flex items-center gap-2">
        <input
          className="flex-1 border-1 rounded-lg px-3 py-2 text-sm"
          placeholder="Add a comment..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <button
          className="px-2 py-1 rounded hover:bg-gray-100"
          onClick={() => setShowPicker((s) => !s)}
          title="Add emoji"
          type="button"
        >
          😊
        </button>
        <button
          type="button"
          onClick={submit}
          className="px-3 py-1 bg-blue-700 text-white rounded-lg disabled:opacity-50"
          disabled={submitting}
        >
          {submitting ? "Posting..." : "Comment"}
        </button>
      </div>
      {showPicker && (
        <div className="mt-2 p-2 bg-white border-1 rounded-md shadow-sm flex flex-wrap gap-2">
          {EMOJI_SET.map((e) => (
            <button
              key={e}
              className="text-xl hover:bg-gray-100 rounded px-2"
              onClick={() => addEmoji(e)}
            >
              {e}
            </button>
          ))}
        </div>
      )}

    </div>
  );
}

