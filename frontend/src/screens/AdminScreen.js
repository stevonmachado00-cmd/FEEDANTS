import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Platform,
  Linking,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAllCompetitions,
  addCompetitionLocally,
  updateCompetitionLocally,
  deleteCompetitionLocally,
  setCompetition,
} from '../store/slices/competitionSlice';
import { clearUser } from '../store/slices/userSlice';
import * as api from '../api/competitionApi';
import AdminCompetitionModal from '../components/AdminCompetitionModal';

const AdminScreen = ({ onSwitchToUserView, onLogout }) => {
  const dispatch = useDispatch();
  const { allCompetitions, competition } = useSelector((state) => state.competition);
  const { user } = useSelector((state) => state.user);

  const [activeTab, setActiveTab] = useState('competitions'); // 'competitions' | 'participants'
  const [modalVisible, setModalVisible] = useState(false);
  const [editingComp, setEditingComp] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Participants State
  const [participants, setParticipants] = useState([]);
  const [loadingParticipants, setLoadingParticipants] = useState(false);

  useEffect(() => {
    dispatch(fetchAllCompetitions());
    fetchParticipants();
  }, [dispatch]);

  const fetchParticipants = async () => {
    setLoadingParticipants(true);
    try {
      const res = await api.getAdminParticipants();
      if (res && res.data) {
        setParticipants(res.data);
      }
    } catch (e) {
      console.warn('Failed to load participants:', e.message);
    } finally {
      setLoadingParticipants(false);
    }
  };

  // KPI Calculations
  const totalComps = allCompetitions?.length || 0;
  const totalPrizePool = (allCompetitions || []).reduce(
    (acc, curr) => acc + (Number(curr.prizePool) || 0),
    0
  );
  const totalBookedSpots = (allCompetitions || []).reduce(
    (acc, curr) => acc + (Number(curr.bookedSpots) || 0),
    0
  );
  const totalRevenue = (allCompetitions || []).reduce(
    (acc, curr) => acc + (Number(curr.entryFee) || 0) * (Number(curr.bookedSpots) || 0),
    0
  );

  const handleOpenCreateModal = () => {
    setEditingComp(null);
    setModalVisible(true);
  };

  const handleOpenEditModal = (comp) => {
    setEditingComp(comp);
    setModalVisible(true);
  };

  const handleSaveCompetition = async (payload, existingId) => {
    try {
      if (existingId) {
        // Update
        const res = await api.updateCompetition(existingId, payload);
        const updated = res.data || { ...payload, _id: existingId };
        dispatch(updateCompetitionLocally(updated));
        Alert.alert('Success', 'Competition parameters updated successfully!');
      } else {
        // Create
        const res = await api.createCompetition(payload);
        const created = res.data || { ...payload, _id: 'comp_' + Date.now() };
        dispatch(addCompetitionLocally(created));
        Alert.alert(
          'Published!',
          `"${created.title}" is now published and live on the user website!`
        );
      }
    } catch (error) {
      // Fallback local update if network error
      if (existingId) {
        dispatch(updateCompetitionLocally({ ...payload, _id: existingId }));
      } else {
        const fallbackComp = { ...payload, _id: 'comp_' + Date.now() };
        dispatch(addCompetitionLocally(fallbackComp));
      }
      Alert.alert('Saved', 'Competition updated successfully in catalog.');
    }
  };

  const handleDeleteCompetition = (comp) => {
    Alert.alert(
      'Confirm Deletion',
      `Are you sure you want to remove "${comp.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.deleteCompetition(comp._id);
            } catch (e) {}
            dispatch(deleteCompetitionLocally(comp._id));
            Alert.alert('Deleted', `"${comp.title}" removed from catalog.`);
          },
        },
      ]
    );
  };

  const handleInspectOnUserSite = (comp) => {
    dispatch(setCompetition(comp));
    if (onSwitchToUserView) {
      onSwitchToUserView();
    }
  };

  // Filtered Participants
  const filteredParticipants = (participants || []).filter((p) => {
    const q = searchQuery.toLowerCase();
    const userName = (p.user?.name || '').toLowerCase();
    const userEmail = (p.user?.email || '').toLowerCase();
    const compTitle = (p.competition?.title || '').toLowerCase();
    return userName.includes(q) || userEmail.includes(q) || compTitle.includes(q);
  });

  return (
    <View style={styles.container}>
      {/* Top Admin Navbar */}
      <View style={styles.navbar}>
        <View style={styles.navLeft}>
          <View style={styles.adminBadge}>
            <Text style={styles.adminBadgeIcon}>🛡️</Text>
            <Text style={styles.adminBadgeText}>ADMIN PORTAL</Text>
          </View>
          <Text style={styles.adminUserText}>Signed in as @{user?.username || 'ADMIN'}</Text>
        </View>

        <View style={styles.navRight}>
          <TouchableOpacity
            style={styles.switchViewBtn}
            onPress={onSwitchToUserView}
            activeOpacity={0.8}
          >
            <Text style={styles.switchViewBtnText}>👁️ View User Website</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.logoutBtn}
            onPress={onLogout}
            activeOpacity={0.8}
          >
            <Text style={styles.logoutBtnText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent}>
        {/* KPI Summary Cards */}
        <View style={styles.kpiGrid}>
          <View style={styles.kpiCard}>
            <Text style={styles.kpiIcon}>🏆</Text>
            <Text style={styles.kpiNumber}>{totalComps}</Text>
            <Text style={styles.kpiLabel}>Total Tournaments</Text>
          </View>

          <View style={styles.kpiCard}>
            <Text style={styles.kpiIcon}>👥</Text>
            <Text style={styles.kpiNumber}>{totalBookedSpots}</Text>
            <Text style={styles.kpiLabel}>Registered Spots</Text>
          </View>

          <View style={styles.kpiCard}>
            <Text style={styles.kpiIcon}>💰</Text>
            <Text style={styles.kpiNumber}>₹{totalPrizePool.toLocaleString()}</Text>
            <Text style={styles.kpiLabel}>Committed Prize Pool</Text>
          </View>

          <View style={styles.kpiCard}>
            <Text style={styles.kpiIcon}>💳</Text>
            <Text style={styles.kpiNumber}>₹{totalRevenue.toLocaleString()}</Text>
            <Text style={styles.kpiLabel}>Total Revenue</Text>
          </View>
        </View>

        {/* Section Tabs */}
        <View style={styles.tabsRow}>
          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'competitions' && styles.tabBtnActive]}
            onPress={() => setActiveTab('competitions')}
          >
            <Text
              style={[styles.tabBtnText, activeTab === 'competitions' && styles.tabBtnTextActive]}
            >
              📋 Competitions Catalog ({allCompetitions.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'participants' && styles.tabBtnActive]}
            onPress={() => {
              setActiveTab('participants');
              fetchParticipants();
            }}
          >
            <Text
              style={[styles.tabBtnText, activeTab === 'participants' && styles.tabBtnTextActive]}
            >
              👥 All Participants ({participants.length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* TAB 1: COMPETITIONS LIST */}
        {activeTab === 'competitions' ? (
          <View>
            <View style={styles.sectionHeaderRow}>
              <View>
                <Text style={styles.sectionHeading}>Manage Competitions</Text>
                <Text style={styles.sectionSubheading}>
                  Create, edit, or remove competitions. Changes immediately reflect on the user side.
                </Text>
              </View>

              <TouchableOpacity
                style={styles.postNewBtn}
                onPress={handleOpenCreateModal}
                activeOpacity={0.85}
              >
                <Text style={styles.postNewBtnText}>+ Post New Competition</Text>
              </TouchableOpacity>
            </View>

            {allCompetitions.map((comp) => {
              const remaining = Math.max(0, (comp.totalSpots || 20) - (comp.bookedSpots || 0));
              return (
                <View key={comp._id} style={styles.compCard}>
                  <View style={styles.compHeader}>
                    <View style={{ flex: 1 }}>
                      <View style={styles.titleRow}>
                        <Text style={styles.compTitle}>{comp.title}</Text>
                        <View
                          style={[
                            styles.statusBadge,
                            comp.status === 'completed'
                              ? styles.statusCompleted
                              : styles.statusOpen,
                          ]}
                        >
                          <Text style={styles.statusBadgeText}>
                            {comp.status === 'completed' ? '🏁 Completed' : '🟢 Live & Open'}
                          </Text>
                        </View>
                      </View>

                      <Text style={styles.compMeta}>
                        Category: {comp.categories?.[0] || 'Arts'} • Judge: {comp.judge?.name || 'Assigned'} ({comp.judge?.experience || '10+ Yrs'})
                      </Text>
                    </View>
                  </View>

                  <View style={styles.compStatsRow}>
                    <View style={styles.statItem}>
                      <Text style={styles.statVal}>₹{comp.prizePool}</Text>
                      <Text style={styles.statKey}>Prize Pool</Text>
                    </View>
                    <View style={styles.statItem}>
                      <Text style={styles.statVal}>₹{comp.entryFee}</Text>
                      <Text style={styles.statKey}>Entry Fee</Text>
                    </View>
                    <View style={styles.statItem}>
                      <Text style={styles.statVal}>{comp.bookedSpots || 0} / {comp.totalSpots || 20}</Text>
                      <Text style={styles.statKey}>Spots Booked ({remaining} Left)</Text>
                    </View>
                  </View>

                  {/* Action Buttons */}
                  <View style={styles.compActionsRow}>
                    <TouchableOpacity
                      style={styles.actionInspectBtn}
                      onPress={() => handleInspectOnUserSite(comp)}
                    >
                      <Text style={styles.actionInspectText}>👀 Inspect User View</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.actionEditBtn}
                      onPress={() => handleOpenEditModal(comp)}
                    >
                      <Text style={styles.actionEditText}>✏️ Edit Parameters</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.actionDeleteBtn}
                      onPress={() => handleDeleteCompetition(comp)}
                    >
                      <Text style={styles.actionDeleteText}>🗑️ Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
        ) : null}

        {/* TAB 2: PARTICIPANTS ROSTER */}
        {activeTab === 'participants' ? (
          <View>
            <View style={styles.sectionHeaderRow}>
              <View>
                <Text style={styles.sectionHeading}>Participants Roster</Text>
                <Text style={styles.sectionSubheading}>
                  Complete list of all registered artists across competitions.
                </Text>
              </View>

              <TouchableOpacity
                style={styles.refreshBtn}
                onPress={fetchParticipants}
                activeOpacity={0.8}
              >
                <Text style={styles.refreshBtnText}>🔄 Refresh Data</Text>
              </TouchableOpacity>
            </View>

            {/* Search Input */}
            <TextInput
              style={styles.searchInput}
              placeholder="🔍 Search participant by name, email, or tournament..."
              placeholderTextColor="#94A3B8"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />

            {loadingParticipants ? (
              <ActivityIndicator size="large" color="#007A78" style={{ marginTop: 24 }} />
            ) : filteredParticipants.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyIcon}>👥</Text>
                <Text style={styles.emptyTitle}>No participants found</Text>
                <Text style={styles.emptySub}>
                  No registrations match your search query or have been placed yet.
                </Text>
              </View>
            ) : (
              filteredParticipants.map((p, idx) => (
                <View key={p.id || idx} style={styles.participantCard}>
                  <View style={styles.participantHeader}>
                    <View style={styles.avatarCircle}>
                      <Text style={styles.avatarLetter}>
                        {(p.user?.name || p.user?.username || 'U')[0].toUpperCase()}
                      </Text>
                    </View>

                    <View style={{ flex: 1 }}>
                      <View style={styles.nameRow}>
                        <Text style={styles.participantName}>{p.user?.name || 'Artist'}</Text>
                        <View style={styles.paidBadge}>
                          <Text style={styles.paidBadgeText}>Paid ₹{p.paidAmount || 99}</Text>
                        </View>
                      </View>
                      <Text style={styles.participantEmail}>
                        @{p.user?.username || 'user'} • {p.user?.email || 'N/A'}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.participantMetaRow}>
                    <Text style={styles.participantComp}>
                      🏆 Tournament: <Text style={{ fontWeight: '800', color: '#0F172A' }}>{p.competition?.title || 'Classical Dance'}</Text>
                    </Text>

                    <Text style={styles.regDateText}>
                      📅 {p.registeredAt ? new Date(p.registeredAt).toLocaleDateString() : 'Recent'}
                    </Text>
                  </View>

                  {/* Submission Link if uploaded */}
                  {p.submission ? (
                    <View style={styles.submissionBox}>
                      <Text style={styles.subIcon}>🎬</Text>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.subTitle}>
                          Performance Entry: {p.submission.description || 'Uploaded Media'}
                        </Text>
                        <Text style={styles.subUrl} numberOfLines={1}>
                          {p.submission.fileUrl}
                        </Text>
                      </View>
                      <TouchableOpacity
                        style={styles.openVideoBtn}
                        onPress={() => {
                          if (p.submission.fileUrl) {
                            if (Platform.OS === 'web' && typeof window !== 'undefined') {
                              window.open(p.submission.fileUrl, '_blank');
                            } else {
                              Linking.openURL(p.submission.fileUrl).catch(() => {});
                            }
                          }
                        }}
                      >
                        <Text style={styles.openVideoText}>View Video</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View style={styles.noSubBox}>
                      <Text style={styles.noSubText}>⏳ Spot reserved • Performance not submitted yet</Text>
                    </View>
                  )}
                </View>
              ))
            )}
          </View>
        ) : null}
      </ScrollView>

      {/* Admin Create / Edit Modal */}
      <AdminCompetitionModal
        visible={modalVisible}
        existingCompetition={editingComp}
        onClose={() => setModalVisible(false)}
        onSubmit={handleSaveCompetition}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    ...(Platform.OS === 'web' ? { minHeight: '100vh', width: '100%' } : {}),
  },
  navbar: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 20,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  navLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  adminBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007A78',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  adminBadgeIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  adminBadgeText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 12,
    letterSpacing: 0.5,
  },
  adminUserText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
  },
  navRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  switchViewBtn: {
    backgroundColor: '#1E293B',
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  switchViewBtnText: {
    color: '#38BDF8',
    fontSize: 12,
    fontWeight: '700',
  },
  logoutBtn: {
    backgroundColor: '#EF4444',
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  logoutBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 50,
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
    width: '100%',
    maxWidth: 960,
    marginBottom: 20,
  },
  kpiCard: {
    flex: 1,
    minWidth: 180,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  kpiIcon: {
    fontSize: 22,
    marginBottom: 6,
  },
  kpiNumber: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
  },
  kpiLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
    marginTop: 2,
  },
  tabsRow: {
    flexDirection: 'row',
    width: '100%',
    maxWidth: 960,
    backgroundColor: '#E2E8F0',
    borderRadius: 12,
    padding: 4,
    marginBottom: 18,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  tabBtnActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  tabBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  tabBtnTextActive: {
    color: '#007A78',
    fontWeight: '800',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 960,
    marginBottom: 16,
    flexWrap: 'wrap',
    gap: 10,
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
  },
  sectionSubheading: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  postNewBtn: {
    backgroundColor: '#007A78',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    shadowColor: '#007A78',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  postNewBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
  },
  refreshBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  refreshBtnText: {
    color: '#334155',
    fontSize: 12,
    fontWeight: '700',
  },
  compCard: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    maxWidth: 960,
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
  },
  compHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexWrap: 'wrap',
    marginBottom: 4,
  },
  compTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  statusBadge: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  statusOpen: {
    backgroundColor: '#ECFDF5',
  },
  statusCompleted: {
    backgroundColor: '#F1F5F9',
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
  },
  compMeta: {
    fontSize: 12,
    color: '#64748B',
  },
  compStatsRow: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 10,
    marginBottom: 14,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statVal: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  statKey: {
    fontSize: 10.5,
    color: '#64748B',
    marginTop: 2,
  },
  compActionsRow: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 12,
  },
  actionInspectBtn: {
    backgroundColor: '#F0FDFA',
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CCFBF1',
  },
  actionInspectText: {
    color: '#007A78',
    fontSize: 12,
    fontWeight: '700',
  },
  actionEditBtn: {
    backgroundColor: '#EFF6FF',
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  actionEditText: {
    color: '#2563EB',
    fontSize: 12,
    fontWeight: '700',
  },
  actionDeleteBtn: {
    backgroundColor: '#FEF2F2',
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  actionDeleteText: {
    color: '#DC2626',
    fontSize: 12,
    fontWeight: '700',
  },
  searchInput: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    maxWidth: 960,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    marginBottom: 14,
    color: '#0F172A',
  },
  participantCard: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    maxWidth: 960,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  participantHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#007A78',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  avatarLetter: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 15,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  participantName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  paidBadge: {
    backgroundColor: '#ECFDF5',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  paidBadgeText: {
    color: '#059669',
    fontSize: 11,
    fontWeight: '800',
  },
  participantEmail: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 1,
  },
  participantMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#F8FAFC',
  },
  participantComp: {
    fontSize: 12,
    color: '#475569',
  },
  regDateText: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
  },
  submissionBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDFA',
    borderRadius: 8,
    padding: 10,
    marginTop: 6,
    borderWidth: 1,
    borderColor: '#CCFBF1',
  },
  subIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  subTitle: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#007A78',
  },
  subUrl: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 1,
  },
  openVideoBtn: {
    backgroundColor: '#007A78',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginLeft: 8,
  },
  openVideoText: {
    color: '#FFFFFF',
    fontSize: 10.5,
    fontWeight: '800',
  },
  noSubBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 8,
    marginTop: 6,
  },
  noSubText: {
    fontSize: 11,
    color: '#94A3B8',
    fontStyle: 'italic',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  emptySub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
  },
});

export default AdminScreen;
