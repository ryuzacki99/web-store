// storage-script.js - JavaScript khusus untuk halaman kategori Storage

document.addEventListener('DOMContentLoaded', function() {
    console.log('Storage category page loaded');
    
    // Elemen DOM
    const filterType = document.getElementById('storageFilterType');
    const filterCapacity = document.getElementById('storageFilterCapacity');
    const filterInterface = document.getElementById('storageFilterInterface');
    const resetFilter = document.getElementById('storageResetFilter');
    const storageProducts = document.getElementById('storageProducts');
    const productCount = document.getElementById('storageProductCount');
    const productItems = document.querySelectorAll('.storage-product-item');
    const addToCartButtons = document.querySelectorAll('.add-to-cart-storage');
    const viewDetailsButtons = document.querySelectorAll('.view-details-storage');
    
    // Kalkulator elemen
    const gameCountSlider = document.getElementById('gameCount');
    const gameCountValue = document.getElementById('gameCountValue');
    const videoHoursSlider = document.getElementById('videoHours');
    const videoHoursValue = document.getElementById('videoHoursValue');
    const personalFilesSlider = document.getElementById('personalFiles');
    const personalFilesValue = document.getElementById('personalFilesValue');
    const calculateBtn = document.getElementById('calculateStorage');
    const totalStorageEl = document.getElementById('totalStorage');
    const recommendedStorageEl = document.getElementById('recommendedStorage');
    
    // Modal dan Toast
    const productModal = new bootstrap.Modal(document.getElementById('storageProductModal'));
    const cartToast = new bootstrap.Toast(document.getElementById('storageCartToast'));
    const toastMessage = document.getElementById('storageToastMessage');
    
    // Data produk untuk modal
    const storageProductData = {
        "Samsung 980 PRO 2TB NVMe SSD": {
            image: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            brand: "SAMSUNG",
            description: "SSD NVMe PCIe 4.0 terbaik di kelasnya dengan kecepatan baca hingga 7000MB/s. Ideal untuk gaming, video editing, dan workstation profesional.",
            specs: [
                "Kapasitas: 2TB",
                "Interface: PCIe 4.0 x4, NVMe 1.3c",
                "Kecepatan Baca: 7000MB/s",
                "Kecepatan Tulis: 5100MB/s",
                "TBW: 1200TB",
                "Garansi: 5 Tahun",
                "Form Factor: M.2 2280"
            ],
            price: "Rp 3.800.000",
            type: "nvme"
        },
        "Crucial MX500 4TB SATA SSD": {
            image: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            brand: "Crucial",
            description: "SSD SATA dengan kapasitas besar dan performa konsisten. Cocok untuk upgrade laptop/desktop dan penyimpanan sekunder.",
            specs: [
                "Kapasitas: 4TB",
                "Interface: SATA III 6Gb/s",
                "Kecepatan Baca: 560MB/s",
                "Kecepatan Tulis: 510MB/s",
                "TBW: 1000TB",
                "Garansi: 5 Tahun",
                "Form Factor: 2.5-inch"
            ],
            price: "Rp 5.200.000",
            type: "sata"
        },
        "WD Blue 8TB 3.5 HDD": {
            image: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            brand: "WD",
            description: "Hard disk dengan kapasitas sangat besar untuk backup data, media library, dan penyimpanan jangka panjang.",
            specs: [
                "Kapasitas: 8TB",
                "Interface: SATA III 6Gb/s",
                "RPM: 7200",
                "Cache: 256MB",
                "MTBF: 1,000,000 jam",
                "Garansi: 2 Tahun",
                "Form Factor: 3.5-inch"
            ],
            price: "Rp 2.900.000",
            type: "hdd"
        }
    };
    
    // Inisialisasi slider values
    gameCountValue.textContent = `${gameCountSlider.value} game`;
    videoHoursValue.textContent = `${videoHoursSlider.value} jam`;
    personalFilesValue.textContent = `${personalFilesSlider.value}GB`;
    
    // Fungsi filter produk
    function filterProducts() {
        const typeValue = filterType.value;
        const capacityValue = filterCapacity.value;
        const interfaceValue = filterInterface.value;
        
        let visibleCount = 0;
        
        productItems.forEach(item => {
            const itemType = item.getAttribute('data-type');
            const itemCapacity = item.getAttribute('data-capacity');
            const itemInterface = item.getAttribute('data-interface');
            
            const typeMatch = !typeValue || itemType === typeValue;
            const capacityMatch = !capacityValue || itemCapacity === capacityValue;
            const interfaceMatch = !interfaceValue || itemInterface === interfaceValue;
            
            if (typeMatch && capacityMatch && interfaceMatch) {
                item.style.display = 'block';
                visibleCount++;
                
                // Animasi untuk item yang visible
                item.style.animation = 'none';
                void item.offsetWidth; // Trigger reflow
                item.style.animation = 'storageLoad 0.5s ease-out forwards';
                item.style.animationDelay = `${visibleCount * 0.1}s`;
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
        filterInterface.value = '';
        filterProducts();
    }
    
    // Fungsi tampilkan modal detail produk
    function showProductDetails(productName) {
        const product = storageProductData[productName];
        
        if (product) {
            document.getElementById('storageModalProductImage').src = product.image;
            document.getElementById('storageModalProductTitle').textContent = productName;
            document.getElementById('storageModalProductBrand').innerHTML = 
                `<span class="brand-badge ${product.brand.toLowerCase()}">${product.brand}</span>`;
            document.getElementById('storageModalProductDescription').textContent = product.description;
            document.getElementById('storageModalProductPrice').textContent = product.price;
            
            const specsList = document.getElementById('storageModalProductSpecs');
            specsList.innerHTML = '';
            product.specs.forEach(spec => {
                const li = document.createElement('li');
                li.textContent = spec;
                specsList.appendChild(li);
            });
            
            // Update tombol add to cart di modal
            document.getElementById('storageModalAddToCart').setAttribute('data-product', productName);
            
            productModal.show();
        }
    }
    
    // Fungsi tambah ke keranjang
    function addToCart(productName) {
        // Ambil detail produk dari storageProductData
        const productDetails = storageProductData[productName];
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
        const button = event.target.closest('.add-to-cart-storage');
        if (button) {
            const originalHTML = button.innerHTML;
            button.innerHTML = '<i class="fas fa-check"></i>';
            button.classList.remove('btn-outline-primary');
            button.classList.add('btn-success');
            
            setTimeout(() => {
                button.innerHTML = originalHTML;
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
    }
    
    // Fungsi kalkulator kebutuhan storage
    function calculateStorageNeeds() {
        const gameCount = parseInt(gameCountSlider.value);
        const videoHours = parseInt(videoHoursSlider.value);
        const personalFiles = parseInt(personalFilesSlider.value);
        
        // Perkiraan kebutuhan (dalam GB)
        const gameStorage = gameCount * 50; // Rata-rata 50GB per game AAA
        const videoStorage = videoHours * 20; // 20GB per jam editing (raw footage)
        const totalNeeded = gameStorage + videoStorage + personalFiles;
        
        // Tampilkan hasil
        totalStorageEl.textContent = `${totalNeeded} GB`;
        
        // Berikan rekomendasi
        let recommendation = '';
        if (totalNeeded < 500) {
            recommendation = 'SSD NVMe 500GB + HDD 1TB';
        } else if (totalNeeded < 1000) {
            recommendation = 'SSD NVMe 1TB + HDD 2TB';
        } else if (totalNeeded < 2000) {
            recommendation = 'SSD NVMe 2TB + HDD 4TB';
        } else {
            recommendation = 'SSD NVMe 2TB + HDD 8TB atau NAS';
        }
        
        recommendedStorageEl.textContent = recommendation;
    }
    
    // Event Listeners untuk filter
    if (filterType) filterType.addEventListener('change', filterProducts);
    if (filterCapacity) filterCapacity.addEventListener('change', filterProducts);
    if (filterInterface) filterInterface.addEventListener('change', filterProducts);
    if (resetFilter) resetFilter.addEventListener('click', resetFilters);
    
    // Event listeners untuk slider updates
    gameCountSlider.addEventListener('input', function() {
        gameCountValue.textContent = `${this.value} game`;
    });
    
    videoHoursSlider.addEventListener('input', function() {
        videoHoursValue.textContent = `${this.value} jam`;
    });
    
    personalFilesSlider.addEventListener('input', function() {
        personalFilesValue.textContent = `${this.value}GB`;
    });
    
    // Event listener untuk tombol kalkulator
    calculateBtn.addEventListener('click', calculateStorageNeeds);
    
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
            const productName = this.closest('.storage-product-item').querySelector('.card-title').textContent;
            showProductDetails(productName);
        });
    });
    
    // Event listener untuk tombol "Tambah ke Keranjang" di modal
    document.getElementById('storageModalAddToCart').addEventListener('click', function() {
        const productName = this.getAttribute('data-product');
        addToCart(productName);
        productModal.hide();
    });
    
    // Inisialisasi cart counter
    updateCartCounter();
    
    // Hitung kebutuhan storage awal
    calculateStorageNeeds();
});