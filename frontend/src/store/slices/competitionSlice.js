import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../../api/competitionApi';

// Array of 4 realistic competitions
export const ALL_COMPETITIONS = [
  {
    _id: 'feedants-dance-01',
    title: 'Feedants Classical Dance',
    categories: ['Dance', 'Multi-Win'],
    highlight: 'Winners get certificate',
    prizePool: 1500,
    entryFee: 99,
    totalSpots: 20,
    bookedSpots: 1,
    judge: {
      name: 'Manju Dubey',
      title: 'Professional Kathak Dancer',
      experience: '12+ Years of Experience',
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=256',
      introVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    },
    timeline: {
      registerBefore: { date: '10 Aug 26', time: '11:50 PM' },
      submissionStart: { date: '6 Aug 26', time: '04:00 AM' },
      submissionEnd: { date: '30 Aug 26', time: '11:55 PM' },
      resultDate: { date: '1 Sept 26', time: '11:50 PM' },
      registrationDeadline: new Date(Date.now() + (1 * 24 + 6) * 3600 * 1000 + 28 * 60 * 1000 + 32 * 1000).toISOString(),
    },
    previousWinners: [
      { id: '1', name: 'Riya Shah', rank: '1st Winner', image: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=256', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' },
      { id: '2', name: 'Aarav Mehta', rank: '1st Winner', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4' },
      { id: '3', name: 'Neha Verma', rank: '2nd Winner', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4' },
      { id: '4', name: 'Ishita Chauhan', rank: '3rd Winner', image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=256', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4' },
    ],
    details: {
      about: 'This is an online classical dance competition open for all age groups. Participate from anywhere and showcase your talent. Express your passion through traditional dance.',
      judgingParameters: '1. Expression & Emotion (Bhava) - 30%\n2. Rhythm & Footwork (Taal & Laya) - 25%\n3. Body Posture & Grace (Angashuddhi) - 25%\n4. Overall Choreography & Presentation - 20%',
      rulesAndEligibility: '• Open to all age groups.\n• Original, unedited classical dance performance recording.\n• Video length between 2 to 5 minutes.\n• Video format: MP4/MOV or accessible drive link.',
    },
    rewards: [
      { position: 1, label: '1st Winner', amount: 550, icon: '🏆' },
      { position: 2, label: '2nd Winner', amount: 300, icon: '🥈' },
      { position: 3, label: '3rd Winner', amount: 240, icon: '🥉' },
      { position: 4, label: '4th Winner', amount: 200, icon: '⭐' },
      { position: 5, label: '5th Winner', amount: 130, icon: '⭐' },
      { position: 6, label: '6th Winner', amount: 80, icon: '⭐' },
    ],
    referralCode: 'referral123',
    status: 'registration_open',
  },
  {
    _id: 'feedants-vocal-02',
    title: 'Feedants Indie Vocal Solo',
    categories: ['Music', 'Solo Vocal'],
    highlight: 'Studio record deal for #1',
    prizePool: 3000,
    entryFee: 149,
    totalSpots: 25,
    bookedSpots: 17,
    judge: {
      name: 'Arijit Sengupta',
      title: 'Vocalist & Indie Record Producer',
      experience: '15+ Years in Bollywood & Indie',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256',
      introVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    },
    timeline: {
      registerBefore: { date: '18 Aug 26', time: '11:59 PM' },
      submissionStart: { date: '10 Aug 26', time: '09:00 AM' },
      submissionEnd: { date: '25 Aug 26', time: '11:59 PM' },
      resultDate: { date: '2 Sept 26', time: '08:00 PM' },
      registrationDeadline: new Date(Date.now() + 5 * 24 * 3600 * 1000).toISOString(),
    },
    previousWinners: [
      { id: '1', name: 'Kabir Das', rank: '1st Winner', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=256', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4' },
      { id: '2', name: 'Simran Kaur', rank: '2nd Winner', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=256', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4' },
    ],
    details: {
      about: 'A national singing stage for passionate vocalists across genres: Bollywood, Sufi, Western, and Classical. Recorded submissions will be evaluated by industry producers.',
      judgingParameters: '1. Vocal Pitch & Sur (Sur-Gyaan) - 35%\n2. Rhythm & Metronome (Taal) - 25%\n3. Emotion & Voice Texture - 25%\n4. Song Choice & Difficulty - 15%',
      rulesAndEligibility: '• Clean acoustic vocal recording with or without backing track.\n• One take audio-visual recording with face clearly visible.\n• Duration: 1.5 to 3 minutes.',
    },
    rewards: [
      { position: 1, label: '1st Winner', amount: 1200, icon: '🏆' },
      { position: 2, label: '2nd Winner', amount: 800, icon: '🥈' },
      { position: 3, label: '3rd Winner', amount: 500, icon: '🥉' },
      { position: 4, label: '4th Winner', amount: 300, icon: '⭐' },
      { position: 5, label: '5th Winner', amount: 200, icon: '⭐' },
    ],
    referralCode: 'sing2026',
    status: 'registration_open',
  },
  {
    _id: 'feedants-drama-03',
    title: 'Feedants Mono-Acting & Drama',
    categories: ['Theatre', 'Acting'],
    highlight: 'Casting call shortlisting',
    prizePool: 2500,
    entryFee: 120,
    totalSpots: 30,
    bookedSpots: 14,
    judge: {
      name: 'Pooja Kashyap',
      title: 'National School of Drama (NSD) Alum',
      experience: '10+ Years in Theatre & Web',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256',
      introVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    },
    timeline: {
      registerBefore: { date: '22 Aug 26', time: '11:00 PM' },
      submissionStart: { date: '12 Aug 26', time: '10:00 AM' },
      submissionEnd: { date: '28 Aug 26', time: '11:59 PM' },
      resultDate: { date: '5 Sept 26', time: '09:00 PM' },
      registrationDeadline: new Date(Date.now() + 8 * 24 * 3600 * 1000).toISOString(),
    },
    previousWinners: [
      { id: '1', name: 'Devendra Patel', rank: '1st Winner', image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=256', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4' },
      { id: '2', name: 'Megha Nair', rank: '2nd Winner', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=256', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4' },
    ],
    details: {
      about: 'Unleash your dramatic intensity. Choose any monologue, dramatic scene, or original dialogue performance to stun the audience and industry casting directors.',
      judgingParameters: '1. Character Embodiment & Expression - 35%\n2. Voice Modulation & Diction - 30%\n3. Body Language & Energy - 25%\n4. Stage Presence - 10%',
      rulesAndEligibility: '• Solo theatrical performance.\n• English, Hindi, or Regional languages supported.\n• Duration: 2 to 4 minutes.',
    },
    rewards: [
      { position: 1, label: '1st Winner', amount: 1000, icon: '🏆' },
      { position: 2, label: '2nd Winner', amount: 700, icon: '🥈' },
      { position: 3, label: '3rd Winner', amount: 450, icon: '🥉' },
      { position: 4, label: '4th Winner', amount: 250, icon: '⭐' },
      { position: 5, label: '5th Winner', amount: 100, icon: '⭐' },
    ],
    referralCode: 'act2026',
    status: 'registration_open',
  },
  {
    _id: 'feedants-art-04',
    title: 'Feedants Digital Art & Illustration',
    categories: ['Art', 'Illustration'],
    highlight: 'Featured exhibition on feed',
    prizePool: 5000,
    entryFee: 199,
    totalSpots: 15,
    bookedSpots: 11,
    judge: {
      name: 'Vikramaditya Roy',
      title: 'Senior Concept Artist & Art Director',
      experience: '14+ Years in AAA Gaming & VFX',
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=256',
      introVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    },
    timeline: {
      registerBefore: { date: '25 Aug 26', time: '11:59 PM' },
      submissionStart: { date: '15 Aug 26', time: '08:00 AM' },
      submissionEnd: { date: '31 Aug 26', time: '11:59 PM' },
      resultDate: { date: '7 Sept 26', time: '07:00 PM' },
      registrationDeadline: new Date(Date.now() + 12 * 24 * 3600 * 1000).toISOString(),
    },
    previousWinners: [
      { id: '1', name: 'Tanvi Joshi', rank: '1st Winner', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4' },
      { id: '2', name: 'Farhan Ali', rank: '2nd Winner', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' },
    ],
    details: {
      about: 'Showcase your finest digital brushstrokes, 2D concept designs, 3D illustrations, or matte paintings. Evaluated on composition, mood, technical execution, and storytelling.',
      judgingParameters: '1. Composition & Visual Storytelling - 30%\n2. Lighting & Color Palette - 30%\n3. Detail & Rendering Quality - 25%\n4. Originality of Concept - 15%',
      rulesAndEligibility: '• High resolution PNG/JPEG or source project link.\n• Must include 1 work-in-progress proof screenshot.\n• Strictly no pure AI generation.',
    },
    rewards: [
      { position: 1, label: '1st Winner', amount: 2200, icon: '🏆' },
      { position: 2, label: '2nd Winner', amount: 1400, icon: '🥈' },
      { position: 3, label: '3rd Winner', amount: 800, icon: '🥉' },
      { position: 4, label: '4th Winner', amount: 400, icon: '⭐' },
      { position: 5, label: '5th Winner', amount: 200, icon: '⭐' },
    ],
    referralCode: 'art2026',
    status: 'registration_open',
  },
];

export const DEFAULT_COMPETITION = ALL_COMPETITIONS[0];

export const fetchAllCompetitions = createAsyncThunk(
  'competition/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.getAllCompetitions();
      return response.data || response;
    } catch (error) {
      return ALL_COMPETITIONS;
    }
  }
);

export const fetchCompetitionDetails = createAsyncThunk(
  'competition/fetchDetails',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.getCompetitionDetails(id);
      return response.data || response;
    } catch (error) {
      // Find from ALL_COMPETITIONS matching ID
      const found = ALL_COMPETITIONS.find((c) => c._id === id);
      return found || DEFAULT_COMPETITION;
    }
  }
);

