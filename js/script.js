// Main Script
document.addEventListener('DOMContentLoaded', () => {

    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }

    // Smooth Scroll for Navigation Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            // Close mobile menu if open
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                menuToggle.classList.remove('active');
            }

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Adjust for fixed header
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // Scroll Reveal Animation
    const revealElements = document.querySelectorAll('.section-header, .about-content, .skills-grid, .services-grid, .projects-grid, .certificates-grid, .contact-wrapper, .hero-content, .hero-image-wrapper, .stat-card, #stats .section-header, .project-card');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, {
        root: null,
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => {
        el.classList.add('reveal');
        revealObserver.observe(el);
    });

    // Fetch Stats
    const fetchStats = async () => {
        // Fetch GitHub Repos
        try {
            const githubRes = await fetch('https://api.github.com/users/vigneshvl-dev');
            const githubData = await githubRes.json();
            if (githubData.public_repos !== undefined) {
                document.getElementById('github-repo-count').innerText = githubData.public_repos;
            }
        } catch (error) {
            console.error('Error fetching GitHub stats:', error);
            document.getElementById('github-repo-count').innerText = '15+'; // Fallback
        }

        // Fetch LeetCode Solved (Vercel-hosted community API)
        try {
            const leetcodeRes = await fetch('https://leetcode-api-faisalshohag.vercel.app/vigneshvl');
            const leetcodeData = await leetcodeRes.json();
            if (leetcodeData.totalSolved !== undefined) {
                document.getElementById('leetcode-solved-count').innerText = leetcodeData.totalSolved;
            } else {
                document.getElementById('leetcode-solved-count').innerText = '71'; // Known fallback
            }
        } catch (error) {
            console.error('Error fetching LeetCode stats:', error);
            document.getElementById('leetcode-solved-count').innerText = '71'; // Known fallback
        }
    };

    fetchStats();

    // Typewriter Effect for Hero Subtitle
    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (heroSubtitle) {
        const text = heroSubtitle.innerText;
        heroSubtitle.innerHTML = '';
        heroSubtitle.style.opacity = '1';

        let i = 0;
        function typeWriter() {
            if (i < text.length) {
                if (text.charAt(i) === '|') {
                    heroSubtitle.innerHTML += '<span class="divider">|</span>';
                } else {
                    heroSubtitle.innerHTML += text.charAt(i);
                }
                i++;
                setTimeout(typeWriter, 50);
            }
        }

        // Start typewriter after a short delay
        setTimeout(typeWriter, 1000);
    }

    // --- Featured Project Gallery Modal Logic ---
    const galleryModal = document.getElementById('gallery-modal');
    const viewProjectBtn = document.getElementById('view-project-btn');
    const closeGallery = document.querySelector('.close-gallery');
    const nextBtn = document.querySelector('.next-gallery');
    const prevBtn = document.querySelector('.prev-gallery');
    const galleryImages = document.querySelectorAll('.gallery-img');
    const galleryDots = document.querySelectorAll('.dot-gallery');

    let slideIndex = 1;

    if (viewProjectBtn && galleryModal) {
        viewProjectBtn.onclick = () => {
            galleryModal.style.display = "block";
            document.body.style.overflow = "hidden"; // Prevent scroll
            showSlides(slideIndex);
        }

        closeGallery.onclick = () => {
            galleryModal.style.display = "none";
            document.body.style.overflow = "auto";
        }

        window.onclick = (event) => {
            if (event.target == galleryModal) {
                galleryModal.style.display = "none";
                document.body.style.overflow = "auto";
            }
        }

        // Next/previous controls
        nextBtn.onclick = () => showSlides(slideIndex += 1);
        prevBtn.onclick = () => showSlides(slideIndex -= 1);

        // Dot controls
        window.currentSlide = (n) => showSlides(slideIndex = n);

        function showSlides(n) {
            if (n > galleryImages.length) { slideIndex = 1 }
            if (n < 1) { slideIndex = galleryImages.length }

            galleryImages.forEach(img => img.classList.remove('active'));
            galleryDots.forEach(dot => dot.classList.remove('active'));

            galleryImages[slideIndex - 1].classList.add('active');
            galleryDots[slideIndex - 1].classList.add('active');
        }
    }

    // --- Chat Card Mouse Parallax Effect ---
    const chatCard = document.querySelector('.chat-card');
    const mockupWrapper = document.querySelector('.chat-mockup-wrapper');

    if (chatCard && mockupWrapper) {
        mockupWrapper.addEventListener('mousemove', (e) => {
            const rect = mockupWrapper.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;

            chatCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
            chatCard.classList.remove('floating-animation'); // Pause floating while interacting
        });

        mockupWrapper.addEventListener('mouseleave', () => {
            chatCard.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)`;
            chatCard.classList.add('floating-animation'); // Resume floating
        });
    }
});
