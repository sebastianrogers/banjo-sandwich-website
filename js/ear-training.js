let currentSynth = new Tone.Sampler({
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
const pentatonicBoxNoteCollection = [
  "D3",
  "E3",
  "G3",
  "A3",
  "B3",
  "C4",
  "D4",
  "E4",
];

// Array to store all test states
let testCollection = [];

// Overall totals
let overallCorrectGuesses = 0;
let overallIncorrectGuesses = 0;

function generateTwelveTests() {
  // Clear existing tests
  testCollection = [];

  // Generate 12 tests
  for (let i = 0; i < 12; i++) {
    const randomNote =
      pentatonicBoxNoteCollection[
        Math.floor(Math.random() * pentatonicBoxNoteCollection.length)
      ];

    testCollection.push({
      id: i,
      targetNote: randomNote,
      guessCount: 0,
      status: "not-tried",
      guessedCorrectly: false,
      buttonFeedback: {}, // Track button colors
      buttonsEnabled: false, // Track if note buttons should be enabled
    });
  }

  // Reset overall totals
  overallCorrectGuesses = 0;
  overallIncorrectGuesses = 0;

  // Track test generation in Analytics
  if (typeof gtag !== 'undefined') {
    gtag('event', 'ear_training_start', {
      'event_category': 'ear_training',
      'event_label': 'twelve_tests_generated',
      'value': 12
    });
  }

  // Render the tests
  renderTests();
  updateOverallTotals();
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
      if (typeof gtag !== 'undefined') {
        gtag('event', 'test_note_first_play', {
          'event_category': 'ear_training',
          'event_label': test.targetNote,
          'test_number': testIndex + 1
        });
      }
    } else {
      // Track replay
      if (typeof gtag !== 'undefined') {
        gtag('event', 'test_note_replay', {
          'event_category': 'ear_training',
          'event_label': test.targetNote,
          'test_number': testIndex + 1
        });
      }
    }
    playNote(test.targetNote);
  }
}

function playNote(note) {
  currentSynth.triggerAttackRelease(note, "1n");
  
  // Track individual note plays
  if (typeof gtag !== 'undefined') {
    gtag('event', 'note_play', {
      'event_category': 'ear_training',
      'event_label': note,
      'custom_parameter_1': 'individual_note'
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
    if (typeof gtag !== 'undefined') {
      gtag('event', 'ear_training_correct', {
        'event_category': 'ear_training',
        'event_label': `${test.targetNote}_guessed_as_${note}`,
        'test_number': testIndex + 1,
        'guess_count': test.guessCount,
        'value': 1
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
    if (typeof gtag !== 'undefined') {
      gtag('event', 'ear_training_incorrect', {
        'event_category': 'ear_training',
        'event_label': `${test.targetNote}_guessed_as_${note}`,
        'test_number': testIndex + 1,
        'guess_count': test.guessCount,
        'value': 0
      });
    }
  }

  // Re-render the tests to update the UI
  renderTests();
  updateOverallTotals();
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
    const completedTests = testCollection.filter(test => test.guessedCorrectly).length;
    if (completedTests === testCollection.length && testCollection.length > 0) {
      // Track session completion
      if (typeof gtag !== 'undefined') {
        gtag('event', 'ear_training_session_complete', {
          'event_category': 'ear_training',
          'event_label': 'all_tests_completed',
          'total_guesses': totalGuesses,
          'correct_guesses': overallCorrectGuesses,
          'accuracy_percentage': percentage,
          'value': percentage
        });
      }
    }
    
    // Track progress milestones
    if (completedTests === 6 && typeof gtag !== 'undefined') {
      gtag('event', 'ear_training_milestone', {
        'event_category': 'ear_training',
        'event_label': 'halfway_complete',
        'tests_completed': completedTests,
        'accuracy_percentage': percentage
      });
    }
  }
}

// Generate tests automatically when the page loads
document.addEventListener("DOMContentLoaded", function () {
  generateTwelveTests();
});
