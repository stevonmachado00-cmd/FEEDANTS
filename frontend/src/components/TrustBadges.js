import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const TrustBadges = ({ onWatchPrizeVideo, onOpenRefundPolicy }) => {
  return (
    <View style={styles.container}>
      {/* Left Card: Prize Money Video */}
      <TouchableOpacity
        style={styles.cardLeft}
        onPress={onWatchPrizeVideo}
        activeOpacity={0.7}
      >
        <View style={styles.playBox}>
          <Text style={styles.playIcon}>▶</Text>
        </View>
        <View style={styles.textBox}>
          <Text style={styles.mainTitle}>How will you receive prize money?</Text>
          <Text style={styles.subTitle}>Watch video to know more</Text>
        </View>
      </TouchableOpacity>

      {/* Right Card: Security & Razorpay */}
      <View style={styles.cardRight}>
        <TouchableOpacity
          style={styles.rightRow}
          onPress={onOpenRefundPolicy}
          activeOpacity={0.7}
        >
          <Text style={styles.shieldIcon}>🛡️</Text>
          <Text style={styles.refundText}>Refund policy</Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        <View style={styles.rightRow}>
          <Text style={styles.shieldIcon}>🛡️</Text>
          <View style={styles.payTextCol}>
            <Text style={styles.secureText}>Secure payments powered by</Text>
            <Text style={styles.razorpayBrand}>Razorpay</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 14,
  },
  cardLeft: {
    flex: 1.1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 10,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#EFF2F5',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  playBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#C5F0E8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  playIcon: {
    color: '#007A78',
    fontSize: 14,
    marginLeft: 1,
  },
  textBox: {
    flex: 1,
  },
  mainTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 15,
    marginBottom: 2,
  },
  subTitle: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '500',
  },
  cardRight: {
    flex: 1.1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 10,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#EFF2F5',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  rightRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shieldIcon: {
    fontSize: 13,
    marginRight: 6,
  },
  refundText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1E293B',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 6,
  },
  payTextCol: {
    flex: 1,
  },
  secureText: {
    fontSize: 9.5,
    color: '#64748B',
    fontWeight: '500',
  },
  razorpayBrand: {
    fontSize: 12,
    fontWeight: '900',
    fontStyle: 'italic',
    color: '#0C2340',
    letterSpacing: -0.2,
  },
});

export default TrustBadges;
