/**
 * LionStone Floors - Form Submission & Conversion Tracking Engine v4
 *
 * Production:
 *   1. Native HTML form POST to Web3Forms API -> estimating@lionstonefloors.com -> /calendar/ redirect.
 *   2. Parallel dual backup POST to Netlify Forms ("lionstone-leads-backup") via fetch/sendBeacon.
 *   3. Google Ads (AW-17046742942) + Google Analytics 4 (G-8DGC4CBGWN) lead/phone/SMS/quiz tracking.
 *
 * NO modals, NO mailto buttons, NO preventDefault on submit — pure native form submission.
 */

(function() {
    const TRACKING = {
        adsId: 'AW-17046742942',
        ga4Id: window.LIONSTONE_GA4_ID || 'G-8DGC4CBGWN',
        adsLeadLabel: window.LIONSTONE_ADS_LEAD_LABEL || '',
        adsCallLabel: window.LIONSTONE_ADS_CALL_LABEL || ''
    };

    if (window.LIONSTONE_GA4_ID && window.LIONSTONE_GA4_ID !== 'G-8DGC4CBGWN' && typeof window.gtag === 'function') {
        window.gtag('config', window.LIONSTONE_GA4_ID);
    }

    function trackEvent(eventName, params) {
        try {
            if (typeof window.gtag === 'function') {
                window.gtag('event', eventName, Object.assign({ transport_type: 'beacon' }, params || {}));
            }
        } catch (err) {
            console.warn('gtag event error:', err);
        }
    }

    function trackAdsConversion(label, extra) {
        if (!label || typeof window.gtag !== 'function') return;
        try {
            window.gtag('event', 'conversion', Object.assign({
                send_to: `${TRACKING.adsId}/${label}`,
                transport_type: 'beacon'
            }, extra || {}));
        } catch (err) {
            console.warn('gtag conversion error:', err);
        }
    }

    function sendNetlifyBackup(form) {
        try {
            const fd = new FormData(form);
            const params = new URLSearchParams();
            params.append('form-name', 'lionstone-leads-backup');
            params.append('bot-field', '');
            params.append('name', fd.get('name') || '');
            params.append('phone', fd.get('phone') || '');
            params.append('email', fd.get('email') || '');
            params.append('city', fd.get('city') || '');
            params.append('project_type', fd.get('project_type') || '');
            params.append('sqft', fd.get('sqft') || '');
            params.append('source', fd.get('source') || window.location.pathname || '/');
            params.append('message', fd.get('message') || '');

            const encoded = params.toString();
            if (typeof fetch === 'function') {
                fetch('/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: encoded,
                    keepalive: true
                }).catch(() => {});
            } else if (navigator.sendBeacon) {
                const blob = new Blob([encoded], { type: 'application/x-www-form-urlencoded' });
                navigator.sendBeacon('/', blob);
            }
        } catch (err) {
            console.warn('Netlify backup dispatch error:', err);
        }
    }

    function bindEstimateForm(form) {
        if (!form || form.dataset.lsBound === '1') return;
        form.dataset.lsBound = '1';

        const projectSelect = form.querySelector('.project-type-select');
        if (projectSelect) {
            projectSelect.addEventListener('change', function() {
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
        }

        form.addEventListener('submit', function() {
            const FLOORLAUNCH_WEBHOOK = window.LIONSTONE_FLOORLAUNCH_WEBHOOK || '';
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

            const formData = new FormData(form);
            const leadObj = {
                name: formData.get('name') || '',
                phone: formData.get('phone') || '',
                email: formData.get('email') || '',
                city: formData.get('city') || '',
                project_type: formData.get('project_type') || '',
                sqft: formData.get('sqft') || '',
                source: formData.get('source') || window.location.pathname || '/',
                message: formData.get('message') || ''
            };

            // 1. LocalStorage backup
            try {
                const stored = JSON.parse(localStorage.getItem('lionstone_leads') || '[]');
                stored.push({ timestamp: new Date().toISOString(), ...leadObj });
                localStorage.setItem('lionstone_leads', JSON.stringify(stored));
            } catch (err) {
                console.warn('LocalStorage backup error:', err);
            }

            // 2. Netlify Forms dual delivery backup (non-blocking)
            sendNetlifyBackup(form);

            // 3. Conversion & lead event tracking (GA4 + Google Ads)
            trackEvent('generate_lead', {
                event_category: 'lead',
                event_label: leadObj.source,
                project_type: leadObj.project_type,
                city: leadObj.city,
                value: 1
            });
            trackAdsConversion(TRACKING.adsLeadLabel, { value: 1.0, currency: 'USD' });

            // 4. Optional FloorLaunch CRM webhook dispatch
            if (FLOORLAUNCH_WEBHOOK && navigator.sendBeacon) {
                try {
                    navigator.sendBeacon(FLOORLAUNCH_WEBHOOK, JSON.stringify({
                        full_name: leadObj.name,
                        phone: leadObj.phone,
                        email: leadObj.email,
                        appointment_notes: `[Source: ${leadObj.source} | City: ${leadObj.city} | ${leadObj.project_type} | ${leadObj.sqft}]\n${leadObj.message}`
                    }));
                } catch (err) {
                    console.log('FloorLaunch dispatch error:', err);
                }
            }

            // 5. Visual submitting indicator while native form POST proceeds
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Transmitting Estimate Request...';
            }
        });
    }

    window.lionstoneTrackEvent = trackEvent;
    window.lionstoneBindEstimateForm = bindEstimateForm;

    document.addEventListener('DOMContentLoaded', function() {
        document.querySelectorAll('form.native-estimate-form').forEach(bindEstimateForm);

        // Pre-populate quote forms from URL parameters (?system=...&sample=...&sqft=...)
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
                if (sysLower.includes('slot') || sysLower.includes('drain')) {
                    projectTypeSelect.value = 'Slot Drain & Trench Drain Installation';
                } else if (sysLower.includes('warehouse') || sysLower.includes('logistics')) {
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

    // Delegated click tracking for phone calls, SMS photo quotes, and assessment quiz launches
    document.addEventListener('click', function(e) {
        const telLink = e.target.closest('a[href^="tel:"]');
        if (telLink) {
            trackEvent('phone_call_click', {
                event_category: 'engagement',
                event_label: window.location.pathname || '/',
                phone_number: telLink.getAttribute('href')
            });
            trackAdsConversion(TRACKING.adsCallLabel);
            return;
        }

        const smsLink = e.target.closest('a[href^="sms:"]');
        if (smsLink) {
            trackEvent('sms_photo_quote_click', {
                event_category: 'engagement',
                event_label: window.location.pathname || '/'
            });
            return;
        }

        const quizBtn = e.target.closest('[data-open-floor-quiz]');
        if (quizBtn) {
            trackEvent('quiz_started', {
                event_category: 'engagement',
                event_label: window.location.pathname || '/'
            });
        }
    });

    // Handle hash anchor navigation
    function handleAnchorNavigation() {
        if (window.location.hash === '#financing') {
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
})();
