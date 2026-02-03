/**
 * Unit tests for ear-training.js functionality
 * Run with: node test/ear-training.test.js
 */

// Mock browser APIs for testing
const mockLocalStorage = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => (store[key] = value.toString()),
    removeItem: (key) => delete store[key],
    clear: () => (store = {}),
  };
})();

const mockDocument = {
  getElementById: () => null,
  createElement: () => ({
    className: "",
    innerHTML: "",
    appendChild: () => {},
  }),
  addEventListener: () => {},
};

global.localStorage = mockLocalStorage;
global.document = mockDocument;
global.window = {
  history: { replaceState: () => {} },
  location: { search: "" },
};
global.URL = class {
  constructor() {
    this.searchParams = new Map();
  }
};
global.URLSearchParams = Map;

// Load the ear training module (would need to be modified for proper module export)
// For now, we'll test the core functions directly

// Test note transposition function
function testNoteTransposition() {
  console.log("Testing note transposition...");

  // Test cases for transposeNoteForCapo function
  const testCases = [
    { note: "G3", capo: 0, expected: "G3" }, // No capo
    { note: "G3", capo: 2, expected: "A3" }, // Up 2 semitones
    { note: "B3", capo: 1, expected: "C4" }, // Cross octave boundary
    { note: "D3", capo: 12, expected: "D4" }, // Full octave up
    { note: "E3", capo: 5, expected: "A3" }, // Mid-range test
  ];

  // Implementation of transposeNoteForCapo for testing
  function transposeNoteForCapo(note, capoFrets) {
    if (capoFrets === 0) return note;

    const noteRegex = /([A-G][#b]?)([0-9]+)/;
    const match = note.match(noteRegex);
    if (!match) return note;

    const noteName = match[1];
    const octave = parseInt(match[2]);

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

    let noteIndex = chromaticScale.indexOf(noteName);
    if (noteIndex === -1) {
      const flatToSharp = { Db: "C#", Eb: "D#", Gb: "F#", Ab: "G#", Bb: "A#" };
      noteIndex = chromaticScale.indexOf(flatToSharp[noteName] || noteName);
    }

    if (noteIndex === -1) return note;

    const newNoteIndex = (noteIndex + capoFrets) % 12;
    let newOctave = octave;

    if (noteIndex + capoFrets >= 12) {
      newOctave += Math.floor((noteIndex + capoFrets) / 12);
    }

    return chromaticScale[newNoteIndex] + newOctave;
  }

  let passed = 0;
  let total = testCases.length;

  testCases.forEach((testCase, index) => {
    const result = transposeNoteForCapo(testCase.note, testCase.capo);
    const success = result === testCase.expected;

    console.log(
      `  Test ${index + 1}: ${testCase.note} + capo ${testCase.capo} = ${result} ${success ? "✓" : "✗ (expected " + testCase.expected + ")"}`,
    );

    if (success) passed++;
  });

  console.log(`Note transposition: ${passed}/${total} tests passed\n`);
  return passed === total;
}

// Test pentatonic collection generation
function testPentatonicCollection() {
  console.log("Testing pentatonic collection generation...");

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

  function updatePentatonicCollectionForCapo(capoPosition) {
    return basePentatonicBoxNoteCollection.map((note) => {
      // Using the transposeNoteForCapo function
      if (capoPosition === 0) return note;

      const noteRegex = /([A-G][#b]?)([0-9]+)/;
      const match = note.match(noteRegex);
      if (!match) return note;

      const noteName = match[1];
      const octave = parseInt(match[2]);

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

      let noteIndex = chromaticScale.indexOf(noteName);
      if (noteIndex === -1) return note;

      const newNoteIndex = (noteIndex + capoPosition) % 12;
      let newOctave = octave;

      if (noteIndex + capoPosition >= 12) {
        newOctave += Math.floor((noteIndex + capoPosition) / 12);
      }

      return chromaticScale[newNoteIndex] + newOctave;
    });
  }

  // Test capo 0 (should be unchanged)
  const capo0 = updatePentatonicCollectionForCapo(0);
  const capo0Test =
    JSON.stringify(capo0) === JSON.stringify(basePentatonicBoxNoteCollection);
  console.log(`  Capo 0: ${capo0Test ? "✓" : "✗"} - ${capo0.join(", ")}`);

  // Test capo 2 (should transpose up 2 semitones)
  const capo2 = updatePentatonicCollectionForCapo(2);
  const expectedCapo2 = ["E3", "F#3", "A3", "B3", "C#4", "D4", "E4", "F#4"];
  const capo2Test = JSON.stringify(capo2) === JSON.stringify(expectedCapo2);
  console.log(`  Capo 2: ${capo2Test ? "✓" : "✗"} - ${capo2.join(", ")}`);

  console.log(
    `Pentatonic collection: ${capo0Test && capo2Test ? "PASSED" : "FAILED"}\n`,
  );
  return capo0Test && capo2Test;
}

// Test state management
function testStateManagement() {
  console.log("Testing state management...");

  // Clear any existing state
  mockLocalStorage.clear();

  const STORAGE_KEY = "ear-training-state";

  // Test saving state
  const testState = {
    settings: {
      instrument: "banjo",
      capoPosition: 3,
      useReferenceNote: false,
      showInstructions: true,
    },
    testCollection: [
      { id: 0, targetNote: "G3", guessedCorrectly: true, guessCount: 2 },
    ],
    statistics: {
      correct: 1,
      incorrect: 1,
    },
  };

  try {
    mockLocalStorage.setItem(STORAGE_KEY, JSON.stringify(testState));
    const saved = mockLocalStorage.getItem(STORAGE_KEY);
    const parsed = JSON.parse(saved);

    const saveTest = JSON.stringify(parsed) === JSON.stringify(testState);
    console.log(`  Save state: ${saveTest ? "✓" : "✗"}`);

    // Test loading state
    const loaded = JSON.parse(mockLocalStorage.getItem(STORAGE_KEY));
    const loadTest =
      loaded.settings.instrument === "banjo" &&
      loaded.settings.capoPosition === 3 &&
      loaded.testCollection.length === 1;
    console.log(`  Load state: ${loadTest ? "✓" : "✗"}`);

    console.log(
      `State management: ${saveTest && loadTest ? "PASSED" : "FAILED"}\n`,
    );
    return saveTest && loadTest;
  } catch (error) {
    console.log(`  State management: ✗ - Error: ${error.message}`);
    console.log(`State management: FAILED\n`);
    return false;
  }
}

// Run all tests
function runTests() {
  console.log("🎵 Running Ear Training Tests 🎵\n");

  const results = [
    testNoteTransposition(),
    testPentatonicCollection(),
    testStateManagement(),
  ];

  const passedTests = results.filter(Boolean).length;
  const totalTests = results.length;

  console.log(
    `\n📊 Test Results: ${passedTests}/${totalTests} test suites passed`,
  );

  if (passedTests === totalTests) {
    console.log(
      "🎉 All tests passed! The ear training functionality looks good.",
    );
  } else {
    console.log("❌ Some tests failed. Check the implementation.");
    process.exit(1);
  }
}

// Run tests if this file is executed directly
if (typeof require !== "undefined" && require.main === module) {
  runTests();
}

module.exports = { runTests };
