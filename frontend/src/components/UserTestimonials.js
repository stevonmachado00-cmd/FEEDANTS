import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const UserTestimonials = ({ onPress }) => {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.leftCol}>
        <View style={styles.iconCircle}>
          <Text style={styles.chatIcon}>💬</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Hear From Our Users</Text>
          <Text style={styles.subTitle}>See what participants say about Feedants</Text>
        </View>
      </View>

      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#EFF2F5',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  leftCol: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  chatIcon: {
    fontSize: 16,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 2,
  },
  subTitle: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  chevron: {
    fontSize: 20,
    color: '#94A3B8',
    fontWeight: '700',
    paddingLeft: 8,
  },
});

export default UserTestimonials;
