/**
 * LionStone Floors - Form Submission Engine (Netlify Forms & Local Lead Capture)
 * 
 * Production: Submits natively to Netlify Forms (data-netlify="true") which routes
 *             directly to estimating@lionstonefloors.com.
 * Local Sandbox: Records directly into leads.json and leads.csv on local server.
 * Direct Action: 1-Click Mailto button pre-populates email client directly to estimating@lionstonefloors.com.
 */

document.addEventListener('DOMContentLoaded', function() {
    // Web3Forms Direct Background Email Key (for estimating@lionstonefloors.com)
    const WEB3FORMS_KEY = "b1cdf58f-0e10-461e-81ea-d7477937009e";
    const FLOORLAUNCH_WEBHOOK = window.LIONSTONE_FLOORLAUNCH_WEBHOOK || "";

    // 1. Inject Modal HTML to body if not already present
    if (!document.getElementById('lionstoneSuccessModal')) {
        const modalHTML = `
            <div class="lionstone-modal-overlay" id="lionstoneSuccessModal">
                <div class="lionstone-modal" style="max-width: 520px; width: 92%; padding: 32px 26px; border-radius: 16px; background: #FFFFFF; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); text-align: center; position: relative;">
                    <button id="lionstoneCloseModalX" aria-label="Close" style="position: absolute; top: 16px; right: 16px; background: none; border: none; font-size: 24px; color: #94A3B8; cursor: pointer; line-height: 1;">&times;</button>
                    
                    <div style="width: 60px; height: 60px; border-radius: 50%; background: #DCFCE7; color: #16A34A; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px auto; font-size: 28px; box-shadow: 0 4px 12px rgba(22,163,74,0.15);">✓</div>
                    
                    <h3 style="color: #0F172A; font-size: 24px; font-weight: 800; margin-bottom: 6px; letter-spacing: -0.02em;">Estimate Request Received!</h3>
                    
                    <p style="color: #475569; font-size: 14px; margin-bottom: 18px; line-height: 1.5;">
                        Thank you! Your project details have been successfully captured and routed directly to <strong style="color: #CE0328;">estimating@lionstonefloors.com</strong>.
                    </p>

                    <!-- Automated Delivery Notice -->
                    <div style="background: #F0FDF4; border: 1px solid #BBF7D0; border-radius: 10px; padding: 14px 16px; margin-bottom: 18px; text-align: left;">
                        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                            <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: #16A34A;"></span>
                            <strong style="color: #166534; font-size: 13.5px;">Automated Delivery Confirmed</strong>
                        </div>
                        <p style="margin: 0; font-size: 12.5px; color: #374151; line-height: 1.45;">
                            Our estimating department has been notified. One of our concrete coating specialists will review your project details and contact you within <strong>2 business hours</strong>.
                        </p>
                    </div>

                    <!-- Captured Data Preview -->
                    <div style="font-size: 12.5px; color: #334155; background: #F8FAFC; border: 1px solid #E2E8F0; padding: 12px 14px; border-radius: 8px; text-align: left; max-height: 120px; overflow-y: auto; margin-bottom: 18px;" id="lionstoneModalData"></div>

                    <!-- Quick Actions -->
                    <div style="display: flex; gap: 10px; justify-content: center; margin-bottom: 16px; flex-wrap: wrap;">
                        <a href="tel:8608050061" style="background: #CE0328; color: #ffffff; text-decoration: none; padding: 11px 20px; border-radius: 8px; font-weight: 700; font-size: 14px; display: inline-flex; align-items: center; gap: 8px; box-shadow: 0 4px 12px rgba(206,3,40,0.25);">
                            <i class="fas fa-phone-alt"></i> Call (860) 805-0061
                        </a>
                        <button id="lionstoneCopyBtn" type="button" style="background: #F1F5F9; color: #1E293B; border: 1px solid #CBD5E1; padding: 11px 16px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; gap: 6px;">
                            <i class="fas fa-copy"></i> Copy Details
                        </button>
                    </div>

                    <div id="lionstoneServerStatus" style="font-size: 12px; color: #16A34A; background: #F0FDF4; border: 1px solid #BBF7D0; padding: 6px 12px; border-radius: 6px; margin-bottom: 16px;">
                        ✓ Notification dispatched to estimating@lionstonefloors.com
                    </div>

                    <button id="lionstoneCloseModal" style="background: #0F172A; color: #ffffff; border: none; padding: 10px 32px; border-radius: 20px; font-size: 13px; font-weight: 600; cursor: pointer;">Close</button>
                </div>
            </div>
        `;
        const div = document.createElement('div');
        div.innerHTML = modalHTML;
        document.body.appendChild(div.firstElementChild);
    }
    
    // 2. Setup modal event listeners
    const modal = document.getElementById('lionstoneSuccessModal');
    const closeBtn = document.getElementById('lionstoneCloseModal');
    const closeX = document.getElementById('lionstoneCloseModalX');
    
    function closeModal() {
        if (modal) modal.classList.remove('active');
    }

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (closeX) closeX.addEventListener('click', closeModal);
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) closeModal();
        });
    }
    
    // 3. Setup "Other" Project Type toggle listeners
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

    // 4. Handle form submission enhancements (backup logging, custom option sync)
    const forms = document.querySelectorAll('form.native-estimate-form');
    forms.forEach((form) => {
        form.addEventListener('submit', function(e) {
            // If "Other" project type is selected, use the user's custom input value
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

            // 1. Store in localStorage backup
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
                stored.push({
                    timestamp: new Date().toISOString(),
                    ...leadObj
                });
                localStorage.setItem('lionstone_leads', JSON.stringify(stored));
            } catch (err) {
                console.warn('LocalStorage backup error:', err);
            }

            // 2. FloorLaunch / CRM webhook dispatch (if configured)
            if (FLOORLAUNCH_WEBHOOK) {
                try {
                    const formData = new FormData(form);
                    if (navigator.sendBeacon) {
                        navigator.sendBeacon(FLOORLAUNCH_WEBHOOK, JSON.stringify({
                            full_name: formData.get('name') || '',
                            phone: formData.get('phone') || '',
                            email: formData.get('email') || '',
                            appointment_notes: `[City: ${formData.get('city') || ''} | ${formData.get('project_type') || ''} | ${formData.get('sqft') || ''}]\n${formData.get('message') || ''}`
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
        });
    });

    // 5. Handle auto-population from URL parameters (e.g. from service pages or Swatch Visualizer)
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
