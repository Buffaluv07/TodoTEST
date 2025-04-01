export function setAlarm(time, callback) {
    const alarmTime = new Date(time).getTime();
    const now = new Date().getTime();
    const timeToAlarm = alarmTime - now;

    if (timeToAlarm < 0) {
        console.error("Alarm time must be in the future.");
        return;
    }

    const alarmId = setTimeout(() => {
        callback();
        clearAlarm(alarmId);
    }, timeToAlarm);

    return alarmId;
}

export function clearAlarm(alarmId) {
    clearTimeout(alarmId);
}

export function triggerAlarm() {
    const audio = new Audio('../assets/audio/background-music.mp3');
    audio.play();
    alert("Alarm is ringing!");
}