// Enhanced Features for Q4OS Website
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
        this.setupLazyLoading();
        this.setupSearchFunctionality();
        this.setupThemeToggle();
        this.setupDownloadTracker();
        this.setupNewsletterSignup();
    }

    // Scroll to Top Button
    setupScrollToTop() {
        const scrollBtn = document.createElement('button');
        scrollBtn.className = 'scroll-to-top';
        scrollBtn.innerHTML = '↑';
        scrollBtn.setAttribute('aria-label', 'Scroll to top');
        document.body.appendChild(scrollBtn);

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

    // Form Validation Enhancement
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
            const inputs = form.querySelectorAll('input, textarea');
            inputs.forEach(input => {
                input.addEventListener('blur', () => {
                    this.validateField(input);
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

        // Remove previous error styling
        field.classList.remove('is-invalid');

        if (field.hasAttribute('required') && !value) {
            isValid = false;
        } else if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
            }
        }

        if (!isValid) {
            field.classList.add('is-invalid');
        }

        return isValid;
    }

    // Notification System
    setupNotifications() {
        const container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
        this.toastContainer = container;
    }

    showNotification(message, type = 'info', duration = 5000) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type} show`;
        toast.innerHTML = `
            <div class="toast-body d-flex justify-content-between align-items-center">
                <span>${message}</span>
                <button type="button" class="btn-close" aria-label="Close"></button>
            </div>
        `;

        this.toastContainer.appendChild(toast);

        // Close button functionality
        const closeBtn = toast.querySelector('.btn-close');
        closeBtn.addEventListener('click', () => {
            this.removeToast(toast);
        });

        // Auto remove
        setTimeout(() => {
            this.removeToast(toast);
        }, duration);
    }

    removeToast(toast) {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }

    // Download Progress Bars
    setupProgressBars() {
        const downloadLinks = document.querySelectorAll('a[href*=".iso"], a[href*=".zip"], a[href*=".exe"]');
        downloadLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                this.trackDownload(link.href, link.textContent);
            });
        });
    }

    trackDownload(url, filename) {
        this.showNotification(`Starting download: ${filename}`, 'info');
        
        // Simulate download tracking (in real implementation, this would track actual download)
        const progressToast = document.createElement('div');
        progressToast.className = 'toast toast-info show';
        progressToast.innerHTML = `
            <div class="toast-body">
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <span>Downloading ${filename}</span>
                    <span class="download-percentage">0%</span>
                </div>
                <div class="progress">
                    <div class="progress-bar" role="progressbar" style="width: 0%"></div>
                </div>
            </div>
        `;

        this.toastContainer.appendChild(progressToast);

        // Simulate progress
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                setTimeout(() => {
                    this.removeToast(progressToast);
                    this.showNotification(`Download completed: ${filename}`, 'success');
                }, 1000);
            }

            const progressBar = progressToast.querySelector('.progress-bar');
            const percentage = progressToast.querySelector('.download-percentage');
            progressBar.style.width = `${progress}%`;
            percentage.textContent = `${Math.round(progress)}%`;
        }, 200);
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

    // Search Functionality
    setupSearchFunctionality() {
        const searchContainer = document.createElement('div');
        searchContainer.className = 'search-container position-relative';
        searchContainer.innerHTML = `
            <input type="text" class="form-control search-input" placeholder="Search Q4OS..." aria-label="Search">
            <div class="search-results position-absolute w-100 bg-white border rounded mt-1" style="display: none; z-index: 1000;"></div>
        `;

        // Add search to navbar
        const navbar = document.querySelector('.navbar-nav');
        if (navbar) {
            const searchItem = document.createElement('li');
            searchItem.className = 'nav-item ms-auto';
            searchItem.appendChild(searchContainer);
            navbar.appendChild(searchItem);
        }

        const searchInput = searchContainer.querySelector('.search-input');
        const searchResults = searchContainer.querySelector('.search-results');

        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            if (query.length > 2) {
                this.performSearch(query, searchResults);
            } else {
                searchResults.style.display = 'none';
            }
        });

        // Close search results when clicking outside
        document.addEventListener('click', (e) => {
            if (!searchContainer.contains(e.target)) {
                searchResults.style.display = 'none';
            }
        });
    }

    performSearch(query, resultsContainer) {
        // Simple client-side search
        const searchableElements = document.querySelectorAll('h1, h2, h3, p, a');
        const results = [];

        searchableElements.forEach(element => {
            if (element.textContent.toLowerCase().includes(query.toLowerCase())) {
                results.push({
                    text: element.textContent.substring(0, 100) + '...',
                    element: element
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
                <div class="search-result-item p-2 border-bottom cursor-pointer" data-element="${result.element.tagName}">
                    ${result.text}
                </div>
            `).join('');

            // Add click handlers
            container.querySelectorAll('.search-result-item').forEach((item, index) => {
                item.addEventListener('click', () => {
                    results[index].element.scrollIntoView({ behavior: 'smooth' });
                    container.style.display = 'none';
                });
            });
        }

        container.style.display = 'block';
    }

    // Theme Toggle
    setupThemeToggle() {
        const themeToggle = document.createElement('button');
        themeToggle.className = 'btn btn-outline-secondary theme-toggle';
        themeToggle.innerHTML = '🌙';
        themeToggle.setAttribute('aria-label', 'Toggle dark mode');

        // Add to navbar
        const navbarText = document.querySelector('.navbar-text');
        if (navbarText) {
            navbarText.appendChild(themeToggle);
        }

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
        document.querySelector('.theme-toggle').innerHTML = '☀️';
        localStorage.setItem('q4os-theme', 'dark');
    }

    enableLightMode() {
        document.body.classList.remove('dark-mode');
        document.querySelector('.theme-toggle').innerHTML = '🌙';
        localStorage.setItem('q4os-theme', 'light');
    }

    // Download Tracker
    setupDownloadTracker() {
        const downloadLinks = document.querySelectorAll('a[href*="dnt"]');
        downloadLinks.forEach(link => {
            link.addEventListener('click', () => {
                // Track download analytics
                this.trackEvent('download', {
                    file: link.href,
                    page: window.location.pathname
                });
            });
        });
    }

    trackEvent(eventName, data) {
        // Simple analytics tracking (replace with your analytics service)
        console.log(`Event: ${eventName}`, data);
        
        // Example: Send to analytics service
        // analytics.track(eventName, data);
    }

    // Newsletter Signup
    setupNewsletterSignup() {
        const newsletterHtml = `
            <div class="newsletter-signup bg-primary text-white p-4 rounded mb-4">
                <h4>Stay Updated</h4>
                <p>Get the latest Q4OS news and updates delivered to your inbox.</p>
                <form class="newsletter-form d-flex gap-2">
                    <input type="email" class="form-control" placeholder="Enter your email" required>
                    <button type="submit" class="btn btn-light">Subscribe</button>
                </form>
            </div>
        `;

        // Add newsletter signup to appropriate sections
        const contactSection = document.querySelector('#contact');
        if (contactSection) {
            const container = contactSection.querySelector('.container');
            if (container) {
                container.insertAdjacentHTML('afterbegin', newsletterHtml);
            }
        }

        // Handle newsletter form submission
        const newsletterForm = document.querySelector('.newsletter-form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const email = e.target.querySelector('input[type="email"]').value;
                this.subscribeToNewsletter(email);
            });
        }
    }

    subscribeToNewsletter(email) {
        // Simulate newsletter subscription
        this.showNotification('Thank you for subscribing to our newsletter!', 'success');
        
        // In real implementation, send to your newsletter service
        this.trackEvent('newsletter_signup', { email: email });
        
        // Clear the form
        const form = document.querySelector('.newsletter-form');
        if (form) {
            form.reset();
        }
    }
}

