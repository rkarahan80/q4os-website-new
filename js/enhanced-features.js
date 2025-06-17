// Enhanced Features for Q4OS Website with Bootstrap 5.3.6
class Q4OSEnhancer {
    constructor() {
        this.init();
    }

    init() {
        this.setupScrollToTop();
        this.setupSmoothScrolling();
        this.setupFormValidation();
        this.setupNotifications();
        this.setupProgressBars();
        this.setupSearchFunctionality();
        this.setupThemeToggle();
        this.setupDownloadTracker();
        this.setupNewsletterSignup();
        this.setupDonationSystem();
        this.setupNavbarScroll();
        this.setupCopyToClipboard();
        this.setupLazyLoading();
        this.setupAnimations();
    }

    // Scroll to Top Button
    setupScrollToTop() {
        let scrollBtn = document.querySelector('.scroll-to-top');
        if (!scrollBtn) {
            scrollBtn = document.createElement('button');
            scrollBtn.className = 'scroll-to-top';
            scrollBtn.innerHTML = '<i class="bi bi-arrow-up"></i>';
            scrollBtn.setAttribute('aria-label', 'Scroll to top');
            document.body.appendChild(scrollBtn);
        }

        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                scrollBtn.classList.add('visible');
            } else {
                scrollBtn.classList.remove('visible');
            }
        });

        scrollBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Enhanced Smooth Scrolling
    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // Navbar Scroll Effect
    setupNavbarScroll() {
        const navbar = document.getElementById('navbar');
        if (!navbar) return;

        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // Enhanced Form Validation
    setupFormValidation() {
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                if (!this.validateForm(form)) {
                    e.preventDefault();
                    this.showNotification('Please fill in all required fields correctly.', 'error');
                }
            });

            // Real-time validation
            const inputs = form.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                input.addEventListener('blur', () => {
                    this.validateField(input);
                });

                input.addEventListener('input', () => {
                    if (input.classList.contains('is-invalid')) {
                        this.validateField(input);
                    }
                });
            });
        });
    }

    validateForm(form) {
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        return isValid;
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;

        // Remove previous validation classes
        field.classList.remove('is-invalid', 'is-valid');

        if (field.hasAttribute('required') && !value) {
            isValid = false;
        } else if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
            }
        } else if (field.type === 'number' && value) {
            const numValue = parseFloat(value);
            const min = parseFloat(field.getAttribute('min'));
            const max = parseFloat(field.getAttribute('max'));
            
            if (isNaN(numValue) || (min && numValue < min) || (max && numValue > max)) {
                isValid = false;
            }
        }

        if (isValid && value) {
            field.classList.add('is-valid');
        } else if (!isValid) {
            field.classList.add('is-invalid');
        }

        return isValid;
    }

    // Enhanced Notification System
    setupNotifications() {
        let container = document.querySelector('.toast-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'toast-container position-fixed top-0 end-0 p-3';
            document.body.appendChild(container);
        }
        this.toastContainer = container;
    }

    showNotification(message, type = 'info', duration = 5000) {
        const toastId = 'toast-' + Date.now();
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.id = toastId;
        toast.setAttribute('role', 'alert');
        toast.setAttribute('aria-live', 'assertive');
        toast.setAttribute('aria-atomic', 'true');
        
        const iconMap = {
            success: 'check-circle-fill',
            error: 'exclamation-triangle-fill',
            warning: 'exclamation-triangle-fill',
            info: 'info-circle-fill'
        };

        toast.innerHTML = `
            <div class="toast-header">
                <i class="bi bi-${iconMap[type]} me-2"></i>
                <strong class="me-auto">${type.charAt(0).toUpperCase() + type.slice(1)}</strong>
                <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body">
                ${message}
            </div>
        `;

        this.toastContainer.appendChild(toast);

        // Initialize Bootstrap toast
        const bsToast = new bootstrap.Toast(toast, {
            delay: duration
        });
        
        bsToast.show();

        // Remove from DOM after hiding
        toast.addEventListener('hidden.bs.toast', () => {
            toast.remove();
        });
    }

    // Download Progress Tracking
    setupProgressBars() {
        const downloadLinks = document.querySelectorAll('.download-btn');
        downloadLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const filename = link.getAttribute('data-file') || 'Q4OS';
                this.trackDownload(link.href, filename, link);
            });
        });
    }

    trackDownload(url, filename, linkElement) {
        this.showNotification(`Starting download: ${filename}`, 'info');
        
        // Find progress container in the same card
        const card = linkElement.closest('.card');
        const progressContainer = card?.querySelector('.download-progress');
        
        if (progressContainer) {
            progressContainer.style.display = 'block';
            progressContainer.classList.add('show');
            
            const progressBar = progressContainer.querySelector('.progress-bar');
            let progress = 0;
            
            const interval = setInterval(() => {
                progress += Math.random() * 15;
                if (progress >= 100) {
                    progress = 100;
                    clearInterval(interval);
                    setTimeout(() => {
                        progressContainer.classList.remove('show');
                        setTimeout(() => {
                            progressContainer.style.display = 'none';
                        }, 300);
                        this.showNotification(`Download completed: ${filename}`, 'success');
                    }, 1000);
                }

                if (progressBar) {
                    progressBar.style.width = `${progress}%`;
                    progressBar.setAttribute('aria-valuenow', progress);
                }
            }, 200);
        }

        // Analytics tracking
        this.trackEvent('download', {
            file: filename,
            url: url,
            page: window.location.pathname
        });
    }

    // Search Functionality
    setupSearchFunctionality() {
        const searchInput = document.querySelector('.search-input');
        const searchResults = document.querySelector('.search-results');

        if (!searchInput || !searchResults) return;

        let searchTimeout;

        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            const query = e.target.value.trim();
            
            if (query.length > 2) {
                searchTimeout = setTimeout(() => {
                    this.performSearch(query, searchResults);
                }, 300);
            } else {
                searchResults.style.display = 'none';
            }
        });

        // Close search results when clicking outside
        document.addEventListener('click', (e) => {
            if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
                searchResults.style.display = 'none';
            }
        });
    }

    performSearch(query, resultsContainer) {
        const searchableElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, .card-title, .card-text');
        const results = [];

        searchableElements.forEach(element => {
            const text = element.textContent.toLowerCase();
            if (text.includes(query.toLowerCase())) {
                results.push({
                    text: element.textContent.substring(0, 100) + (element.textContent.length > 100 ? '...' : ''),
                    element: element,
                    type: element.tagName.toLowerCase()
                });
            }
        });

        this.displaySearchResults(results.slice(0, 5), resultsContainer);
    }

    displaySearchResults(results, container) {
        if (results.length === 0) {
            container.innerHTML = '<div class="p-3 text-muted">No results found</div>';
        } else {
            container.innerHTML = results.map(result => `
                <div class="search-result-item" data-type="${result.type}">
                    <div class="fw-medium">${result.text}</div>
                    <small class="text-muted">${result.type.toUpperCase()}</small>
                </div>
            `).join('');

            // Add click handlers
            container.querySelectorAll('.search-result-item').forEach((item, index) => {
                item.addEventListener('click', () => {
                    results[index].element.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'center'
                    });
                    container.style.display = 'none';
                    
                    // Highlight the found element
                    const element = results[index].element;
                    element.style.background = 'rgba(25, 118, 210, 0.1)';
                    setTimeout(() => {
                        element.style.background = '';
                    }, 2000);
                });
            });
        }

        container.style.display = 'block';
    }

    // Theme Toggle
    setupThemeToggle() {
        const themeToggle = document.querySelector('.theme-toggle');
        if (!themeToggle) return;

        themeToggle.addEventListener('click', () => {
            this.toggleTheme();
        });

        // Check for saved theme preference
        const savedTheme = localStorage.getItem('q4os-theme');
        if (savedTheme === 'dark') {
            this.enableDarkMode();
        }
    }

    toggleTheme() {
        const body = document.body;
        const isDark = body.classList.contains('dark-mode');

        if (isDark) {
            this.enableLightMode();
        } else {
            this.enableDarkMode();
        }
    }

    enableDarkMode() {
        document.body.classList.add('dark-mode');
        const themeToggle = document.querySelector('.theme-toggle i');
        if (themeToggle) {
            themeToggle.className = 'bi bi-sun-fill';
        }
        localStorage.setItem('q4os-theme', 'dark');
    }

    enableLightMode() {
        document.body.classList.remove('dark-mode');
        const themeToggle = document.querySelector('.theme-toggle i');
        if (themeToggle) {
            themeToggle.className = 'bi bi-moon-fill';
        }
        localStorage.setItem('q4os-theme', 'light');
    }

    // Enhanced Donation System
    setupDonationSystem() {
        // Main donation form
        this.setupDonationForm('donationForm', 'amount', 'donateBtn');
        
        // Modal donation form
        this.setupDonationForm('modalDonationForm', 'modalAmount', 'modalDonateBtn');
    }

    setupDonationForm(formId, amountFieldId, buttonId) {
        const form = document.getElementById(formId);
        const amountField = document.getElementById(amountFieldId);
        const donateBtn = document.getElementById(buttonId);
        
        if (!form || !amountField || !donateBtn) return;

        const donationBtns = form.querySelectorAll('.donation-btn, .modal-donation-btn');
        const customAmountInput = form.querySelector('input[type="number"]');

        let selectedAmount = 0;

        // Handle preset amount buttons
        donationBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Remove active class from all buttons
                donationBtns.forEach(b => b.classList.remove('active'));
                
                // Add active class to clicked button
                btn.classList.add('active');
                
                // Set amount
                selectedAmount = parseInt(btn.getAttribute('data-amount'));
                amountField.value = selectedAmount;
                
                // Clear custom input
                if (customAmountInput) {
                    customAmountInput.value = '';
                }
                
                // Enable donate button
                donateBtn.disabled = false;
                donateBtn.classList.remove('disabled');
            });
        });

        // Handle custom amount input
        if (customAmountInput) {
            customAmountInput.addEventListener('input', (e) => {
                const value = parseInt(e.target.value);
                
                // Remove active class from preset buttons
                donationBtns.forEach(btn => btn.classList.remove('active'));
                
                if (value && value > 0) {
                    selectedAmount = value;
                    amountField.value = selectedAmount;
                    donateBtn.disabled = false;
                    donateBtn.classList.remove('disabled');
                } else {
                    selectedAmount = 0;
                    amountField.value = '';
                    donateBtn.disabled = true;
                    donateBtn.classList.add('disabled');
                }
            });
        }

        // Handle form submission
        form.addEventListener('submit', (e) => {
            if (selectedAmount <= 0) {
                e.preventDefault();
                this.showNotification('Please select a donation amount.', 'warning');
                return;
            }

            // Show loading state
            const originalText = donateBtn.innerHTML;
            donateBtn.innerHTML = '<span class="loading"></span> Processing...';
            donateBtn.disabled = true;

            // Track donation attempt
            this.trackEvent('donation_attempt', {
                amount: selectedAmount,
                page: window.location.pathname
            });

            // Re-enable after delay (in case of errors)
            setTimeout(() => {
                donateBtn.innerHTML = originalText;
                donateBtn.disabled = false;
            }, 5000);
        });
    }

    // Newsletter Signup
    setupNewsletterSignup() {
        const newsletterForm = document.getElementById('newsletterForm');
        if (!newsletterForm) return;

        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = e.target.querySelector('input[type="email"]');
            const email = emailInput.value.trim();

            if (this.validateEmail(email)) {
                this.subscribeToNewsletter(email);
                emailInput.value = '';
            } else {
                this.showNotification('Please enter a valid email address.', 'error');
            }
        });
    }

    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    subscribeToNewsletter(email) {
        this.showNotification('Thank you for subscribing to our newsletter!', 'success');
        this.trackEvent('newsletter_signup', { email: email });
    }

    // Copy to Clipboard
    setupCopyToClipboard() {
        const copyButtons = document.querySelectorAll('.copy-hash');
        
        copyButtons.forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.preventDefault();
                const hash = btn.getAttribute('data-hash');
                
                try {
                    await navigator.clipboard.writeText(hash);
                    
                    // Visual feedback
                    const originalText = btn.textContent;
                    btn.textContent = 'Copied!';
                    btn.classList.add('copied');
                    
                    setTimeout(() => {
                        btn.textContent = originalText;
                        btn.classList.remove('copied');
                    }, 2000);
                    
                    this.showNotification('Hash copied to clipboard!', 'success', 2000);
                } catch (err) {
                    this.showNotification('Failed to copy hash.', 'error');
                }
            });
        });
    }

    // Lazy Loading for Images
    setupLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });

            images.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback for older browsers
            images.forEach(img => {
                img.src = img.dataset.src;
            });
        }
    }

    // Animations
    setupAnimations() {
        if ('IntersectionObserver' in window) {
            const animationObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('fade-in-up');
                        animationObserver.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.1
            });

            // Animate cards and sections
            document.querySelectorAll('.card, .alert, .hero').forEach(el => {
                animationObserver.observe(el);
            });
        }
    }

    // Analytics Tracking
    trackEvent(eventName, data) {
        console.log(`Event: ${eventName}`, data);
        
        // Google Analytics 4 example
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, data);
        }
        
        // Custom analytics service example
        // analytics.track(eventName, data);
    }
}

