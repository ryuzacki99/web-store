// main.js - JavaScript umum untuk seluruh website

document.addEventListener('DOMContentLoaded', function() {
    console.log('TechShop website loaded');
    
    // Inisialisasi tooltip Bootstrap
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    // Smooth scroll untuk link dengan hash
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Animasi fade in untuk elemen
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);
    
    // Observasi elemen untuk animasi
    document.querySelectorAll('.category-card, .product-card').forEach(el => {
        observer.observe(el);
    });

    // Fungsionalitas "Add to Cart" untuk Produk Unggulan
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const card = this.closest('.product-card');
            addToCart(card);
        });
    });

    // Panggil saat halaman load untuk inisialisasi counter
    updateCartCounter();
});

/**
 * Menampilkan notifikasi toast.
 * @param {string} message - Pesan yang akan ditampilkan.
 */
function showToast(message) {
    const toastElement = document.getElementById('cartToast');
    const toastMessage = document.getElementById('toastMessage');
    
    if(toastElement && toastMessage) {
        toastMessage.textContent = message;
        const toast = new bootstrap.Toast(toastElement);
        toast.show();
    }
}

/**
 * Menambahkan produk ke keranjang belanja.
 * @param {HTMLElement} card - Elemen kartu produk.
 */
function addToCart(card) {
    const product = {
        id: card.dataset.productId,
        name: card.dataset.productName,
        price: parseInt(card.dataset.productPrice),
        image: card.dataset.productImage,
        quantity: 1
    };

    let cart = JSON.parse(localStorage.getItem('techshop_cart')) || [];
    
    const existingProductIndex = cart.findIndex(item => item.id === product.id);

    if (existingProductIndex > -1) {
        // Jika produk sudah ada, tambah kuantitasnya
        cart[existingProductIndex].quantity += 1;
    } else {
        // Jika produk baru, tambahkan ke keranjang
        cart.push(product);
    }

    // Simpan kembali ke localStorage
    localStorage.setItem('techshop_cart', JSON.stringify(cart));

    // Perbarui counter di navbar
    updateCartCounter();

    // Tampilkan notifikasi
    showToast(`${product.name} telah ditambahkan ke keranjang!`);
}


/**
 * Memperbarui counter keranjang di navbar.
 */
function updateCartCounter() {
    const cart = JSON.parse(localStorage.getItem('techshop_cart')) || [];
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    const cartCounters = document.querySelectorAll('.cart-counter');
    if (cartCounters) {
        cartCounters.forEach(cartCounter => {
            cartCounter.textContent = totalItems;
            cartCounter.style.display = totalItems > 0 ? 'inline-block' : 'none';
        });
    }
}