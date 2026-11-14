/* ==========================================================================
   ROYAL FAIRWAY GOLF CO. — ADMIN DASHBOARD SUITE JS ENGINE
   ========================================================================== */

const Admin = {
  // Render Sidebar navigation with active page state
  renderSidebar(activePage) {
    const sidebarEl = document.getElementById('admin-sidebar');
    if (!sidebarEl) return;

    const navItems = [
      { section: 'Core Operations' },
      { id: 'dashboard', label: 'Dashboard Overview', icon: '📊', url: 'index.html' },
      { id: 'orders', label: 'Orders & Dispatches', icon: '📦', url: 'orders.html', badge: 'Active' },
      { id: 'tradeins', label: 'Trade-In Requests', icon: '🔄', url: 'trade-ins.html', badge: '5 New' },
      { id: 'inventory', label: 'Inventory Control', icon: '🏢', url: 'inventory.html' },

      { section: 'Tour Catalog' },
      { id: 'products', label: 'Product Catalog', icon: '⛳', url: 'products.html' },
      { id: 'categories', label: 'Category Manager', icon: '📁', url: 'categories.html' },
      { id: 'brands', label: 'Brand Partners', icon: '🏷️', url: 'brands.html' },
      { id: 'reviews', label: 'Player Reviews', icon: '★', url: 'reviews.html' },

      { section: 'Growth & Marketing' },
      { id: 'customers', label: 'Clubhouse CRM', icon: '👥', url: 'customers.html' },
      { id: 'coupons', label: 'Promo Codes & Vouchers', icon: '🎟️', url: 'coupons.html' },
      { id: 'reports', label: 'Sales & Analytics', icon: '📈', url: 'reports.html' },
      { id: 'content', label: 'Website CMS & Banners', icon: '📝', url: 'content.html' },

      { section: 'System' },
      { id: 'settings', label: 'Store Configuration', icon: '⚙️', url: 'settings.html' },
    ];

    let html = `
      <a href="index.html" class="admin-sidebar-brand">
        <div class="admin-crest">RF</div>
        <div>
          <div style="font-weight: 800; font-size: 15px; letter-spacing: 0.5px;">ROYAL FAIRWAY</div>
          <div style="font-size: 10px; color: var(--admin-gold); letter-spacing: 1.5px; font-weight: 700;">MANAGEMENT SUITE</div>
        </div>
      </a>
      <div class="admin-sidebar-nav">
    `;

    navItems.forEach(item => {
      if (item.section) {
        html += `<div class="admin-nav-category">${item.section}</div>`;
      } else {
        const isActive = activePage === item.id;
        html += `
          <a href="${item.url}" class="admin-nav-link ${isActive ? 'active' : ''}">
            <span class="nav-icon">${item.icon}</span>
            <span>${item.label}</span>
            ${item.badge ? `<span class="admin-nav-badge">${item.badge}</span>` : ''}
          </a>
        `;
      }
    });

    html += `
      </div>
      <div style="padding: 18px; border-top: 1px solid rgba(255,255,255,0.08); font-size: 11.5px; color: rgba(255,255,255,0.4);">
        <div>Royal Fairway Admin v2.4</div>
        <div>Gurugram &amp; Bengaluru Hubs</div>
      </div>
    `;

    sidebarEl.innerHTML = html;
  },

  // Render Topbar
  renderTopbar() {
    const topbarEl = document.getElementById('admin-topbar');
    if (!topbarEl) return;

    topbarEl.innerHTML = `
      <input type="text" class="admin-search-input" placeholder="Search orders, clubs, members, serials..." oninput="Admin.globalSearch(this.value)">

      <div class="admin-topbar-actions">
        <a href="../index.html" target="_blank" class="admin-store-link" title="Open Public Storefront">
          <span>↗</span> View Public Store
        </a>

        <div class="admin-user-pill">
          <div class="admin-avatar">RF</div>
          <div>
            <div style="font-size: 13px; font-weight: 700; color: var(--admin-primary);">Fleet Administrator</div>
            <div style="font-size: 11px; color: var(--admin-text-muted);">Central Dispatch Hub</div>
          </div>
        </div>
      </div>
    `;
  },

  globalSearch(val) {
    if (!val.trim()) return;
    // Highlight or filter currently open table
    const q = val.toLowerCase();
    document.querySelectorAll('.admin-table tbody tr').forEach(row => {
      const text = row.textContent.toLowerCase();
      row.style.display = text.includes(q) ? '' : 'none';
    });
  },

  showModal(modalId) {
    const el = document.getElementById(modalId);
    if (el) el.style.display = 'flex';
  },

  closeModal(modalId) {
    const el = document.getElementById(modalId);
    if (el) el.style.display = 'none';
  }
};

