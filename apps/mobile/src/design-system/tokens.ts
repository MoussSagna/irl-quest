export const colors = {
  background: '#0B1020',
  surface: '#121A2B',
  surfaceMuted: '#202D45',
  ink: '#F4F7FB',
  muted: '#AAB7CC',
  border: '#2A3852',
  primary: '#72E6C1',
  primaryDark: '#3BC9A5',
  primarySoft: '#173F3D',
  mint: '#72E6C1',
  mintSoft: '#173F3D',
  amber: '#FFB86B',
  amberSoft: '#3B2D1B',
  coral: '#FF7185',
  coralSoft: '#43232B',
  blue: '#6DB7FF',
  blueSoft: '#1A314D',
  violet: '#9A8CFF',
  achievement: '#FFD27D',
  white: '#07111F',
} as const;

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, xxxl: 32 } as const;
export const radii = { sm: 8, md: 12, lg: 18, pill: 999 } as const;
export const typography = {
  title: { fontSize: 28, lineHeight: 34, fontWeight: '800' as const },
  heading: { fontSize: 20, lineHeight: 26, fontWeight: '800' as const },
  body: { fontSize: 15, lineHeight: 22, fontWeight: '400' as const },
  label: { fontSize: 12, lineHeight: 16, fontWeight: '700' as const },
  caption: { fontSize: 13, lineHeight: 18, fontWeight: '500' as const },
};
