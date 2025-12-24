// checkout-script.js - JavaScript khusus untuk halaman checkout

document.addEventListener('DOMContentLoaded', function() {
    console.log('Checkout page loaded');
    
    // Elemen DOM
    const checkoutForm = document.getElementById('checkoutForm');
    const orderSummary = document.getElementById('orderSummary');
    const subtotalEl = document.getElementById('subtotal');
    const shippingCostEl = document.getElementById('shippingCost');
    const taxEl = document.getElementById('tax');
    const totalAmountEl = document.getElementById('totalAmount');
    const processPaymentBtn = document.getElementById('processPayment');
    const agreeTerms = document.getElementById('agreeTerms');
    const successModal = new bootstrap.Modal(document.getElementById('successModal'));
    
    // Data pesanan
    let cartItems = [];
    let shippingCost = 15000;
    
    // Load cart dari localStorage
    function loadCart() {
        const cart = JSON.parse(localStorage.getItem('techshop_cart')) || [];
        cartItems = cart;
        
        if (cartItems.length === 0) {
            orderSummary.innerHTML = `
                <div class="text-center py-4">
                    <i class="fas fa-shopping-cart fa-3x text-muted mb-3"></i>
                    <p class="text-muted">Keranjang belanja kosong</p>
                    <a href="index.html#products" class="btn btn-primary">Mulai Belanja</a>
                </div>
            `;
            processPaymentBtn.disabled = true;
            return;
        }
        
        // Render order summary
        renderOrderSummary();
        calculateTotals();
    }
    
    // Render order summary
    function renderOrderSummary() {
        let html = '<h6 class="mb-3">Produk yang dipesan:</h6>';
        
        cartItems.forEach(item => {
            const itemTotal = item.price * item.quantity;
            html += `
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <div>
                        <strong>${item.name}</strong>
                        <br>
                        <small class="text-muted">${item.quantity} × Rp ${formatRupiah(item.price)}</small>
                    </div>
                    <span>Rp ${formatRupiah(itemTotal)}</span>
                </div>
            `;
        });
        
        orderSummary.innerHTML = html;
    }
    
    // Hitung total
    function calculateTotals() {
        // Hitung subtotal
        const subtotal = cartItems.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);
        
        // Hitung pajak (10%)
        const tax = subtotal * 0.1;
        
        // Hitung total
        const total = subtotal + shippingCost + tax;
        
        // Update UI
        subtotalEl.textContent = `Rp ${formatRupiah(subtotal)}`;
        taxEl.textContent = `Rp ${formatRupiah(tax)}`;
        totalAmountEl.textContent = `Rp ${formatRupiah(total)}`;
    }
    
    // Format rupiah
    function formatRupiah(amount) {
        return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
    
    // Update shipping cost berdasarkan pilihan
    document.querySelectorAll('input[name="pengiriman"]').forEach(radio => {
        radio.addEventListener('change', function() {
            switch(this.id) {
                case 'regular':
                    shippingCost = 15000;
                    break;
                case 'express':
                    shippingCost = 30000;
                    break;
                case 'instan':
                    shippingCost = 50000;
                    break;
            }
            shippingCostEl.textContent = `Rp ${formatRupiah(shippingCost)}`;
            calculateTotals();
        });
    });
    
    // Toggle payment details
    document.querySelectorAll('input[name="pembayaran"]').forEach(radio => {
        radio.addEventListener('change', function() {
            // Sembunyikan semua details
            document.querySelectorAll('.payment-details').forEach(detail => {
                detail.style.display = 'none';
            });
            
            // Tampilkan details yang sesuai
            if (this.id === 'transfer') {
                document.getElementById('transferDetails').style.display = 'block';
            } else if (this.id === 'ewallet') {
                document.getElementById('ewalletDetails').style.display = 'block';
            }
        });
    });
    
    // Proses pembayaran
    processPaymentBtn.addEventListener('click', function() {
        // Validasi form
        if (!checkoutForm.checkValidity()) {
            checkoutForm.classList.add('was-validated');
            return;
        }
        
        // Validasi checkbox terms
        if (!agreeTerms.checked) {
            alert('Anda harus menyetujui Syarat & Ketentuan');
            return;
        }
        
        // Validasi cart tidak kosong
        if (cartItems.length === 0) {
            alert('Keranjang belanja kosong');
            return;
        }
        
        // Tampilkan loading
        const originalText = processPaymentBtn.innerHTML;
        processPaymentBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Memproses...';
        processPaymentBtn.disabled = true;
        
        // Simulasi proses pembayaran
        setTimeout(() => {
            // Simpan data order
            const orderData = {
                orderId: generateOrderId(),
                customer: {
                    name: document.getElementById('nama').value,
                    email: document.getElementById('email').value,
                    phone: document.getElementById('telepon').value,
                    address: document.getElementById('alamat').value,
                    city: document.getElementById('kota').value,
                    postalCode: document.getElementById('kodePos').value
                },
                shipping: document.querySelector('input[name="pengiriman"]:checked').id,
                shippingCost: shippingCost,
                paymentMethod: document.querySelector('input[name="pembayaran"]:checked').id,
                items: cartItems,
                subtotal: cartItems.reduce((total, item) => total + (item.price * item.quantity), 0),
                tax: cartItems.reduce((total, item) => total + (item.price * item.quantity), 0) * 0.1,
                total: cartItems.reduce((total, item) => total + (item.price * item.quantity), 0) + 
                       shippingCost + 
                       (cartItems.reduce((total, item) => total + (item.price * item.quantity), 0) * 0.1),
                orderDate: new Date().toISOString()
            };
            
            // Simpan ke localStorage
            saveOrder(orderData);
            
            // Kosongkan cart
            localStorage.removeItem('techshop_cart');
            
            // Update cart counter
            updateCartCounter();
            
            // Tampilkan order number di modal
            document.getElementById('orderNumber').textContent = orderData.orderId;
            
            // Tampilkan modal sukses
            successModal.show();
            
            // Reset button
            processPaymentBtn.innerHTML = originalText;
            processPaymentBtn.disabled = false;
        }, 2000);
    });
    
    // Generate order ID
    function generateOrderId() {
        const now = new Date();
        const dateStr = now.getFullYear().toString() + 
                       (now.getMonth() + 1).toString().padStart(2, '0') + 
                       now.getDate().toString().padStart(2, '0');
        const randomStr = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `TS-${dateStr}-${randomStr}`;
    }
    
    // Simpan order ke localStorage
    function saveOrder(orderData) {
        let orders = JSON.parse(localStorage.getItem('techshop_orders')) || [];
        orders.push(orderData);
        localStorage.setItem('techshop_orders', JSON.stringify(orders));
    }
    
    // Update cart counter
    function updateCartCounter() {
        const cart = JSON.parse(localStorage.getItem('techshop_cart')) || [];
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        
        const cartCounter = document.querySelector('.cart-counter');
        if (cartCounter) {
            cartCounter.textContent = totalItems;
            cartCounter.style.display = totalItems > 0 ? 'inline' : 'none';
        }
    }
    
    // Fungsi print invoice
    window.printInvoice = function() {
        // Ini hanya simulasi, implementasi nyata akan generate PDF
        alert('Fitur cetak invoice akan membuka PDF');
        successModal.hide();
    };
    
    // Initialize
    loadCart();
    updateCartCounter();
});