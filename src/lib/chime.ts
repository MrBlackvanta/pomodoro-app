const noteA5 = 880;
const noteD6 = 1174.66;

const phrase = [noteA5, noteD6];
const noteDelay = 0.18;
const noteLength = 0.9;
const peakGain = 0.18;
const silence = 0.0001;

let audio: AudioContext | undefined;
let voices: OscillatorNode[] = [];

function output() {
  audio ??= new AudioContext();
  void audio.resume();

  return audio;
}

export function cancelChime() {
  for (const voice of voices) voice.stop();
  voices = [];
}

export function scheduleChime(afterSeconds: number) {
  const destination = output();

  cancelChime();

  voices = phrase.map((frequency, index) => {
    const oscillator = destination.createOscillator();
    const envelope = destination.createGain();
    const startAt = destination.currentTime + afterSeconds + index * noteDelay;

    oscillator.type = "sine";
    oscillator.frequency.value = frequency;

    envelope.gain.setValueAtTime(silence, startAt);
    envelope.gain.linearRampToValueAtTime(peakGain, startAt + 0.02);
    envelope.gain.exponentialRampToValueAtTime(silence, startAt + noteLength);

    oscillator.connect(envelope).connect(destination.destination);
    oscillator.start(startAt);
    oscillator.stop(startAt + noteLength);

    return oscillator;
  });
}
