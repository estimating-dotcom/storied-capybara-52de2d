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

    // 3. Handle auto-population from URL parameters (e.g. from service pages or Swatch Visualizer)
    const urlParams = new URLSearchParams(window.location.search);
    const messageInput = document.getElementById('form-message-input') || document.querySelector('textarea[name="message"]');
    if (messageInput) {
        if (urlParams.has('system')) {
            const system = urlParams.get('system') || 'Full Flake Polyaspartic';
            messageInput.value = `[Inquiry] Interested in: ${system}\nPlease schedule an in-home inspection and bring physical samples.`;
        } else if (urlParams.has('sample')) {
            const sample = urlParams.get('sample');
            messageInput.value = `[Sample Request] Requested Color/Texture Swatch: ${sample}\nPlease bring this physical sample to our in-home consultation.`;
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
