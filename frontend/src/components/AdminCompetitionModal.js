import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { COLORS } from '../utils/colors';

const AdminCompetitionModal = ({
  visible,
  onClose,
  onSubmit,
  existingCompetition = null,
}) => {
  const isEditing = !!existingCompetition;

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Classical Dance');
  const [highlight, setHighlight] = useState('Official Certificate & Trophy');
  const [prizePool, setPrizePool] = useState('1500');
  const [entryFee, setEntryFee] = useState('99');
  const [totalSpots, setTotalSpots] = useState('20');
  const [status, setStatus] = useState('registration_open');

  // Judge State
  const [judgeName, setJudgeName] = useState('Manju Dubey');
  const [judgeTitle, setJudgeTitle] = useState('Professional Kathak Dancer');
  const [judgeExp, setJudgeExp] = useState('12+ Years');
  const [judgeVideo, setJudgeVideo] = useState('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4');

  // Dates
  const [regDays, setRegDays] = useState('15');
  const [submissionDays, setSubmissionDays] = useState('30');
  const [resultDays, setResultDays] = useState('45');

  // Rewards
  const [firstPrize, setFirstPrize] = useState('550');
  const [secondPrize, setSecondPrize] = useState('300');
  const [thirdPrize, setThirdPrize] = useState('240');

  // Rules & About
  const [about, setAbout] = useState('Showcase your exceptional talent to recognized industry judges.');
  const [rules, setRules] = useState('• Unedited recording (2-5 mins).\n• Open to all age categories.\n• Upload via MP4 or Drive link.');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (existingCompetition) {
      setTitle(existingCompetition.title || '');
      setCategory(existingCompetition.categories?.[0] || 'Dance');
      setHighlight(existingCompetition.highlight || existingCompetition.highlights?.[0] || '');
      setPrizePool(String(existingCompetition.prizePool || '1500'));
      setEntryFee(String(existingCompetition.entryFee || '99'));
      setTotalSpots(String(existingCompetition.totalSpots || '20'));
      setStatus(existingCompetition.status || 'registration_open');

      setJudgeName(existingCompetition.judge?.name || '');
      setJudgeTitle(existingCompetition.judge?.title || '');
      setJudgeExp(existingCompetition.judge?.experience || '');
      setJudgeVideo(existingCompetition.judge?.introVideoUrl || '');

      setAbout(existingCompetition.details?.about || '');
      setRules(existingCompetition.details?.rulesAndEligibility || '');

      if (existingCompetition.rewards?.[0]) setFirstPrize(String(existingCompetition.rewards[0].amount || '550'));
      if (existingCompetition.rewards?.[1]) setSecondPrize(String(existingCompetition.rewards[1].amount || '300'));
      if (existingCompetition.rewards?.[2]) setThirdPrize(String(existingCompetition.rewards[2].amount || '240'));
    } else {
      // Defaults for new competition
      setTitle('');
      setCategory('Dance');
      setHighlight('Official Certificate & Trophy');
      setPrizePool('2000');
      setEntryFee('129');
      setTotalSpots('25');
      setStatus('registration_open');
      setJudgeName('Dr. Radhika Sen');
      setJudgeTitle('National Performing Arts Scholar');
      setJudgeExp('14+ Years');
      setJudgeVideo('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4');
      setFirstPrize('800');
      setSecondPrize('500');
      setThirdPrize('350');
      setAbout('Express your artistic voice in this prestigious national talent tournament.');
      setRules('• Original recording.\n• Maximum length: 4 minutes.\n• No studio pitch-correction.');
    }
  }, [existingCompetition, visible]);

  const handleSubmit = async () => {
    if (!title.trim()) {
      setError('Please provide a competition title.');
      return;
    }
    setError('');
    setIsLoading(true);

    const now = new Date();
    const daysToMs = (days) => Number(days || 10) * 24 * 3600 * 1000;

    const payload = {
      title: title.trim(),
      categories: [category.trim()],
      highlights: [highlight.trim()],
      highlight: highlight.trim(),
      prizePool: Number(prizePool) || 1000,
      entryFee: Number(entryFee) || 0,
      totalSpots: Number(totalSpots) || 20,
      bookedSpots: existingCompetition?.bookedSpots || 0,
      status,
      judge: {
        name: judgeName.trim() || 'Judge',
        title: judgeTitle.trim() || 'Arts Evaluator',
        experience: judgeExp.trim() || '10+ Years',
        avatarUrl: existingCompetition?.judge?.avatarUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=256',
        introVideoUrl: judgeVideo.trim() || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      },
      timeline: {
        registrationDeadline: new Date(now.getTime() + daysToMs(regDays)).toISOString(),
        submissionStart: new Date(now.getTime() + 2 * 24 * 3600 * 1000).toISOString(),
        submissionEnd: new Date(now.getTime() + daysToMs(submissionDays)).toISOString(),
        resultDate: new Date(now.getTime() + daysToMs(resultDays)).toISOString(),
        registerBefore: { date: `${regDays} Days from now`, time: '11:59 PM' },
        submissionStartLabel: { date: 'In 2 Days', time: '09:00 AM' },
        submissionEndLabel: { date: `${submissionDays} Days from now`, time: '11:59 PM' },
        resultDateLabel: { date: `${resultDays} Days from now`, time: '08:00 PM' },
      },
      rewards: [
        { position: 1, label: '1st Winner', amount: Number(firstPrize) || 500, icon: '🏆' },
        { position: 2, label: '2nd Winner', amount: Number(secondPrize) || 300, icon: '🥈' },
        { position: 3, label: '3rd Winner', amount: Number(thirdPrize) || 200, icon: '🥉' },
      ],
      details: {
        about: about.trim(),
        judgingParameters: '1. Technical Execution (35%)\n2. Expression & Authenticity (35%)\n3. Overall Stage Presence (30%)',
        rulesAndEligibility: rules.trim(),
      },
      previousWinners: existingCompetition?.previousWinners || [
        { id: '1', name: 'Riya Shah', rank: '1st Winner', image: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=256', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' },
      ],
    };

    try {
      await onSubmit(payload, existingCompetition?._id);
      setIsLoading(false);
      onClose();
    } catch (e) {
      setIsLoading(false);
      setError(e.message || 'Failed to save competition.');
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
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>
                {isEditing ? '✏️ Edit Competition' : '✨ Post New Competition'}
              </Text>
              <Text style={styles.subTitle}>
                {isEditing
                  ? 'Update tournament parameters & dates'
                  : 'Publish live to users on the Feedants platform'}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollArea}>
            {/* Section 1: Basic Info */}
            <Text style={styles.sectionHeader}>1. Tournament Basics</Text>

            <Text style={styles.label}>Competition Title *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Feedants Semi-Classical Dance 2026"
              placeholderTextColor="#94A3B8"
              value={title}
              onChangeText={setTitle}
            />

            <View style={styles.row}>
              <View style={styles.halfCol}>
                <Text style={styles.label}>Category</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Dance / Vocal / Acting"
                  placeholderTextColor="#94A3B8"
                  value={category}
                  onChangeText={setCategory}
                />
              </View>
              <View style={styles.halfCol}>
                <Text style={styles.label}>Highlight Badge</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Cash Prize + Trophy"
                  placeholderTextColor="#94A3B8"
                  value={highlight}
                  onChangeText={setHighlight}
                />
              </View>
            </View>

            {/* Section 2: Finances & Capacity */}
            <Text style={styles.sectionHeader}>2. Financials & Capacity</Text>

            <View style={styles.row}>
              <View style={styles.thirdCol}>
                <Text style={styles.label}>Prize Pool (₹)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="1500"
                  keyboardType="numeric"
                  placeholderTextColor="#94A3B8"
                  value={prizePool}
                  onChangeText={setPrizePool}
                />
              </View>
              <View style={styles.thirdCol}>
                <Text style={styles.label}>Entry Fee (₹)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="99"
                  keyboardType="numeric"
                  placeholderTextColor="#94A3B8"
                  value={entryFee}
                  onChangeText={setEntryFee}
                />
              </View>
              <View style={styles.thirdCol}>
                <Text style={styles.label}>Total Spots</Text>
                <TextInput
                  style={styles.input}
                  placeholder="20"
                  keyboardType="numeric"
                  placeholderTextColor="#94A3B8"
                  value={totalSpots}
                  onChangeText={setTotalSpots}
                />
              </View>
            </View>

            {/* Status Toggle */}
            <Text style={styles.label}>Competition Lifecycle Status</Text>
            <View style={styles.statusRow}>
              {['registration_open', 'submission_open', 'completed'].map((st) => (
                <TouchableOpacity
                  key={st}
                  style={[styles.statusChip, status === st && styles.statusChipActive]}
                  onPress={() => setStatus(st)}
                >
                  <Text
                    style={[
                      styles.statusChipText,
                      status === st && styles.statusChipTextActive,
                    ]}
                  >
                    {st === 'registration_open' ? '🟢 Registration Open' : st === 'submission_open' ? '🟡 Submissions Open' : '🏁 Completed'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Section 3: Judge Credentials */}
            <Text style={styles.sectionHeader}>3. Assigned Judge</Text>
            <View style={styles.row}>
              <View style={styles.halfCol}>
                <Text style={styles.label}>Judge Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Manju Dubey"
                  placeholderTextColor="#94A3B8"
                  value={judgeName}
                  onChangeText={setJudgeName}
                />
              </View>
              <View style={styles.halfCol}>
                <Text style={styles.label}>Judge Experience</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. 12+ Years"
                  placeholderTextColor="#94A3B8"
                  value={judgeExp}
                  onChangeText={setJudgeExp}
                />
              </View>
            </View>

            <Text style={styles.label}>Judge Professional Title</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Professional Kathak Dancer & Choreographer"
              placeholderTextColor="#94A3B8"
              value={judgeTitle}
              onChangeText={setJudgeTitle}
            />

            {/* Section 4: Reward Breakdown */}
            <Text style={styles.sectionHeader}>4. Reward Tiers</Text>
            <View style={styles.row}>
              <View style={styles.thirdCol}>
                <Text style={styles.label}>🥇 1st Prize (₹)</Text>
                <TextInput
                  style={styles.input}
                  value={firstPrize}
                  onChangeText={setFirstPrize}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.thirdCol}>
                <Text style={styles.label}>🥈 2nd Prize (₹)</Text>
                <TextInput
                  style={styles.input}
                  value={secondPrize}
                  onChangeText={setSecondPrize}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.thirdCol}>
                <Text style={styles.label}>🥉 3rd Prize (₹)</Text>
                <TextInput
                  style={styles.input}
                  value={thirdPrize}
                  onChangeText={setThirdPrize}
                  keyboardType="numeric"
                />
              </View>
            </View>

            {/* Section 5: Description & Rules */}
            <Text style={styles.sectionHeader}>5. Details & Guidelines</Text>
            <Text style={styles.label}>About Competition</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              multiline
              numberOfLines={3}
              value={about}
              onChangeText={setAbout}
            />

            <Text style={styles.label}>Rules & Eligibility</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              multiline
              numberOfLines={3}
              value={rules}
              onChangeText={setRules}
            />
          </ScrollView>

          {/* Action Buttons */}
          <View style={styles.footerRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose} disabled={isLoading}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.submitBtn, isLoading && styles.submitBtnDisabled]}
              onPress={handleSubmit}
              disabled={isLoading}
              activeOpacity={0.85}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.submitBtnText}>
                  {isEditing ? 'Save Changes' : '🚀 Publish Competition'}
                </Text>
              )}
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
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    width: '100%',
    maxWidth: 620,
    maxHeight: '92%',
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
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  subTitle: {
    fontSize: 12,
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
  errorText: {
    color: '#DC2626',
    backgroundColor: '#FEF2F2',
    padding: 10,
    borderRadius: 8,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 10,
  },
  scrollArea: {
    flexGrow: 0,
    marginBottom: 14,
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '800',
    color: '#007A78',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 10,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  halfCol: {
    flex: 1,
  },
  thirdCol: {
    flex: 1,
  },
  label: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 13,
    color: '#0F172A',
    marginBottom: 12,
  },
  textArea: {
    height: 64,
    textAlignVertical: 'top',
  },
  statusRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
    flexWrap: 'wrap',
  },
  statusChip: {
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  statusChipActive: {
    backgroundColor: '#E6FFFA',
    borderColor: '#007A78',
  },
  statusChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  statusChipTextActive: {
    color: '#007A78',
  },
  footerRow: {
    flexDirection: 'row',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginRight: 10,
  },
  cancelBtnText: {
    color: '#475569',
    fontSize: 13,
    fontWeight: '700',
  },
  submitBtn: {
    flex: 1.8,
    backgroundColor: '#007A78',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#007A78',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  submitBtnDisabled: {
    opacity: 0.6,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '800',
  },
});

export default AdminCompetitionModal;
