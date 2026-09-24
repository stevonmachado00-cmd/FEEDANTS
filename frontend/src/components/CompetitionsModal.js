import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setCompetition, ALL_COMPETITIONS } from '../store/slices/competitionSlice';
import { COLORS } from '../utils/colors';

const CompetitionsModal = ({
  visible,
  onClose,
  onSelectCompetition,
  onParticipate,
  registeredIds = [],
}) => {
  const dispatch = useDispatch();
  const activeComp = useSelector((state) => state.competition.competition);
  const allComps = useSelector((state) => state.competition.allCompetitions) || ALL_COMPETITIONS;
  const [filterCategory, setFilterCategory] = useState('All');

  const categories = ['All', 'Dance', 'Music', 'Theatre', 'Art'];

  const filteredCompetitions = (allComps || []).filter((comp) => {
    if (filterCategory === 'All') return true;
    return (comp.categories || []).some((cat) =>
      cat.toLowerCase().includes(filterCategory.toLowerCase())
    );
  });

  const handleSelect = (comp) => {
    dispatch(setCompetition(comp));
    if (onSelectCompetition) onSelectCompetition(comp);
    onClose();
  };

  const handleParticipate = (comp) => {
    onClose();
    if (onParticipate) {
      onParticipate(comp);
    }
  };

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
          <View style={styles.topBar}>
            <View style={styles.titleRow}>
              <Text style={styles.trophyIcon}>🏆</Text>
              <Text style={styles.modalTitle}>Explore Live Competitions</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Subtitle */}
          <Text style={styles.modalSub}>
            Participate in skill-based competitions across dance, music, drama, and visual arts to win cash prizes!
          </Text>

          {/* Category Filter Pills */}
          <View style={styles.filterRow}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.filterPill,
                  filterCategory === cat && styles.filterPillActive,
                ]}
                onPress={() => setFilterCategory(cat)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.filterText,
                    filterCategory === cat && styles.filterTextActive,
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Competitions List */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={styles.competitionsList}
          >
            {filteredCompetitions.map((comp) => {
              const isCurrent = activeComp?._id === comp._id;
              const isRegistered = registeredIds.includes(comp._id);
              const remainingSpots = comp.totalSpots - comp.bookedSpots;

              return (
                <View
                  key={comp._id}
                  style={[styles.compCard, isCurrent && styles.compCardSelected]}
                >
                  {/* Top card row: Title & Active Badge */}
                  <View style={styles.cardHeader}>
                    <View style={styles.titleArea}>
                      <Text style={styles.compTitle}>{comp.title}</Text>
                      <View style={styles.tagsRow}>
                        {comp.categories.map((c, i) => (
                          <View key={i} style={styles.tagBadge}>
                            <Text style={styles.tagText}>{c}</Text>
                          </View>
                        ))}
                      </View>
                    </View>

                    {isCurrent ? (
                      <View style={styles.currentBadge}>
                        <Text style={styles.currentBadgeText}>Active View</Text>
                      </View>
                    ) : null}
                  </View>

                  {/* Judge & Description */}
                  <Text style={styles.judgeName}>
                    Judge: <Text style={styles.judgeBold}>{comp.judge?.name}</Text> ({comp.judge?.title})
                  </Text>
                  <Text style={styles.compAbout} numberOfLines={2}>
                    {comp.details?.about}
                  </Text>

                  {/* Metrics Bar */}
                  <View style={styles.metricsBox}>
                    <View style={styles.metricItem}>
                      <Text style={styles.metricLabel}>Prize Pool</Text>
                      <Text style={styles.prizeAmount}>₹ {comp.prizePool.toLocaleString()}</Text>
                    </View>

                    <View style={[styles.metricItem, styles.metricBorder]}>
                      <Text style={styles.metricLabel}>Entry Fee</Text>
                      <Text style={styles.feeAmount}>₹ {comp.entryFee}</Text>
                    </View>

                    <View style={styles.metricItem}>
                      <Text style={styles.metricLabel}>Spots Left</Text>
                      <Text style={styles.spotsAmount}>{remainingSpots} / {comp.totalSpots}</Text>
                    </View>
                  </View>

                  {/* Action Buttons: View Details & Participate */}
                  <View style={styles.actionBtnRow}>
                    <TouchableOpacity
                      style={styles.viewDetailsBtn}
                      onPress={() => handleSelect(comp)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.viewDetailsBtnText}>
                        {isCurrent ? 'Viewing Now' : 'View Details'}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.participateBtn,
                        isRegistered ? styles.participateBtnRegistered : null,
                      ]}
                      onPress={() => {
                        if (isRegistered) {
                          handleSelect(comp);
                        } else {
                          handleParticipate(comp);
                        }
                      }}
                      activeOpacity={0.85}
                    >
                      <Text
                        style={[
                          styles.participateBtnText,
                          isRegistered ? styles.participateTextRegistered : null,
                        ]}
                      >
                        {isRegistered ? 'Registered ✓' : `Participate • ₹${comp.entryFee}`}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </ScrollView>
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
    maxWidth: 580,
    maxHeight: '92%',
    padding: 22,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 10,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trophyIcon: {
    fontSize: 22,
    marginRight: 8,
  },
  modalTitle: {
    fontSize: 18,
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
  modalSub: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 18,
    marginBottom: 14,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  filterPill: {
    paddingVertical: 5,
    paddingHorizontal: 14,
    backgroundColor: '#F1F5F9',
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 6,
  },
  filterPillActive: {
    backgroundColor: COLORS.primaryTeal,
  },
  filterText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  filterTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  competitionsList: {
    flexGrow: 0,
  },
  compCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  compCardSelected: {
    borderColor: '#007A78',
    borderWidth: 2,
    backgroundColor: '#FAFFFF',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  titleArea: {
    flex: 1,
  },
  compTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tagBadge: {
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    paddingVertical: 2,
    paddingHorizontal: 6,
    marginRight: 6,
    marginBottom: 2,
  },
  tagText: {
    fontSize: 10.5,
    fontWeight: '600',
    color: '#475569',
  },
  currentBadge: {
    backgroundColor: '#E6F8F7',
    borderWidth: 1,
    borderColor: '#72D6CD',
    borderRadius: 12,
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  currentBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#007A78',
  },
  judgeName: {
    fontSize: 11.5,
    color: '#64748B',
    marginBottom: 4,
  },
  judgeBold: {
    fontWeight: '700',
    color: '#1E293B',
  },
  compAbout: {
    fontSize: 11.5,
    color: '#475569',
    lineHeight: 16,
    marginBottom: 12,
  },
  metricsBox: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingVertical: 10,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#EFF2F5',
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricBorder: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#E2E8F0',
  },
  metricLabel: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '600',
    marginBottom: 2,
  },
  prizeAmount: {
    fontSize: 15,
    fontWeight: '800',
    color: '#007A78',
  },
  feeAmount: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  spotsAmount: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#059669',
  },
  actionBtnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  viewDetailsBtn: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  viewDetailsBtnText: {
    color: '#334155',
    fontSize: 12.5,
    fontWeight: '700',
  },
  participateBtn: {
    flex: 1.3,
    backgroundColor: COLORS.primaryTeal,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    shadowColor: '#005C6E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  participateBtnRegistered: {
    backgroundColor: '#E6F8F7',
    borderWidth: 1,
    borderColor: '#72D6CD',
    shadowOpacity: 0,
    elevation: 0,
  },
  participateBtnText: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '800',
  },
  participateTextRegistered: {
    color: '#007A78',
    fontWeight: '800',
  },
});

export default CompetitionsModal;
