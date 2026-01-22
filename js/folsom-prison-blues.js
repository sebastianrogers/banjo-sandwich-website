/**
 * Folsom Prison Blues - JavaScript functionality
 * Interactive features for the song display page
 */

class FolsomPrisonBlues {
    constructor() {
        this.currentVerse = null;
        this.isPlaying = false;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.highlightChordProgression();
        console.log('Folsom Prison Blues page initialized');
    }

    setupEventListeners() {
        // Add click handlers for verses to highlight them
        const verses = document.querySelectorAll('.verse');
        verses.forEach((verse, index) => {
            verse.addEventListener('click', () => this.selectVerse(verse, index));
            
            // Add keyboard navigation
            verse.setAttribute('tabindex', '0');
            verse.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.selectVerse(verse, index);
                }
            });
        });

        // Add print button functionality
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'p') {
                this.preparePrintView();
            }
        });
    }

    selectVerse(verseElement, index) {
        // Remove previous selection
        document.querySelectorAll('.verse').forEach(v => {
            v.classList.remove('selected');
            v.style.backgroundColor = '';
        });

        // Highlight selected verse
        verseElement.classList.add('selected');
        verseElement.style.backgroundColor = '#e8f5e8';
        
        this.currentVerse = index;
        
        // Enhanced analytics tracking for verse interactions
        if (typeof gtag !== 'undefined') {
            const verseTitle = verseElement.querySelector('.verse-title')?.textContent || `Verse ${index + 1}`;
            
            gtag('event', 'verse_select', {
                'event_category': 'song_interaction',
                'event_label': 'folsom_prison_blues',
                'verse_number': index + 1,
                'verse_title': verseTitle,
                'interaction_type': 'verse_selection'
            });
        }
        
        // Track via shared analytics utility if available
        if (window.banjoAnalytics) {
            window.banjoAnalytics.trackInteraction(verseElement, 'verse_select', {
                song: 'folsom_prison_blues',
                verse_number: index + 1,
                selection_method: 'click'
            });
        }
    }

    highlightChordProgression() {
        const chordProgression = document.querySelector('.chord-progression');
        if (chordProgression) {
            // Add hover effect for chord progression
            chordProgression.addEventListener('mouseenter', () => {
                chordProgression.style.transform = 'scale(1.02)';
                chordProgression.style.transition = 'transform 0.3s ease';
                
                // Track chord progression focus
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'chord_progression_focus', {
                        'event_category': 'song_interaction',
                        'event_label': 'folsom_prison_blues',
                        'interaction_type': 'hover'
                    });
                }
            });
            
            chordProgression.addEventListener('mouseleave', () => {
                chordProgression.style.transform = 'scale(1)';
            });
            
            // Track clicks on chord progression
            chordProgression.addEventListener('click', () => {
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'chord_progression_click', {
                        'event_category': 'song_interaction',
                        'event_label': 'folsom_prison_blues',
                        'interaction_type': 'click',
                        'value': 1
                    });
                }
            });
        }
    }

    preparePrintView() {
        // Add print-specific styling
        const printStyles = `
            @media print {
                .verse.selected {
                    background-color: #f0f0f0 !important;
                }
                .container {
                    box-shadow: none !important;
                }
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.textContent = printStyles;
        document.head.appendChild(styleSheet);
    }

    // Future enhancement: Audio playback functionality
    initAudioPlayer() {
        // Placeholder for future audio integration
        console.log('Audio player initialization - coming soon!');
    }

    // Future enhancement: Tempo and key change functionality
    changeKey(newKey) {
        // Placeholder for transposition functionality
        console.log(`Transposing to key of ${newKey} - coming soon!`);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new FolsomPrisonBlues();
});

// Export for potential use by other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FolsomPrisonBlues;
}