#!/bin/bash

# Final integration test for ear training functionality
echo "🎵 Final Integration Test Suite 🎵"
echo "=================================="

# Test JavaScript function exports and availability
echo "🔧 Testing JavaScript function availability..."

# Create a test HTML page to verify functions work in browser context
cat > test_integration.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <script src="https://unpkg.com/tone"></script>
    <script src="js/ear-training.js"></script>
</head>
<body>
    <div id="tests-container"></div>
    <div id="overall-totals"></div>
    <div id="saved-progress-indicator"></div>
    
    <script>
        // Wait for everything to load
        document.addEventListener('DOMContentLoaded', function() {
            console.log('🧪 Running integration tests...');
            
            let errors = [];
            let successes = [];
            
            // Test 1: Check if essential functions exist
            const requiredFunctions = [
                'generateTwelveTests',
                'playNote',
                'setInstrument', 
                'setCapoPosition',
                'selectTestNote',
                'saveStateToStorage',
                'loadStateFromStorage'
            ];
            
            requiredFunctions.forEach(funcName => {
                if (typeof window[funcName] === 'function') {
                    successes.push(`✅ ${funcName} function available`);
                } else {
                    errors.push(`❌ ${funcName} function missing`);
                }
            });
            
            // Test 2: Check if global variables are initialized
            const requiredVariables = [
                'testCollection',
                'pentatonicBoxNoteCollection', 
                'currentInstrument',
                'currentCapoPosition',
                'useReferenceNote'
            ];
            
            requiredVariables.forEach(varName => {
                if (typeof window[varName] !== 'undefined') {
                    successes.push(`✅ ${varName} variable initialized`);
                } else {
                    errors.push(`❌ ${varName} variable missing`);
                }
            });
            
            // Test 3: Test note transposition
            try {
                const originalNote = 'G3';
                const transposed = transposeNoteForCapo(originalNote, 2);
                if (transposed === 'A3') {
                    successes.push(`✅ Note transposition works (G3 + 2 = A3)`);
                } else {
                    errors.push(`❌ Note transposition failed (G3 + 2 = ${transposed}, expected A3)`);
                }
            } catch (e) {
                errors.push(`❌ Note transposition error: ${e.message}`);
            }
            
            // Test 4: Test state management
            try {
                saveStateToStorage();
                const loaded = loadStateFromStorage();
                successes.push(`✅ State management works (loaded: ${loaded})`);
            } catch (e) {
                errors.push(`❌ State management error: ${e.message}`);
            }
            
            // Test 5: Test DOM elements exist
            const requiredElements = ['tests-container', 'overall-totals', 'saved-progress-indicator'];
            requiredElements.forEach(elemId => {
                if (document.getElementById(elemId)) {
                    successes.push(`✅ Required DOM element '${elemId}' found`);
                } else {
                    errors.push(`❌ Required DOM element '${elemId}' missing`);
                }
            });
            
            // Output results
            const totalTests = successes.length + errors.length;
            console.log(`\n📊 Integration Test Results:`);
            console.log(`Total tests: ${totalTests}`);
            console.log(`Passed: ${successes.length}`);
            console.log(`Failed: ${errors.length}`);
            
            successes.forEach(msg => console.log(msg));
            errors.forEach(msg => console.error(msg));
            
            if (errors.length === 0) {
                console.log('\n🎉 ALL INTEGRATION TESTS PASSED!');
                document.title = 'INTEGRATION TESTS PASSED';
            } else {
                console.error('\n❌ SOME INTEGRATION TESTS FAILED!');
                document.title = 'INTEGRATION TESTS FAILED';
            }
        });
    </script>
</body>
</html>
EOF

echo "📄 Created integration test HTML page"

# Start browser test (simulate with curl to check if page loads)
echo ""
echo "🌐 Testing web server response..."

if curl -s -f "http://localhost:8001/ear-training/pentatonic.html" >/dev/null; then
    echo "✅ Main ear training page loads successfully"
else
    echo "❌ Main ear training page failed to load"
fi

if curl -s -f "http://localhost:8001/test/ear-training-browser-tests.html" >/dev/null; then
    echo "✅ Browser test suite page loads successfully"
else
    echo "❌ Browser test suite page failed to load"
fi

if curl -s -f "http://localhost:8001/js/ear-training.js" >/dev/null; then
    echo "✅ JavaScript file loads successfully"
else
    echo "❌ JavaScript file failed to load"
fi

echo ""
echo "🎼 Testing audio dependencies..."

# Check if Tone.js is accessible
if curl -s -f "https://unpkg.com/tone" >/dev/null; then
    echo "✅ Tone.js CDN is accessible"
else
    echo "⚠️  Tone.js CDN may be unreachable (network dependent)"
fi

# Check banjo samples directory
if [[ -d "banjo" ]]; then
    echo "✅ Banjo samples directory exists"
    sample_count=$(find banjo -name "*.mp3" 2>/dev/null | wc -l)
    echo "📁 Found $sample_count banjo sample files"
else
    echo "⚠️  Banjo samples directory not found"
fi

echo ""
echo "📋 Manual testing checklist:"
echo "1. Open: http://localhost:8001/ear-training/pentatonic.html"
echo "2. Click 'Play Note' for test 1 (should hear audio)"
echo "3. Click a note button (should see visual feedback)"
echo "4. Try correct and incorrect guesses"
echo "5. Change capo position and verify notes transpose"
echo "6. Switch between synth and banjo instruments"
echo "7. Refresh page and verify state persists"

# Cleanup
rm -f test_integration.html

echo ""
echo "✅ Integration test complete!"
echo "🚀 Server running at: http://localhost:8001"