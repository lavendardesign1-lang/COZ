// بيانات المنتجات
const products = [
    // V60
    {
        id: 1,
        name: 'V60',
        image: 'V60.PNG',
        price: 26,
        category: 'V60',
        options: [
            { name: 'Lollipop', price: 26, image: 'Lollipop .PNG' },
            { name: 'Snickers', price: 26, image: 'Snickers .PNG' },
            { name: 'Tobacco', price: 26, image: 'Tobacco .PNG' },
            { name: 'Crème brûlée', price: 26, image: 'Crème brûlé.PNG' }
        ]
    },
    
    // ESPRESSO
    {
        id: 2,
        name: 'Ice Americano',
        image: 'V60.PNG',
        price: 17,
        category: 'ESPRESSO'
    },
    {
        id: 3,
        name: 'Foame Espresso',
        image: 'Fome.PNG',
        price: 25,
        category: 'ESPRESSO'
    },
    {
        id: 4,
        name: 'Dark Foame Espresso',
        image: 'Fome.PNG',
        price: 27,
        category: 'ESPRESSO'
    },
    
    // MATCHA
    {
        id: 5,
        name: 'Foame Matcha',
        image: 'Matcha.PNG',
        price: 29,
        category: 'MATCHA',
        options: [
            { name: 'Milk', price: 29, image: 'Matcha.PNG' },
            { name: 'Coconut Milk', price: 32, image: 'Matcha.PNG' }
        ]
    },
    
    // HIBISCUS
    {
        id: 6,
        name: 'Hibiscus',
        image: 'V60.PNG',
        price: 13,
        category: 'HIBISCUS'
    },
    
    // DESERT
    {
        id: 7,
        name: 'Rocky road',
        image: 'Rocky road .jpg',
        category: 'DESERT',
        options: [
            { name: '2 pieces', price: 12, note: '', image: 'Rocky road .jpg' },
            { name: 'Full Box (24 pieces)', price: 135, note: 'طلب مسبق بيومين', image: 'Rocky road .jpg' }
        ]
    }
];

let cart = [];

document.addEventListener('DOMContentLoaded', function() {
    displayProducts();
    loadCartFromStorage();
});

function displayProducts() {
    const productsList = document.getElementById('products-list');
    productsList.innerHTML = '';
    
    let currentCategory = '';

    products.forEach(product => {
        if (product.category !== currentCategory) {
            currentCategory = product.category;
            const categoryTitle = document.createElement('div');
            categoryTitle.className = 'category-title';
            categoryTitle.textContent = currentCategory;
            productsList.appendChild(categoryTitle);
        }
        
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        
        let optionsHTML = '';
        if (product.options && product.options.length > 0) {
            optionsHTML = '<div class="product-options">';
            product.options.forEach((opt, idx) => {
                optionsHTML += `<label><input type="radio" name="option-${product.id}" value="${idx}" ${idx === 0 ? 'checked' : ''}> ${opt.name}</label>`;
            });
            optionsHTML += '</div>';
        }
        
        const displayPrice = product.options && product.options.length > 0 ? product.options[0].price : product.price;
        const displayImage = product.options && product.options.length > 0 ? product.options[0].image : product.image;
        
        productCard.innerHTML = `
            <div class="product-image">
                <img src="${displayImage}" alt="${product.name}" onerror="this.style.display='none'">
            </div>
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-price">${displayPrice} AED</div>
                ${optionsHTML}
                <div class="product-actions">
                    <input type="number" id="qty-${product.id}" value="1" min="1" max="10">
                    <button class="btn-secondary" onclick="addToCart(${product.id})">أضف</button>
                </div>
            </div>
        `;
        productsList.appendChild(productCard);
    });
}

function toggleMenu() {
    const modal = document.getElementById('menu-modal');
    if (modal.style.display === 'none' || modal.style.display === '') {
        modal.style.display = 'block';
    } else {
        modal.style.display = 'none';
    }
}

function addToCart(productId) {
    const quantity = parseInt(document.getElementById(`qty-${productId}`).value);
    const product = products.find(p => p.id === productId);
    
    let selectedOption = null;
    if (product.options && product.options.length > 0) {
        const selectedIdx = parseInt(document.querySelector(`input[name="option-${productId}"]:checked`).value);
        selectedOption = product.options[selectedIdx];
    }
    
    const finalPrice = selectedOption ? selectedOption.price : product.price;
    const itemName = selectedOption ? `${product.name} - ${selectedOption.name}` : product.name;
    
    const existingItem = cart.find(item => item.id === productId && item.selectedOption === JSON.stringify(selectedOption));
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: productId,
            name: itemName,
            price: finalPrice,
            quantity: quantity,
            selectedOption: JSON.stringify(selectedOption),
            note: selectedOption ? selectedOption.note : ''
        });
    }
    
    saveCartToStorage();
    updateCartCount();
    alert('تم إضافة المنتج للسلة! ✓');
    document.getElementById(`qty-${productId}`).value = 1;
}

function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('cart-count').textContent = count;
}

function toggleCart() {
    const modal = document.getElementById('cart-modal');
    if (modal.style.display === 'none' || modal.style.display === '') {
        displayCart();
        modal.style.display = 'block';
    } else {
        modal.style.display = 'none';
    }
}

