/**
 * LionStone Floors - Form Submission Engine v2
 * 
 * Production: Native HTML form POST to Web3Forms API which emails
 *             all fields directly to estimating@lionstonefloors.com.
 *             After submission, customer is redirected to /calendar/ confirmation page.
 * 
 * NO modals, NO mailto buttons, NO preventDefault — pure native form submission.
 */

document.addEventListener('DOMContentLoaded', function() {
    const FLOORLAUNCH_WEBHOOK = window.LIONSTONE_FLOORLAUNCH_WEBHOOK || "";

    // 1. Setup "Other" Project Type toggle listeners
    const projectSelects = document.querySelectorAll('.project-type-select');
    projectSelects.forEach(select => {
        select.addEventListener('change', function() {
            const parent = this.closest('div');
            const otherWrapper = parent ? parent.querySelector('.project-type-other-wrapper') : null;
            const customInput = otherWrapper ? otherWrapper.querySelector('input') : null;
            if (this.value === 'Other') {
                if (otherWrapper) otherWrapper.style.display = 'block';
                if (customInput) customInput.focus();
            } else {
                if (otherWrapper) otherWrapper.style.display = 'none';
                if (customInput) customInput.value = '';
            }
        });
    });

    // 2. Handle form submission enhancements (does NOT prevent default — form submits natively)
    const forms = document.querySelectorAll('form.native-estimate-form');
    forms.forEach((form) => {
        form.addEventListener('submit', function(e) {
            // If "Other" project type is selected, inject the custom value into the select
            const projSelect = form.querySelector('.project-type-select');
            const customInput = form.querySelector('.form-project-type-other');
            if (projSelect && projSelect.value === 'Other' && customInput && customInput.value.trim()) {
                const customVal = customInput.value.trim();
                const opt = document.createElement('option');
                opt.value = customVal;
                opt.text = customVal;
                opt.selected = true;
                projSelect.appendChild(opt);
            }

            // Store in localStorage backup
            try {
                const formData = new FormData(form);
                const leadObj = {
                    name: formData.get('name') || '',
                    phone: formData.get('phone') || '',
                    email: formData.get('email') || '',
                    city: formData.get('city') || '',
                    project_type: formData.get('project_type') || '',
                    sqft: formData.get('sqft') || '',
                    message: formData.get('message') || ''
                };
                const stored = JSON.parse(localStorage.getItem('lionstone_leads') || '[]');
                stored.push({ timestamp: new Date().toISOString(), ...leadObj });
                localStorage.setItem('lionstone_leads', JSON.stringify(stored));
            } catch (err) {
                console.warn('LocalStorage backup error:', err);
            }

            // FloorLaunch / CRM webhook dispatch (if configured)
            if (FLOORLAUNCH_WEBHOOK) {
                try {
                    const fd = new FormData(form);
                    if (navigator.sendBeacon) {
                        navigator.sendBeacon(FLOORLAUNCH_WEBHOOK, JSON.stringify({
                            full_name: fd.get('name') || '',
                            phone: fd.get('phone') || '',
                            email: fd.get('email') || '',
                            appointment_notes: `[City: ${fd.get('city') || ''} | ${fd.get('project_type') || ''} | ${fd.get('sqft') || ''}]\n${fd.get('message') || ''}`
                        }));
                    }
                } catch(err) {
                    console.log('FloorLaunch dispatch error:', err);
                }
            }

            // Show submitting indicator on the button
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Transmitting Estimate Request...';
            }
            // Form continues with native POST to https://api.web3forms.com/submit
            // Web3Forms then redirects customer to /calendar/ confirmation page
        });
    });

    // 3. Handle auto-population from URL parameters (e.g. from service pages, Spec Selector, or Swatch Visualizer)
    const urlParams = new URLSearchParams(window.location.search);
    const messageInput = document.getElementById('form-message-input') || document.querySelector('textarea[name="message"]');
    const projectTypeSelect = document.getElementById('form-project-type') || document.querySelector('select[name="project_type"]');

    if (urlParams.has('system')) {
        const system = urlParams.get('system') || 'Industrial Resinous Coating';
        if (messageInput) {
            messageInput.value = `[System Specification Inquiry]: ${system}\nRequesting project evaluation and formal quote.`;
        }
        if (projectTypeSelect) {
            const sysLower = system.toLowerCase();
            if (sysLower.includes('warehouse') || sysLower.includes('logistics')) {
                projectTypeSelect.value = 'Warehouse / Logistics';
            } else if (sysLower.includes('cleanroom') || sysLower.includes('food') || sysLower.includes('urethane') || sysLower.includes('sanitary')) {
                projectTypeSelect.value = 'Food & Beverage / Cleanroom';
            } else if (sysLower.includes('stair') || sysLower.includes('walkway') || sysLower.includes('stain')) {
                projectTypeSelect.value = 'Stairwell / Walkway Safety';
            } else if (sysLower.includes('commercial') || sysLower.includes('retail') || sysLower.includes('metallic')) {
                projectTypeSelect.value = 'Commercial Facility';
            } else if (sysLower.includes('automotive') || sysLower.includes('fleet')) {
                projectTypeSelect.value = 'Automotive / Fleet Bays';
            } else if (sysLower.includes('garage') || sysLower.includes('flake')) {
                projectTypeSelect.value = 'Garage Flake Floor';
            } else if (sysLower.includes('basement') || sysLower.includes('moisture')) {
                projectTypeSelect.value = 'Basement Floor';
            } else {
                projectTypeSelect.value = 'Manufacturing Facility';
            }
        }
    } else if (urlParams.has('sample')) {
        const sample = urlParams.get('sample');
        if (messageInput) {
            messageInput.value = `[Color / Texture Sample Inquiry]: ${sample}\nRequesting system specifications and formal project quote.`;
        }
    }

    if (urlParams.has('sqft')) {
        const sqftInput = document.getElementById('form-sqft-est') || document.getElementById('form-sqft-home') || document.querySelector('input[name="sqft"]');
        if (sqftInput) {
            sqftInput.value = urlParams.get('sqft');
        }
    }
});

// Handle FAQ or Financing Anchor links
function handleAnchorNavigation() {
    const hash = window.location.hash;
    if (hash === '#financing') {
        const financingEl = document.getElementById('financing') || document.querySelector('.financing');
        if (financingEl) {
            setTimeout(() => {
                financingEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 150);
        }
    }
}

window.addEventListener('DOMContentLoaded', handleAnchorNavigation);
window.addEventListener('hashchange', handleAnchorNavigation);
