import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  StyleSheet,
  Platform,
} from 'react-native';
import { COLORS } from '../utils/colors';

const UPI_APPS = [
  { id: 'gpay', name: 'Google Pay', icon: '🟢' },
  { id: 'phonepe', name: 'PhonePe', icon: '🟣' },
  { id: 'paytm', name: 'Paytm UPI', icon: '🔵' },
  { id: 'bhim', name: 'BHIM UPI', icon: '🟠' },
];

const POPULAR_BANKS = ['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank'];

const ParticipationPaymentModal = ({
  visible,
  onClose,
  competition,
  user,
  onPaymentSuccess,
}) => {
  const [selectedMethod, setSelectedMethod] = useState('upi'); // 'upi' | 'card' | 'netbanking' | 'wallet'
  const [selectedUpiApp, setSelectedUpiApp] = useState('gpay');
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('4532 8901 2345 6789');
  const [cardExpiry, setCardExpiry] = useState('09/29');
  const [cardCvv, setCardCvv] = useState('789');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [selectedWallet, setSelectedWallet] = useState('Paytm');

  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [receipt, setReceipt] = useState(null);

  if (!competition) return null;

  const entryFee = competition.entryFee || 99;
  const prizePool = competition.prizePool || 1500;
  const username = user?.username || user?.name || 'Participant';
  const email = user?.email || `${username.toLowerCase().replace(/\s+/g, '')}@gmail.com`;

  const handlePay = () => {
    setIsProcessing(true);

    // Simulate secure payment gateway transaction (Razorpay / UPI)
    setTimeout(() => {
      const generatedReceipt = {
        txnId: 'TXN_FEED_' + Math.floor(100000 + Math.random() * 900000),
        orderId: 'ORD_' + Math.floor(10000000 + Math.random() * 90000000),
        amount: entryFee,
        method: selectedMethod.toUpperCase(),
        paidAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', ' + new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        competitionTitle: competition.title,
      };

      setIsProcessing(false);
      setIsSuccess(true);
      setReceipt(generatedReceipt);

      if (onPaymentSuccess) {
        onPaymentSuccess(competition, generatedReceipt);
      }
    }, 1200);
  };

  const handleResetAndClose = () => {
    setIsSuccess(false);
    setReceipt(null);
    setIsProcessing(false);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleResetAndClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.headerTitle}>
                {isSuccess ? 'Payment Successful' : 'Participation & Payment'}
              </Text>
              <Text style={styles.headerSub}>
                {isSuccess ? 'Spot Confirmed' : 'Feedants Secure Checkout • Razorpay'}
              </Text>
            </View>
            <TouchableOpacity onPress={handleResetAndClose} style={styles.closeBtn}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollArea}>
            {isSuccess ? (
              /* Success Screen */
              <View style={styles.successContainer}>
                <View style={styles.successIconCircle}>
                  <Text style={styles.successIcon}>✓</Text>
                </View>

                <Text style={styles.successTitle}>Participation Confirmed!</Text>
                <Text style={styles.successSubtitle}>
                  You are officially registered for <Text style={styles.boldText}>{competition.title}</Text>.
                </Text>

                {/* Receipt Card */}
                <View style={styles.receiptCard}>
                  <View style={styles.receiptRow}>
                    <Text style={styles.receiptKey}>Transaction ID</Text>
                    <Text style={styles.receiptValue}>{receipt?.txnId}</Text>
                  </View>
                  <View style={styles.receiptRow}>
                    <Text style={styles.receiptKey}>Order ID</Text>
                    <Text style={styles.receiptValue}>{receipt?.orderId}</Text>
                  </View>
                  <View style={styles.receiptRow}>
                    <Text style={styles.receiptKey}>Amount Paid</Text>
                    <Text style={styles.receiptPrice}>₹{receipt?.amount}.00</Text>
                  </View>
                  <View style={styles.receiptRow}>
                    <Text style={styles.receiptKey}>Payment Mode</Text>
                    <Text style={styles.receiptValue}>{receipt?.method}</Text>
                  </View>
                  <View style={styles.receiptRow}>
                    <Text style={styles.receiptKey}>Date & Time</Text>
                    <Text style={styles.receiptValue}>{receipt?.paidAt}</Text>
                  </View>
                  <View style={[styles.receiptRow, styles.receiptLastRow]}>
                    <Text style={styles.receiptKey}>Participant</Text>
                    <Text style={styles.receiptValue}>@{username}</Text>
                  </View>
                </View>

                {/* Next Steps Guide */}
                <View style={styles.nextStepsBox}>
                  <Text style={styles.nextStepsTitle}>📌 What to do next:</Text>
                  <Text style={styles.nextStepsItem}>
                    1. Prepare your entry according to the competition rules.
                  </Text>
                  <Text style={styles.nextStepsItem}>
                    2. Upload your performance before the submission deadline.
                  </Text>
                  <Text style={styles.nextStepsItem}>
                    3. Results will be evaluated by {competition.judge?.name || 'the judges'}.
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.doneBtn}
                  onPress={handleResetAndClose}
                  activeOpacity={0.85}
                >
                  <Text style={styles.doneBtnText}>Done • Go to Competition</Text>
                </TouchableOpacity>
              </View>
            ) : (
              /* Checkout & Payment Options */
              <View>
                {/* Competition Brief Banner */}
                <View style={styles.compBanner}>
                  <View style={styles.compBannerIcon}>
                    <Text style={styles.bannerTrophy}>🏆</Text>
                  </View>
                  <View style={styles.compBannerMeta}>
                    <Text style={styles.compBannerTitle}>{competition.title}</Text>
                    <Text style={styles.compBannerSub}>
                      Prize Pool: <Text style={styles.prizeHighlight}>₹{prizePool.toLocaleString()}</Text> • Fee: ₹{entryFee}
                    </Text>
                  </View>
                  <View style={styles.spotsBadge}>
                    <Text style={styles.spotsText}>
                      {(competition.totalSpots || 20) - (competition.bookedSpots || 1)} spots left
                    </Text>
                  </View>
                </View>

                {/* Participant Info */}
                <View style={styles.participantCard}>
                  <Text style={styles.sectionLabel}>Participant Details</Text>
                  <View style={styles.participantRow}>
                    <View style={styles.userInitialCircle}>
                      <Text style={styles.userInitial}>
                        {username.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                    <View style={styles.participantInfo}>
                      <Text style={styles.participantName}>{username}</Text>
                      <Text style={styles.participantEmail}>{email}</Text>
                    </View>
                    <View style={styles.verifiedTag}>
                      <Text style={styles.verifiedTagText}>✔ Verified</Text>
                    </View>
                  </View>
                </View>

                {/* Payment Methods Selection */}
                <Text style={styles.sectionLabel}>Select Payment Option</Text>
                <View style={styles.paymentMethodsRow}>
                  <TouchableOpacity
                    style={[
                      styles.methodTab,
                      selectedMethod === 'upi' && styles.methodTabActive,
                    ]}
                    onPress={() => setSelectedMethod('upi')}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.methodIcon}>📱</Text>
                    <Text
                      style={[
                        styles.methodLabel,
                        selectedMethod === 'upi' && styles.methodLabelActive,
                      ]}
                    >
                      UPI / QR
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.methodTab,
                      selectedMethod === 'card' && styles.methodTabActive,
                    ]}
                    onPress={() => setSelectedMethod('card')}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.methodIcon}>💳</Text>
                    <Text
                      style={[
                        styles.methodLabel,
                        selectedMethod === 'card' && styles.methodLabelActive,
                      ]}
                    >
                      Cards
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.methodTab,
                      selectedMethod === 'netbanking' && styles.methodTabActive,
                    ]}
                    onPress={() => setSelectedMethod('netbanking')}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.methodIcon}>🏦</Text>
                    <Text
                      style={[
                        styles.methodLabel,
                        selectedMethod === 'netbanking' && styles.methodLabelActive,
                      ]}
                    >
                      NetBanking
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.methodTab,
                      selectedMethod === 'wallet' && styles.methodTabActive,
                    ]}
                    onPress={() => setSelectedMethod('wallet')}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.methodIcon}>👛</Text>
                    <Text
                      style={[
                        styles.methodLabel,
                        selectedMethod === 'wallet' && styles.methodLabelActive,
                      ]}
                    >
                      Wallets
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Sub-view for selected method */}
                <View style={styles.methodDetailContainer}>
                  {selectedMethod === 'upi' && (
                    <View>
                      <Text style={styles.subLabel}>Choose UPI App:</Text>
                      <View style={styles.upiAppsGrid}>
                        {UPI_APPS.map((app) => (
                          <TouchableOpacity
                            key={app.id}
                            style={[
                              styles.upiAppBtn,
                              selectedUpiApp === app.id && styles.upiAppBtnActive,
                            ]}
                            onPress={() => setSelectedUpiApp(app.id)}
                            activeOpacity={0.7}
                          >
                            <Text style={styles.upiAppIcon}>{app.icon}</Text>
                            <Text
                              style={[
                                styles.upiAppName,
                                selectedUpiApp === app.id && styles.upiAppNameActive,
                              ]}
                            >
                              {app.name}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>

                      <Text style={[styles.subLabel, { marginTop: 12 }]}>Or Enter UPI ID:</Text>
                      <TextInput
                        style={styles.textInput}
                        placeholder="e.g. mobile@okhdfcbank"
                        placeholderTextColor="#94A3B8"
                        value={upiId}
                        onChangeText={setUpiId}
                      />
                    </View>
                  )}

                  {selectedMethod === 'card' && (
                    <View>
                      <Text style={styles.subLabel}>Card Number:</Text>
                      <TextInput
                        style={styles.textInput}
                        placeholder="16-digit card number"
                        placeholderTextColor="#94A3B8"
                        value={cardNumber}
                        onChangeText={setCardNumber}
                      />
                      <View style={styles.cardRow}>
                        <View style={{ flex: 1, marginRight: 8 }}>
                          <Text style={styles.subLabel}>Expiry (MM/YY):</Text>
                          <TextInput
                            style={styles.textInput}
                            placeholder="MM/YY"
                            placeholderTextColor="#94A3B8"
                            value={cardExpiry}
                            onChangeText={setCardExpiry}
                          />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.subLabel}>CVV:</Text>
                          <TextInput
                            style={styles.textInput}
                            placeholder="CVV"
                            placeholderTextColor="#94A3B8"
                            secureTextEntry
                            value={cardCvv}
                            onChangeText={setCardCvv}
                          />
                        </View>
                      </View>
                    </View>
                  )}

                  {selectedMethod === 'netbanking' && (
                    <View>
                      <Text style={styles.subLabel}>Popular Banks:</Text>
                      {POPULAR_BANKS.map((bank) => (
                        <TouchableOpacity
                          key={bank}
                          style={[
                            styles.bankRow,
                            selectedBank === bank && styles.bankRowActive,
                          ]}
                          onPress={() => setSelectedBank(bank)}
                          activeOpacity={0.7}
                        >
                          <Text style={styles.bankName}>{bank}</Text>
                          <View
                            style={[
                              styles.radioCircle,
                              selectedBank === bank && styles.radioCircleActive,
                            ]}
                          >
                            {selectedBank === bank && <View style={styles.radioDot} />}
                          </View>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}

                  {selectedMethod === 'wallet' && (
                    <View>
                      <Text style={styles.subLabel}>Select Wallet:</Text>
                      {['Paytm Wallet', 'Amazon Pay', 'PhonePe Wallet'].map((w) => (
                        <TouchableOpacity
                          key={w}
                          style={[
                            styles.bankRow,
                            selectedWallet === w && styles.bankRowActive,
                          ]}
                          onPress={() => setSelectedWallet(w)}
                          activeOpacity={0.7}
                        >
                          <Text style={styles.bankName}>{w}</Text>
                          <View
                            style={[
                              styles.radioCircle,
                              selectedWallet === w && styles.radioCircleActive,
                            ]}
                          >
                            {selectedWallet === w && <View style={styles.radioDot} />}
                          </View>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>

                {/* Price Breakdown */}
                <View style={styles.priceBreakdown}>
                  <View style={styles.priceRow}>
                    <Text style={styles.priceLabel}>Competition Entry Fee</Text>
                    <Text style={styles.priceVal}>₹{entryFee}.00</Text>
                  </View>
                  <View style={styles.priceRow}>
                    <Text style={styles.priceLabel}>Processing Fee & Platform Charges</Text>
                    <Text style={styles.freeGreen}>FREE (₹0.00)</Text>
                  </View>
                  <View style={styles.priceRow}>
                    <Text style={styles.priceLabel}>GST & Platform Tax</Text>
                    <Text style={styles.priceVal}>Included</Text>
                  </View>
                  <View style={[styles.priceRow, styles.totalRow]}>
                    <Text style={styles.totalLabel}>Total Payable</Text>
                    <Text style={styles.totalAmount}>₹{entryFee}.00</Text>
                  </View>
                </View>

                {/* Trust & Guarantee info */}
                <View style={styles.trustInfoRow}>
                  <Text style={styles.lockIcon}>🔒</Text>
                  <Text style={styles.trustText}>
                    256-Bit SSL Encrypted • 100% Refund Guarantee if cancelled
                  </Text>
                </View>

                {/* Pay Button */}
                <TouchableOpacity
                  style={[styles.payBtn, isProcessing && styles.payBtnDisabled]}
                  onPress={handlePay}
                  disabled={isProcessing}
                  activeOpacity={0.85}
                >
                  {isProcessing ? (
                    <View style={styles.processingRow}>
                      <ActivityIndicator color="#FFFFFF" size="small" />
                      <Text style={styles.payBtnText}>Processing Payment...</Text>
                    </View>
                  ) : (
                    <Text style={styles.payBtnText}>
                      Pay ₹{entryFee} & Confirm Participation
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    width: '100%',
    maxWidth: 520,
    maxHeight: '92%',
    padding: 22,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  headerSub: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 2,
  },
  closeBtn: {
    padding: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
  },
  closeText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '700',
  },
  scrollArea: {
    paddingTop: 14,
  },
  compBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDFA',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#CCFBF1',
    marginBottom: 14,
  },
  compBannerIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#CCFBF1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  bannerTrophy: {
    fontSize: 18,
  },
  compBannerMeta: {
    flex: 1,
  },
  compBannerTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 2,
  },
  compBannerSub: {
    fontSize: 11,
    color: '#475569',
  },
  prizeHighlight: {
    color: '#007A78',
    fontWeight: '700',
  },
  spotsBadge: {
    backgroundColor: '#E6F8F7',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#72D6CD',
  },
  spotsText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#007A78',
  },
  participantCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  participantRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userInitialCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primaryTeal,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  userInitial: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  participantInfo: {
    flex: 1,
  },
  participantName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  participantEmail: {
    fontSize: 11,
    color: '#64748B',
  },
  verifiedTag: {
    backgroundColor: '#ECFDF5',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  verifiedTagText: {
    color: '#059669',
    fontSize: 10.5,
    fontWeight: '700',
  },
  paymentMethodsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  methodTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: 10,
    marginHorizontal: 3,
  },
  methodTabActive: {
    borderColor: '#007A78',
    backgroundColor: '#FAFFFF',
    borderWidth: 2,
  },
  methodIcon: {
    fontSize: 18,
    marginBottom: 4,
  },
  methodLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  methodLabelActive: {
    color: '#007A78',
    fontWeight: '800',
  },
  methodDetailContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
  },
  subLabel: {
    fontSize: 11.5,
    color: '#475569',
    fontWeight: '600',
    marginBottom: 6,
  },
  upiAppsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  upiAppBtn: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    padding: 8,
    marginBottom: 8,
  },
  upiAppBtnActive: {
    borderColor: '#007A78',
    backgroundColor: '#F0FDFA',
    borderWidth: 2,
  },
  upiAppIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  upiAppName: {
    fontSize: 11.5,
    color: '#334155',
    fontWeight: '600',
  },
  upiAppNameActive: {
    color: '#007A78',
    fontWeight: '800',
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 13,
    color: '#0F172A',
  },
  cardRow: {
    flexDirection: 'row',
    marginTop: 8,
  },
  bankRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 6,
  },
  bankRowActive: {
    borderColor: '#007A78',
    backgroundColor: '#F0FDFA',
  },
  bankName: {
    fontSize: 12.5,
    color: '#1E293B',
    fontWeight: '600',
  },
  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#94A3B8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleActive: {
    borderColor: '#007A78',
  },
  radioDot: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: '#007A78',
  },
  priceBreakdown: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 12,
    marginBottom: 12,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  priceLabel: {
    fontSize: 11.5,
    color: '#64748B',
  },
  priceVal: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#0F172A',
  },
  freeGreen: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#059669',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    marginTop: 6,
    paddingTop: 8,
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  totalAmount: {
    fontSize: 17,
    fontWeight: '900',
    color: '#007A78',
  },
  trustInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  lockIcon: {
    fontSize: 13,
    marginRight: 6,
  },
  trustText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  payBtn: {
    backgroundColor: COLORS.primaryTeal,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#007A78',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  payBtnDisabled: {
    opacity: 0.7,
  },
  processingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  payBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    marginLeft: 8,
  },
  /* Success Styles */
  successContainer: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  successIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#ECFDF5',
    borderWidth: 2,
    borderColor: '#34D399',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  successIcon: {
    fontSize: 32,
    color: '#059669',
    fontWeight: '900',
  },
  successTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 6,
  },
  successSubtitle: {
    fontSize: 12.5,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 18,
  },
  boldText: {
    fontWeight: '700',
    color: '#0F172A',
  },
  receiptCard: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
    marginBottom: 16,
  },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  receiptLastRow: {
    borderBottomWidth: 0,
  },
  receiptKey: {
    fontSize: 11.5,
    color: '#64748B',
  },
  receiptValue: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#0F172A',
  },
  receiptPrice: {
    fontSize: 13,
    fontWeight: '800',
    color: '#007A78',
  },
  nextStepsBox: {
    width: '100%',
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: 12,
    padding: 12,
    marginBottom: 18,
  },
  nextStepsTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#92400E',
    marginBottom: 6,
  },
  nextStepsItem: {
    fontSize: 11.5,
    color: '#78350F',
    lineHeight: 17,
    marginBottom: 3,
  },
  doneBtn: {
    width: '100%',
    backgroundColor: '#007A78',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  doneBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});

export default ParticipationPaymentModal;
