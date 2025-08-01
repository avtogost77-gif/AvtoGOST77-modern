// ========================================
// Animations and Effects
// ========================================

// Particle system for hero background
class ParticleSystem {
    constructor() {
        this.canvas = this.createCanvas();
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.maxParticles = 50;
        
        this.init();
        this.animate();
        
        window.addEventListener('resize', () => this.resize());
    }
    
    createCanvas() {
        const container = document.getElementById('particles');
        if (!container) return null;
        
        const canvas = document.createElement('canvas');
        container.appendChild(canvas);
        return canvas;
    }
    
    init() {
        if (!this.canvas) return;
        
        this.resize();
        
        // Create particles
        for (let i = 0; i < this.maxParticles; i++) {
            this.particles.push(this.createParticle());
        }
    }
    
    resize() {
        if (!this.canvas) return;
        
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createParticle() {
        return {
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            size: Math.random() * 3 + 1,
            opacity: Math.random() * 0.5 + 0.2
        };
    }
    
    updateParticle(particle) {
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        // Wrap around edges
        if (particle.x < 0) particle.x = this.canvas.width;
        if (particle.x > this.canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = this.canvas.height;
        if (particle.y > this.canvas.height) particle.y = 0;
    }
    
    drawParticle(particle) {
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`;
        this.ctx.fill();
    }
    
    animate() {
        if (!this.canvas || !this.ctx) return;
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(particle => {
            this.updateParticle(particle);
            this.drawParticle(particle);
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// Floating elements animation
function initFloatingElements() {
    const floatingElements = document.querySelectorAll('.floating');
    
    floatingElements.forEach((el, index) => {
        const delay = index * 0.2;
        const duration = 3 + Math.random() * 2;
        
        el.style.animation = `float ${duration}s ease-in-out ${delay}s infinite`;
    });
}

// Intersection Observer for scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements
    const animatedElements = document.querySelectorAll(
        '.service-card, .step, .price-card, .trust-item'
    );
    
    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

// Number counter animation
function animateCounter(element, start, end, duration) {
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        
        if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
            current = end;
            clearInterval(timer);
        }
        
        element.textContent = Math.round(current);
    }, 16);
}

// Typewriter effect
function typewriterEffect(element, text, speed = 50) {
    let index = 0;
    element.textContent = '';
    
    const timer = setInterval(() => {
        element.textContent += text[index];
        index++;
        
        if (index >= text.length) {
            clearInterval(timer);
        }
    }, speed);
}

// Ripple effect on click
function createRipple(event) {
    const button = event.currentTarget;
    const ripple = document.createElement('span');
    
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;
    
    ripple.style.width = ripple.style.height = `${diameter}px`;
    ripple.style.left = `${event.clientX - button.offsetLeft - radius}px`;
    ripple.style.top = `${event.clientY - button.offsetTop - radius}px`;
    ripple.classList.add('ripple');
    
    const existingRipple = button.querySelector('.ripple');
    if (existingRipple) {
        existingRipple.remove();
    }
    
    button.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
}

// Add ripple to buttons
function initRippleEffect() {
    const buttons = document.querySelectorAll(
        'button:not(.no-ripple), .cta-button, .order-btn'
    );
    
    buttons.forEach(button => {
        button.addEventListener('click', createRipple);
    });
}

// Parallax scrolling
function initParallax() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        parallaxElements.forEach(el => {
            const speed = el.dataset.parallax || 0.5;
            const yPos = -(scrolled * speed);
            
            el.style.transform = `translateY(${yPos}px)`;
        });
    });
}

// Animated background gradient
function initGradientAnimation() {
    const gradientElements = document.querySelectorAll('.gradient');
    let hue = 0;
    
    setInterval(() => {
        hue = (hue + 1) % 360;
        const color1 = `hsl(${hue}, 70%, 50%)`;
        const color2 = `hsl(${(hue + 60) % 360}, 70%, 50%)`;
        
        gradientElements.forEach(el => {
            if (el.classList.contains('gradient-dynamic')) {
                el.style.background = `linear-gradient(135deg, ${color1} 0%, ${color2} 100%)`;
            }
        });
    }, 50);
}

// Smooth page transitions
function initPageTransitions() {
    const links = document.querySelectorAll('a:not([href^="#"]):not([href^="tel:"]):not([href^="mailto:"])');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            if (href && !href.startsWith('http') && !link.hasAttribute('download')) {
                e.preventDefault();
                
                document.body.classList.add('page-transition');
                
                setTimeout(() => {
                    window.location.href = href;
                }, 300);
            }
        });
    });
}

// Initialize all animations
document.addEventListener('DOMContentLoaded', () => {
    // Start particle system
    new ParticleSystem();
    
    // Initialize animations
    initFloatingElements();
    initScrollAnimations();
    initRippleEffect();
    initParallax();
    initPageTransitions();
    
    // Animate counters when visible
    const counters = document.querySelectorAll('.animate-counter');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.animated) {
                const end = parseInt(entry.target.dataset.end);
                animateCounter(entry.target, 0, end, 2000);
                entry.target.animated = true;
            }
        });
    });
    
    counters.forEach(counter => counterObserver.observe(counter));
});

// Animation styles
const animationStyles = `
<style>
/* Ripple effect */
.ripple {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.5);
    transform: scale(0);
    animation: ripple-animation 0.6s ease-out;
    pointer-events: none;
}

@keyframes ripple-animation {
    to {
        transform: scale(4);
        opacity: 0;
    }
}

button, .cta-button, .order-btn {
    position: relative;
    overflow: hidden;
}

/* Scroll animations */
.animate-in {
    animation: fadeInUp 0.6s ease-out forwards;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Page transitions */
.page-transition {
    animation: fadeOut 0.3s ease-out forwards;
}

@keyframes fadeOut {
    to {
        opacity: 0;
        transform: scale(0.95);
    }
}

/* Canvas particles */
#particles canvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
}

/* Gradient animation */
.gradient-dynamic {
    background-size: 200% 200%;
    animation: gradient-flow 5s ease infinite;
}

@keyframes gradient-flow {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
}

/* Glitch effect */
.glitch {
    position: relative;
}

.glitch::before,
.glitch::after {
    content: attr(data-text);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}

.glitch::before {
    animation: glitch-1 0.5s infinite;
    color: var(--accent);
    z-index: -1;
}

.glitch::after {
    animation: glitch-2 0.5s infinite;
    color: var(--accent-warm);
    z-index: -2;
}

@keyframes glitch-1 {
    0%, 100% {
        clip-path: inset(0 0 0 0);
        transform: translate(0);
    }
    20% {
        clip-path: inset(20% 0 30% 0);
        transform: translate(-2px, 2px);
    }
    40% {
        clip-path: inset(50% 0 20% 0);
        transform: translate(2px, -2px);
    }
    60% {
        clip-path: inset(10% 0 60% 0);
        transform: translate(-2px, 1px);
    }
    80% {
        clip-path: inset(80% 0 5% 0);
        transform: translate(1px, -1px);
    }
}

@keyframes glitch-2 {
    0%, 100% {
        clip-path: inset(0 0 0 0);
        transform: translate(0);
    }
    20% {
        clip-path: inset(60% 0 10% 0);
        transform: translate(2px, 1px);
    }
    40% {
        clip-path: inset(20% 0 60% 0);
        transform: translate(-1px, 2px);
    }
    60% {
        clip-path: inset(80% 0 10% 0);
        transform: translate(1px, -2px);
    }
    80% {
        clip-path: inset(10% 0 80% 0);
        transform: translate(-2px, -1px);
    }
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', animationStyles);