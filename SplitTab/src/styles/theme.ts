// src/styles/theme.ts

import { COLORS, TEXT_SIZES } from '../constants/config';

export const theme = {
  colors: {
    ...COLORS,
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },

  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
  },

  typography: {
    fontSizes: TEXT_SIZES,
    fontWeights: {
      light: '300' as const,
      normal: '400' as const,
      medium: '500' as const,
      semibold: '600' as const,
      bold: '700' as const,
    },
  },

  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.08,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 5,
    },
  },
};

// ✅ Style helpers
export const styleUtils = {
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  spaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fullScreen: {
    flex: 1,
  },
  absoluteFill: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
};

// ✅ Color helpers (cleaned)
export const colorUtils = {
  hexToRgba: (hex: string, alpha = 1): string => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  },

  getBalanceColor: (balance: number): string => {
    if (balance > 0.01) return COLORS.SUCCESS;
    if (balance < -0.01) return COLORS.DANGER;
    return COLORS.TEXT_TERTIARY;
  },

  getCategoryColor: (category: string): string => {
    const map: Record<string, string> = {
      Food: '#FF6B6B',
      Travel: '#4ECDC4',
      Utilities: '#FFE66D',
      Entertainment: '#95E1D3',
      Other: '#A8DADC',
    };
    return map[category] || COLORS.PRIMARY;
  },
};

// ✅ Animations
export const animations = {
  fast: 200,
  normal: 300,
  slow: 500,
};

// ✅ zIndex
export const zIndex = {
  modal: 1000,
};