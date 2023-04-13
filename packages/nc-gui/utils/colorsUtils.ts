import colors from 'windicss/colors'

export const theme = {
  light: ['#ffdce5', '#fee2d5', '#ffeab6', '#d1f7c4', '#ede2fe', '#eee', '#cfdffe', '#d0f1fd', '#c2f5e8', '#ffdaf6'],
  dark: [
    '#f82b6099',
    '#ff6f2c99',
    '#fcb40099',
    '#20c93399',
    '#8b46ff99',
    '#666',
    '#2d7ff999',
    '#18bfff99',
    '#20d9d299',
    '#ff08c299',
  ],
}

export const enumColor = {
  light: ['#cfdffe', '#d0f1fd', '#c2f5e8', '#ffdaf6', '#ffdce5', '#fee2d5', '#ffeab6', '#d1f7c4', '#ede2fe', '#eeeeee'],
  dark: [
    '#2d7ff999',
    '#18bfff99',
    '#20d9d299',
    '#ff08c299',
    '#f82b6099',
    '#ff6f2c99',
    '#fcb40099',
    '#20c93399',
    '#8b46ff99',
    '#666',
  ],
}

export const themeColors = {
  'background': '#FFFFFF',
  'surface': '#FFFFFF',
  'primary': '#4351e8',
  'secondary': '#03DAC6',
  'secondary-darken-1': '#018786',
  'error': '#B00020',
  'info': '#2196F3',
  'success': '#4CAF50',
  'warning': '#FB8C00',
}

export const themeV2Colors = {
  /** Primary shades */
  'royal-blue': {
    'DEFAULT': '#4351E8',
    '50': '#E7E8FC',
    '100': '#D4D8FA',
    '200': '#B0B6F5',
    '300': '#8C94F1',
    '400': '#6773EC',
    '500': '#4351E8',
    '600': '#1A2BD8',
    '700': '#1421A6',
    '800': '#0E1774',
    '900': '#080D42',
  },

  'royal-red': {
    'DEFAULT': '#A61421',
    '50': '#FEE7E9',
    '100': '#FCD4D8',
    '200': '#F9B0B6',
    '300': '#F68C94',
    '400': '#F36773',
    '500': '#F14251',
    '600': '#E81A2B',
    '700': '#A61421',
    '800': '#74120E',
    '900': '#420808',
  },

  /** Accent shades */
  'pink': colors.pink,
  'red': colors.red,
}

const isValidHex = (hex: string) => /^#([A-Fa-f0-9]{3,4}){1,2}$/.test(hex)

const getChunksFromString = (st: string, chunkSize: number) => st.match(new RegExp(`.{${chunkSize}}`, 'g'))

const convertHexUnitTo256 = (hexStr: string) => parseInt(hexStr.repeat(2 / hexStr.length), 16)

export const hexToRGB = (hex: string) => {
  if (!isValidHex(hex)) {
    throw new Error('Invalid HEX')
  }

  const chunkSize = Math.floor((hex.length - 1) / 3)

  const hexArr = getChunksFromString(hex.slice(1), chunkSize)!

  const [r, g, b] = hexArr.map(convertHexUnitTo256)

  return `${r}, ${g}, ${b}`
}

export const projectThemeColors = [
  // themeV2Colors['royal-blue'].DEFAULT,
  '#333333',
  themeV2Colors['royal-red'].DEFAULT,
  '#2D7FF9',
  '#18BFFF',
  '#941737',
  '#ff98b3',
  '#8A2170',
  '#EC2CBD',
  '#F57134',
  '#8B46FF',
  '#1B51A2',
  '#146C8E',
  '#24716E',
  '#8A2170',
  '#941737',
  '#B94915',
  '#0E4C15',
  '#381475',
]