// Enhanced Donation System
class DonationEnhancer {
    constructor() {
        this.setupEnhancedDonation();
    }

    setupEnhancedDonation() {
        const donationForms = document.querySelectorAll('form[action*="paypal"]');
        donationForms.forEach(form => {
            this.enhanceForm(form);
        });
    }

    enhanceForm(form) {
        // Add loading state to donation buttons
        const submitBtn = form.querySelector('button[name="submit"]');
        if (submitBtn) {
            submitBtn.addEventListener('click', () => {
                if (!submitBtn.disabled) {
                    submitBtn.innerHTML = '<span class="loading"></span> Processing...';
                    submitBtn.disabled = true;
                    
                    // Re-enable after a delay (in case of errors)
                    setTimeout(() => {
                        submitBtn.innerHTML = 'Donate';
                        submitBtn.disabled = false;
                    }, 5000);
                }
            });
        }

        // Add donation amount validation
        const amountInputs = form.querySelectorAll('input[type="number"]');
        amountInputs.forEach(input => {
            input.addEventListener('input', (e) => {
                const value = parseFloat(e.target.value);
                if (value < 0) {
                    e.target.value = 0;
                } else if (value > 10000) {
                    e.target.value = 10000;
                    new Q4OSEnhancer().showNotification('Maximum donation amount is $10,000', 'info');
                }
            });
        });
    }
}

// Performance Monitor
class PerformanceMonitor {
    constructor() {
        this.setupPerformanceTracking();
    }

    setupPerformanceTracking() {
        // Track page load performance
        window.addEventListener('load', () => {
            setTimeout(() => {
                const perfData = performance.getEntriesByType('navigation')[0];
                this.trackPerformance(perfData);
            }, 0);
        });
    }

    trackPerformance(perfData) {
        const metrics = {
            loadTime: perfData.loadEventEnd - perfData.loadEventStart,
            domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
            firstPaint: this.getFirstPaint(),
            pageSize: this.getPageSize()
        };

        console.log('Performance Metrics:', metrics);
        
        // Send to analytics if needed
        // analytics.track('page_performance', metrics);
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

// Initialize all enhancements when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new Q4OSEnhancer();
    new DonationEnhancer();
    new PerformanceMonitor();
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