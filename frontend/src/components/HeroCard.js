import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../utils/colors';
import SpotsProgressBar from './SpotsProgressBar';

const HeroCard = ({
  title = 'Feedants Classical Dance',
  isRegistered = true,
  categories = ['Dance', 'Multi-Win'],
  highlight = 'Winners get certificate',
  prizePool = 1500,
  entryFee = 99,
  bookedSpots = 1,
  totalSpots = 20,
}) => {
  return (
    <View style={styles.card}>
      {/* Title & Registered Badge Row */}
      <View style={styles.headerRow}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
        {isRegistered ? (
          <View style={styles.registeredBadge}>
            <View style={styles.checkCircle}>
              <Text style={styles.checkIcon}>✓</Text>
            </View>
            <Text style={styles.registeredText}>Registered</Text>
          </View>
        ) : (
          <View style={styles.openBadge}>
            <View style={styles.openDot} />
            <Text style={styles.openBadgeText}>Registration Open</Text>
          </View>
        )}
      </View>

      {/* Tags Row */}
      <View style={styles.tagsRow}>
        {categories.map((cat, idx) => (
          <View key={idx} style={styles.tagPill}>
            <Text style={styles.tagText}>{cat}</Text>
          </View>
        ))}
        {highlight ? (
          <View style={styles.highlightContainer}>
            <Text style={styles.trophyIcon}>🏆</Text>
            <Text style={styles.highlightText}>{highlight}</Text>
          </View>
        ) : null}
      </View>

      {/* Metrics Row */}
      <View style={styles.metricsRow}>
        <View style={styles.metricCol}>
          <Text style={styles.metricLabel}>Prize Pool</Text>
          <Text style={styles.prizeValue}>{`₹ ${prizePool.toLocaleString()}`}</Text>
        </View>

        <View style={styles.metricCol}>
          <Text style={styles.metricLabel}>Entry Fee</Text>
          <Text style={styles.feeValue}>{`₹ ${entryFee}`}</Text>
        </View>

        <View style={styles.spotsCol}>
          <SpotsProgressBar bookedSpots={bookedSpots} totalSpots={totalSpots} />
        </View>
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
    marginTop: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#EFF2F5',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    marginRight: 10,
    lineHeight: 26,
  },
  registeredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EBF8F7',
    borderWidth: 1,
    borderColor: '#72D6CD',
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  checkCircle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#007A78',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 4,
  },
  checkIcon: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '900',
  },
  registeredText: {
    color: '#007A78',
    fontSize: 12,
    fontWeight: '700',
  },
  openBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  openDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D97706',
    marginRight: 5,
  },
  openBadgeText: {
    color: '#B45309',
    fontSize: 11.5,
    fontWeight: '700',
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: 16,
  },
  tagPill: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '600',
  },
  highlightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  trophyIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  highlightText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#007A78',
  },
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  metricCol: {
    justifyContent: 'center',
  },
  metricLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
    marginBottom: 4,
  },
  prizeValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#007A78',
  },
  feeValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
  },
  spotsCol: {
    justifyContent: 'center',
  },
});

export default HeroCard;
