import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { COLORS } from '../utils/colors';

const BottomNavBar = ({ activeTab = 'Competitions', onTabPress }) => {
  const tabs = [
    { key: 'Home', label: 'Home', icon: '🏠' },
    { key: 'Competitions', label: 'Competitions', icon: '🏆' },
    { key: 'Profile', label: 'Profile', isAvatar: true },
  ];

  return (
    <View style={styles.navBar}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;

        if (tab.isAvatar) {
          return (
            <TouchableOpacity
              key="Profile"
              style={styles.tabItem}
              onPress={() => onTabPress && onTabPress('Profile')}
              activeOpacity={0.7}
            >
              <Image
                source={{
                  uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120',
                }}
                style={[styles.profileAvatar, isActive && styles.avatarActive]}
              />
              <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                Profile
              </Text>
            </TouchableOpacity>
          );
        }

        return (
          <TouchableOpacity
            key={tab.key}
            style={styles.tabItem}
            onPress={() => onTabPress && onTabPress(tab.key)}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabIcon, isActive && styles.tabIconActive]}>
              {tab.icon}
            </Text>
            <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#EFF2F5',
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  tabIcon: {
    fontSize: 18,
    color: '#94A3B8',
    marginBottom: 2,
  },
  tabIconActive: {
    color: '#007A78',
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
  },
  tabLabelActive: {
    color: '#007A78',
    fontWeight: '800',
  },
  profileAvatar: {
    width: 22,
    height: 22,
    borderRadius: 11,
    marginBottom: 2,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  avatarActive: {
    borderColor: '#007A78',
    borderWidth: 2,
  },
});

export default BottomNavBar;
