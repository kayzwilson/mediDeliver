document.addEventListener("DOMContentLoaded", function() {
    // Price range filter with dual inputs
    const priceRange = document.getElementById("priceRange");
    const minPriceInput = document.querySelector(".min-price");
    const maxPriceInput = document.querySelector(".max-price");
    
    if (priceRange && minPriceInput && maxPriceInput) {
        // Initialize values
        minPriceInput.value = 0;
        maxPriceInput.value = priceRange.value;
        
        // Update range slider when inputs change
        minPriceInput.addEventListener("input", function() {
            if (parseInt(this.value) > parseInt(maxPriceInput.value)) {
                this.value = maxPriceInput.value;
            }
            priceRange.value = maxPriceInput.value;
        });
        
        maxPriceInput.addEventListener("input", function() {
            if (parseInt(this.value) < parseInt(minPriceInput.value)) {
                this.value = minPriceInput.value;
            }
            priceRange.value = this.value;
        });
        
        // Update input when slider changes
        priceRange.addEventListener("input", function() {
            maxPriceInput.value = this.value;
        });
    }
    
    // View toggle (grid/list)
    const viewButtons = document.querySelectorAll(".view-btn");
    const productsView = document.getElementById("productsView");
    
    viewButtons.forEach(button => {
        button.addEventListener("click", function() {
            viewButtons.forEach(btn => btn.classList.remove("active"));
            this.classList.add("active");
            
            if (this.dataset.view === "grid") {
                productsView.classList.remove("list-view");
                productsView.classList.add("grid-view");
            } else {
                productsView.classList.remove("grid-view");
                productsView.classList.add("list-view");
            }
        });
    });
    
    // Wishlist functionality
    const wishlistButtons = document.querySelectorAll(".add-to-wishlist");
    
    wishlistButtons.forEach(button => {
        button.addEventListener("click", function() {
            this.classList.toggle("active");
            
            if (this.classList.contains("active")) {
                this.innerHTML = '<i class="fas fa-heart"></i>';
                showToast("Added to wishlist");
            } else {
                this.innerHTML = '<i class="far fa-heart"></i>';
                showToast("Removed from wishlist");
            }
        });
    });
    
    // Quick view functionality
    const quickViewButtons = document.querySelectorAll(".quick-view");
    const quickViewModal = new bootstrap.Modal(document.getElementById("quickViewModal"));
    
    quickViewButtons.forEach(button => {
        button.addEventListener("click", function() {
            // In a real implementation, this would load product data
            const productCard = this.closest(".product-card");
            const productTitle = productCard.querySelector(".product-title").textContent;
            
            // Simulate loading product data
            showToast(`Loading details for: ${productTitle}`);
            
            // You would typically make an AJAX call here to get product details
            // Then populate the modal with the response data
            setTimeout(() => {
                quickViewModal.show();
            }, 800);
        });
    });
    
    // Add to cart functionality
    const addToCartButtons = document.querySelectorAll(".add-to-cart");
    const cartCount = document.querySelector(".cart-count");
    let cartItems = 0;
    
    addToCartButtons.forEach(button => {
        button.addEventListener("click", function() {
            cartItems++;
            if (cartCount) cartCount.textContent = cartItems;
            
            // Add animation
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fas fa-check"></i> Added!';
            this.style.backgroundColor = "#28A745";
            
            // Show toast notification
            const productTitle = this.closest(".product-card").querySelector(".product-title").textContent;
            showToast(`${productTitle} added to cart`);
            
            setTimeout(() => {
                this.innerHTML = originalText;
                this.style.backgroundColor = "";
            }, 2000);
        });
    });
    
    // Filter application
    const applyFiltersButton = document.querySelector(".apply-filters-btn");
    
    if (applyFiltersButton) {
        applyFiltersButton.addEventListener("click", function() {
            // Get filter values
            const minPrice = minPriceInput ? minPriceInput.value : 0;
            const maxPrice = maxPriceInput ? maxPriceInput.value : 100000;
            const inStock = document.getElementById("inStock").checked;
            const onDiscount = document.getElementById("onDiscount").checked;
            
            // Show loading state
            const originalText = this.innerHTML;
            this.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Applying...';
            this.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                // Reset button
                this.innerHTML = originalText;
                this.disabled = false;
                
                // Show results
                showToast(`Filters applied: UGX ${minPrice} - UGX ${maxPrice} | In Stock: ${inStock} | Discount: ${onDiscount}`);
            }, 1500);
        });
    }
    
    // Category filter
    const categoryItems = document.querySelectorAll(".category-item");
    
    categoryItems.forEach(item => {
        item.addEventListener("click", function(e) {
            e.preventDefault();
            
            // Remove active class from all items
            categoryItems.forEach(i => i.classList.remove("active"));
            
            // Add active class to clicked item
            this.classList.add("active");
            
            // Get category name
            const categoryName = this.querySelector("span").textContent;
            showToast(`Filtering by: ${categoryName}`);
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
    
    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
});