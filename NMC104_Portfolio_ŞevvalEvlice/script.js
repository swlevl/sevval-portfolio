document.addEventListener('DOMContentLoaded', () => {
    // Hamburger menu toggle
    const hamburger = document.getElementById('hamburger');
    const navContent = document.getElementById('navContent');

    if (hamburger && navContent) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navContent.classList.toggle('active');
            // Prevent scrolling when menu is open
            document.body.style.overflow = navContent.classList.contains('active') ? 'hidden' : '';
        });
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            // Close mobile menu if open
            if (hamburger && navContent) {
                hamburger.classList.remove('active');
                navContent.classList.remove('active');
                document.body.style.overflow = '';
            }

            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Intersection Observer for scroll animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: unobserve after revealing if you only want it to happen once
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all poster cards
    const posterCards = document.querySelectorAll('.poster-card');
    
    // Stagger the animations slightly based on index
    posterCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(card);
    });

    // Hero Slider Logic
    const sliderItems = document.querySelectorAll('.slider-item');
    if (sliderItems.length > 0) {
        let currentIndex = 0;
        
        function updateSlider() {
            // Remove classes from all items
            sliderItems.forEach(item => {
                item.classList.remove('active', 'prev', 'next');
            });
            
            // Calculate indices
            const prevIndex = (currentIndex - 1 + sliderItems.length) % sliderItems.length;
            const nextIndex = (currentIndex + 1) % sliderItems.length;
            
            // Add classes
            sliderItems[currentIndex].classList.add('active');
            sliderItems[prevIndex].classList.add('prev');
            sliderItems[nextIndex].classList.add('next');
        }
        
        // Initialize
        updateSlider();
        
        // Auto-slide every 2 seconds
        let sliderInterval = setInterval(() => {
            currentIndex = (currentIndex + 1) % sliderItems.length;
            updateSlider();
        }, 2000);

        // Optional: Pause on hover
        const heroSlider = document.querySelector('.hero-slider');
        heroSlider.addEventListener('mouseenter', () => clearInterval(sliderInterval));
        heroSlider.addEventListener('mouseleave', () => {
            sliderInterval = setInterval(() => {
                currentIndex = (currentIndex + 1) % sliderItems.length;
                updateSlider();
            }, 2000);
        });

        // Click to slide
        const sliderIds = ['kill-bill', 'fleabag', 'whiplash', 'aftersun', 'little-women', 'pearl'];

        sliderItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                if (!item.classList.contains('active')) {
                    currentIndex = index;
                    updateSlider();
                } else {
                    window.location.href = `details.html?id=${sliderIds[index]}`;
                }
            });
        });
    }

    // Search functionality
    const searchInput = document.getElementById('posterSearch');
    if (searchInput) {
        // Automatically scroll to posters when clicking the search bar
        searchInput.addEventListener('focus', () => {
            const workSection = document.getElementById('work');
            if (workSection && window.innerWidth > 768) {
                // Adjust scroll position to account for sticky header
                const headerOffset = 80;
                const elementPosition = workSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });

        searchInput.addEventListener('input', (e) => {
            // Normalize Turkish i/ı/I/İ characters to standard lowercase 'i' for robust searching
            const normalize = (str) => {
                return str.replace(/İ/g, 'i')
                          .replace(/ı/g, 'i')
                          .replace(/I/g, 'i')
                          .toLowerCase();
            };
            
            const searchTerm = normalize(e.target.value);
            
            posterCards.forEach(card => {
                const title = normalize(card.querySelector('.poster-overlay span').textContent);
                if (title.includes(searchTerm)) {
                    card.style.display = 'block';
                    setTimeout(() => card.classList.add('visible'), 50);
                } else {
                    card.style.display = 'none';
                    card.classList.remove('visible');
                }
            });
        });

        // Go to selected poster on Enter
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                
                // Close mobile menu if open
                const hamburger = document.getElementById('hamburger');
                const navContent = document.getElementById('navContent');
                if (hamburger && navContent && navContent.classList.contains('active')) {
                    hamburger.classList.remove('active');
                    navContent.classList.remove('active');
                    document.body.style.overflow = '';
                }

                // Find first visible poster and scroll to it
                const visibleCard = Array.from(posterCards).find(card => card.style.display !== 'none');
                if (visibleCard) {
                    const headerOffset = 100;
                    const elementPosition = visibleCard.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
                
                searchInput.blur(); // Remove focus from input
            }
        });
    }
});
