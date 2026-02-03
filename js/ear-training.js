// Initialize both instruments
let banjoSampler = new Tone.Sampler({
  urls: {
    D3: "D3.mp3",
    E3: "E3.mp3",
    G3: "G3.mp3",
    A3: "A3.mp3",
    B3: "B3.mp3",
    C4: "C4.mp3",
    D4: "D4.mp3",
    E4: "E4.mp3",
  },
  baseUrl: "/banjo/",
}).toDestination();

let synthInstrument = new Tone.Synth({
  oscillator: {
    type: "triangle",
  },
  envelope: {
    attack: 0.02,
    decay: 0.3,
    sustain: 0.3,
    release: 0.8,
  },
}).toDestination();

// Current instrument selection
let currentInstrument = "synth"; // 'banjo' or 'synth'

// Current capo position
let currentCapoPosition = 0;

// Reference note settings
let useReferenceNote = true;
let baseReferenceNote = "G3"; // Root of G major pentatonic
let currentReferenceNote = "G3";

// Instructions display state
let showInstructions = true;

// Update reference note based on capo position
function updateReferenceNoteForCapo() {
  currentReferenceNote = transposeNoteForCapo(
    baseReferenceNote,
    currentCapoPosition,
  );
}

// Initialize instrument from URL parameter
function initializeFromURL() {
  const urlParams = new URLSearchParams(window.location.search);

  const instrumentParam = urlParams.get("instrument");
  if (instrumentParam === "synth" || instrumentParam === "banjo") {
    currentInstrument = instrumentParam;
    updateInstrumentSelector();
  }

  const capoParam = urlParams.get("capo");
  if (capoParam && !isNaN(parseInt(capoParam))) {
    currentCapoPosition = parseInt(capoParam);
    updateCapoSelector();
  }

  // Handle instructions parameter (overrides saved state)
  const instructionsParam = urlParams.get("instructions");
  if (instructionsParam !== null) {
    // If instructions parameter is present, it overrides saved state
    showInstructions = instructionsParam !== "false";
    updateInstructionsToggle();
  }
}

// Update URL parameter when instrument changes
function updateURLParameter(param, value) {
  const url = new URL(window.location);
  url.searchParams.set(param, value);
  window.history.replaceState(null, "", url);
}

// Update the instrument selector UI
function updateInstrumentSelector() {
  const selector = document.getElementById("instrument-selector");
  if (selector) {
    selector.value = currentInstrument;
  }
}

// Update the capo selector UI
function updateCapoSelector() {
  const selector = document.getElementById("capo-selector");
  if (selector) {
    selector.value = currentCapoPosition;
  }
}

// Update the instructions toggle UI
function updateInstructionsToggle() {
  const toggle = document.getElementById("show-instructions-toggle");
  if (toggle) {
    toggle.checked = showInstructions;
    // Trigger the toggle function to update the display
    if (typeof toggleDescription === "function") {
      toggleDescription(showInstructions);
    }
  }
}

// Switch between instruments
function setInstrument(instrument) {
  currentInstrument = instrument;
  updateURLParameter("instrument", instrument);
  saveStateToStorage(); // Save state when instrument changes

  // Track instrument change
  if (typeof gtag !== "undefined") {
    gtag("event", "instrument_change", {
      event_category: "ear_training",
      event_label: instrument,
      custom_parameter_1: "instrument_selection",
    });
  }
}

// Set capo position
function setCapoPosition(capoFrets) {
  currentCapoPosition = capoFrets;
  updateURLParameter("capo", capoFrets);

  // Update pentatonic collection based on capo
  updatePentatonicCollectionForCapo();

  // Update reference note for new capo position
  updateReferenceNoteForCapo();

  // Regenerate tests with new transposed notes
  generateTwelveTests();

  // Save state after capo change
  saveStateToStorage();

  // Update fretboard display if function is available (from HTML page)
  if (typeof updateFretboardDisplay === "function") {
    updateFretboardDisplay();
  }

  // Track capo change
  if (typeof gtag !== "undefined") {
    gtag("event", "capo_change", {
      event_category: "ear_training",
      event_label: `capo_fret_${capoFrets}`,
      value: capoFrets,
      custom_parameter_1: "capo_position",
    });
  }
}

