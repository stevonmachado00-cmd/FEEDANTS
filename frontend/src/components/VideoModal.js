import React from 'react';
import { View, Text, Modal, TouchableOpacity, Platform, StyleSheet } from 'react-native';

const VideoModal = ({ visible, title, subtitle, videoUrl, onClose }) => {
  const activeVideoUrl =
    videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.titleCol}>
              <View style={styles.badgeRow}>
                <View style={styles.liveBadge}>
                  <Text style={styles.liveDot}>●</Text>
                  <Text style={styles.liveText}>HD VIDEO</Text>
                </View>
                <Text style={styles.formatText}>1080p • Stereo</Text>
              </View>
              <Text style={styles.title} numberOfLines={1}>
                {title || 'Competition Intro Video'}
              </Text>
              {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Real Video Player Container */}
          <View style={styles.playerContainer}>
            {Platform.OS === 'web' ? (
              <video
                key={activeVideoUrl}
                src={activeVideoUrl}
                controls
                autoPlay
                playsInline
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: 14,
                  backgroundColor: '#000000',
                  outline: 'none',
                  objectFit: 'contain',
                }}
              />
            ) : (
              <View style={styles.fallbackPlayer}>
                <View style={styles.playIconContainer}>
                  <Text style={styles.playArrow}>▶</Text>
                </View>
                <Text style={styles.playingText}>Playing: {title}</Text>
                <Text style={styles.streamText}>Feedants High Definition Stream</Text>
              </View>
            )}
          </View>

          {/* Video Footer Info */}
          <View style={styles.footerRow}>
            <Text style={styles.videoNotes}>
              💡 Watch judge expectations, scoring guidelines, and sample performance tips.
            </Text>
            <TouchableOpacity style={styles.doneButton} onPress={onClose} activeOpacity={0.85}>
              <Text style={styles.doneText}>Close Player</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.78)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    backgroundColor: '#0F172A',
    borderRadius: 20,
    width: '100%',
    maxWidth: 680,
    padding: 18,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
    elevation: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  titleCol: {
    flex: 1,
    marginRight: 10,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#059669',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 6,
    marginRight: 8,
  },
  liveDot: {
    color: '#FFFFFF',
    fontSize: 8,
    marginRight: 3,
  },
  liveText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  formatText: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '600',
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  closeBtn: {
    padding: 8,
    backgroundColor: '#1E293B',
    borderRadius: 14,
  },
  closeText: {
    fontSize: 14,
    color: '#94A3B8',
    fontWeight: '700',
  },
  playerContainer: {
    width: '100%',
    height: 380,
    backgroundColor: '#000000',
    borderRadius: 14,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  fallbackPlayer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIconContainer: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#007A78',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  playArrow: {
    color: '#FFFFFF',
    fontSize: 20,
    marginLeft: 3,
  },
  playingText: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 3,
  },
  streamText: {
    color: '#94A3B8',
    fontSize: 11.5,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  videoNotes: {
    flex: 1,
    fontSize: 11.5,
    color: '#94A3B8',
    marginRight: 14,
    lineHeight: 16,
  },
  doneButton: {
    backgroundColor: '#007A78',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  doneText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});

export default VideoModal;
