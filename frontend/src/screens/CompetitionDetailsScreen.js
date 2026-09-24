import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StatusBar,
  SafeAreaView,
  Alert,
  Platform,
  StyleSheet,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchCompetitionDetails,
  registerForCompetition,
  setCompetition,
  incrementSpots,
  DEFAULT_COMPETITION,
} from '../store/slices/competitionSlice';
import { clearUser } from '../store/slices/userSlice';
import { TRANSLATIONS } from '../utils/translations';

// Components
import Header from '../components/Header';
import HeroCard from '../components/HeroCard';
import JudgeCard from '../components/JudgeCard';
import CountdownBanner from '../components/CountdownBanner';
import ImportantDates from '../components/ImportantDates';
import PreviousWinners from '../components/PreviousWinners';
import DetailsTabs from '../components/DetailsTabs';
import RewardsTable from '../components/RewardsTable';
import TrustBadges from '../components/TrustBadges';
import ReferralBanner from '../components/ReferralBanner';
import UserTestimonials from '../components/UserTestimonials';
import AdBanner from '../components/AdBanner';
import StickyActionBar from '../components/StickyActionBar';
import BottomNavBar from '../components/BottomNavBar';
import VideoModal from '../components/VideoModal';
import SubmissionModal from '../components/SubmissionModal';
import AuthModal from '../components/AuthModal';
import ProfileModal from '../components/ProfileModal';
import CompetitionsModal from '../components/CompetitionsModal';
import ParticipationPaymentModal from '../components/ParticipationPaymentModal';
import TestimonialsModal from '../components/TestimonialsModal';
import RefundPolicyModal from '../components/RefundPolicyModal';

