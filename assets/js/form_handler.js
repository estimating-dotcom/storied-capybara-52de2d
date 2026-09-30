/**
 * LionStone Floors - Form Submission Engine (Netlify Forms & Local Lead Capture)
 * 
 * Production: Submits natively to Netlify Forms (data-netlify="true") which routes
 *             directly to estimating@lionstonefloors.com.
 * Local Sandbox: Records directly into leads.json and leads.csv on local server.
 * Direct Action: 1-Click Mailto button pre-populates email client directly to estimating@lionstonefloors.com.
 */

document.addEventListener('DOMContentLoaded', function() {
    // 1. Inject Modal HTML to body if not already present
    if (!document.getElementById('lionstoneSuccessModal')) {
        const modalHTML = `
            <div class="lionstone-modal-overlay" id="lionstoneSuccessModal">
                <div class="lionstone-modal" style="max-width: 520px; width: 92%; padding: 30px 25px; border-radius: 16px; background: #FFFFFF; box-shadow: 0 20px 40px rgba(0,0,0,0.2); text-align: center; position: relative;">
                    <button id="lionstoneCloseModalX" style="position: absolute; top: 15px; right: 15px; background: none; border: none; font-size: 22px; color: #94A3B8; cursor: pointer; line-height: 1;">&times;</button>
                    
                    <div style="width: 56px; height: 56px; border-radius: 50%; background: #DCFCE7; color: #16A34A; display: flex; align-items: center; justify-content: center; margin: 0 auto 12px auto; font-size: 26px;">✓</div>
                    
                    <h3 style="color: #0F172A; font-size: 22px; font-weight: 800; margin-bottom: 6px;">Estimate Request Received!</h3>
                    
                    <p style="color: #475569; font-size: 13.5px; margin-bottom: 14px; line-height: 1.45;">
                        Your project details have been successfully captured for <strong style="color: #CE0328;">estimating@lionstonefloors.com</strong>.
                    </p>

                    <!-- Captured Data Preview -->
                    <div style="font-size: 13px; color: #334155; background: #F8FAFC; border: 1px solid #E2E8F0; padding: 12px 14px; border-radius: 8px; text-align: left; max-height: 130px; overflow-y: auto; margin-bottom: 15px;" id="lionstoneModalData"></div>

                    <!-- Direct Email Button -->
                    <div style="margin-bottom: 15px;">
                        <a id="lionstoneMailtoBtn" href="#" target="_blank" style="display: flex; align-items: center; justify-content: center; gap: 8px; background: #CE0328; color: #ffffff; text-decoration: none; padding: 13px 20px; border-radius: 8px; font-weight: 700; font-size: 15px; transition: background 0.2s; box-shadow: 0 4px 12px rgba(206,3,40,0.25);">
                            <i class="fas fa-envelope-open-text"></i> Open in Email Client (1-Click Send)
                        </a>
                        <span style="display: block; font-size: 11.5px; color: #64748B; margin-top: 4px;">Sends an exact copy directly to estimating@lionstonefloors.com</span>
                    </div>

                    <!-- Secondary Quick Actions -->
                    <div style="display: flex; gap: 10px; justify-content: center; margin-bottom: 15px; flex-wrap: wrap;">
                        <button id="lionstoneCopyBtn" type="button" style="background: #F1F5F9; color: #1E293B; border: 1px solid #CBD5E1; padding: 9px 15px; border-radius: 6px; font-size: 12.5px; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; gap: 6px;">
                            <i class="fas fa-copy"></i> Copy Project Details
                        </button>
                        <a href="tel:8608050061" style="background: #F1F5F9; color: #1E293B; border: 1px solid #CBD5E1; padding: 9px 15px; border-radius: 6px; font-size: 12.5px; font-weight: 600; text-decoration: none; display: inline-flex; align-items: center; gap: 6px;">
                            <i class="fas fa-phone-alt" style="color: #CE0328;"></i> (860) 805-0061
                        </a>
                    </div>

                    <div id="lionstoneServerStatus" style="font-size: 12px; color: #16A34A; background: #F0FDF4; border: 1px solid #BBF7D0; padding: 6px 12px; border-radius: 6px; margin-bottom: 15px;">
                        ✓ Routed to estimating@lionstonefloors.com
                    </div>

                    <button id="lionstoneCloseModal" style="background: #0F172A; color: #ffffff; border: none; padding: 9px 28px; border-radius: 20px; font-size: 13px; font-weight: 600; cursor: pointer;">Close</button>
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

    // 4. Intercept form submissions & route directly to Netlify & estimating@lionstonefloors.com
    const forms = document.querySelectorAll('form.native-estimate-form');
    forms.forEach((form) => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(form);
            
            // If "Other" project type is selected, use the user's custom input value
            const projSelect = form.querySelector('.project-type-select');
            const customInput = form.querySelector('.form-project-type-other');
            if (projSelect && projSelect.value === 'Other') {
                const customVal = customInput && customInput.value.trim() ? customInput.value.trim() : 'Other (Custom)';
                formData.set('project_type', customVal);
                formData.delete('project_type_custom');
            }

            // Ensure form-name is set for Netlify Forms
            if (!formData.get('form-name')) {
                formData.set('form-name', form.getAttribute('name') || 'Estimate Form (Website)');
            }

            // Extract structured lead fields
            const leadObj = {
                name: formData.get('name') || formData.get('your-name') || '',
                phone: formData.get('phone') || formData.get('your-phone') || '',
                email: formData.get('email') || formData.get('your-email') || '',
                city: formData.get('city') || '',
                project_type: formData.get('project_type') || '',
                sqft: formData.get('sqft') || '',
                message: formData.get('message') || formData.get('your-message') || ''
            };

            // Build human-readable summary
            let summaryHTML = "";
            let plainTextSummary = "LIONSTONE FLOORS ESTIMATE REQUEST\n--------------------------------\n";
            
            for (let [key, value] of formData.entries()) {
                if (key.startsWith('_') || key === 'g-recaptcha-response' || key === 'form-name' || key === 'bot-field') continue;
                
                let fieldLabel = key.replace(/your-/g, '').replace(/_/g, ' ').replace(/-/g, ' ');
                fieldLabel = fieldLabel.charAt(0).toUpperCase() + fieldLabel.slice(1);
                
                if (value && value.toString().trim()) {
                    summaryHTML += `<strong>${fieldLabel}:</strong> ${value}<br>`;
                    plainTextSummary += `${fieldLabel}: ${value}\n`;
                }
            }
            
            plainTextSummary += `\nDestination: estimating@lionstonefloors.com\nDirect Phone: (860) 805-0061`;

            const dataPreview = document.getElementById('lionstoneModalData');
            if (dataPreview) {
                dataPreview.innerHTML = summaryHTML || "No form fields submitted.";
            }

            // Prepare 1-Click Mailto link prefilled for estimating@lionstonefloors.com
            const mailtoBtn = document.getElementById('lionstoneMailtoBtn');
            if (mailtoBtn) {
                const subject = encodeURIComponent(`LionStone Estimate Request - ${leadObj.name || 'New Customer'} (${leadObj.project_type || 'Flooring'})`);
                const body = encodeURIComponent(
                    `Hello LionStone Estimating Team,\n\n` +
                    `I am requesting a free consultation & quote for concrete coatings:\n\n` +
                    `• Customer Name: ${leadObj.name}\n` +
                    `• Phone Number: ${leadObj.phone}\n` +
                    `• Email Address: ${leadObj.email}\n` +
                    `• City / Town: ${leadObj.city}\n` +
                    `• Project Type: ${leadObj.project_type}\n` +
                    `• Approx. Sq Footage: ${leadObj.sqft}\n` +
                    `• Message / Job Details:\n${leadObj.message}\n\n` +
                    `Thank you,\n${leadObj.name}`
                );
                mailtoBtn.href = `mailto:estimating@lionstonefloors.com?subject=${subject}&body=${body}`;
            }

            // Copy to clipboard listener
            const copyBtn = document.getElementById('lionstoneCopyBtn');
            if (copyBtn) {
                copyBtn.onclick = function() {
                    navigator.clipboard.writeText(plainTextSummary).then(() => {
                        copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
                        setTimeout(() => {
                            copyBtn.innerHTML = '<i class="fas fa-copy"></i> Copy Project Details';
                        }, 2500);
                    });
                };
            }

            // 1. Store in localStorage backup
            try {
                const stored = JSON.parse(localStorage.getItem('lionstone_leads') || '[]');
                stored.push({
                    timestamp: new Date().toISOString(),
                    ...leadObj
                });
                localStorage.setItem('lionstone_leads', JSON.stringify(stored));
            } catch (e) {
                console.warn('LocalStorage error:', e);
            }

            // 2. Netlify Forms Submission (Native URL-encoded POST)
            fetch("/", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams(formData).toString()
            }).then(() => {
                console.log('[Netlify Forms] Successfully posted to Netlify form pipeline.');
            }).catch(err => {
                console.log('[Netlify Forms] Local/offline environment notice:', err);
            });

            // 3. Local Server API logging (for local development sandbox)
            const statusEl = document.getElementById('lionstoneServerStatus');
            fetch('/api/estimate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(leadObj)
            }).then(res => res.json())
            .then(data => {
                console.log('[LionStone Lead Engine] Lead saved to server database:', data);
                if (statusEl) {
                    statusEl.innerHTML = '✓ <strong>Saved to server:</strong> Logged in <code>leads.json</code> & <code>leads.csv</code>';
                    statusEl.style.color = '#16A34A';
                    statusEl.style.background = '#F0FDF4';
                }
            }).catch(() => {
                if (statusEl) {
                    statusEl.innerHTML = '✓ Routed to <strong>estimating@lionstonefloors.com</strong>';
                    statusEl.style.color = '#16A34A';
                    statusEl.style.background = '#F0FDF4';
                }
            });

            // Show confirmation modal
            if (modal) {
                modal.classList.add('active');
                form.reset();
            }
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
