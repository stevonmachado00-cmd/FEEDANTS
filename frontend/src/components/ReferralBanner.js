import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Platform,
  Linking,
  StyleSheet,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { COLORS } from '../utils/colors';

const ReferralBanner = ({
  referralCode = 'dance123',
  competition,
  user,
  title = 'Refer & Earn more discount',
  copyLabel = 'Copy Link',
  copiedLabel = 'Copied!',
  referNowLabel = 'Refer Now',
  rewardText = 'You earn ₹50 for every friend who registers',
}) => {
  const [copied, setCopied] = useState(false);
  const [modalCopied, setModalCopied] = useState(false);
  const [shareModalVisible, setShareModalVisible] = useState(false);

  // Generate an actual functional URL based on current host & user
  const effectiveCode = user?.username || referralCode || 'feedants2026';
  const compId = competition?._id || 'feedants-dance-01';
  const compTitle = competition?.title || 'Feedants Classical Dance';

  const getActualReferralUrl = () => {
    if (typeof window !== 'undefined' && window.location && window.location.origin) {
      return `${window.location.origin}/?ref=${encodeURIComponent(effectiveCode)}&comp=${encodeURIComponent(compId)}`;
    }
    return `https://feedants.com/?ref=${encodeURIComponent(effectiveCode)}&comp=${encodeURIComponent(compId)}`;
  };

  const referralUrl = getActualReferralUrl();

  const handleCopyLink = async () => {
    try {
      if (Platform.OS === 'web' && typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(referralUrl);
      } else if (Clipboard && Clipboard.setStringAsync) {
        await Clipboard.setStringAsync(referralUrl);
      }
    } catch (e) {}

    setCopied(true);
    setModalCopied(true);
    setTimeout(() => {
      setCopied(false);
      setModalCopied(false);
    }, 2500);
  };

  const handleOpenReferralUrl = () => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.open(referralUrl, '_blank');
    } else {
      Linking.openURL(referralUrl).catch(() => {});
    }
  };

  const handleShareToPlatform = (platform) => {
    const inviteMessage = `Hey! Join me on Feedants for "${compTitle}". Use my invite link to participate and get 20% discount on your entry fee: ${referralUrl}`;

    let targetUrl = '';
    if (platform === 'whatsapp') {
      targetUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(inviteMessage)}`;
    } else if (platform === 'telegram') {
      targetUrl = `https://t.me/share/url?url=${encodeURIComponent(referralUrl)}&text=${encodeURIComponent(inviteMessage)}`;
    } else if (platform === 'twitter') {
      targetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out "${compTitle}" on Feedants! Join here with my link:`)}&url=${encodeURIComponent(referralUrl)}`;
    } else if (platform === 'email') {
      targetUrl = `mailto:?subject=${encodeURIComponent(`Invitation to join ${compTitle} on Feedants`)}&body=${encodeURIComponent(inviteMessage)}`;
    }

    if (targetUrl) {
      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        window.open(targetUrl, '_blank');
      } else {
        Linking.openURL(targetUrl).catch(() => {});
      }
    }
  };

  return (
    <View style={styles.card}>
      {/* Top Banner Row */}
      <View style={styles.topRow}>
        <View style={styles.megaphoneCircle}>
          <Text style={styles.megaphoneIcon}>📢</Text>
        </View>
        <Text style={styles.title}>{title}</Text>
      </View>

      {/* Main Bar with Real URL and CTA */}
      <View style={styles.bottomRow}>
        <TouchableOpacity
          style={styles.linkContainer}
          onPress={() => setShareModalVisible(true)}
          activeOpacity={0.8}
        >
          <Text style={styles.linkText} numberOfLines={1}>
            {referralUrl}
          </Text>
          <TouchableOpacity
            style={[styles.copyButton, copied && styles.copiedButton]}
            onPress={handleCopyLink}
            activeOpacity={0.7}
          >
            <Text style={[styles.copyText, copied && styles.copiedText]}>
              {copied ? copiedLabel : copyLabel}
            </Text>
          </TouchableOpacity>
        </TouchableOpacity>

        <View style={styles.ctaCol}>
          <TouchableOpacity
            style={styles.referButton}
            onPress={() => setShareModalVisible(true)}
            activeOpacity={0.85}
          >
            <Text style={styles.referButtonText}>{referNowLabel}</Text>
          </TouchableOpacity>
          <Text style={styles.rewardSubText}>{rewardText}</Text>
        </View>
      </View>

      {/* Actual Referral Link & Sharing Modal */}
      <Modal
        visible={shareModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setShareModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <View style={styles.modalTitleRow}>
                <Text style={styles.giftIcon}>🎁</Text>
                <View>
                  <Text style={styles.modalTitle}>Your Referral Link</Text>
                  <Text style={styles.modalSub}>Invite friends & earn ₹50 per participant</Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => setShareModalVisible(false)}
                style={styles.modalCloseBtn}
              >
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Referral Code Badge */}
            <View style={styles.refCodeCard}>
              <View>
                <Text style={styles.refCodeLabel}>YOUR UNIQUE REFERRAL CODE</Text>
                <Text style={styles.refCodeValue}>REF-{effectiveCode.toUpperCase()}</Text>
              </View>
              <View style={styles.discountBadge}>
                <Text style={styles.discountBadgeText}>20% OFF FOR FRIENDS</Text>
              </View>
            </View>

            {/* Actual Link Display & Actions Box */}
            <Text style={styles.sectionHeading}>Actual Referral Link:</Text>
            <View style={styles.actualLinkBox}>
              <Text style={styles.actualLinkText} selectable numberOfLines={2}>
                {referralUrl}
              </Text>
            </View>

            {/* Quick Action Buttons: Copy & Open Test Link */}
            <View style={styles.linkActionButtonsRow}>
              <TouchableOpacity
                style={[styles.primaryActionBtn, modalCopied && styles.primaryActionBtnCopied]}
                onPress={handleCopyLink}
                activeOpacity={0.8}
              >
                <Text style={styles.primaryActionBtnText}>
                  {modalCopied ? '✓ Link Copied to Clipboard!' : '📋 Copy Referral Link'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.secondaryActionBtn}
                onPress={handleOpenReferralUrl}
                activeOpacity={0.8}
              >
                <Text style={styles.secondaryActionBtnText}>Open / Test Link ↗</Text>
              </TouchableOpacity>
            </View>

            {/* 1-Click Share to Popular Channels */}
            <Text style={styles.sectionHeading}>Share Directly via:</Text>
            <View style={styles.socialShareRow}>
              <TouchableOpacity
                style={[styles.socialShareBtn, { backgroundColor: '#25D366' }]}
                onPress={() => handleShareToPlatform('whatsapp')}
                activeOpacity={0.85}
              >
                <Text style={styles.socialBtnIcon}>💬</Text>
                <Text style={styles.socialBtnText}>WhatsApp</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.socialShareBtn, { backgroundColor: '#0088CC' }]}
                onPress={() => handleShareToPlatform('telegram')}
                activeOpacity={0.85}
              >
                <Text style={styles.socialBtnIcon}>✈️</Text>
                <Text style={styles.socialBtnText}>Telegram</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.socialShareBtn, { backgroundColor: '#0F1419' }]}
                onPress={() => handleShareToPlatform('twitter')}
                activeOpacity={0.85}
              >
                <Text style={styles.socialBtnIcon}>🐦</Text>
                <Text style={styles.socialBtnText}>X / Twitter</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.socialShareBtn, { backgroundColor: '#EA4335' }]}
                onPress={() => handleShareToPlatform('email')}
                activeOpacity={0.85}
              >
                <Text style={styles.socialBtnIcon}>✉️</Text>
                <Text style={styles.socialBtnText}>Email</Text>
              </TouchableOpacity>
            </View>

            {/* Rewards Breakdown Box */}
            <View style={styles.rewardTermsCard}>
              <Text style={styles.rewardTermsTitle}>🎉 How Referral Rewards Work:</Text>
              <Text style={styles.rewardTermsItem}>
                1. Share your actual referral link with performers, artists, and friends.
              </Text>
              <Text style={styles.rewardTermsItem}>
                2. They get an instant 20% discount on their competition entry fee.
              </Text>
              <Text style={styles.rewardTermsItem}>
                3. You automatically receive ₹50 cash credit directly to your account wallet!
              </Text>
            </View>

            {/* Done Button */}
            <TouchableOpacity
              style={styles.doneBtn}
              onPress={() => setShareModalVisible(false)}
              activeOpacity={0.85}
            >
              <Text style={styles.doneBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#E6F8F0',
    borderRadius: 16,
    padding: 14,
    marginHorizontal: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#C7EFE0',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  megaphoneCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#C5F0DC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  megaphoneIcon: {
    fontSize: 14,
  },
  title: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  linkContainer: {
    flex: 1.4,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#BFE7D5',
    paddingLeft: 10,
    marginRight: 10,
    height: 38,
    overflow: 'hidden',
  },
  linkText: {
    flex: 1,
    fontSize: 11,
    color: '#007A78',
    fontWeight: '600',
    marginRight: 4,
  },
  copyButton: {
    backgroundColor: '#F3F4F6',
    borderLeftWidth: 1,
    borderLeftColor: '#E5E7EB',
    height: '100%',
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copiedButton: {
    backgroundColor: '#007A78',
  },
  copyText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#374151',
  },
  copiedText: {
    color: '#FFFFFF',
  },
  ctaCol: {
    alignItems: 'center',
    flex: 1,
  },
  referButton: {
    backgroundColor: COLORS.primaryTeal,
    borderRadius: 10,
    paddingVertical: 7,
    paddingHorizontal: 16,
    width: '100%',
    alignItems: 'center',
    marginBottom: 4,
  },
  referButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  rewardSubText: {
    fontSize: 9,
    color: '#047857',
    fontWeight: '600',
    textAlign: 'center',
  },

  /* Modal Styles */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    width: '100%',
    maxWidth: 500,
    padding: 22,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    marginBottom: 16,
  },
  modalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  giftIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  modalSub: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 2,
  },
  modalCloseBtn: {
    padding: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
  },
  modalCloseText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '700',
  },
  refCodeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F0FDFA',
    borderWidth: 1,
    borderColor: '#72D6CD',
    borderRadius: 14,
    padding: 12,
    marginBottom: 14,
  },
  refCodeLabel: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#007A78',
    letterSpacing: 0.5,
  },
  refCodeValue: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
    marginTop: 2,
  },
  discountBadge: {
    backgroundColor: '#007A78',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  discountBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  sectionHeading: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  actualLinkBox: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
  },
  actualLinkText: {
    fontSize: 12,
    color: '#007A78',
    fontWeight: '600',
    lineHeight: 18,
  },
  linkActionButtonsRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  primaryActionBtn: {
    flex: 1.3,
    backgroundColor: COLORS.primaryTeal,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    marginRight: 8,
  },
  primaryActionBtnCopied: {
    backgroundColor: '#059669',
  },
  primaryActionBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  secondaryActionBtn: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  secondaryActionBtnText: {
    color: '#334155',
    fontSize: 12,
    fontWeight: '700',
  },
  socialShareRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  socialShareBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 10,
    marginHorizontal: 3,
  },
  socialBtnIcon: {
    fontSize: 16,
    marginBottom: 2,
  },
  socialBtnText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  rewardTermsCard: {
    backgroundColor: '#FEF9C3',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FDE047',
    padding: 10,
    marginBottom: 14,
  },
  rewardTermsTitle: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#854D0E',
    marginBottom: 4,
  },
  rewardTermsItem: {
    fontSize: 10.5,
    color: '#713F12',
    lineHeight: 15,
    marginBottom: 2,
  },
  doneBtn: {
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
  doneBtnText: {
    color: '#475569',
    fontSize: 13,
    fontWeight: '700',
  },
});

export default ReferralBanner;
