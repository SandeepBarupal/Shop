'use client';

import React, { useState } from 'react';
import { AdminLayout } from '../../../components/AdminLayout';
import { useStore } from '../../../context/StoreContext';
import { PlusIcon, TrashIcon } from '../../../components/Icons';

export default function AdminCouponsPage() {
  const { coupons, showToast } = useStore();
  const [localCoupons, setLocalCoupons] = useState(coupons);

  const [newCode, setNewCode] = useState('');
  const [discountType, setDiscountType] = useState<'percent' | 'flat'>('percent');
  const [discountVal, setDiscountVal] = useState(10);
  const [minOrder, setMinOrder] = useState(3000);
  const [description, setDescription] = useState('');

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim()) return;

    const coupon = {
      code: newCode.trim().toUpperCase(),
      discountPercentage: discountType === 'percent' ? Number(discountVal) : undefined,
      discountAmount: discountType === 'flat' ? Number(discountVal) : undefined,
      minOrderValue: Number(minOrder),
      description: description || `${discountVal}${discountType === 'percent' ? '%' : '₹'} off on orders above ₹${minOrder}.`,
    };

    setLocalCoupons([coupon, ...localCoupons]);
    setNewCode('');
    setDescription('');
    showToast(`Promotion code ${coupon.code} activated.`);
  };

  const handleDelete = (code: string) => {
    setLocalCoupons(localCoupons.filter((c) => c.code !== code));
    showToast(`Coupon ${code} disabled.`, 'info');
  };

  return (
    <AdminLayout title="Coupons &amp; Member Promotions">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 32, alignItems: 'start' }}>
        {/* Active Promotions Table */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3 className="admin-card-title">Active Discount Codes ({localCoupons.length})</h3>
          </div>

          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Voucher Code</th>
                  <th>Discount Benefit</th>
                  <th>Min Order Spend</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {localCoupons.map((c) => (
                  <tr key={c.code}>
                    <td>
                      <code style={{ fontSize: 13, background: 'var(--green-light)', color: 'var(--green)', padding: '3px 8px', borderRadius: 4, fontWeight: 700 }}>
                        {c.code}
                      </code>
                    </td>
                    <td>
                      <strong>
                        {c.discountPercentage ? `${c.discountPercentage}% Instant Off` : `Flat ₹${c.discountAmount} Off`}
                      </strong>
                    </td>
                    <td>₹{c.minOrderValue.toLocaleString('en-IN')}</td>
                    <td style={{ fontSize: 13, color: 'var(--muted)' }}>{c.description}</td>
                    <td>
                      <button onClick={() => handleDelete(c.code)} style={{ color: '#d32f2f' }} title="Disable coupon">
                        <TrashIcon size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create New Coupon Form */}
        <div className="admin-card">
          <h3 className="admin-card-title" style={{ marginBottom: 16 }}>Create New Promo Code</h3>
          <form onSubmit={handleCreateCoupon} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 4 }}>Voucher Code *</label>
              <input
                type="text"
                required
                value={newCode}
                onChange={(e) => setNewCode(e.target.value)}
                placeholder="e.g. DLFCHAMPION"
                style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--line)', borderRadius: 4, textTransform: 'uppercase' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 4 }}>Discount Type</label>
                <select
                  value={discountType}
                  onChange={(e) => setDiscountType(e.target.value as any)}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--line)', borderRadius: 4, background: '#ffffff' }}
                >
                  <option value="percent">Percentage (%)</option>
                  <option value="flat">Flat Amount (₹)</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 4 }}>Value</label>
                <input
                  type="number"
                  required
                  value={discountVal}
                  onChange={(e) => setDiscountVal(Number(e.target.value))}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--line)', borderRadius: 4 }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 4 }}>Minimum Order (₹) *</label>
              <input
                type="number"
                required
                value={minOrder}
                onChange={(e) => setMinOrder(Number(e.target.value))}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--line)', borderRadius: 4 }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 4 }}>Marketing Description</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Exclusive 15% off for club tournament players"
                style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--line)', borderRadius: 4 }}
              />
            </div>

            <button type="submit" className="btn btn-primary btn-block" style={{ marginTop: 8 }}>
              <PlusIcon size={16} />
              <span>Publish Coupon</span>
            </button>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}
