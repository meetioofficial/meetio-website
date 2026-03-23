// Firebase Configuration
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAOwk37TCbc_loEb-LFXLK3qWQBdOaaqlU",
    authDomain: "meeto-website.firebaseapp.com",
    projectId: "meeto-website",
    storageBucket: "meeto-website.firebasestorage.app",
    messagingSenderId: "950489624932",
    appId: "1:950489624932:web:65f005771901f763e64a71",
    measurementId: "G-TVM3G555P5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Mobile Menu Toggle
const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.createElement('div');
mobileMenu.className = 'mobile-menu';

mobileMenu.innerHTML = `
    <ul>
        <li><a href="#features">Features</a></li>
        <li><a href="#how-it-works">How It Works</a></li>
        <li><a href="#stories">Stories</a></li>
        <li><a href="#team">Team</a></li>
        <li><a href="#" onclick="scrollToPlanner(); return false;" style="color: #ff0000;">PLAN IT NOW</a></li>
    </ul>
`;

document.body.appendChild(mobileMenu);

menuToggle.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
    menuToggle.innerHTML = mobileMenu.classList.contains('active')
        ? '<i class="fas fa-times"></i>'
        : '<i class="fas fa-bars"></i>';
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!menuToggle.contains(e.target) && !mobileMenu.contains(e.target)) {
        mobileMenu.classList.remove('active');
        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    }
});

// Scroll to planner function
window.scrollToPlanner = function() {
    const planner = document.getElementById('planner');
    if (planner) {
        planner.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Also open waitlist modal
    setTimeout(() => {
        openWaitlist();
    }, 500);
};

// Countdown Timer
let spotsLeft = 347;
const countdownElement = document.getElementById('countdown-number');
if (countdownElement) {
    setInterval(() => {
        if (spotsLeft > 0 && Math.random() > 0.7) {
            spotsLeft--;
            countdownElement.textContent = spotsLeft;
            
            // Update all countdown displays
            document.querySelectorAll('.countdown-highlight, .urgency-countdown').forEach(el => {
                if (el.id !== 'countdown-number') {
                    el.innerHTML = spotsLeft + ' spots';
                }
            });
        }
    }, 30000); // Update every 30 seconds
}

// Timer countdown (hours, minutes, seconds)
function updateTimer() {
    const hours = document.getElementById('hours');
    const minutes = document.getElementById('minutes');
    const seconds = document.getElementById('seconds');
    
    if (hours && minutes && seconds) {
        // Simulate countdown (in reality, you'd set an end date)
        let h = 24;
        let m = 47;
        let s = parseInt(seconds.textContent) || 32;
        
        s--;
        if (s < 0) {
            s = 59;
            m--;
            if (m < 0) {
                m = 59;
                h--;
                if (h < 0) {
                    h = 24;
                }
            }
        }
        
        hours.textContent = h.toString().padStart(2, '0');
        minutes.textContent = m.toString().padStart(2, '0');
        seconds.textContent = s.toString().padStart(2, '0');
    }
}

setInterval(updateTimer, 1000);

// Demo interaction
document.querySelectorAll('.mood-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        
        // Change demo card based on mood
        const demoCard = document.getElementById('demoCard');
        const mood = this.dataset.mood;
        
        const places = {
            foodie: { name: 'Pasta Paradise', cuisine: 'Italian', price: '$$' },
            chill: { name: 'Coffee Haven', cuisine: 'Cafe', price: '$' },
            night: { name: 'Sky Lounge', cuisine: 'Cocktails', price: '$$$' },
            active: { name: 'Adventure Park', cuisine: 'Activities', price: '$$' }
        };
        
        if (demoCard && places[mood]) {
            const place = places[mood];
            demoCard.querySelector('h4').textContent = place.name;
            demoCard.querySelector('.demo-tags span:first-child').textContent = place.cuisine;
        }
    });
});

