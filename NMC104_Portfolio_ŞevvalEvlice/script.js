function init() {
    // Hamburger menu toggle
    const hamburger = document.getElementById('hamburger');
    const navContent = document.getElementById('navContent');

    if (hamburger && navContent) {
        function toggleHamburger() {
            const expanded = hamburger.getAttribute('aria-expanded') === 'true';
            hamburger.setAttribute('aria-expanded', !expanded);
            hamburger.classList.toggle('active');
            navContent.classList.toggle('active');
            // Prevent scrolling when menu is open
            document.body.style.overflow = navContent.classList.contains('active') ? 'hidden' : '';
        }

        hamburger.addEventListener('click', toggleHamburger);
        
        hamburger.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleHamburger();
            }
        });
    }

    // Modal Injection & Logic
    const modalHTML = `
    <div id="posterModal" class="modal" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
        <div class="modal-content">
            <button class="close-modal" aria-label="Close details dialog">&times;</button>
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
    const closeModalBtn = modal.querySelector('.close-modal');
    let focusedElementBeforeModal = null;

    function openModal(id) {
        if (typeof posterDatabase !== 'undefined' && posterDatabase[id]) {
            const data = posterDatabase[id];
            
            // Save active element for focus restoration
            focusedElementBeforeModal = document.activeElement;

            const modalImg = document.getElementById('modalImage');
            modalImg.src = data.image;
            modalImg.alt = data.title + ' cinematic poster';
            
            if (id === 'fleabag' || id === 'little-women') {
                modalImg.style.objectPosition = 'top';
            } else {
                modalImg.style.objectPosition = 'center';
            }
            
            document.getElementById('modalTitle').textContent = data.title;
            document.getElementById('modalDirector').textContent = data.director;
            document.getElementById('modalCast').textContent = data.cast;
            document.getElementById('modalDesc').textContent = data.description;
            
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
            
            // Focus the close button for instant keyboard context
            setTimeout(() => {
                closeModalBtn.focus();
            }, 100);
        }
    }

    function closeModal() {
        modal.classList.remove('show');
        document.body.style.overflow = '';
        
        // Restore focus to original trigger element
        if (focusedElementBeforeModal) {
            focusedElementBeforeModal.focus();
            focusedElementBeforeModal = null;
        }
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Trap focus inside modal & close on Escape key (WCAG Focus Trap)
    modal.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
            return;
        }
        
        if (e.key === 'Tab') {
            const focusables = Array.from(modal.querySelectorAll('button, a, input, [tabindex="0"]'));
            if (focusables.length === 0) return;
            
            const first = focusables[0];
            const last = focusables[focusables.length - 1];
            
            if (e.shiftKey) {
                if (document.activeElement === first) {
                    last.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === last) {
                    first.focus();
                    e.preventDefault();
                }
            }
        }
    });

    // View Controls Toggle Logic (Dropdown - Compact Default on Mobile)
    const btnBig = document.getElementById('btn-big');
    const btnCompact = document.getElementById('btn-compact');
    const gallery = document.querySelector('.gallery');
    const viewSettingsBtn = document.getElementById('view-settings-btn');
    const viewDropdown = document.getElementById('view-dropdown');

    function initViewMode() {
        if (!gallery || !btnBig || !btnCompact) return;
        
        const isMobile = window.innerWidth <= 768;
        if (isMobile) {
            // Mobile: Default to Compact View (2 columns)
            gallery.classList.add('compact-view');
            btnCompact.classList.add('active');
            btnCompact.setAttribute('aria-checked', 'true');
            btnBig.classList.remove('active');
            btnBig.setAttribute('aria-checked', 'false');
        } else {
            // Desktop: Default to Big View (4 columns)
            gallery.classList.remove('compact-view');
            btnBig.classList.add('active');
            btnBig.setAttribute('aria-checked', 'true');
            btnCompact.classList.remove('active');
            btnCompact.setAttribute('aria-checked', 'false');
        }
    }

    function toggleDropdown() {
        const isOpen = viewDropdown.classList.contains('show');
        viewDropdown.classList.toggle('show', !isOpen);
        viewSettingsBtn.classList.toggle('active', !isOpen);
        viewSettingsBtn.setAttribute('aria-expanded', !isOpen);
        if (!isOpen) {
            // Dropdown opened, focus the first item
            setTimeout(() => btnCompact.focus(), 50);
        }
    }

    function closeDropdown() {
        viewDropdown.classList.remove('show');
        viewSettingsBtn.classList.remove('active');
        viewSettingsBtn.setAttribute('aria-expanded', 'false');
    }

    if (viewSettingsBtn && viewDropdown) {
        viewSettingsBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleDropdown();
        });

        viewSettingsBtn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
                e.preventDefault();
                toggleDropdown();
            }
        });

        // Close dropdown when clicking outside
        window.addEventListener('click', (e) => {
            if (!viewDropdown.contains(e.target) && !viewSettingsBtn.contains(e.target)) {
                closeDropdown();
            }
        });

        // Dropdown internal keyboard navigation
        viewDropdown.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeDropdown();
                viewSettingsBtn.focus();
                e.preventDefault();
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (document.activeElement === btnCompact) {
                    btnBig.focus();
                } else {
                    btnCompact.focus();
                }
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (document.activeElement === btnBig) {
                    btnCompact.focus();
                } else {
                    btnBig.focus();
                }
            } else if (e.key === 'Tab') {
                // Let Tab close dropdown naturally to prevent keyboard trap
                closeDropdown();
            }
        });
    }

    if (btnBig && btnCompact && gallery) {
        // Initialize layout on page load
        initViewMode();

        function setBigLayout() {
            gallery.classList.remove('compact-view');
            btnBig.classList.add('active');
            btnBig.setAttribute('aria-checked', 'true');
            btnCompact.classList.remove('active');
            btnCompact.setAttribute('aria-checked', 'false');
            closeDropdown();
            viewSettingsBtn.focus();
        }

        function setCompactLayout() {
            gallery.classList.add('compact-view');
            btnCompact.classList.add('active');
            btnCompact.setAttribute('aria-checked', 'true');
            btnBig.classList.remove('active');
            btnBig.setAttribute('aria-checked', 'false');
            closeDropdown();
            viewSettingsBtn.focus();
        }

        btnBig.addEventListener('click', setBigLayout);
        btnBig.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setBigLayout();
            }
        });

        btnCompact.addEventListener('click', setCompactLayout);
        btnCompact.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setCompactLayout();
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
                hamburger.setAttribute('aria-expanded', 'false');
                navContent.classList.remove('active');
                document.body.style.overflow = '';
            }

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Set keyboard focus on skipped-to section
                target.setAttribute('tabindex', '-1');
                target.focus({ preventScroll: true });
            }
        });
    });

    // Intersection Observer for scroll animations (Robust 0.05 Threshold)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.05
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe all poster cards
    const posterCards = document.querySelectorAll('.poster-card');
    
    // Stagger the animations slightly based on index
    posterCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.08}s`;
        observer.observe(card);

        // Intercept clicks to open modal instead of navigation
        card.addEventListener('click', (e) => {
            e.preventDefault();
            const href = card.getAttribute('href');
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
        
        // Auto-slide every 2.5 seconds
        let sliderInterval = setInterval(() => {
            currentIndex = (currentIndex + 1) % sliderItems.length;
            updateSlider();
        }, 2500);

        // Pause on hover or focus
        const heroSlider = document.querySelector('.hero-slider');
        if (heroSlider) {
            heroSlider.addEventListener('mouseenter', () => clearInterval(sliderInterval));
            heroSlider.addEventListener('mouseleave', () => {
                clearInterval(sliderInterval);
                sliderInterval = setInterval(() => {
                    currentIndex = (currentIndex + 1) % sliderItems.length;
                    updateSlider();
                }, 2500);
            });
            
            // Keyboard focus pausing
            heroSlider.addEventListener('focusin', () => clearInterval(sliderInterval));
            heroSlider.addEventListener('focusout', () => {
                clearInterval(sliderInterval);
                sliderInterval = setInterval(() => {
                    currentIndex = (currentIndex + 1) % sliderItems.length;
                    updateSlider();
                }, 2500);
            });
        }

        // Click & Keyboard support to slide
        const sliderIds = ['kill-bill', 'fleabag', 'whiplash', 'aftersun', 'little-women', 'pearl', 'emma', 'how-to-lose-a-guy'];

        sliderItems.forEach((item, index) => {
            function handleSliderInteraction() {
                if (!item.classList.contains('active')) {
                    currentIndex = index;
                    updateSlider();
                } else {
                    openModal(sliderIds[index]);
                }
            }

            item.addEventListener('click', handleSliderInteraction);
            item.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleSliderInteraction();
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
                if (hamburger && navContent && navContent.classList.contains('active')) {
                    hamburger.classList.remove('active');
                    hamburger.setAttribute('aria-expanded', 'false');
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
                    visibleCard.focus();
                }
                
                searchInput.blur();
            }
        });
    }
}

// Robust Page Loading: Executes immediately if the document has already parsed
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

