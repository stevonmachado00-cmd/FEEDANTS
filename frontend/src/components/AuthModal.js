import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, signupUser } from '../store/slices/userSlice';
import { COLORS } from '../utils/colors';

const AuthModal = ({ visible, onClose, initialMode = 'login', onSuccess }) => {
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.user);

  const [mode, setMode] = useState(initialMode); // 'login' or 'signup'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState('');

  const handleSubmit = async () => {
    if (!username.trim() || !password.trim()) {
      setLocalError('Please enter both username and password.');
      return;
    }

    if (mode === 'signup' && password.length < 6) {
      setLocalError('Password must be at least 6 characters.');
      return;
    }

    setLocalError('');

    if (mode === 'login') {
      const result = await dispatch(loginUser({ username: username.trim(), password }));
      if (loginUser.fulfilled.match(result)) {
        onClose();
        if (onSuccess) onSuccess(result.payload);
      } else {
        setLocalError(result.payload || 'Login failed. Try again.');
      }
    } else {
      const result = await dispatch(
        signupUser({
          username: username.trim(),
          password,
          name: name.trim() || username.trim(),
        })
      );
      if (signupUser.fulfilled.match(result)) {
        onClose();
        if (onSuccess) onSuccess(result.payload);
      } else {
        setLocalError(result.payload || 'Registration failed. Try again.');
      }
    }
  };

  const handleFillDemo = () => {
    setUsername('demo');
    setPassword('password123');
    setLocalError('');
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          {/* Header & Close */}
          <View style={styles.header}>
            <View style={styles.tabRow}>
              <TouchableOpacity
                style={[styles.tab, mode === 'login' && styles.tabActive]}
                onPress={() => {
                  setMode('login');
                  setLocalError('');
                }}
              >
                <Text style={[styles.tabText, mode === 'login' && styles.tabTextActive]}>
                  Login
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.tab, mode === 'signup' && styles.tabActive]}
                onPress={() => {
                  setMode('signup');
                  setLocalError('');
                }}
              >
                <Text style={[styles.tabText, mode === 'signup' && styles.tabTextActive]}>
                  Register
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Subtitle */}
          <Text style={styles.subtitle}>
            {mode === 'login'
              ? 'Sign in with your username and password to continue.'
              : 'Create a new Feedants account with username and password.'}
          </Text>

          {/* Error Message */}
          {localError ? <Text style={styles.errorText}>{localError}</Text> : null}

          {/* Form Fields */}
          {mode === 'signup' && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Rahul Sharma"
                placeholderTextColor="#94A3B8"
                value={name}
                onChangeText={setName}
              />
            </View>
          )}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Username *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. rahul_dancer"
              placeholderTextColor="#94A3B8"
              autoCapitalize="none"
              value={username}
              onChangeText={(text) => {
                setUsername(text);
                setLocalError('');
              }}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password *</Text>
            <View style={styles.passwordWrapper}>
              <TextInput
                style={styles.passwordInput}
                placeholder="••••••••"
                placeholderTextColor="#94A3B8"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setLocalError('');
                }}
              />
              <TouchableOpacity
                style={styles.eyeBtn}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Text style={styles.eyeText}>{showPassword ? 'Hide' : 'Show'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Action Button */}
          <TouchableOpacity
            style={styles.submitBtn}
            onPress={handleSubmit}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.submitText}>
                {mode === 'login' ? 'Log In' : 'Create Account'}
              </Text>
            )}
          </TouchableOpacity>

          {/* Demo helper */}
          {mode === 'login' && (
            <TouchableOpacity onPress={handleFillDemo} style={styles.demoBtn}>
              <Text style={styles.demoText}>⚡ Use Demo Credentials (demo / password123)</Text>
            </TouchableOpacity>
          )}

          {/* Switch tab footer */}
          <TouchableOpacity
            onPress={() => {
              setMode(mode === 'login' ? 'signup' : 'login');
              setLocalError('');
            }}
            style={styles.switchRow}
          >
            <Text style={styles.switchPrompt}>
              {mode === 'login'
                ? "Don't have an account? "
                : 'Already have an account? '}
            </Text>
            <Text style={styles.switchHighlight}>
              {mode === 'login' ? 'Register Now' : 'Log In'}
            </Text>
          </TouchableOpacity>
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
    borderRadius: 20,
    width: '100%',
    maxWidth: 420,
    padding: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 3,
  },
  tab: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 9,
  },
  tabActive: {
    backgroundColor: COLORS.primaryTeal,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  closeBtn: {
    padding: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
  },
  closeText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 18,
    marginBottom: 16,
    marginTop: 4,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: '600',
    backgroundColor: '#FEE2E2',
    padding: 8,
    borderRadius: 8,
    marginBottom: 12,
  },
  inputGroup: {
    marginBottom: 14,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0F172A',
  },
  passwordWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 14,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0F172A',
  },
  eyeBtn: {
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  eyeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#007A78',
  },
  submitBtn: {
    backgroundColor: COLORS.primaryTeal,
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 12,
  },
  submitText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  demoBtn: {
    alignSelf: 'center',
    marginBottom: 14,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  demoText: {
    fontSize: 11,
    color: '#007A78',
    fontWeight: '600',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  switchPrompt: {
    fontSize: 12,
    color: '#64748B',
  },
  switchHighlight: {
    fontSize: 12,
    fontWeight: '800',
    color: '#007A78',
  },
});

export default AuthModal;
