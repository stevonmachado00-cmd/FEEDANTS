import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Platform, StyleSheet } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { COLORS } from '../utils/colors';

const AdBanner = () => {
  const [copied, setCopied] = useState(false);
  const couponCode = 'FEEDANTS20';

  const handleCopyCoupon = async () => {
    try {
      if (Platform.OS === 'web' && typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(couponCode);
      } else if (Clipboard && Clipboard.setStringAsync) {
        await Clipboard.setStringAsync(couponCode);
      }
    } catch (e) {}

    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <View style={styles.container}>
      <View style={styles.adCard}>
        <View style={styles.leftCol}>
          <View style={styles.perkBadge}>
            <Text style={styles.perkBadgeText}>OFFICIAL PARTNER PERK</Text>
          </View>
          <Text style={styles.title}>SoundPro & Sanskruti Stage Gear</Text>
          <Text style={styles.subtitle}>
            20% discount on performance mics, studio gear & stage wear.
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.couponButton, copied && styles.couponButtonCopied]}
          onPress={handleCopyCoupon}
          activeOpacity={0.8}
        >
          <Text style={styles.couponTag}>Use Code</Text>
          <Text style={[styles.codeText, copied && styles.codeTextCopied]}>
            {copied ? '✓ COPIED' : couponCode}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginBottom: 20,
  },
  adCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FAF5FF',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E9D5FF',
  },
  leftCol: {
    flex: 1,
    marginRight: 10,
  },
  perkBadge: {
    backgroundColor: '#7E22CE',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  perkBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#1E1B4B',
    marginBottom: 1,
  },
  subtitle: {
    fontSize: 10.5,
    color: '#6B21A8',
    lineHeight: 14,
  },
  couponButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#C084FC',
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  couponButtonCopied: {
    backgroundColor: '#059669',
    borderColor: '#059669',
  },
  couponTag: {
    fontSize: 8.5,
    fontWeight: '700',
    color: '#7E22CE',
    textTransform: 'uppercase',
  },
  codeText: {
    fontSize: 11.5,
    fontWeight: '900',
    color: '#581C87',
  },
  codeTextCopied: {
    color: '#FFFFFF',
  },
});

export default AdBanner;
