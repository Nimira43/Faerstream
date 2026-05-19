import * as uiUtils from './uiUtils.js'
import * as constants from './constants.js'

let fileReader

// Option 1 - File Reader API
// export function sendFile(senderDataChannel) {
//   uiUtils.logToCustomConsole('Sending file...')
//   const file = uiUtils.DOM.fileUploadInput.files[0]
//   console.log('File selected: ', uiUtils.DOM.fileUploadInput.files)
//   uiUtils.DOM.sendProgress.max = file.size
//   uiUtils.DOM.sendProgress.value = file.size / 2

//   fileReader = new FileReader()
//   fileReader.addEventListener('error', error => console.error('Error reading file:', error))
//   fileReader.addEventListener('abort', event => console.log('File reading aborted:', event))
//   fileReader.addEventListener('load', readerLoadEvent => {
//     console.log('File reader onload event:', readerLoadEvent)
//  Keep line 18 code commented out.
//     senderDataChannel.send(readerLoadEvent.target.result)
//   })

//   fileReader.readAsArrayBuffer(file)
//   console.log(['This is the full filereader object returned,after we read the full file into browser memory:', fileReader])
// }

// Option 2 - File Reader API - Chunking
export function sendFile(senderDataChannel) {
  uiUtils.logToCustomConsole('Sending file...')
  const file = uiUtils.DOM.fileUploadInput.files[0]
  console.log('File selected: ', uiUtils.DOM.fileUploadInput.files)
  uiUtils.DOM.sendProgress.max = file.size

  fileReader = new FileReader()
  fileReader.addEventListener('error', error => console.error('Error reading file:', error))
  fileReader.addEventListener('abort', event => console.log('File reading aborted:', event))
  fileReader.addEventListener('load', readerLoadEvent => {
    console.log('File reader onload event:', readerLoadEvent)
    console.log(senderDataChannel.bufferedAmount, ' === bytes buffered in the send queue.')
    senderDataChannel.send(readerLoadEvent.target.result)
    console.log('Size of chunk: ', readerLoadEvent.target.result.byteLength)
    offset += readerLoadEvent.target.result.byteLength
    uiUtils.DOM.sendProgress.value = offset

    if (offset < file.size) {
      readChunk(offset)
    } else {
      console.log(`End of File.`)
      uiUtils.logToCustomConsole('File successfully sent.', constants.myColours.darkGreen)
    }
  })

  const chunkSize = Math.min(
    constants.FILE_CONFIG.CHUNK_SIZE,
    senderDataChannel.maxMessageSize
  )

  let offset = 0

  function readChunk(offset) {
    console.log('Reading chunk starting at offset:', offset)

    const chunk = file.slice(offset, offset + chunkSize)

    fileReader.readAsArrayBuffer(chunk)
  }

  readChunk(0)
}