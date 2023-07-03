export const daysArray = [
  'monday',
  'tuesday',
  'wednesday',
  'thrusday',
  'friday',
  'saturday',
  'sunday'
];
export const hourArray = [...Array(12).keys()].map((i) => {
  return i < 9 ? '0' + (i + 1) : i + 1;
});
export const minuteArray = [...Array(60).keys()].map((i) => {
  return i < 10 ? '0' + i : i.toString();
});
export const formatArray = ['am', 'pm'];
export const scheduleTypes = [
  { id: 1, schedule_type: 'Regular' },
  { id: 2, schedule_type: 'Before' },
  { id: 3, schedule_type: 'After' },
];
export const monthArray = [...Array(60).keys()].map((i) => {
  return i < 10 ? '0' + (i + 1) : i + 1;
});
export const yearArray = [
  '2000',
  '2001',
  '2002',
  '2003',
  '2004',
  '2005',
  '2006',
  '2007',
  '2008',
  '2009',
  '2010',
];

export const monthNameArray = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'June',
  'July',
  'Aug',
  'Sept',
  'Oct',
  'Nov',
  'Dec',
];
export const notificationPermissions = [
  { id: 1, value: 'User messages', slug: 'user_messages' },
  { id: 2, value: 'Waitlist notifications', slug: 'waitlist_notifications' },
  { id: 3, value: 'New online applications', slug: 'new_online_applications' },
  { id: 4, value: 'Enrollment requests', slug: 'enrollment_requests' },
  { id: 5, value: 'New enrollment packages', slug: 'new_enrollment_packages' },
  { id: 6, value: 'Monthly usage summary', slug: 'monthly_usage_summary' },
  {
    id: 7,
    value: 'Affiliated provider requests',
    slug: 'affiliated_provider_requests',
  },
  {
    id: 8,
    value: 'Marketing from Kids Care Finder Affiliates',
    slug: 'marketing_from_KCF_affiliates',
  },
];
export const subscriptionPlans = {
  1:{
    id: 1,
    value: 'PREMIUM_WITH_SRO',
    slug: 'Premium with Search Result Optimization',
  },
  3:{ id: 3, value: 'BASIC', slug: 'Basic' },
  2:{ id: 2, value: 'PREMIUM', slug: 'Premium' },
};

export const nameValidationRegex = /^[A-Za-z]+$/
export const passwordValidationRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
