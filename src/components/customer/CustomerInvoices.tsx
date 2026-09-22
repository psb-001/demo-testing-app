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
import { AppModal, Button } from '../../ui';
import {
  AppLanguage,
  mobileTranslations,
  getLocalizedTrade,
  getLocalizedTask
} from '../../data/mobileTranslations';

interface CustomerInvoicesProps {
  invoices: Invoice[];
  currentLang?: AppLanguage;
  onNavigateTab: (tab: string) => void;
}

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
      {/* Header */}
      <View style={styles.headerCard}>
        <View style={styles.headerRow}>
          <Receipt size={14} color="#93c5fd" />
          <Text style={styles.headerTag}>{t.customer.invoices.certifiedReceipts}</Text>
        </View>
        <Text style={styles.headerTitle}>{t.customer.invoices.headerTitle}</Text>
        <Text style={styles.headerDesc}>{t.customer.invoices.headerDesc}</Text>
      </View>

      {/* Invoice List */}
      <View style={styles.invoiceList}>
        {invoices.length === 0 ? (
          <View style={styles.emptyCard}>
            <FileText size={32} color="#cbd5e1" />
            <Text style={styles.emptyTitle}>{t.customer.invoices.emptyTitle}</Text>
            <Text style={styles.emptyDesc}>{t.customer.invoices.emptyDesc}</Text>
          </View>
        ) : (
          invoices.map((inv) => {
            const isPaid = inv.paymentStatus === 'paid';

            return (
              <View key={inv.id} style={styles.invoiceCard}>
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
                      <IndianRupee size={14} color="#0f172a" />
                      <Text style={styles.invoiceAmount}>{inv.totalAmount}</Text>
                    </View>
                    <View style={[styles.paymentPill, { backgroundColor: isPaid ? '#d1fae5' : '#fef3c7' }]}>
                      <Text style={[styles.paymentPillText, { color: isPaid ? '#065f46' : '#92400e' }, styles.capitalize]}>
                        {inv.paymentStatus}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Co-op Fee Breakdown Strip */}
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

                {/* Action button */}
                <Pressable
                  onPress={() => setSelectedInvoice(inv)}
                  style={({ pressed }) => [styles.viewBtn, pressed && styles.pressed]}
                >
                  <FileText size={14} color="#1e40af" />
                  <Text style={styles.viewBtnText}>{t.customer.invoices.viewInvoiceBtn}</Text>
                </Pressable>
              </View>
            );
          })
        )}
      </View>

      {/* Invoice Detail Modal */}
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
        {/* Cooperative Society Details */}
        <View style={styles.coopBox}>
          <Text style={styles.coopName}>{selectedInvoice?.coopName}</Text>
          <Text style={styles.coopReg}>Govt Society Reg # MH-PUN-COOP-2022-8491</Text>
          {selectedInvoice?.gstRegistration && (
            <Text style={styles.coopGst}>GSTIN: {selectedInvoice.gstRegistration}</Text>
          )}
        </View>

        {/* Bill To & Worker Details */}
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

        {/* Itemized Line Items */}
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

        {/* Payment Meta */}
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

        {/* Buttons */}
        <View style={styles.modalBtns}>
          <Button
            color="#2563eb"
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
    gap: 16,
    paddingBottom: 80,
  },
  pressed: {
    opacity: 0.85,
  },
  headerCard: {
    backgroundColor: '#1e3a8a',
    borderRadius: 16,
    padding: 16,
    gap: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  headerTag: {
    fontSize: 10,
    fontWeight: '700',
    color: '#93c5fd',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#ffffff',
  },
  headerDesc: {
    fontSize: 12,
    color: '#bfdbfe',
  },
  invoiceList: {
    gap: 12,
  },
  emptyCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    padding: 32,
    alignItems: 'center',
    gap: 8,
  },
  emptyTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },
  emptyDesc: {
    fontSize: 11,
    color: '#94a3b8',
  },
  invoiceCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(226,232,240,0.8)',
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    gap: 12,
  },
  invoiceTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  invoiceLeft: {
    flex: 1,
    minWidth: 0,
    paddingRight: 8,
  },
  invoiceNumber: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  invoiceTask: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
    marginTop: 2,
  },
  invoiceService: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
  invoiceWorker: {
    fontWeight: '700',
    color: '#1e293b',
  },
  invoiceRight: {
    alignItems: 'flex-end',
  },
  invoiceAmountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  invoiceAmount: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0f172a',
  },
  paymentPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    marginTop: 4,
  },
  paymentPillText: {
    fontSize: 10,
    fontWeight: '700',
  },
  capitalize: {
    textTransform: 'capitalize',
  },
  breakdownStrip: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    gap: 6,
  },
  breakdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  breakdownRowBordered: {
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: 'rgba(226,232,240,0.6)',
  },
  breakdownLabel: {
    fontSize: 11,
    color: '#475569',
  },
  breakdownPayout: {
    fontSize: 11,
    fontWeight: '700',
    color: '#047857',
  },
  breakdownWelfare: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0f766e',
  },
  breakdownZero: {
    fontSize: 11,
    fontWeight: '700',
    color: '#065f46',
  },
  viewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    backgroundColor: '#eff6ff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  viewBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1e40af',
  },
  coopBox: {
    backgroundColor: 'rgba(236,253,245,0.8)',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(167,243,208,0.6)',
    gap: 4,
    marginBottom: 12,
  },
  coopName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#022c22',
  },
  coopReg: {
    fontSize: 11,
    color: '#065f46',
  },
  coopGst: {
    fontSize: 10,
    color: '#047857',
  },
  billGrid: {
    flexDirection: 'row',
    gap: 8,
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    marginBottom: 12,
  },
  billGridItem: {
    flex: 1,
    minWidth: 0,
  },
  billLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94a3b8',
    textTransform: 'uppercase',
  },
  billValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1e293b',
  },
  billSub: {
    fontSize: 10,
    color: '#64748b',
  },
  lineItems: {
    gap: 8,
    marginBottom: 12,
  },
  lineItemsTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1e293b',
  },
  lineItemsBox: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 12,
    gap: 6,
  },
  lineItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  lineItemLabel: {
    fontSize: 12,
    color: '#334155',
    flexShrink: 1,
  },
  lineItemValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0f172a',
  },
  lineItemLabelDim: {
    fontSize: 12,
    color: '#64748b',
  },
  lineItemValueDim: {
    fontSize: 12,
    color: '#64748b',
  },
  lineItemLabelTiny: {
    fontSize: 11,
    color: '#64748b',
  },
  lineItemValueTiny: {
    fontSize: 11,
    color: '#64748b',
  },
  lineItemZeroTiny: {
    fontSize: 11,
    fontWeight: '700',
    color: '#047857',
  },
  lineItemTotalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  lineItemTotalLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0f172a',
  },
  lineItemTotalValue: {
    fontSize: 14,
    fontWeight: '800',
    color: '#047857',
  },
  paymentMeta: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    gap: 4,
    marginBottom: 12,
  },
  paymentMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  paymentMetaLabel: {
    fontSize: 11,
    color: '#64748b',
  },
  paymentMetaValue: {
    fontSize: 11,
    fontWeight: '700',
    color: '#334155',
  },
  modalBtns: {
    flexDirection: 'row',
    gap: 8,
  },
  modalBtnFlex: {
    flex: 1,
  },
  closeBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
});