// ram-script.js - JavaScript khusus untuk halaman kategori RAM

document.addEventListener('DOMContentLoaded', function() {
    console.log('RAM category page loaded');
    
    // Elemen DOM
    const filterType = document.getElementById('ramFilterType');
    const filterCapacity = document.getElementById('ramFilterCapacity');
    const filterSpeed = document.getElementById('ramFilterSpeed');
    const resetFilter = document.getElementById('ramResetFilter');
    const ramProducts = document.getElementById('ramProducts');
    const productCount = document.getElementById('ramProductCount');
    const productItems = document.querySelectorAll('.ram-product-item');
    const addToCartButtons = document.querySelectorAll('.add-to-cart-ram');
    const viewDetailsButtons = document.querySelectorAll('.view-details-ram');
    
    // Modal dan Toast
    const productModal = new bootstrap.Modal(document.getElementById('ramProductModal'));
    const cartToast = new bootstrap.Toast(document.getElementById('ramCartToast'));
    const toastMessage = document.getElementById('ramToastMessage');
    
    // Data produk untuk modal
    const ramProductData = {
        "CORSAIR Vengeance RGB 32GB DDR5 6000MHz": {
            image: "https://images.unsplash.com/photo-1593640494705-8daa10c8c5ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            brand: "CORSAIR",
            description: "RAM DDR5 dengan lighting RGB yang dapat dikustomisasi via iCUE software. Performa tinggi untuk gaming dan aplikasi berat.",
            specs: [
                "Kapasitas: 32GB (2x16GB)",
                "Tipe: DDR5",
                "Kecepatan: 6000MHz",
                "Timing: 36-36-36-76",
                "Voltage: 1.35V",
                "RGB: Yes (Addressable RGB)",
                "Garansi: Lifetime"
            ],
            price: "Rp 3.500.000",
            hasRGB: true
        },
        "G.SKILL Trident Z5 RGB 64GB DDR5 6400MHz": {
            image: "https://images.unsplash.com/photo-1593640494705-8daa10c8c5ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            brand: "G.SKILL",
            description: "RAM DDR5 berkecepatan tinggi dengan desain aluminium dan RGB lighting untuk workstation profesional.",
            specs: [
                "Kapasitas: 64GB (2x32GB)",
                "Tipe: DDR5",
                "Kecepatan: 6400MHz",
                "Timing: 32-38-38-96",
                "Voltage: 1.4V",
                "RGB: Yes (Trident Z Lighting)",
                "Garansi: Lifetime"
            ],
            price: "Rp 8.200.000",
            hasRGB: true
        },
        "Kingston Fury Beast 16GB DDR4 3200MHz": {
            image: "https://images.unsplash.com/photo-1593640494705-8daa10c8c5ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            brand: "KINGSTON",
            description: "RAM DDR4 dengan performa optimal untuk gaming dan aplikasi sehari-hari. Plug & Play tanpa perlu setting BIOS.",
            specs: [
                "Kapasitas: 16GB (2x8GB)",
                "Tipe: DDR4",
                "Kecepatan: 3200MHz",
                "Timing: 16-18-18-36",
                "Voltage: 1.35V",
                "RGB: No",
                "Garansi: Lifetime"
            ],
            price: "Rp 1.200.000",
            hasRGB: false
        }
    };
    
    // Fungsi filter produk
    function filterProducts() {
        const typeValue = filterType.value;
        const capacityValue = filterCapacity.value;
        const speedValue = filterSpeed.value;
        
        let visibleCount = 0;
        
        productItems.forEach(item => {
            const itemType = item.getAttribute('data-type');
            const itemCapacity = item.getAttribute('data-capacity');
            const itemSpeed = item.getAttribute('data-speed');
            
            const typeMatch = !typeValue || itemType === typeValue;
            const capacityMatch = !capacityValue || itemCapacity === capacityValue;
            const speedMatch = !speedValue || itemSpeed === speedValue;
            
            if (typeMatch && capacityMatch && speedMatch) {
                item.style.display = 'block';
                visibleCount++;
                
                // Tambah efek untuk item yang visible
                item.style.opacity = '0';
                item.style.transform = 'translateY(20px)';
                void item.offsetWidth; // Trigger reflow
                setTimeout(() => {
                    item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, visibleCount * 100);
            } else {
                item.style.display = 'none';
            }
        });
        
        productCount.textContent = visibleCount;
    }
    
    // Fungsi reset filter
    function resetFilters() {
        filterType.value = '';
        filterCapacity.value = '';
        filterSpeed.value = '';
        filterProducts();
    }
    
    // Fungsi tampilkan modal detail produk
    function showProductDetails(productName) {
        const product = ramProductData[productName];
        
        if (product) {
            document.getElementById('ramModalProductImage').src = product.image;
            document.getElementById('ramModalProductTitle').textContent = productName;
            document.getElementById('ramModalProductBrand').innerHTML = 
                `<span class="brand-badge ${product.brand.toLowerCase()}">${product.brand}</span>`;
            document.getElementById('ramModalProductDescription').textContent = product.description;
            document.getElementById('ramModalProductPrice').textContent = product.price;
            
            const specsList = document.getElementById('ramModalProductSpecs');
            specsList.innerHTML = '';
            product.specs.forEach(spec => {
                const li = document.createElement('li');
                li.textContent = spec;
                specsList.appendChild(li);
            });
            
            // Update tombol add to cart di modal
            document.getElementById('ramModalAddToCart').setAttribute('data-product', productName);
            
            productModal.show();
        }
    }
    
    // Fungsi tambah ke keranjang
    function addToCart(productName) {
        // Ambil detail produk dari ramProductData
        const productDetails = ramProductData[productName];
        if (!productDetails) {
            console.error('Product details not found for:', productName);
            return;
        }

        // Parsing harga dari string menjadi angka
        const price = parseInt(productDetails.price.replace(/[^0-9]/g, ''));
        
        const product = {
            id: productName.replace(/\s+/g, '-').toLowerCase(), // Buat ID unik dari nama
            name: productName,
            price: price,
            image: productDetails.image,
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
        
        // Update toast message
        toastMessage.textContent = `${productName} telah ditambahkan ke keranjang belanja!`;
        
        // Tampilkan toast
        cartToast.show();
        
        // Update counter di navbar (jika ada)
        updateCartCounter();
        
        // Efek visual pada tombol
        const button = event.target.closest('.add-to-cart-ram');
        if (button) {
            button.innerHTML = '<i class="fas fa-check"></i>';
            button.classList.remove('btn-outline-primary');
            button.classList.add('btn-success');
            
            setTimeout(() => {
                button.innerHTML = '<i class="fas fa-cart-plus"></i>';
                button.classList.remove('btn-success');
                button.classList.add('btn-outline-primary');
            }, 2000);
        }
    }
    
    // Fungsi update cart counter
    function updateCartCounter() {
        const cart = JSON.parse(localStorage.getItem('techshop_cart')) || [];
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        
        // Update cart counter di navbar jika elemen ada
        const cartCounter = document.querySelector('.cart-counter');
        if (cartCounter) {
            cartCounter.textContent = totalItems;
            cartCounter.style.display = totalItems > 0 ? 'inline' : 'none';
        }
        
        // Update juga di halaman ini jika ada elemen khusus
        const pageCartCounter = document.getElementById('ramCartCounter');
        if (pageCartCounter) {
            pageCartCounter.textContent = totalItems;
        }
    }
    
    // Event Listeners
    if (filterType) filterType.addEventListener('change', filterProducts);
    if (filterCapacity) filterCapacity.addEventListener('change', filterProducts);
    if (filterSpeed) filterSpeed.addEventListener('change', filterProducts);
    if (resetFilter) resetFilter.addEventListener('click', resetFilters);
    
    // Event listeners untuk tombol "Tambah ke Keranjang"
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            const productName = this.getAttribute('data-product');
            addToCart(productName);
        });
    });
    
    // Event listeners untuk tombol "Lihat Detail"
    viewDetailsButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productName = this.closest('.ram-product-item').querySelector('.card-title').textContent;
            showProductDetails(productName);
        });
    });
    
    // Event listener untuk tombol "Tambah ke Keranjang" di modal
    document.getElementById('ramModalAddToCart').addEventListener('click', function() {
        const productName = this.getAttribute('data-product');
        addToCart(productName);
        productModal.hide();
    });
    
    // Inisialisasi cart counter
    updateCartCounter();
    
    // Animasi untuk produk saat pertama kali dimuat
    productItems.forEach((item, index) => {
        setTimeout(() => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            void item.offsetWidth; // Trigger reflow
            item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, index * 100);
    });
    
    // Tambah efek RGB untuk kartu yang memiliki RGB
    productItems.forEach(item => {
        const productName = item.querySelector('.card-title').textContent;
        const product = ramProductData[productName];
        if (product && product.hasRGB) {
            item.setAttribute('data-has-rgb', 'true');
        }
    });
    
    // FAQ Accordion interactivity
    const faqButtons = document.querySelectorAll('.accordion-button');
    faqButtons.forEach(button => {
        button.addEventListener('click', function() {
            const icon = this.querySelector('i');
            if (icon) {
                if (this.classList.contains('collapsed')) {
                    icon.classList.remove('fa-chevron-down');
                    icon.classList.add('fa-chevron-up');
                } else {
                    icon.classList.remove('fa-chevron-up');
                    icon.classList.add('fa-chevron-down');
                }
            }
        });
    });
});