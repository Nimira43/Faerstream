import * as uiUtils from './uiUtils.js'
let fileReader

// Option 1 - File Reader API
export function sendFile(senderDataChannel) {
  uiUtils.logToCustomConsole('Sending file...')
  const file = uiUtils.DOM.fileUploadInput.files[0]
  console.log('File selected: ', uiUtils.DOM.fileUploadInput.files)
  uiUtils.DOM.sendProgress.max = file.size
  uiUtils.DOM.sendProgress.value = file.size / 2

  fileReader = new FileReader()
  fileReader.addEventListener('error', error => console.error('Error reading file:', error))
  fileReader.addEventListener('abort', event => console.log('File reading aborted:', event))
  fileReader.addEventListener('load', readerLoadEvent => {
    console.log('File reader onload event:', readerLoadEvent)
    // senderDataChannel.send(readerLoadEvent.target.result)
  })

  fileReader.readAsArrayBuffer(file)
  console.log(['This is the full filereader object returned,after we read the full file into browser memory:', fileReader])
}