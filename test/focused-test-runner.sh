#!/bin/bash

# Focused ear training test runner
echo "🎵 Ear Training Test Suite Runner 🎵"
echo "====================================="

# Track test results
total_tests=0
passed_tests=0

echo "📁 Checking required files..."

required_files=(
    "js/ear-training.js"
    "ear-training/pentatonic.html"
    "ear-training/index.html"
)

all_files_exist=true
for file in "${required_files[@]}"; do
    if [[ -f "$file" ]]; then
        echo "✅ $file exists"
        ((passed_tests++))
    else
        echo "❌ $file missing"
        all_files_exist=false
    fi
    ((total_tests++))
done

if [[ "$all_files_exist" = false ]]; then
    echo "❌ File existence check failed!"
    echo "📊 File Check: $passed_tests/$total_tests files found"
    exit 1
fi

echo "✅ All required files found"
echo ""

echo "🧪 Running JavaScript unit tests..."
if [[ -f "test/ear-training.test.js" ]]; then
    # Capture test output and exit code
    test_output=$(node test/ear-training.test.js 2>&1)
    test_exit_code=$?
    
    echo "$test_output"
    
    if [[ $test_exit_code -eq 0 ]]; then
        echo "✅ Unit tests passed"
        ((passed_tests++))
    else
        echo "❌ Unit tests failed"
    fi
    ((total_tests++))
else
    echo "❌ Unit test file not found"
    ((total_tests++))
fi

echo ""

echo "🔍 Checking JavaScript syntax..."
if command -v node >/dev/null 2>&1; then
    if node -c js/ear-training.js >/dev/null 2>&1; then
        echo "✅ JavaScript syntax is valid"
        ((passed_tests++))
    else
        echo "❌ JavaScript syntax errors detected"
        node -c js/ear-training.js
    fi
    ((total_tests++))
else
    echo "⚠️  Node.js not available for syntax check"
fi

echo ""

echo "🌐 Checking HTML structure..."
for html_file in ear-training/index.html ear-training/pentatonic.html; do
    if [[ -f "$html_file" ]]; then
        # Check for required script tags
        if grep -q "ear-training.js" "$html_file"; then
            echo "✅ $html_file includes ear-training.js"
            ((passed_tests++))
        else
            echo "❌ $html_file missing ear-training.js reference"
        fi
        
        if grep -q "tone" "$html_file" || grep -q "Tone" "$html_file"; then
            echo "✅ $html_file includes Tone.js"
            ((passed_tests++))
        else
            echo "❌ $html_file missing Tone.js reference"
        fi
        
        ((total_tests+=2))
    fi
done

echo ""

echo "📋 Test server availability..."
if command -v python3 >/dev/null 2>&1; then
    echo "✅ Python3 available for local server"
    ((passed_tests++))
else
    echo "❌ Python3 not available"
fi
((total_tests++))

echo ""
echo "📊 FINAL RESULTS"
echo "================"
echo "Total tests: $total_tests"
echo "Passed: $passed_tests"
echo "Failed: $((total_tests - passed_tests))"

if [[ $passed_tests -eq $total_tests ]]; then
    echo "🎉 ALL TESTS PASSED! The ear training functionality is ready."
    echo ""
    echo "🚀 To test in browser:"
    echo "1. Run: python3 -m http.server 8000"
    echo "2. Open: http://localhost:8000/ear-training/pentatonic.html"
    echo "3. Test the interactive features manually"
    exit 0
else
    echo "❌ Some tests failed. Please check the issues above."
    exit 1
fi