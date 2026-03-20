// ===================================
// Hero Slider
// ===================================
const slider = document.querySelector('.hero-slider');
const slides = document.querySelectorAll('.hero-slide');
const prevBtn = document.querySelector('.slider-btn.prev');
const nextBtn = document.querySelector('.slider-btn.next');
const dots = document.querySelectorAll('.dot');

let currentSlide = 0;
const totalSlides = slides.length;
let autoSlideInterval;

function showSlide(index) {
    // Remove active class from all slides and dots
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    // Add active class to current slide and dot
    slides[index].classList.add('active');
    dots[index].classList.add('active');
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    showSlide(currentSlide);
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    showSlide(currentSlide);
}

function startAutoSlide() {
    autoSlideInterval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
}

function stopAutoSlide() {
    clearInterval(autoSlideInterval);
}

// Event listeners for slider buttons
if (prevBtn) {
    prevBtn.addEventListener('click', () => {
        stopAutoSlide();
        prevSlide();
        startAutoSlide();
    });
}

if (nextBtn) {
    nextBtn.addEventListener('click', () => {
        stopAutoSlide();
        nextSlide();
        startAutoSlide();
    });
}

// Event listeners for dot navigation
dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        stopAutoSlide();
        currentSlide = index;
        showSlide(currentSlide);
        startAutoSlide();
    });
});

// Start auto-slide on page load
startAutoSlide();

// Pause auto-slide on hover
slider.addEventListener('mouseenter', stopAutoSlide);
slider.addEventListener('mouseleave', startAutoSlide);

// ===================================
// Mobile Menu Toggle
// ===================================
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const nav = document.querySelector('.nav');

if (mobileMenuBtn && nav) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenuBtn.classList.toggle('active');
        nav.classList.toggle('active');
    });

    // Close menu when clicking a nav link
    nav.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuBtn.classList.remove('active');
            nav.classList.remove('active');
        });
    });
}

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (mobileMenuBtn && nav && !nav.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
        mobileMenuBtn.classList.remove('active');
        nav.classList.remove('active');
    }
});

// ===================================
// Smooth Scrolling
// ===================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = targetElement.offsetTop - headerHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===================================
// Active Nav Link on Scroll
// ===================================
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function setActiveNavLink() {
    const scrollY = window.pageYOffset;
    const headerHeight = document.querySelector('.header').offsetHeight;

    sections.forEach(section => {
        const sectionTop = section.offsetTop - headerHeight - 100;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', setActiveNavLink);
setActiveNavLink(); // Set initial active link

// ===================================
// Header Background on Scroll
// ===================================
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    } else {
        header.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
    }
});

// ===================================
// Fade-in Animation on Scroll
// ===================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('section').forEach(section => {
    section.classList.add('fade-in');
    observer.observe(section);
});

// ===================================
// Dynamic Year Calculation and Update
// ===================================
const currentYear = new Date().getFullYear();
const foundedYear = 1980;
const movedYear = 2017;

// Calculate years since each milestone
const yearsSinceFounded = currentYear - foundedYear;
const yearsSinceMoved = currentYear - movedYear;

// Update hero section
const yearsSinceFoundedElements = document.querySelectorAll('#years-since-founded');
yearsSinceFoundedElements.forEach(element => {
    if (element) {
        element.textContent = yearsSinceFounded;
    }
});

// Update stats section
const yearsSinceFoundedStatElement = document.getElementById('years-since-founded-stat');
if (yearsSinceFoundedStatElement) {
    yearsSinceFoundedStatElement.textContent = yearsSinceFounded + '年';
}

// Update timeline section
const yearsSinceFounded2Element = document.getElementById('years-since-founded-2');
const yearsSinceMoved2Element = document.getElementById('years-since-moved-2');
if (yearsSinceFounded2Element) {
    yearsSinceFounded2Element.textContent = yearsSinceFounded;
}
if (yearsSinceMoved2Element) {
    yearsSinceMoved2Element.textContent = yearsSinceMoved;
}

// Update footer
const yearsSinceFoundedFooterElement = document.getElementById('years-since-founded-footer');
if (yearsSinceFoundedFooterElement) {
    yearsSinceFoundedFooterElement.textContent = yearsSinceFounded;
}

// ===================================
// Console Log for Debugging
// ===================================
console.log('=================================================');
console.log('旬食工房きよし - Modern バージョンが読み込まれました');
console.log('=================================================');
console.log(`現在の年: ${currentYear}年`);
console.log('------------------------------------------------');
console.log(`創業から: ${yearsSinceFounded}年`);
console.log(`門川移転から: ${yearsSinceMoved}年`);
console.log(`創業年: ${foundedYear}年`);
console.log(`移転年: ${movedYear}年`);
console.log('================================================');
console.log('スライダーが有効になっています');
console.log('自動スライド: 5秒ごとに切り替え');
console.log('マウスホバー時は一時停止します');
console.log('=================================================');
console.log('ℹ️  年数は動的に計算されます。毎年1月1日になると自動的に更新されます。');
console.log('ℹ️   手動で更新する場合は、ページをリロードしてください。');
