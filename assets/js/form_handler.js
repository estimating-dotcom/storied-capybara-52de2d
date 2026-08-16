document.addEventListener('DOMContentLoaded', function() {
    // 1. Inject Modal HTML to body
    const modalHTML = `
        <div class="lionstone-modal-overlay" id="lionstoneSuccessModal">
            <div class="lionstone-modal">
                <h3>Request Received!</h3>
                <p>Thank you for reaching out to <strong>LionStone Concrete Coating LLC</strong>. Your quote request has been captured locally in the development sandbox.</p>
                <p style="font-size: 13px; color: #888; background: #f4f4f4; padding: 10px; border-radius: 6px; text-align: left; max-height: 120px; overflow-y: auto;" id="lionstoneModalData"></p>
                <p>For urgent inquiries, call us directly at <strong>(860) 805-0061</strong>.</p>
                <button id="lionstoneCloseModal">Done</button>
            </div>
        </div>
    `;
    
    const div = document.createElement('div');
    div.innerHTML = modalHTML;
    document.body.appendChild(div.firstElementChild);
    
    // 2. Setup modal event listeners
    const modal = document.getElementById('lionstoneSuccessModal');
    const closeBtn = document.getElementById('lionstoneCloseModal');
    
    if (closeBtn && modal) {
        closeBtn.addEventListener('click', function() {
            modal.classList.remove('active');
        });
        
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    }
    
    // 3. Intercept form submissions
    const forms = document.querySelectorAll('form');
    console.log(`[Form Handler] Intercepted ${forms.length} forms in sandbox mode.`);
    
    forms.forEach((form, index) => {
        // Prevent default submission
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Gather form data to preview in the modal
            const formData = new FormData(form);
            let summaryText = "";
            let count = 0;
            
            for (let [key, value] of formData.entries()) {
                // Skip internal WordPress/plugin hidden fields to show clean user data
                if (key.startsWith('_wp') || key.startsWith('_mc') || key === 'g-recaptcha-response') continue;
                
                // Clean field names
                let fieldLabel = key.replace(/your-/g, '').replace(/_/g, ' ').replace(/-/g, ' ');
                fieldLabel = fieldLabel.charAt(0).toUpperCase() + fieldLabel.slice(1);
                
                if (value.trim()) {
                    summaryText += `<strong>${fieldLabel}:</strong> ${value}<br>`;
                    count++;
                }
            }
            
            if (count === 0) {
                summaryText = "No form data submitted.";
            }
            
            // Display captured form data in the modal
            const dataPreview = document.getElementById('lionstoneModalData');
            if (dataPreview) {
                dataPreview.innerHTML = summaryText;
            }
            
            // Trigger the success modal
            if (modal) {
                modal.classList.add('active');
            }
            
            console.log(`[Form Handler] Captured submission from Form #${index + 1}:`, Object.fromEntries(formData.entries()));
        });
    });
});


// 4. Handle Financing Hash Navigation
// Automatically opens the details element with ID 'financing' if hash is #financing or #faq
function handleFAQHash() {
    const hash = window.location.hash;
    if (hash === '#financing') {
        const financingDetails = document.getElementById('financing');
        if (financingDetails) {
            financingDetails.setAttribute('open', '');
            setTimeout(() => {
                financingDetails.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 150);
        }
    } else if (hash === '#faq') {
        const faqContainer = document.getElementById('faq');
        if (faqContainer) {
            setTimeout(() => {
                faqContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 150);
        }
    }
}

// Run on initial page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', handleFAQHash);
} else {
    handleFAQHash();
}

// Run on hash changes (e.g. clicking menu/footer links when already on index.html)
window.addEventListener('hashchange', handleFAQHash);
