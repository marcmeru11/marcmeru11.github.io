// --- Constants & State ---
const burger = document.querySelector('.burger');
const navLinks = document.querySelector('.nav-links');
const categoryFilter = document.querySelector('.category-filter');
const projectsGrid = document.querySelector('.projects-grid');
const typingText = document.querySelector('.typing-text');
const header = document.querySelector('header');

// --- Mobile Menu ---
burger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    burger.classList.toggle('open');
});

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        burger.classList.remove('open');
    });
});

// --- Category Filtering (Event Delegation) ---
categoryFilter.addEventListener('click', (e) => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;

    // Update active state
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.getAttribute('data-filter');
    const projectCards = document.querySelectorAll('.project-card');

    projectCards.forEach(card => {
        const categories = card.getAttribute('data-category').split(' ');

        if (filter === 'all' || categories.includes(filter)) {
            card.style.display = 'flex';
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0) scale(1)';
            }, 10);
        } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px) scale(0.95)';
            setTimeout(() => {
                card.style.display = 'none';
            }, 400);
        }
    });
});

// --- Scroll Animations (Simple AOS Implementation) ---
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('aos-animate');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('[data-aos]').forEach(el => {
    observer.observe(el);
});

// --- Sticky Header Effect ---
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.style.padding = '0.5rem 0';
        header.style.background = 'rgba(3, 0, 20, 0.9)';
    } else {
        header.style.padding = '1.25rem 0';
        header.style.background = 'rgba(3, 0, 20, 0.7)';
    }
});

// --- Typing Animation ---
const words = ['Computer Science Student', 'Fullstack Enthusiast'];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typeSpeed = 100;

function typeEffect() {
    const currentWord = words[wordIndex];
    if (isDeleting) {
        typingText.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
        typeSpeed = 50;
    } else {
        typingText.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
        typeSpeed = 100;
    }

    if (!isDeleting && charIndex === currentWord.length) {
        isDeleting = true;
        typeSpeed = 2000;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        typeSpeed = 500;
    }
    setTimeout(typeEffect, typeSpeed);
}

// --- Smooth Scrolling ---
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (!href || href === '#' || !href.startsWith('#')) return;

        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        }
    });
});

// --- Dynamic Content Loading ---
async function loadProjects() {
    try {
        const response = await fetch('assets/proyects.json');
        if (!response.ok) throw new Error('Load failed');
        const projects = await response.json();

        renderFilters(projects);
        renderProjects(projects);
    } catch (error) {
        console.error('Load Error:', error);
        projectsGrid.innerHTML = '<p>Error loading projects.</p>';
    }
}

function renderFilters(projects) {
    const categoriesSet = new Set();
    projects.forEach(p => {
        p.category.split(' ').forEach(cat => categoriesSet.add(cat));
    });

    let html = `<button class="filter-btn active" data-filter="all">All</button>`;
    categoriesSet.forEach(cat => {
        const label = cat.replace(/_/g, ' ');
        html += `<button class="filter-btn" data-filter="${cat}">${label}</button>`;
    });
    categoryFilter.innerHTML = html;
}

