export const hexToRgb = (hex) => {
  hex = hex.replace(/^#/, '');

  if (hex.length === 3) {
    hex = hex.split('').map(c => c + c).join('');
  }

  const codigo = parseInt(hex, 16);

  return {
    r: (codigo >> 16) & 255,
    g: (codigo >> 8) & 255,
    b: codigo & 255
  };
}

export const rgbToRgba = ({ r, g, b }, opacidad) => `rgba(${r}, ${g}, ${b}, ${opacidad})`;

export const getLuminance = ({ r, g, b }) => {
  const toLinear = (c) => {
    const sRGB = c / 255;
    return sRGB <= 0.03928
      ? sRGB / 12.92
      : Math.pow((sRGB + 0.055) / 1.055, 2.4);
  };
  const R = toLinear(r);
  const G = toLinear(g);
  const B = toLinear(b);
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

export const getContrastingTextColor = (hexColor) => {
  const luminance = getLuminance(hexToRgb(hexColor));
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
}

export const getBackgroundWithThemeTone = (hexColor) => {
  const { r, g, b } = hexToRgb(hexColor);
  // Vuetify aplica opacidad baja en backgrounds (ej: chips, botones planos)
  return `rgba(${r}, ${g}, ${b}, 0.4)`; // puedes ajustar 0.15 → 0.2 según gusto
}
