import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';

const RefundPolicyModal = ({ visible, onClose }) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <Text style={styles.headerIcon}>🛡️</Text>
              <View>
                <Text style={styles.headerTitle}>100% Refund & Fair Play Policy</Text>
                <Text style={styles.headerSub}>RBI Regulated • Razorpay Escrow Protection</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Guarantee Highlights Grid */}
          <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollArea}>
            <View style={styles.highlightCard}>
              <Text style={styles.cardIcon}>⚡</Text>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>Automatic Rescheduling / Cancellation Refund</Text>
                <Text style={styles.cardBody}>
                  If any competition is postponed by more than 7 days or cancelled due to unforeseen circumstances, 100% of your paid entry fee is credited back to your original source (UPI / Card / NetBanking) within 24 to 48 hours without any deduction.
                </Text>
              </View>
            </View>

            <View style={styles.highlightCard}>
              <Text style={styles.cardIcon}>🎟️</Text>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>Pre-Submission Spot Withdrawal</Text>
                <Text style={styles.cardBody}>
                  If you are unable to prepare or participate, you can cancel your registration spot up to 48 hours prior to the submission deadline for a full 100% entry fee credit.
                </Text>
              </View>
            </View>

            <View style={styles.highlightCard}>
              <Text style={styles.cardIcon}>🔒</Text>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>Razorpay Escrow & Trust Lock</Text>
                <Text style={styles.cardBody}>
                  Feedants does not distribute prize pools until submissions are closed and evaluated. All funds are secured in compliance with RBI guidelines for skill-based tournaments.
                </Text>
              </View>
            </View>

            <View style={styles.highlightCard}>
              <Text style={styles.cardIcon}>⚖️</Text>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>Independent & Certified Judging</Text>
                <Text style={styles.cardBody}>
                  Every entry is judged on published objective parameters. Full scorecards and feedback remarks from certified judges are released transparently on the Result Date.
                </Text>
              </View>
            </View>

            {/* Support Note */}
            <View style={styles.supportBox}>
              <Text style={styles.supportIcon}>💬</Text>
              <Text style={styles.supportText}>
                Need assistance with a transaction? Reach our 24/7 participant desk at{' '}
                <Text style={styles.supportEmail}>support@feedants.com</Text>.
              </Text>
            </View>
          </ScrollView>

          {/* Close Button */}
          <TouchableOpacity style={styles.doneBtn} onPress={onClose} activeOpacity={0.85}>
            <Text style={styles.doneBtnText}>Understood & Agree</Text>
          </TouchableOpacity>
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
    maxWidth: 540,
    maxHeight: '90%',
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
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  headerSub: {
    fontSize: 11,
    color: '#007A78',
    fontWeight: '700',
    marginTop: 2,
  },
  closeBtn: {
    padding: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
  },
  closeText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '700',
  },
  scrollArea: {
    flexGrow: 0,
    marginBottom: 14,
  },
  highlightCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cardIcon: {
    fontSize: 18,
    marginRight: 10,
    marginTop: 2,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 3,
  },
  cardBody: {
    fontSize: 11.5,
    color: '#475569',
    lineHeight: 16,
  },
  supportBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDFA',
    borderWidth: 1,
    borderColor: '#CCFBF1',
    borderRadius: 12,
    padding: 10,
    marginTop: 4,
    marginBottom: 6,
  },
  supportIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  supportText: {
    flex: 1,
    fontSize: 11,
    color: '#007A78',
    fontWeight: '600',
    lineHeight: 15,
  },
  supportEmail: {
    fontWeight: '800',
    textDecorationLine: 'underline',
  },
  doneBtn: {
    backgroundColor: '#007A78',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  doneBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
});

export default RefundPolicyModal;
