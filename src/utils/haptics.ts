export function hapticLight() {
  if ('vibrate' in navigator) navigator.vibrate(10);
}

export function hapticMedium() {
  if ('vibrate' in navigator) navigator.vibrate(30);
}

export function hapticSuccess() {
  if ('vibrate' in navigator) navigator.vibrate([10, 20, 10]);
}
