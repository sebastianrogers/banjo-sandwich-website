#!/bin/bash

# Simple test script for ear training functionality
echo "🎵 Ear Training Test Runner 🎵"
echo "================================"

# Check if required files exist
echo "📁 Checking files..."

required_files=(
    "js/ear-training.js"
    "ear-training/pentatonic.html"
    "ear-training/index.html"
)

all_files_exist=true
for file in "${required_files[@]}"; do
    if [[ -f "$file" ]]; then
        echo "✅ $file exists"
    else
        echo "❌ $file missing"
        all_files_exist=false
    fi
done

if [[ "$all_files_exist" = false ]]; then
    echo "❌ Some required files are missing!"
    exit 1
fi

echo ""
echo "🧪 Running unit tests..."
if [[ -f "test/ear-training.test.js" ]]; then
    node test/ear-training.test.js
else
    echo "❌ Unit test file not found"
fi

echo ""
echo "🌐 Browser testing instructions:"
echo "1. Start a local server: python3 -m http.server 8000"
echo "2. Open http://localhost:8000/ear-training/pentatonic.html"
echo "3. Open http://localhost:8000/test/ear-training-browser-tests.html in another tab"
echo "4. Follow the manual test checklist in the browser test page"

echo ""
echo "📋 Quick manual test checklist:"
echo "- ✓ Play test note button works"
echo "- ✓ Note buttons provide visual feedback"
echo "- ✓ Correct guesses turn green"
echo "- ✓ Incorrect guesses turn red"  
echo "- ✓ Capo position changes transpose notes"
echo "- ✓ Instrument switching works (synth/banjo)"
echo "- ✓ Reference note toggle affects playback"
echo "- ✓ Progress persists on page refresh"
echo "- ✓ Statistics are tracked correctly"
echo "- ✓ Fresh session button resets everything"

echo ""
echo "🚀 To start testing:"
echo "1. Run: python3 -m http.server 8000"
echo "2. Open: http://localhost:8000/ear-training/pentatonic.html"
echo "3. Test the functionality manually"
echo "4. Optionally run browser tests at: http://localhost:8000/test/ear-training-browser-tests.html"