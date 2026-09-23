import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';

const DEFAULT_WINNERS = [
  {
    id: '1',
    name: 'Riya Shah',
    rank: '1st Winner',
    image: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=256',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  },
  {
    id: '2',
    name: 'Aarav Mehta',
    rank: '1st Winner',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  },
  {
    id: '3',
    name: 'Neha Verma',
    rank: '2nd Winner',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  },
  {
    id: '4',
    name: 'Ishita Chauhan',
    rank: '3rd Winner',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=256',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  },
];

const PreviousWinners = ({ winners = DEFAULT_WINNERS, onSelectWinner }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Previous Winners</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollList}
      >
        {winners.map((winner) => (
          <TouchableOpacity
            key={winner.id || winner._id || winner.name}
            style={styles.winnerCard}
            onPress={() => onSelectWinner && onSelectWinner(winner)}
            activeOpacity={0.8}
          >
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: winner.image || winner.avatarUrl || 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=256' }}
                style={styles.winnerImage}
              />
              <View style={styles.playBadge}>
                <Text style={styles.playIcon}>▶</Text>
              </View>
            </View>

            <View style={styles.infoCol}>
              <Text style={styles.winnerName} numberOfLines={1}>
                {winner.name}
              </Text>
              <Text style={styles.winnerRank}>
                {winner.rank || (winner.position ? `${winner.position} Winner` : 'Winner')}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    marginHorizontal: 16,
    marginBottom: 10,
  },
  scrollList: {
    paddingHorizontal: 16,
  },
  winnerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 8,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#EFF2F5',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
    width: 175,
  },
  imageContainer: {
    position: 'relative',
    marginRight: 10,
  },
  winnerImage: {
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: '#E5E7EB',
  },
  playBadge: {
    position: 'absolute',
    bottom: -3,
    right: -3,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#007A78',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIcon: {
    color: '#FFFFFF',
    fontSize: 8,
    marginLeft: 1,
  },
  infoCol: {
    flex: 1,
    justifyContent: 'center',
  },
  winnerName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 2,
  },
  winnerRank: {
    fontSize: 11,
    fontWeight: '700',
    color: '#007A78',
  },
});

export default PreviousWinners;