function displayCart() {
    const cartItems = document.getElementById('cart-items');
    const total = document.getElementById('total');
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="empty-cart">السلة فارغة!</div>';
        total.textContent = '0';
        return;
    }
    
    let totalPrice = 0;
    cartItems.innerHTML = '';
    
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        totalPrice += itemTotal;
        
        const noteHTML = item.note ? `<div class="cart-item-note">⚠️ ${item.note}</div>` : '';
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <button class="btn-secondary" onclick="removeFromCart(${index})" style="background-color: #dc3545;">حذف</button>
            <div>
                <div class="cart-item-price">${itemTotal} AED</div>
                <div class="cart-item-quantity">الكمية: ${item.quantity}</div>
                ${noteHTML}
            </div>
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
            </div>
        `;
        cartItems.appendChild(cartItem);
    });
    
    total.textContent = totalPrice;
}

function removeFromCart(index) {
    cart.splice(index, 1);
    saveCartToStorage();
    updateCartCount();
    displayCart();
}

function goToCheckout() {
    if (cart.length === 0) {
        alert('السلة فارغة!');
        return;
    }
    document.getElementById('cart-modal').style.display = 'none';
    document.getElementById('checkout-modal').style.display = 'block';
}

function closeCheckout() {
    document.getElementById('checkout-modal').style.display = 'none';
}

document.addEventListener('DOMContentLoaded', function() {
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function(e) {
            e.preventDefault();
            completeOrder();
        });
    }
});

function completeOrder() {
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;
    const paymentMethod = document.getElementById('payment-method').value;
    
    if (!name || !phone || !address || paymentMethod === 'اختر طريقة الدفع') {
        alert('يرجى ملء جميع الحقول');
        return;
    }
    
    const orderId = 'ORD-' + Date.now();
    const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    const order = {
        orderId: orderId,
        name: name,
        phone: phone,
        address: address,
        paymentMethod: paymentMethod,
        items: cart,
        total: totalPrice,
        date: new Date().toLocaleString('ar-SA'),
        status: 'قيد المعالجة'
    };
    
    localStorage.setItem('lastOrder', JSON.stringify(order));
    
    document.getElementById('checkout-modal').style.display = 'none';
    displayOrderDetails(order);
    document.getElementById('order-modal').style.display = 'block';
    
    cart = [];
    saveCartToStorage();
    updateCartCount();
}

function displayOrderDetails(order) {
    const orderDetails = document.getElementById('order-details');
    
    let itemsHTML = '';
    order.items.forEach(item => {
        const noteHTML = item.note ? `<div class="order-item-note">⚠️ ${item.note}</div>` : '';
        itemsHTML += `
            <div class="order-detail-row">
                <span>${item.price * item.quantity} AED</span>
                <span>${item.quantity} × ${item.name}</span>
            </div>
            ${noteHTML}
        `;
    });
    
    orderDetails.innerHTML = `
        <div class="success">✓ تم تأكيد الطلب بنجاح!</div>
        <div class="order-detail-row">
            <strong>${order.orderId}</strong>
            <strong>رقم الطلب:</strong>
        </div>
        <div class="order-detail-row">
            <span>${order.date}</span>
            <strong>التاريخ:</strong>
        </div>
        <div class="order-detail-row">
            <span>${order.name}</span>
            <strong>الاسم:</strong>
        </div>
        <div class="order-detail-row">
            <span>${order.phone}</span>
            <strong>الهاتف:</strong>
        </div>
        <div class="order-detail-row">
            <span>${order.address}</span>
            <strong>العنوان:</strong>
        </div>
        <div class="order-detail-row">
            <span>${order.paymentMethod}</span>
            <strong>طريقة الدفع:</strong>
        </div>
        <hr style="margin: 1rem 0;">
        <strong>المنتجات:</strong>
        ${itemsHTML}
        <div class="order-detail-row" style="border-top: 2px solid #6B4423; margin-top: 1rem; padding-top: 1rem;">
            <strong style="color: #C19A6B; font-size: 1.2rem;">${order.total} AED</strong>
            <strong>الإجمالي:</strong>
        </div>
        <div class="order-status">
            حالة الطلب: ${order.status}
        </div>
        <p style="margin-top: 1rem; font-size: 0.9rem; color: #666;">سيتم التواصل معك قريباً لتأكيد الطلب والتسليم</p>
    `;
}

function closeOrder() {
    document.getElementById('order-modal').style.display = 'none';
}

function scrollToProducts() {
    document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
}

function saveCartToStorage() {
    localStorage.setItem('cozCart', JSON.stringify(cart));
}

function loadCartFromStorage() {
    const savedCart = localStorage.getItem('cozCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartCount();
    }
}

window.onclick = function(event) {
    const cartModal = document.getElementById('cart-modal');
    const checkoutModal = document.getElementById('checkout-modal');
    const orderModal = document.getElementById('order-modal');
    const menuModal = document.getElementById('menu-modal');
    
    if (event.target === cartModal) {
        cartModal.style.display = 'none';
    }
    if (event.target === checkoutModal) {
        checkoutModal.style.display = 'none';
    }
    if (event.target === orderModal) {
        orderModal.style.display = 'none';
    }
    if (event.target === menuModal) {
        menuModal.style.display = 'none';
    }
}