#!/bin/sh
# One-command rebuild of "Cómo nace un hospital" (Watercolor Brush, 50 s, 1920x1080, 24 fps, Spanish).
set -e
HERE=$(cd "$(dirname "$0")" && pwd)
LIB=${LIB:-/root/lemo-opuscar}
export LIB
[ -f "$LIB/core/render/video.mjs" ] || { echo "set LIB to the library folder"; exit 1; }
cd "$LIB"
"$LIB/.venv/bin/python" core/tts/tts.py "$HERE/tts/lines.json" "$HERE/tts/out"      # voice (Kokoro, offline)
node core/render/events.mjs "$HERE"                                                  # sound/cue events from the page
node core/render/video.mjs "$HERE" --fps 24 --out "$HERE/out/video.mp4"             # picture
"$LIB/.venv/bin/python" "$HERE/mix.py"                                               # score + foley + ambience + voice -> out/mix.wav
sh core/render/mux.sh "$HERE/out/video.mp4" "$HERE/out/mix.wav" "$HERE/hospital-acuarela.mp4" 24 1
"$LIB/.venv/bin/python" core/render/srt.py "$HERE/out/srt_cues.json" "$HERE/hospital-acuarela.srt"