// Performance Monitor
class PerformanceMonitor {
    constructor() {
        this.setupPerformanceTracking();
    }

    setupPerformanceTracking() {
        window.addEventListener('load', () => {
            setTimeout(() => {
                this.trackPagePerformance();
            }, 0);
        });
    }

    trackPagePerformance() {
        if ('performance' in window) {
            const perfData = performance.getEntriesByType('navigation')[0];
            const metrics = {
                loadTime: perfData.loadEventEnd - perfData.loadEventStart,
                domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
                firstPaint: this.getFirstPaint(),
                pageSize: this.getPageSize()
            };

            console.log('Performance Metrics:', metrics);
            
            // Send to analytics if needed
            if (typeof gtag !== 'undefined') {
                gtag('event', 'page_performance', metrics);
            }
        }
    }

    getFirstPaint() {
        const paintEntries = performance.getEntriesByType('paint');
        const firstPaint = paintEntries.find(entry => entry.name === 'first-paint');
        return firstPaint ? firstPaint.startTime : null;
    }

    getPageSize() {
        const resources = performance.getEntriesByType('resource');
        return resources.reduce((total, resource) => total + (resource.transferSize || 0), 0);
    }
}

// Accessibility Enhancements
class AccessibilityEnhancer {
    constructor() {
        this.setupKeyboardNavigation();
        this.setupFocusManagement();
        this.setupScreenReaderSupport();
    }

    setupKeyboardNavigation() {
        // Escape key to close modals and dropdowns
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                // Close search results
                const searchResults = document.querySelector('.search-results');
                if (searchResults) {
                    searchResults.style.display = 'none';
                }
            }
        });
    }

    setupFocusManagement() {
        // Ensure focus is visible
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
    }

    setupScreenReaderSupport() {
        // Add aria-labels to interactive elements without text
        document.querySelectorAll('button:not([aria-label]):not([aria-labelledby])').forEach(btn => {
            if (!btn.textContent.trim()) {
                const icon = btn.querySelector('i');
                if (icon) {
                    const iconClass = icon.className;
                    if (iconClass.includes('search')) {
                        btn.setAttribute('aria-label', 'Search');
                    } else if (iconClass.includes('close')) {
                        btn.setAttribute('aria-label', 'Close');
                    } else if (iconClass.includes('menu')) {
                        btn.setAttribute('aria-label', 'Menu');
                    }
                }
            }
        });
    }
}

// Initialize all enhancements when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new Q4OSEnhancer();
    new PerformanceMonitor();
    new AccessibilityEnhancer();
});

// Service Worker Registration for PWA capabilities
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Export for use in other modules
window.Q4OSEnhancer = Q4OSEnhancer;