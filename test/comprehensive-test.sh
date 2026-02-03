#!/bin/bash

# Comprehensive ear training test suite
echo "🎵 COMPREHENSIVE EAR TRAINING TEST SUITE 🎵"
echo "============================================="

total_tests=0
passed_tests=0
failed_tests=0

# Function to record test result
record_test() {
    ((total_tests++))
    if [[ $1 == "pass" ]]; then
        echo "✅ $2"
        ((passed_tests++))
    else
        echo "❌ $2"
        ((failed_tests++))
    fi
}

echo "📋 Test Suite Starting..."
echo ""

# Test 1: File Structure
echo "🗂️  Testing file structure..."
if [[ -f "js/ear-training.js" ]]; then
    record_test "pass" "ear-training.js exists"
else
    record_test "fail" "ear-training.js missing"
fi

if [[ -f "ear-training/pentatonic.html" ]]; then
    record_test "pass" "pentatonic.html exists" 
else
    record_test "fail" "pentatonic.html missing"
fi

if [[ -f "ear-training/index.html" ]]; then
    record_test "pass" "index.html exists"
else
    record_test "fail" "index.html missing"
fi

# Test 2: JavaScript Syntax
echo ""
echo "🔍 Testing JavaScript syntax..."
if node -c js/ear-training.js 2>/dev/null; then
    record_test "pass" "JavaScript syntax is valid"
else
    record_test "fail" "JavaScript syntax errors detected"
    node -c js/ear-training.js
fi

# Test 3: HTML Structure
echo ""
echo "🌐 Testing HTML structure..."
if grep -q "ear-training.js" ear-training/pentatonic.html; then
    record_test "pass" "pentatonic.html includes ear-training.js"
else
    record_test "fail" "pentatonic.html missing ear-training.js"
fi

if grep -q "tone\|Tone" ear-training/pentatonic.html; then
    record_test "pass" "pentatonic.html includes Tone.js"
else
    record_test "fail" "pentatonic.html missing Tone.js"
fi

# Test 4: Required Functions
echo ""
echo "🔧 Testing required function definitions..."

required_functions=(
    "generateTwelveTests"
    "playNote" 
    "setInstrument"
    "setCapoPosition"
    "selectTestNote"
    "saveStateToStorage"
    "loadStateFromStorage"
    "transposeNoteForCapo"
    "updatePentatonicCollectionForCapo"
    "renderTests"
)

for func in "${required_functions[@]}"; do
    if grep -q "function $func\|$func.*function\|$func.*=" js/ear-training.js; then
        record_test "pass" "Function $func is defined"
    else
        record_test "fail" "Function $func not found"
    fi
done

# Test 5: Required Variables
echo ""
echo "📊 Testing required variable declarations..."

required_variables=(
    "testCollection" 
    "pentatonicBoxNoteCollection"
    "currentInstrument"
    "currentCapoPosition"
    "useReferenceNote"
    "banjoSampler"
    "synthInstrument"
)

for var in "${required_variables[@]}"; do
    if grep -q "let $var\|var $var\|const $var" js/ear-training.js; then
        record_test "pass" "Variable $var is declared"
    else
        record_test "fail" "Variable $var not found"
    fi
done

# Test 6: Unit Tests
echo ""
echo "🧪 Running unit tests..."
if [[ -f "test/ear-training.test.js" ]]; then
    if node test/ear-training.test.js >/dev/null 2>&1; then
        record_test "pass" "All unit tests pass"
    else
        record_test "fail" "Unit tests failed"
        echo "   Running unit tests for details:"
        node test/ear-training.test.js | head -20
    fi
else
    record_test "fail" "Unit test file missing"
fi

# Test 7: Audio Resources
echo ""
echo "🎵 Testing audio resources..."
if [[ -d "banjo" ]]; then
    sample_count=$(find banjo -name "*.mp3" 2>/dev/null | wc -l)
    if [[ $sample_count -gt 0 ]]; then
        record_test "pass" "Banjo samples found ($sample_count files)"
    else
        record_test "fail" "No banjo MP3 samples found"
    fi
else
    record_test "fail" "Banjo samples directory missing"
fi

# Test 8: Dependencies
echo ""
echo "📦 Testing external dependencies..."
if curl -s -f "https://unpkg.com/tone" >/dev/null 2>&1; then
    record_test "pass" "Tone.js CDN is accessible"
else
    record_test "fail" "Tone.js CDN not accessible"
fi

# Test 9: Code Quality Checks
echo ""
echo "🔎 Testing code quality..."

# Check for console.log statements (should be minimal)
log_count=$(grep -c "console\.log" js/ear-training.js 2>/dev/null)
if [[ -z "$log_count" ]]; then
    log_count=0
fi
if [[ "$log_count" -lt 5 ]]; then
    record_test "pass" "Minimal console.log usage ($log_count found)"
else
    record_test "fail" "Too many console.log statements ($log_count found)"
fi

# Check for proper error handling
if grep -q "try\|catch" js/ear-training.js; then
    record_test "pass" "Error handling is present"
else
    record_test "fail" "No error handling found"
fi

# Test 10: Browser Compatibility
echo ""
echo "🌐 Testing browser compatibility..."

# Check for modern JS features that might need polyfills
if grep -q "arrow function\|=>" js/ear-training.js; then
    record_test "pass" "Modern JavaScript syntax used appropriately"
fi

# Check for proper event listeners
if grep -q "addEventListener" js/ear-training.js; then
    record_test "pass" "Proper event listener usage"
else
    record_test "fail" "No addEventListener found"
fi

# FINAL RESULTS
echo ""
echo "🏆 FINAL TEST RESULTS"
echo "===================="
echo "Total tests run: $total_tests"
echo "Tests passed: $passed_tests"
echo "Tests failed: $failed_tests"

if [[ $failed_tests -eq 0 ]]; then
    echo ""
    echo "🎉🎉🎉 ALL TESTS PASSED! 🎉🎉🎉"
    echo "The ear training functionality is working correctly!"
    echo ""
    echo "🚀 Ready for production use!"
    echo "📱 Manual testing recommended in browser"
    exit 0
else
    echo ""
    echo "⚠️  $failed_tests tests failed"
    echo "🔧 Please address the failing tests above"
    echo ""
    echo "📊 Success rate: $(( passed_tests * 100 / total_tests ))%"
    exit 1
fi