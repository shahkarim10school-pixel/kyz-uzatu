// Calendar Generation
function generateCalendar() {
    const year = 2026;
    const month = 6; // July (0-indexed)
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const calendarDays = document.getElementById('calendarDays');
    calendarDays.innerHTML = '';

    // Previous month's days
    const prevMonthDays = new Date(year, month, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
        const dayDiv = document.createElement('div');
        dayDiv.className = 'calendar-day other-month';
        dayDiv.textContent = prevMonthDays - i;
        calendarDays.appendChild(dayDiv);
    }

    // Current month's days
    for (let day = 1; day <= daysInMonth; day++) {
        const dayDiv = document.createElement('div');
        dayDiv.className = 'calendar-day';
        dayDiv.textContent = day;

        // Highlight the 28th (event date)
        if (day === 28) {
            dayDiv.classList.add('today');
        }

        calendarDays.appendChild(dayDiv);
    }

    // Next month's days
    const totalCells = calendarDays.children.length;
    const remainingCells = 42 - totalCells; // 6 rows * 7 days
    for (let day = 1; day <= remainingCells; day++) {
        const dayDiv = document.createElement('div');
        dayDiv.className = 'calendar-day other-month';
        dayDiv.textContent = day;
        calendarDays.appendChild(dayDiv);
    }
}

// Countdown Timer
function updateCountdown() {
    const eventDate = new Date(2026, 6, 28, 17, 0, 0).getTime(); // July 28, 2026, 17:00
    
    function tick() {
        const now = new Date().getTime();
        const distance = eventDate - now;

        if (distance < 0) {
            document.getElementById('days').textContent = '0';
            document.getElementById('hours').textContent = '0';
            document.getElementById('minutes').textContent = '0';
            document.getElementById('seconds').textContent = '0';
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById('days').textContent = String(days).padStart(2, '0');
        document.getElementById('hours').textContent = String(hours).padStart(2, '0');
        document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
    }

    tick();
    setInterval(tick, 1000);
}

// RSVP Functions
function submitRSVP(response) {
    // Save to localStorage
    const rsvpData = JSON.parse(localStorage.getItem('rsvpData')) || { yes: 0, maybe: 0, no: 0 };
    
    if (response === 'yes') {
        rsvpData.yes++;
    } else if (response === 'maybe') {
        rsvpData.maybe++;
    } else if (response === 'no') {
        rsvpData.no++;
    }
    
    localStorage.setItem('rsvpData', JSON.stringify(rsvpData));
    updateRSVPDisplay(rsvpData);
    showRSVPMessage(response);
}

function updateRSVPDisplay(data) {
    document.getElementById('yesList').textContent = data.yes;
    document.getElementById('maybeList').textContent = data.maybe;
    document.getElementById('noList').textContent = data.no;
}

function showRSVPMessage(response) {
    const messageDiv = document.getElementById('rsvpMessage');
    const messageText = document.getElementById('rsvpMessageText');
    
    let message = '';
    if (response === 'yes') {
        message = '✅ Сағалаймыз, сіз келетіңіз! Өте қуаныштымыз! 🎉';
    } else if (response === 'maybe') {
        message = '❓ Біліңіз, сіз келсеңіз қуанамыз! 💕';
    } else if (response === 'no') {
        message = '❌ Өкінішті, бірок бағалаймыз! Келесінде кезектесіңіз 💕';
    }
    
    messageText.textContent = message;
    messageDiv.style.display = 'block';
    
    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 3000);
}

// Load RSVP data on page load
function loadRSVPData() {
    const rsvpData = JSON.parse(localStorage.getItem('rsvpData')) || { yes: 0, maybe: 0, no: 0 };
    updateRSVPDisplay(rsvpData);
}

// Intersection Observer for scroll animations
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    const elements = document.querySelectorAll('.calendar-section, .countdown-section, .rsvp-section');
    elements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });
}

// Touch swipe detection for mobile
function initSwipeDetection() {
    let touchStartY = 0;
    let touchEndY = 0;

    document.addEventListener('touchstart', (e) => {
        touchStartY = e.changedTouches[0].screenY;
    }, false);

    document.addEventListener('touchend', (e) => {
        touchEndY = e.changedTouches[0].screenY;
        handleSwipe();
    }, false);

    function handleSwipe() {
        const swipeDistance = touchStartY - touchEndY;
        
        if (Math.abs(swipeDistance) > 50) {
            const container = document.querySelector('.content-wrapper');
            if (swipeDistance > 0) {
                container.style.animation = 'fadeInUp 0.4s ease-out';
            } else {
                container.style.animation = 'fadeInUp 0.4s ease-out reverse';
            }
        }
    }
}

// Scroll indicator handling
function initScrollIndicator() {
    const container = document.querySelector('.container');
    const scrollIndicator = document.querySelector('.scroll-indicator');

    container.addEventListener('scroll', () => {
        const currentScroll = container.scrollTop;
        if (currentScroll > 100) {
            scrollIndicator.style.opacity = '0';
            scrollIndicator.style.pointerEvents = 'none';
        } else {
            scrollIndicator.style.opacity = '1';
            scrollIndicator.style.pointerEvents = 'none';
        }
    });
}

// Add floating animation to decorative elements
function animateDecorations() {
    const decorations = document.querySelectorAll('.decorative-element, .flower-decoration, .gold-ornament');
    decorations.forEach((el, index) => {
        el.style.animation = `float${index % 2 === 0 ? '1' : '2'} 6s ease-in-out infinite`;
    });
}

// CSS for float animations
const style = document.createElement('style');
style.textContent = `
    @keyframes float1 {
        0%, 100% { transform: translateY(0px) translateX(0px); }
        50% { transform: translateY(-25px) translateX(10px); }
    }
    
    @keyframes float2 {
        0%, 100% { transform: translateY(0px) translateX(0px); }
        50% { transform: translateY(25px) translateX(-10px); }
    }
`;
document.head.appendChild(style);

// Initialize everything on page load
document.addEventListener('DOMContentLoaded', () => {
    generateCalendar();
    updateCountdown();
    initScrollAnimations();
    initSwipeDetection();
    initScrollIndicator();
    animateDecorations();
    loadRSVPData();
});

// Handle visibility change to update countdown on tab focus
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        updateCountdown();
    }
});