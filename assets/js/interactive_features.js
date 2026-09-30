/**
 * LionStone Floors - Interactive Features & Estimator Engine
 * Handles Real-Time Cost Estimator, Before/After Slider, Color Flake Visualizer, and Mobile Actions
 */

document.addEventListener('DOMContentLoaded', function() {
    initBeforeAfterSliders();
    initColorFlakeVisualizer();
    initStickyMobileBar();
    initGalleryFilters();
});

/* ==========================================================================
   2. Interactive Before / After Split Slider
   ========================================================================== */
function initBeforeAfterSliders() {
    const tabBtns = document.querySelectorAll('.ba-tab-btn');
    const imgBefore = document.getElementById('ba-img-before');
    const imgAfter = document.getElementById('ba-img-after');
    const badgeBefore = document.getElementById('ba-badge-before');
    const badgeAfter = document.getElementById('ba-badge-after');
    const captionText = document.getElementById('ba-caption-text');

    if (tabBtns.length && imgBefore && imgAfter) {
        tabBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                tabBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');

                const beforeSrc = this.getAttribute('data-before');
                const afterSrc = this.getAttribute('data-after');
                const beforeLabel = this.getAttribute('data-before-label') || 'Untreated Concrete';
                const afterLabel = this.getAttribute('data-after-label') || 'LionStone System';
                const caption = this.getAttribute('data-caption') || '';

                if (beforeSrc) imgBefore.src = beforeSrc;
                if (afterSrc) imgAfter.src = afterSrc;
                if (badgeBefore) badgeBefore.textContent = beforeLabel;
                if (badgeAfter) badgeAfter.textContent = afterLabel;
                if (captionText) captionText.textContent = caption;

                // Reset slider position to 50%
                const sliders = document.querySelectorAll('.lionstone-before-after-container');
                sliders.forEach(slider => {
                    const afterWrapper = slider.querySelector('.after-image-wrapper');
                    const handle = slider.querySelector('.slider-handle');
                    if (afterWrapper && handle) {
                        afterWrapper.style.width = '50%';
                        handle.style.left = '50%';
                        const innerImg = afterWrapper.querySelector('img');
                        if (innerImg) innerImg.style.width = slider.offsetWidth + 'px';
                    }
                });
            });
        });
    }

    const sliders = document.querySelectorAll('.lionstone-before-after-container');
    sliders.forEach(slider => {
        const afterImg = slider.querySelector('.after-image-wrapper');
        const handle = slider.querySelector('.slider-handle');
        if (!afterImg || !handle) return;

        let isDragging = false;

        function syncImgWidth() {
            const innerImg = afterImg.querySelector('img');
            if (innerImg) {
                innerImg.style.width = slider.offsetWidth + 'px';
            }
        }
        syncImgWidth();
        window.addEventListener('resize', syncImgWidth);

        function updatePosition(clientX) {
            const rect = slider.getBoundingClientRect();
            let x = clientX - rect.left;
            if (x < 0) x = 0;
            if (x > rect.width) x = rect.width;

            const percentage = (x / rect.width) * 100;
            afterImg.style.width = percentage + '%';
            handle.style.left = percentage + '%';
        }

        slider.addEventListener('mousedown', (e) => {
            isDragging = true;
            updatePosition(e.clientX);
        });

        window.addEventListener('mouseup', () => {
            isDragging = false;
        });

        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            updatePosition(e.clientX);
        });

        // Touch support
        slider.addEventListener('touchstart', (e) => {
            isDragging = true;
            if (e.touches.length > 0) {
                updatePosition(e.touches[0].clientX);
            }
        }, { passive: true });

        window.addEventListener('touchend', () => {
            isDragging = false;
        });

        window.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            if (e.touches.length > 0) {
                updatePosition(e.touches[0].clientX);
            }
        }, { passive: true });
    });
}

/* ==========================================================================
   3. Color Flake & Finish Visualizer
   ========================================================================== */
function initColorFlakeVisualizer() {
    const swatchContainer = document.getElementById('lionstone-swatch-container');
    if (!swatchContainer) return;

    const previewTitle = document.getElementById('swatch-active-title');
    const previewDesc = document.getElementById('swatch-active-desc');
    const previewImage = document.getElementById('swatch-active-image');
    const sampleBtn = swatchContainer.querySelector('a.btn-ls-primary');
    const swatches = swatchContainer.querySelectorAll('.swatch-item');

    swatches.forEach(swatch => {
        swatch.addEventListener('click', function() {
            swatches.forEach(s => s.classList.remove('active'));
            this.classList.add('active');

            const name = this.getAttribute('data-name');
            const desc = this.getAttribute('data-desc');
            const img = this.getAttribute('data-img');

            if (previewTitle && name) previewTitle.textContent = name;
            if (previewDesc && desc) previewDesc.textContent = desc;
            if (previewImage && img) previewImage.src = img;
            if (sampleBtn && name) {
                sampleBtn.href = `./contact.html?sample=${encodeURIComponent(name)}`;
            }
        });
    });
}

/* ==========================================================================
   4. Sticky Mobile Action Bar
   ========================================================================== */
function initStickyMobileBar() {
    // Check if already injected
    if (document.getElementById('lionstone-mobile-action-bar')) return;

    const mobileBarHTML = `
        <div id="lionstone-mobile-action-bar" class="lionstone-mobile-sticky-bar">
            <a href="tel:8608050061" class="sticky-btn sticky-btn-call" aria-label="Call LionStone Floors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
                <span>Call (860) 805-0061</span>
            </a>
            <a href="./contact.html" class="sticky-btn sticky-btn-estimate" aria-label="Request Free Estimate">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
                <span>Free Estimate</span>
            </a>
        </div>
    `;

    const div = document.createElement('div');
    div.innerHTML = mobileBarHTML;
    document.body.appendChild(div.firstElementChild);
}

/* ==========================================================================
   5. Gallery Tab Filtering
   ========================================================================== */
function initGalleryFilters() {
    const filterBtns = document.querySelectorAll('.gallery-filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-grid-item');
    if (!filterBtns.length || !galleryItems.length) return;

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const filter = this.getAttribute('data-filter');

            galleryItems.forEach(item => {
                const category = item.getAttribute('data-category') || '';
                const categories = category.toLowerCase().split(/\s+/);
                if (filter === 'all' || categories.includes(filter)) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 250);
                }
            });
        });
    });
}
