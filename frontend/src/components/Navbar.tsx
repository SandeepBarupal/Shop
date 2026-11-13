'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '../context/StoreContext';
import {
  BagIcon,
  HeartIcon,
  SearchIcon,
  UserIcon,
  SettingsIcon,
  TruckIcon,
  CloseIcon,
} from './Icons';
import { Category, UserRole } from '../types';

export const Navbar: React.FC = () => {
  const router = useRouter();
  const {
    cart,
    wishlist,
    setIsCartOpen,
    searchQuery,
    setSearchQuery,
    setSelectedCategory,
    currentRole,
    setCurrentRole,
  } = useStore();

  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const wishlistCount = wishlist.length;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localSearch.trim()) {
      setSearchQuery(localSearch.trim());
      router.push(`/shop?q=${encodeURIComponent(localSearch.trim())}`);
    }
  };

  const handleCategoryClick = (cat: Category | 'all') => {
    setSelectedCategory(cat);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="site-header">
      {/* Top Announcement Bar */}
      <div className="announcement-bar">
        <div className="announcement-content">
          <span>
            🏌️ <strong>White-Glove Own-Delivery</strong> across Delhi NCR & Bengaluru • Free on orders above ₹4,999 • Code: <strong>GOLF10</strong>
          </span>
          {/* Quick Role Switcher */}
          <div className="role-simulator-badge">
            <span className="role-label">Active View:</span>
            <select
              value={currentRole}
              onChange={(e) => setCurrentRole(e.target.value as UserRole)}
              className="role-selector"
              aria-label="Switch simulation user role"
            >
              <option value="customer">👤 Customer</option>
              <option value="admin">⚙️ Super Admin</option>
              <option value="order_manager">📦 Order Manager</option>
              <option value="delivery_staff">🚚 Delivery Staff</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="main-navbar">
        <div className="nav-container">
          {/* Mobile hamburger button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="mobile-menu-toggle"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <CloseIcon size={22} /> : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            )}
          </button>

          {/* Wordmark Logo */}
          <Link href="/" className="brand-wordmark">
            <span className="brand-title">PAR &amp; FAIRWAY</span>
            <span className="brand-sub">LUXURY GOLF INDIA</span>
          </Link>

          {/* Desktop Search Bar */}
          <form onSubmit={handleSearchSubmit} className="nav-search-form">
            <div className="search-input-wrapper">
              <SearchIcon size={16} className="search-icon" />
              <input
                type="text"
                placeholder="Search balls, apparel, shoes, bags..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className="search-field"
              />
            </div>
          </form>

          {/* Right Action Icons */}
          <div className="nav-actions">
            <Link href="/track" className="nav-action-link" title="Track Live Order">
              <TruckIcon size={20} />
              <span className="action-label">Track</span>
            </Link>

            <Link href="/account" className="nav-action-link" title="My Account">
              <UserIcon size={20} />
              <span className="action-label">Account</span>
            </Link>

            <Link href="/account?tab=wishlist" className="nav-action-link" title="Saved Wishlist">
              <div className="badge-wrapper">
                <HeartIcon size={20} />
                {wishlistCount > 0 && <span className="counter-badge">{wishlistCount}</span>}
              </div>
              <span className="action-label">Wishlist</span>
            </Link>

            <button
              onClick={() => setIsCartOpen(true)}
              className="nav-action-link cart-btn"
              title="Shopping Cart"
              aria-label="Open Shopping Cart"
            >
              <div className="badge-wrapper">
                <BagIcon size={20} />
                {cartCount > 0 && <span className="counter-badge">{cartCount}</span>}
              </div>
              <span className="action-label">Cart</span>
            </button>

            {/* Admin Panel Quick Link */}
            <Link href="/admin" className="admin-pill-link" title="Open Management Suite">
              <SettingsIcon size={16} />
              <span>Admin Suite</span>
            </Link>
          </div>
        </div>

        {/* Categories Secondary Bar */}
        <nav className={`category-nav-bar ${isMobileMenuOpen ? 'open' : ''}`}>
          <div className="nav-container categories-container">
            <Link
              href="/shop"
              onClick={() => handleCategoryClick('all')}
              className="cat-link"
            >
              All Collection
            </Link>
            <Link
              href="/shop?cat=balls"
              onClick={() => handleCategoryClick('balls')}
              className="cat-link"
            >
              Golf Balls
            </Link>
            <Link
              href="/shop?cat=apparel"
              onClick={() => handleCategoryClick('apparel')}
              className="cat-link"
            >
              Apparel
            </Link>
            <Link
              href="/shop?cat=footwear"
              onClick={() => handleCategoryClick('footwear')}
              className="cat-link"
            >
              Footwear
            </Link>
            <Link
              href="/shop?cat=bags"
              onClick={() => handleCategoryClick('bags')}
              className="cat-link"
            >
              Bags
            </Link>
            <Link
              href="/shop?cat=accessories"
              onClick={() => handleCategoryClick('accessories')}
              className="cat-link"
            >
              Accessories
            </Link>
            <Link href="/about" className="cat-link-accent">
              Our Fleet Delivery
            </Link>
            <Link href="/contact" className="cat-link-accent">
              Fitting &amp; Support
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
};
