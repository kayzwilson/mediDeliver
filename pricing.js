document.addEventListener("DOMContentLoaded", function() {
    // Billing toggle functionality
    const billingSwitch = document.getElementById("billingSwitch");
    const monthlyPrices = document.querySelectorAll(".monthly");
    const annualPrices = document.querySelectorAll(".annually");
    const annualNotes = document.querySelectorAll(".annual-note");
    
    if (billingSwitch) {
        billingSwitch.addEventListener("change", function() {
            if (this.checked) {
                // Show annual prices
                monthlyPrices.forEach(price => price.style.display = "none");
                annualPrices.forEach(price => price.style.display = "inline");
                annualNotes.forEach(note => note.style.display = "block");
            } else {
                // Show monthly prices
                monthlyPrices.forEach(price => price.style.display = "inline");
                annualPrices.forEach(price => price.style.display = "none");
                annualNotes.forEach(note => note.style.display = "none");
            }
        });
        
        // Trigger change event to set initial state
        billingSwitch.dispatchEvent(new Event("change"));
    }
    
    // Plan card hover effect
    const planCards = document.querySelectorAll(".plan-card");
    
    planCards.forEach(card => {
        card.addEventListener("mouseenter", function() {
            if (!this.classList.contains("featured")) {
                this.style.transform = "translateY(-5px)";
                this.style.boxShadow = "0 10px 25px rgba(0, 0, 0, 0.1)";
            }
        });
        
        card.addEventListener("mouseleave", function() {
            if (!this.classList.contains("featured")) {
                this.style.transform = "";
                this.style.boxShadow = "var(--shadow)";
            } else {
                this.style.transform = "translateY(-10px)";
            }
        });
    });
    
    // Get Started button click handlers
    const getStartedButtons = document.querySelectorAll(".plan-card .btn");
    
    getStartedButtons.forEach(button => {
        button.addEventListener("click", function() {
            const planCard = this.closest(".plan-card");
            const planName = planCard.querySelector("h3").textContent;
            
            // In a real implementation, this would redirect to signup with plan selected
            showToast(`Selected plan: ${planName}. Redirecting to signup...`);
            
            // Simulate redirect
            setTimeout(() => {
                // window.location.href = "signup.html?plan=" + planName.toLowerCase();
            }, 1500);
        });
    });
    
    // FAQ accordion improvements
    const accordionButtons = document.querySelectorAll(".accordion-button");
    
    accordionButtons.forEach(button => {
        button.addEventListener("click", function() {
            const icon = document.createElement("v");
            icon.className = "fas fa-chevron-down ms-2";
            icon.style.transition = "transform 0.3s ease";
            
            // Remove any existing icons
            const existingIcons = this.querySelector("i");
            if (existingIcons) {
                existingIcons.remove();
            }
            
            this.appendChild(icon);
            
            if (this.classList.contains("collapsed")) {
                icon.style.transform = "rotate(0deg)";
            } else {
                icon.style.transform = "rotate(180deg)";
            }
        });
    });
    
    // Toast notification function
    function showToast(message) {
        // Create toast element
        const toast = document.createElement("div");
        toast.className = "toast show";
        toast.setAttribute("role", "alert");
        toast.setAttribute("aria-live", "assertive");
        toast.setAttribute("aria-atomic", "true");
        
        toast.innerHTML = `
            <div class="toast-body">
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        `;
        
        // Add to toast container
        let toastContainer = document.querySelector(".toast-container");
        if (!toastContainer) {
            toastContainer = document.createElement("div");
            toastContainer.className = "toast-container";
            document.body.appendChild(toastContainer);
        }
        
        toastContainer.appendChild(toast);
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            toast.classList.remove("show");
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
});