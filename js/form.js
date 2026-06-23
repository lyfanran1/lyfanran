/* ===================================
   Liuyang Fanranwo Trading Co., Ltd.
   Form Validation & Handling
   =================================== */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // Form Validation Configuration
    const validationRules = {
        name: {
            required: true,
            minLength: 2,
            maxLength: 100,
            pattern: /^[a-zA-Z\s'-]+$/,
            message: 'Please enter a valid name'
        },
        email: {
            required: true,
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Please enter a valid email address'
        },
        phone: {
            required: false,
            pattern: /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,4}[-\s\.]?[0-9]{1,9}$/,
            message: 'Please enter a valid phone number'
        },
        company: {
            required: false,
            maxLength: 200,
            message: 'Company name is too long'
        },
        subject: {
            required: true,
            minLength: 5,
            maxLength: 200,
            message: 'Please enter a subject (at least 5 characters)'
        },
        message: {
            required: true,
            minLength: 20,
            maxLength: 5000,
            message: 'Please enter a message (at least 20 characters)'
        },
        inquiryType: {
            required: true,
            message: 'Please select an inquiry type'
        },
        country: {
            required: true,
            message: 'Please select your country'
        }
    };

    // Error Messages
    const errorMessages = {
        required: 'This field is required',
        minLength: 'Minimum length not met',
        maxLength: 'Maximum length exceeded',
        pattern: 'Invalid format',
        email: 'Please enter a valid email address',
        phone: 'Please enter a valid phone number'
    };

    // Validate Single Field
    function validateField(field, rules) {
        const value = field.value.trim();
        const errors = [];

        if (rules.required && !value) {
            errors.push(errorMessages.required);
        }

        if (value) {
            if (rules.minLength && value.length < rules.minLength) {
                errors.push(`${errorMessages.minLength} (minimum ${rules.minLength} characters)`);
            }

            if (rules.maxLength && value.length > rules.maxLength) {
                errors.push(`${errorMessages.maxLength} (maximum ${rules.maxLength} characters)`);
            }

            if (rules.pattern && !rules.pattern.test(value)) {
                errors.push(rules.message || errorMessages.pattern);
            }
        }

        return errors;
    }

    // Show Field Error
    function showFieldError(field, errors) {
        const formGroup = field.closest('.form-group');
        if (!formGroup) return;

        // Remove existing error
        const existingError = formGroup.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }

        // Add error class
        field.classList.add('error');
        field.classList.remove('valid');

        if (errors.length > 0) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'field-error';
            errorDiv.textContent = errors[0];
            errorDiv.style.cssText = `
                color: #fc8181;
                font-size: 0.875rem;
                margin-top: 0.5rem;
                display: flex;
                align-items: center;
                gap: 0.5rem;
            `;
            
            // Add error icon
            const icon = document.createElement('span');
            icon.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>`;
            errorDiv.insertBefore(icon, errorDiv.firstChild);
            
            formGroup.appendChild(errorDiv);

            // Add shake animation
            field.style.animation = 'shake 0.5s ease';
            setTimeout(() => {
                field.style.animation = '';
            }, 500);
        }
    }

    // Show Field Success
    function showFieldSuccess(field) {
        const formGroup = field.closest('.form-group');
        if (!formGroup) return;

        // Remove existing error
        const existingError = formGroup.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }

        // Add success class
        field.classList.remove('error');
        field.classList.add('valid');
    }

    // Initialize Form Validation
    function initializeFormValidation() {
        const forms = document.querySelectorAll('form[data-validate]');
        
        forms.forEach(form => {
            const fields = form.querySelectorAll('input, textarea, select');
            
            fields.forEach(field => {
                const fieldName = field.name || field.id;
                const rules = validationRules[fieldName];
                
                if (!rules) return;

                // Real-time validation
                field.addEventListener('blur', function() {
                    const errors = validateField(this, rules);
                    if (errors.length > 0) {
                        showFieldError(this, errors);
                    } else {
                        showFieldSuccess(this);
                    }
                });

                // Clear error on input
                field.addEventListener('input', function() {
                    if (this.classList.contains('error')) {
                        const errors = validateField(this, rules);
                        if (errors.length === 0) {
                            showFieldSuccess(this);
                        }
                    }
                });

                // For select fields, validate on change
                if (field.tagName === 'SELECT') {
                    field.addEventListener('change', function() {
                        const errors = validateField(this, rules);
                        if (errors.length > 0) {
                            showFieldError(this, errors);
                        } else {
                            showFieldSuccess(this);
                        }
                    });
                }
            });

            // Form submission
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                
                let isValid = true;
                const formData = new FormData(this);
                const data = Object.fromEntries(formData.entries());
                
                fields.forEach(field => {
                    const fieldName = field.name || field.id;
                    const rules = validationRules[fieldName];
                    
                    if (rules) {
                        const errors = validateField(field, rules);
                        if (errors.length > 0) {
                            isValid = false;
                            showFieldError(field, errors);
                        } else {
                            showFieldSuccess(field);
                        }
                    }
                });

                if (isValid) {
                    // Show loading state
                    const submitBtn = this.querySelector('button[type="submit"]');
                    const originalText = submitBtn.textContent;
                    submitBtn.textContent = 'Sending...';
                    submitBtn.disabled = true;

                    // Simulate form submission (replace with actual API call)
                    setTimeout(() => {
                        submitBtn.textContent = originalText;
                        submitBtn.disabled = false;
                        
                        // Show success message
                        showNotification('Thank you! Your message has been sent successfully. We will get back to you within 24 hours.', 'success');
                        
                        // Reset form
                        this.reset();
                        fields.forEach(field => {
                            field.classList.remove('valid');
                        });

                        // Dispatch custom event
                        const event = new CustomEvent('formSubmitted', { detail: data });
                        this.dispatchEvent(event);
                    }, 1500);
                } else {
                    showNotification('Please correct the errors in the form before submitting.', 'error');
                    
                    // Focus first error field
                    const firstError = this.querySelector('.error');
                    if (firstError) {
                        firstError.focus();
                    }
                }
            });
        });
    }

    initializeFormValidation();

    // Newsletter Form
    function initializeNewsletterForm() {
        const newsletterForms = document.querySelectorAll('.newsletter-form');
        
        newsletterForms.forEach(form => {
            const emailInput = form.querySelector('input[type="email"]');
            const submitBtn = form.querySelector('button[type="submit"]');
            
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const email = emailInput.value.trim();
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                
                if (!email) {
                    showNotification('Please enter your email address', 'error');
                    return;
                }
                
                if (!emailRegex.test(email)) {
                    showNotification('Please enter a valid email address', 'error');
                    return;
                }
                
                // Show loading
                const originalText = submitBtn.textContent;
                submitBtn.textContent = 'Subscribing...';
                submitBtn.disabled = true;
                
                // Simulate subscription (replace with actual API call)
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    
                    showNotification('Thank you for subscribing to our newsletter!', 'success');
                    emailInput.value = '';
                }, 1000);
            });
        });
    }

    initializeNewsletterForm();

    // Search Form
    function initializeSearchForm() {
        const searchForms = document.querySelectorAll('.search-form');
        
        searchForms.forEach(form => {
            const searchInput = form.querySelector('input[type="search"]');
            const submitBtn = form.querySelector('button[type="submit"]');
            
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const query = searchInput.value.trim();
                
                if (!query) {
                    showNotification('Please enter a search term', 'error');
                    return;
                }
                
                if (query.length < 3) {
                    showNotification('Search term must be at least 3 characters', 'error');
                    return;
                }
                
                // Simulate search (replace with actual search functionality)
                showNotification(`Searching for "${query}"...`, 'success');
            });
        });
    }

    initializeSearchForm();

    // Contact Form Specific Validation
    function initializeContactForm() {
        const contactForm = document.querySelector('.contact-form');
        
        if (contactForm) {
            // Add phone number formatting
            const phoneInput = contactForm.querySelector('input[name="phone"]');
            if (phoneInput) {
                phoneInput.addEventListener('input', function(e) {
                    let value = e.target.value.replace(/\D/g, '');
                    
                    if (value.length > 0) {
                        if (value.length <= 3) {
                            value = value;
                        } else if (value.length <= 6) {
                            value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
                        } else if (value.length <= 10) {
                            value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6)}`;
                        } else {
                            value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
                        }
                    }
                    
                    e.target.value = value;
                });
            }

            // Add character counter for message
            const messageInput = contactForm.querySelector('textarea[name="message"]');
            if (messageInput) {
                const maxLength = messageInput.getAttribute('maxlength') || 5000;
                
                const counter = document.createElement('div');
                counter.className = 'char-counter';
                counter.style.cssText = `
                    text-align: right;
                    font-size: 0.75rem;
                    color: #718096;
                    margin-top: 0.25rem;
                `;
                
                messageInput.parentNode.appendChild(counter);
                
                function updateCounter() {
                    const current = messageInput.value.length;
                    counter.textContent = `${current} / ${maxLength}`;
                    
                    if (current > maxLength * 0.9) {
                        counter.style.color = '#ed8936';
                    } else {
                        counter.style.color = '#718096';
                    }
                }
                
                messageInput.addEventListener('input', updateCounter);
                updateCounter();
            }
        }
    }

    initializeContactForm();

    // Add form input focus animations
    const formInputs = document.querySelectorAll('.form-group input, .form-group textarea, .form-group select');
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.closest('.form-group').classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            this.closest('.form-group').classList.remove('focused');
        });
    });

    console.log('Form validation initialized successfully');
});

// Global notification function
function showNotification(message, type) {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 1rem 2rem;
        border-radius: 10px;
        background: ${type === 'success' ? '#48bb78' : type === 'error' ? '#fc8181' : '#4299e1'};
        color: white;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        z-index: 9999;
        animation: slideInRight 0.5s ease;
        display: flex;
        align-items: center;
        gap: 1rem;
        max-width: 400px;
    `;
    
    document.body.appendChild(notification);
    
    // Close button
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        line-height: 1;
    `;
    
    closeBtn.addEventListener('click', () => {
        notification.style.animation = 'slideOutRight 0.5s ease forwards';
        setTimeout(() => notification.remove(), 500);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.5s ease forwards';
            setTimeout(() => notification.remove(), 500);
        }
    }, 5000);
}