// Powered by OnSpace.AI
export const Colors = {
  // Base
  background: '#0D1117',
  surface: '#161B22',
  surfaceElevated: '#1C2330',
  surfaceBorder: '#2D3748',

  // Brand
  primary: '#3B82F6',
  primaryLight: '#60A5FA',
  primaryDark: '#2563EB',
  primaryMuted: '#1E3A5F',

  // Accent
  success: '#10B981',
  successMuted: '#064E3B',
  warning: '#F59E0B',
  warningMuted: '#451A03',
  danger: '#EF4444',
  dangerMuted: '#450A0A',
  info: '#06B6D4',
  infoMuted: '#0C4A6E',

  // Text
  textPrimary: '#F0F6FC',
  textSecondary: '#8B949E',
  textMuted: '#484F58',
  textInverse: '#0D1117',

  // Roles
  adminColor: '#A855F7',
  adminMuted: '#2E1065',
  studentColor: '#3B82F6',

  // Status badges
  open: '#F59E0B',
  inProgress: '#3B82F6',
  closed: '#10B981',
  available: '#10B981',
  occupied: '#EF4444',
  reserved: '#F59E0B',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const FontSize = {
  xs: 11,
  sm: 13,
  md: 15,
  body: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  display: 28,
};

export const FontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

export const Shadow = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 10,
  },
};