const CompetitionDetailsScreen = ({
  navigation,
  route,
  isAdmin,
  onOpenAdminPortal,
}) => {
  const dispatch = useDispatch();
  const { competition } = useSelector((state) => state.competition);
  const { user, isAuthenticated } = useSelector((state) => state.user);

  // Screen State
  const [currentLang, setCurrentLang] = useState('ENG');
  const [registeredCompIds, setRegisteredCompIds] = useState(['feedants-dance-01']);
  const [submission, setSubmission] = useState(null);
  const [videoModal, setVideoModal] = useState({
    visible: false,
    title: '',
    subtitle: '',
    videoUrl: '',
  });
  const [submissionModalVisible, setSubmissionModalVisible] = useState(false);
  const [authModalVisible, setAuthModalVisible] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login');
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [competitionsModalVisible, setCompetitionsModalVisible] = useState(false);
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [paymentTargetComp, setPaymentTargetComp] = useState(null);
  const [testimonialsModalVisible, setTestimonialsModalVisible] = useState(false);
  const [refundModalVisible, setRefundModalVisible] = useState(false);
  const [activeNavTab, setActiveNavTab] = useState('Competitions');

  const compData = competition || DEFAULT_COMPETITION;
  const isRegistered = registeredCompIds.includes(compData._id);
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.ENG;

  useEffect(() => {
    const compId = route?.params?.id || compData._id || 'active';
    dispatch(fetchCompetitionDetails(compId));
  }, [dispatch, route?.params?.id]);

  // Handlers
  const handleGoBack = () => {
    if (navigation && navigation.canGoBack && navigation.canGoBack()) {
      navigation.goBack();
    } else {
      Alert.alert(t.goBack, 'Navigating back to Feedants home.');
    }
  };

  const handleToggleLang = (lang) => {
    setCurrentLang(lang);
  };

  const handlePressAuth = () => {
    if (user || isAuthenticated) {
      setProfileModalVisible(true);
    } else {
      setAuthModalMode('login');
      setAuthModalVisible(true);
    }
  };

  const handlePlayJudgeIntro = () => {
    setVideoModal({
      visible: true,
      title: `${compData.judge?.name || 'Judge'} - ${t.introVideo}`,
      subtitle: compData.judge?.title || 'Competition Judge • Intro & Guidelines',
      videoUrl:
        compData.judge?.introVideoUrl ||
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    });
  };

  const handleSelectWinner = (winner) => {
    setVideoModal({
      visible: true,
      title: `${winner.name} (${winner.rank || 'Winner'})`,
      subtitle: 'Previous Competition Performance',
      videoUrl:
        winner.videoUrl ||
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    });
  };

  const handleWatchPrizeVideo = () => {
    setVideoModal({
      visible: true,
      title: t.prizeQuestion,
      subtitle: 'Direct bank & UPI disbursement powered by Razorpay',
      videoUrl:
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    });
  };

  const handleOpenRefundPolicy = () => {
    setRefundModalVisible(true);
  };

  const handleOpenTestimonials = () => {
    setTestimonialsModalVisible(true);
  };

  const handleActionPress = () => {
    if (!user && !isAuthenticated) {
      setAuthModalMode('login');
      setAuthModalVisible(true);
      return;
    }

    if (!isRegistered) {
      setPaymentTargetComp(compData);
      setPaymentModalVisible(true);
    } else {
      setSubmissionModalVisible(true);
    }
  };

  const handleOpenParticipatePayment = (comp) => {
    if (!user && !isAuthenticated) {
      setAuthModalMode('login');
      setAuthModalVisible(true);
      return;
    }
    setPaymentTargetComp(comp);
    setPaymentModalVisible(true);
  };

  const handlePaymentSuccess = (paidComp, receipt) => {
    if (!registeredCompIds.includes(paidComp._id)) {
      setRegisteredCompIds((prev) => [...prev, paidComp._id]);
    }
    dispatch(setCompetition(paidComp));
    dispatch(incrementSpots());
  };

  const handleSubmitEntry = ({ fileUrl, description }) => {
    setSubmission({ fileUrl, description, submittedAt: new Date().toISOString() });
    setSubmissionModalVisible(false);
    Alert.alert('Submission Received!', 'Your performance has been uploaded for evaluation.');
  };

  const handleTabPress = (tabName) => {
    setActiveNavTab(tabName);
    if (tabName === 'Profile') {
      setProfileModalVisible(true);
    } else if (tabName === 'Competitions') {
      setCompetitionsModalVisible(true);
    } else {
      Alert.alert(tabName, `Navigating to ${tabName} section.`);
    }
  };

  const handleSelectCompetition = (selectedComp) => {
    dispatch(setCompetition(selectedComp));
  };

  return (
    <SafeAreaView style={styles.websiteWrapper}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Full Website Header Bar */}
      <View style={styles.webHeaderWrapper}>
        <View style={styles.webHeaderContent}>
          <Header
            onBack={handleGoBack}
            currentLang={currentLang}
            onToggleLang={handleToggleLang}
            user={user}
            onPressAuth={handlePressAuth}
          />
        </View>
      </View>

      {/* Admin Mode Quick Action Bar */}
      {isAdmin && (
        <View style={styles.adminBarBanner}>
          <View style={styles.adminBarContent}>
            <Text style={styles.adminBarText}>🛡️ Logged in as Administrator</Text>
            <TouchableOpacity
              style={styles.adminPortalBtn}
              onPress={onOpenAdminPortal}
              activeOpacity={0.8}
            >
              <Text style={styles.adminPortalBtnText}>Open Admin Dashboard ➔</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Main Website Body Container */}
      <ScrollView
        style={styles.webScrollView}
        contentContainerStyle={styles.webScrollContent}
        showsVerticalScrollIndicator={true}
      >
        <View style={styles.webContentContainer}>
          {/* Hero Card */}
          <HeroCard
            title={compData.title}
            isRegistered={isRegistered}
            categories={compData.categories}
            highlight={compData.highlight}
            prizePool={compData.prizePool}
            entryFee={compData.entryFee}
            bookedSpots={compData.bookedSpots}
            totalSpots={compData.totalSpots}
          />

          {/* Judge Profile Card */}
          <JudgeCard
            name={compData.judge?.name}
            title={compData.judge?.title}
            experience={compData.judge?.experience}
            avatarUrl={compData.judge?.avatarUrl}
            onPlayIntro={handlePlayJudgeIntro}
          />

          {/* Live Countdown Banner */}
          <CountdownBanner
            targetDate={compData.timeline?.registrationDeadline}
          />

          {/* Important Dates (2x2 Grid) */}
          <ImportantDates
            timeline={compData.timeline}
            competitionTitle={compData.title}
          />

          {/* Previous Winners Carousel */}
          <PreviousWinners
            winners={compData.previousWinners}
            onSelectWinner={handleSelectWinner}
          />

          {/* About / Judging / Rules Tabs */}
          <DetailsTabs details={compData.details} />

          {/* Rewards Breakdown List */}
          <RewardsTable rewards={compData.rewards} />

          {/* Trust, Video & Razorpay Badges */}
          <TrustBadges
            onWatchPrizeVideo={handleWatchPrizeVideo}
            onOpenRefundPolicy={handleOpenRefundPolicy}
          />

          {/* Referral Card */}
          <ReferralBanner
            referralCode={user?.username || compData.referralCode || 'feedants2026'}
            competition={compData}
            user={user}
            title={t.referTitle}
            copyLabel={t.copyLink}
            copiedLabel={t.copied}
            referNowLabel={t.referNow}
            rewardText={t.referReward}
          />

          {/* Hear From Our Users */}
          <UserTestimonials onPress={handleOpenTestimonials} />

          {/* Ad Placeholder Banner */}
          <AdBanner />
        </View>
      </ScrollView>

      {/* Sticky Bottom Action & Navigation Bar */}
      <View style={styles.webBottomWrapper}>
        <View style={styles.webBottomContent}>
          {/* Sticky Bottom Action Button */}
          <StickyActionBar
            isRegistered={isRegistered}
            hasSubmission={!!submission}
            isClosed={compData.status === 'registration_closed'}
            isFull={compData.bookedSpots >= compData.totalSpots}
            entryFee={compData.entryFee}
            onPress={handleActionPress}
          />

          {/* Bottom 5-Tab Navigation Bar */}
          <BottomNavBar
            activeTab={activeNavTab}
            onTabPress={handleTabPress}
          />
        </View>
      </View>

      {/* Modals for 100% Interactivity */}
      <VideoModal
        visible={videoModal.visible}
        title={videoModal.title}
        subtitle={videoModal.subtitle}
        videoUrl={videoModal.videoUrl}
        onClose={() => setVideoModal({ ...videoModal, visible: false })}
      />

      <SubmissionModal
        visible={submissionModalVisible}
        existingSubmission={submission}
        competitionTitle={compData.title}
        onClose={() => setSubmissionModalVisible(false)}
        onSubmit={handleSubmitEntry}
      />

      {/* User Login & Registration Modal */}
      <AuthModal
        visible={authModalVisible}
        initialMode={authModalMode}
        onClose={() => setAuthModalVisible(false)}
        onSuccess={(loggedUser) => {
          Alert.alert(
            'Welcome!',
            `Successfully signed in as @${loggedUser.username || loggedUser.name}!`
          );
        }}
      />

      {/* User Profile & Participation Details Modal */}
      <ProfileModal
        visible={profileModalVisible}
        onClose={() => setProfileModalVisible(false)}
        user={user}
        competition={compData}
        isRegistered={isRegistered}
        registeredIds={registeredCompIds}
        submission={submission}
      />

      {/* Live Competitions Explorer Modal */}
      <CompetitionsModal
        visible={competitionsModalVisible}
        onClose={() => setCompetitionsModalVisible(false)}
        onSelectCompetition={handleSelectCompetition}
        onParticipate={handleOpenParticipatePayment}
        registeredIds={registeredCompIds}
      />

      {/* Participation & Payment Checkout Modal */}
      <ParticipationPaymentModal
        visible={paymentModalVisible}
        onClose={() => setPaymentModalVisible(false)}
        competition={paymentTargetComp || compData}
        user={user}
        onPaymentSuccess={handlePaymentSuccess}
      />

      {/* Verified Participant Stories / Testimonials Modal */}
      <TestimonialsModal
        visible={testimonialsModalVisible}
        onClose={() => setTestimonialsModalVisible(false)}
      />

      {/* 100% Refund & Fair Play Policy Modal */}
      <RefundPolicyModal
        visible={refundModalVisible}
        onClose={() => setRefundModalVisible(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  websiteWrapper: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    ...(Platform.OS === 'web' ? { minHeight: '100vh', width: '100%' } : {}),
  },
  webHeaderWrapper: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EFF2F5',
    width: '100%',
    alignItems: 'center',
    zIndex: 10,
  },
  webHeaderContent: {
    width: '100%',
    maxWidth: 760,
  },
  adminBarBanner: {
    backgroundColor: '#0F172A',
    width: '100%',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  adminBarContent: {
    width: '100%',
    maxWidth: 760,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  adminBarText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '700',
  },
  adminPortalBtn: {
    backgroundColor: '#007A78',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  adminPortalBtnText: {
    color: '#FFFFFF',
    fontSize: 11.5,
    fontWeight: '800',
  },
  webScrollView: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    width: '100%',
  },
  webScrollContent: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 40,
  },
  webContentContainer: {
    width: '100%',
    maxWidth: 760,
  },
  webBottomWrapper: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#EFF2F5',
    width: '100%',
    alignItems: 'center',
    zIndex: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  webBottomContent: {
    width: '100%',
    maxWidth: 760,
  },
});

export default CompetitionDetailsScreen;
