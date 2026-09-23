import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../utils/colors';

const Header = ({
  currentLang = 'ENG',
  onToggleLang,
  user,
  onPressAuth,
}) => {
  return (
    <View style={styles.container}>
      {/* Brand Title on Left */}
      <View style={styles.brandContainer}>
        <View style={styles.brandIconBox}>
          <Text style={styles.brandIcon}>🏆</Text>
        </View>
        <Text style={styles.brandTitle}>FEEDANTS</Text>
      </View>

      {/* Right Cluster: User Profile Pill & Language Toggle */}
      <View style={styles.rightCluster}>
        {/* User Auth Button */}
        <TouchableOpacity
          style={[styles.authPill, user && styles.authPillActive]}
          onPress={onPressAuth}
          activeOpacity={0.8}
        >
          <Text style={styles.authIcon}>👤</Text>
          <Text style={[styles.authText, user && styles.authTextActive]} numberOfLines={1}>
            {user ? `@${user.username || user.name}` : 'Login'}
          </Text>
        </TouchableOpacity>

        {/* Language Switcher Pill */}
        <View style={styles.langPillContainer}>
          <TouchableOpacity
            style={[styles.langOption, currentLang === 'ENG' && styles.langOptionActive]}
            onPress={() => onToggleLang && onToggleLang('ENG')}
            activeOpacity={0.8}
          >
            <Text style={[styles.langText, currentLang === 'ENG' && styles.langTextActive]}>
              ENG
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.langOption, currentLang === 'HIN' && styles.langOptionActive]}
            onPress={() => onToggleLang && onToggleLang('HIN')}
            activeOpacity={0.8}
          >
            <Text style={[styles.langText, currentLang === 'HIN' && styles.langTextActive]}>
              हिंदी
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 14,
    backgroundColor: '#FFFFFF',
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandIconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#E6F8F7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  brandIcon: {
    fontSize: 16,
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#005C6E',
    letterSpacing: 1,
  },
  rightCluster: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    maxWidth: 140,
  },
  authPillActive: {
    backgroundColor: '#E6F8F7',
    borderColor: '#72D6CD',
  },
  authIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  authText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  authTextActive: {
    color: '#007A78',
  },
  langPillContainer: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    padding: 2,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  langOption: {
    paddingVertical: 5,
    paddingHorizontal: 14,
    borderRadius: 16,
  },
  langOptionActive: {
    backgroundColor: COLORS.primaryTeal,
  },
  langText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563',
  },
  langTextActive: {
    color: '#FFFFFF',
  },
});

export default Header;
