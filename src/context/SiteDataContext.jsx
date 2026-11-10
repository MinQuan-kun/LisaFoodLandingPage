import React, { createContext, useContext, useState, useEffect } from 'react';
import { giftBoxes as initialGiftBoxes, retailProducts as initialRetailProducts } from '../data/giftBoxes';

export const STORAGE_KEY = 'lisafood_admin_data_v1';
export const ORDERS_STORAGE_KEY = 'lisafood_orders_leads_v1';

export const DEFAULT_DATA = {
  hero: {
    bannerImage: '/images/catalogue-tet-2027-lisafood.jpg',
    title: 'LISA FOOD HAMPER TẾT 2027',
    subtitle: 'Hamper Tết 2027: Quà Tặng Nông Sản Việt',
    description: 'LisaFood tuyển chọn thực phẩm cao cấp từ các nông trại đạt chuẩn, gói trọn lời chúc xuân an khang vào từng set Hamper sang trọng, sạch và an toàn cho doanh nghiệp.',
    stats: [
      { id: 1, value: 100, suffix: '%', label: 'Nông Sản Xuất Khẩu' },
      { id: 2, value: 5000, suffix: '+', label: 'Hộp Quà Trao Tay' },
      { id: 3, value: 11, suffix: '+ Mẫu', label: 'Hamper Độc Quyền' }
    ]
  },
  contact: {
    hotline1: '0393.955.516',
    hotline2: '0907.560.668',
    email: 'sale@lisafood.vn',
    emailSecondary: 'hoa.le@lisafood.vn',
    zaloUrl: 'https://zalo.me/0393955516',
    address: 'Số 68 Đường Số 1, KDC Cityland, Phường 7, Quận Gò Vấp, TP. Hồ Chí Minh',
    websiteUrl: 'https://lisafood.vn',
    workingHours: 'Thứ 2 – Thứ 7: 08:00 – 18:00 | Chủ Nhật: Hotline & Zalo 24/7'
  },
  giftBoxes: initialGiftBoxes,
  retailProducts: initialRetailProducts
};

export const DEFAULT_ORDERS = [
  {
    id: 'LSF-849201',
    createdAt: new Date(Date.now() - 3600000 * 2.5).toISOString(),
    name: 'Nguyễn Thanh Hùng',
    phone: '0908.123.456',
    hamper: 'Sắc Xuân 01 (A) (1.022.000đ)',
    quantity: 50,
    note: 'Cần giao trước ngày 20 tháng Chạp, xuất hóa đơn VAT cho Công ty CP Xây Dựng An Phát',
    status: 'new' // 'new' | 'contacted' | 'quoted' | 'completed' | 'cancelled'
  },
  {
    id: 'LSF-732910',
    createdAt: new Date(Date.now() - 3600000 * 7).toISOString(),
    name: 'Trần Mai Chi',
    phone: '0938.999.888',
    hamper: 'Xuân Hoan Ca (1.380.000đ)',
    quantity: 20,
    note: 'In logo ép kim vàng của doanh nghiệp lên mặt thiệp chúc Tết đính kèm',
    status: 'contacted'
  },
  {
    id: 'LSF-619452',
    createdAt: new Date(Date.now() - 3600000 * 22).toISOString(),
    name: 'Lê Hoàng Nam',
    phone: '0977.555.666',
    hamper: 'Tết Lạc Hồng (1.682.000đ)',
    quantity: 100,
    note: 'Hỗ trợ gửi hộp mẫu thực tế về văn phòng Quận 1 trước khi ký hợp đồng',
    status: 'quoted'
  }
];

const SiteDataContext = createContext(null);

export function SiteDataProvider({ children }) {
  // Site content data (hero, contact, products)
  const [data, setData] = useState(() => {
    if (typeof window === 'undefined') return DEFAULT_DATA;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          hero: { ...DEFAULT_DATA.hero, ...parsed.hero },
          contact: { ...DEFAULT_DATA.contact, ...parsed.contact },
          giftBoxes: parsed.giftBoxes || DEFAULT_DATA.giftBoxes,
          retailProducts: parsed.retailProducts || DEFAULT_DATA.retailProducts
        };
      }
    } catch (e) {
      console.warn('Lỗi đọc localStorage:', e);
    }
    return DEFAULT_DATA;
  });

  // Orders / Leads collection
  const [orders, setOrders] = useState(() => {
    if (typeof window === 'undefined') return DEFAULT_ORDERS;
    try {
      const stored = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn('Lỗi đọc orders localStorage:', e);
    }
    return DEFAULT_ORDERS;
  });

  // Sync site data to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Không thể lưu localStorage:', e);
    }
  }, [data]);

  // Sync orders to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    } catch (e) {
      console.error('Không thể lưu orders localStorage:', e);
    }
  }, [orders]);

  // Sync across tabs in real-time
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          setData({
            hero: { ...DEFAULT_DATA.hero, ...parsed.hero },
            contact: { ...DEFAULT_DATA.contact, ...parsed.contact },
            giftBoxes: parsed.giftBoxes || DEFAULT_DATA.giftBoxes,
            retailProducts: parsed.retailProducts || DEFAULT_DATA.retailProducts
          });
        } catch (err) {}
      }
      if (e.key === ORDERS_STORAGE_KEY && e.newValue) {
        try {
          const parsedOrders = JSON.parse(e.newValue);
          if (Array.isArray(parsedOrders)) setOrders(parsedOrders);
        } catch (err) {}
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const updateHero = (heroUpdates) => {
    setData((prev) => ({
      ...prev,
      hero: { ...prev.hero, ...heroUpdates }
    }));
  };

  const updateContact = (contactUpdates) => {
    setData((prev) => ({
      ...prev,
      contact: { ...prev.contact, ...contactUpdates }
    }));
  };

  const updateGiftBoxes = (giftBoxes) => {
    setData((prev) => ({
      ...prev,
      giftBoxes
    }));
  };

  const updateRetailProducts = (retailProducts) => {
    setData((prev) => ({
      ...prev,
      retailProducts
    }));
  };

  const resetToDefault = () => {
    setData(DEFAULT_DATA);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {}
  };

  // Orders CRUD methods (Sẵn sàng gắn Database API)
  const addOrder = (orderInfo) => {
    const newOrder = {
      id: 'LSF-' + Math.floor(100000 + Math.random() * 900000),
      createdAt: new Date().toISOString(),
      status: 'new',
      ...orderInfo
    };
    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  };

  const updateOrderStatus = (id, newStatus) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === id ? { ...ord, status: newStatus } : ord))
    );
  };

  const deleteOrder = (id) => {
    setOrders((prev) => prev.filter((ord) => ord.id !== id));
  };

  const clearAllOrders = () => {
    setOrders([]);
  };

  return (
    <SiteDataContext.Provider
      value={{
        data,
        hero: data.hero,
        contact: data.contact,
        giftBoxes: data.giftBoxes,
        retailProducts: data.retailProducts,
        updateHero,
        updateContact,
        updateGiftBoxes,
        updateRetailProducts,
        resetToDefault,
        setData,
        // Orders state and actions
        orders,
        addOrder,
        updateOrderStatus,
        deleteOrder,
        clearAllOrders
      }}
    >
      {children}
    </SiteDataContext.Provider>
  );
}

export function useSiteData() {
  const ctx = useContext(SiteDataContext);
  if (!ctx) {
    throw new Error('useSiteData must be used within a SiteDataProvider');
  }
  return ctx;
}
