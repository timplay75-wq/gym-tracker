export function playBeep(freq = 880, dur = 200) {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    osc.connect(ctx.destination);
    osc.frequency.value = freq;
    osc.start();
    osc.stop(ctx.currentTime + dur / 1000);
  } catch {
    // AudioContext not supported
  }
}
