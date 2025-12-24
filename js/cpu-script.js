// cpu-script.js - JavaScript khusus untuk halaman kategori CPU

document.addEventListener('DOMContentLoaded', function() {
    console.log('CPU category page loaded');
    
    // Elemen DOM
    const filterBrand = document.getElementById('filterBrand');
    const filterSocket = document.getElementById('filterSocket');
    const filterCore = document.getElementById('filterCore');
    const resetFilter = document.getElementById('resetFilter');
    const cpuProducts = document.getElementById('cpuProducts');
    const productCount = document.getElementById('productCount');
    const productItems = document.querySelectorAll('.product-item');
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const viewDetailsButtons = document.querySelectorAll('.view-details');
    
    // Modal dan Toast
    const productModal = new bootstrap.Modal(document.getElementById('productModal'));
    const cartToast = new bootstrap.Toast(document.getElementById('cartToast'));
    const toastMessage = document.getElementById('toastMessage');
    
    // Data produk untuk modal
    const productData = {
        "Intel Core i9-13900K": {
            image: "https://images.unsplash.com/photo-1593640495253-23196b27a87f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            brand: "Intel",
            description: "Processor flagship Intel dengan 24 core (8 Performance + 16 Efficiency) dan 32 thread. Mendukung DDR5 dan PCIe 5.0.",
            specs: [
                "24 Cores (8P+16E), 32 Threads",
                "Max Turbo Frequency: 5.8 GHz",
                "LGA 1700 Socket",
                "36MB Intel Smart Cache",
                "Integrated Intel UHD Graphics 770",
                "125W Processor Base Power"
            ],
            price: "Rp 9.500.000"
        },
        "AMD Ryzen 9 7900X": {
            image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            brand: "AMD",
            description: "Processor AMD Ryzen 7000 Series dengan 12 core dan 24 thread. Mendukung DDR5 dan teknologi 3D V-Cache.",
            specs: [
                "12 Cores, 24 Threads",
                "Max Boost Clock: Up to 5.6 GHz",
                "AM5 Socket",
                "76MB Total Cache (L2+L3)",
                "5nm Zen 4 Architecture",
                "170W TDP"
            ],
            price: "Rp 7.200.000"
        },
        "Intel Core i7-13700K": {
            image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            brand: "Intel",
            description: "Processor Intel Core i7 dengan 16 core (8 Performance + 8 Efficiency) untuk gaming dan produktivitas.",
            specs: [
                "16 Cores (8P+8E), 24 Threads",
                "Max Turbo Frequency: 5.4 GHz",
                "LGA 1700 Socket",
                "30MB Intel Smart Cache",
                "Integrated Intel UHD Graphics 770",
                "125W Processor Base Power"
            ],
            price: "Rp 6.800.000"
        },
        "AMD Ryzen 7 5800X3D": {
            image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            brand: "AMD",
            description: "Processor gaming terbaik dengan teknologi 3D V-Cache untuk performa gaming yang luar biasa.",
            specs: [
                "8 Cores, 16 Threads",
                "Max Boost Clock: Up to 4.5 GHz",
                "AM4 Socket",
                "96MB L3 Cache (3D V-Cache)",
                "7nm Zen 3 Architecture",
                "105W TDP"
            ],
            price: "Rp 5.400.000"
        }
    };
    
    // Fungsi filter produk
    function filterProducts() {
        const brandValue = filterBrand.value;
        const socketValue = filterSocket.value;
        const coreValue = filterCore.value;
        
        let visibleCount = 0;
        
        productItems.forEach(item => {
            const itemBrand = item.getAttribute('data-brand');
            const itemSocket = item.getAttribute('data-socket');
            const itemCore = item.getAttribute('data-core');
            
            const brandMatch = !brandValue || itemBrand === brandValue;
            const socketMatch = !socketValue || itemSocket === socketValue;
            const coreMatch = !coreValue || itemCore === coreValue;
            
            if (brandMatch && socketMatch && coreMatch) {
                item.style.display = 'block';
                visibleCount++;
            } else {
                item.style.display = 'none';
            }
        });
        
        productCount.textContent = visibleCount;
        
        // Animasi untuk produk yang terfilter
        document.querySelectorAll('.product-item[style*="block"]').forEach((item, index) => {
            setTimeout(() => {
                item.style.opacity = '0';
                item.style.transform = 'translateY(20px)';
                void item.offsetWidth; // Trigger reflow
                item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }
    
    // Fungsi reset filter
    function resetFilters() {
        filterBrand.value = '';
        filterSocket.value = '';
        filterCore.value = '';
        filterProducts();
    }
    
    // Fungsi tampilkan modal detail produk
    function showProductDetails(productName) {
        const product = productData[productName];
        
        if (product) {
            document.getElementById('modalProductImage').src = product.image;
            document.getElementById('modalProductTitle').textContent = productName;
            document.getElementById('modalProductBrand').innerHTML = 
                `<span class="brand-badge ${product.brand.toLowerCase()}">${product.brand}</span>`;
            document.getElementById('modalProductDescription').textContent = product.description;
            document.getElementById('modalProductPrice').textContent = product.price;
            
            const specsList = document.getElementById('modalProductSpecs');
            specsList.innerHTML = '';
            product.specs.forEach(spec => {
                const li = document.createElement('li');
                li.textContent = spec;
                specsList.appendChild(li);
            });
            
            // Update tombol add to cart di modal
            document.getElementById('modalAddToCart').setAttribute('data-product', productName);
            
            productModal.show();
        }
    }
    
    // Fungsi tambah ke keranjang
    function addToCart(productName) {
        // Ambil detail produk dari productData
        const productDetails = productData[productName];
        if (!productDetails) {
            console.error('Product details not found for:', productName);
            return;
        }

        // Parsing harga dari string "Rp 9.500.000" menjadi angka 9500000
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
        
        // Update counter di navbar
        updateCartCounter();
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
    }
    
    // Event Listeners
    if (filterBrand) filterBrand.addEventListener('change', filterProducts);
    if (filterSocket) filterSocket.addEventListener('change', filterProducts);
    if (filterCore) filterCore.addEventListener('change', filterProducts);
    if (resetFilter) resetFilter.addEventListener('click', resetFilters);
    
    // Event listeners untuk tombol "Tambah ke Keranjang"
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productName = this.getAttribute('data-product');
            addToCart(productName);
        });
    });
    
    // Event listeners untuk tombol "Lihat Detail"
    viewDetailsButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productName = this.closest('.product-item').querySelector('.card-title').textContent;
            showProductDetails(productName);
        });
    });
    
    // Event listener untuk tombol "Tambah ke Keranjang" di modal
    document.getElementById('modalAddToCart').addEventListener('click', function() {
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
});