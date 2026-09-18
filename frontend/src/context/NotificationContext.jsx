import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { playNotificationChime } from '../utils/soundUtils';

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const { user, role, isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [activeToast, setActiveToast] = useState(null);
  const [soundEnabled, setSoundEnabled] = useState(() => {
    const saved = localStorage.getItem('medicalnet_sound_enabled');
    return saved !== null ? saved === 'true' : true;
  });

  // Generate role-specific initial sample notifications if empty
  const getDefaultNotifications = useCallback((userRole) => {
    const now = Date.now();
    if (userRole === 'DOCTOR') {
      return [
        {
          id: 'notif-d-1',
          title: 'Bệnh nhân mới đặt lịch khám',
          message: 'Bệnh nhân An Nguyễn vừa đặt lịch khám chuyên khoa Thần Kinh vào ngày mai.',
          type: 'appointment',
          link: '/doctor/schedule',
          timestamp: new Date(now - 12 * 60 * 1000).toISOString(),
          read: false,
        },
        {
          id: 'notif-d-2',
          title: 'Đánh giá 5 sao từ bệnh nhân',
          message: 'Bạn vừa nhận được phản hồi: "Bác sĩ tư vấn rất kỹ lưỡng, nhiệt tình và ân cần!"',
          type: 'review',
          link: '/doctors',
          timestamp: new Date(now - 2 * 60 * 60 * 1000).toISOString(),
          read: false,
        },
        {
          id: 'notif-d-3',
          title: 'Nhắc nhở ca trực sắp diễn ra',
          message: 'Ca làm việc sắp tới của bạn đã có bệnh nhân xác nhận lịch hẹn.',
          type: 'reminder',
          link: '/doctor/schedule',
          timestamp: new Date(now - 22 * 60 * 60 * 1000).toISOString(),
          read: true,
        },
      ];
    } else if (userRole === 'ADMIN') {
      return [
        {
          id: 'notif-a-1',
          title: 'Cập nhật hệ thống y tế',
          message: 'Hồ sơ nhân sự y tế và tài khoản người dùng đã được đồng bộ hóa thành công.',
          type: 'admin',
          link: '/admin/users',
          timestamp: new Date(now - 15 * 60 * 1000).toISOString(),
          read: false,
        },
        {
          id: 'notif-a-2',
          title: 'Báo cáo tăng trưởng tháng',
          message: 'Hệ thống ghi nhận tỷ lệ hoàn thành ca khám đạt mức tăng trưởng ấn tượng.',
          type: 'stats',
          link: '/admin',
          timestamp: new Date(now - 4 * 60 * 60 * 1000).toISOString(),
          read: false,
        },
        {
          id: 'notif-a-3',
          title: 'Hạ tầng máy chủ ổn định',
          message: 'Cụm máy chủ cơ sở dữ liệu PostgreSQL & Redis hoạt động bình thường.',
          type: 'system',
          link: '/admin',
          timestamp: new Date(now - 26 * 60 * 60 * 1000).toISOString(),
          read: true,
        },
      ];
    } else {
      // PATIENT / default user
      return [
        {
          id: 'notif-p-1',
          title: 'Lịch khám đã được xác nhận',
          message: 'Lịch hẹn với BS. Nguyễn Văn Tuấn vào sáng mai đã được hệ thống xác nhận.',
          type: 'appointment',
          link: '/my-appointments',
          timestamp: new Date(now - 18 * 60 * 1000).toISOString(),
          read: false,
        },
        {
          id: 'notif-p-2',
          title: 'Toa thuốc điện tử đã sẵn sàng',
          message: 'Bác sĩ đã hoàn tất kết luận khám và xuất toa thuốc điện tử cho bạn.',
          type: 'prescription',
          link: '/my-medical-records',
          timestamp: new Date(now - 3 * 60 * 60 * 1000).toISOString(),
          read: false,
        },
        {
          id: 'notif-p-3',
          title: 'Nhắc nhở kiểm tra hồ sơ',
          message: 'Hãy kiểm tra và cập nhật đầy đủ thông tin cá nhân trước ngày khám.',
          type: 'reminder',
          link: '/profile',
          timestamp: new Date(now - 24 * 60 * 60 * 1000).toISOString(),
          read: true,
        },
      ];
    }
  }, []);

  // Sync with localStorage whenever user changes
  useEffect(() => {
    if (!isAuthenticated || !user) {
      setNotifications([]);
      return;
    }

    const storageKey = `medicalnet_notifications_${user?.id || user?.email || 'default'}`;
    const stored = localStorage.getItem(storageKey);

    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setNotifications(parsed);
          return;
        }
      } catch (e) {
        console.error('Error parsing stored notifications', e);
      }
    }

    // Initialize with role-appropriate defaults
    const defaults = getDefaultNotifications(role);
    setNotifications(defaults);
    localStorage.setItem(storageKey, JSON.stringify(defaults));
  }, [user?.id, user?.email, role, isAuthenticated, getDefaultNotifications]);

  // Persist sound preference
  const toggleSound = () => {
    setSoundEnabled((prev) => {
      const next = !prev;
      localStorage.setItem('medicalnet_sound_enabled', String(next));
      if (next) {
        playNotificationChime();
      }
      return next;
    });
  };

  const playTestSound = () => {
    playNotificationChime();
  };

  // Persist updates to localStorage
  const persistNotifications = (updated) => {
    setNotifications(updated);
    if (user) {
      const storageKey = `medicalnet_notifications_${user?.id || user?.email || 'default'}`;
      localStorage.setItem(storageKey, JSON.stringify(updated));
    }
  };

  // Actions
  const markAsRead = (id) => {
    const updated = notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
    persistNotifications(updated);
  };

  const markAllAsRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    persistNotifications(updated);
  };

  const removeNotification = (id) => {
    const updated = notifications.filter((n) => n.id !== id);
    persistNotifications(updated);
  };

  const clearAllNotifications = () => {
    persistNotifications([]);
  };

  const dismissToast = () => {
    setActiveToast(null);
  };

  const addNotification = useCallback(
    ({ title, message, type = 'general', link = null, playSound = true }) => {
      const newNotif = {
        id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        title,
        message,
        type,
        link,
        timestamp: new Date().toISOString(),
        read: false,
      };

      setNotifications((prev) => {
        const updated = [newNotif, ...prev];
        if (user) {
          const storageKey = `medicalnet_notifications_${user?.id || user?.email || 'default'}`;
          localStorage.setItem(storageKey, JSON.stringify(updated));
        }
        return updated;
      });

      // Show floating Toast alert
      setActiveToast(newNotif);

      // Play audio chime if sound is enabled
      if (playSound && soundEnabled) {
        playNotificationChime();
      }
    },
    [user, soundEnabled]
  );

  // Listen to custom cross-component notification events
  useEffect(() => {
    const handleCustomNotification = (e) => {
      if (e.detail) {
        addNotification(e.detail);
      }
    };
    window.addEventListener('medicalnet:new-notification', handleCustomNotification);
    return () => {
      window.removeEventListener('medicalnet:new-notification', handleCustomNotification);
    };
  }, [addNotification]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        soundEnabled,
        toggleSound,
        playTestSound,
        activeToast,
        dismissToast,
        markAsRead,
        markAllAsRead,
        removeNotification,
        clearAllNotifications,
        addNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
