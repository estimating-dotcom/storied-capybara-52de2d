/**
 * LionStone Floors - Interactive Features & Estimator Engine
 * Handles Real-Time Cost Estimator, Before/After Slider, Color Flake Visualizer, and Mobile Actions
 */

document.addEventListener('DOMContentLoaded', function() {
    initMegaMenus();
    initBeforeAfterSliders();
    initColorFlakeVisualizer();
    initSystemSpecSelector();
    initFloorAssessmentQuiz();
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
   3b. Engineering & System Specification Selector
   ========================================================================== */
function initSystemSpecSelector() {
    const selectorContainer = document.getElementById('lionstone-spec-selector');
    if (!selectorContainer) return;

    const specTabs = selectorContainer.querySelectorAll('.spec-env-btn');
    const elTitle = document.getElementById('spec-sys-title');
    const elBadge = document.getElementById('spec-sys-badge');
    const elDesc = document.getElementById('spec-sys-desc');
    const elPrep = document.getElementById('spec-val-prep');
    const elThickness = document.getElementById('spec-val-thickness');
    const elCompressive = document.getElementById('spec-val-compressive');
    const elCure = document.getElementById('spec-val-cure');
    const elChemistry = document.getElementById('spec-val-chemistry');
    const elApps = document.getElementById('spec-val-apps');
    const elCta = document.getElementById('spec-cta-btn');

    specTabs.forEach(btn => {
        btn.addEventListener('click', function() {
            specTabs.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const title = this.getAttribute('data-title');
            const badge = this.getAttribute('data-badge');
            const desc = this.getAttribute('data-desc');
            const prep = this.getAttribute('data-prep');
            const thickness = this.getAttribute('data-thickness');
            const compressive = this.getAttribute('data-compressive');
            const cure = this.getAttribute('data-cure');
            const chemistry = this.getAttribute('data-chemistry');
            const apps = this.getAttribute('data-apps');

            if (elTitle && title) elTitle.textContent = title;
            if (elBadge && badge) elBadge.textContent = badge;
            if (elDesc && desc) elDesc.textContent = desc;
            if (elPrep && prep) elPrep.textContent = prep;
            if (elThickness && thickness) elThickness.textContent = thickness;
            if (elCompressive && compressive) elCompressive.textContent = compressive;
            if (elCure && cure) elCure.textContent = cure;
            if (elChemistry && chemistry) elChemistry.textContent = chemistry;
            if (elApps && apps) elApps.textContent = apps;
            if (elCta && title) {
                elCta.href = `./contact.html?system=${encodeURIComponent(title)}`;
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
            <a href="./contact.html" class="sticky-btn sticky-btn-estimate" aria-label="Request Quote">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
                <span>Request Quote</span>
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

/* ==========================================================================
   6. Expandable Architectural Mega-Menus (Industries & Services)
   ========================================================================== */
function initMegaMenus() {
    const triggers = document.querySelectorAll('[data-ls-menu]');
    const menus = document.querySelectorAll('.ls-mega-menu');
    if (!triggers.length || !menus.length) return;

    function closeAllMenus() {
        menus.forEach(m => m.classList.remove('active'));
        triggers.forEach(t => t.classList.remove('active'));
    }

    triggers.forEach(trigger => {
        trigger.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const targetName = this.getAttribute('data-ls-menu');
            const targetMenu = document.querySelector(`.ls-mega-menu[data-ls-menu-panel="${targetName}"]`);
            if (!targetMenu) return;

            const wasActive = targetMenu.classList.contains('active');
            closeAllMenus();
            if (!wasActive) {
                targetMenu.classList.add('active');
                this.classList.add('active');
            }
        });
    });

    document.querySelectorAll('[data-ls-close-menu]').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            closeAllMenus();
        });
    });

    document.querySelectorAll('.ls-mega-menu a').forEach(link => {
        link.addEventListener('click', function() {
            closeAllMenus();
        });
    });

    document.addEventListener('click', function(e) {
        if (!e.target.closest('.ls-mega-menu') && !e.target.closest('[data-ls-menu]')) {
            closeAllMenus();
        }
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeAllMenus();
    });
}

/* ==========================================================================
   7. Interactive 60-Second Floor System Assessment Modal ("Quiz")
   ========================================================================== */
function initFloorAssessmentQuiz() {
    if (!document.getElementById('ls-quiz-modal-overlay')) {
        const modalHTML = `
        <div id="ls-quiz-modal-overlay" class="lionstone-modal-overlay" aria-hidden="true">
            <div class="ls-quiz-modal-card" role="dialog" aria-labelledby="ls-quiz-title">
                <div class="ls-quiz-header">
                    <div>
                        <span class="ls-eyebrow ls-eyebrow-light" style="font-size: 12px !important; margin-bottom: 2px;">60-Second Engineering Assessment</span>
                        <h4 id="ls-quiz-title">Find the Right Floor System for Your Space</h4>
                    </div>
                    <button type="button" id="ls-quiz-close-btn" class="ls-mega-close" aria-label="Close Assessment">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="ls-quiz-body" id="ls-quiz-step-container">
                    <!-- Dynamic step content injected here -->
                </div>
            </div>
        </div>`;
        const wrapper = document.createElement('div');
        wrapper.innerHTML = modalHTML;
        document.body.appendChild(wrapper.firstElementChild);
    }

    const overlay = document.getElementById('ls-quiz-modal-overlay');
    const stepContainer = document.getElementById('ls-quiz-step-container');
    const closeBtn = document.getElementById('ls-quiz-close-btn');

    const state = {
        facility: '',
        challenge: '',
        sqft: ''
    };

    function renderStep1() {
        stepContainer.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <span style="font-size: 12px; font-weight: 800; color: var(--ls-accent); text-transform: uppercase; letter-spacing: 0.08em;">Step 1 of 3 • Facility Type</span>
                <span style="font-size: 12px; color: var(--ls-text-muted);">33% Complete</span>
            </div>
            <h3 style="font-size: 24px; margin: 0 0 6px 0; color: var(--ls-primary);">What type of facility or space are you coating?</h3>
            <p style="font-size: 14px; color: var(--ls-text-muted); margin: 0;">Select the environment that best matches your project:</p>
            <div class="ls-quiz-options-grid">
                <button type="button" class="ls-quiz-option-btn" data-val="Manufacturing & Heavy Industrial">
                    <i class="fas fa-industry"></i>
                    <div><strong>Manufacturing & Plant</strong><span>Assembly lines, machine shops, heavy equipment</span></div>
                </button>
                <button type="button" class="ls-quiz-option-btn" data-val="Warehousing & Logistics">
                    <i class="fas fa-boxes"></i>
                    <div><strong>Warehouse & Logistics</strong><span>Distribution hubs, forklift aisles, safety lanes</span></div>
                </button>
                <button type="button" class="ls-quiz-option-btn" data-val="Food, Beverage & Cleanroom">
                    <i class="fas fa-flask"></i>
                    <div><strong>Food, Pharma & Cleanroom</strong><span>Sanitary washdown, labs, commercial kitchens</span></div>
                </button>
                <button type="button" class="ls-quiz-option-btn" data-val="Commercial, Retail & Stairwells">
                    <i class="fas fa-building"></i>
                    <div><strong>Commercial & Stair Towers</strong><span>Showrooms, schools, multi-tier stairs, ramps</span></div>
                </button>
                <button type="button" class="ls-quiz-option-btn" data-val="Automotive & Fleet Service Bays">
                    <i class="fas fa-wrench"></i>
                    <div><strong>Automotive & Service Bays</strong><span>Dealerships, fleet maintenance, aviation hangars</span></div>
                </button>
                <button type="button" class="ls-quiz-option-btn" data-val="Residential Garage & Basement">
                    <i class="fas fa-warehouse"></i>
                    <div><strong>Residential Garage / Basement</strong><span>Private showroom garages & moisture barriers</span></div>
                </button>
            </div>
        `;
        stepContainer.querySelectorAll('.ls-quiz-option-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                state.facility = this.getAttribute('data-val');
                renderStep2();
            });
        });
    }

    function renderStep2() {
        stepContainer.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <span style="font-size: 12px; font-weight: 800; color: var(--ls-accent); text-transform: uppercase; letter-spacing: 0.08em;">Step 2 of 3 • Operating Conditions</span>
                <span style="font-size: 12px; color: var(--ls-text-muted);">66% Complete</span>
            </div>
            <h3 style="font-size: 24px; margin: 0 0 6px 0; color: var(--ls-primary);">What is your primary operational requirement?</h3>
            <p style="font-size: 14px; color: var(--ls-text-muted); margin: 0;">Select the most critical performance factor for this slab:</p>
            <div class="ls-quiz-options-grid">
                <button type="button" class="ls-quiz-option-btn" data-val="Heavy Forklift & Impact Loads">
                    <i class="fas fa-dumbbell"></i>
                    <div><strong>Forklift & Heavy Impact</strong><span>High compressive strength & abrasion resistance</span></div>
                </button>
                <button type="button" class="ls-quiz-option-btn" data-val="Chemical, Acid & Oil Containment">
                    <i class="fas fa-vial"></i>
                    <div><strong>Chemical & Fluid Resistance</strong><span>Acids, solvents, hydraulic fluids, oils & salts</span></div>
                </button>
                <button type="button" class="ls-quiz-option-btn" data-val="Thermal Shock & Steam Washdown">
                    <i class="fas fa-temperature-high"></i>
                    <div><strong>Thermal Shock & Washdown</strong><span>Hot water/steam cleaning, USDA/FDA sanitation</span></div>
                </button>
                <button type="button" class="ls-quiz-option-btn" data-val="Spalled Concrete & Crack Remediation">
                    <i class="fas fa-hammer"></i>
                    <div><strong>Damaged Slab Restoration</strong><span>Cracks, spalling, trenches & moisture mitigation</span></div>
                </button>
                <button type="button" class="ls-quiz-option-btn" data-val="Rapid Turnaround / Minimal Downtime">
                    <i class="fas fa-bolt"></i>
                    <div><strong>Rapid Return to Service</strong><span>Weekend/overnight shutdown & fast-cure resins</span></div>
                </button>
                <button type="button" class="ls-quiz-option-btn" data-val="High-Traction Safety & Aesthetics">
                    <i class="fas fa-shield-alt"></i>
                    <div><strong>Slip-Resistance & Aesthetics</strong><span>OSHA walkways, safety quartz, flake or metallic</span></div>
                </button>
            </div>
            <div style="margin-top: 16px;">
                <button type="button" id="ls-quiz-back-1" style="background: none; border: none; color: var(--ls-text-muted); font-size: 13px; cursor: pointer; font-weight: 600;">&larr; Back to Step 1</button>
            </div>
        `;
        stepContainer.querySelectorAll('.ls-quiz-option-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                state.challenge = this.getAttribute('data-val');
                renderStep3();
            });
        });
        document.getElementById('ls-quiz-back-1').addEventListener('click', renderStep1);
    }

    function renderStep3() {
        stepContainer.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <span style="font-size: 12px; font-weight: 800; color: var(--ls-accent); text-transform: uppercase; letter-spacing: 0.08em;">Step 3 of 3 • Project Footprint</span>
                <span style="font-size: 12px; color: var(--ls-text-muted);">95% Complete</span>
            </div>
            <h3 style="font-size: 24px; margin: 0 0 6px 0; color: var(--ls-primary);">What is the approximate square footage?</h3>
            <p style="font-size: 14px; color: var(--ls-text-muted); margin: 0;">Helps our engineering team size grinding equipment and crew mobilization:</p>
            <div class="ls-quiz-options-grid">
                <button type="button" class="ls-quiz-option-btn" data-val="Under 1,000 sq. ft.">
                    <i class="fas fa-vector-square"></i>
                    <div><strong>Under 1,000 Sq. Ft.</strong><span>Single bays, ramps, stairwells, or garages</span></div>
                </button>
                <button type="button" class="ls-quiz-option-btn" data-val="1,000 – 5,000 sq. ft.">
                    <i class="fas fa-th-large"></i>
                    <div><strong>1,000 – 5,000 Sq. Ft.</strong><span>Commercial suites, kitchens, workshops & multi-bay</span></div>
                </button>
                <button type="button" class="ls-quiz-option-btn" data-val="5,000 – 25,000 sq. ft.">
                    <i class="fas fa-warehouse"></i>
                    <div><strong>5,000 – 25,000 Sq. Ft.</strong><span>Production floors, processing plants & warehouses</span></div>
                </button>
                <button type="button" class="ls-quiz-option-btn" data-val="25,000+ sq. ft.">
                    <i class="fas fa-globe-americas"></i>
                    <div><strong>25,000+ Sq. Ft.</strong><span>Large-scale industrial plants & distribution centers</span></div>
                </button>
            </div>
            <div style="margin-top: 16px;">
                <button type="button" id="ls-quiz-back-2" style="background: none; border: none; color: var(--ls-text-muted); font-size: 13px; cursor: pointer; font-weight: 600;">&larr; Back to Step 2</button>
            </div>
        `;
        stepContainer.querySelectorAll('.ls-quiz-option-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                state.sqft = this.getAttribute('data-val');
                renderResult();
            });
        });
        document.getElementById('ls-quiz-back-2').addEventListener('click', renderStep2);
    }

    function renderResult() {
        let recSystem = 'High-Build 100% Solids Industrial Epoxy + Polyurethane Topcoat';
        let recPrep = 'ICRI CSP 3–4 Planetary Diamond Grind & Joint Remediation';
        let recBuild = '40 – 125 mils Multi-Layer High-Build System';

        if (state.facility.includes('Food') || state.challenge.includes('Thermal')) {
            recSystem = 'Cementitious Urethane Mortar + Antimicrobial Quartz Broadcast';
            recPrep = 'ICRI CSP 4–5 Heavy Profiling + Integral Cove Base';
            recBuild = '3/16" to 3/8" (187–375 mils) Thermal-Shock System';
        } else if (state.challenge.includes('Chemical')) {
            recSystem = '100% Solids Novolac Chemical-Containment Epoxy System';
            recPrep = 'ICRI CSP 3–5 Diamond Grind + Trench/Crack Sealing';
            recBuild = '60 – 180 mils High Cross-Link Density System';
        } else if (state.facility.includes('Residential') || state.facility.includes('Automotive')) {
            recSystem = 'Full-Refusal Polyaspartic / Polyurea Flake Broadcast System';
            recPrep = 'ICRI CSP 2–3 Dustless HEPA Diamond Grind + Polyurea Crack Fill';
            recBuild = '35 – 50 mils UV-Stable Zero Hot-Tire Pickup System';
        } else if (state.facility.includes('Commercial')) {
            recSystem = 'High-Traction Architectural Quartz / Designer Metallic System';
            recPrep = 'ICRI CSP 2–3 Diamond Grind + Structural Spall Rebuild';
            recBuild = '35 – 80 mils + OSHA Safety Nosing / Non-Slip Topcoat';
        }

        const quoteUrl = `./contact.html?system=${encodeURIComponent(recSystem + ' (' + state.facility + ')')}&sqft=${encodeURIComponent(state.sqft)}`;

        stepContainer.innerHTML = `
            <div style="background: #F0FDF4; border: 1px solid #86EFAC; padding: 12px 16px; border-radius: 6px; margin-bottom: 18px; display: flex; align-items: center; gap: 10px; color: #166534; font-size: 13px; font-weight: 700;">
                <i class="fas fa-check-circle" style="font-size: 18px; color: #16A34A;"></i>
                <span>Recommended LionStone Specification Matched for ${state.facility}</span>
            </div>
            <h3 style="font-size: 25px; margin: 0 0 10px 0; color: var(--ls-primary);">${recSystem}</h3>
            <div style="background: var(--ls-bg-light); border-left: 4px solid var(--ls-accent); padding: 16px; margin-bottom: 20px; display: grid; gap: 8px; font-size: 13.5px;">
                <div><strong><i class="fas fa-drafting-compass" style="color: var(--ls-accent); width: 18px;"></i> Surface Preparation:</strong> ${recPrep}</div>
                <div><strong><i class="fas fa-layer-group" style="color: var(--ls-accent); width: 18px;"></i> System Build Profile:</strong> ${recBuild}</div>
                <div><strong><i class="fas fa-bullseye" style="color: var(--ls-accent); width: 18px;"></i> Primary Focus:</strong> ${state.challenge} (${state.sqft})</div>
            </div>
            <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center;">
                <a href="${quoteUrl}" class="btn-ls-primary" style="flex: 1; justify-content: center;">
                    Request Site Visit & Quote for This Spec <i class="fas fa-arrow-right"></i>
                </a>
                <button type="button" id="ls-quiz-restart" style="background: none; border: 1px solid var(--ls-border); padding: 12px 16px; border-radius: 4px; font-size: 13px; font-weight: 700; cursor: pointer; color: var(--ls-text-dark);">
                    Start Over
                </button>
            </div>
        `;
        document.getElementById('ls-quiz-restart').addEventListener('click', renderStep1);
    }

    function openQuiz(e) {
        if (e) e.preventDefault();
        renderStep1();
        overlay.classList.add('active');
        overlay.setAttribute('aria-hidden', 'false');
    }

    function closeQuiz() {
        overlay.classList.remove('active');
        overlay.setAttribute('aria-hidden', 'true');
    }

    document.querySelectorAll('[data-open-floor-quiz]').forEach(btn => {
        btn.addEventListener('click', openQuiz);
    });

    if (closeBtn) closeBtn.addEventListener('click', closeQuiz);
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) closeQuiz();
    });
}
