'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { useStore } from '../../context/StoreContext';
import { PaymentMethod } from '../../types';
import {
  ShieldCheckIcon,
  TruckIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  BagIcon,
} from '../../components/Icons';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartSubtotal, cartDiscount, cartShipping, cartTotal, appliedCoupon, createOrder } = useStore();

  const [formData, setFormData] = useState({
    fullName: 'Vikramaditya Sharma',
    email: 'vikram.sharma@dlfcity.in',
    phone: '9811234567',
    addressLine: 'Villa 18, Magnolia Enclave, Golf Course Road',
    city: 'Gurugram',
    state: 'Haryana',
    pincode: '122009',
    deliverySlot: 'Morning (9:00 AM - 1:00 PM)',
    deliveryNotes: 'Please call before arriving at the security gate.',
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [upiId, setUpiId] = useState('vikramaditya@okhdfcbank');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (cart.length === 0) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
          <BagIcon size={48} style={{ color: 'var(--muted)', marginBottom: 16 }} />
          <h2 style={{ fontSize: 24, marginBottom: 8 }}>Your cart is empty</h2>
          <p style={{ color: 'var(--muted)', marginBottom: 20 }}>Please add tour equipment to proceed with checkout.</p>
          <Link href="/shop" className="btn btn-primary">
            Browse Store
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const order = createOrder({
        customerName: formData.fullName,
        customerEmail: formData.email,
        customerPhone: `+91 ${formData.phone}`,
        shippingAddress: {
          addressLine: formData.addressLine,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
        },
        paymentMethod: paymentMethod,
      });

      router.push(`/order-success?orderId=${order.id}`);
    }, 800);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f7f6f0' }}>
      <Navbar />

      <main style={{ maxWidth: 1200, margin: '0 auto', width: '100%', padding: '40px 24px', flex: 1 }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 32, marginBottom: 8 }}>
          Secure Checkout
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 32 }}>
          Complete your order for White-Glove Own-Delivery across India.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: 40, alignItems: 'start' }}>
          {/* Left Form: Customer & Delivery Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            {/* Step 1: Customer Info */}
            <div style={{ background: '#ffffff', padding: 28, borderRadius: 8, border: '1px solid var(--line)' }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 26, height: 26, background: 'var(--green)', color: '#ffffff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>
                  1
                </span>
                <span>Contact &amp; Customer Information</span>
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 4 }}>Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--line)', borderRadius: 4 }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 4 }}>Phone Number (+91) *</label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--line)', borderRadius: 4 }}
                  />
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 4 }}>Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--line)', borderRadius: 4 }}
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Shipping Address */}
            <div style={{ background: '#ffffff', padding: 28, borderRadius: 8, border: '1px solid var(--line)' }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 26, height: 26, background: 'var(--green)', color: '#ffffff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>
                  2
                </span>
                <span>Delivery Address (Home, Villa, or Golf Club)</span>
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 4 }}>
                    Address (House / Villa / Apartment / Club Locker) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.addressLine}
                    onChange={(e) => setFormData({ ...formData, addressLine: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--line)', borderRadius: 4 }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 4 }}>City *</label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--line)', borderRadius: 4 }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 4 }}>State *</label>
                    <input
                      type="text"
                      required
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--line)', borderRadius: 4 }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 4 }}>PIN Code *</label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={formData.pincode}
                      onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                      style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--line)', borderRadius: 4 }}
                    />
                  </div>
                </div>

                {/* Own-Delivery Slot */}
                <div style={{ background: '#f8faf8', padding: 16, borderRadius: 6, border: '1px solid rgba(26, 77, 54, 0.15)' }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--green)', marginBottom: 6 }}>
                    🚚 Preferred White-Glove Handover Slot:
                  </label>
                  <select
                    value={formData.deliverySlot}
                    onChange={(e) => setFormData({ ...formData, deliverySlot: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--line)', borderRadius: 4, background: '#ffffff' }}
                  >
                    <option>Morning (9:00 AM - 1:00 PM) - Uniformed Fleet</option>
                    <option>Afternoon (1:00 PM - 5:00 PM) - Uniformed Fleet</option>
                    <option>Evening (5:00 PM - 8:00 PM) - Uniformed Fleet</option>
                    <option>Deliver directly to Club Caddy Master Desk</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 4 }}>
                    Special Instructions for Delivery Executive:
                  </label>
                  <input
                    type="text"
                    value={formData.deliveryNotes}
                    onChange={(e) => setFormData({ ...formData, deliveryNotes: e.target.value })}
                    placeholder="e.g. Call gate security, handle golf bag upright"
                    style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--line)', borderRadius: 4 }}
                  />
                </div>
              </div>
            </div>

            {/* Step 3: Payment Method */}
            <div style={{ background: '#ffffff', padding: 28, borderRadius: 8, border: '1px solid var(--line)' }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 26, height: 26, background: 'var(--green)', color: '#ffffff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>
                  3
                </span>
                <span>Select Payment Mode</span>
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {/* UPI Option */}
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 12,
                    padding: 16,
                    border: paymentMethod === 'UPI' ? '2px solid var(--green)' : '1px solid var(--line)',
                    borderRadius: 6,
                    background: paymentMethod === 'UPI' ? 'var(--green-light)' : '#ffffff',
                    cursor: 'pointer',
                  }}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'UPI'}
                    onChange={() => setPaymentMethod('UPI')}
                    style={{ marginTop: 3 }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong style={{ fontSize: 15 }}>UPI Instant Pay (Google Pay / PhonePe / Paytm / BHIM)</strong>
                      <span style={{ fontSize: 11, background: '#2e7d32', color: '#ffffff', padding: '2px 6px', borderRadius: 4, fontWeight: 700 }}>
                        RECOMMENDED
                      </span>
                    </div>
                    <p style={{ fontSize: 12, color: 'var(--muted)', margin: '4px 0 8px' }}>
                      Instant payment with zero surcharge. Fast verification.
                    </p>
                    {paymentMethod === 'UPI' && (
                      <div style={{ marginTop: 8 }}>
                        <input
                          type="text"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          placeholder="Enter your VPA / UPI ID (e.g. name@okhdfcbank)"
                          style={{ padding: '8px 12px', width: '100%', maxWidth: 320, border: '1px solid var(--line)', borderRadius: 4 }}
                        />
                      </div>
                    )}
                  </div>
                </label>

                {/* Cards Option */}
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 12,
                    padding: 16,
                    border: paymentMethod === 'Credit/Debit Card' ? '2px solid var(--green)' : '1px solid var(--line)',
                    borderRadius: 6,
                    background: paymentMethod === 'Credit/Debit Card' ? 'var(--green-light)' : '#ffffff',
                    cursor: 'pointer',
                  }}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'Credit/Debit Card'}
                    onChange={() => setPaymentMethod('Credit/Debit Card')}
                    style={{ marginTop: 3 }}
                  />
                  <div>
                    <strong style={{ fontSize: 15 }}>Credit / Debit Cards (Visa, MasterCard, RuPay, Amex)</strong>
                    <p style={{ fontSize: 12, color: 'var(--muted)', margin: '4px 0 0' }}>
                      Encrypted 256-bit bank level security.
                    </p>
                  </div>
                </label>

                {/* Net Banking */}
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 12,
                    padding: 16,
                    border: paymentMethod === 'Net Banking' ? '2px solid var(--green)' : '1px solid var(--line)',
                    borderRadius: 6,
                    background: paymentMethod === 'Net Banking' ? 'var(--green-light)' : '#ffffff',
                    cursor: 'pointer',
                  }}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'Net Banking'}
                    onChange={() => setPaymentMethod('Net Banking')}
                    style={{ marginTop: 3 }}
                  />
                  <div>
                    <strong style={{ fontSize: 15 }}>Net Banking (All Major Indian Banks)</strong>
                    <p style={{ fontSize: 12, color: 'var(--muted)', margin: '4px 0 0' }}>
                      HDFC, ICICI, State Bank of India, Axis, Kotak.
                    </p>
                  </div>
                </label>

                {/* COD Option */}
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 12,
                    padding: 16,
                    border: paymentMethod === 'Cash on Delivery (COD)' ? '2px solid var(--green)' : '1px solid var(--line)',
                    borderRadius: 6,
                    background: paymentMethod === 'Cash on Delivery (COD)' ? 'var(--green-light)' : '#ffffff',
                    cursor: 'pointer',
                  }}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'Cash on Delivery (COD)'}
                    onChange={() => setPaymentMethod('Cash on Delivery (COD)')}
                    style={{ marginTop: 3 }}
                  />
                  <div>
                    <strong style={{ fontSize: 15 }}>Cash on Delivery (COD) / Pay on Arrival</strong>
                    <p style={{ fontSize: 12, color: 'var(--muted)', margin: '4px 0 0' }}>
                      Pay via cash or UPI directly to our delivery executive when your order arrives.
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column: Order Review & Submit */}
          <div>
            <div style={{ background: '#ffffff', borderRadius: 8, border: '1px solid var(--line)', padding: 24, boxShadow: 'var(--shadow-sm)' }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Items In Your Bag ({cart.length})</h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxHeight: 260, overflowY: 'auto', marginBottom: 20 }}>
                {cart.map((item, idx) => {
                  const price = item.product.price + (item.selectedVariant?.priceModifier || 0);
                  return (
                    <div key={idx} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                      <img src={item.product.image} alt={item.product.name} style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4 }} />
                      <div style={{ flex: 1, fontSize: 13 }}>
                        <strong style={{ display: 'block', fontSize: 13 }}>{item.product.name}</strong>
                        <span style={{ color: 'var(--muted)', fontSize: 12 }}>
                          Qty: {item.quantity} {item.selectedVariant ? `• ${item.selectedVariant.name}` : ''}
                        </span>
                      </div>
                      <span style={{ fontWeight: 700, fontSize: 14 }}>
                        ₹{(price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Price Breakdown */}
              <div style={{ borderTop: '1px solid var(--line)', paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--muted)' }}>Subtotal</span>
                  <span>₹{cartSubtotal.toLocaleString('en-IN')}</span>
                </div>
                {cartDiscount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#2e7d32', fontWeight: 600 }}>
                    <span>Discount ({appliedCoupon?.code})</span>
                    <span>-₹{cartDiscount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--muted)' }}>White-Glove Fleet Delivery</span>
                  <span>{cartShipping === 0 ? <strong style={{ color: 'var(--green)' }}>FREE</strong> : `₹${cartShipping}`}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--muted)' }}>GST (18% inclusive)</span>
                  <span>₹{Math.round((cartTotal * 0.18) / 1.18).toLocaleString('en-IN')}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--line)', paddingTop: 12, marginTop: 4, fontSize: 18, fontWeight: 800 }}>
                  <span>Total Payable</span>
                  <span style={{ color: 'var(--green)' }}>₹{cartTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Place Order CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary btn-block btn-lg"
                style={{ marginTop: 24 }}
              >
                {isSubmitting ? (
                  <span>Securing Order...</span>
                ) : (
                  <>
                    <span>Place Order (₹{cartTotal.toLocaleString('en-IN')})</span>
                    <ArrowRightIcon size={18} />
                  </>
                )}
              </button>

              <div style={{ marginTop: 16, textAlign: 'center' }}>
                <span style={{ fontSize: 11, color: 'var(--muted)', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <ShieldCheckIcon size={14} />
                  <span>100% Secure Checkout • In-House Fleet Dispatch Guarantee</span>
                </span>
              </div>
            </div>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}
