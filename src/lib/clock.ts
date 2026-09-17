export function clockFace(seconds: number) {
  const minutes = Math.floor(seconds / 60);

  return [minutes, seconds % 60]
    .map((part) => String(part).padStart(2, "0"))
    .join(":");
}
