const noteA5 = 880;
const noteD6 = 1174.66;

const phrase = [noteA5, noteD6];
const repeats = 3;
const repeatDelay = 0.7;
const noteDelay = 0.16;
const noteLength = 0.6;
const peakGain = 0.4;
const silence = 0.0001;

const strikes = Array.from({ length: repeats }, (_, repeat) =>
  phrase.map((frequency, note) => ({
    frequency,
    at: repeat * repeatDelay + note * noteDelay,
  })),
).flat();

let audio: AudioContext | undefined;
let voices: OscillatorNode[] = [];

function output() {
  audio ??= new AudioContext();
  void audio.resume();

  return audio;
}

export function cancelChime() {
  for (const voice of voices) {
    voice.onended = null;
    voice.stop();
  }

  voices = [];
}

export function scheduleChime(afterSeconds: number, onSounded?: () => void) {
  const destination = output();

  cancelChime();

  voices = strikes.map(({ frequency, at }) => {
    const oscillator = destination.createOscillator();
    const envelope = destination.createGain();
    const startAt = destination.currentTime + afterSeconds + at;

    oscillator.type = "triangle";
    oscillator.frequency.value = frequency;

    envelope.gain.setValueAtTime(silence, startAt);
    envelope.gain.linearRampToValueAtTime(peakGain, startAt + 0.01);
    envelope.gain.exponentialRampToValueAtTime(silence, startAt + noteLength);

    oscillator.connect(envelope).connect(destination.destination);
    oscillator.start(startAt);
    oscillator.stop(startAt + noteLength);

    return oscillator;
  });

  if (onSounded) voices[0].onended = onSounded;
}
