/**
 * Main JavaScript for Take Care Of My Dogs
 * Handles tab switching, touch interactions, and progressive enhancements
 */

(function() {
    'use strict';

    // Tab switching functionality
    function initTabs() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');

        if (tabButtons.length === 0) return;

        tabButtons.forEach(button => {
            button.addEventListener('click', function() {
                const targetTab = this.getAttribute('data-tab');

                // Update active button
                tabButtons.forEach(btn => {
                    btn.classList.remove('active');
                    btn.setAttribute('aria-selected', 'false');
                });
                this.classList.add('active');
                this.setAttribute('aria-selected', 'true');

                // Show corresponding tab content
                tabContents.forEach(content => {
                    content.classList.remove('active');
                });

                const targetContent = document.getElementById(targetTab);
                if (targetContent) {
                    targetContent.classList.add('active');
                }

                // Save preference to localStorage
                localStorage.setItem('lastViewedTab', targetTab);
            });
        });

        // Restore last viewed tab
        const lastTab = localStorage.getItem('lastViewedTab');
        if (lastTab) {
            const lastButton = document.querySelector(`[data-tab="${lastTab}"]`);
            if (lastButton) {
                lastButton.click();
            }
        }
    }

    // Touch feedback for mobile interactions
    function initTouchFeedback() {
        const touchElements = document.querySelectorAll('.supplement-card, .fab, .feeding-card');

        touchElements.forEach(element => {
            // Touch start
            element.addEventListener('touchstart', function() {
                this.style.transform = 'scale(0.98)';
            }, { passive: true });

            // Touch end
            element.addEventListener('touchend', function() {
                this.style.transform = '';
            }, { passive: true });

            // Touch cancel
            element.addEventListener('touchcancel', function() {
                this.style.transform = '';
            }, { passive: true });
        });
    }

    // Floating Action Button functionality
    function initFAB() {
        const fab = document.querySelector('.fab');
        if (!fab) return;

        fab.addEventListener('click', function() {
            // Placeholder for FAB functionality
            console.log('FAB clicked - Add new entry functionality to be implemented');

            // Example: Show current time for feeding
            const now = new Date();
            const timeString = now.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            });

            // Could show a modal or notification here
            if ('vibrate' in navigator) {
                navigator.vibrate(50); // Short vibration feedback on mobile
            }
        });
    }


    // Check if current meal time is active
    function highlightCurrentMealTime() {
        const now = new Date();
        const currentHour = now.getHours();

        let activeMeal = 'breakfast';
        if (currentHour >= 11 && currentHour < 15) {
            activeMeal = 'lunch';
        } else if (currentHour >= 16 && currentHour < 20) {
            activeMeal = 'dinner';
        }

        // Only auto-switch if user hasn't manually selected a tab
        if (!localStorage.getItem('lastViewedTab')) {
            const activeButton = document.querySelector(`[data-tab="${activeMeal}"]`);
            if (activeButton) {
                activeButton.click();
            }
        }

        // Update feeding times to show relative time
        const feedingTimes = document.querySelectorAll('.feeding-time');
        feedingTimes.forEach(timeElement => {
            const timeText = timeElement.textContent;
            const mealTime = parseTime(timeText);
            const minutesUntil = getMinutesUntil(mealTime);

            if (minutesUntil > 0 && minutesUntil <= 60) {
                timeElement.title = `In ${minutesUntil} minutes`;
            } else if (minutesUntil < 0 && minutesUntil >= -60) {
                timeElement.title = `${Math.abs(minutesUntil)} minutes ago`;
            }
        });
    }

    // Helper function to parse time string
    function parseTime(timeString) {
        const [time, period] = timeString.split(' ');
        let [hours, minutes] = time.split(':').map(Number);

        if (period === 'PM' && hours !== 12) {
            hours += 12;
        } else if (period === 'AM' && hours === 12) {
            hours = 0;
        }

        const date = new Date();
        date.setHours(hours, minutes, 0, 0);
        return date;
    }

    // Helper function to get minutes until a specific time
    function getMinutesUntil(targetTime) {
        const now = new Date();
        const diff = targetTime - now;
        return Math.round(diff / 60000);
    }

    // Add keyboard navigation support
    function initKeyboardNav() {
        const tabButtons = document.querySelectorAll('.tab-btn');

        tabButtons.forEach((button, index) => {
            button.addEventListener('keydown', function(e) {
                let targetIndex = index;

                if (e.key === 'ArrowLeft') {
                    targetIndex = index - 1;
                    if (targetIndex < 0) targetIndex = tabButtons.length - 1;
                } else if (e.key === 'ArrowRight') {
                    targetIndex = index + 1;
                    if (targetIndex >= tabButtons.length) targetIndex = 0;
                } else {
                    return;
                }

                e.preventDefault();
                tabButtons[targetIndex].focus();
                tabButtons[targetIndex].click();
            });
        });
    }

    // Progressive enhancement for images
    function initLazyImages() {
        if ('loading' in HTMLImageElement.prototype) {
            const images = document.querySelectorAll('img');
            images.forEach(img => {
                if (!img.hasAttribute('loading')) {
                    img.setAttribute('loading', 'lazy');
                }
            });
        }
    }

    // Service Worker registration (for offline support)
    function registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js').catch(function(error) {
                // Service worker registration failed, app will still work online
                console.log('Service Worker registration optional:', error);
            });
        }
    }

    // PWA Install Prompt
    var deferredPrompt = null;

    function isIOS() {
        return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    }

    function isInStandaloneMode() {
        return window.matchMedia('(display-mode: standalone)').matches ||
               window.navigator.standalone === true;
    }

    function initInstallPrompt() {
        var installBanner = document.getElementById('install-banner');
        var installBtn = document.getElementById('install-btn');
        var installText = document.getElementById('install-text');
        var dismissBtn = document.getElementById('install-dismiss');

        if (!installBanner) return;

        // Already installed
        if (isInStandaloneMode()) {
            return;
        }

        // User dismissed this session
        if (sessionStorage.getItem('installBannerDismissed')) {
            return;
        }

        // iOS: Show banner with manual instructions
        if (isIOS()) {
            installBanner.classList.add('visible', 'ios');
            if (installText) {
                installText.textContent = 'Tap Share then "Add to Home Screen"';
            }
            installBtn.disabled = true;
        }

        // Android/Desktop: Listen for beforeinstallprompt
        window.addEventListener('beforeinstallprompt', function(e) {
            e.preventDefault();
            deferredPrompt = e;
            installBanner.classList.add('visible');
        });

        // Handle install button click
        installBtn.addEventListener('click', function() {
            if (!deferredPrompt) return;

            deferredPrompt.prompt();
            deferredPrompt.userChoice.then(function(choiceResult) {
                if (choiceResult.outcome === 'accepted') {
                    installBanner.classList.remove('visible');
                }
                deferredPrompt = null;
            });
        });

        // Handle dismiss button
        if (dismissBtn) {
            dismissBtn.addEventListener('click', function() {
                installBanner.classList.remove('visible');
                sessionStorage.setItem('installBannerDismissed', 'true');
            });
        }

        // Hide after installed
        window.addEventListener('appinstalled', function() {
            installBanner.classList.remove('visible');
            deferredPrompt = null;
        });
    }

    // Get today's date as ISO string (YYYY-MM-DD) in local timezone
    function getTodayDateString() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        return year + '-' + month + '-' + day;
    }

    // Load checkbox states from localStorage
    function loadCheckboxStates() {
        try {
            const stored = localStorage.getItem('feedingChecks');
            if (!stored) return {};

            const data = JSON.parse(stored);
            const today = getTodayDateString();

            // If stored date doesn't match today, clear checkboxes
            if (data.date !== today) {
                localStorage.removeItem('feedingChecks');
                return {};
            }

            return data.items || {};
        } catch (e) {
            return {};
        }
    }

    // Save checkbox state to localStorage
    function saveCheckboxState(itemId, checked) {
        try {
            const stored = localStorage.getItem('feedingChecks');
            let data = stored ? JSON.parse(stored) : { date: getTodayDateString(), items: {} };

            // Ensure date is current
            data.date = getTodayDateString();
            data.items[itemId] = checked;

            localStorage.setItem('feedingChecks', JSON.stringify(data));
        } catch (e) {
            // localStorage unavailable, checkboxes still work but don't persist
        }
    }

    // Check if date has changed and clear checkboxes if needed
    function checkDateChange() {
        try {
            const stored = localStorage.getItem('feedingChecks');
            if (!stored) return;

            const data = JSON.parse(stored);
            const today = getTodayDateString();

            if (data.date !== today) {
                localStorage.removeItem('feedingChecks');
                resetAllCheckboxesUI();
            }
        } catch (e) {
            // Ignore errors
        }
    }

    // Reset all checkboxes UI without affecting other state
    function resetAllCheckboxesUI() {
        const checkboxes = document.querySelectorAll('.item-checkbox input[type="checkbox"]');
        checkboxes.forEach(function(checkbox) {
            checkbox.checked = false;
            var feedingItem = checkbox.closest('.feeding-item');
            if (feedingItem) {
                feedingItem.classList.remove('completed');
            }
        });
    }

    // Update reset button visibility based on checkbox state
    function updateResetButtonVisibility() {
        var resetBtn = document.getElementById('reset-checkboxes');
        if (!resetBtn) return;

        var checkboxes = document.querySelectorAll('.item-checkbox input[type="checkbox"]');
        var anyChecked = Array.prototype.some.call(checkboxes, function(cb) {
            return cb.checked;
        });

        if (anyChecked) {
            resetBtn.classList.add('visible');
        } else {
            resetBtn.classList.remove('visible');
        }
    }

    // Initialize reset button
    function initResetButton() {
        var resetBtn = document.getElementById('reset-checkboxes');
        if (!resetBtn) return;

        resetBtn.addEventListener('click', function() {
            localStorage.removeItem('feedingChecks');
            resetAllCheckboxesUI();
            updateResetButtonVisibility();
        });
    }

    // Initialize checkboxes with localStorage persistence
    function initCheckboxes() {
        const checkboxes = document.querySelectorAll('.item-checkbox input[type="checkbox"]');
        if (checkboxes.length === 0) return;

        // Load saved states
        const savedStates = loadCheckboxStates();

        checkboxes.forEach(function(checkbox) {
            const itemId = checkbox.getAttribute('data-item-id');
            if (!itemId) return;

            // Restore saved state
            if (savedStates[itemId]) {
                checkbox.checked = true;
                var feedingItem = checkbox.closest('.feeding-item');
                if (feedingItem) {
                    feedingItem.classList.add('completed');
                }
            }

            // Add change listener
            checkbox.addEventListener('change', function() {
                var feedingItem = this.closest('.feeding-item');
                if (feedingItem) {
                    if (this.checked) {
                        feedingItem.classList.add('completed');
                    } else {
                        feedingItem.classList.remove('completed');
                    }
                }
                saveCheckboxState(itemId, this.checked);
                updateResetButtonVisibility();

                // Haptic feedback on mobile
                if ('vibrate' in navigator) {
                    navigator.vibrate(30);
                }
            });
        });

        // Update reset button visibility based on restored state
        updateResetButtonVisibility();
    }

    // Initialize all features when DOM is ready
    function init() {
        initTabs();
        initTouchFeedback();
        initFAB();
        initKeyboardNav();
        initLazyImages();
        highlightCurrentMealTime();
        initCheckboxes();
        initResetButton();
        registerServiceWorker();
        initInstallPrompt();

        // Check meal times and date change every minute
        setInterval(function() {
            highlightCurrentMealTime();
            checkDateChange();
        }, 60000);
    }

    // Run initialization
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();