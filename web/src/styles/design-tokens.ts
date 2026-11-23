export const designTokens = {
  colors: {
    brand: {
      terracotta: '#C25E34',
      terracottaHover: '#A84F2A',
      terracottaLight: '#FDF8F6',
      violet: '#C084FC',
      violetDark: '#A855F7',
      deepObsidian: '#0F0A18',
      obsidianSurface: '#181126',
      obsidianElevated: '#201633',
      obsidianBorder: 'rgba(255, 255, 255, 0.1)',
      coral: '#FF4D4D',
      coralHover: '#E03838',
      coralLight: '#FFF1F1',
      amber: '#F59E0B',
    },
    rating: {
      amber: '#F59E0B',
      gold: '#F59E0B',
    },
    canvas: '#FAF8F5',
    surface: '#FFFFFF',
    border: '#E7E5E4',
    borderHover: '#C25E34',
    text: {
      primary: '#18181B',
      secondary: '#57534E',
      muted: '#78716C',
      accent: '#C25E34',
      inverse: '#FFFFFF',
    },
  },
  shadows: {
    heroCard: '0 20px 50px -10px rgba(0, 0, 0, 0.1), 0 4px 16px -2px rgba(0, 0, 0, 0.05)',
    card: '0 4px 16px rgba(0, 0, 0, 0.05)',
    cardHover: '0 12px 28px rgba(0, 0, 0, 0.1)',
  },
  radii: {
    card: '20px',
    pill: '9999px',
    input: '12px',
  },
} as const;
