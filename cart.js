document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart from localStorage
    let cart = JSON.parse(localStorage.getItem('mediDeliverCart')) || [];
    let savedItems = JSON.parse(localStorage.getItem('savedItems')) || [];
    let recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed')) || [];
    
    // Recommended items data
    let recommendedItems = [
        {
            id: 'prod7',
            title: 'Vitamin C Boost',
            category: 'Vitamins & Supplements',
            price: 25000,
            image: 'vitamin_c.png',
            rating: 4.5,
            stock: 'In Stock'
        },
        {
            id: 'prod8',
            title: 'Digestive Enzymes',
            category: 'Digestive Health',
            price: 32000,
            image: 'digestive_enzymes.png',
            rating: 4.2,
            stock: 'In Stock'
        },
        {
            id: 'prod9',
            title: 'Immune Support',
            category: 'Immunity Boosters',
            price: 28000,
            image: 'immune_support.png',
            rating: 4.7,
            stock: 'Low Stock'
        }
    ];
    
    // DOM Elements
    const cartItemsContainer = document.getElementById('cartItems');
    const savedItemsContainer = document.getElementById('savedItems');
    const savedItemsSection = document.getElementById('savedItemsSection');
    const recentlyViewedContainer = document.getElementById('recentlyViewed');
    const recommendedItemsContainer = document.getElementById('recommendedItems');
    const cartCountElements = document.querySelectorAll('.cart-count');
    const subtotalElement = document.getElementById('subtotal');
    const discountElement = document.getElementById('discount');
    const deliveryFeeElement = document.getElementById('deliveryFee');
    const totalElement = document.getElementById('total');
    const itemCountElement = document.getElementById('itemCount');
    const applyCouponBtn = document.getElementById('applyCoupon');
    const applyGiftCardBtn = document.getElementById('applyGiftCard');
    const couponCodeInput = document.getElementById('couponCode');
    const giftCardCodeInput = document.getElementById('giftCardCode');
    const couponMessage = document.getElementById('couponMessage');
    const giftCardMessage = document.getElementById('giftCardMessage');
    const clearCartBtn = document.querySelector('.clear-cart');
    const continueShoppingBtn = document.querySelector('.continue-shopping');
    const proceedToCheckoutBtn = document.getElementById('proceedToCheckout');
    const editCartBtn = document.getElementById('editCart');
    const deliveryOptions = document.querySelectorAll('input[name="deliveryOption"]');
    
    // Initialize Bootstrap components
    let confirmationModal = document.getElementById('confirmationModal') ? 
        new bootstrap.Modal(document.getElementById('confirmationModal')) : null;
    let toastEl = document.getElementById('liveToast');
    let toast = toastEl ? new bootstrap.Toast(toastEl, { autohide: true, delay: 3000 }) : null;
    
    // Coupons data
    const coupons = {
        'MEDI15': { discount: 0.15, message: '15% discount applied!' },
        'HEALTH20': { discount: 0.20, message: '20% discount applied!' },
        'FIRST10': { discount: 0.10, message: '10% discount for your first order!' }
    };
    
    // Gift cards data
    const giftCards = {
        'GIFT50': { amount: 50000, message: 'UGX 50,000 gift card applied!' },
        'GIFT20': { amount: 20000, message: 'UGX 20,000 gift card applied!' }
    };
    
    let appliedCoupon = null;
    let appliedGiftCard = null;
    let isEditing = false;
    
    // Initialize the page
    initCart();
    
    function initCart() {
        renderCart();
        renderSavedItems();
        renderRecentlyViewed();
        renderRecommendedItems();
        updateCartSummary();
        updateCartCount();
        
        // Show saved items section if there are saved items
        if (savedItems.length > 0 && savedItemsSection) {
            savedItemsSection.style.display = 'block';
        } else if (savedItemsSection) {
            savedItemsSection.style.display = 'none';
        }
    }
    
    // Render cart items
    function renderCart() {
        if (!cartItemsContainer) return;
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="empty-cart-message animate__animated animate__fadeIn">
                    <i class="fas fa-shopping-cart"></i>
                    <h4>Your cart is empty</h4>
                    <p>Looks like you haven't added anything to your cart yet</p>
                    <a href="shop.html" class="btn btn-primary">
                        <i class="fas fa-arrow-right"></i> Start Shopping
                    </a>
                </div>
            `;
            return;
        }
        
        cartItemsContainer.innerHTML = '';
        
        cart.forEach((item, index) => {
            const cartItemElement = document.createElement('div');
            cartItemElement.className = 'cart-item animate__animated animate__fadeIn';
            
            // Determine stock status class
            let stockClass = '';
            if (item.stock === 'Low Stock') stockClass = 'warning';
            if (item.stock === 'Out of Stock') stockClass = 'danger';
            
            cartItemElement.innerHTML = `
                <img src="${item.image}" alt="${item.title}" class="cart-item-img">
                <div class="cart-item-details">
                    <h5 class="cart-item-title">${item.title}</h5>
                    <p class="cart-item-category">${item.category}</p>
                    <div class="cart-item-stock ${stockClass}">
                        <i class="fas fa-${item.stock === 'In Stock' ? 'check-circle' : item.stock === 'Low Stock' ? 'exclamation-circle' : 'times-circle'}"></i>
                        <span>${item.stock}</span>
                    </div>
                </div>
                <div class="cart-item-price">
                    ${formatPrice(item.price)}
                    ${item.oldPrice ? `<span class="cart-item-old-price">${formatPrice(item.oldPrice)}</span>` : ''}
                </div>
                <div class="cart-item-quantity">
                    <div class="quantity-control">
                        <button class="btn btn-outline-secondary btn-sm decrease-quantity" data-index="${index}">
                            <i class="fas fa-minus"></i>
                        </button>
                        <input type="number" class="form-control quantity-input" value="${item.quantity}" min="1" data-index="${index}">
                        <button class="btn btn-outline-secondary btn-sm increase-quantity" data-index="${index}">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                </div>
                <div class="cart-item-total">${formatPrice(item.price * item.quantity)}</div>
                <div class="cart-item-actions" style="display: ${isEditing ? 'flex' : 'none'}">
                    <button class="btn cart-item-remove" data-index="${index}">
                        <i class="fas fa-times"></i>
                    </button>
                    <button class="btn cart-item-save" data-index="${index}">
                        Save for later
                    </button>
                </div>
            `;
            
            cartItemsContainer.appendChild(cartItemElement);
        });
        
        // Add event listeners to quantity controls
        document.querySelectorAll('.decrease-quantity').forEach(btn => {
            btn.addEventListener('click', decreaseQuantity);
        });
        
        document.querySelectorAll('.increase-quantity').forEach(btn => {
            btn.addEventListener('click', increaseQuantity);
        });
        
        document.querySelectorAll('.quantity-input').forEach(input => {
            input.addEventListener('change', updateQuantity);
        });
        
        document.querySelectorAll('.cart-item-remove').forEach(btn => {
            btn.addEventListener('click', removeItem);
        });
        
        document.querySelectorAll('.cart-item-save').forEach(btn => {
            btn.addEventListener('click', saveForLater);
        });
    }
    
    // Render saved for later items
    function renderSavedItems() {
        if (!savedItemsContainer || !savedItemsSection) return;
        
        if (savedItems.length === 0) {
            savedItemsContainer.innerHTML = `
                <div class="empty-saved-message">
                    <p>No items saved for later</p>
                </div>
            `;
            savedItemsSection.style.display = 'none';
            return;
        }
        
        savedItemsContainer.innerHTML = '';
        savedItemsSection.style.display = 'block';
        
        savedItems.forEach((item, index) => {
            const savedItemElement = document.createElement('div');
            savedItemElement.className = 'saved-item animate__animated animate__fadeIn';
            savedItemElement.innerHTML = `
                <img src="${item.image}" alt="${item.title}" class="saved-item-img">
                <div class="saved-item-details">
                    <h6 class="saved-item-title">${item.title}</h6>
                    <div class="saved-item-price">${formatPrice(item.price)}</div>
                </div>
                <div class="saved-item-actions">
                    <button class="btn btn-sm btn-primary saved-item-move" data-index="${index}">
                        <i class="fas fa-cart-plus"></i> Move to Cart
                    </button>
                    <button class="btn btn-sm btn-outline-danger saved-item-remove" data-index="${index}">
                        <i class="fas fa-trash"></i> Remove
                    </button>
                </div>
            `;
            
            savedItemsContainer.appendChild(savedItemElement);
        });
        
        // Add event listeners to saved item buttons
        document.querySelectorAll('.saved-item-move').forEach(btn => {
            btn.addEventListener('click', moveToCart);
        });
        
        document.querySelectorAll('.saved-item-remove').forEach(btn => {
            btn.addEventListener('click', removeSavedItem);
        });
    }
    
    // Render recently viewed items
    function renderRecentlyViewed() {
        if (!recentlyViewedContainer) return;
        
        if (recentlyViewed.length === 0) {
            recentlyViewedContainer.innerHTML = '<p class="text-muted">No recently viewed items</p>';
            return;
        }
        
        recentlyViewedContainer.innerHTML = '';
        
        // Display only the last 3 viewed items
        const itemsToShow = recentlyViewed.slice(-3).reverse();
        
        itemsToShow.forEach(item => {
            const recentItemElement = document.createElement('div');
            recentItemElement.className = 'recent-item';
            recentItemElement.innerHTML = `
                <img src="${item.image}" alt="${item.title}" class="recent-item-img">
                <h6 class="recent-item-title">${item.title}</h6>
                <div class="recent-item-price">${formatPrice(item.price)}</div>
                <button class="btn btn-sm btn-primary recent-item-btn add-recent-to-cart" data-id="${item.id}">
                    <i class="fas fa-cart-plus"></i> Add to Cart
                </button>
            `;
            
            recentlyViewedContainer.appendChild(recentItemElement);
        });
        
        // Add event listeners to "Add to Cart" buttons
        document.querySelectorAll('.add-recent-to-cart').forEach(btn => {
            btn.addEventListener('click', addRecentToCart);
        });
    }
    
    // Render recommended items
    function renderRecommendedItems() {
        if (!recommendedItemsContainer) return;
        
        if (recommendedItems.length === 0) return;
        
        recommendedItemsContainer.innerHTML = '';
        
        recommendedItems.forEach(item => {
            const recommendedItemElement = document.createElement('div');
            recommendedItemElement.className = 'recommended-item';
            recommendedItemElement.innerHTML = `
                <img src="${item.image}" alt="${item.title}" class="recommended-item-img">
                <h6 class="recommended-item-title">${item.title}</h6>
                <div class="recommended-item-price">${formatPrice(item.price)}</div>
                <button class="btn btn-sm btn-primary recommended-item-btn add-recommended-to-cart" data-id="${item.id}">
                    <i class="fas fa-cart-plus"></i> Add to Cart
                </button>
            `;
            
            recommendedItemsContainer.appendChild(recommendedItemElement);
        });
        
        // Add event listeners to "Add to Cart" buttons
        document.querySelectorAll('.add-recommended-to-cart').forEach(btn => {
            btn.addEventListener('click', addRecommendedToCart);
        });
    }
    
    // Update cart summary (subtotal, discount, total)
    function updateCartSummary() {
        if (!subtotalElement || !discountElement || !deliveryFeeElement || !totalElement || !itemCountElement) return;
        
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        let deliveryFee = 0;
        
        // Get selected delivery option
        if (deliveryOptions) {
            const selectedOption = Array.from(deliveryOptions).find(option => option.checked);
            if (selectedOption) {
                if (selectedOption.value === 'standardDelivery') {
                    deliveryFee = 5000;
                } else if (selectedOption.value === 'expressDelivery') {
                    deliveryFee = 10000;
                }
            }
        }
        
        let discount = 0;
        if (appliedCoupon) {
            discount = subtotal * appliedCoupon.discount;
        }
        
        let giftCardDiscount = 0;
        if (appliedGiftCard) {
            giftCardDiscount = appliedGiftCard.amount;
        }
        
        const total = Math.max(0, subtotal - discount - giftCardDiscount + deliveryFee);
        
        subtotalElement.textContent = formatPrice(subtotal);
        discountElement.textContent = `- ${formatPrice(discount + giftCardDiscount)}`;
        deliveryFeeElement.textContent = formatPrice(deliveryFee);
        totalElement.textContent = formatPrice(total);
        itemCountElement.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    }
    
    // Update cart count in navbar
    function updateCartCount() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        if (cartCountElements) {
            cartCountElements.forEach(el => {
                el.textContent = totalItems;
            });
        }
    }
    
    // Format price with UGX and commas
    function formatPrice(price) {
        return `UGX ${price.toLocaleString()}`;
    }
    
    // Show toast notification
    function showToast(title, message, type = 'success') {
        if (!toast || !toastEl) return;
        
        const toastTitle = document.getElementById('toastTitle');
        const toastMessage = document.getElementById('toastMessage');
        const toastHeader = toastEl.querySelector('.toast-header');
        
        if (toastTitle) toastTitle.textContent = title;
        if (toastMessage) toastMessage.textContent = message;
        
        if (toastHeader) {
            // Reset classes
            toastHeader.className = 'toast-header';
            
            // Add type-specific classes
            if (type === 'success') {
                toastHeader.classList.add('bg-success', 'text-white');
            } else if (type === 'error') {
                toastHeader.classList.add('bg-danger', 'text-white');
            } else {
                toastHeader.classList.add('bg-primary', 'text-white');
            }
        }
        
        toast.show();
    }
    
    // Decrease item quantity
    function decreaseQuantity(e) {
        const index = e.target.closest('button').dataset.index;
        if (cart[index].quantity > 1) {
            cart[index].quantity--;
            saveCart();
            renderCart();
            updateCartSummary();
            showToast('Quantity updated', `Reduced quantity of ${cart[index].title}`, 'success');
        }
    }
    
    // Increase item quantity
    function increaseQuantity(e) {
        const index = e.target.closest('button').dataset.index;
        cart[index].quantity++;
        saveCart();
        renderCart();
        updateCartSummary();
        showToast('Quantity updated', `Increased quantity of ${cart[index].title}`, 'success');
    }
    
    // Update quantity via input
    function updateQuantity(e) {
        const index = e.target.dataset.index;
        const newQuantity = parseInt(e.target.value);
        
        if (newQuantity > 0 && newQuantity <= 100) {
            cart[index].quantity = newQuantity;
            saveCart();
            renderCart();
            updateCartSummary();
            showToast('Quantity updated', `Updated quantity of ${cart[index].title} to ${newQuantity}`, 'success');
        } else if (newQuantity > 100) {
            e.target.value = 100;
            showToast('Maximum quantity', 'Maximum quantity per item is 100', 'error');
        } else {
            e.target.value = cart[index].quantity;
        }
    }
    
    // Remove item from cart
    function removeItem(e) {
        const index = e.target.closest('button').dataset.index;
        const removedItem = cart[index];
        cart.splice(index, 1);
        saveCart();
        renderCart();
        updateCartSummary();
        showToast('Item removed', `${removedItem.title} removed from cart`, 'error');
    }
    
    // Save item for later
    function saveForLater(e) {
        const index = e.target.closest('button').dataset.index;
        const itemToSave = cart[index];
        
        // Check if item already exists in saved items
        const existingItem = savedItems.find(item => item.id === itemToSave.id);
        
        if (!existingItem) {
            savedItems.push(itemToSave);
            localStorage.setItem('savedItems', JSON.stringify(savedItems));
        }
        
        // Remove from cart
        cart.splice(index, 1);
        saveCart();
        renderCart();
        renderSavedItems();
        updateCartSummary();
        showToast('Saved for later', `${itemToSave.title} moved to saved items`, 'success');
    }
    
    // Move saved item back to cart
    function moveToCart(e) {
        const index = e.target.closest('button').dataset.index;
        const itemToMove = savedItems[index];
        
        // Check if item already exists in cart
        const existingItem = cart.find(item => item.id === itemToMove.id);
        
        if (existingItem) {
            existingItem.quantity += itemToMove.quantity;
        } else {
            cart.push(itemToMove);
        }
        
        // Remove from saved items
        savedItems.splice(index, 1);
        localStorage.setItem('savedItems', JSON.stringify(savedItems));
        saveCart();
        renderCart();
        renderSavedItems();
        updateCartSummary();
        showToast('Item moved to cart', `${itemToMove.title} added to your cart`, 'success');
    }
    
    // Remove saved item
    function removeSavedItem(e) {
        const index = e.target.closest('button').dataset.index;
        const removedItem = savedItems[index];
        savedItems.splice(index, 1);
        localStorage.setItem('savedItems', JSON.stringify(savedItems));
        renderSavedItems();
        showToast('Item removed', `${removedItem.title} removed from saved items`, 'error');
    }
    
    // Add recently viewed item to cart
    function addRecentToCart(e) {
        const itemId = e.target.closest('button').dataset.id;
        const itemToAdd = recentlyViewed.find(item => item.id === itemId);
        
        if (itemToAdd) {
            addToCart(itemToAdd);
        }
    }
    
    // Add recommended item to cart
    function addRecommendedToCart(e) {
        const itemId = e.target.closest('button').dataset.id;
        const itemToAdd = recommendedItems.find(item => item.id === itemId);
        
        if (itemToAdd) {
            addToCart(itemToAdd);
        }
    }
    
    // Generic add to cart function
    function addToCart(item) {
        const existingItem = cart.find(cartItem => cartItem.id === item.id);
        
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({
                ...item,
                quantity: 1
            });
        }
        
        saveCart();
        renderCart();
        updateCartSummary();
        showToast('Item added', `${item.title} added to your cart`, 'success');
    }
    
    // Apply coupon code
    function applyCoupon() {
        if (!couponCodeInput || !couponMessage) return;
        
        const code = couponCodeInput.value.trim().toUpperCase();
        
        if (!code) {
            couponMessage.textContent = 'Please enter a coupon code';
            couponMessage.className = 'coupon-message error';
            return;
        }
        
        if (coupons[code]) {
            appliedCoupon = coupons[code];
            couponMessage.textContent = appliedCoupon.message;
            couponMessage.className = 'coupon-message success';
            couponCodeInput.value = '';
            updateCartSummary();
            showToast('Coupon applied', appliedCoupon.message, 'success');
        } else {
            couponMessage.textContent = 'Invalid coupon code';
            couponMessage.className = 'coupon-message error';
            showToast('Invalid coupon', 'The coupon code you entered is invalid', 'error');
        }
    }
    
    // Apply gift card
    function applyGiftCard() {
        if (!giftCardCodeInput || !giftCardMessage) return;
        
        const code = giftCardCodeInput.value.trim().toUpperCase();
        
        if (!code) {
            giftCardMessage.textContent = 'Please enter a gift card code';
            giftCardMessage.className = 'gift-card-message error';
            return;
        }
        
        if (giftCards[code]) {
            appliedGiftCard = giftCards[code];
            giftCardMessage.textContent = appliedGiftCard.message;
            giftCardMessage.className = 'gift-card-message success';
            giftCardCodeInput.value = '';
            updateCartSummary();
            showToast('Gift card applied', appliedGiftCard.message, 'success');
        } else {
            giftCardMessage.textContent = 'Invalid gift card code';
            giftCardMessage.className = 'gift-card-message error';
            showToast('Invalid gift card', 'The gift card code you entered is invalid', 'error');
        }
    }
    
    // Clear cart with confirmation
    function clearCart() {
        if (!confirmationModal) return;
        
        document.getElementById('confirmationModalTitle').textContent = 'Clear Cart';
        document.getElementById('confirmationModalBody').textContent = 'Are you sure you want to clear your cart? This action cannot be undone.';
        document.getElementById('confirmAction').className = 'btn btn-danger';
        document.getElementById('confirmAction').textContent = 'Clear Cart';
        
        confirmationModal.show();
        
        document.getElementById('confirmAction').onclick = function() {
            cart = [];
            appliedCoupon = null;
            appliedGiftCard = null;
            saveCart();
            renderCart();
            if (couponMessage) {
                couponMessage.textContent = '';
                couponMessage.className = 'coupon-message';
            }
            if (giftCardMessage) {
                giftCardMessage.textContent = '';
                giftCardMessage.className = 'gift-card-message';
            }
            confirmationModal.hide();
            showToast('Cart cleared', 'All items have been removed from your cart', 'error');
        };
    }
    
    // Toggle edit mode
    function toggleEditMode() {
        isEditing = !isEditing;
        
        if (editCartBtn) {
            if (isEditing) {
                editCartBtn.innerHTML = '<i class="fas fa-check"></i> Done';
                editCartBtn.classList.remove('btn-outline-secondary');
                editCartBtn.classList.add('btn-primary');
            } else {
                editCartBtn.innerHTML = '<i class="fas fa-edit"></i> Edit';
                editCartBtn.classList.remove('btn-primary');
                editCartBtn.classList.add('btn-outline-secondary');
            }
        }
        
        // Show/hide remove buttons and quantity controls
        document.querySelectorAll('.cart-item-actions').forEach(el => {
            el.style.display = isEditing ? 'flex' : 'none';
        });
        
        document.querySelectorAll('.quantity-control').forEach(el => {
            el.style.display = isEditing ? 'flex' : 'none';
        });
    }
    
    // Save cart to localStorage
    function saveCart() {
        localStorage.setItem('mediDeliverCart', JSON.stringify(cart));
        updateCartCount();
    }
    
    // Event Listeners with null checks
    if (applyCouponBtn) {
        applyCouponBtn.addEventListener('click', applyCoupon);
    }
    
    if (couponCodeInput) {
        couponCodeInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                applyCoupon();
            }
        });
    }
    
    if (applyGiftCardBtn) {
        applyGiftCardBtn.addEventListener('click', applyGiftCard);
    }
    
    if (giftCardCodeInput) {
        giftCardCodeInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                applyGiftCard();
            }
        });
    }
    
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', clearCart);
    }
    
    if (continueShoppingBtn) {
        continueShoppingBtn.addEventListener('click', function() {
            window.location.href = 'shop.html';
        });
    }
    
    if (proceedToCheckoutBtn) {
        proceedToCheckoutBtn.addEventListener('click', function() {
            if (cart.length === 0) {
                showToast('Empty cart', 'Your cart is empty. Please add some items before checkout.', 'error');
                return;
            }
            
            // In a real application, this would redirect to a checkout page
            showToast('Proceed to checkout', 'Redirecting to secure checkout page...', 'success');
            // window.location.href = 'checkout.html';
        });
    }
    
    if (editCartBtn) {
        editCartBtn.addEventListener('click', toggleEditMode);
    }
    
    if (deliveryOptions) {
        deliveryOptions.forEach(radio => {
            radio.addEventListener('change', updateCartSummary);
        });
    }
});