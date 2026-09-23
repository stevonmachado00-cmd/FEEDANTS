export const formatCurrency = (amount) => {
  if (amount == null) return '₹ 0';
  return '₹ ' + amount.toLocaleString('en-IN');
};

export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const options = { day: '2-digit', month: 'short', year: '2-digit' };
  return date.toLocaleDateString('en-GB', options).replace(/ /g, ' ');
};

export const formatTime = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
};

export const formatCountdown = (targetDate) => {
  if (!targetDate) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  const now = new Date().getTime();
  const target = new Date(targetDate).getTime();
  const difference = target - now;

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((difference % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds };
};

export const getCompetitionStatus = (competition) => {
  if (!competition) return 'Unknown';
  const now = new Date().getTime();
  const start = new Date(competition.startDate).getTime();
  const end = new Date(competition.endDate).getTime();

  if (now < start) return 'Upcoming';
  if (now >= start && now <= end) return 'Live';
  return 'Ended';
};

export const getUserState = (isRegistered, hasSubmission, competition) => {
  if (hasSubmission) return 'submitted';
  if (isRegistered) return 'registered';
  
  const now = new Date().getTime();
  const end = new Date(competition?.registrationDeadline || competition?.endDate).getTime();
  
  if (now > end || (competition?.totalSpots && competition?.bookedSpots >= competition?.totalSpots)) {
    return 'registration_closed';
  }
  
  return 'not_registered';
};

export const truncateText = (text, maxLength) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};