function renderProjects(projects) {
    projectsGrid.innerHTML = '';
    projects.forEach(project => {
        const card = document.createElement('div');
        card.className = 'project-card';
        card.setAttribute('data-category', project.category);
        card.setAttribute('data-aos', '');
        card.setAttribute('data-title', project.title);
        card.setAttribute('data-full-desc', project.fullDesc);
        card.setAttribute('data-tech', project.tech.join(', '));
        card.setAttribute('data-github', project.github);
        card.setAttribute('data-link', project.link);
        if (project.downloads) card.setAttribute('data-downloads', project.downloads);
        if (project.image) card.setAttribute('data-image', project.image);

        card.innerHTML = `
            <div class="project-image">
                ${project.image ? `<img src="${project.image}" alt="${project.title}"><div class="image-overlay"></div>` : `<ion-icon name="${project.icon}"></ion-icon>`}
            </div>
            <div class="project-info">
                <div class="project-header">
                    <h3>${project.title}</h3>
                </div>
                <div class="project-meta-row">
                    ${project.downloads ? `<span class="card-downloads"><ion-icon name="download-outline"></ion-icon>${project.downloads}</span>` : ''}
                    <div class="project-links">
                        ${project.github ? `<a href="${project.github}" target="_blank" class="card-link" title="GitHub Repository"><ion-icon name="logo-github"></ion-icon></a>` : ''}
                        ${project.link ? `<a href="${project.link}" target="_blank" class="card-link" title="Visit Project"><ion-icon name="open-outline"></ion-icon></a>` : ''}
                    </div>
                </div>
                <p>${project.desc}</p>
                <div class="tech-tags">${project.tech.map(t => `<span>${t}</span>`).join('')}</div>
            </div>
        `;
        projectsGrid.appendChild(card);
        observer.observe(card);
    });
}

// --- Modal Logic ---
const modal = document.getElementById('project-modal');
const modalTitle = document.getElementById('modal-title');
const modalDesc = document.getElementById('modal-description');
const modalTags = document.getElementById('modal-tags');
const modalGithub = document.getElementById('modal-github');
const modalLink = document.getElementById('modal-link');
const modalClose = document.querySelector('.modal-close');
const modalOverlay = document.querySelector('.modal-overlay');
const modalIcon = document.getElementById('modal-project-icon');
const modalDownloads = document.getElementById('modal-downloads');
const modalImageContainer = document.getElementById('modal-image-container');

function openProjectModal(card) {
    const title = card.getAttribute('data-title');
    const fullDesc = card.getAttribute('data-full-desc');
    const tech = card.getAttribute('data-tech');
    const github = card.getAttribute('data-github');
    const link = card.getAttribute('data-link');
    const categories = card.getAttribute('data-category') || '';
    const image = card.getAttribute('data-image');

    modalTitle.textContent = title;
    modalDesc.textContent = fullDesc;

    modalTags.innerHTML = '';
    if (tech) {
        tech.split(',').forEach(t => {
            const span = document.createElement('span');
            span.textContent = t.trim();
            modalTags.appendChild(span);
        });
    }

    modalGithub.style.display = github ? 'flex' : 'none';
    if (github) modalGithub.href = github;

    modalLink.style.display = link ? 'flex' : 'none';
    if (link) modalLink.href = link;

    const icon = categories.includes('mobile') ? 'logo-android' : 
                 categories.includes('backend') ? 'server-outline' : 'folder-open-outline';
    
    // Modal Image/Icon handling
    if (image) {
        modalImageContainer.innerHTML = `<img src="${image}" alt="${title}">`;
    } else {
        modalImageContainer.innerHTML = `<ion-icon name="${icon}"></ion-icon>`;
    }

    // Downloads badge
    const downloads = card.getAttribute('data-downloads');
    if (downloads) {
        modalDownloads.style.display = 'flex';
        modalDownloads.innerHTML = `<ion-icon name="download-outline"></ion-icon> ${downloads} Downloads`;
    } else {
        modalDownloads.style.display = 'none';
    }

    modal.classList.add('active');
    document.body.classList.add('modal-open');
}

projectsGrid.addEventListener('click', (e) => {
    // If the click was on a card link, don't open the modal
    if (e.target.closest('.card-link')) return;

    const card = e.target.closest('.project-card');
    if (card) openProjectModal(card);
});

modalClose.addEventListener('click', () => {
    modal.classList.remove('active');
    document.body.classList.remove('modal-open');
});

modalOverlay.addEventListener('click', () => {
    modal.classList.remove('active');
    document.body.classList.remove('modal-open');
});

// Initialize
window.addEventListener('DOMContentLoaded', () => {
    loadProjects();
    setTimeout(typeEffect, 1000);
});
