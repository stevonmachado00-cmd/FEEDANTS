import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../utils/colors';
import useCountdown from '../hooks/useCountdown';

const CountdownBanner = ({ targetDate }) => {
  // If targetDate not passed, default to 1 day, 6 hours from now
  const fallbackDate = React.useMemo(() => {
    return new Date(Date.now() + (1 * 24 + 6) * 3600 * 1000 + 28 * 60 * 1000 + 32 * 1000);
  }, []);

  const { days, hours, minutes, seconds, isExpired } = useCountdown(targetDate || fallbackDate);

  const padZero = (n) => String(n).padStart(2, '0');

  return (
    <View style={styles.banner}>
      <View style={styles.leftRow}>
        <Text style={styles.hourglassIcon}>⏳</Text>
        <Text style={styles.labelText}>Registration closes in</Text>
      </View>

      <Text style={styles.timerDigits}>
        {isExpired ? 'Closed' : `${padZero(days)}d : ${padZero(hours)}h : ${padZero(minutes)}m : ${padZero(seconds)}s`}
      </Text>

      <View style={styles.rightRow}>
        <Text style={styles.stopwatchIcon}>⏱</Text>
        <Text style={styles.hurryText}>Hurry up!</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#EBF9F8',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#BFEFEA',
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginHorizontal: 16,
    marginBottom: 14,
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hourglassIcon: {
    fontSize: 13,
    marginRight: 4,
  },
  labelText: {
    fontSize: 11,
    color: '#0F172A',
    fontWeight: '700',
  },
  timerDigits: {
    fontSize: 13,
    fontWeight: '800',
    color: '#007A78',
    letterSpacing: 0.2,
  },
  rightRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stopwatchIcon: {
    fontSize: 12,
    marginRight: 3,
  },
  hurryText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#007A78',
  },
});

export default CountdownBanner;
