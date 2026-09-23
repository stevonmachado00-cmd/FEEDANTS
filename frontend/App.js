import React from 'react';
import { Provider, useSelector } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { store } from './src/store';
import CompetitionDetailsScreen from './src/screens/CompetitionDetailsScreen';
import AuthScreen from './src/screens/AuthScreen';
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

// Master Content Switcher: Shows AuthScreen first until user logs in or registers
const AppContent = () => {
  const { isAuthenticated, user } = useSelector((state) => state.user);

  // If not authenticated, the Login/Registration page appears first
  if (!isAuthenticated || !user) {
    return <AuthScreen />;
  }

  // Once authenticated, the Home / Competition Details page appears
  return <CompetitionDetailsScreen />;
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
