import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { clearUser } from '../store/slices/userSlice';
import { ALL_COMPETITIONS } from '../store/slices/competitionSlice';
import { COLORS } from '../utils/colors';

const ProfileModal = ({
  visible,
  onClose,
  user,
  competition,
  isRegistered = true,
  registeredIds = ['feedants-dance-01'],
  submission,
}) => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(clearUser());
    onClose();
  };

  const username = user?.username || 'stevon_m';
  const name = user?.name || user?.username || 'Stevon Machado';
  const email = user?.email || `${username}@gmail.com`;
  const referralCode = user?.referralCode || 'FEED2026';

  const userInitial = name.charAt(0).toUpperCase();

  const registeredCompetitions = (ALL_COMPETITIONS || []).filter((c) =>
    (registeredIds || []).includes(c._id)
  );
  const totalFeePaid = registeredCompetitions.reduce((acc, c) => acc + (c.entryFee || 0), 0);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          {/* Top Bar with Close button */}
          <View style={styles.topBar}>
            <Text style={styles.modalTitle}>User Profile & Activity</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollArea}>
            {/* User Profile Summary Card */}
            <View style={styles.userCard}>
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarInitial}>{userInitial}</Text>
              </View>

              <View style={styles.userMeta}>
                <Text style={styles.userName}>{name}</Text>
                <Text style={styles.userHandle}>@{username}</Text>
                <Text style={styles.userEmail}>{email}</Text>

                <View style={styles.badgeRow}>
                  <View style={styles.verifiedBadge}>
                    <Text style={styles.verifiedText}>✔ Verified Participant</Text>
                  </View>
                  <View style={styles.referralBadge}>
                    <Text style={styles.referralText}>Ref: {referralCode}</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Quick Stats Grid */}
            <View style={styles.statsContainer}>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>{registeredCompetitions.length}</Text>
                <Text style={styles.statLabel}>Joined</Text>
              </View>
              <View style={[styles.statBox, styles.statDivider]}>
                <Text style={styles.statNumber}>{submission ? '1' : '0'}</Text>
                <Text style={styles.statLabel}>Submissions</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>₹{totalFeePaid}</Text>
                <Text style={styles.statLabel}>Fee Paid</Text>
              </View>
            </View>

            {/* Section: Competitions Participated In */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                Competitions Participated In ({registeredCompetitions.length})
              </Text>
            </View>

            {registeredCompetitions.length > 0 ? (
              registeredCompetitions.map((comp) => {
                const isCurrentComp = competition?._id === comp._id;
                return (
                  <View key={comp._id} style={styles.competitionCard}>
                    <View style={styles.compHeader}>
                      <View style={styles.compIconBox}>
                        <Text style={styles.compIcon}>🏆</Text>
                      </View>
                      <View style={styles.compTitleCol}>
                        <Text style={styles.compTitle}>{comp.title}</Text>
                        <Text style={styles.compSub}>
                          Judge: {comp.judge?.name} • {comp.categories?.join(', ')}
                        </Text>
                      </View>
                      <View style={styles.statusPill}>
                        <Text style={styles.statusPillText}>Registered</Text>
                      </View>
                    </View>

                    <View style={styles.compDetailsGrid}>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailKey}>Entry Fee:</Text>
                        <Text style={styles.detailValue}>
                          ₹{comp.entryFee} (Paid via Razorpay/UPI)
                        </Text>
                      </View>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailKey}>Prize Pool:</Text>
                        <Text style={styles.detailValue}>
                          ₹{comp.prizePool?.toLocaleString()}
                        </Text>
                      </View>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailKey}>Result Date:</Text>
                        <Text style={styles.detailValue}>
                          {comp.timeline?.resultDate?.date || '1 Sept 26'} •{' '}
                          {comp.timeline?.resultDate?.time || '11:50 PM'}
                        </Text>
                      </View>
                    </View>

                    {/* Submission Status Box */}
                    <View style={styles.submissionStatusBox}>
                      {isCurrentComp && submission ? (
                        <View>
                          <View style={styles.subStatusRow}>
                            <Text style={styles.checkIcon}>✓</Text>
                            <Text style={styles.subStatusTitle}>Submission Uploaded</Text>
                          </View>
                          <Text style={styles.subUrl} numberOfLines={1}>
                            Link: {submission.fileUrl}
                          </Text>
                          {submission.description ? (
                            <Text style={styles.subDesc} numberOfLines={2}>
                              Notes: {submission.description}
                            </Text>
                          ) : null}
                        </View>
                      ) : (
                        <View style={styles.subStatusRow}>
                          <Text style={styles.pendingIcon}>⏳</Text>
                          <View>
                            <Text style={styles.pendingTitle}>Submission Window Active</Text>
                            <Text style={styles.pendingSub}>
                              Upload your performance before{' '}
                              {comp.timeline?.submissionEnd?.date || '30 Aug 26'}.
                            </Text>
                          </View>
                        </View>
                      )}
                    </View>
                  </View>
                );
              })
            ) : (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyText}>
                  You haven't registered for any competitions yet.
                </Text>
              </View>
            )}

            {/* Logout Button */}
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.8}>
              <Text style={styles.logoutIcon}>🚪</Text>
              <Text style={styles.logoutText}>Log Out from Account</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    width: '100%',
    maxWidth: 500,
    maxHeight: '90%',
    padding: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  closeBtn: {
    padding: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
  },
  closeText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '700',
  },
  scrollArea: {
    paddingTop: 14,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  avatarCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primaryTeal,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  avatarInitial: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  userMeta: {
    flex: 1,
  },
  userName: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 2,
  },
  userHandle: {
    fontSize: 13,
    color: '#007A78',
    fontWeight: '700',
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 8,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  verifiedBadge: {
    backgroundColor: '#E6F8F7',
    borderWidth: 1,
    borderColor: '#72D6CD',
    borderRadius: 10,
    paddingVertical: 3,
    paddingHorizontal: 8,
    marginRight: 6,
    marginBottom: 4,
  },
  verifiedText: {
    color: '#007A78',
    fontSize: 10.5,
    fontWeight: '700',
  },
  referralBadge: {
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    paddingVertical: 3,
    paddingHorizontal: 8,
    marginBottom: 4,
  },
  referralText: {
    color: '#475569',
    fontSize: 10.5,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: 12,
    marginBottom: 20,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statDivider: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#F1F5F9',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: '#007A78',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  sectionHeader: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  competitionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
    marginBottom: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  compHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  compIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#E6F8F7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  compIcon: {
    fontSize: 16,
  },
  compTitleCol: {
    flex: 1,
  },
  compTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 2,
  },
  compSub: {
    fontSize: 11,
    color: '#64748B',
  },
  statusPill: {
    backgroundColor: '#E6F8F7',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: '#72D6CD',
  },
  statusPillText: {
    color: '#007A78',
    fontSize: 11,
    fontWeight: '700',
  },
  compDetailsGrid: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3,
  },
  detailKey: {
    fontSize: 11.5,
    color: '#64748B',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 11.5,
    color: '#0F172A',
    fontWeight: '700',
  },
  submissionStatusBox: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    borderRadius: 10,
    padding: 10,
  },
  subStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkIcon: {
    fontSize: 14,
    color: '#059669',
    fontWeight: '900',
    marginRight: 6,
  },
  subStatusTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#047857',
  },
  subUrl: {
    fontSize: 11,
    color: '#065F46',
    marginTop: 3,
    fontWeight: '500',
  },
  subDesc: {
    fontSize: 10.5,
    color: '#047857',
    marginTop: 2,
  },
  pendingIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  pendingTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#007A78',
  },
  pendingSub: {
    fontSize: 11,
    color: '#065F46',
    marginTop: 2,
  },
  emptyCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyText: {
    color: '#64748B',
    fontSize: 12,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 14,
    paddingVertical: 12,
    marginBottom: 10,
  },
  logoutIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  logoutText: {
    color: '#DC2626',
    fontSize: 13,
    fontWeight: '700',
  },
});

export default ProfileModal;
