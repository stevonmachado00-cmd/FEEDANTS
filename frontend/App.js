import React, { useState, useEffect } from 'react';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { store } from './src/store';
import CompetitionDetailsScreen from './src/screens/CompetitionDetailsScreen';
import AuthScreen from './src/screens/AuthScreen';
import AdminScreen from './src/screens/AdminScreen';
import { clearUser } from './src/store/slices/userSlice';
import { ThemeProvider } from './src/context/ThemeContext';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('App ErrorBoundary caught:', error, errorInfo);
  }

  handleReload = () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    } else {
      this.setState({ hasError: false, error: null });
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorTitle}>Something went wrong</Text>
          <Text style={styles.errorMessage}>
            {this.state.error?.toString() || 'Unknown error'}
          </Text>
          <TouchableOpacity style={styles.reloadBtn} onPress={this.handleReload}>
            <Text style={styles.reloadText}>Reload App</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return this.props.children;
  }
}

// Master Content Switcher: Handles User & Admin views
const AppContent = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const isAdmin = user?.role === 'admin' || user?.username?.toUpperCase() === 'ADMIN';

  const [adminViewActive, setAdminViewActive] = useState(false);

  useEffect(() => {
    if (isAdmin) {
      setAdminViewActive(true);
    } else {
      setAdminViewActive(false);
    }
  }, [isAdmin, user]);

  // If not authenticated, the Login/Registration page appears first
  if (!isAuthenticated || !user) {
    return <AuthScreen />;
  }

  // If user is Admin and in Admin mode, render Admin Screen
  if (isAdmin && adminViewActive) {
    return (
      <AdminScreen
        onSwitchToUserView={() => setAdminViewActive(false)}
        onLogout={() => dispatch(clearUser())}
      />
    );
  }

  // Once authenticated, the Home / Competition Details page appears
  return (
    <CompetitionDetailsScreen
      isAdmin={isAdmin}
      onOpenAdminPortal={() => setAdminViewActive(true)}
    />
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <SafeAreaProvider>
          <ThemeProvider>
            <StatusBar barStyle="light-content" backgroundColor="#0F172A" />
            <AppContent />
          </ThemeProvider>
        </SafeAreaProvider>
      </Provider>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
    marginBottom: 24,
  },
  reloadBtn: {
    backgroundColor: '#005C6E',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  reloadText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
