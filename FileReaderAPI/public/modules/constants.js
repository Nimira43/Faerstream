const lowerWatermark = 1024 * 1024 * 5
const highWatermark =  lowerWatermark * 2

export const myColours = {
  orange: '#e23c00',
  green: '#40f640',
  darkGreen: '#0c7b0c',
  yellow: '#ffd700',
  blue: '#0c3d97'
}

export const FILE_CONFIG = {
  CHUNK_SIZE: 262144,
  LOWER_THRESHOLD: lowerWatermark,
  UPPER_THRESHOLD: highWatermark
}