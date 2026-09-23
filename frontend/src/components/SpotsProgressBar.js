import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../utils/colors';

const SpotsProgressBar = ({ bookedSpots = 1, totalSpots = 20 }) => {
  const remainingSpots = Math.max(0, totalSpots - bookedSpots);
  const percentage = Math.min(100, Math.max(0, (bookedSpots / totalSpots) * 100));

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <Text style={styles.icon}>👥</Text>
        <Text style={styles.spotsLeftText}>
          {remainingSpots > 0 ? `Only ${remainingSpots} spots left` : 'Spots Full'}
        </Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.bar, { width: `${percentage}%` }]} />
      </View>
      <Text style={styles.bookedText}>{`${bookedSpots} / ${totalSpots} Booked`}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    width: 140,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  icon: {
    fontSize: 12,
    marginRight: 4,
  },
  spotsLeftText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#007A78',
  },
  track: {
    width: '100%',
    height: 4,
    backgroundColor: '#D1EAEB',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 4,
  },
  bar: {
    height: '100%',
    backgroundColor: '#007A78',
    borderRadius: 2,
  },
  bookedText: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500',
  },
});

export default SpotsProgressBar;
