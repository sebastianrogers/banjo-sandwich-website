/**
 * Google Analytics Utility Functions
 * Shared tracking functions for the Banjo Sandwich website
 */

class BanjoAnalytics {
    constructor() {
        this.sessionStartTime = Date.now();
        this.pageLoadTime = Date.now();
        this.init();
    }

    init() {
        this.trackPageLoad();
        this.setupNavigationTracking();
        this.setupScrollTracking();
        this.setupTimeOnPageTracking();
    }

    // Track page load and performance
    trackPageLoad() {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'page_view', {
                'event_category': 'engagement',
                'page_title': document.title,
                'page_location': window.location.href,
                'page_path': window.location.pathname
            });

            // Track page load timing
            window.addEventListener('load', () => {
                const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
                gtag('event', 'timing_complete', {
                    'event_category': 'performance',
                    'name': 'page_load',
                    'value': loadTime
                });
            });
        }
    }

    // Track navigation clicks
    setupNavigationTracking() {
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (link && typeof gtag !== 'undefined') {
                const href = link.getAttribute('href');
                const text = link.textContent.trim();
                
                // Track internal vs external links
                const isExternal = href && (href.startsWith('http') && !href.includes(window.location.hostname));
                const isInternal = href && (href.startsWith('/') || href.startsWith('#') || href.includes(window.location.hostname));
                
                if (isExternal) {
                    gtag('event', 'click', {
                        'event_category': 'outbound',
                        'event_label': href,
                        'link_text': text,
                        'value': 1
                    });
                } else if (isInternal) {
                    gtag('event', 'click', {
                        'event_category': 'navigation',
                        'event_label': href,
                        'link_text': text,
                        'page_section': this.getPageSection(link)
                    });
                }
            }
        });
    }

    // Track scroll depth
    setupScrollTracking() {
        let maxScroll = 0;
        const scrollMilestones = [25, 50, 75, 90, 100];
        const trackedMilestones = new Set();

        window.addEventListener('scroll', () => {
            const scrollPercent = Math.round(
                (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
            );
            
            maxScroll = Math.max(maxScroll, scrollPercent);

            // Track scroll milestones
            scrollMilestones.forEach(milestone => {
                if (scrollPercent >= milestone && !trackedMilestones.has(milestone)) {
                    trackedMilestones.add(milestone);
                    if (typeof gtag !== 'undefined') {
                        gtag('event', 'scroll', {
                            'event_category': 'engagement',
                            'event_label': `${milestone}%`,
                            'value': milestone
                        });
                    }
                }
            });
        });
    }

    // Track time on page
    setupTimeOnPageTracking() {
        const timeThresholds = [30, 60, 120, 300]; // 30s, 1m, 2m, 5m
        const trackedThresholds = new Set();

        setInterval(() => {
            const timeOnPage = Math.floor((Date.now() - this.pageLoadTime) / 1000);
            
            timeThresholds.forEach(threshold => {
                if (timeOnPage >= threshold && !trackedThresholds.has(threshold)) {
                    trackedThresholds.add(threshold);
                    if (typeof gtag !== 'undefined') {
                        gtag('event', 'timing_complete', {
                            'event_category': 'engagement',
                            'name': 'time_on_page',
                            'value': threshold
                        });
                    }
                }
            });
        }, 10000); // Check every 10 seconds
    }

    // Helper to determine page section
    getPageSection(element) {
        const section = element.closest('section, header, footer, nav, main');
        if (section) {
            return section.id || section.className || section.tagName.toLowerCase();
        }
        return 'unknown';
    }

    // Track custom events
    trackEvent(action, category = 'general', label = '', value = null) {
        if (typeof gtag !== 'undefined') {
            const eventData = {
                'event_category': category,
                'event_label': label
            };
            
            if (value !== null) {
                eventData.value = value;
            }

            gtag('event', action, eventData);
        }
    }

    // Track user interactions with specific elements
    trackInteraction(element, action, additionalData = {}) {
        if (typeof gtag !== 'undefined') {
            gtag('event', action, {
                'event_category': 'interaction',
                'element_type': element.tagName.toLowerCase(),
                'element_id': element.id || 'no_id',
                'element_class': element.className || 'no_class',
                ...additionalData
            });
        }
    }

    // Track form interactions
    setupFormTracking(formSelector = 'form') {
        document.querySelectorAll(formSelector).forEach(form => {
            form.addEventListener('submit', (e) => {
                const formId = form.id || form.className || 'unnamed_form';
                this.trackEvent('form_submit', 'forms', formId);
            });

            // Track form field focus
            form.querySelectorAll('input, textarea, select').forEach(field => {
                field.addEventListener('focus', () => {
                    const fieldName = field.name || field.id || field.type;
                    this.trackEvent('form_field_focus', 'forms', fieldName);
                });
            });
        });
    }

    // Track media interactions
    setupMediaTracking(mediaSelector = 'audio, video') {
        document.querySelectorAll(mediaSelector).forEach(media => {
            ['play', 'pause', 'ended'].forEach(eventType => {
                media.addEventListener(eventType, () => {
                    const mediaId = media.id || media.src || 'unnamed_media';
                    this.trackEvent(`media_${eventType}`, 'media', mediaId);
                });
            });
        });
    }
}

// Auto-initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.banjoAnalytics = new BanjoAnalytics();
});

// Export for manual use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BanjoAnalytics;
}