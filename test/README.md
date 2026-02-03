# Testing the Ear Training Functionality

This guide outlines the best approaches to test the ear training functionality of the Banjo Sandwich website.

## Quick Start

1. **Run the test script:**

   ```bash
   cd /workspaces/banjo-sandwich-website
   ./test/run-tests.sh
   ```

2. **Start local server:**

   ```bash
   python3 -m http.server 8000
   ```

3. **Open in browser:**
   - Main application: http://localhost:8000/ear-training/pentatonic.html
   - Test suite: http://localhost:8000/test/ear-training-browser-tests.html

## Testing Approaches

### 1. 🧪 Automated Unit Tests

Run core logic tests without browser dependencies:

```bash
node test/ear-training.test.js
```

**Tests include:**

- Note transposition (capo functionality)
- Pentatonic scale generation
- State management (localStorage)

### 2. 🌐 Browser Integration Tests

Open `test/ear-training-browser-tests.html` in your browser to run:

- Audio system tests
- Instrument switching
- UI interaction tests
- State persistence tests

### 3. 📱 Manual Testing Checklist

Essential functionality to verify manually:

#### Core Features

- [ ] **Play test note** - Audio plays when clicking "Play Note"
- [ ] **Note selection** - Clicking note buttons provides visual feedback
- [ ] **Correct answers** - Green highlighting for correct guesses
- [ ] **Incorrect answers** - Red highlighting for wrong guesses
- [ ] **Progress tracking** - Guess counts and overall stats update
- [ ] **Session completion** - All 12 tests can be completed

#### Advanced Features

- [ ] **Reference note toggle** - Changes playback behavior
- [ ] **Capo position** - Different fret positions transpose notes correctly
- [ ] **Instrument switching** - Synth vs banjo audio samples work
- [ ] **State persistence** - Settings and progress saved on refresh
- [ ] **Fresh session** - Reset button clears all progress
- [ ] **URL parameters** - Deep linking with instrument/capo settings

#### Audio Quality

- [ ] **Volume levels** - Appropriate volume for both instruments
- [ ] **Note clarity** - Notes are distinguishable and clear
- [ ] **Timing** - Reference notes play before test notes (when enabled)
- [ ] **No audio artifacts** - Clean playback without glitches

## Test Files

| File                                   | Purpose                       |
| -------------------------------------- | ----------------------------- |
| `test/ear-training.test.js`            | Unit tests for core functions |
| `test/ear-training-browser-tests.html` | Browser-based test suite      |
| `test/run-tests.sh`                    | Automated test runner script  |

## Common Issues to Test

1. **Audio Context** - Modern browsers require user interaction before audio
2. **Sample Loading** - Banjo samples may take time to load
3. **State Corruption** - Test with corrupted localStorage data
4. **Edge Cases** - Very high capo positions, rapid clicking
5. **Mobile Compatibility** - Touch interactions, smaller screens

## Performance Testing

Monitor for:

- Memory leaks during extended sessions
- Audio latency on note playback
- UI responsiveness with many completed tests
- localStorage size with long-term usage

## Accessibility Testing

Verify:

- Keyboard navigation works
- Screen reader compatibility
- Color contrast for visual feedback
- Alternative text for UI elements

## Browser Compatibility

Test on:

- Chrome/Edge (Chromium-based)
- Firefox
- Safari (if available)
- Mobile browsers (iOS Safari, Android Chrome)

## Debugging Tools

- Browser DevTools Console for errors
- Network tab for sample loading issues
- Application tab for localStorage inspection
- Performance tab for audio timing analysis

## Contributing Test Cases

When adding new features:

1. Add unit tests to `ear-training.test.js`
2. Update browser test suite if needed
3. Extend manual testing checklist
4. Update this documentation
