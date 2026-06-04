import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import LyricsDisplay from './LyricsDisplay'

/**
 * Editable chord/lyric builder.
 * Chord input format per line: "G@0,C@8,D@14"  (chord@charPosition)
 */
export default function ChordEditor({ value = [], onChange }) {
  const addLine    = () => onChange([...value, { line: '', chords: [] }])
  const removeLine = (i) => onChange(value.filter((_, idx) => idx !== i))

  const updateLine = (i, text) =>
    onChange(value.map((l, idx) => idx === i ? { ...l, line: text } : l))

  const updateChords = (i, raw) => {
    const parsed = raw
      .split(',')
      .map(s => s.trim())
      .filter(Boolean)
      .map(part => {
        const [chord, pos] = part.split('@')
        return { chord: chord?.trim(), position: parseInt(pos) || 0 }
      })
      .filter(c => c.chord)
    onChange(value.map((l, idx) => idx === i ? { ...l, chords: parsed } : l))
  }

  return (
    <div className="space-y-3">
      <div className="border border-stone-200 rounded-xl overflow-hidden divide-y divide-stone-100">
        {value.length === 0 && (
          <div className="px-4 py-3 text-sm text-stone-400 italic">No lines yet — click Add Line below.</div>
        )}
        {value.map((line, i) => (
          <div key={i} className="flex items-center gap-2 px-3 py-2.5 bg-white">
            <span className="text-xs text-stone-400 w-5 flex-shrink-0 text-right">{i + 1}</span>

            <input
              className="flex-1 text-sm font-mono border border-stone-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-purple-400"
              placeholder="Lyric line…"
              value={line.line}
              onChange={e => updateLine(i, e.target.value)}
            />

            <input
              className="w-32 text-xs font-mono border border-stone-200 rounded-lg px-2 py-1.5 text-purple-600 font-semibold focus:outline-none focus:border-purple-400"
              placeholder="G@0,C@8"
              title="Chord@position pairs separated by commas, e.g. G@0,C@8"
              defaultValue={(line.chords || []).map(c => `${c.chord}@${c.position}`).join(',')}
              onBlur={e => updateChords(i, e.target.value)}
            />

            <button
              onClick={() => removeLine(i)}
              className="text-stone-300 hover:text-red-400 transition-colors p-1 flex-shrink-0"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addLine}
        className="flex items-center gap-1.5 text-sm text-purple-600 hover:text-purple-800 font-medium transition-colors"
      >
        <Plus size={15} /> Add Line
      </button>

      {value.length > 0 && (
        <div>
          <div className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-2">Live Preview</div>
          <LyricsDisplay lyrics={value} compact />
        </div>
      )}
    </div>
  )
}
