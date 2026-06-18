// بيانات المنتجات - المنيو الحقيقي
const products = [
    // V60
    {
        id: 1,
        name: 'V60',
        description: 'قهوة V60 مميزة',
        price: 26,
        emoji: '☕',
        category: 'V60'
    },
    
    // ESPRESSO
    {
        id: 2,
        name: 'Ice Americano',
        description: 'أمريكانو بارد منعش',
        price: 17,
        emoji: '🧊',
        category: 'ESPRESSO'
    },
    {
        id: 3,
        name: 'Foame Espresso',
        description: 'إسبريسو مع رغوة',
        price: 25,
        emoji: '☕',
        category: 'ESPRESSO'
    },
    {
        id: 4,
        name: 'Dark Foame Espresso',
        description: 'إسبريسو داكن مع رغوة',
        price: 27,
        emoji: '☕',
        category: 'ESPRESSO'
    },
    
    // MATCHA
    {
        id: 5,
        name: 'Foame Matcha - Milk',
        description: 'ماتشا مع حليب (حليب عادي)',
        price: 29,
        emoji: '🍵',
        category: 'MATCHA'
    },
    {
        id: 6,
        name: 'Foame Matcha - Coconut',
        description: 'ماتشا مع حليب جوز الهند',
        price: 32,
        emoji: '🍵',
        category: 'MATCHA'
    },
    
    // SLASH
    {
        id: 7,
        name: 'Hibiscus',
        description: 'مشروب الكركديه المنعش',
        price: 13,
        emoji: '🌺',
        category: 'SLASH'
    }
];

// سلة الشراء
let cart = [];

// تحميل المنتجات عند فتح الصفحة
document.addEventListener('DOMContentLoaded', function() {
    displayProducts();
    loadCartFromStorage();
});

// عرض المنتجات
function displayProducts() {
    const productsList = document.getElementById('products-list');
    productsList.innerHTML = '';
    
    let currentCategory = '';

    products.forEach(product => {
        // إضافة عنوان الفئة إذا تغيرت
        if (product.category !== currentCategory) {
            currentCategory = product.category;
            const categoryTitle = document.createElement('div');
            categoryTitle.className = 'category-title';
            categoryTitle.textContent = currentCategory;
            productsList.appendChild(categoryTitle);
        }
        
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-image">${product.emoji}</div>
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-description">${product.description}</div>
                <div class="product-price">${product.price} AED</div>
                <div class="product-actions">
                    <input type="number" id="qty-${product.id}" value="1" min="1" max="10">
                    <button class="btn-secondary" onclick="addToCart(${product.id})">أضف</button>
                </div>
            </div>
        `;
        productsList.appendChild(productCard);
    });
}

// إضافة المنتج للسلة
function addToCart(productId) {
    const quantity = parseInt(document.getElementById(`qty-${productId}`).value);
    const product = products.find(p => p.id === productId);
    
    // البحث عن المنتج في السلة
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            ...product,
            quantity: quantity
        });
    }
    
    saveCartToStorage();
    updateCartCount();
    alert('تم إضافة المنتج للسلة! ✓');
    document.getElementById(`qty-${productId}`).value = 1;
}

// تحديث عدد العناصر في السلة
function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('cart-count').textContent = count;
}

// عرض السلة
function toggleCart() {
    const modal = document.getElementById('cart-modal');
    if (modal.style.display === 'none' || modal.style.display === '') {
        displayCart();
        modal.style.display = 'block';
    } else {
        modal.style.display = 'none';
    }
}

// عرض محتويات السلة
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
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <button class="btn-secondary" onclick="removeFromCart(${index})" style="background-color: #dc3545;">حذف</button>
            <div>
                <div class="cart-item-price">${itemTotal} AED</div>
                <div class="cart-item-quantity">الكمية: ${item.quantity}</div>
            </div>
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
            </div>
        `;
        cartItems.appendChild(cartItem);
    });
    
    total.textContent = totalPrice;
}

// حذف المنتج من السلة
function removeFromCart(index) {
    cart.splice(index, 1);
    saveCartToStorage();
    updateCartCount();
    displayCart();
}

// الانتقال لصفحة الدفع
function goToCheckout() {
    if (cart.length === 0) {
        alert('السلة فارغة!');
        return;
    }
    document.getElementById('cart-modal').style.display = 'none';
    document.getElementById('checkout-modal').style.display = 'block';
}

// إغلاق صفحة الدفع
function closeCheckout() {
    document.getElementById('checkout-modal').style.display = 'none';
}

// معالجة نموذج الدفع
document.addEventListener('DOMContentLoaded', function() {
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function(e) {
            e.preventDefault();
            completeOrder();
        });
    }
});

// إتمام الطلب
function completeOrder() {
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;
    const paymentMethod = document.getElementById('payment-method').value;
    
    if (!name || !phone || !address || paymentMethod === 'اختر طريقة الدفع') {
        alert('يرجى ملء جميع الحقول');
        return;
    }
    
    // إنشاء رقم طلب عشوائي
    const orderId = 'ORD-' + Date.now();
    const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    // حفظ الطلب
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
    
    // إغلاق النوافذ المنبثقة وعرض تفاصيل الطلب
    document.getElementById('checkout-modal').style.display = 'none';
    displayOrderDetails(order);
    document.getElementById('order-modal').style.display = 'block';
    
    // مسح السلة
    cart = [];
    saveCartToStorage();
    updateCartCount();
}

// عرض تفاصيل الطلب
function displayOrderDetails(order) {
    const orderDetails = document.getElementById('order-details');
    
    let itemsHTML = '';
    order.items.forEach(item => {
        itemsHTML += `
            <div class="order-detail-row">
                <span>${item.price * item.quantity} AED</span>
                <span>${item.quantity} × ${item.name}</span>
            </div>
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
        <div class="order-detail-row" style="border-top: 2px solid #8B4513; margin-top: 1rem; padding-top: 1rem;">
            <strong style="color: #FFD700; font-size: 1.2rem;">${order.total} AED</strong>
            <strong>الإجمالي:</strong>
        </div>
        <div class="order-status">
            حالة الطلب: ${order.status}
        </div>
        <p style="margin-top: 1rem; font-size: 0.9rem; color: #666;">سيتم التواصل معك قريباً لتأكيد الطلب والتسليم</p>
    `;
}

// إغلاق نافذة الطلب
function closeOrder() {
    document.getElementById('order-modal').style.display = 'none';
}

// التمرير للمنتجات
function scrollToProducts() {
    document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
}

// حفظ السلة في التخزين المحلي
function saveCartToStorage() {
    localStorage.setItem('cozCart', JSON.stringify(cart));
}

// تحميل السلة من التخزين المحلي
function loadCartFromStorage() {
    const savedCart = localStorage.getItem('cozCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartCount();
    }
}

// إغلاق النوافذ عند النقر خارجها
window.onclick = function(event) {
    const cartModal = document.getElementById('cart-modal');
    const checkoutModal = document.getElementById('checkout-modal');
    const orderModal = document.getElementById('order-modal');
    
    if (event.target === cartModal) {
        cartModal.style.display = 'none';
    }
    if (event.target === checkoutModal) {
        checkoutModal.style.display = 'none';
    }
    if (event.target === orderModal) {
        orderModal.style.display = 'none';
    }
}