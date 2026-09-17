let asked = false;

function supported() {
  return typeof Notification !== "undefined";
}

export function askToNotify() {
  if (asked || !supported() || Notification.permission !== "default") return;

  asked = true;
  void Notification.requestPermission();
}

export function notifyDone(title: string, body: string) {
  if (!supported() || Notification.permission !== "granted") return;

  try {
    new Notification(title, { body, tag: "pomodoro-session" });
  } catch {}
}
