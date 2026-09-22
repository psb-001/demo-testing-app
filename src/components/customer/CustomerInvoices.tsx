import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import { Invoice } from '../../types';
import {
  FileText,
  IndianRupee,
  Receipt
} from 'lucide-react-native';
import { AppModal, Badge, Button, Card, Title, Subtitle, EmptyState } from '../../ui';
import {
  AppLanguage,
  mobileTranslations,
  getLocalizedTrade,
  getLocalizedTask
} from '../../data/mobileTranslations';
import { colors, radius, spacing, fontSize, roleAccent, cardShadow } from '../../theme';

interface CustomerInvoicesProps {
  invoices: Invoice[];
  currentLang?: AppLanguage;
  onNavigateTab: (tab: string) => void;
}

const accent = roleAccent.customer;

export const CustomerInvoices: React.FC<CustomerInvoicesProps> = ({
  invoices,
  currentLang = 'en',
}) => {
  const t = mobileTranslations[currentLang];
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const isWeb = Platform.OS === 'web';

  useEffect(() => {
    if (!isWeb) return;
    const handleKeyDown = (e: { key: string }) => {
      if (e.key === 'Escape') setSelectedInvoice(null);
    };
    const g = globalThis as any;
    g.window.addEventListener('keydown', handleKeyDown);
    return () => g.window.removeEventListener('keydown', handleKeyDown);
  }, [isWeb]);

  return (
    <View style={styles.root}>
      <Card style={styles.headerCard}>
        <View style={styles.headerRow}>
          <Receipt size={14} color={accent} />
          <Badge color={accent} bg={colors.blueLight}>
            {t.customer.invoices.certifiedReceipts}
          </Badge>
        </View>
        <Title style={styles.headerTitle}>{t.customer.invoices.headerTitle}</Title>
        <Subtitle>{t.customer.invoices.headerDesc}</Subtitle>
      </Card>

      <View style={styles.invoiceList}>
        {invoices.length === 0 ? (
          <Card>
            <EmptyState
              icon={<FileText size={32} color={colors.slate300} />}
              title={t.customer.invoices.emptyTitle}
              description={t.customer.invoices.emptyDesc}
            />
          </Card>
        ) : (
          invoices.map((inv) => {
            const isPaid = inv.paymentStatus === 'paid';

            return (
              <Card key={inv.id} style={styles.invoiceCard}>
                <View style={styles.invoiceTop}>
                  <View style={styles.invoiceLeft}>
                    <Text style={styles.invoiceNumber}>{inv.invoiceNumber}</Text>
                    <Text style={styles.invoiceTask}>{getLocalizedTask(inv.taskDescription, currentLang)}</Text>
                    <Text style={styles.invoiceService}>
                      {t.customer.invoices.serviceBy}{' '}
                      <Text style={styles.invoiceWorker}>{inv.workerName}</Text>{' '}
                      ({getLocalizedTrade(inv.workerTrade, currentLang)})
                    </Text>
                  </View>

                  <View style={styles.invoiceRight}>
                    <View style={styles.invoiceAmountRow}>
                      <IndianRupee size={14} color={colors.textPrimary} />
                      <Text style={styles.invoiceAmount}>{inv.totalAmount}</Text>
                    </View>
                    <Badge
                      color={isPaid ? colors.successFg : colors.warningFg}
                      bg={isPaid ? colors.successLight : colors.warningLight}
                    >
                      {inv.paymentStatus}
                    </Badge>
                  </View>
                </View>

                <View style={styles.breakdownStrip}>
                  <View style={styles.breakdownRow}>
                    <Text style={styles.breakdownLabel}>{t.customer.invoices.workerPayout}</Text>
                    <Text style={styles.breakdownPayout}>₹{inv.workerPayout}</Text>
                  </View>
                  <View style={styles.breakdownRow}>
                    <Text style={styles.breakdownLabel}>{t.customer.invoices.welfareFund}</Text>
                    <Text style={styles.breakdownWelfare}>₹{inv.coopWelfareFund}</Text>
                  </View>
                  <View style={[styles.breakdownRow, styles.breakdownRowBordered]}>
                    <Text style={styles.breakdownLabel}>{t.customer.invoices.platformFee}</Text>
                    <Text style={styles.breakdownZero}>
                      ₹0 ({t.customer.invoices.zeroExtortion})
                    </Text>
                  </View>
                </View>

                <Button
                  variant="soft"
                  color={accent}
                  block
                  onPress={() => setSelectedInvoice(inv)}
                >
                  {t.customer.invoices.viewInvoiceBtn}
                </Button>
              </Card>
            );
          })
        )}
      </View>

      <AppModal
        visible={!!selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
        title={t.customer.invoices.modalTitle}
        subtitle={
          selectedInvoice
            ? `${selectedInvoice.invoiceNumber} • Date: ${selectedInvoice.date}`
            : ''
        }
      >
        <View style={styles.coopBox}>
          <Text style={styles.coopName}>{selectedInvoice?.coopName}</Text>
          <Text style={styles.coopReg}>Govt Society Reg # MH-PUN-COOP-2022-8491</Text>
          {selectedInvoice?.gstRegistration && (
            <Text style={styles.coopGst}>GSTIN: {selectedInvoice.gstRegistration}</Text>
          )}
        </View>

        <View style={styles.billGrid}>
          <View style={styles.billGridItem}>
            <Text style={styles.billLabel}>{t.customer.invoices.billedTo}:</Text>
            <Text style={styles.billValue}>{selectedInvoice?.customerName}</Text>
            <Text style={styles.billSub}>{t.customer.invoices.residentClient}</Text>
          </View>
          <View style={styles.billGridItem}>
            <Text style={styles.billLabel}>{t.customer.invoices.provider}:</Text>
            <Text style={styles.billValue}>{selectedInvoice?.workerName}</Text>
            <Text style={styles.billSub}>
              {selectedInvoice ? getLocalizedTrade(selectedInvoice.workerTrade, currentLang) : ''}
            </Text>
          </View>
        </View>

        <View style={styles.lineItems}>
          <Text style={styles.lineItemsTitle}>{t.customer.invoices.serviceParticulars}</Text>
          <View style={styles.lineItemsBox}>
            <View style={styles.lineItemRow}>
              <Text style={styles.lineItemLabel}>
                {selectedInvoice ? getLocalizedTask(selectedInvoice.taskDescription, currentLang) : ''}
              </Text>
              <Text style={styles.lineItemValue}>₹{selectedInvoice?.baseFee}</Text>
            </View>
            {!!selectedInvoice && selectedInvoice.materialCost > 0 && (
              <View style={styles.lineItemRow}>
                <Text style={styles.lineItemLabelDim}>{t.customer.invoices.spareParts}</Text>
                <Text style={styles.lineItemValueDim}>₹{selectedInvoice.materialCost}</Text>
              </View>
            )}
            <View style={styles.lineItemRow}>
              <Text style={styles.lineItemLabelTiny}>{t.customer.invoices.platformCommission}</Text>
              <Text style={styles.lineItemZeroTiny}>
                ₹0.00 ({t.customer.invoices.zeroExtortion})
              </Text>
            </View>
            <View style={styles.lineItemRow}>
              <Text style={styles.lineItemLabelTiny}>{t.customer.invoices.socialWelfarePool}</Text>
              <Text style={styles.lineItemValueTiny}>₹{selectedInvoice?.coopWelfareFund}</Text>
            </View>
            <View style={styles.lineItemTotalRow}>
              <Text style={styles.lineItemTotalLabel}>{t.customer.invoices.totalAmountPaid}</Text>
              <Text style={styles.lineItemTotalValue}>₹{selectedInvoice?.totalAmount}</Text>
            </View>
          </View>
        </View>

        <View style={styles.paymentMeta}>
          <View style={styles.paymentMetaRow}>
            <Text style={styles.paymentMetaLabel}>{t.customer.invoices.paymentMode}:</Text>
            <Text style={styles.paymentMetaValue}>{selectedInvoice?.paymentMethod}</Text>
          </View>
          <View style={styles.paymentMetaRow}>
            <Text style={styles.paymentMetaLabel}>{t.customer.invoices.refId}:</Text>
            <Text style={styles.paymentMetaValue}>{selectedInvoice?.transactionRef}</Text>
          </View>
        </View>

        <View style={styles.modalBtns}>
          <Button
            color={accent}
            style={styles.modalBtnFlex}
            onPress={() => {
              if (!selectedInvoice) return;
              Alert.alert(`${t.customer.invoices.downloadSuccess}: ${selectedInvoice.invoiceNumber}`);
              setSelectedInvoice(null);
            }}
          >
            {t.customer.invoices.downloadPdf}
          </Button>
          <Pressable
            onPress={() => setSelectedInvoice(null)}
            style={({ pressed }) => [styles.closeBtn, pressed && styles.pressed]}
          >
            <Text style={styles.closeBtnText}>{t.customer.invoices.closeBtn}</Text>
          </Pressable>
        </View>
      </AppModal>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    gap: spacing.lg,
  },
  pressed: {
    opacity: 0.85,
  },
  headerCard: {
    gap: spacing.xs,
    borderLeftWidth: 3,
    borderLeftColor: accent,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  headerTitle: {
    fontSize: fontSize.lg,
  },
  invoiceList: {
    gap: spacing.md,
  },
  invoiceCard: {
    gap: spacing.md,
  },
  invoiceTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  invoiceLeft: {
    flex: 1,
    minWidth: 0,
    paddingRight: spacing.sm,
  },
  invoiceNumber: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  invoiceTask: {
    fontSize: fontSize.sm,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 2,
  },
  invoiceService: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  invoiceWorker: {
    fontWeight: '700',
    color: colors.slate800,
  },
  invoiceRight: {
    alignItems: 'flex-end',
    gap: spacing.xs,
  },
  invoiceAmountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  invoiceAmount: {
    fontSize: fontSize.sm,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  breakdownStrip: {
    backgroundColor: colors.slate50,
    borderRadius: radius.control,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 6,
  },
  breakdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  breakdownRowBordered: {
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  breakdownLabel: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
  breakdownPayout: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    color: colors.emeraldDark,
  },
  breakdownWelfare: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    color: colors.emeraldDark,
  },
  breakdownZero: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    color: colors.successFg,
  },
  coopBox: {
    backgroundColor: colors.successLight,
    borderRadius: radius.control,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  coopName: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  coopReg: {
    fontSize: fontSize.xs,
    color: colors.successFg,
  },
  coopGst: {
    fontSize: fontSize.xs,
    color: colors.emeraldDark,
  },
  billGrid: {
    flexDirection: 'row',
    gap: spacing.sm,
    backgroundColor: colors.slate50,
    padding: spacing.md,
    borderRadius: radius.control,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  billGridItem: {
    flex: 1,
    minWidth: 0,
  },
  billLabel: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
  },
  billValue: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    color: colors.slate800,
    marginTop: 2,
  },
  billSub: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
  lineItems: {
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  lineItemsTitle: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    color: colors.slate800,
  },
  lineItemsBox: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.control,
    padding: spacing.md,
    gap: 6,
  },
  lineItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  lineItemLabel: {
    fontSize: fontSize.xs,
    color: colors.slate700,
    flexShrink: 1,
  },
  lineItemValue: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  lineItemLabelDim: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
  lineItemValueDim: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
  lineItemLabelTiny: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
  lineItemValueTiny: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
  lineItemZeroTiny: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    color: colors.emeraldDark,
  },
  lineItemTotalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  lineItemTotalLabel: {
    fontSize: fontSize.sm,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  lineItemTotalValue: {
    fontSize: fontSize.sm,
    fontWeight: '800',
    color: colors.emeraldDark,
  },
  paymentMeta: {
    backgroundColor: colors.slate50,
    borderRadius: radius.control,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  paymentMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  paymentMetaLabel: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
  paymentMetaValue: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    color: colors.slate700,
  },
  modalBtns: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  modalBtnFlex: {
    flex: 1,
  },
  closeBtn: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colors.slate100,
    borderRadius: radius.control,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  closeBtnText: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    color: colors.slate700,
  },
});
