import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const DetailsTabs = ({ details }) => {
  const [activeTab, setActiveTab] = useState('about');
  const [isExpanded, setIsExpanded] = useState(false);

  const tabs = [
    { key: 'about', label: 'About Competition' },
    { key: 'judging', label: 'Judging Parameters' },
    { key: 'rules', label: 'Rules & Eligibility' },
  ];

  const contentMap = {
    about:
      details?.about ||
      'This is an online classical dance competition open for all age groups. Participate from anywhere and showcase your talent. Express your passion through traditional dance. Whether you perform Kathak, Bharatanatyam, Odissi, or Kuchipudi, this platform celebrates the rich heritage and artistic excellence of Indian classical traditions.',
    judging:
      details?.judgingParameters ||
      '1. Expression & Emotion (Bhava & Rasa) - 30%\n2. Rhythm & Footwork (Taal & Laya) - 25%\n3. Body Posture & Grace (Angashuddhi) - 25%\n4. Costume & Presentation - 20%',
    rules:
      details?.rulesAndEligibility ||
      '• Open for all participants across the globe.\n• High definition video recording without cuts or heavy post-editing.\n• Maximum video duration: 5 minutes.\n• Only registered participants can submit entries before the deadline.',
  };

  const currentContent = contentMap[activeTab];

  return (
    <View style={styles.card}>
      {/* Tabs Header */}
      <View style={styles.tabsHeader}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tabButton, isActive && styles.tabButtonActive]}
              onPress={() => setActiveTab(tab.key)}
              activeOpacity={0.7}
            >
              <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Tab Body */}
      <View style={styles.contentContainer}>
        <Text
          style={styles.contentText}
          numberOfLines={isExpanded ? undefined : 3}
        >
          {currentContent}
        </Text>

        <TouchableOpacity
          style={styles.viewMoreButton}
          onPress={() => setIsExpanded(!isExpanded)}
          activeOpacity={0.7}
        >
          <Text style={styles.viewMoreText}>
            {isExpanded ? 'View less ⌃' : 'View more ⌄'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 12,
    marginHorizontal: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#EFF2F5',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  tabsHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    marginBottom: 12,
  },
  tabButton: {
    paddingVertical: 8,
    marginRight: 16,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabButtonActive: {
    borderBottomColor: '#007A78',
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  tabLabelActive: {
    color: '#007A78',
    fontWeight: '700',
  },
  contentContainer: {
    paddingTop: 4,
  },
  contentText: {
    fontSize: 12,
    lineHeight: 19,
    color: '#475569',
  },
  viewMoreButton: {
    alignSelf: 'center',
    marginTop: 8,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  viewMoreText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#007A78',
  },
});

export default DetailsTabs;
