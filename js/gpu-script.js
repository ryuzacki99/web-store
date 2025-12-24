// gpu-script.js - JavaScript khusus untuk halaman kategori GPU

document.addEventListener('DOMContentLoaded', function() {
    console.log('GPU category page loaded');
    
    // Elemen DOM
    const filterBrand = document.getElementById('gpuFilterBrand');
    const filterSeries = document.getElementById('gpuFilterSeries');
    const filterVRAM = document.getElementById('gpuFilterVRAM');
    const resetFilter = document.getElementById('gpuResetFilter');
    const gpuProducts = document.getElementById('gpuProducts');
    const productCount = document.getElementById('gpuProductCount');
    const productItems = document.querySelectorAll('.gpu-product-item');
    const addToCartButtons = document.querySelectorAll('.add-to-cart-gpu');
    const viewDetailsButtons = document.querySelectorAll('.view-details-gpu');
    
    // Data produk untuk modal (sementara, bisa diperluas)
    const gpuProductData = {
        "NVIDIA GeForce RTX 4090": {
            image: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            brand: "NVIDIA",
            description: "Kartu grafis flagship NVIDIA dengan 24GB GDDR6X, DLSS 3, dan ray tracing untuk gaming 8K dan workstation profesional.",
            specs: [
                "VRAM: 24GB GDDR6X",
                "Core Clock: 2235 MHz (Boost)",
                "Memory Bus: 384-bit",
                "TDP: 450W",
                "Port: 3x DisplayPort, 1x HDMI",
                "DLSS 3 Support: Yes",
                "Ray Tracing Cores: 128"
            ],
            price: "Rp 28.500.000",
            brandType: "nvidia"
        },
        "AMD Radeon RX 7900 XTX": {
            image: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            brand: "AMD",
            description: "Kartu grafis AMD flagship dengan arsitektur RDNA 3, 24GB GDDR6, dan teknologi FSR untuk gaming 4K+.",
            specs: [
                "VRAM: 24GB GDDR6",
                "Game Clock: 2300 MHz",
                "Memory Bus: 384-bit",
                "TDP: 355W",
                "Port: 2x DisplayPort, 1x HDMI, 1x USB-C",
                "FSR Support: Yes",
                "Stream Processors: 6144"
            ],
            price: "Rp 19.800.000",
            brandType: "amd"
        },
        "NVIDIA GeForce RTX 4070 Ti": {
            image: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            brand: "NVIDIA",
            description: "Kartu grafis high-end dengan DLSS 3 untuk gaming 1440p dan 4K dengan performa tinggi dan efisiensi daya.",
            specs: [
                "VRAM: 12GB GDDR6X",
                "Core Clock: 2310 MHz (Boost)",
                "Memory Bus: 192-bit",
                "TDP: 285W",
                "Port: 3x DisplayPort, 1x HDMI",
                "DLSS 3 Support: Yes",
                "Ray Tracing Cores: 60"
            ],
            price: "Rp 14.200.000",
            brandType: "nvidia"
        }
    };
    
    // Fungsi filter produk GPU
    function filterProducts() {
        const brandValue = filterBrand.value;
        const seriesValue = filterSeries.value;
        const vramValue = filterVRAM.value;
        
        let visibleCount = 0;
        
        productItems.forEach(item => {
            const itemBrand = item.getAttribute('data-brand');
            const itemSeries = item.getAttribute('data-series');
            const itemVRAM = item.getAttribute('data-vram');
            
            const brandMatch = !brandValue || itemBrand === brandValue;
            const seriesMatch = !seriesValue || itemSeries === seriesValue;
            const vramMatch = !vramValue || itemVRAM === vramValue;
            
            if (brandMatch && seriesMatch && vramMatch) {
                item.style.display = 'block';
                visibleCount++;
                
                // Animasi untuk item yang visible
                item.style.opacity = '0';
                item.style.transform = 'translateY(20px) scale(0.95)';
                void item.offsetWidth; // Trigger reflow
                
                setTimeout(() => {
                    item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0) scale(1)';
                }, visibleCount * 100);
            } else {
                item.style.display = 'none';
            }
        });
        
        productCount.textContent = visibleCount;
    }
    
    // Fungsi reset filter
    function resetFilters() {
        filterBrand.value = '';
        filterSeries.value = '';
        filterVRAM.value = '';
        filterProducts();
    }
    
    // Fungsi tambah ke keranjang untuk GPU
    function addToCart(productName) {
        // Ambil detail produk dari gpuProductData
        const productDetails = gpuProductData[productName];
        if (!productDetails) {
            console.error('Product details not found for:', productName);
            return;
        }

        // Parsing harga dari string "Rp 28.500.000" menjadi angka 28500000
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
        
        // Update counter di navbar
        updateCartCounter();
        
        // Tampilkan notifikasi toast
        const cartToastEl = document.getElementById('cartToast');
        const toastMessageEl = document.getElementById('toastMessage');
        if(cartToastEl && toastMessageEl) {
            toastMessageEl.textContent = `${productName} telah ditambahkan ke keranjang!`;
            const toast = new bootstrap.Toast(cartToastEl);
            toast.show();
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
    }
    
    // Event Listeners
    if (filterBrand) filterBrand.addEventListener('change', filterProducts);
    if (filterSeries) filterSeries.addEventListener('change', filterProducts);
    if (filterVRAM) filterVRAM.addEventListener('change', filterProducts);
    if (resetFilter) resetFilter.addEventListener('click', resetFilters);
    
    // Event listeners untuk tombol "Tambah ke Keranjang"
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productName = this.getAttribute('data-product');
            addToCart(productName);
        });
    });
    
    // Event listeners untuk tombol "Lihat Detail" (sederhana)
    viewDetailsButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productName = this.closest('.gpu-product-item').querySelector('.card-title').textContent;
            const product = gpuProductData[productName];
            
            if (product) {
                alert(`${productName}\n\n${product.description}\n\nHarga: ${product.price}`);
            }
        });
    });
    
    // Inisialisasi cart counter
    updateCartCounter();
});