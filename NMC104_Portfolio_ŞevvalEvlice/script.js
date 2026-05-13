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

    // Modal Injection & Logic
    const modalHTML = `
    <div id="posterModal" class="modal">
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <div class="modal-layout">
                <div class="modal-image-container">
                    <img id="modalImage" src="" alt="">
                </div>
                <div class="modal-info">
                    <h2 id="modalTitle"></h2>
                    <div class="modal-meta">
                        <p><strong>Director:</strong> <span id="modalDirector"></span></p>
                        <p><strong>Cast:</strong> <span id="modalCast"></span></p>
                    </div>
                    <div class="modal-description">
                        <p id="modalDesc"></p>
                    </div>
                </div>
            </div>
        </div>
    </div>`;
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    const modal = document.getElementById('posterModal');
    const closeModalBtn = document.querySelector('.close-modal');

    function openModal(id) {
        if (typeof posterDatabase !== 'undefined' && posterDatabase[id]) {
            const data = posterDatabase[id];
            document.getElementById('modalImage').src = data.image;
            document.getElementById('modalImage').alt = data.title;
            if (id === 'fleabag' || id === 'little-women') {
                document.getElementById('modalImage').style.objectPosition = 'top';
            } else {
                document.getElementById('modalImage').style.objectPosition = 'center';
            }
            document.getElementById('modalTitle').textContent = data.title;
            document.getElementById('modalDirector').textContent = data.director;
            document.getElementById('modalCast').textContent = data.cast;
            document.getElementById('modalDesc').textContent = data.description;
            
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            modal.classList.remove('show');
            document.body.style.overflow = '';
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
            document.body.style.overflow = '';
        }
    });

    // View Controls Toggle Logic
    const btnBig = document.getElementById('btn-big');
    const btnCompact = document.getElementById('btn-compact');
    const gallery = document.querySelector('.gallery');
    const viewSettingsBtn = document.getElementById('view-settings-btn');
    const viewDropdown = document.getElementById('view-dropdown');

    if (viewSettingsBtn && viewDropdown) {
        viewSettingsBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            viewDropdown.classList.toggle('show');
            viewSettingsBtn.classList.toggle('active');
        });

        window.addEventListener('click', (e) => {
            if (!viewDropdown.contains(e.target) && !viewSettingsBtn.contains(e.target)) {
                viewDropdown.classList.remove('show');
                viewSettingsBtn.classList.remove('active');
            }
        });
    }

    if (btnBig && btnCompact && gallery) {
        btnBig.addEventListener('click', () => {
            gallery.classList.remove('compact-view');
            btnBig.classList.add('active');
            btnCompact.classList.remove('active');
            if (viewDropdown) {
                viewDropdown.classList.remove('show');
                viewSettingsBtn.classList.remove('active');
            }
        });
        btnCompact.addEventListener('click', () => {
            gallery.classList.add('compact-view');
            btnCompact.classList.add('active');
            btnBig.classList.remove('active');
            if (viewDropdown) {
                viewDropdown.classList.remove('show');
                viewSettingsBtn.classList.remove('active');
            }
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

        // Intercept clicks to open modal instead of navigation
        card.addEventListener('click', (e) => {
            e.preventDefault();
            const href = card.getAttribute('href');
            // Extract the 'id' parameter manually
            const idParam = href.split('id=')[1];
            if (idParam) {
                openModal(idParam);
            }
        });
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
                    openModal(sliderIds[index]);
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
