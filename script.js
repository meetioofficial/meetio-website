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
        <li><a href="#home">Home</a></li>
        <li><a href="#features">Features</a></li>
        <li><a href="#how-it-works">How It Works</a></li>
        <li><a href="#testimonials">Stories</a></li>
        <li><a href="#team">Team</a></li>
        <li><a href="#contact">Contact</a></li>
        <li><a href="#" onclick="openTryAppModal(); return false;" style="color: var(--red); font-weight: 700;">Try Demo</a></li>
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

// Smooth scrolling for anchor links with header offset
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

// Try App Modal Functions
let currentDemoStep = 1;

window.openTryAppModal = function() {
    const modal = document.getElementById('tryAppModal');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        currentDemoStep = 1;
        updateDemoStep();
    }
}

window.closeTryAppModal = function() {
    const modal = document.getElementById('tryAppModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

window.nextDemoStep = function() {
    if (currentDemoStep < 3) {
        currentDemoStep++;
        updateDemoStep();
    }
}

window.prevDemoStep = function() {
    if (currentDemoStep > 1) {
        currentDemoStep--;
        updateDemoStep();
    }
}

function updateDemoStep() {
    // Update step indicators
    document.querySelectorAll('.try-app-step').forEach((step, index) => {
        if (index + 1 === currentDemoStep) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });
    
    // Update demo content
    document.getElementById('step1Demo').style.display = currentDemoStep === 1 ? 'block' : 'none';
    document.getElementById('step2Demo').style.display = currentDemoStep === 2 ? 'block' : 'none';
    document.getElementById('step3Demo').style.display = currentDemoStep === 3 ? 'block' : 'none';
    
    // Update buttons
    document.getElementById('prevDemoBtn').disabled = currentDemoStep === 1;
    document.getElementById('nextDemoBtn').textContent = currentDemoStep === 3 ? 'Finish' : 'Next Step';
}

// Make step clicks work
document.querySelectorAll('.try-app-step').forEach((step, index) => {
    step.addEventListener('click', () => {
        currentDemoStep = index + 1;
        updateDemoStep();
    });
});

// Mood selector
document.querySelectorAll('.mood-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
    });
});

// Waitlist Functions
window.openMinimalWaitlist = function() {
    const modal = document.getElementById('minimalWaitlistModal');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        // Reset form
        const form = document.getElementById('minimalWaitlistForm');
        const success = document.getElementById('waitlistSuccess');
        if (form) {
            form.reset();
            form.style.display = 'block';
        }
        if (success) success.style.display = 'none';
    }
}

window.closeMinimalWaitlist = function() {
    const modal = document.getElementById('minimalWaitlistModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Waitlist form submission
document.getElementById('minimalWaitlistForm').addEventListener('submit', async function(e) {
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
    const submitBtn = document.getElementById('submitWaitlistBtn');
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
            source: 'website',
            notified: false
        });
        
        // Show success
        document.getElementById('minimalWaitlistForm').style.display = 'none';
        document.getElementById('waitlistSuccess').style.display = 'block';
        
        // Trigger confetti
        triggerConfetti();
        
    } catch (error) {
        console.error('Error:', error);
        alert('Something went wrong. Please try again.');
        
        // Reset button
        btnText.style.display = 'inline';
        btnLoading.style.display = 'none';
        submitBtn.disabled = false;
    }
});

// Feedback Functions
window.openFeedbackModal = function() {
    const modal = document.getElementById('feedbackModal');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

window.closeFeedbackModal = function() {
    const modal = document.getElementById('feedbackModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Feedback form submission
window.submitFeedback = async function(e) {
    e.preventDefault();
    
    const message = document.getElementById('feedbackMessage').value.trim();
    const email = document.getElementById('feedbackEmail').value.trim();
    const type = document.querySelector('input[name="type"]:checked').value;
    
    if (!message) {
        alert('Please enter your feedback');
        return;
    }
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    try {
        await addDoc(collection(db, 'feedback'), {
            message: message,
            email: email || null,
            type: type,
            timestamp: serverTimestamp(),
            reviewed: false
        });
        
        alert('Thank you for your feedback!');
        closeFeedbackModal();
        
    } catch (error) {
        console.error('Error:', error);
        alert('Something went wrong. Please try again.');
    } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

// Video controls - Play/Pause functionality
const demoVideo = document.getElementById('demoVideo');
const videoPlayPauseBtn = document.getElementById('videoPlayPauseBtn');

if (demoVideo && videoPlayPauseBtn) {
    videoPlayPauseBtn.addEventListener('click', function() {
        if (demoVideo.paused) {
            demoVideo.play();
            videoPlayPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        } else {
            demoVideo.pause();
            videoPlayPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        }
    });
    
    // Update button icon when video ends
    demoVideo.addEventListener('ended', function() {
        videoPlayPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
    });
}

// Confetti function
function triggerConfetti() {
    const colors = ['#ff3b3c', '#2f017e', '#ff6b6b'];
    
    for (let i = 0; i < 30; i++) {
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
            
            document.body.appendChild(confetti);
            
            const animation = confetti.animate([
                { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
                { transform: `translateY(${window.innerHeight + 100}px) rotate(${360}deg)`, opacity: 0 }
            ], {
                duration: 2000 + Math.random() * 2000,
                easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)'
            });
            
            animation.onfinish = () => confetti.remove();
        }, i * 100);
    }
}

// Close modals on outside click
document.getElementById('tryAppModal')?.addEventListener('click', function(e) {
    if (e.target === this) closeTryAppModal();
});

document.getElementById('minimalWaitlistModal')?.addEventListener('click', function(e) {
    if (e.target === this) closeMinimalWaitlist();
});

document.getElementById('feedbackModal')?.addEventListener('click', function(e) {
    if (e.target === this) closeFeedbackModal();
});

// Close with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeTryAppModal();
        closeMinimalWaitlist();
        closeFeedbackModal();
    }
});

// Update footer year
document.querySelector('.current-year').textContent = new Date().getFullYear();

// Header Hide on Scroll - with direction detection
// Simple scroll effect for header background (optional)
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});
// Auto-play video on hero
const heroVideo = document.querySelector('.hero-video');
if (heroVideo) {
    heroVideo.play().catch(e => console.log('Video autoplay failed:', e));
}

// Countdown effect (simulated)
let spotsLeft = 347;
setInterval(() => {
    if (spotsLeft > 0 && Math.random() > 0.7) {
        spotsLeft--;
        document.querySelectorAll('.countdown-badge').forEach(badge => {
            badge.innerHTML = `<i class="fas fa-users"></i> ${spotsLeft} spots left`;
        });
    }
}, 30000); // Update every 30 seconds

// Add animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.feature-card, .works-step, .story-card, .team-member').forEach(el => {
    observer.observe(el);
});

// Make functions globally available
window.openTryAppModal = openTryAppModal;
window.closeTryAppModal = closeTryAppModal;
window.nextDemoStep = nextDemoStep;
window.prevDemoStep = prevDemoStep;
window.openMinimalWaitlist = openMinimalWaitlist;
window.closeMinimalWaitlist = closeMinimalWaitlist;
window.openFeedbackModal = openFeedbackModal;
window.closeFeedbackModal = closeFeedbackModal;
window.submitFeedback = submitFeedback;

// Initial header state
if (window.scrollY > 50) {
    header.classList.add('scrolled');
}
