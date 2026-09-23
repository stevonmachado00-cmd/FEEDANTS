import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { COLORS } from '../utils/colors';

const StickyActionBar = ({
  isRegistered = false,
  hasSubmission = false,
  isClosed = false,
  isFull = false,
  entryFee = 99,
  isLoading = false,
  onPress,
}) => {
  let title = `Participate Now • ₹${entryFee}`;
  let subTitle = 'Instant UPI, Cards & NetBanking';
  let disabled = false;

  if (isClosed || isFull) {
    title = isFull ? 'Registration Full' : 'Registration Closed';
    subTitle = 'Registrations are no longer accepted';
    disabled = true;
  } else if (isRegistered) {
    if (hasSubmission) {
      title = 'View / Edit Submission';
      subTitle = 'Submitted • Tap to review';
    } else {
      title = 'Upload Submission';
      subTitle = 'Registered';
    }
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.actionButton,
          disabled && styles.disabledButton,
          isRegistered && !hasSubmission && styles.uploadButton,
        ]}
        onPress={onPress}
        disabled={disabled || isLoading}
        activeOpacity={0.85}
      >
        {isLoading ? (
          <ActivityIndicator color="#FFFFFF" size="small" />
        ) : (
          <View style={styles.textContainer}>
            <Text style={styles.buttonTitle}>{title}</Text>
            {subTitle ? <Text style={styles.buttonSubTitle}>{subTitle}</Text> : null}
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    borderTopWidth: 1,
    borderTopColor: '#EFF2F5',
  },
  actionButton: {
    backgroundColor: COLORS.primaryTeal,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#005C6E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  uploadButton: {
    backgroundColor: '#005C6E',
  },
  disabledButton: {
    backgroundColor: '#94A3B8',
    shadowOpacity: 0,
    elevation: 0,
  },
  textContainer: {
    alignItems: 'center',
  },
  buttonTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  buttonSubTitle: {
    color: '#B6E6E3',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
});

export default StickyActionBar;
