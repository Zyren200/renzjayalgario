// Mobile Menu Toggle
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
});

mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
    });
});

// Typing Animation
const roles = ['Full Stack Developer', 'Web App Developer', 'Mobile App Developer', 'Desktop App Developer', 'AI-Assisted Developer'];
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typingSpeed = 100;
const erasingSpeed = 50;
const delayBetweenRoles = 2000;

function typeRole() {
    const typingElement = document.querySelector('.typing-effect');
    const currentRole = roles[roleIndex];

    if (isDeleting) {
        charIndex--;
    } else {
        charIndex++;
    }

    typingElement.textContent = currentRole.substring(0, charIndex);

    if (!isDeleting && charIndex === currentRole.length) {
        isDeleting = true;
        setTimeout(typeRole, delayBetweenRoles);
        return;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
    }

    setTimeout(typeRole, isDeleting ? erasingSpeed : typingSpeed);
}

typeRole();

// Reveal on Scroll Animation
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.reveal').forEach(el => {
    observer.observe(el);
});

// Scroll to Top Button
const scrollToTopBtn = document.getElementById('scrollToTop');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollToTopBtn.classList.add('show');
    } else {
        scrollToTopBtn.classList.remove('show');
    }
});

scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Active Nav Link Highlight
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// Stagger Animation on Load
window.addEventListener('load', () => {
    document.querySelectorAll('.stagger-item').forEach((el, index) => {
        el.style.animationDelay = `${index * 0.1}s`;
    });
});

// Add smooth animations on hover
document.querySelectorAll('.card-hover').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.boxShadow = '0 20px 50px rgba(255, 255, 255, 0.1)';
    });
    card.addEventListener('mouseleave', function() {
        this.style.boxShadow = '0 0 0 rgba(0, 0, 0, 0)';
    });
});

// Contact Form (sends to your email via Web3Forms)
// Get a free access key at https://web3forms.com and paste it in index.html (access_key field).
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    const submitBtn = document.getElementById('contactSubmit');
    const statusEl = document.getElementById('contactStatus');

    const showStatus = (message, ok) => {
        statusEl.textContent = message;
        statusEl.classList.remove('hidden', 'bg-green-900/40', 'text-green-300', 'bg-red-900/40', 'text-red-300');
        statusEl.classList.add(ok ? 'bg-green-900/40' : 'bg-red-900/40', ok ? 'text-green-300' : 'text-red-300');
    };

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const data = Object.fromEntries(new FormData(contactForm));

        // Silently drop bot submissions (hidden honeypot was filled in)
        if (data.botcheck) return;

        if (!data.access_key || data.access_key.includes('PASTE')) {
            console.error('Web3Forms access key is missing in index.html');
            showStatus('The contact form is not set up yet. Please email me directly at renzey18@gmail.com.', false);
            return;
        }

        data.subject = `New portfolio message from ${data.name}`;
        data.replyto = data.email;

        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
        statusEl.classList.add('hidden');

        try {
            const res = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await res.json().catch(() => ({}));

            if (res.ok && result.success) {
                showStatus('Thank you! Your message has been sent. I\'ll get back to you soon.', true);
                contactForm.reset();
            } else {
                console.error('Web3Forms error:', result.message || res.status);
                showStatus('Sorry, your message could not be sent. Please try again or email me directly at renzey18@gmail.com.', false);
            }
        } catch (err) {
            console.error('Web3Forms network error:', err);
            showStatus('Sorry, your message could not be sent. Please check your connection or email me directly at renzey18@gmail.com.', false);
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Message';
        }
    });
}