// Define notes from D3 to C6
const fullRangeNoteCollection = [
  "D3",
  "D#3",
  "E3",
  "F3",
  "F#3",
  "G3",
  "G#3",
  "A3",
  "A#3",
  "B3",
  "C4",
  "C#4",
  "D4",
  "D#4",
  "E4",
  "F4",
  "F#4",
  "G4",
  "G#4",
  "A4",
  "A#4",
  "B4",
  "C5",
  "C#5",
  "D5",
  "D#5",
  "E5",
  "F5",
  "F#5",
  "G5",
  "G#5",
  "A5",
  "A#5",
  "B5",
  "C6",
];

// Basic pentatonic box notes (G major pentatonic - common for banjo)
const basePentatonicBoxNoteCollection = [
  "D3",
  "E3",
  "G3",
  "A3",
  "B3",
  "C4",
  "D4",
  "E4",
];

// Current pentatonic collection (updated based on capo)
let pentatonicBoxNoteCollection = [...basePentatonicBoxNoteCollection];

// Function to transpose a note based on capo position
function transposeNoteForCapo(note, capoFrets) {
  if (capoFrets === 0) return note;

  // Extract note name and octave
  const noteRegex = /([A-G][#b]?)([0-9]+)/;
  const match = note.match(noteRegex);
  if (!match) return note;

  const noteName = match[1];
  const octave = parseInt(match[2]);

  // Chromatic scale
  const chromaticScale = [
    "C",
    "C#",
    "D",
    "D#",
    "E",
    "F",
    "F#",
    "G",
    "G#",
    "A",
    "A#",
    "B",
  ];

  // Find current note index
  let noteIndex = chromaticScale.indexOf(noteName);
  if (noteIndex === -1) {
    // Handle flat notes
    const flatToSharp = { Db: "C#", Eb: "D#", Gb: "F#", Ab: "G#", Bb: "A#" };
    noteIndex = chromaticScale.indexOf(flatToSharp[noteName] || noteName);
  }

  if (noteIndex === -1) return note; // Fallback

  // Calculate new note index
  const newNoteIndex = (noteIndex + capoFrets) % 12;
  let newOctave = octave;

  // Check if we've crossed into the next octave
  if (noteIndex + capoFrets >= 12) {
    newOctave += Math.floor((noteIndex + capoFrets) / 12);
  }

  return chromaticScale[newNoteIndex] + newOctave;
}

// Update pentatonic collection based on capo position
function updatePentatonicCollectionForCapo() {
  pentatonicBoxNoteCollection = basePentatonicBoxNoteCollection.map((note) =>
    transposeNoteForCapo(note, currentCapoPosition),
  );
}

// Toggle reference note feature
function toggleReferenceNote(enabled) {
  useReferenceNote = enabled;
  renderTests(); // Re-render to update button text
  saveStateToStorage(); // Save state when reference note setting changes

  // Track reference note toggle
  if (typeof gtag !== "undefined") {
    gtag("event", "reference_note_toggle", {
      event_category: "ear_training",
      event_label: enabled ? "enabled" : "disabled",
      custom_parameter_1: "reference_note_setting",
    });
  }
}

// Set instructions display state
function setInstructionsDisplay(enabled) {
  showInstructions = enabled;
  saveStateToStorage(); // Save state when instructions setting changes

  // Track instructions toggle if analytics are available
  if (typeof gtag !== "undefined") {
    gtag("event", "instructions_toggle", {
      event_category: "ear_training",
      event_label: enabled ? "shown" : "hidden",
      custom_parameter_1: "instructions_display",
    });
  }
}

// Array to store all test states
let testCollection = [];

// Overall totals
let overallCorrectGuesses = 0;
let overallIncorrectGuesses = 0;

// Local storage key for saving state
const STORAGE_KEY = "ear-training-state";

// Load state from local storage
function loadStateFromStorage() {
  try {
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (savedState) {
      const state = JSON.parse(savedState);

      // Restore user settings
      if (state.settings) {
        currentInstrument = state.settings.instrument || currentInstrument;
        currentCapoPosition =
          state.settings.capoPosition || currentCapoPosition;
        useReferenceNote =
          state.settings.useReferenceNote !== undefined
            ? state.settings.useReferenceNote
            : useReferenceNote;
        showInstructions =
          state.settings.showInstructions !== undefined
            ? state.settings.showInstructions
            : showInstructions;

        // Update UI selectors
        updateInstrumentSelector();
        updateCapoSelector();
        updateInstructionsToggle();

        // Update collections and reference note
        updatePentatonicCollectionForCapo();
        updateReferenceNoteForCapo();
      }

      // Restore test progress
      if (state.testCollection && state.testCollection.length > 0) {
        testCollection = state.testCollection;
      }

      // Restore overall statistics
      if (state.statistics) {
        overallCorrectGuesses = state.statistics.correct || 0;
        overallIncorrectGuesses = state.statistics.incorrect || 0;
      }

      return true; // Successfully loaded state
    }
  } catch (error) {
    console.warn("Error loading state from local storage:", error);
  }
  return false; // No state loaded
}

// Save current state to local storage
function saveStateToStorage() {
  try {
    const state = {
      settings: {
        instrument: currentInstrument,
        capoPosition: currentCapoPosition,
        useReferenceNote: useReferenceNote,
        showInstructions: showInstructions,
      },
      testCollection: testCollection,
      statistics: {
        correct: overallCorrectGuesses,
        incorrect: overallIncorrectGuesses,
      },
      lastSaved: new Date().toISOString(),
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.warn("Error saving state to local storage:", error);
  }
}

// Clear saved state from local storage
function clearSavedState() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.warn("Error clearing saved state:", error);
  }
}

// Start a fresh session (clear saved state and generate new tests)
function startFreshSession() {
  // Clear local storage
  clearSavedState();

  // Generate new tests and reset scores
  generateTwelveTests();

  // Update progress indicator
  updateProgressIndicator();

  // Track fresh session start
  if (typeof gtag !== "undefined") {
    gtag("event", "fresh_session_start", {
      event_category: "ear_training",
      event_label: "manual_reset",
      custom_parameter_1: "user_initiated",
    });
  }
}

// Check if there is saved progress
function hasSavedProgress() {
  try {
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (savedState) {
      const state = JSON.parse(savedState);
      return state.testCollection && state.testCollection.length > 0;
    }
  } catch (error) {
    return false;
  }
  return false;
}

// Update progress indicator in UI
function updateProgressIndicator() {
  const indicator = document.getElementById("saved-progress-indicator");
  if (indicator) {
    if (hasSavedProgress()) {
      const completedTests = testCollection.filter(
        (test) => test.guessedCorrectly,
      ).length;
      const totalTests = testCollection.length;
      const inProgressTests = testCollection.filter(
        (test) => test.status !== "not-tried" && !test.guessedCorrectly,
      ).length;

      if (completedTests === totalTests && totalTests > 0) {
        indicator.textContent = "✓ Session complete";
        indicator.style.color = "#28a745";
      } else if (inProgressTests > 0 || completedTests > 0) {
        indicator.textContent = `Progress saved (${completedTests}/${totalTests} complete)`;
        indicator.style.color = "#007bff";
      } else {
        indicator.textContent = "Fresh tests ready";
        indicator.style.color = "#666";
      }
    } else {
      indicator.textContent = "";
    }
  }
}

function generateTwelveTests() {
  // Clear existing tests
  testCollection = [];

  let previousNote = null;

  // Generate 12 tests
  for (let i = 0; i < 12; i++) {
    let randomNote;

    // Ensure we don't get the same note as the previous one
    do {
      randomNote =
        pentatonicBoxNoteCollection[
          Math.floor(Math.random() * pentatonicBoxNoteCollection.length)
        ];
    } while (
      randomNote === previousNote &&
      pentatonicBoxNoteCollection.length > 1
    );

    testCollection.push({
      id: i,
      targetNote: randomNote,
      guessCount: 0,
      status: "not-tried",
      guessedCorrectly: false,
      buttonFeedback: {}, // Track button colors
      buttonsEnabled: false, // Track if note buttons should be enabled
    });

    // Store this note as the previous note for the next iteration
    previousNote = randomNote;
  }

  // Reset overall totals
  overallCorrectGuesses = 0;
  overallIncorrectGuesses = 0;

  // Save state after generating new tests
  saveStateToStorage();

  // Track test generation in Analytics
  if (typeof gtag !== "undefined") {
    gtag("event", "ear_training_start", {
      event_category: "ear_training",
      event_label: "twelve_tests_generated",
      value: 12,
    });
  }

  // Render the tests
  renderTests();
  updateOverallTotals();
  updateProgressIndicator();
}

function renderTests() {
  const container = document.getElementById("tests-container");
  container.innerHTML = "";

  testCollection.forEach((test, index) => {
    const testDiv = document.createElement("div");
    testDiv.className = "test-item";
    testDiv.innerHTML = `
      <div class="test-header">
        <span class="test-number">Test ${index + 1}</span>
        <button class="play-test-btn" onclick="playTestNote(${index})" >
          Play Note
        </button>
      </div>
      
      <div class="test-feedback">
        <span id="status-indicator-${index}" class="status-${test.status}">
          ${getStatusText(test.status)}
        </span>
      </div>
      
      <div class="test-stats">
        <span>Guesses: ${test.guessCount}</span>
      </div>
      
      <div class="test-pentatonic-buttons">
        ${pentatonicBoxNoteCollection
          .map(
            (note) =>
              `<button id="test-${index}-note-${note}" class="test-note-btn ${test.buttonFeedback && test.buttonFeedback[note] ? test.buttonFeedback[note] : ""}" onclick="selectTestNote(${index}, '${note}')" ${!test.buttonsEnabled ? "disabled" : ""}>
             ${note}
           </button>`,
          )
          .join("")}
      </div>
    `;

    container.appendChild(testDiv);
  });
}

function getStatusText(status) {
  switch (status) {
    case "correct":
      return "Correct!";
    case "incorrect":
      return "Incorrect";
    case "not-tried":
    default:
      return "Not Tried";
  }
}

function playTestNote(testIndex) {
  const test = testCollection[testIndex];
  if (test && test.targetNote) {
    // Enable the note buttons after first play
    if (!test.buttonsEnabled) {
      test.buttonsEnabled = true;
      renderTests(); // Re-render to enable the buttons

      // Track first note play for this test
      if (typeof gtag !== "undefined") {
        gtag("event", "test_note_first_play", {
          event_category: "ear_training",
          event_label: test.targetNote,
          test_number: testIndex + 1,
        });
      }
    } else {
      // Track replay
      if (typeof gtag !== "undefined") {
        gtag("event", "test_note_replay", {
          event_category: "ear_training",
          event_label: test.targetNote,
          test_number: testIndex + 1,
        });
      }
    }

    if (useReferenceNote) {
      // Play reference note first
      playNote(currentReferenceNote);

      // Track reference note plays
      if (typeof gtag !== "undefined") {
        gtag("event", "reference_note_play", {
          event_category: "ear_training",
          event_label: currentReferenceNote,
          test_number: testIndex + 1,
          custom_parameter_1: "automatic_reference_note",
        });
      }

      // Play the test note after a short delay
      setTimeout(() => {
        playNote(test.targetNote);
      }, 1200); // 1.2 second delay
    } else {
      // Play test note immediately if no reference
      playNote(test.targetNote);
    }
  }
}

function playNote(note) {
  if (currentInstrument === "banjo") {
    banjoSampler.triggerAttackRelease(note, "2n.");
  } else {
    synthInstrument.triggerAttackRelease(note, "1n");
  }

  // Track individual note plays
  if (typeof gtag !== "undefined") {
    gtag("event", "note_play", {
      event_category: "ear_training",
      event_label: note,
      instrument: currentInstrument,
      custom_parameter_1: "individual_note",
    });
  }
}

function selectTestNote(testIndex, note) {
  const test = testCollection[testIndex];

  if (!test) {
    return;
  }

  // If the test is already completed, just play the note without any other actions
  if (test.guessedCorrectly) {
    playNote(note);
    return;
  }

  // Increment guess counter
  test.guessCount++;

  // Play the guessed note
  playNote(note);

  // Provide immediate visual feedback to the button
  const buttonElement = document.getElementById(
    `test-${testIndex}-note-${note}`,
  );

  // Check if guess is correct
  if (note === test.targetNote) {
    test.status = "correct";
    test.guessedCorrectly = true;
    overallCorrectGuesses++;

    // Add green feedback to the correct button
    if (buttonElement) {
      buttonElement.classList.add("btn-correct");
    }
    test.buttonFeedback[note] = "btn-correct";

    // Track correct guess
    if (typeof gtag !== "undefined") {
      gtag("event", "ear_training_correct", {
        event_category: "ear_training",
        event_label: `${test.targetNote}_guessed_as_${note}`,
        test_number: testIndex + 1,
        guess_count: test.guessCount,
        value: 1,
      });
    }
  } else {
    test.status = "incorrect";
    overallIncorrectGuesses++;

    // Add red feedback to the incorrect button
    if (buttonElement) {
      buttonElement.classList.add("btn-incorrect");
    }
    test.buttonFeedback[note] = "btn-incorrect";

    // Track incorrect guess
    if (typeof gtag !== "undefined") {
      gtag("event", "ear_training_incorrect", {
        event_category: "ear_training",
        event_label: `${test.targetNote}_guessed_as_${note}`,
        test_number: testIndex + 1,
        guess_count: test.guessCount,
        value: 0,
      });
    }
  }

  // Re-render the tests to update the UI
  renderTests();
  updateOverallTotals();
  updateProgressIndicator();

  // Save state after each guess
  saveStateToStorage();
}

function updateOverallTotals() {
  const totalsElement = document.getElementById("overall-totals");
  if (totalsElement) {
    const totalGuesses = overallCorrectGuesses + overallIncorrectGuesses;
    const percentage =
      totalGuesses > 0
        ? Math.round((overallCorrectGuesses / totalGuesses) * 100)
        : 0;
    totalsElement.textContent = `Total Correct: ${overallCorrectGuesses} | Total Incorrect: ${overallIncorrectGuesses} | Accuracy: ${percentage}%`;

    // Check if all tests are completed
    const completedTests = testCollection.filter(
      (test) => test.guessedCorrectly,
    ).length;
    if (completedTests === testCollection.length && testCollection.length > 0) {
      // Track session completion
      if (typeof gtag !== "undefined") {
        gtag("event", "ear_training_session_complete", {
          event_category: "ear_training",
          event_label: "all_tests_completed",
          total_guesses: totalGuesses,
          correct_guesses: overallCorrectGuesses,
          accuracy_percentage: percentage,
          value: percentage,
        });
      }
    }

    // Track progress milestones
    if (completedTests === 6 && typeof gtag !== "undefined") {
      gtag("event", "ear_training_milestone", {
        event_category: "ear_training",
        event_label: "halfway_complete",
        tests_completed: completedTests,
        accuracy_percentage: percentage,
      });
    }
  }
}

// Generate tests automatically when the page loads
document.addEventListener("DOMContentLoaded", function () {
  // Try to load saved state first
  const hasLoadedState = loadStateFromStorage();

  // Initialize from URL (this will override saved state if URL params are present)
  initializeFromURL();

  // Only generate new tests if no saved state exists
  if (!hasLoadedState) {
    updatePentatonicCollectionForCapo();
    updateReferenceNoteForCapo();
    generateTwelveTests();
  } else {
    // If we loaded saved state, just render the existing tests
    renderTests();
    updateOverallTotals();
    updateProgressIndicator();
  }

  // Update fretboard display if function is available (from HTML page)
  setTimeout(() => {
    if (typeof updateFretboardDisplay === "function") {
      updateFretboardDisplay();
    }
  }, 200);
});