// Like/Dislike demo
document.querySelector('.demo-like')?.addEventListener('click', function() {
    this.style.transform = 'scale(1.2)';
    setTimeout(() => {
        this.style.transform = 'scale(1)';
        // Simulate new card
        alert('Liked! (Demo mode)');
    }, 200);
});

document.querySelector('.demo-dislike')?.addEventListener('click', function() {
    this.style.transform = 'scale(1.2)';
    setTimeout(() => {
        this.style.transform = 'scale(1)';
        // Simulate new card
        alert('Disliked! (Demo mode)');
    }, 200);
});

// Waitlist Modal Functions
window.openWaitlist = function() {
    const modal = document.getElementById('waitlistModal');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        // Reset form
        const form = document.getElementById('waitlistForm');
        const success = document.getElementById('waitlistSuccess');
        if (form) {
            form.reset();
            form.style.display = 'block';
        }
        if (success) success.style.display = 'none';
    }
};

window.closeWaitlist = function() {
    const modal = document.getElementById('waitlistModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
};

// Waitlist form submission
document.getElementById('waitlistForm')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const name = document.getElementById('waitlistName').value.trim();
    const email = document.getElementById('waitlistEmail').value.trim();
    
    if (!name || !email) {
        alert('Please fill in all fields');
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address');
        return;
    }
    
    // Show loading
    const submitBtn = document.getElementById('submitWaitlist');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    
    btnText.style.display = 'none';
    btnLoading.style.display = 'inline';
    submitBtn.disabled = true;
    
    try {
        // Save to Firebase
        await addDoc(collection(db, 'waitlist'), {
            name: name,
            email: email,
            timestamp: serverTimestamp(),
            source: 'website_urgent',
            notified: false
        });
        
        // Show success
        document.getElementById('waitlistForm').style.display = 'none';
        document.getElementById('waitlistSuccess').style.display = 'block';
        
        // Trigger confetti
        triggerConfetti();
        
        // Decrease spots counter
        if (spotsLeft > 0) {
            spotsLeft--;
            document.getElementById('countdown-number').textContent = spotsLeft;
        }
        
    } catch (error) {
        console.error('Error:', error);
        alert('Something went wrong. Please try again.');
        
        // Reset button
        btnText.style.display = 'inline';
        btnLoading.style.display = 'none';
        submitBtn.disabled = false;
    }
});

// Confetti function
function triggerConfetti() {
    const colors = ['#ff0000', '#8b5cf6', '#ffffff'];
    
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.width = '10px';
            confetti.style.height = '10px';
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.borderRadius = '50%';
            confetti.style.zIndex = '10001';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.top = '-20px';
            confetti.style.pointerEvents = 'none';
            confetti.style.boxShadow = '0 0 10px currentColor';
            
            document.body.appendChild(confetti);
            
            const animation = confetti.animate([
                { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
                { transform: `translateY(${window.innerHeight + 100}px) rotate(${720}deg)`, opacity: 0 }
            ], {
                duration: 2000 + Math.random() * 2000,
                easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)'
            });
            
            animation.onfinish = () => confetti.remove();
        }, i * 50);
    }
}

// Close modal on outside click
document.getElementById('waitlistModal')?.addEventListener('click', function(e) {
    if (e.target === this) {
        closeWaitlist();
    }
});

// Close with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeWaitlist();
    }
});

// Update footer year
document.querySelector('.current-year')?.addAttribute ? 
    document.querySelector('.current-year').textContent = new Date().getFullYear() : 
    null;

// Scroll effect for header
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(0, 0, 0, 0.98)';
        header.style.borderBottom = '1px solid #ff0000';
    } else {
        header.style.background = 'rgba(0, 0, 0, 0.95)';
        header.style.borderBottom = '1px solid rgba(255, 0, 0, 0.2)';
    }
});

// Auto-play hero video
document.querySelector('.hero-video')?.play();

// Add animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.works-card, .story-card, .team-member').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease';
    observer.observe(el);
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Make functions globally available
window.openWaitlist = openWaitlist;
window.closeWaitlist = closeWaitlist;
window.scrollToPlanner = scrollToPlanner;
