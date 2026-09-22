import React, { useEffect } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet, Platform } from 'react-native';
import { Host, BottomSheet } from '@expo/ui';
import {
  X,
  Bell,
  CheckCheck,
  Clock,
  ShieldAlert,
  Receipt,
  Star,
  Briefcase,
} from 'lucide-react-native';
import { AppNotification, UserRole } from '../../types';
import { AppLanguage, mobileTranslations } from '../../data/mobileTranslations';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentRole: UserRole;
  notifications: AppNotification[];
  onMarkAllRead: () => void;
  onNotificationClick: (notification: AppNotification) => void;
  currentLang?: AppLanguage;
}

const isWeb = Platform.OS === 'web';

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  currentRole,
  notifications,
  onMarkAllRead,
  onNotificationClick,
  currentLang = 'en',
}) => {
  const t = mobileTranslations[currentLang];

  useEffect(() => {
    if (!isOpen || !isWeb) return;
    const dom = globalThis as any;
    const handleKeyDown = (e: any) => {
      if (e.key === 'Escape') onClose();
    };
    dom.window.addEventListener('keydown', handleKeyDown);
    return () => dom.window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const roleNotifs = notifications.filter(n => n.role === currentRole);
  const unreadCount = roleNotifs.filter(n => !n.isRead).length;

  const getLocalizedNotification = (n: AppNotification) => {
    let title = n.title;
    let message = n.message;

    if (currentLang === 'hi') {
      if (title.includes('Request Received') || title.includes('New Direct Request')) {
        title = 'नया कार्य अनुरोध प्राप्त';
      } else if (title.includes('Booking Confirmed') || title.includes('Request Accepted')) {
        title = 'बुकिंग स्वीकृत व पक्की';
      } else if (title.includes('Invoice') || title.includes('Receipt')) {
        title = 'प्रमाणित रसीद उपलब्ध';
      } else if (title.includes('Review') || title.includes('Rating')) {
        title = 'नई ग्राहक समीक्षा प्राप्त';
      } else if (title.includes('Grievance') || title.includes('Dispute')) {
        title = 'वार्ड परिषद सूचना';
      }
    } else if (currentLang === 'mr') {
      if (title.includes('Request Received') || title.includes('New Direct Request')) {
        title = 'नवीन काम विनंती प्राप्त';
      } else if (title.includes('Booking Confirmed') || title.includes('Request Accepted')) {
        title = 'बुकिंग मंजूर व निश्चित';
      } else if (title.includes('Invoice') || title.includes('Receipt')) {
        title = 'प्रमाणित पावती उपलब्ध';
      } else if (title.includes('Review') || title.includes('Rating')) {
        title = 'नवीन ग्राहक अभिप्राय';
      } else if (title.includes('Grievance') || title.includes('Dispute')) {
        title = 'वॉर्ड परिषद सूचना';
      }
    }

    return { title, message };
  };

  return (
    <Host>
      <BottomSheet
        isPresented={isOpen}
        onDismiss={onClose}
        containerColor="#ffffff"
        contentPadding={0}
      >
        <View style={styles.sheet}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.headerIconBox}>
                <Bell size={16} color="#34d399" />
              </View>
              <View>
                <Text style={styles.headerTitle}>{t.notifications.title}</Text>
                <Text style={styles.headerSubtitle}>
                  {t.notifications.updates.replace('{role}', t.roles[currentRole])}
                </Text>
              </View>
            </View>
            <Pressable onPress={onClose} style={styles.headerClose}>
              <X size={20} color="#94a3b8" />
            </Pressable>
          </View>

          {/* Actions bar */}
          <View style={styles.actionsBar}>
            <Text style={styles.actionsText}>
              {roleNotifs.length}{' '}
              {currentLang === 'hi'
                ? 'सूचनाएँ'
                : currentLang === 'mr'
                ? 'सूचना'
                : 'alerts'}{' '}
              ({unreadCount}{' '}
              {currentLang === 'hi'
                ? 'अपठित'
                : currentLang === 'mr'
                ? 'न वाचलेले'
                : 'unread'}
              )
            </Text>
            {unreadCount > 0 && (
              <Pressable
                onPress={onMarkAllRead}
                style={({ pressed }) => [styles.markAllBtn, pressed && styles.pressed]}
              >
                <CheckCheck size={14} color="#047857" />
                <Text style={styles.markAllText}>{t.notifications.markAllRead}</Text>
              </Pressable>
            )}
          </View>

          {/* Notification list */}
          <ScrollView
            style={[styles.list, { maxHeight: 420 }]}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          >
            {roleNotifs.length === 0 ? (
              <View style={styles.empty}>
                <Bell size={24} color="#94a3b8" style={styles.emptyIcon} />
                <Text style={styles.emptyText}>{t.notifications.emptyText}</Text>
              </View>
            ) : (
              roleNotifs.map((n) => {
                const isPayment = n.type === 'payment_received' || n.type === 'invoice_issued';
                const isDispute = n.type === 'dispute_opened' || n.type === 'dispute_resolved';
                const isReview = n.type === 'review_received';
                const localized = getLocalizedNotification(n);

                return (
                  <Pressable
                    key={n.id}
                    onPress={() => {
                      onNotificationClick(n);
                    }}
                    style={({ pressed }) => [
                      styles.notifCard,
                      n.isRead ? styles.notifCardRead : styles.notifCardUnread,
                      pressed && styles.notifCardPressed,
                    ]}
                  >
                    <View style={styles.notifCardTop}>
                      <View style={styles.notifTitleRow}>
                        {!n.isRead && <View style={styles.unreadDot} />}
                        {isPayment ? (
                          <Receipt size={14} color="#0d9488" />
                        ) : isDispute ? (
                          <ShieldAlert size={14} color="#e11d48" />
                        ) : isReview ? (
                          <Star size={14} color="#f59e0b" />
                        ) : (
                          <Briefcase size={14} color="#4f46e5" />
                        )}
                        <Text style={styles.notifTitle} numberOfLines={1}>
                          {localized.title}
                        </Text>
                      </View>
                      <View style={styles.notifTime}>
                        <Clock size={12} color="#94a3b8" />
                        <Text style={styles.notifTimeText}>{n.timestamp}</Text>
                      </View>
                    </View>

                    <Text style={styles.notifMessage}>{localized.message}</Text>

                    <View style={styles.notifMeta}>
                      {n.bookingId && (
                        <Text style={styles.refBadge}>
                          Ref #{n.bookingId.slice(-6).toUpperCase()}
                        </Text>
                      )}
                      <Text style={styles.tapToView}>
                        {t.notifications.tapToView} →
                      </Text>
                    </View>
                  </Pressable>
                );
              })
            )}
          </ScrollView>

          <View style={styles.footer}>
            <Pressable
              onPress={onClose}
              style={({ pressed }) => [styles.closeBtn, pressed && styles.pressed]}
            >
              <Text style={styles.closeBtnText}>{t.common.close}</Text>
            </Pressable>
          </View>
        </View>
      </BottomSheet>
    </Host>
  );
};

const styles = StyleSheet.create({
  sheet: {
    backgroundColor: '#ffffff',
  },
  header: {
    backgroundColor: '#0f172a',
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerIconBox: {
    width: 32,
    height: 32,
    borderRadius: 12,
    backgroundColor: 'rgba(16,185,129,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
  headerSubtitle: {
    fontSize: 11,
    color: '#94a3b8',
    textTransform: 'capitalize',
  },
  headerClose: {
    padding: 4,
    borderRadius: 999,
  },
  actionsBar: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#f8fafc',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actionsText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  markAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  markAllText: {
    color: '#047857',
    fontWeight: '700',
    fontSize: 12,
  },
  list: {
    flexShrink: 1,
  },
  listContent: {
    padding: 12,
    gap: 10,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyIcon: {
    opacity: 0.4,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#94a3b8',
  },
  notifCard: {
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
  },
  notifCardRead: {
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
    opacity: 0.8,
  },
  notifCardUnread: {
    backgroundColor: 'rgba(236,253,245,0.7)',
    borderColor: '#6ee7b7',
  },
  notifCardPressed: {
    opacity: 0.85,
  },
  notifCardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  notifTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexShrink: 1,
    minWidth: 0,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#059669',
  },
  notifTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0f172a',
    flexShrink: 1,
    minWidth: 0,
  },
  notifTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flexShrink: 0,
  },
  notifTimeText: {
    fontSize: 10,
    color: '#94a3b8',
  },
  notifMessage: {
    fontSize: 12,
    color: '#475569',
    marginTop: 6,
    lineHeight: 18,
  },
  notifMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  refBadge: {
    fontSize: 10,
    fontWeight: '700',
    color: '#065f46',
    backgroundColor: '#d1fae5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    fontFamily: 'monospace',
    overflow: 'hidden',
  },
  tapToView: {
    fontSize: 10,
    fontWeight: '600',
    color: '#94a3b8',
  },
  footer: {
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    backgroundColor: '#f8fafc',
    alignItems: 'flex-end',
  },
  closeBtn: {
    width: '100%',
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
  },
  closeBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  pressed: {
    opacity: 0.7,
  },
});