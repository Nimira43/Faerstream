import * as uiUtils from './uiUtils.js'
import * as constants from './constants.js'
import * as webrtc from './webRTCHandler.js'

let fileReader
export let receivedChunks = []
let totalBytesReceived = 0
let fileMetadata = null

// Option 3 - Working File Reader API 
export function sendFile(senderDataChannel) {
  uiUtils.logToCustomConsole('Sending file...')
  uiUtils.DOM.abortFileBtn.addEventListener('click', () => {
    webrtc.closeDataChannel(senderDataChannel)
  }, {once: true})
  
  const file = uiUtils.DOM.fileUploadInput.files[0]
  console.log('File selected: ', uiUtils.DOM.fileUploadInput.files)
  console.table([file], ['name', 'size', 'type'])

  const fileMetadata = {
    name: file.name,
    size: file.size,
    type: file.type,
    lastModified: file.lastModified
  }

  const fileStringMetadata = JSON.stringify(fileMetadata)
  uiUtils.logToCustomConsole('Sending file metadata to receiver...')
  senderDataChannel.send(fileStringMetadata)

  uiUtils.DOM.sendProgress.max = file.size

  fileReader = new FileReader()
  fileReader.addEventListener('error', error => console.error('Error reading file:', error))
  fileReader.addEventListener('abort', event => console.log('File reading aborted:', event))
  fileReader.addEventListener('load', readerLoadEvent => {
    
    const buffer = readerLoadEvent.target.result 
    console.log(senderDataChannel.bufferedAmount, ' === bytes buffered in the send queue.')
    console.log('Array buffer chunk: ', buffer)

    try {
      senderDataChannel.send(buffer)
      offset += readerLoadEvent.target.result.byteLength
      uiUtils.DOM.sendProgress.value = offset
    } catch (e) {
      console.log('Error reading sending chunks: ', e)
      return
    } 

    if (offset < file.size && !waitingToDrain) {
      readChunk()
    } else {
      console.log(`End of File.`)
      uiUtils.logToCustomConsole('File successfully sent.', constants.myColours.darkGreen)
      webrtc.closeDataChannel(senderDataChannel)
    }
  })

  const chunkSize = Math.min(
    constants.FILE_CONFIG.CHUNK_SIZE,
    senderDataChannel.maxMessageSize
  )

  let offset = 0
  let upperThreshold = constants.FILE_CONFIG.UPPER_THRESHOLD
  senderDataChannel.bufferedAmountLowThreshold = constants.FILE_CONFIG.LOWER_THRESHOLD
  let waitingToDrain = false

  function readChunk() {
    console.log('Reading chunk starting at offset:', offset)

    if (senderDataChannel.bufferedAmount >= upperThreshold) {
      waitingToDrain = true
      console.log('Buffer full, waiting for bufferedamountlow event... ')
      return
    }

    const chunk = file.slice(offset, offset + chunkSize)

    fileReader.readAsArrayBuffer(chunk)
    console.log('Blob Chunk: ', chunk)
  }

  senderDataChannel.addEventListener('bufferedamountlow', () => {
    if (waitingToDrain) {
      waitingToDrain = false
      console.log('bufferedamount event fired, resume sending...')
      console.log('Offest value: ', offset)
      readChunk()
    }
  })

  readChunk()
}

export function receiveFile(messageEventObject) {
  const receivedData = messageEventObject.data
  if (!fileMetadata) {
    try {
      fileMetadata = JSON.parse(receivedData)
      uiUtils.logToCustomConsole('Received file metadata.')
      console.log('File meta object: ', fileMetadata)
      const encode = new TextEncoder().encode(receivedData)
      console.log('Size of mesage received: ', encode.length)
      uiUtils.DOM.receiveProgress.max = fileMetadata.size
      return
    } catch (e) {
      console.error('Error parsing metadata: ', e)
      return
    }
  }

  receivedChunks.push(receivedData)
  totalBytesReceived += receivedData.byteLength
  uiUtils.DOM.statsDiv.innerHTML =
    `Received ${totalBytesReceived} bytes of ${fileMetadata.size} - ${Math.round((totalBytesReceived / fileMetadata.size) * 100)}%`
  uiUtils.DOM.receiveProgress.value = totalBytesReceived

  if (totalBytesReceived === fileMetadata.size) {
    uiUtils.logToCustomConsole('All chunks received. Reassembling file.')

    const fileBlobObject = new Blob(receivedChunks, {type: fileMetadata.type})

    const downloadURL = URL.createObjectURL(fileBlobObject)

    uiUtils.DOM.downloadFileAnchorTag.href = downloadURL
    uiUtils.DOM.downloadFileAnchorTag.download = fileMetadata.name
    uiUtils.DOM.downloadFileAnchorTag.textContent =
      `Click to download '${fileMetadata.name}' (${fileMetadata.size} bytes)`
    uiUtils.DOM.downloadFileAnchorTag.style.display = 'block'
    uiUtils.DOM.statsDiv.innerHTML =
      `<strong>Download complete</strong>`
    uiUtils.logToCustomConsole('File successfully received.', constants.myColours.orange)
    
    receivedChunks = []
    totalBytesReceived = 0
    fileMetadata = null
  }
}