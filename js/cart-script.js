// cart-script.js - JavaScript khusus untuk halaman cart

document.addEventListener('DOMContentLoaded', function() {
    console.log('Cart page loaded');
    
    // Elemen DOM
    const cartContainer = document.getElementById('cartContainer');
    const cartItems = document.getElementById('cartItems');
    const emptyCart = document.getElementById('emptyCart');
    const cartTableBody = document.getElementById('cartTableBody');
    const itemCount = document.getElementById('itemCount');
    const clearCartBtn = document.getElementById('clearCartBtn');
    const checkoutBtn = document.getElementById('checkoutBtn');
    const checkoutBtnSummary = document.getElementById('checkoutBtnSummary');
    const summaryContent = document.getElementById('summaryContent');
    const recommendationsSection = document.getElementById('recommendationsSection');
    const recommendations = document.getElementById('recommendations');
    const deleteItemModal = new bootstrap.Modal(document.getElementById('deleteItemModal'));
    const deleteProductName = document.getElementById('deleteProductName');
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    const shippingEstimate = document.getElementById('shippingEstimate');
    const couponCode = document.getElementById('couponCode');
    const applyCouponBtn = document.getElementById('applyCouponBtn');
    const couponMessage = document.getElementById('couponMessage');
    
    // Data
    let cartData = [];
    let itemToDelete = null;
    let appliedCoupon = null;
    const coupons = {
        'TECHSHOP10': 0.1,   // 10% discount
        'WELCOME15': 0.15,   // 15% discount
        'FREESHIP': 'free_shipping' // Free shipping
    };
    
    // Load cart dari localStorage
    function loadCart() {
        const cart = JSON.parse(localStorage.getItem('techshop_cart')) || [];
        cartData = cart;
        
        updateCartDisplay();
        updateCartCounter();
        loadRecommendations();
    }
    
    // Update tampilan cart
    function updateCartDisplay() {
        const totalItems = cartData.reduce((total, item) => total + item.quantity, 0);
        
        // Update item count
        itemCount.textContent = `${totalItems} ${totalItems === 1 ? 'item' : 'items'}`;
        
        if (totalItems === 0) {
            // Tampilkan keranjang kosong
            emptyCart.style.display = 'block';
            cartItems.style.display = 'none';
            clearCartBtn.style.display = 'none';
            checkoutBtn.style.display = 'none';
            checkoutBtnSummary.style.display = 'none';
            recommendationsSection.style.display = 'none';
            
            summaryContent.innerHTML = `
                <div class="text-center py-3">
                    <p class="text-muted">Tambahkan produk ke keranjang untuk melihat ringkasan</p>
                </div>
            `;
        } else {
            // Tampilkan produk dalam cart
            emptyCart.style.display = 'none';
            cartItems.style.display = 'block';
            clearCartBtn.style.display = 'block';
            checkoutBtn.style.display = 'block';
            checkoutBtnSummary.style.display = 'block';
            
            renderCartTable();
            updateSummary();
            
            // Tampilkan rekomendasi jika ada
            if (cartData.length > 0) {
                recommendationsSection.style.display = 'block';
            }
        }
    }
    
    // Render tabel cart
    function renderCartTable() {
        cartTableBody.innerHTML = '';
        
        cartData.forEach((item, index) => {
            const subtotal = item.price * item.quantity;
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <img src="${item.image || 'https://images.unsplash.com/photo-1593640494705-8daa10c8c5ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80'}" 
                         alt="${item.name}" 
                         class="img-thumbnail" 
                         style="width: 60px; height: 60px; object-fit: cover;">
                </td>
                <td>
                    <h6 class="mb-1">${item.name}</h6>
                    <small class="text-muted">${item.category || 'Komputer'}</small>
                </td>
                <td class="text-center">
                    <span class="h6">Rp ${formatRupiah(item.price)}</span>
                </td>
                <td class="text-center">
                    <div class="input-group input-group-sm" style="width: 120px; margin: 0 auto;">
                        <button class="btn btn-outline-secondary" type="button" onclick="updateQuantity(${index}, -1)">
                            <i class="fas fa-minus"></i>
                        </button>
                        <input type="number" class="form-control text-center" 
                               value="${item.quantity}" 
                               min="1" 
                               max="10"
                               onchange="updateQuantityInput(${index}, this.value)">
                        <button class="btn btn-outline-secondary" type="button" onclick="updateQuantity(${index}, 1)">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                </td>
                <td class="text-center">
                    <span class="h6 text-primary">Rp ${formatRupiah(subtotal)}</span>
                </td>
                <td>
                    <button class="btn btn-outline-danger btn-sm" onclick="showDeleteModal(${index}, '${item.name}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            
            cartTableBody.appendChild(row);
        });
    }
    
    // Update summary belanja
    function updateSummary() {
        // Hitung subtotal
        const subtotal = cartData.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);
        
        // Hitung shipping cost
        let shipping = 15000; // default regular
        if (shippingEstimate.value === 'express') {
            shipping = 30000;
        } else if (shippingEstimate.value === 'instant') {
            shipping = 50000;
        }
        
        // Apply free shipping coupon
        if (appliedCoupon === 'free_shipping') {
            shipping = 0;
        }
        
        // Hitung diskon
        let discount = 0;
        if (appliedCoupon && appliedCoupon !== 'free_shipping') {
            discount = subtotal * appliedCoupon;
        }
        
        // Hitung pajak (10%)
        const tax = (subtotal - discount) * 0.1;
        
        // Hitung total
        const total = (subtotal - discount) + shipping + tax;
        
        // Tampilkan di summary
        summaryContent.innerHTML = `
            <div class="d-flex justify-content-between mb-2">
                <span>Subtotal</span>
                <span>Rp ${formatRupiah(subtotal)}</span>
            </div>
            ${discount > 0 ? `
            <div class="d-flex justify-content-between mb-2 text-success">
                <span>Diskon</span>
                <span>- Rp ${formatRupiah(discount)}</span>
            </div>
            ` : ''}
            <div class="d-flex justify-content-between mb-2">
                <span>Biaya Pengiriman</span>
                <span>Rp ${formatRupiah(shipping)}</span>
            </div>
            <div class="d-flex justify-content-between mb-2">
                <span>Pajak (10%)</span>
                <span>Rp ${formatRupiah(tax)}</span>
            </div>
            <hr>
            <div class="d-flex justify-content-between mb-3">
                <h5>Total</h5>
                <h4 class="text-primary">Rp ${formatRupiah(total)}</h4>
            </div>
        `;
    }
    
    // Update quantity dengan tombol
    window.updateQuantity = function(index, change) {
        const newQuantity = cartData[index].quantity + change;
        
        if (newQuantity < 1) {
            showDeleteModal(index, cartData[index].name);
            return;
        }
        
        if (newQuantity > 10) {
            alert('Maksimal 10 item per produk');
            return;
        }
        
        cartData[index].quantity = newQuantity;
        saveCart();
        updateCartDisplay();
    };
    
    // Update quantity dengan input
    window.updateQuantityInput = function(index, value) {
        const newQuantity = parseInt(value);
        
        if (isNaN(newQuantity) || newQuantity < 1) {
            cartData[index].quantity = 1;
        } else if (newQuantity > 10) {
            cartData[index].quantity = 10;
            alert('Maksimal 10 item per produk');
        } else {
            cartData[index].quantity = newQuantity;
        }
        
        saveCart();
        updateCartDisplay();
    };
    
    // Show delete modal
    window.showDeleteModal = function(index, productName) {
        itemToDelete = index;
        deleteProductName.textContent = productName;
        deleteItemModal.show();
    };
    
    // Konfirmasi hapus
    confirmDeleteBtn.addEventListener('click', function() {
        if (itemToDelete !== null) {
            cartData.splice(itemToDelete, 1);
            saveCart();
            updateCartDisplay();
            deleteItemModal.hide();
            itemToDelete = null;
        }
    });
    
    // Kosongkan keranjang
    clearCartBtn.addEventListener('click', function() {
        if (confirm('Apakah Anda yakin ingin mengosongkan keranjang belanja?')) {
            cartData = [];
            saveCart();
            updateCartDisplay();
            appliedCoupon = null;
            couponCode.value = '';
            couponMessage.textContent = '';
            couponMessage.className = 'small mt-2';
        }
    });
    
    // Checkout
    checkoutBtn.addEventListener('click', proceedToCheckout);
    checkoutBtnSummary.addEventListener('click', proceedToCheckout);
    
    function proceedToCheckout() {
        if (cartData.length === 0) {
            alert('Keranjang belanja kosong');
            return;
        }
        
        // Simpan coupon ke localStorage untuk digunakan di checkout
        if (appliedCoupon) {
            localStorage.setItem('techshop_applied_coupon', JSON.stringify({
                code: couponCode.value.toUpperCase(),
                value: appliedCoupon
            }));
        }
        
        // Redirect ke checkout page
        window.location.href = 'checkout.html';
    }
    
    // Load rekomendasi produk
    function loadRecommendations() {
        // Simulasi data rekomendasi
        const recommendedProducts = [
            {
                name: "SSD NVMe 1TB",
                price: 1500000,
                image: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
                category: "Storage"
            },
            {
                name: "Mouse Gaming RGB",
                price: 350000,
                image: "https://images.unsplash.com/photo-1527814050087-3793815479db?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
                category: "Aksesori"
            },
            {
                name: "Keyboard Mechanical",
                price: 800000,
                image: "https://images.unsplash.com/photo-1541140532154-b024d705b90a?ixlib=rb-4.0.3&auto=format&fit=crop&w-300&q=80",
                category: "Aksesori"
            }
        ];
        
        recommendations.innerHTML = '';
        
        recommendedProducts.forEach(product => {
            const col = document.createElement('div');
            col.className = 'col-md-4';
            col.innerHTML = `
                <div class="card h-100 shadow-sm">
                    <img src="${product.image}" class="card-img-top" alt="${product.name}" style="height: 100px; object-fit: cover;">
                    <div class="card-body text-center">
                        <h6 class="card-title">${product.name}</h6>
                        <p class="card-text text-primary fw-bold">Rp ${formatRupiah(product.price)}</p>
                        <button class="btn btn-outline-primary btn-sm" onclick="addToCartFromRecommendation('${product.name}', ${product.price})">
                            <i class="fas fa-cart-plus me-1"></i>Tambah
                        </button>
                    </div>
                </div>
            `;
            recommendations.appendChild(col);
        });
    }
    
    // Tambah produk dari rekomendasi
    window.addToCartFromRecommendation = function(name, price) {
        // Cek apakah produk sudah ada di cart
        const existingIndex = cartData.findIndex(item => item.name === name);
        
        if (existingIndex !== -1) {
            // Update quantity jika sudah ada
            if (cartData[existingIndex].quantity < 10) {
                cartData[existingIndex].quantity += 1;
            } else {
                alert('Maksimal 10 item per produk');
                return;
            }
        } else {
            // Tambah produk baru
            cartData.push({
                id: `rec-${Date.now()}`,
                name: name,
                price: price,
                quantity: 1,
                category: "Rekomendasi",
                image: "https://images.unsplash.com/photo-1593640494705-8daa10c8c5ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
            });
        }
        
        saveCart();
        updateCartDisplay();
        
        // Show success message
        const toast = document.createElement('div');
        toast.className = 'position-fixed bottom-0 end-0 p-3';
        toast.innerHTML = `
            <div class="toast show" role="alert" style="z-index: 9999;">
                <div class="toast-header bg-success text-white">
                    <i class="fas fa-check-circle me-2"></i>
                    <strong class="me-auto">Berhasil</strong>
                    <button type="button" class="btn-close btn-close-white" onclick="this.parentElement.parentElement.remove()"></button>
                </div>
                <div class="toast-body">
                    ${name} telah ditambahkan ke keranjang
                </div>
            </div>
        `;
        document.body.appendChild(toast);
        
        // Auto remove toast after 3 seconds
        setTimeout(() => {
            if (toast.parentElement) {
                toast.remove();
            }
        }, 3000);
    };
    
    // Apply coupon
    applyCouponBtn.addEventListener('click', function() {
        const code = couponCode.value.trim().toUpperCase();
        
        if (!code) {
            couponMessage.textContent = 'Masukkan kode kupon';
            couponMessage.className = 'small mt-2 text-danger';
            return;
        }
        
        if (coupons[code]) {
            appliedCoupon = coupons[code];
            couponMessage.textContent = 'Kupon berhasil diterapkan!';
            couponMessage.className = 'small mt-2 text-success';
            updateSummary();
        } else {
            appliedCoupon = null;
            couponMessage.textContent = 'Kode kupon tidak valid';
            couponMessage.className = 'small mt-2 text-danger';
            updateSummary();
        }
    });
    
    // Update shipping estimate
    shippingEstimate.addEventListener('change', function() {
        updateSummary();
    });
    
    // Save cart to localStorage
    function saveCart() {
        localStorage.setItem('techshop_cart', JSON.stringify(cartData));
        updateCartCounter();
    }
    
    // Update cart counter di navbar
    function updateCartCounter() {
        const totalItems = cartData.reduce((total, item) => total + item.quantity, 0);
        
        const cartCounter = document.querySelector('.cart-counter');
        if (cartCounter) {
            cartCounter.textContent = totalItems;
            cartCounter.style.display = totalItems > 0 ? 'inline' : 'none';
        }
    }
    
    // Format rupiah
    function formatRupiah(amount) {
        return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
    
    // Initialize
    loadCart();
});