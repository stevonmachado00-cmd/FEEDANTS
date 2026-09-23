import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
} from 'react-native';
import { COLORS } from '../utils/colors';

const TESTIMONIALS = [
  {
    id: '1',
    name: 'Ananya Deshmukh',
    role: 'Kathak Performer • Pune',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
    rating: '★★★★★',
    prizeWon: '₹550 Prize Winner (1st Rank)',
    competition: 'Classical Dance 2025',
    comment:
      'Feedants gave me the platform to showcase my Kathak to an NSD & Sangeet Natak Akademi certified judge. The cash prize was credited to my UPI within 2 hours of results!',
  },
  {
    id: '2',
    name: 'Rohan Sengupta',
    role: 'Indie Singer-Songwriter • Kolkata',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256',
    rating: '★★★★★',
    prizeWon: '₹1,200 Prize Winner (1st Rank)',
    competition: 'Indie Vocal Solo',
    comment:
      'The feedback provided by the judge was genuinely detailed—critiquing my breath control and micro-tones. Not just a prize platform, but a real career accelerator.',
  },
  {
    id: '3',
    name: 'Priyanka Verma',
    role: 'Theatre & Mono-Acting • Delhi',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=256',
    rating: '★★★★★',
    prizeWon: '₹700 Prize Winner (2nd Rank)',
    competition: 'Drama & Monologue',
    comment:
      'Completely transparent judging parameters. All competitor ranks and scores were openly published on the result date with zero bias.',
  },
  {
    id: '4',
    name: 'Arjun Mehta',
    role: 'Digital Illustrator • Bengaluru',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=256',
    rating: '★★★★★',
    prizeWon: '₹800 Prize Winner (3rd Rank)',
    competition: 'Digital Art Showcase',
    comment:
      'Loved how seamless the submission and Razorpay payment processes were. Clean UI and instant participation confirmation.',
  },
];

const TestimonialsModal = ({ visible, onClose }) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <Text style={styles.headerIcon}>💬</Text>
              <View>
                <Text style={styles.headerTitle}>Verified Participant Stories</Text>
                <Text style={styles.headerSub}>Over 12,000+ artists funded and recognized</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Social Proof Metric Banner */}
          <View style={styles.metricsBanner}>
            <View style={styles.metricCol}>
              <Text style={styles.metricBig}>4.9/5</Text>
              <Text style={styles.metricSub}>Average Rating</Text>
            </View>
            <View style={[styles.metricCol, styles.metricBorder]}>
              <Text style={styles.metricBig}>₹8.5L+</Text>
              <Text style={styles.metricSub}>Prizes Disbursed</Text>
            </View>
            <View style={styles.metricCol}>
              <Text style={styles.metricBig}>100%</Text>
              <Text style={styles.metricSub}>On-Time Payouts</Text>
            </View>
          </View>

          {/* Testimonials List */}
          <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollArea}>
            {TESTIMONIALS.map((t) => (
              <View key={t.id} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <Image source={{ uri: t.avatar }} style={styles.avatar} />
                  <View style={styles.userMeta}>
                    <View style={styles.nameRow}>
                      <Text style={styles.userName}>{t.name}</Text>
                      <View style={styles.verifiedBadge}>
                        <Text style={styles.verifiedText}>✔ Verified Winner</Text>
                      </View>
                    </View>
                    <Text style={styles.userRole}>{t.role}</Text>
                    <Text style={styles.ratingStars}>{t.rating}</Text>
                  </View>
                </View>

                <View style={styles.prizeBadge}>
                  <Text style={styles.prizeBadgeText}>🏆 {t.prizeWon}</Text>
                  <Text style={styles.compBadgeText}>• {t.competition}</Text>
                </View>

                <Text style={styles.commentText}>"{t.comment}"</Text>
              </View>
            ))}
          </ScrollView>

          {/* Close Button */}
          <TouchableOpacity style={styles.doneBtn} onPress={onClose} activeOpacity={0.85}>
            <Text style={styles.doneBtnText}>Close Stories</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
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
    maxWidth: 540,
    maxHeight: '90%',
    padding: 22,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  headerSub: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 2,
  },
  closeBtn: {
    padding: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
  },
  closeText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '700',
  },
  metricsBanner: {
    flexDirection: 'row',
    backgroundColor: '#F0FDFA',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#CCFBF1',
    paddingVertical: 12,
    marginTop: 14,
    marginBottom: 14,
  },
  metricCol: {
    flex: 1,
    alignItems: 'center',
  },
  metricBorder: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#CCFBF1',
  },
  metricBig: {
    fontSize: 16,
    fontWeight: '900',
    color: '#007A78',
  },
  metricSub: {
    fontSize: 10,
    fontWeight: '600',
    color: '#475569',
    marginTop: 2,
  },
  scrollArea: {
    flexGrow: 0,
    marginBottom: 14,
  },
  reviewCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  reviewHeader: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 10,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
  },
  userMeta: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  userName: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0F172A',
    marginRight: 6,
  },
  verifiedBadge: {
    backgroundColor: '#ECFDF5',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 6,
  },
  verifiedText: {
    color: '#059669',
    fontSize: 9.5,
    fontWeight: '700',
  },
  userRole: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  ratingStars: {
    fontSize: 11,
    color: '#F59E0B',
    marginTop: 2,
    letterSpacing: 2,
  },
  prizeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  prizeBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#92400E',
  },
  compBadgeText: {
    fontSize: 10.5,
    color: '#78350F',
    marginLeft: 4,
    fontWeight: '600',
  },
  commentText: {
    fontSize: 12,
    color: '#334155',
    lineHeight: 18,
    fontStyle: 'italic',
  },
  doneBtn: {
    backgroundColor: '#007A78',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  doneBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
});

export default TestimonialsModal;
