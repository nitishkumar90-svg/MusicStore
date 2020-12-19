let recordAudio = new Audio()

//#region Load Microphone
let loadMicrophone = async function () {
    let audioChunks = [] // An array to store all of the recording bits
    recordingNow(false) // Not recording to start

    // Get the microphone ready
    let stream = await navigator.mediaDevices.getUserMedia({ audio: true })

    // Setup a stream for recording to
    mediaRecorder = new MediaRecorder(stream)

    // When the stream STARTS recording
    mediaRecorder.addEventListener("start", function (event) {
        if (audio !== undefined)
            audio.pause()
        ResetRecorderSettings(false)
        recordingTime = 0
        startBtn.classList.remove('color-white')
        startBtn.classList.add('color-red')
        startBtnSmall.classList.remove('color-white')
        startBtnSmall.classList.add('color-red')
        audioChunks = []
        Song_StartInterval = setInterval(() => {
            recordingTime += 1
            let calculatedTime = ConvertSecondsToMinutesAndSecondString(Math.floor(recordingTime))
            showCurrentRecordingTimer.innerText = showCurrentRecordingTimerSmall.innerText = calculatedTime
            recordingSlider.value = recordingTime
        }, 1000)
        let index = 0
        recordingNow(true)
    })

    // When the stream STOPS recording
    mediaRecorder.addEventListener("stop", function (event) {
        recordingSlider.max = recordingTime
        clearInterval(Song_StartInterval)
        playBtn.parentElement.classList.toggle('visibility-hidden')
        playBtnSmall.parentElement.classList.toggle('visibility-hidden')
        startBtn.classList.add('color-white')
        startBtn.classList.remove('color-red')
        startBtnSmall.classList.add('color-white')
        startBtnSmall.classList.remove('color-red')
        const audioBlob = new Blob(audioChunks)  // Compile the recording bits
        const audioUrl = URL.createObjectURL(audioBlob)  // Turn into a file

        recordAudio.src = audioUrl
        recordAudio.loop = true
        recordAudio.addEventListener('timeupdate', (event) => {
            const { currentTime } = event.target
            recordingSlider.value = currentTime
            let calculatedTime = ConvertSecondsToMinutesAndSecondString(Math.floor(currentTime))
            showCurrentRecordingTimer.innerText = showCurrentRecordingTimerSmall.innerText = calculatedTime
        })
        recordingSlider.onclick = () => recordAudio.currentTime = seekSlider.value
        recordingTime = 0
        recordAudio.pause()
        recordingNow(false)  // Inform the UI that we're not recording
    })

    // As soon as some bytes are ready to save
    mediaRecorder.addEventListener("dataavailable", function (event) {
        console.log(event.data)
        audioChunks.push(event.data)
    })
}
//#endregion

//#region variables

// Handle the UI stuff, like toggling the buttons and put the recording border
let recordingNow = function (isRecording) {
    // Toggle the button activation
    startBtn.disabled = isRecording
    startBtnSmall.disabled = isRecording
    stopBtn.disabled = !isRecording
    stopBtnSmall.disabled = !isRecording
}

let setRecorderVolume = (event) => {
    if (recordAudio === undefined)
        return
    recordAudio.volume = volumeRecordingSlider.value / 100
}

let playSong = () => {
    if (recordAudio === undefined)
        return
    stopBtn.classList.remove('fa-stop-circle')
    stopBtn.classList.add('fa-pause-circle')
    stopBtnSmall.classList.remove('fa-stop-circle')
    stopBtnSmall.classList.add('fa-pause-circle')
    recordAudio.play()
    StartLiveVisualizationForUI(recordAudio)
}

let toggleMainRecordingSection = () => {
    toggleHam()
    ToggleRecordingSectionBar()
}

let pauseAudio = () => {
    if (recordAudio === undefined)
        return
    recordAudio.pause()
    recordingSlider.value = 0
}

//#endregion

//#region Start/ Pause Button

// When the start button is clicked, start recording
startBtn.addEventListener(`click`, function (event) {
    if (mediaRecorder === undefined)
        return
    try {
        mediaRecorder.start()
    }
    catch (ex) { console.log(ex) }
})
// When the start button is clicked, start recording
startBtnSmall.addEventListener(`click`, function (event) {
    if (mediaRecorder === undefined)
        return
    try {
        mediaRecorder.start()
    }
    catch (ex) { console.log(ex) }
})

// When the stop button is clicked, stop recording
stopBtn.addEventListener(`click`, function (event) {
    if (recordAudio !== undefined)
        recordAudio.pause()
    if (mediaRecorder === undefined)
        return
    try {
        mediaRecorder.stop()
    }
    catch (ex) { console.log(ex) }
})

// When the stop button is clicked, stop recording
stopBtnSmall.addEventListener(`click`, function (event) {
    if (recordAudio !== undefined)
        recordAudio.pause()
    if (mediaRecorder === undefined)
        return
    try {
        mediaRecorder.stop()
    }
    catch (ex) { console.log(ex) }
})

//#endregion

//#region Event Handler
volumeRecordingSlider.addEventListener('change', setRecorderVolume)
btnRecording.addEventListener('click', ToggleRecordingSectionBar)
btnRecordingSmall.addEventListener('click', toggleMainRecordingSection)
playBtn.addEventListener('click', playSong)
playBtnSmall.addEventListener('click', playSong)

// When the window is loaded and ready to go, get the Microphone ready
window.addEventListener(`load`, loadMicrophone)
//#endregion



