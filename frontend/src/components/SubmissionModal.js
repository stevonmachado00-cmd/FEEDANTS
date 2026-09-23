import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Modal,
  TouchableOpacity,
  ScrollView,
  Platform,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { COLORS } from '../utils/colors';

const SubmissionModal = ({
  visible,
  onClose,
  onSubmit,
  existingSubmission,
  competitionTitle = 'Feedants Competition',
  isLoading,
}) => {
  const [perfTitle, setPerfTitle] = useState(
    existingSubmission?.title || ''
  );
  const [description, setDescription] = useState(
    existingSubmission?.description || ''
  );
  const [videoUrl, setVideoUrl] = useState(
    existingSubmission?.fileUrl || ''
  );
  const [selectedFileName, setSelectedFileName] = useState(
    existingSubmission?.fileName || ''
  );
  const [confirmedOriginal, setConfirmedOriginal] = useState(true);
  const [error, setError] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handlePickLocalFile = () => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'video/*,audio/*,image/*';
      input.onchange = (e) => {
        const file = e.target.files && e.target.files[0];
        if (file) {
          const fileSizeMb = (file.size / (1024 * 1024)).toFixed(1);
          setSelectedFileName(`${file.name} (${fileSizeMb} MB)`);
          if (!videoUrl) {
            setVideoUrl(`file://${file.name}`);
          }
          if (error) setError('');
        }
      };
      input.click();
    } else {
      setSelectedFileName('Recorded_Performance.mp4 (34.2 MB)');
      setVideoUrl('file://Recorded_Performance.mp4');
    }
  };

  const handleSubmit = () => {
    if (!videoUrl.trim() && !selectedFileName) {
      setError('Please provide a video link or choose a performance recording.');
      return;
    }
    if (!confirmedOriginal) {
      setError('Please confirm that this is your original performance.');
      return;
    }
    setError('');
    setIsUploading(true);

    setTimeout(() => {
      setIsUploading(false);
      onSubmit({
        title: perfTitle.trim() || 'Official Entry',
        fileUrl: videoUrl.trim() || selectedFileName,
        fileName: selectedFileName,
        description: description.trim(),
        submittedAt: new Date().toISOString(),
      });
    }, 800);
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
                {existingSubmission ? 'Edit Submission' : 'Submit Your Performance'}
              </Text>
              <Text style={styles.subTitle}>{competitionTitle}</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollArea}>
            <Text style={styles.instruction}>
              Upload your unedited recording or provide a cloud link (YouTube, Google Drive, Vimeo). Our judges will evaluate your entry based on the published judging criteria.
            </Text>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            {/* Performance Title */}
            <Text style={styles.inputLabel}>Performance Title / Track Name</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Kathak Tarana in Teentaal / Acoustic Vocal Solo"
              placeholderTextColor="#94A3B8"
              value={perfTitle}
              onChangeText={setPerfTitle}
            />

            {/* Option A: Choose File from Computer */}
            <Text style={styles.inputLabel}>Performance File Recording</Text>
            <TouchableOpacity
              style={styles.filePickerBox}
              onPress={handlePickLocalFile}
              activeOpacity={0.7}
            >
              <Text style={styles.uploadIcon}>📁</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.pickerTitle}>
                  {selectedFileName ? selectedFileName : 'Click to Browse & Upload Video File'}
                </Text>
                <Text style={styles.pickerSub}>
                  {selectedFileName ? 'File attached • Tap to change' : 'Supports MP4, MOV, AVI, MP3 (Up to 250 MB)'}
                </Text>
              </View>
              <View style={styles.browseBadge}>
                <Text style={styles.browseText}>Browse</Text>
              </View>
            </TouchableOpacity>

            {/* Option B: Or Provide Cloud / Drive / YouTube URL */}
            <Text style={styles.inputLabel}>Or Enter Video Link (YouTube / Drive / Dropbox)</Text>
            <TextInput
              style={styles.input}
              placeholder="https://youtu.be/... or Google Drive link"
              placeholderTextColor="#94A3B8"
              value={videoUrl}
              onChangeText={(text) => {
                setVideoUrl(text);
                if (error) setError('');
              }}
            />

            {/* Description / Raga / Instruments */}
            <Text style={styles.inputLabel}>Choreography / Notes for the Judge (Optional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Mention your Gharana, Taal, Guru, or unique performance context..."
              placeholderTextColor="#94A3B8"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
            />

            {/* Confirmation Checkbox */}
            <TouchableOpacity
              style={styles.checkboxRow}
              onPress={() => setConfirmedOriginal(!confirmedOriginal)}
              activeOpacity={0.8}
            >
              <View style={[styles.checkbox, confirmedOriginal && styles.checkboxActive]}>
                {confirmedOriginal && <Text style={styles.checkMark}>✓</Text>}
              </View>
              <Text style={styles.checkboxText}>
                I confirm this is my original, unedited performance created for this competition.
              </Text>
            </TouchableOpacity>

            {/* Action Buttons */}
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={onClose}
                disabled={isUploading || isLoading}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.submitButton, isUploading && styles.submitButtonDisabled]}
                onPress={handleSubmit}
                disabled={isUploading || isLoading}
                activeOpacity={0.85}
              >
                {isUploading || isLoading ? (
                  <View style={styles.uploadingRow}>
                    <ActivityIndicator color="#FFFFFF" size="small" />
                    <Text style={styles.submitText}>Uploading Entry...</Text>
                  </View>
                ) : (
                  <Text style={styles.submitText}>
                    {existingSubmission ? 'Save Changes' : 'Submit Performance'}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
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
    maxWidth: 540,
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
    color: '#007A78',
    fontWeight: '700',
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
  scrollArea: {
    flexGrow: 0,
  },
  instruction: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 18,
    marginBottom: 14,
  },
  errorText: {
    color: '#DC2626',
    backgroundColor: '#FEF2F2',
    padding: 8,
    borderRadius: 8,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: '#0F172A',
    marginBottom: 14,
  },
  filePickerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDFA',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#72D6CD',
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
  },
  uploadIcon: {
    fontSize: 22,
    marginRight: 10,
  },
  pickerTitle: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  pickerSub: {
    fontSize: 11,
    color: '#007A78',
    marginTop: 2,
  },
  browseBadge: {
    backgroundColor: '#007A78',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginLeft: 8,
  },
  browseText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  textArea: {
    height: 72,
    textAlignVertical: 'top',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#94A3B8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  checkboxActive: {
    backgroundColor: '#007A78',
    borderColor: '#007A78',
  },
  checkMark: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
  },
  checkboxText: {
    flex: 1,
    fontSize: 11.5,
    color: '#475569',
    lineHeight: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 4,
    marginBottom: 8,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginRight: 10,
  },
  cancelText: {
    color: '#475569',
    fontSize: 13,
    fontWeight: '700',
  },
  submitButton: {
    flex: 1.5,
    backgroundColor: COLORS.primaryTeal,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#007A78',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  uploadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  submitText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '800',
    marginLeft: 6,
  },
});

export default SubmissionModal;
