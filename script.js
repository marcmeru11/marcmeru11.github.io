// Mobile Menu Toggle
const burger = document.querySelector('.burger');
const nav = document.querySelector('.nav-links');

burger.addEventListener('click', () => {
    nav.classList.toggle('active');
    burger.classList.toggle('active');
});

// Close menu when clicking on a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        nav.classList.remove('active');
        burger.classList.remove('active');
    });
});

// Smooth scrolling
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

// Typing animation
const typingText = document.querySelector('.typing-text');
const text = 'Desarrollador Android | Kotlin & Compose';
let index = 0;

function type() {
    if (index < text.length) {
        typingText.textContent = text.substring(0, index + 1);
        index++;
        setTimeout(type, 100);
    }
}

// Start typing animation when page loads
window.addEventListener('load', () => {
    typingText.textContent = '';
    setTimeout(type, 500);
});
