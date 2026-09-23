import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  StyleSheet,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, signupUser } from '../store/slices/userSlice';
import { COLORS } from '../utils/colors';

const AuthScreen = () => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.user);

  const [mode, setMode] = useState('login'); // 'login' or 'signup'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [referrer, setReferrer] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location && window.location.search) {
      const params = new URLSearchParams(window.location.search);
      const refParam = params.get('ref');
      if (refParam) {
        setReferrer(refParam);
        setMode('signup');
      }
    }
  }, []);

  const handleSubmit = async () => {
    if (!username.trim() || !password.trim()) {
      setErrorMsg('Please enter both username and password.');
      setSuccessMsg('');
      return;
    }

    if (mode === 'signup' && password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      setSuccessMsg('');
      return;
    }

    setErrorMsg('');
    setSuccessMsg('');

    if (mode === 'login') {
      const result = await dispatch(loginUser({ username: username.trim(), password }));
      if (loginUser.rejected.match(result)) {
        setErrorMsg(result.payload || 'Account does not exist. Please register first.');
      }
    } else {
      // Registration flow
      const registeredUsername = username.trim();
      const result = await dispatch(
        signupUser({
          username: registeredUsername,
          password,
          name: name.trim() || registeredUsername,
        })
      );

      if (signupUser.fulfilled.match(result)) {
        // Account has been created! Switch to login tab and prompt user to login
        setSuccessMsg(
          `Account registered for @${registeredUsername}! Please enter your password to sign in.`
        );
        setMode('login');
        setPassword('');
      } else {
        setErrorMsg(result.payload || 'Registration failed. Try a different username.');
      }
    }
  };

  return (
    <View style={styles.pageContainer}>
      <View style={styles.cardContainer}>
        {/* Brand Logo / Badge */}
        <View style={styles.brandRow}>
          <View style={styles.brandIconBox}>
            <Text style={styles.brandIcon}>🏆</Text>
          </View>
          <Text style={styles.brandTitle}>FEEDANTS</Text>
        </View>

        <Text style={styles.welcomeHeading}>
          {mode === 'login' ? 'Sign In to Your Account' : 'Register New Account'}
        </Text>
        <Text style={styles.welcomeSub}>
          {mode === 'login'
            ? 'Enter your registered username and password to proceed.'
            : 'Create your account first. After registration, you can log in.'}
        </Text>

        {/* Tab Switcher */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tabBtn, mode === 'login' && styles.tabBtnActive]}
            onPress={() => {
              setMode('login');
              setErrorMsg('');
            }}
            activeOpacity={0.8}
          >
            <Text style={[styles.tabText, mode === 'login' && styles.tabTextActive]}>
              Login
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabBtn, mode === 'signup' && styles.tabBtnActive]}
            onPress={() => {
              setMode('signup');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            activeOpacity={0.8}
          >
            <Text style={[styles.tabText, mode === 'signup' && styles.tabTextActive]}>
              Register
            </Text>
          </TouchableOpacity>
        </View>

        {/* Referral Welcome Banner */}
        {referrer ? (
          <View style={styles.referralWelcomeBox}>
            <Text style={styles.referralWelcomeIcon}>🎁</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.referralWelcomeTitle}>
                Referred by @{referrer}!
              </Text>
              <Text style={styles.referralWelcomeSub}>
                Special 20% discount will be automatically applied to your competition entry fee.
              </Text>
            </View>
          </View>
        ) : null}

        {/* Success Banner */}
        {successMsg ? (
          <View style={styles.successBox}>
            <Text style={styles.successIcon}>✓</Text>
            <Text style={styles.successText}>{successMsg}</Text>
          </View>
        ) : null}

        {/* Error Notification */}
        {errorMsg ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorIcon}>⚠️</Text>
            <View style={styles.errorCol}>
              <Text style={styles.errorText}>{errorMsg}</Text>
              {errorMsg.toLowerCase().includes('register first') && mode === 'login' && (
                <TouchableOpacity
                  onPress={() => {
                    setMode('signup');
                    setErrorMsg('');
                  }}
                  style={styles.errorRegisterLink}
                >
                  <Text style={styles.errorRegisterLinkText}>
                    👉 Click here to Register now
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ) : null}

        {/* Form Fields */}
        {mode === 'signup' && (
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Full Name</Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g. Rahul Sharma"
              placeholderTextColor="#94A3B8"
              value={name}
              onChangeText={setName}
            />
          </View>
        )}

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Username *</Text>
          <TextInput
            style={styles.textInput}
            placeholder="e.g. rahul_dancer"
            placeholderTextColor="#94A3B8"
            autoCapitalize="none"
            value={username}
            onChangeText={(text) => {
              setUsername(text);
              if (errorMsg) setErrorMsg('');
            }}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Password *</Text>
          <View style={styles.passwordWrapper}>
            <TextInput
              style={styles.passwordInput}
              placeholder="••••••••"
              placeholderTextColor="#94A3B8"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errorMsg) setErrorMsg('');
              }}
            />
            <TouchableOpacity
              style={styles.eyeToggle}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Text style={styles.eyeToggleText}>{showPassword ? 'Hide' : 'Show'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={isLoading}
          activeOpacity={0.85}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={styles.submitButtonText}>
              {mode === 'login' ? 'Sign In' : 'Create Account'}
            </Text>
          )}
        </TouchableOpacity>

        {/* Bottom Toggle Prompt */}
        <View style={styles.bottomSwitchRow}>
          <Text style={styles.switchPromptText}>
            {mode === 'login'
              ? "Don't have an account yet?"
              : 'Already created an account?'}
          </Text>
          <TouchableOpacity
            onPress={() => {
              setMode(mode === 'login' ? 'signup' : 'login');
              setErrorMsg('');
              setSuccessMsg('');
            }}
          >
            <Text style={styles.switchActionText}>
              {mode === 'login' ? 'Register Now' : 'Sign In'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Security Footer */}
        <View style={styles.securityFooter}>
          <Text style={styles.securityText}>
            🔒 Verified Accounts Only • Feedants Platform Security
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    ...(Platform.OS === 'web' ? { minHeight: '100vh', width: '100%' } : {}),
  },
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 32,
    width: '100%',
    maxWidth: 440,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 8,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  brandIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#E6F8F7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  brandIcon: {
    fontSize: 20,
  },
  brandTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#005C6E',
    letterSpacing: 1.5,
  },
  welcomeHeading: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 6,
  },
  welcomeSub: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
    padding: 4,
    marginBottom: 20,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  tabBtnActive: {
    backgroundColor: COLORS.primaryTeal,
    shadowColor: '#005C6E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748B',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  successBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    borderRadius: 10,
    padding: 10,
    marginBottom: 16,
  },
  successIcon: {
    fontSize: 14,
    color: '#059669',
    fontWeight: '900',
    marginRight: 8,
  },
  successText: {
    color: '#047857',
    fontSize: 12,
    fontWeight: '700',
    flex: 1,
  },
  referralWelcomeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF9C3',
    borderWidth: 1,
    borderColor: '#FDE047',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  referralWelcomeIcon: {
    fontSize: 22,
    marginRight: 10,
  },
  referralWelcomeTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#854D0E',
    marginBottom: 2,
  },
  referralWelcomeSub: {
    fontSize: 11,
    color: '#713F12',
    lineHeight: 15,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 10,
    padding: 10,
    marginBottom: 16,
  },
  errorIcon: {
    fontSize: 14,
    marginRight: 6,
    marginTop: 1,
  },
  errorCol: {
    flex: 1,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 12,
    fontWeight: '600',
  },
  errorRegisterLink: {
    marginTop: 4,
  },
  errorRegisterLinkText: {
    color: '#007A78',
    fontSize: 12,
    fontWeight: '800',
  },
  fieldGroup: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 6,
  },
  textInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#0F172A',
  },
  passwordWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 14,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    color: '#0F172A',
  },
  eyeToggle: {
    paddingVertical: 6,
    paddingHorizontal: 6,
  },
  eyeToggleText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#007A78',
  },
  submitButton: {
    backgroundColor: COLORS.primaryTeal,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 14,
    shadowColor: '#005C6E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  bottomSwitchRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  switchPromptText: {
    fontSize: 12,
    color: '#64748B',
    marginRight: 4,
  },
  switchActionText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#007A78',
  },
  securityFooter: {
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 14,
    alignItems: 'center',
  },
  securityText: {
    fontSize: 10.5,
    color: '#94A3B8',
    fontWeight: '500',
  },
});

export default AuthScreen;
