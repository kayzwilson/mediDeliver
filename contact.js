document.addEventListener("DOMContentLoaded", function() {
    // Form submission handling
    const contactForm = document.getElementById("contactForm");
    
    if (contactForm) {
        contactForm.addEventListener("submit", function(e) {
            e.preventDefault();
            
            // Get form elements
            const submitButton = this.querySelector("button[type='submit']");
            const submitText = submitButton.querySelector(".submit-text");
            const spinner = submitButton.querySelector(".spinner-border");
            
            // Show loading state
            submitText.textContent = "Sending...";
            spinner.classList.remove("d-none");
            submitButton.disabled = true;
            
            // Simulate form submission (in a real app, you would use AJAX)
            setTimeout(() => {
                // Reset form
                this.reset();
                
                // Show success message
                showToast("Your message has been sent successfully!");
                
                // Reset button
                submitText.textContent = "Send Message";
                spinner.classList.add("d-none");
                submitButton.disabled = false;
            }, 2000);
        });
    }
    
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
                <i class="fas fa-check-circle me-2" style="color: #28A745;"></i>
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
    
    // FAQ accordion improvements
    const accordionButtons = document.querySelectorAll(".accordion-button");
    
    accordionButtons.forEach(button => {
        button.addEventListener("click", function() {
            const icon = document.createElement("i");
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
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener("click", function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute("href");
            if (targetId === "#") return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: "smooth"
                });
            }
        });
    });
});