/* ==========================================================================
   ROYAL FAIRWAY GOLF CO. — UNIFIED STORE & LOCALSTORAGE STATE ENGINE
   ========================================================================== */

const Store = {
  // Initialization
  init() {
    if (!localStorage.getItem('rfg_products')) {
      localStorage.setItem('rfg_products', JSON.stringify(GOLF_DATABASE.products));
    }
    if (!localStorage.getItem('rfg_cart')) {
      localStorage.setItem('rfg_cart', JSON.stringify([]));
    }
    if (!localStorage.getItem('rfg_wishlist')) {
      localStorage.setItem('rfg_wishlist', JSON.stringify([]));
    }
    if (!localStorage.getItem('rfg_compare')) {
      localStorage.setItem('rfg_compare', JSON.stringify([]));
    }
    if (!localStorage.getItem('rfg_orders')) {
      localStorage.setItem('rfg_orders', JSON.stringify(GOLF_DATABASE.initialOrders));
    }
    if (!localStorage.getItem('rfg_tradeins')) {
      localStorage.setItem('rfg_tradeins', JSON.stringify([]));
    }
    if (!localStorage.getItem('rfg_recent')) {
      localStorage.setItem('rfg_recent', JSON.stringify([]));
    }
  },

  // 1. PRODUCTS
  getProducts() {
    try {
      return JSON.parse(localStorage.getItem('rfg_products')) || GOLF_DATABASE.products;
    } catch (e) {
      return GOLF_DATABASE.products;
    }
  },

  getProductById(id) {
    const list = this.getProducts();
    return list.find((p) => p.id === id);
  },

  addProduct(prod) {
    const list = this.getProducts();
    const newProd = {
      ...prod,
      id: 'prod-' + Date.now(),
      rating: 4.8,
      reviewsCount: 1,
      gallery: prod.gallery && prod.gallery.length ? prod.gallery : [prod.image],
    };
    list.unshift(newProd);
    localStorage.setItem('rfg_products', JSON.stringify(list));
    this.showToast(`Product "${newProd.name}" added to catalog.`);
    return newProd;
  },

  updateProduct(id, updates) {
    const list = this.getProducts();
    const idx = list.findIndex((p) => p.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...updates };
      localStorage.setItem('rfg_products', JSON.stringify(list));
      this.showToast('Product inventory updated.');
    }
  },

  deleteProduct(id) {
    let list = this.getProducts();
    list = list.filter((p) => p.id !== id);
    localStorage.setItem('rfg_products', JSON.stringify(list));
    this.showToast('Product removed from catalog.', 'info');
  },

  // 2. SHOPPING CART
  getCart() {
    try {
      return JSON.parse(localStorage.getItem('rfg_cart')) || [];
    } catch (e) {
      return [];
    }
  },

  addToCart(product, quantity = 1, options = {}) {
    const cart = this.getCart();
    const existingIndex = cart.findIndex(
      (item) => item.product.id === product.id && JSON.stringify(item.options) === JSON.stringify(options)
    );

    if (existingIndex > -1) {
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push({ product, quantity, options });
    }

    localStorage.setItem('rfg_cart', JSON.stringify(cart));
    this.updateHeaderBadges();
    this.showToast(`Added ${quantity} × ${product.name} to your golf bag.`);
    this.renderCartDrawer();
  },

  updateCartQty(productId, delta, options = {}) {
    let cart = this.getCart();
    cart = cart
      .map((item) => {
        if (item.product.id === productId && JSON.stringify(item.options) === JSON.stringify(options)) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      })
      .filter(Boolean);

    localStorage.setItem('rfg_cart', JSON.stringify(cart));
    this.updateHeaderBadges();
    this.renderCartDrawer();
  },

  removeFromCart(productId, options = {}) {
    let cart = this.getCart();
    cart = cart.filter(
      (item) => !(item.product.id === productId && JSON.stringify(item.options) === JSON.stringify(options))
    );
    localStorage.setItem('rfg_cart', JSON.stringify(cart));
    this.updateHeaderBadges();
    this.showToast('Item removed from bag.', 'info');
    this.renderCartDrawer();
  },

  clearCart() {
    localStorage.setItem('rfg_cart', JSON.stringify([]));
    this.removeCoupon();
    this.updateHeaderBadges();
    this.renderCartDrawer();
  },

  getCartTotals() {
    const cart = this.getCart();
    const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    const appliedCoupon = this.getAppliedCoupon();
    let discount = 0;
    if (appliedCoupon && subtotal >= appliedCoupon.minOrder) {
      if (appliedCoupon.type === 'percentage') {
        discount = Math.round((subtotal * appliedCoupon.value) / 100);
      } else {
        discount = appliedCoupon.value;
      }
    }

    // Free delivery on ₹4,999+ in India
    const taxable = Math.max(0, subtotal - discount);
    const shipping = subtotal === 0 || taxable >= 4999 ? 0 : 250;
    const gst = Math.round(taxable * 0.18);
    const total = taxable + shipping;

    return {
      subtotal,
      discount,
      shipping,
      gst,
      total,
      itemCount: cart.reduce((acc, it) => acc + it.quantity, 0),
      appliedCoupon,
    };
  },

  getAppliedCoupon() {
    try {
      return JSON.parse(sessionStorage.getItem('rfg_applied_coupon')) || null;
    } catch (e) {
      return null;
    }
  },

  applyCoupon(code) {
    const clean = code.trim().toUpperCase();
    const coupon = GOLF_DATABASE.coupons.find((c) => c.code === clean);
    if (!coupon) {
      return { success: false, message: 'Invalid voucher code.' };
    }
    const totals = this.getCartTotals();
    if (totals.subtotal < coupon.minOrder) {
      return { success: false, message: `Minimum order value of ₹${coupon.minOrder.toLocaleString('en-IN')} required.` };
    }
    sessionStorage.setItem('rfg_applied_coupon', JSON.stringify(coupon));
    this.showToast(`Coupon ${coupon.code} applied! Saved discount applied.`);
    this.renderCartDrawer();
    return { success: true, message: `Coupon ${coupon.code} applied successfully.` };
  },

  removeCoupon() {
    sessionStorage.removeItem('rfg_applied_coupon');
    this.renderCartDrawer();
  },

  // 3. WISHLIST
  getWishlist() {
    try {
      return JSON.parse(localStorage.getItem('rfg_wishlist')) || [];
    } catch (e) {
      return [];
    }
  },

  toggleWishlist(product) {
    let wishlist = this.getWishlist();
    const exists = wishlist.some((p) => p.id === product.id);

    if (exists) {
      wishlist = wishlist.filter((p) => p.id !== product.id);
      this.showToast(`Removed from wishlist: ${product.name}`, 'info');
    } else {
      wishlist.push(product);
      this.showToast(`Saved to wishlist: ${product.name}`);
    }

    localStorage.setItem('rfg_wishlist', JSON.stringify(wishlist));
    this.updateHeaderBadges();
    return !exists;
  },

  isInWishlist(productId) {
    return this.getWishlist().some((p) => p.id === productId);
  },

  // 4. COMPARISON TOOL
  getCompareList() {
    try {
      return JSON.parse(localStorage.getItem('rfg_compare')) || [];
    } catch (e) {
      return [];
    }
  },

  toggleCompare(product) {
    let compare = this.getCompareList();
    const exists = compare.some((p) => p.id === product.id);

    if (exists) {
      compare = compare.filter((p) => p.id !== product.id);
      this.showToast(`Removed from comparison: ${product.name}`, 'info');
    } else {
      if (compare.length >= 4) {
        this.showToast('You can compare a maximum of 4 golf clubs/products at once.', 'error');
        return false;
      }
      compare.push(product);
      this.showToast(`Added to comparison: ${product.name}`);
    }

    localStorage.setItem('rfg_compare', JSON.stringify(compare));
    this.renderCompareTray();
    this.updateHeaderBadges();
    return !exists;
  },

  isInCompare(productId) {
    return this.getCompareList().some((p) => p.id === productId);
  },

  clearCompare() {
    localStorage.setItem('rfg_compare', JSON.stringify([]));
    this.renderCompareTray();
    this.updateHeaderBadges();
  },

  // 5. RECENTLY VIEWED
  addRecentlyViewed(product) {
    let recent = [];
    try {
      recent = JSON.parse(localStorage.getItem('rfg_recent')) || [];
    } catch (e) {}

    recent = recent.filter((p) => p.id !== product.id);
    recent.unshift(product);
    if (recent.length > 8) recent.pop();

    localStorage.setItem('rfg_recent', JSON.stringify(recent));
  },

  getRecentlyViewed() {
    try {
      return JSON.parse(localStorage.getItem('rfg_recent')) || [];
    } catch (e) {
      return [];
    }
  },

  // 6. ORDERS & FULFILLMENT
  getOrders() {
    try {
      return JSON.parse(localStorage.getItem('rfg_orders')) || GOLF_DATABASE.initialOrders;
    } catch (e) {
      return GOLF_DATABASE.initialOrders;
    }
  },

  createOrder(orderData) {
    const orders = this.getOrders();
    const totals = this.getCartTotals();
    const cart = this.getCart();

    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newOrder = {
      id: 'ord-' + Date.now(),
      orderNumber: `RFG-2026-${randomNum}`,
      date: new Date().toISOString(),
      customerName: orderData.customerName,
      customerEmail: orderData.customerEmail,
      customerPhone: orderData.customerPhone,
      city: orderData.city,
      address: orderData.address,
      pincode: orderData.pincode,
      items: cart.map((it) => ({
        id: it.product.id,
        name: it.product.name,
        quantity: it.quantity,
        price: it.product.price,
        options: it.options,
        image: it.product.image,
      })),
      total: totals.total,
      paymentMethod: orderData.paymentMethod || 'UPI',
      paymentStatus: orderData.paymentMethod === 'Cash on Delivery (COD)' ? 'Pending (COD)' : 'Paid',
      orderStatus: 'Order Placed',
      driver: {
        name: 'Suresh Verma',
        phone: '+91 98710 44321',
        vehicle: 'HR 26 DQ 8821 (Fairway EV Van #1)',
      },
      timeline: [
        {
          status: 'Order Placed',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', Today',
          note: `Order recorded via ${orderData.paymentMethod}. Scheduled for White-Glove dispatch.`,
        },
      ],
    };

    orders.unshift(newOrder);
    localStorage.setItem('rfg_orders', JSON.stringify(orders));
    this.clearCart();
    this.showToast(`Order #${newOrder.orderNumber} placed successfully!`);
    return newOrder;
  },

  updateOrderStatus(orderId, status, note, driver) {
    const orders = this.getOrders();
    const idx = orders.findIndex((o) => o.id === orderId || o.orderNumber === orderId);
    if (idx !== -1) {
      orders[idx].orderStatus = status;
      if (driver) orders[idx].driver = driver;
      orders[idx].timeline.push({
        status,
        time: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        note: note || `Order updated to ${status}`,
      });
      localStorage.setItem('rfg_orders', JSON.stringify(orders));
      this.showToast(`Order status updated to "${status}".`);
    }
  },

  // 7. TRADE-IN VALUATION SYSTEM (Golf Garage Inspiration)
  getTradeIns() {
    try {
      return JSON.parse(localStorage.getItem('rfg_tradeins')) || [];
    } catch (e) {
      return [];
    }
  },

  submitTradeIn(tradeData) {
    const list = this.getTradeIns();
    const newTrade = {
      id: 'trade-' + Date.now(),
      refNumber: 'TRD-' + Math.floor(1000 + Math.random() * 9000),
      createdAt: new Date().toLocaleDateString('en-IN'),
      status: 'Under Review',
      ...tradeData,
    };
    list.unshift(newTrade);
    localStorage.setItem('rfg_tradeins', JSON.stringify(list));
    this.showToast(`Trade-In request #${newTrade.refNumber} submitted. Fitting expert will call.`);
    return newTrade;
  },

  // 8. NOTIFICATIONS & BADGES
  updateHeaderBadges() {
    const cartCount = this.getCart().reduce((sum, item) => sum + item.quantity, 0);
    const wishlistCount = this.getWishlist().length;
    const compareCount = this.getCompareList().length;

    document.querySelectorAll('.js-cart-count').forEach((el) => (el.textContent = cartCount));
    document.querySelectorAll('.js-wishlist-count').forEach((el) => (el.textContent = wishlistCount));
    document.querySelectorAll('.js-compare-count').forEach((el) => (el.textContent = compareCount));
  },

  showToast(message, type = 'success') {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <div style="font-weight: 700; font-size: 16px;">${type === 'success' ? '✓' : type === 'info' ? 'ℹ' : '⚠'}</div>
      <div style="flex: 1;">${message}</div>
      <button onclick="this.parentElement.remove()" style="color: #ffffff; opacity: 0.6; padding: 2px;">✕</button>
    `;
    container.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 3800);
  },

  // RENDER CART DRAWER
  renderCartDrawer() {
    const drawerContainer = document.getElementById('cart-drawer-items');
    if (!drawerContainer) return;

    const cart = this.getCart();
    const totals = this.getCartTotals();

    // Free shipping goal calculation (₹4,999)
    const goalEl = document.getElementById('cart-drawer-shipping-text');
    const fillEl = document.getElementById('cart-drawer-shipping-fill');
    if (goalEl && fillEl) {
      const remaining = Math.max(0, 4999 - (totals.subtotal - totals.discount));
      const pct = Math.min(100, Math.round(((totals.subtotal - totals.discount) / 4999) * 100));
      fillEl.style.width = `${pct}%`;

      if (totals.subtotal === 0) {
        goalEl.innerHTML = 'Add items for <strong>Free White-Glove Delivery</strong>';
      } else if (remaining > 0) {
        goalEl.innerHTML = `Add <strong>₹${remaining.toLocaleString('en-IN')}</strong> more for <strong>Free White-Glove Own-Delivery</strong>`;
      } else {
        goalEl.innerHTML = '<strong style="color: #166534;">✓ Qualified for Free White-Glove Own-Delivery across India</strong>';
      }
    }

    if (cart.length === 0) {
      drawerContainer.innerHTML = `
        <div style="text-align: center; padding: 48px 16px;">
          <div style="font-size: 40px; margin-bottom: 12px;">⛳</div>
          <h4 style="margin-bottom: 6px;">Your golf bag is empty</h4>
          <p class="text-muted" style="font-size: 13px; margin-bottom: 20px;">Explore tour-proven drivers, putters, balls and apparel.</p>
          <a href="products.html" class="btn btn-primary btn-sm">Browse Collection</a>
        </div>
      `;
      const footer = document.getElementById('cart-drawer-footer');
      if (footer) footer.style.display = 'none';
      return;
    }

    const footer = document.getElementById('cart-drawer-footer');
    if (footer) footer.style.display = 'block';

    drawerContainer.innerHTML = cart
      .map((item) => {
        return `
        <div style="display: flex; gap: 14px; padding: 14px; background: #ffffff; border-radius: var(--radius-sm); border: 1px solid var(--border-line);">
          <img src="${item.product.image}" alt="${item.product.name}" style="width: 70px; height: 70px; object-fit: cover; border-radius: var(--radius-xs);">
          <div style="flex: 1; display: flex; flex-direction: column;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
              <span style="font-size: 10px; font-weight: 700; text-transform: uppercase; color: var(--color-text-muted);">${item.product.brand}</span>
              <button onclick="Store.removeFromCart('${item.product.id}')" style="color: #dc2626; font-size: 14px;">✕</button>
            </div>
            <a href="product-detail.html?id=${item.product.id}" style="font-size: 13.5px; font-weight: 600; line-height: 1.3; margin: 2px 0;">${item.product.name}</a>
            <div style="margin-top: auto; display: flex; justify-content: space-between; align-items: center; padding-top: 6px;">
              <div style="display: flex; align-items: center; border: 1px solid var(--border-line); border-radius: var(--radius-xs);">
                <button onclick="Store.updateCartQty('${item.product.id}', -1)" style="padding: 2px 8px; font-size: 13px;">-</button>
                <span style="min-width: 22px; text-align: center; font-size: 12px; font-weight: 700;">${item.quantity}</span>
                <button onclick="Store.updateCartQty('${item.product.id}', 1)" style="padding: 2px 8px; font-size: 13px;">+</button>
              </div>
              <strong style="font-size: 14.5px;">₹${(item.product.price * item.quantity).toLocaleString('en-IN')}</strong>
            </div>
          </div>
        </div>
      `;
      })
      .join('');

    // Update totals
    const subtotalEl = document.getElementById('cart-drawer-subtotal');
    const discountEl = document.getElementById('cart-drawer-discount');
    const shippingEl = document.getElementById('cart-drawer-shipping');
    const totalEl = document.getElementById('cart-drawer-total');

    if (subtotalEl) subtotalEl.textContent = `₹${totals.subtotal.toLocaleString('en-IN')}`;
    if (discountEl) {
      discountEl.textContent = totals.discount > 0 ? `-₹${totals.discount.toLocaleString('en-IN')}` : '₹0';
      discountEl.parentElement.style.display = totals.discount > 0 ? 'flex' : 'none';
    }
    if (shippingEl) shippingEl.textContent = totals.shipping === 0 ? 'FREE' : `₹${totals.shipping}`;
    if (totalEl) totalEl.textContent = `₹${totals.total.toLocaleString('en-IN')}`;
  },

  // RENDER COMPARE TRAY
  renderCompareTray() {
    let tray = document.getElementById('compare-tray');
    if (!tray) {
      tray = document.createElement('div');
      tray.id = 'compare-tray';
      tray.className = 'compare-tray';
      document.body.appendChild(tray);
    }

    const compareList = this.getCompareList();
    if (compareList.length === 0) {
      tray.classList.remove('active');
      return;
    }

    tray.classList.add('active');
    tray.innerHTML = `
      <div class="compare-tray-inner">
        <div style="display: flex; align-items: center; gap: 10px;">
          <strong style="font-size: 14px;">Comparing Gear (${compareList.length}/4)</strong>
          <button onclick="Store.clearCompare()" style="color: rgba(255,255,255,0.7); font-size: 12px; text-decoration: underline;">Clear All</button>
        </div>
        <div class="compare-slots">
          ${compareList
            .map(
              (p) => `
            <div class="compare-slot-item">
              <img src="${p.image}" class="compare-slot-img" alt="${p.name}">
              <span class="compare-slot-name">${p.name}</span>
              <button onclick="Store.toggleCompare(Store.getProductById('${p.id}'))" class="compare-remove-btn">✕</button>
            </div>
          `
            )
            .join('')}
        </div>
        <button onclick="UI.openCompareModal()" class="btn btn-gold btn-sm">
          Compare Specs Now →
        </button>
      </div>
    `;
  },
};

// Initialize Store
Store.init();

