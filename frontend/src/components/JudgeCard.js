import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../utils/colors';

const JudgeCard = ({
  name = 'Manju Dubey',
  title = 'Professional Kathak Dancer',
  experience = '12+ Years of Experience',
  avatarUrl = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=256',
  onPlayIntro,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.leftContainer}>
        <Image
          source={{ uri: avatarUrl }}
          style={styles.avatar}
          defaultSource={{ uri: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=256' }}
        />
        <View style={styles.infoCol}>
          <Text style={styles.judgeLabel}>Judge</Text>
          <Text style={styles.judgeName}>{name}</Text>
          <Text style={styles.judgeTitle}>{title}</Text>
          <Text style={styles.judgeExp}>{experience}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.introButton}
        onPress={onPlayIntro}
        activeOpacity={0.7}
      >
        <View style={styles.playCircle}>
          <Text style={styles.playIcon}>▶</Text>
        </View>
        <Text style={styles.introText}>Intro Video</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#EFF2F5',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 62,
    height: 62,
    borderRadius: 31,
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#F3F4F6',
    backgroundColor: '#E5E7EB',
  },
  infoCol: {
    flex: 1,
  },
  judgeLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  judgeName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 2,
  },
  judgeTitle: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
    marginBottom: 1,
  },
  judgeExp: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '500',
  },
  introButton: {
    alignItems: 'center',
    paddingLeft: 8,
  },
  playCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E6F8F7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  playIcon: {
    color: '#007A78',
    fontSize: 14,
    marginLeft: 2,
  },
  introText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
});

export default JudgeCard;
