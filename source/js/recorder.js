let recordAudio = new Audio()

//#region Load Microphone

//This function will load the microphone configurations and set all the required values to mediaDevice
let loadMicrophone = async function () {
    let audioChunks = [] // An array to store all of the recording bits
    recordingNow(false) // Not recording to start

    // Get the microphone ready
    let stream = await navigator.mediaDevices.getUserMedia({ audio: true })

    // Setup a stream for recording to
    MediaRcdr = new MediaRecorder(stream)

    // When the stream STARTS recording
    MediaRcdr.addEventListener("start", function (event) {
        if (audio !== undefined)
            audio.pause()
        ResetRecorderSettings(false)
        RecordingTime = 0
        startBtn.classList.remove(`color-white`)
        startBtn.classList.add(`color-red`)
        startBtnSmall.classList.remove(`color-white`)
        startBtnSmall.classList.add(`color-red`)
        audioChunks = []
        Song_StartInterval = setInterval(() => {
            RecordingTime += 1
            let calculatedTime = ConvertSecondsToMinutesAndSecondString(Math.floor(RecordingTime))
            showCurrentRecordingTimer.innerText = showCurrentRecordingTimerSmall.innerText = calculatedTime
            recordingSlider.value = RecordingTime
        }, 1000)
        let index = 0
        recordingNow(true)
    })

    // When the stream STOPS recording
    MediaRcdr.addEventListener("stop", function (event) {
        recordingSlider.max = RecordingTime
        clearInterval(Song_StartInterval)
        playBtn.parentElement.classList.toggle(`visibility-hidden`)
        playBtnSmall.parentElement.classList.toggle(`visibility-hidden`)
        startBtn.classList.add(`color-white`)
        startBtn.classList.remove(`color-red`)
        startBtnSmall.classList.add(`color-white`)
        startBtnSmall.classList.remove(`color-red`)
        const audioBlob = new Blob(audioChunks)  // Compile the recording bits
        const audioUrl = URL.createObjectURL(audioBlob)  // Turn into a file

        recordAudio.src = audioUrl
        recordAudio.loop = true
        recordAudio.addEventListener(`timeupdate`, (event) => {
            const { currentTime } = event.target
            recordingSlider.value = currentTime
            let calculatedTime = ConvertSecondsToMinutesAndSecondString(Math.floor(currentTime))
            showCurrentRecordingTimer.innerText = showCurrentRecordingTimerSmall.innerText = calculatedTime
        })
        recordingSlider.onclick = () => recordAudio.currentTime = seekSlider.value
        RecordingTime = 0
        recordAudio.pause()
        recordingNow(false)  // Inform the UI that we`re not recording
    })

    // As soon as some bytes are ready to save
    MediaRcdr.addEventListener("dataavailable", function (event) {
        console.log(event.data)
        audioChunks.push(event.data)
    })
}
//#endregion

//#region function

// Handle the UI stuff, like toggling the buttons and put the recording border
let recordingNow = function (isRecording) {
    // Toggle the button activation
    startBtn.disabled = isRecording
    startBtnSmall.disabled = isRecording
    stopBtn.disabled = !isRecording
    stopBtnSmall.disabled = !isRecording
}

//can adjust the volume of play back from recording
let setRecorderVolume = (event) => {
    if (recordAudio === undefined)
        return
    recordAudio.volume = volumeRecordingSlider.value / 100
}

// This function will load the existing recording audio into it and play
let playRecording = () => {
    if (recordAudio === undefined)
        return
    stopBtn.classList.remove(`fa-stop-circle`)
    stopBtn.classList.add(`fa-pause-circle`)
    stopBtnSmall.classList.remove(`fa-stop-circle`)
    stopBtnSmall.classList.add(`fa-pause-circle`)
    recordAudio.play()
    StartLiveVisualizationForUI(recordAudio)
}

//This function is used to toggle between recording and normal music player section
let toggleMainRecordingSection = () => {
    toggleHam()
    ToggleRecordingSectionBar()
}

//used to pause audio
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
    if (MediaRcdr === undefined)
        return
    try {
        MediaRecorder.start()
    }
    catch (ex) { console.log(ex) }
})
// When the start button is clicked, start recording
startBtnSmall.addEventListener(`click`, function (event) {
    if (MediaRcdr === undefined)
        return
    try {
        MediaRcdr.start()
    }
    catch (ex) { console.log(ex) }
})

// When the stop button is clicked, stop recording
stopBtn.addEventListener(`click`, function (event) {
    if (recordAudio !== undefined)
        recordAudio.pause()
    if (MediaRcdr === undefined)
        return
    try {
        MediaRcdr.stop()
    }
    catch (ex) { console.log(ex) }
})

// When the stop button is clicked, stop recording
stopBtnSmall.addEventListener(`click`, function (event) {
    if (recordAudio !== undefined)
        recordAudio.pause()
    if (MediaRcdr === undefined)
        return
    try {
        MediaRcdr.stop()
    }
    catch (ex) { console.log(ex) }
})

//#endregion

//#region Event Handler
volumeRecordingSlider.addEventListener(`change`, setRecorderVolume)
btnRecording.addEventListener(`click`, ToggleRecordingSectionBar)
btnRecordingSmall.addEventListener(`click`, toggleMainRecordingSection)
playBtn.addEventListener(`click`, playRecording)
playBtnSmall.addEventListener(`click`, playRecording)

// When the window is loaded and ready to go, get the Microphone ready
window.addEventListener(`load`, loadMicrophone)
//#endregion



