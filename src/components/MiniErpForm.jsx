// src/components/MiniErpForm.js
import React, { useState, useEffect } from 'react';
import useProjectStore from '@/store/useProjectStore';

export default function MiniErpForm({ projectId }) {
  const { getPhaseData, updatePhaseData } = useProjectStore();
  const [formData, setFormData] = useState({
    product: '',
    customer: '',
    order: '',
    profitLoss: '',
  });

  useEffect(() => {
    const saved = getPhaseData(projectId, 'sell');
    if (Object.keys(saved).length > 0) {
      setFormData(saved);
    }
  }, [projectId, getPhaseData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFormData = { ...formData, [name]: value };
    setFormData(newFormData);
    updatePhaseData(projectId, 'sell', newFormData);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
        <textarea
          name="product"
          value={formData.product}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B0000] focus:border-[#8B0000] outline-none"
          rows="2"
          placeholder="Deskripsikan produk Anda..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
        <textarea
          name="customer"
          value={formData.customer}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B0000] focus:border-[#8B0000] outline-none"
          rows="2"
          placeholder="Siapa target pelanggan Anda?"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
        <textarea
          name="order"
          value={formData.order}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B0000] focus:border-[#8B0000] outline-none"
          rows="2"
          placeholder="Bagaimana sistem pemesanan?"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Laporan Laba/Rugi</label>
        <textarea
          name="profitLoss"
          value={formData.profitLoss}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B0000] focus:border-[#8B0000] outline-none"
          rows="3"
          placeholder="Masukkan ringkasan laporan keuangan..."
        />
      </div>
    </div>
  );
}