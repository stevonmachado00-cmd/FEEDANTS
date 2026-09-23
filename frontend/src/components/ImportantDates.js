import React from 'react';
import { View, Text, TouchableOpacity, Platform, Linking, StyleSheet } from 'react-native';

const ImportantDates = ({ timeline, competitionTitle }) => {
  const dates = [
    {
      icon: '🗓️',
      label: 'Register Before',
      date: timeline?.registerBefore?.date || '10 Aug 26',
      time: timeline?.registerBefore?.time || '11:50 PM',
    },
    {
      icon: '🚀',
      label: 'Submission Starts',
      date: timeline?.submissionStart?.date || '6 Aug 26',
      time: timeline?.submissionStart?.time || '04:00 AM',
    },
    {
      icon: '📤',
      label: 'Submission Ends',
      date: timeline?.submissionEnd?.date || '30 Aug 26',
      time: timeline?.submissionEnd?.time || '11:55 PM',
    },
    {
      icon: '🏆',
      label: 'Result Date',
      date: timeline?.resultDate?.date || '1 Sept 26',
      time: timeline?.resultDate?.time || '11:50 PM',
    },
  ];

  const handleAddToCalendar = () => {
    const title = competitionTitle || 'Feedants Competition';
    const calUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`${title} - Submission Deadline`)}&details=${encodeURIComponent(`Feedants competition deadline reminder! Be sure to submit your performance video before ${dates[2].date} ${dates[2].time}. Results will be evaluated on ${dates[3].date}.`)}&location=https://feedants.com`;

    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.open(calUrl, '_blank');
    } else {
      Linking.openURL(calUrl).catch(() => {});
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.titleRow}>
        <Text style={styles.sectionTitle}>Important Dates</Text>
        <View style={styles.liveIndicator}>
          <Text style={styles.liveDot}>●</Text>
          <Text style={styles.liveText}>Timeline Active</Text>
        </View>
      </View>
      
      <View style={styles.grid}>
        {/* Row 1 */}
        <View style={styles.row}>
          <View style={[styles.cell, styles.cellRightBorder]}>
            <Text style={styles.cellIcon}>{dates[0].icon}</Text>
            <View style={styles.textContainer}>
              <Text style={styles.label}>{dates[0].label}</Text>
              <Text style={styles.dateText}>{dates[0].date}</Text>
              <Text style={styles.timeText}>{dates[0].time}</Text>
            </View>
          </View>

          <View style={styles.cell}>
            <Text style={styles.cellIcon}>{dates[1].icon}</Text>
            <View style={styles.textContainer}>
              <Text style={styles.label}>{dates[1].label}</Text>
              <Text style={styles.dateText}>{dates[1].date}</Text>
              <Text style={styles.timeText}>{dates[1].time}</Text>
            </View>
          </View>
        </View>

        <View style={styles.horizontalDivider} />

        {/* Row 2 */}
        <View style={styles.row}>
          <View style={[styles.cell, styles.cellRightBorder]}>
            <Text style={styles.cellIcon}>{dates[2].icon}</Text>
            <View style={styles.textContainer}>
              <Text style={styles.label}>{dates[2].label}</Text>
              <Text style={styles.dateText}>{dates[2].date}</Text>
              <Text style={styles.timeText}>{dates[2].time}</Text>
            </View>
          </View>

          <View style={styles.cell}>
            <Text style={styles.cellIcon}>{dates[3].icon}</Text>
            <View style={styles.textContainer}>
              <Text style={styles.label}>{dates[3].label}</Text>
              <Text style={styles.dateText}>{dates[3].date}</Text>
              <Text style={styles.timeText}>{dates[3].time}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Add Deadlines to Google Calendar Button */}
      <TouchableOpacity
        style={styles.calendarBtn}
        onPress={handleAddToCalendar}
        activeOpacity={0.7}
      >
        <Text style={styles.calendarBtnIcon}>📅</Text>
        <Text style={styles.calendarBtnText}>Add Deadlines to Google Calendar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  liveDot: {
    color: '#059669',
    fontSize: 8,
    marginRight: 4,
  },
  liveText: {
    color: '#059669',
    fontSize: 10,
    fontWeight: '700',
  },
  grid: {
    borderRadius: 8,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  cellRightBorder: {
    borderRightWidth: 1,
    borderRightColor: '#F1F5F9',
  },
  horizontalDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
  },
  cellIcon: {
    fontSize: 18,
    marginRight: 10,
    marginTop: 2,
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '500',
    marginBottom: 2,
  },
  dateText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#007A78',
    lineHeight: 18,
  },
  timeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
    lineHeight: 16,
  },
  calendarBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0FDFA',
    borderWidth: 1,
    borderColor: '#CCFBF1',
    borderRadius: 10,
    paddingVertical: 8,
  },
  calendarBtnIcon: {
    fontSize: 13,
    marginRight: 6,
  },
  calendarBtnText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#007A78',
  },
});

export default ImportantDates;
