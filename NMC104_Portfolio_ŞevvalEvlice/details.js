function initDetailsPage() {
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

    // Parse URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const movieId = urlParams.get('id');

    if (movieId && typeof posterDatabase !== 'undefined' && posterDatabase[movieId]) {
        const movie = posterDatabase[movieId];
        
        // Populate HTML elements
        const imgEl = document.getElementById('movieImage');
        if (imgEl) {
            imgEl.src = movie.image;
            imgEl.alt = movie.title + ' Poster';
            
            // Reapply object-position if needed (like for fleabag/little women)
            if (movieId === 'fleabag' || movieId === 'little-women') {
                imgEl.style.objectPosition = 'top';
            }
        }
        
        const titleEl = document.getElementById('movieTitle');
        if (titleEl) titleEl.textContent = movie.title;
        
        const dirEl = document.getElementById('movieDirector');
        if (dirEl) dirEl.textContent = movie.director;
        
        const castEl = document.getElementById('movieCast');
        if (castEl) castEl.textContent = movie.cast;
        
        const descEl = document.getElementById('movieDescription');
        if (descEl) descEl.textContent = movie.description;
        
        document.title = movie.title + " | Frame by Şevval";
    } else {
        // Handle error if movie not found
        const titleEl = document.getElementById('movieTitle');
        if (titleEl) titleEl.textContent = "Poster Not Found";
        
        const descEl = document.getElementById('movieDescription');
        if (descEl) descEl.textContent = "We couldn't find the details for this poster. Please go back and try again.";
        
        const metaEl = document.querySelector('.details-meta');
        if (metaEl) metaEl.style.display = 'none';
        
        const imgEl = document.getElementById('movieImage');
        if (imgEl) imgEl.style.display = 'none';
    }
}

// Robust Page Loading: Executes immediately if the document has already parsed
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDetailsPage);
} else {
    initDetailsPage();
}

