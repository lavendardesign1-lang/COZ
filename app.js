const products = [
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
    {
        id: 6,
        name: 'Hibiscus',
        image: 'V60.PNG',
        price: 13,
        category: 'HIBISCUS'
    },
    {
        id: 7,
        name: 'Rocky road',
        image: 'Rocky road .jpg',
        category: 'DESERT',
        options: [
            { name: '2 pieces', price: 12, image: 'Rocky road .jpg' },
            { name: 'Full Box (24 pieces)', price: 135, note: 'طلب مسبق بيومين', image: 'Rocky road .jpg' }
        ]
    }
];

let cart = [];
let currentCategory = '';

function init() {
    loadCart();
    renderProducts();
    setupCheckoutForm();
}

function renderProducts() {
    const container = document.getElementById('products-container');
    container.innerHTML = '';
    currentCategory = '';

    products.forEach(product => {
        if (product.category !== currentCategory) {
            currentCategory = product.category;
            const title = document.createElement('div');
            title.className = 'category-title';
            title.textContent = currentCategory;
            container.appendChild(title);
        }

        const card = document.createElement('div');
        card.className = 'product-card';

        let optionsHTML = '';
        if (product.options) {
            optionsHTML = '<div class="options">';
            product.options.forEach((opt, idx) => {
                optionsHTML += `<label><input type="radio" name="opt-${product.id}" value="${idx}" ${idx === 0 ? 'checked' : ''}> ${opt.name}</label>`;
            });
            optionsHTML += '</div>';
        }

        const displayImage = product.options ? product.options[0].image : product.image;
        const displayPrice = product.options ? product.options[0].price : product.price;

        card.innerHTML = `
            <div class="product-image">
                <img src="${displayImage}" alt="${product.name}" onerror="this.style.display='none'">
            </div>
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-price">${displayPrice} AED</div>
                ${optionsHTML}
                <div class="product-actions">
                    <input type="number" id="qty-${product.id}" value="1" min="1" max="10">
                    <button class="add-btn" onclick="addToCart(${product.id})">أضف</button>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const qty = parseInt(document.getElementById(`qty-${productId}`).value);
    let selectedOption = null;

    if (product.options) {
        const optionIndex = parseInt(document.querySelector(`input[name="opt-${productId}"]:checked`).value);
        selectedOption = product.options[optionIndex];
    }

    const finalPrice = selectedOption ? selectedOption.price : product.price;
    const itemName = selectedOption ? `${product.name} - ${selectedOption.name}` : product.name;
    const note = selectedOption ? (selectedOption.note || '') : '';

    const existingItem = cart.find(item => item.id === productId && item.selectedOption === JSON.stringify(selectedOption));

    if (existingItem) {
        existingItem.quantity += qty;
    } else {
        cart.push({
            id: productId,
            name: itemName,
            price: finalPrice,
            quantity: qty,
            selectedOption: JSON.stringify(selectedOption),
            note: note
        });
    }

    saveCart();
    updateCartCount();
    alert('تم إضافة المنتج للسلة! ✓');
    document.getElementById(`qty-${productId}`).value = 1;
}

function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cart-count').textContent = count;
}

function renderCart() {
    const container = document.getElementById('cart-items');
    const totalEl = document.getElementById('total');

    if (cart.length === 0) {
        container.innerHTML = '<div class="empty-cart">السلة فارغة!</div>';
        totalEl.textContent = '0';
        return;
    }

    let html = '';
    let total = 0;

    cart.forEach((item, idx) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        const noteHTML = item.note ? `<div style="font-size: 0.8rem; color: #d9534f;">⚠️ ${item.note}</div>` : '';

        html += `
            <div class="cart-item">
                <button class="remove-btn" onclick="removeFromCart(${idx})">حذف</button>
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-qty">الكمية: ${item.quantity}</div>
                    ${noteHTML}
                </div>
                <div class="cart-item-price">${itemTotal} AED</div>
            </div>
        `;
    });

    container.innerHTML = html;
    totalEl.textContent = total;
}

function removeFromCart(idx) {
    cart.splice(idx, 1);
    saveCart();
    updateCartCount();
    renderCart();
}

function saveCart() {
    localStorage.setItem('cozCart', JSON.stringify(cart));
}

function loadCart() {
    const saved = localStorage.getItem('cozCart');
    if (saved) {
        cart = JSON.parse(saved);
        updateCartCount();
    }
}

function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.getElementById(sectionId).classList.add('active');
}

function showHome() {
    showSection('home-section');
}

function showProducts() {
    showSection('products-section');
}

function showMenu() {
    showSection('menu-section');
}

function closeMenu() {
    document.getElementById('menu-section').classList.remove('active');
}

function showCart() {
    renderCart();
    showSection('cart-section');
}

function closeCart() {
    document.getElementById('cart-section').classList.remove('active');
}

function goCheckout() {
    if (cart.length === 0) {
        alert('السلة فارغة!');
        return;
    }
    showSection('checkout-section');
}

function closeCheckout() {
    document.getElementById('checkout-section').classList.remove('active');
}

function setupCheckoutForm() {
    const form = document.getElementById('checkout-form');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        completeOrder();
    });
}

function completeOrder() {
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;
    const payment = document.getElementById('payment').value;

    if (!name || !phone || !address || payment === 'اختر طريقة الدفع') {
        alert('يرجى ملء جميع الحقول');
        return;
    }

    const orderId = 'ORD-' + Date.now();
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const order = {
        orderId: orderId,
        name: name,
        phone: phone,
        address: address,
        payment: payment,
        items: [...cart],
        total: total,
        date: new Date().toLocaleString('ar-SA'),
        status: 'قيد المعالجة'
    };

    localStorage.setItem('lastOrder', JSON.stringify(order));
    showOrderDetails(order);
    cart = [];
    saveCart();
    updateCartCount();
}

function showOrderDetails(order) {
    let itemsHTML = '';
    order.items.forEach(item => {
        const noteHTML = item.note ? `<div style="font-size: 0.8rem; color: #d9534f;">⚠️ ${item.note}</div>` : '';
        itemsHTML += `
            <div class="order-row">
                <span>${item.price * item.quantity} AED</span>
                <span>${item.quantity} × ${item.name}</span>
            </div>
            ${noteHTML}
        `;
    });

    const detailsHTML = `
        <div class="success">✓ تم تأكيد الطلب بنجاح!</div>
        <div class="order-row">
            <strong>${order.orderId}</strong>
            <strong>رقم الطلب:</strong>
        </div>
        <div class="order-row">
            <span>${order.date}</span>
            <strong>التاريخ:</strong>
        </div>
        <div class="order-row">
            <span>${order.name}</span>
            <strong>الاسم:</strong>
        </div>
        <div class="order-row">
            <span>${order.phone}</span>
            <strong>الهاتف:</strong>
        </div>
        <div class="order-row">
            <span>${order.address}</span>
            <strong>العنوان:</strong>
        </div>
        <div class="order-row">
            <span>${order.payment}</span>
            <strong>طريقة الدفع:</strong>
        </div>
        <hr style="margin: 1rem 0;">
        <strong>المنتجات:</strong>
        ${itemsHTML}
        <div class="order-row" style="border-top: 2px solid #6B4423; margin-top: 1rem; padding-top: 1rem;">
            <strong style="color: #C19A6B; font-size: 1.2rem;">${order.total} AED</strong>
            <strong>الإجمالي:</strong>
        </div>
        <div class="order-status">
            حالة الطلب: ${order.status}
        </div>
        <p style="margin-top: 1rem; font-size: 0.9rem; color: #666; text-align: center;">سيتم التواصل معك قريباً لتأكيد الطلب والتسليم</p>
    `;

    document.getElementById('order-details').innerHTML = detailsHTML;
    document.getElementById('checkout-form').reset();
    showSection('order-section');
}

function closeOrder() {
    document.getElementById('order-section').classList.remove('active');
}

document.addEventListener('DOMContentLoaded', init);