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
        <li><a href="#how-it-works">How it works</a></li>
        <li><a href="#stories">Stories</a></li>
        <li><a href="#team">Team</a></li>
        <li><a href="#" id="mobilePlanBtn">Plan a hangout</a></li>
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

// Plan button functionality
function openWaitlist() {
    const waitlistSection = document.querySelector('.waitlist-section');
    if (waitlistSection) {
        waitlistSection.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Focus on name input
    setTimeout(() => {
        const nameInput = document.getElementById('waitlistName');
        if (nameInput) nameInput.focus();
    }, 500);
}

document.getElementById('planBtn')?.addEventListener('click', (e) => {
    e.preventDefault();
    openWaitlist();
});

document.getElementById('heroPlanBtn')?.addEventListener('click', (e) => {
    e.preventDefault();
    openWaitlist();
});

document.getElementById('mobilePlanBtn')?.addEventListener('click', (e) => {
    e.preventDefault();
    openWaitlist();
    mobileMenu.classList.remove('active');
    menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
});

// Video Player
const video = document.getElementById('demoVideo');
const playPauseBtn = document.getElementById('playPauseBtn');
const muteBtn = document.getElementById('muteBtn');
const timeline = document.querySelector('.video-timeline');
const progress = document.querySelector('.video-progress');

if (video) {
    // Play/Pause functionality
    playPauseBtn?.addEventListener('click', () => {
        if (video.paused) {
            video.play();
            playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        } else {
            video.pause();
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        }
    });
    
    // Update play button when video ends
    video.addEventListener('ended', () => {
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
    });
    
    // Update play button when video plays
    video.addEventListener('play', () => {
        playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
    });
    
    // Update progress bar
    video.addEventListener('timeupdate', () => {
        const percent = (video.currentTime / video.duration) * 100;
        if (progress) progress.style.width = percent + '%';
    });
    
    // Timeline click
    timeline?.addEventListener('click', (e) => {
        const rect = timeline.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        video.currentTime = pos * video.duration;
    });
    
    // Mute functionality
    muteBtn?.addEventListener('click', () => {
        video.muted = !video.muted;
        muteBtn.innerHTML = video.muted ? '<i class="fas fa-volume-mute"></i>' : '<i class="fas fa-volume-up"></i>';
    });
    
    // Show video controls on hover
    const videoWrapper = document.querySelector('.video-wrapper');
    videoWrapper?.addEventListener('mouseenter', () => {
        const controls = document.querySelector('.video-controls');
        if (controls) controls.style.opacity = '1';
    });
    
    videoWrapper?.addEventListener('mouseleave', () => {
        const controls = document.querySelector('.video-controls');
        if (controls && !video.paused) controls.style.opacity = '0';
    });
}

// Waitlist Form Submission
const waitlistForm = document.getElementById('waitlistForm');
const waitlistSuccess = document.getElementById('waitlistSuccess');

waitlistForm?.addEventListener('submit', async (e) => {
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
    
    const submitBtn = waitlistForm.querySelector('button');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Saving...';
    submitBtn.disabled = true;
    
    try {
        await addDoc(collection(db, 'waitlist'), {
            name: name,
            email: email,
            timestamp: serverTimestamp(),
            source: 'website',
            notified: false
        });
        
        // Show success
        waitlistForm.style.display = 'none';
        waitlistSuccess.style.display = 'block';
        
        // Trigger simple confetti
        triggerConfetti();
        
    } catch (error) {
        console.error('Error:', error);
        alert('Something went wrong. Please try again.');
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
});

// Simple confetti effect
function triggerConfetti() {
    const colors = ['#8b5cf6', '#a78bfa', '#6d28d9'];
    
    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.width = '8px';
            confetti.style.height = '8px';
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.borderRadius = '50%';
            confetti.style.zIndex = '10001';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.top = '-10px';
            confetti.style.pointerEvents = 'none';
            
            document.body.appendChild(confetti);
            
            const animation = confetti.animate([
                { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
                { transform: `translateY(${window.innerHeight + 100}px) rotate(${360}deg)`, opacity: 0 }
            ], {
                duration: 1500 + Math.random() * 1000,
                easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)'
            });
            
            animation.onfinish = () => confetti.remove();
        }, i * 50);
    }
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#' || href === '#') return;
        
        const targetElement = document.querySelector(href);
        if (targetElement) {
            e.preventDefault();
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Scroll effect for header
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 50) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.05)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = 'none';
    }
});

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

document.querySelectorAll('.feature-card, .story-card, .team-member, .step-content').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease';
    observer.observe(el);
});
