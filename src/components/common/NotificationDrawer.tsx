import React, { useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import {
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
import { AppModal, Badge, EmptyState, PrimaryButton } from '../../ui';
import { colors, radius, spacing, fontSize, cardShadow } from '../../theme';

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

  const typeIcon = (n: AppNotification) => {
    if (n.type === 'payment_received' || n.type === 'invoice_issued') {
      return <Receipt size={14} color={colors.success} />;
    }
    if (n.type === 'dispute_opened' || n.type === 'dispute_resolved') {
      return <ShieldAlert size={14} color={colors.error} />;
    }
    if (n.type === 'review_received') {
      return <Star size={14} color={colors.amber} fill={colors.amber} />;
    }
    return <Briefcase size={14} color={colors.blue} />;
  };

  return (
    <AppModal
      visible={isOpen}
      onClose={onClose}
      title={t.notifications.title}
      subtitle={t.notifications.updates.replace('{role}', t.roles[currentRole])}
    >
      <View style={styles.body}>
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
              <CheckCheck size={14} color={colors.emeraldDark} />
              <Text style={styles.markAllText}>{t.notifications.markAllRead}</Text>
            </Pressable>
          )}
        </View>

        {roleNotifs.length === 0 ? (
          <EmptyState
            icon={<Bell size={24} color={colors.textMuted} />}
            title={t.notifications.emptyText}
          />
        ) : (
          <View style={styles.list}>
            {roleNotifs.map((n) => {
              const localized = getLocalizedNotification(n);
              return (
                <Pressable
                  key={n.id}
                  onPress={() => {
                    onNotificationClick(n);
                  }}
                  style={({ pressed }) => [
                    styles.notifCard,
                    !n.isRead && styles.notifCardUnread,
                    pressed && styles.pressed,
                  ]}
                >
                  <View style={styles.notifCardTop}>
                    <View style={styles.notifTitleRow}>
                      {!n.isRead && <View style={styles.unreadDot} />}
                      {typeIcon(n)}
                      <Text style={styles.notifTitle} numberOfLines={1}>
                        {localized.title}
                      </Text>
                    </View>
                    <View style={styles.notifTime}>
                      <Clock size={12} color={colors.textMuted} />
                      <Text style={styles.notifTimeText}>{n.timestamp}</Text>
                    </View>
                  </View>

                  <Text style={styles.notifMessage}>{localized.message}</Text>

                  <View style={styles.notifMeta}>
                    {n.bookingId && (
                      <Badge color={colors.successFg} bg={colors.successLight}>
                        Ref #{n.bookingId.slice(-6).toUpperCase()}
                      </Badge>
                    )}
                    <Text style={styles.tapToView}>
                      {t.notifications.tapToView} →
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        )}

        <PrimaryButton
          label={t.common.close}
          variant="outline"
          color={colors.slate700}
          onPress={onClose}
        />
      </View>
    </AppModal>
  );
};

const styles = StyleSheet.create({
  body: {
    gap: spacing.md,
  },
  actionsBar: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.slate50,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.card,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actionsText: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  markAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    minHeight: 32,
  },
  markAllText: {
    color: colors.emeraldDark,
    fontWeight: '700',
    fontSize: fontSize.xs,
  },
  list: {
    gap: spacing.sm,
  },
  notifCard: {
    padding: spacing.md,
    borderRadius: radius.card,
    borderWidth: 1,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    ...cardShadow,
  },
  notifCardUnread: {
    backgroundColor: colors.successLight,
    borderColor: colors.success,
  },
  pressed: {
    opacity: 0.85,
  },
  notifCardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.sm,
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
    backgroundColor: colors.success,
  },
  notifTitle: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    color: colors.textPrimary,
    flexShrink: 1,
    minWidth: 0,
  },
  notifTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    flexShrink: 0,
  },
  notifTimeText: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
  },
  notifMessage: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: 6,
    lineHeight: 20,
  },
  notifMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  tapToView: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    color: colors.textMuted,
  },
});
