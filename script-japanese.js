// Header Background on Scroll
const header = document.querySelector('.header');

if (header) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Fade-in Animation on Scroll
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

// Dynamic Year Calculation and Update
const currentYear = new Date().getFullYear();
const foundedYear = 1980;
const sushiYear = 1996;
const movedYear = 2017;

// Calculate years since each milestone
const yearsSinceFounded = currentYear - foundedYear;
const yearsSinceSushi = currentYear - sushiYear;
const yearsSinceMoved = currentYear - movedYear;

// Convert to Arabic numbers (just return the number as is)
const arabicNumber = (num) => {
    return num + '年';
};

// Arabic numbers for years
const yearsSinceFoundedText = arabicNumber(yearsSinceFounded);
const yearsSinceSushiText = arabicNumber(yearsSinceSushi);
const yearsSinceMovedText = arabicNumber(yearsSinceMoved);

// Update hero section
const yearsSinceFoundedElement = document.getElementById('years-since-founded');
if (yearsSinceFoundedElement) {
    yearsSinceFoundedElement.textContent = yearsSinceFoundedText;
}

// Update timeline section
const yearsSinceFounded2Element = document.getElementById('years-since-founded-2');
const yearsSinceMovedElement = document.getElementById('years-since-moved');
if (yearsSinceFounded2Element) {
    yearsSinceFounded2Element.textContent = yearsSinceFoundedText;
}
if (yearsSinceMovedElement) {
    yearsSinceMovedElement.textContent = yearsSinceMovedText;
}

// Update footer
const yearsSinceFoundedFooterElement = document.getElementById('years-since-founded-footer');
if (yearsSinceFoundedFooterElement) {
    // Remove existing year element if any
    const existingYearElement = document.querySelector('.year-info');
    if (existingYearElement) {
        existingYearElement.remove();
    }

    // Add current year info below shop name
    const footerName = document.querySelector('.footer-name');
    if (footerName) {
        const yearElement = document.createElement('p');
        yearElement.className = 'year-info';
        yearElement.style.fontSize = '0.9rem';
        yearElement.style.color = 'var(--text-secondary)';
        yearElement.style.marginTop = '10px';
        yearElement.textContent = `創業${yearsSinceFoundedText}年（食事処から）`;
        footerName.parentNode.insertBefore(yearElement, footerName.nextSibling);
    }

    // Update the tagline year
    yearsSinceFoundedFooterElement.textContent = yearsSinceFoundedText;
}

// Console log for debugging
console.log('=================================================');
console.log('旬食工房きよし - 和風バージョンが読み込まれました');
console.log('=================================================');
console.log(`現在の年: ${currentYear}年`);
console.log(`------------------------------------------------`);
console.log(`創業から: ${yearsSinceFoundedText} (${yearsSinceFounded}年)`);
console.log(`回転寿司から: ${yearsSinceSushiText} (${yearsSinceSushi}年)`);
console.log(`門川移転から: ${yearsSinceMovedText} (${yearsSinceMoved}年)`);
console.log('================================================');
console.log(`三つの進化を経て、変わらぬ想いをお届けします。`);
console.log('=================================================');

// Auto-update notification (optional - can be disabled)
console.log('ℹ️  年数は動的に計算されます。毎年1月1日になると自動的に更新されます。');
console.log('ℹ️   手動で更新する場合は、ページをリロードしてください。');
