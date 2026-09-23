import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const DEFAULT_REWARDS = [
  { position: 1, label: '1st Winner', amount: 550, icon: '🏆' },
  { position: 2, label: '2nd Winner', amount: 300, icon: '🥈' },
  { position: 3, label: '3rd Winner', amount: 240, icon: '🥉' },
  { position: 4, label: '4th Winner', amount: 200, icon: '⭐' },
  { position: 5, label: '5th Winner', amount: 130, icon: '⭐' },
  { position: 6, label: '6th Winner', amount: 80, icon: '⭐' },
];

const RewardsTable = ({ rewards = DEFAULT_REWARDS }) => {
  return (
    <View style={styles.card}>
      <View style={styles.titleRow}>
        <Text style={styles.sectionTitle}>Rewards</Text>
        <Text style={styles.subTitle}>(All Positions)</Text>
      </View>

      <View style={styles.list}>
        {rewards.map((reward, idx) => (
          <View key={idx} style={styles.rewardRow}>
            <View style={styles.leftCol}>
              <Text style={styles.icon}>{reward.icon || '⭐'}</Text>
              <Text style={styles.label}>{reward.label}</Text>
            </View>
            <Text style={styles.amount}>{`₹ ${reward.amount}`}</Text>
          </View>
        ))}
      </View>

      <View style={styles.disclaimerContainer}>
        <Text style={styles.infoIcon}>ⓘ</Text>
        <Text style={styles.disclaimerText}>
          Disclaimer: Only contributions from paid participants will be considered for judging.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#EFF2F5',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    marginRight: 6,
  },
  subTitle: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500',
  },
  list: {
    marginBottom: 14,
  },
  rewardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  leftCol: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    fontSize: 16,
    marginRight: 10,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1E293B',
  },
  amount: {
    fontSize: 14,
    fontWeight: '800',
    color: '#007A78',
  },
  disclaimerContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#EBF9F8',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#D4F4F1',
  },
  infoIcon: {
    fontSize: 12,
    color: '#007A78',
    fontWeight: '800',
    marginRight: 6,
    marginTop: 1,
  },
  disclaimerText: {
    flex: 1,
    fontSize: 11,
    lineHeight: 16,
    color: '#007A78',
    fontWeight: '600',
  },
});

export default RewardsTable;
