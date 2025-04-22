document.addEventListener("DOMContentLoaded", function() {
    // Mobile menu toggle
    const navbarToggler = document.querySelector(".navbar-toggler");
    const navbarCollapse = document.querySelector(".navbar-collapse");
    
    navbarToggler.addEventListener("click", function() {
        navbarCollapse.classList.toggle("show");
    });
    
    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll(".nav-link");
    navLinks.forEach(link => {
        link.addEventListener("click", function() {
            if (navbarCollapse.classList.contains("show")) {
                navbarCollapse.classList.remove("show");
            }
        });
    });
    
    // Product slider functionality
    const sliderTrack = document.getElementById("slider-track");
    const slides = document.querySelectorAll(".slide");
    const prevBtn = document.querySelector(".slider-btn.prev");
    const nextBtn = document.querySelector(".slider-btn.next");
    const slideWidth = slides[0].offsetWidth + 32; // width + margin
    let currentSlide = 0;
    
    function updateSlider() {
        sliderTrack.style.transform = `translateX(-${currentSlide * slideWidth}px)`;
        
        // Disable prev button if at start
        prevBtn.disabled = currentSlide === 0;
        
        // Disable next button if at end
        nextBtn.disabled = currentSlide >= slides.length - 3;
    }
    
    prevBtn.addEventListener("click", function() {
        if (currentSlide > 0) {
            currentSlide--;
            updateSlider();
        }
    });
    
    nextBtn.addEventListener("click", function() {
        if (currentSlide < slides.length - 3) {
            currentSlide++;
            updateSlider();
        }
    });
    
    // Initialize slider
    updateSlider();
    
    // Prescription upload functionality
    const uploadArea = document.getElementById("uploadArea");
    const prescriptionFile = document.getElementById("prescriptionFile");
    
    uploadArea.addEventListener("click", function() {
        prescriptionFile.click();
    });
    
    prescriptionFile.addEventListener("change", function() {
        if (this.files.length > 0) {
            const fileName = this.files[0].name;
            uploadArea.innerHTML = `
                <i class="fas fa-check-circle" style="color: #28A745;"></i>
                <p>${fileName} selected</p>
                <small>Click to change file</small>
            `;
        }
    });
    
    // Drag and drop for prescription upload
    uploadArea.addEventListener("dragover", function(e) {
        e.preventDefault();
        this.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
    });
    
    uploadArea.addEventListener("dragleave", function() {
        this.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
    });
    
    uploadArea.addEventListener("drop", function(e) {
        e.preventDefault();
        this.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
        
        if (e.dataTransfer.files.length > 0) {
            prescriptionFile.files = e.dataTransfer.files;
            const fileName = e.dataTransfer.files[0].name;
            uploadArea.innerHTML = `
                <i class="fas fa-check-circle" style="color: #28A745;"></i>
                <p>${fileName} selected</p>
                <small>Click to change file</small>
            `;
        }
    });
    
    // Add to cart functionality
    const addToCartButtons = document.querySelectorAll(".add-to-cart");
    const cartCount = document.querySelector(".cart-count");
    let cartItems = 0;
    
    addToCartButtons.forEach(button => {
        button.addEventListener("click", function() {
            cartItems++;
            cartCount.textContent = cartItems;
            
            // Add animation
            this.textContent = "Added!";
            this.style.backgroundColor = "#28A745";
            
            setTimeout(() => {
                this.textContent = "Add to Cart";
                this.style.backgroundColor = "";
            }, 1000);
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

document.addEventListener("DOMContentLoaded", function () {
    let slides = document.querySelectorAll(".rated_section");
    let currentIndex = 0;
    const totalSlides = slides.length;

    function initSlides() {
        slides.forEach(slide => {
            slide.style.position = "absolute";
            slide.style.transition = "none";
            slide.style.left = "100%"; // hide all initially
        });

        slides[currentIndex].style.left = "4%";
        slides[(currentIndex + 1) % totalSlides].style.left = "28%";
        slides[(currentIndex + 2) % totalSlides].style.left = "53%";
        slides[(currentIndex + 3) % totalSlides].style.left = "78%";
    }

    function showNext() {
        let first = currentIndex % totalSlides;
        let second = (currentIndex + 1) % totalSlides;
        let third = (currentIndex + 2) % totalSlides;
        let fourth = (currentIndex + 3) % totalSlides;
        let next = (currentIndex + 4) % totalSlides;

        // Slide at 4% moves out to -100%
        slides[first].style.transition = "left 1s ease-in-out";
        slides[first].style.left = "-100%";

        // Slide at 34% moves to 4%
        slides[second].style.transition = "left 1s ease-in-out";
        slides[second].style.left = "4%";

        // Slide at 60% moves to 34%
        slides[third].style.transition = "left 1s ease-in-out";
        slides[third].style.left = "28%";

        // Slide at 80% moves to 60%
        slides[fourth].style.transition = "left 1s ease-in-out";
        slides[fourth].style.left = "53%";

        // Prepare next slide
        slides[next].style.transition = "none";
        slides[next].style.left = "100%";

        // Animate it into 80%
        setTimeout(() => {
            slides[next].style.transition = "left 1s ease-in-out";
            slides[next].style.left = "78%";
        }, 50);

        currentIndex = (currentIndex + 1) % totalSlides;
    }

    initSlides();
    setInterval(showNext, 3000);
});

//end

document.addEventListener("DOMContentLoaded", function () {
    let slides = document.querySelectorAll(".rated_section_phone");
    let currentIndex = 0;
    const totalSlides = slides.length;

    function initSlides() {
        slides.forEach(slide => {
            slide.style.position = "absolute";
            slide.style.transition = "none";
            slide.style.left = "100%"; // hide all initially
        });

        slides[currentIndex].style.left = "10%"; // show only the first slide
    }

    function showNext() {
        let current = currentIndex % totalSlides;
        let next = (currentIndex + 1) % totalSlides;

        // Move current out to the left
        slides[current].style.transition = "left 1s ease-in-out";
        slides[current].style.left = "-100%";

        // Prepare next slide on the right
        slides[next].style.transition = "none";
        slides[next].style.left = "100%";

        // Slide next into view
        setTimeout(() => {
            slides[next].style.transition = "left 1s ease-in-out";
            slides[next].style.left = "10%";
        }, 50);

        currentIndex = next;
    }

    initSlides();
    setInterval(showNext, 3000);
});

