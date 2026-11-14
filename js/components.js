/* ==========================================================================
   ROYAL FAIRWAY GOLF CO. — REUSABLE UI BUILDERS & MODAL MANAGERS
   ========================================================================== */

const UI = {
  // Render Product Card HTML
  renderProductCard(product) {
    const inWishlist = Store.isInWishlist(product.id);
    const inCompare = Store.isInCompare(product.id);
    const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100);

    let conditionBadge = '';
    if (product.condition && product.condition !== 'New') {
      const cls = product.condition.includes('Mint')
        ? 'badge-mint'
        : product.condition.includes('Excellent')
        ? 'badge-excellent'
        : 'badge-verygood';
      conditionBadge = `<span class="badge ${cls}">${product.condition}</span>`;
    }

    return `
      <div class="product-card" data-product-id="${product.id}">
        <div class="product-card-media">
          <a href="product-detail.html?id=${product.id}">
            <img src="${product.image}" alt="${product.name}" class="product-card-img" loading="lazy">
          </a>
          
          <div class="product-card-badges">
            ${conditionBadge}
            ${product.bestseller ? '<span class="badge badge-bestseller">Best Seller</span>' : ''}
            ${product.featured ? '<span class="badge badge-tour">Tour Choice</span>' : ''}
            ${discount > 0 ? `<span class="badge badge-sale">${discount}% OFF</span>` : ''}
          </div>

          <div class="product-card-actions-top">
            <button class="card-action-btn ${inWishlist ? 'active' : ''}" onclick="UI.handleWishlistToggle(event, '${product.id}')" title="Save to Wishlist" aria-label="Wishlist">
              ♥
            </button>
            <button class="card-action-btn ${inCompare ? 'compare-active' : ''}" onclick="UI.handleCompareToggle(event, '${product.id}')" title="Compare Equipment Specs" aria-label="Compare">
              ⚖
            </button>
            <button class="card-action-btn" onclick="UI.openQuickView('${product.id}')" title="Quick View" aria-label="Quick View">
              👁
            </button>
          </div>
        </div>

        <div class="product-card-body">
          <span class="product-card-brand">${product.brand}</span>
          <h4 class="product-card-title">
            <a href="product-detail.html?id=${product.id}">${product.name}</a>
          </h4>

          <div class="product-card-rating">
            <div class="stars-row">
              ${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5 - Math.floor(product.rating))}
            </div>
            <span class="rating-count">(${product.reviewsCount})</span>
          </div>

          <div class="product-card-pricing">
            <span class="price-current">₹${product.price.toLocaleString('en-IN')}</span>
            ${product.mrp > product.price ? `<span class="price-mrp">₹${product.mrp.toLocaleString('en-IN')}</span>` : ''}
            ${discount > 0 ? `<span class="price-discount-tag">Save ₹${(product.mrp - product.price).toLocaleString('en-IN')}</span>` : ''}
          </div>
        </div>

        <div class="product-card-footer">
          <button class="btn btn-outline btn-block btn-sm" onclick="Store.addToCart(Store.getProductById('${product.id}'), 1)">
            + Add to Bag
          </button>
        </div>
      </div>
    `;
  },

  handleWishlistToggle(e, id) {
    e.preventDefault();
    e.stopPropagation();
    const prod = Store.getProductById(id);
    if (!prod) return;
    const added = Store.toggleWishlist(prod);
    const btn = e.currentTarget;
    if (added) btn.classList.add('active');
    else btn.classList.remove('active');
  },

  handleCompareToggle(e, id) {
    e.preventDefault();
    e.stopPropagation();
    const prod = Store.getProductById(id);
    if (!prod) return;
    const added = Store.toggleCompare(prod);
    const btn = e.currentTarget;
    if (added) btn.classList.add('compare-active');
    else btn.classList.remove('compare-active');
  },

  // QUICK VIEW MODAL
  openQuickView(productId) {
    const product = Store.getProductById(productId);
    if (!product) return;

    let modal = document.getElementById('quick-view-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'quick-view-modal';
      modal.className = 'modal-overlay';
      document.body.appendChild(modal);
    }

    const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100);

    modal.innerHTML = `
      <div class="modal-content-box" onclick="event.stopPropagation()">
        <button class="modal-close-btn" onclick="UI.closeQuickView()">✕</button>
        
        <div style="display: grid; grid-template-columns: 1fr 1.1fr; gap: 32px; padding: 32px;">
          <div>
            <div style="width: 100%; padding-top: 100%; position: relative; border-radius: var(--radius-sm); overflow: hidden; background: #f7f7f3; border: 1px solid var(--border-line);">
              <img id="qv-main-img" src="${product.image}" alt="${product.name}" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;">
            </div>
            ${
              product.gallery && product.gallery.length > 1
                ? `
              <div style="display: flex; gap: 8px; margin-top: 12px;">
                ${product.gallery
                  .map(
                    (g) => `
                  <img src="${g}" onclick="document.getElementById('qv-main-img').src='${g}'" style="width: 54px; height: 54px; object-fit: cover; border-radius: var(--radius-xs); border: 1px solid var(--border-line); cursor: pointer;">
                `
                  )
                  .join('')}
              </div>
            `
                : ''
            }
          </div>

          <div>
            <span style="font-size: 11px; font-weight: 700; letter-spacing: 0.12em; color: var(--color-text-muted); text-transform: uppercase;">
              ${product.brand} • SKU: ${product.sku}
            </span>
            <h3 style="margin: 6px 0 10px; font-size: 22px;">${product.name}</h3>
            
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 14px;">
              <span style="color: var(--color-gold); font-size: 14px;">${'★'.repeat(Math.floor(product.rating))}</span>
              <strong style="font-size: 13px;">${product.rating}</strong>
              <span class="text-muted" style="font-size: 12px;">(${product.reviewsCount} verified player ratings)</span>
            </div>

            <div style="padding: 12px 0; border-top: 1px solid var(--border-line); border-bottom: 1px solid var(--border-line); margin-bottom: 18px;">
              <div style="display: flex; align-items: baseline; gap: 12px;">
                <span style="font-size: 26px; font-weight: 800; color: var(--color-primary);">₹${product.price.toLocaleString('en-IN')}</span>
                ${product.mrp > product.price ? `<span style="font-size: 16px; color: var(--color-text-muted); text-decoration: line-through;">₹${product.mrp.toLocaleString('en-IN')}</span>` : ''}
                ${discount > 0 ? `<span class="badge badge-sale">Save ${discount}%</span>` : ''}
              </div>
              <span style="font-size: 12px; color: var(--color-text-muted); display: block; margin-top: 4px;">
                Inclusive of 18% GST • Free White-Glove Own-Delivery on ₹4,999+
              </span>
            </div>

            <p style="font-size: 13.5px; line-height: 1.6; color: var(--color-text-main); margin-bottom: 18px;">
              ${product.description}
            </p>

            <div style="display: flex; gap: 12px; margin-bottom: 20px;">
              <button class="btn btn-primary btn-block btn-lg" onclick="Store.addToCart(Store.getProductById('${product.id}'), 1); UI.closeQuickView();">
                Add to Bag
              </button>
              <a href="product-detail.html?id=${product.id}" class="btn btn-secondary">
                View Full Specs →
              </a>
            </div>

            <div style="font-size: 12px; color: var(--color-text-muted); display: flex; gap: 16px;">
              <span>🚚 Gurugram & Bengaluru Same-Day Fleet Dispatch</span>
              <span>🔒 100% Factory Serial Verified</span>
            </div>
          </div>
        </div>
      </div>
    `;

    modal.classList.add('active');
    modal.onclick = () => UI.closeQuickView();
  },

  closeQuickView() {
    const modal = document.getElementById('quick-view-modal');
    if (modal) modal.classList.remove('active');
  },

  // COMPARE SPECS MODAL
  openCompareModal() {
    const compareList = Store.getCompareList();
    if (compareList.length === 0) return;

    let modal = document.getElementById('compare-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'compare-modal';
      modal.className = 'modal-overlay';
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div class="modal-content-box" style="max-width: 1040px;" onclick="event.stopPropagation()">
        <button class="modal-close-btn" onclick="UI.closeCompareModal()">✕</button>
        
        <div style="padding: 32px;">
          <h3 style="margin-bottom: 6px;">Side-by-Side Equipment Comparison</h3>
          <p class="text-muted" style="font-size: 13px; margin-bottom: 24px;">Comparing technical specifications, lofts, shafts and tour performance.</p>

          <div style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; font-size: 13.5px;">
              <thead>
                <tr>
                  <th style="padding: 12px; text-align: left; background: #f8faf9; border-bottom: 2px solid var(--border-line); width: 180px;">Specification</th>
                  ${compareList
                    .map(
                      (p) => `
                    <th style="padding: 12px; text-align: center; border-bottom: 2px solid var(--border-line);">
                      <img src="${p.image}" style="width: 80px; height: 80px; object-fit: cover; margin: 0 auto 8px; border-radius: var(--radius-xs); border: 1px solid var(--border-line);">
                      <div style="font-size: 13px; font-weight: 700;">${p.name}</div>
                      <div style="color: var(--color-primary); font-weight: 800; margin-top: 4px;">₹${p.price.toLocaleString('en-IN')}</div>
                      <button onclick="Store.addToCart(Store.getProductById('${p.id}'), 1); UI.closeCompareModal();" class="btn btn-primary btn-sm" style="margin-top: 8px;">Add to Bag</button>
                    </th>
                  `
                    )
                    .join('')}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="padding: 10px; font-weight: 700; background: #fafaf8;">Brand</td>
                  ${compareList.map((p) => `<td style="padding: 10px; text-align: center;">${p.brand}</td>`).join('')}
                </tr>
                <tr>
                  <td style="padding: 10px; font-weight: 700; background: #fafaf8;">Category</td>
                  ${compareList.map((p) => `<td style="padding: 10px; text-align: center;">${p.categoryName}</td>`).join('')}
                </tr>
                <tr>
                  <td style="padding: 10px; font-weight: 700; background: #fafaf8;">Condition Grade</td>
                  ${compareList.map((p) => `<td style="padding: 10px; text-align: center;"><strong>${p.condition || 'New'}</strong></td>`).join('')}
                </tr>
                <tr>
                  <td style="padding: 10px; font-weight: 700; background: #fafaf8;">Hand Orientation</td>
                  ${compareList.map((p) => `<td style="padding: 10px; text-align: center;">${p.hand || 'Standard'}</td>`).join('')}
                </tr>
                <tr>
                  <td style="padding: 10px; font-weight: 700; background: #fafaf8;">Player Rating</td>
                  ${compareList.map((p) => `<td style="padding: 10px; text-align: center; color: var(--color-gold);">★ ${p.rating} (${p.reviewsCount})</td>`).join('')}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;

    modal.classList.add('active');
    modal.onclick = () => UI.closeCompareModal();
  },

  closeCompareModal() {
    const modal = document.getElementById('compare-modal');
    if (modal) modal.classList.remove('active');
  },

  // TOGGLE CART DRAWER
  toggleCartDrawer(open) {
    let overlay = document.getElementById('cart-drawer');
    if (!overlay) return;

    if (open === undefined) {
      overlay.classList.toggle('active');
    } else if (open) {
      overlay.classList.add('active');
    } else {
      overlay.classList.remove('active');
    }

    if (overlay.classList.contains('active')) {
      Store.renderCartDrawer();
    }
  },

  // LIVE SEARCH SUGGESTIONS
  initSearch() {
    const input = document.getElementById('global-search-input');
    const dropdown = document.getElementById('global-search-dropdown');
    if (!input || !dropdown) return;

    input.addEventListener('input', (e) => {
      const q = e.target.value.trim().toLowerCase();
      if (q.length < 2) {
        dropdown.classList.remove('active');
        return;
      }

      const products = Store.getProducts();
      const matches = products
        .filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.brand.toLowerCase().includes(q) ||
            p.categoryName.toLowerCase().includes(q)
        )
        .slice(0, 5);

      if (matches.length === 0) {
        dropdown.innerHTML = `
          <div style="padding: 18px; text-align: center; font-size: 13px; color: var(--color-text-muted);">
            No equipment found matching &quot;<strong>${q}</strong>&quot;
          </div>
        `;
      } else {
        dropdown.innerHTML = `
          <div class="search-dropdown-header">Matching Equipment (${matches.length})</div>
          ${matches
            .map(
              (p) => `
            <a href="product-detail.html?id=${p.id}" class="search-dropdown-item">
              <img src="${p.image}" class="search-thumb" alt="${p.name}">
              <div style="flex: 1;">
                <span style="font-size: 10px; font-weight: 700; text-transform: uppercase; color: var(--color-text-muted);">${p.brand}</span>
                <div style="font-size: 13.5px; font-weight: 600; color: var(--color-text-main);">${p.name}</div>
              </div>
              <strong style="font-size: 13.5px; color: var(--color-primary);">₹${p.price.toLocaleString('en-IN')}</strong>
            </a>
          `
            )
            .join('')}
          <div style="padding: 10px 16px; background: #fafaf8; text-align: center;">
            <a href="search.html?q=${encodeURIComponent(q)}" style="font-size: 12px; font-weight: 700; color: var(--color-primary);">
              View all results for &quot;${q}&quot; →
            </a>
          </div>
        `;
      }

      dropdown.classList.add('active');
    });

    document.addEventListener('click', (e) => {
      if (!input.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.classList.remove('active');
      }
    });
  },

  // INITIALIZE GLOBAL LISTENERS
  init() {
    this.initSearch();
    Store.updateHeaderBadges();
    Store.renderCompareTray();
  },
};

// Auto-run on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  UI.init();
});