export const registerForCompetition = createAsyncThunk(
  'competition/register',
  async (compId, { rejectWithValue }) => {
    try {
      const data = await api.registerForCompetition(compId);
      return data;
    } catch (error) {
      return { success: true, bookedSpots: 2 };
    }
  }
);

const initialState = {
  competition: DEFAULT_COMPETITION,
  allCompetitions: ALL_COMPETITIONS,
  isLoading: false,
  error: null,
  registrationStatus: 'idle',
};

const competitionSlice = createSlice({
  name: 'competition',
  initialState,
  reducers: {
    setCompetition: (state, action) => {
      state.competition = action.payload;
    },
    addCompetitionLocally: (state, action) => {
      state.allCompetitions = [action.payload, ...state.allCompetitions];
      state.competition = action.payload;
    },
    updateCompetitionLocally: (state, action) => {
      const idx = state.allCompetitions.findIndex((c) => c._id === action.payload._id);
      if (idx !== -1) {
        state.allCompetitions[idx] = { ...state.allCompetitions[idx], ...action.payload };
      }
      if (state.competition?._id === action.payload._id) {
        state.competition = { ...state.competition, ...action.payload };
      }
    },
    deleteCompetitionLocally: (state, action) => {
      state.allCompetitions = state.allCompetitions.filter((c) => c._id !== action.payload);
      if (state.competition?._id === action.payload) {
        state.competition = state.allCompetitions[0] || DEFAULT_COMPETITION;
      }
    },
    updateSpots: (state, action) => {
      if (state.competition) {
        state.competition.bookedSpots = action.payload.bookedSpots;
        state.competition.totalSpots = action.payload.totalSpots;
      }
    },
    incrementSpots: (state) => {
      if (state.competition && state.competition.bookedSpots < state.competition.totalSpots) {
        state.competition.bookedSpots += 1;
      }
    },
    clearError: (state) => {
      state.error = null;
    },
    resetRegistrationStatus: (state) => {
      state.registrationStatus = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllCompetitions.fulfilled, (state, action) => {
        if (action.payload && action.payload.length > 0) {
          state.allCompetitions = action.payload;
        }
      })
      .addCase(fetchCompetitionDetails.pending, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(fetchCompetitionDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.competition = action.payload || DEFAULT_COMPETITION;
      })
      .addCase(fetchCompetitionDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.competition = DEFAULT_COMPETITION;
      })
      .addCase(registerForCompetition.pending, (state) => {
        state.registrationStatus = 'loading';
      })
      .addCase(registerForCompetition.fulfilled, (state, action) => {
        state.registrationStatus = 'success';
        if (state.competition) {
          state.competition.bookedSpots = (state.competition.bookedSpots || 1) + 1;
        }
      })
      .addCase(registerForCompetition.rejected, (state, action) => {
        state.registrationStatus = 'failed';
        state.error = action.payload;
      });
  },
});

export const {
  setCompetition,
  addCompetitionLocally,
  updateCompetitionLocally,
  deleteCompetitionLocally,
  updateSpots,
  incrementSpots,
  clearError,
  resetRegistrationStatus,
} = competitionSlice.actions;
export default competitionSlice.reducer;
