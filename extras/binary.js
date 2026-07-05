const buffer = new ArrayBuffer(8)
const uint8View = new Uint8Array(buffer)
const uint16View = new Uint16Array(buffer)

for (let i = 0; i < uint8View.length; i++) {
  uint8View[i] = i + 1
}

console.log('Uint8Array view: ', uint8View)
console.log('Uint16Array view: ', uint16View)