/* ===================================
   Liuyang Fanranwo Trading Co., Ltd.
   Animations JavaScript
   Scroll Reveal & Interactive Animations
   =================================== */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // Intersection Observer for Scroll Reveal Animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                
                // Add animation delay if specified
                const delay = element.dataset.delay || 0;
                
                setTimeout(() => {
                    element.classList.add('active');
                    
                    // Add staggered animation for child elements
                    const staggerChildren = element.querySelectorAll('[data-stagger]');
                    staggerChildren.forEach((child, index) => {
                        setTimeout(() => {
                            child.style.opacity = '1';
                            child.style.transform = 'translateY(0)';
                        }, index * 100);
                    });
                }, delay);
                
                // Unobserve after animation
                observer.unobserve(element);
            }
        });
    }, observerOptions);

    // Observe all reveal elements
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-rotate');
    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

    // Staggered Animation for Grid Items
    function animateGridItems() {
        const grids = document.querySelectorAll('.services-grid, .news-grid, .team-grid, .features-grid');
        
        grids.forEach(grid => {
            const items = grid.querySelectorAll('.service-card, .news-card, .team-card, .feature-card');
            
            const gridObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const gridItems = entry.target.querySelectorAll(':scope > *');
                        gridItems.forEach((item, index) => {
                            setTimeout(() => {
                                item.style.opacity = '1';
                                item.style.transform = 'translateY(0)';
                            }, index * 100);
                        });
                        gridObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });
            
            gridObserver.observe(grid);
        });
    }

    animateGridItems();

    // Counter Animation with Intersection Observer
    function setupCounterAnimations() {
        const counters = document.querySelectorAll('[data-counter]');
        
        const counterObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseInt(counter.dataset.counter);
                    const duration = parseInt(counter.dataset.duration) || 2000;
                    const suffix = counter.dataset.suffix || '';
                    const prefix = counter.dataset.prefix || '';
                    
                    animateValue(counter, 0, target, duration, prefix, suffix);
                    observer.unobserve(counter);
                }
            });
        }, { threshold: 0.5 });
        
        counters.forEach(counter => {
            counter.style.opacity = '0';
            counter.style.transform = 'translateY(20px)';
            counter.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            counterObserver.observe(counter);
        });
    }

    function animateValue(element, start, end, duration, prefix = '', suffix = '') {
        const startTime = performance.now();
        
        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = Math.floor(easeOutQuart * (end - start) + start);
            
            element.textContent = prefix + current.toLocaleString() + suffix;
            
            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                element.textContent = prefix + end.toLocaleString() + suffix;
            }
        }
        
        requestAnimationFrame(update);
    }

    setupCounterAnimations();

    // Parallax Effect
    function setupParallax() {
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            
            parallaxElements.forEach(element => {
                const speed = parseFloat(element.dataset.parallax) || 0.5;
                const yPos = -(scrolled * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
        });
    }

    setupParallax();

    // Mouse Move Effect for Hero Section
    function setupMouseMoveEffect() {
        const heroSection = document.querySelector('.hero');
        if (!heroSection) return;
        
        const heroContent = heroSection.querySelector('.hero-content');
        
        heroSection.addEventListener('mousemove', (e) => {
            const rect = heroSection.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            
            if (heroContent) {
                heroContent.style.transform = `translate(${x * 20}px, ${y * 20}px)`;
            }
        });
        
        heroSection.addEventListener('mouseleave', () => {
            if (heroContent) {
                heroContent.style.transform = 'translate(0, 0)';
            }
        });
    }

    setupMouseMoveEffect();

    // Card 3D Tilt Effect
    function setup3DTiltEffect() {
        const cards = document.querySelectorAll('[data-tilt]');
        
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
            });
        });
    }

    setup3DTiltEffect();

    // Typing Animation
    function setupTypingAnimation() {
        const typingElements = document.querySelectorAll('[data-typing]');
        
        typingElements.forEach(element => {
            const text = element.dataset.typing;
            const speed = parseInt(element.dataset.speed) || 100;
            
            element.textContent = '';
            let index = 0;
            
            function type() {
                if (index < text.length) {
                    element.textContent += text.charAt(index);
                    index++;
                    setTimeout(type, speed);
                }
            }
            
            // Start typing when element is in view
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        type();
                        observer.unobserve(element);
                    }
                });
            }, { threshold: 0.5 });
            
            observer.observe(element);
        });
    }

    setupTypingAnimation();

    // Magnetic Button Effect
    function setupMagneticButtons() {
        const buttons = document.querySelectorAll('[data-magnetic]');
        
        buttons.forEach(button => {
            button.addEventListener('mousemove', (e) => {
                const rect = button.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                button.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.transform = 'translate(0, 0)';
            });
        });
    }

    setupMagneticButtons();

    // Ripple Effect
    function setupRippleEffect() {
        const buttons = document.querySelectorAll('.btn, [data-ripple]');
        
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                const rect = button.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const ripple = document.createElement('span');
                ripple.className = 'ripple';
                ripple.style.cssText = `
                    position: absolute;
                    width: 0;
                    height: 0;
                    background: rgba(255, 255, 255, 0.3);
                    border-radius: 50%;
                    transform: scale(0);
                    animation: rippleEffect 0.6s linear;
                    pointer-events: none;
                    left: ${x}px;
                    top: ${y}px;
                `;
                
                button.style.position = 'relative';
                button.style.overflow = 'hidden';
                button.appendChild(ripple);
                
                setTimeout(() => ripple.remove(), 600);
            });
        });
    }

    setupRippleEffect();

    // Progress Bar Animation
    function setupProgressBars() {
        const progressBars = document.querySelectorAll('[data-progress]');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const bar = entry.target;
                    const progress = bar.dataset.progress;
                    
                    setTimeout(() => {
                        bar.style.width = progress + '%';
                    }, 100);
                    
                    observer.unobserve(bar);
                }
            });
        }, { threshold: 0.5 });
        
        progressBars.forEach(bar => {
            bar.style.width = '0';
            observer.observe(bar);
        });
    }

    setupProgressBars();

    // Image Reveal Animation
    function setupImageReveal() {
        const images = document.querySelectorAll('[data-reveal-image]');
        
        images.forEach(container => {
            const img = container.querySelector('img');
            if (!img) return;
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        container.classList.add('revealed');
                        observer.unobserve(container);
                    }
                });
            }, { threshold: 0.3 });
            
            observer.observe(container);
        });
    }

    setupImageReveal();

    // Text Split Animation
    function setupTextSplit() {
        const textElements = document.querySelectorAll('[data-split-text]');
        
        textElements.forEach(element => {
            const text = element.textContent;
            const words = text.split(' ');
            
            element.innerHTML = words.map((word, index) => `
                <span class="split-word" style="animation-delay: ${index * 0.1}s">
                    ${word}
                </span>
            `).join(' ');
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const spans = entry.target.querySelectorAll('.split-word');
                        spans.forEach((span, index) => {
                            setTimeout(() => {
                                span.classList.add('active');
                            }, index * 50);
                        });
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });
            
            observer.observe(element);
        });
    }

    setupTextSplit();

    // Scroll-Linked Animation
    function setupScrollAnimation() {
        const animatedSections = document.querySelectorAll('[data-scroll-animate]');
        
        animatedSections.forEach(section => {
            const elements = section.querySelectorAll('[data-scroll-item]');
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const scrollPercent = (entry.target.getBoundingClientRect().top / window.innerHeight);
                        const progress = 1 - (scrollPercent + 0.5);
                        
                        elements.forEach((el, index) => {
                            const y = (1 - progress) * (50 + index * 20);
                            const opacity = Math.min(Math.max(progress, 0), 1);
                            
                            el.style.transform = `translateY(${y}px)`;
                            el.style.opacity = opacity;
                        });
                    }
                });
            }, { threshold: 0 });
            
            observer.observe(section);
        });
    }

    setupScrollAnimation();

    // Number Counting Animation
    function setupNumberCounting() {
        const numberElements = document.querySelectorAll('[data-count-number]');
        
        numberElements.forEach(element => {
            const target = parseInt(element.dataset.countNumber);
            const duration = parseInt(element.dataset.countDuration) || 2000;
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        let start = 0;
                        const increment = target / (duration / 16);
                        
                        function updateNumber() {
                            start += increment;
                            if (start < target) {
                                element.textContent = Math.floor(start);
                                requestAnimationFrame(updateNumber);
                            } else {
                                element.textContent = target;
                            }
                        }
                        
                        updateNumber();
                        observer.unobserve(element);
                    }
                });
            }, { threshold: 0.5 });
            
            observer.observe(element);
        });
    }

    setupNumberCounting();

    // Add CSS for ripple animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes rippleEffect {
            to {
                width: 300px;
                height: 300px;
                margin-left: -150px;
                margin-top: -150px;
                opacity: 0;
            }
        }
        
        .split-word {
            display: inline-block;
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.5s ease, transform 0.5s ease;
        }
        
        .split-word.active {
            opacity: 1;
            transform: translateY(0);
        }
        
        [data-reveal-image] {
            overflow: hidden;
        }
        
        [data-reveal-image] img {
            transform: scale(1.2);
            transition: transform 1s ease;
        }
        
        [data-reveal-image].revealed img {
            transform: scale(1);
        }
        
        [data-tilt] {
            transition: transform 0.1s ease;
            transform-style: preserve-3d;
        }
    `;
    document.head.appendChild(style);

    console.log('Animations initialized successfully');
});

// Throttle utility for performance
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}