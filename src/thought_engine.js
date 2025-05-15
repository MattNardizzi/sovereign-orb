// /src/thought_engine.js

export class ThoughtEngine {
  constructor(options = {}) {
    this.file = options.file || 'last_spoken_thought.json';
    this.updateInterval = options.interval || 2000;
    this.targetElement = document.getElementById(options.targetId || 'thought');
    this.emotionCallback = options.onEmotion || (() => {});
    this.lastThought = '';
    this.timer = null;
  }

  start() {
    this._fetchAndUpdate(); // Run immediately
    this.timer = setInterval(() => this._fetchAndUpdate(), this.updateInterval);
  }

  stop() {
    clearInterval(this.timer);
  }

  async _fetchAndUpdate() {
    try {
      const response = await fetch(`${this.file}?_t=${Date.now()}`);
      const data = await response.json();

      const newThought = data.thought || '...';
      const emotion = data.emotion || 'neutral';

      if (newThought !== this.lastThought) {
        this.lastThought = newThought;
        this._typeThought(newThought);
      }

      this.emotionCallback(emotion);
    } catch (err) {
      console.warn('[ThoughtEngine] Failed to fetch cognition stream:', err);
    }
  }

  _typeThought(text) {
    this.targetElement.textContent = '';
    let i = 0;
    const interval = setInterval(() => {
      this.targetElement.textContent += text[i++];
      if (i >= text.length) clearInterval(interval);
    }, 24 + Math.random() * 16);
  }
}
