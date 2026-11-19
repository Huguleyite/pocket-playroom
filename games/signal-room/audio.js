"use strict";

// Small synthesized console sounds: no downloads or music required.
const signalAudio = (() => {
  const key = "signal-room.effects";
  let enabled = true;
  let context, output;
  try { enabled = localStorage.getItem(key) !== "off"; } catch { /* Optional storage. */ }
  const button = document.getElementById("effects");
  function refresh() {
    button.textContent = `Effects: ${enabled ? "on" : "off"}`;
    button.setAttribute("aria-pressed", String(enabled));
  }
  function ready() {
    if (!enabled) return false;
    try {
      if (!context) {
        const Audio = window.AudioContext || window.webkitAudioContext;
        if (!Audio) return false;
        context = new Audio();
        output = context.createGain();
        output.gain.value = 0.65;
        output.connect(context.destination);
      }
      if (context.state === "suspended") context.resume().catch(() => {});
      return context.state !== "closed";
    } catch { return false; }
  }
  function tone(frequency, endFrequency, duration, volume, offset = 0, type = "sine") {
    const start = context.currentTime + offset;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, start);
    oscillator.frequency.exponentialRampToValueAtTime(endFrequency, start + duration);
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(volume, start + 0.004);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    oscillator.connect(gain);
    gain.connect(output);
    oscillator.start(start);
    oscillator.stop(start + duration + 0.01);
    oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
  }
  function play(kind, value = true) {
    if (document.hidden || !ready()) return;
    if (kind === "tap") tone(value ? 1500 : 1050, value ? 750 : 520, 0.055, 0.10, 0, "triangle");
    if (kind === "slide") tone(480, 720, 0.085, 0.09, 0, "triangle");
    if (kind === "send") {
      tone(1600, 550, 0.045, 0.10, 0, "triangle");
      tone(340, 1050, 0.30, 0.14, 0.035);
    }
    if (kind === "hop") tone(850, 670, 0.045, 0.045);
    if (kind === "success") {
      tone(523.25, 523.25, 0.32, 0.13);
      tone(783.99, 783.99, 0.42, 0.11, 0.14);
    }
    if (kind === "stop") tone(290, 175, 0.22, 0.10);
  }
  button.addEventListener("click", () => {
    enabled = !enabled;
    if (output) {
      output.gain.cancelScheduledValues(context.currentTime);
      output.gain.setTargetAtTime(enabled ? 0.65 : 0, context.currentTime, 0.008);
    }
    try { localStorage.setItem(key, enabled ? "on" : "off"); } catch { /* Optional storage. */ }
    refresh();
    if (enabled) play("tap");
  });
  refresh();
  return { play, ready };
})();


// Browsers require a player gesture before music can begin.
(() => {
  const key = "signal-room.music";
  const button = document.getElementById("music");
  const music = new Audio("assets/sustained-pad.mp3");
  music.loop = true;
  music.volume = 0.28;
  music.preload = "metadata";
  let enabled = true;
  let interacted = false;
  try { enabled = localStorage.getItem(key) !== "off"; } catch { /* Optional storage. */ }
  function refresh() {
    button.textContent = `Music: ${enabled ? "on" : "off"}`;
    button.setAttribute("aria-pressed", String(enabled));
  }
  function start() {
    if (enabled && interacted && !document.hidden) music.play().catch(() => {});
  }
  function unlock(event) {
    if (event.type === "keydown" && !["Enter", " ", "ArrowLeft", "ArrowRight", "Tab"].includes(event.key)) return;
    interacted = true;
    if (!event.target.closest?.("#music")) start();
  }
  document.addEventListener("pointerdown", unlock);
  document.addEventListener("keydown", unlock);
  button.addEventListener("click", () => {
    interacted = true;
    enabled = !enabled;
    try { localStorage.setItem(key, enabled ? "on" : "off"); } catch { /* Optional storage. */ }
    refresh();
    if (enabled) start(); else music.pause();
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) music.pause(); else start();
  });
  window.addEventListener("pagehide", () => music.pause());
  window.addEventListener("pageshow", start);
  refresh();
})();
