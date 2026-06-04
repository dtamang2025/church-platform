/**
 * Renders structured lyrics JSON with chords positioned above words.
 * Data format: [{ line: "Amazing grace", chords: [{ chord: "G", position: 0 }, { chord: "C", position: 8 }] }]
 */
export default function LyricsDisplay({ lyrics = [], compact = false }) {
  if (!lyrics || lyrics.length === 0) {
    return <p className="text-stone-400 text-sm italic">No lyrics available</p>
  }

  const charPx = compact ? 7.4 : 8.8

  return (
    <div className="lyric-block select-text">
      {lyrics.map((line, li) => {
        const text   = line.line || ''
        const chords = [...(line.chords || [])].sort((a, b) => a.position - b.position)

        return (
          <div key={li} className="mb-4 last:mb-0">
            {/* Chord row */}
            <div className="relative h-5">
              {chords.map((c, ci) => (
                <span
                  key={ci}
                  className="chord-above absolute"
                  style={{ left: c.position * charPx }}
                >
                  {c.chord}
                </span>
              ))}
            </div>
            {/* Lyric text */}
            <div className={`lyric-word ${compact ? 'text-sm' : 'text-base'}`}>{text}</div>
          </div>
        )
      })}
    </div>
  )
}
