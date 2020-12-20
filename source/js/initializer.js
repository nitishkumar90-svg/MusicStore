//defaults
window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext

//#region Find Element Method

// method which will return the current tag by selector
let FindElementBySelector = (selector, findSelectorByID, findAllBySelector) => {
    if (findAllBySelector !== undefined && findAllBySelector)
        return document.querySelectorAll(selector)
    return findSelectorByID ? document.getElementById(selector) : document.querySelector(selector)
}

//#endregion

//#region variables

//variable for music/ images directory
const audioDirectory = `./resources/audio`
const imageDirectory = `./resources/images`

//Mobile Nav Bar
let playSongMobileNavBar = FindElementBySelector(`play-song-mobile-nav`, true, false)
let startBtnSmall = FindElementBySelector(`start-recording-small`, true, false)
let songNameSmallBar = FindElementBySelector(`song-name-small-bar`, true, false)
let showCurrentSongTimerSmall = FindElementBySelector(`showCurrentSongTimerSmall`, true, false)
let playButtonSmall = FindElementBySelector(`playpausebtn-small`, true, false)

//Mobile Recording Nav Bar
let recordSongMobileNavBar = FindElementBySelector(`record-song-mobile-nav`, true, false)
let playBtnSmall = FindElementBySelector(`play-recording-small`, true, false)
let stopBtnSmall = FindElementBySelector(`stop-recording-small`, true, false)
let btnRecordingSmall = FindElementBySelector(`btnRecordingSmall`, true, false)
let showCurrentRecordingTimerSmall = FindElementBySelector(`showCurrentRecordingTimerSmall`, true, false)


//Normal Player
let seekSlider = FindElementBySelector(`seekslider`, true, false)
let volumeSlider = FindElementBySelector(`volumeslider`, true, false)
let pauseButtons = FindElementBySelector(`.fa-pause-circle`, false, true)
let rewindTrack = FindElementBySelector(`#rewindTrack`, false, true)
let forwardTrack = FindElementBySelector(`#forwardTrack`, false, true)
let playButton = FindElementBySelector(`playpausebtn`, true, false)
let songNameBar = FindElementBySelector(`song-name-bar`, true, false)
let currentSongImage = FindElementBySelector(`current-song-image`, true, false)
let showCurrentSongTimer = FindElementBySelector(`showCurrentSongTimer`, true, false)

//Normal Recording Player
let startBtn = FindElementBySelector(`start-recording`, true, false)
let playBtn = FindElementBySelector(`play-recording`, true, false)
let stopBtn = FindElementBySelector(`stop-recording`, true, false)
let recordingSlider = FindElementBySelector(`recordingSlider`, true, false)
let showCurrentRecordingTimer = FindElementBySelector(`showCurrentRecordingTimer`, true, false)
let volumeRecordingSlider = FindElementBySelector(`volumeRecordingSlider`, true, false)
let btnRecording = FindElementBySelector(`btnRecording`, true, false)
let recordingSection = FindElementBySelector(`recording-section`, true, false)
let playSongSection = FindElementBySelector(`play-song-section`, true, false)

//Navigation Bar
let hamAnchor = FindElementBySelector(`.ham`, false, false)
let hamContent = FindElementBySelector(`.hamContent`, false, false)
let hamAllAnchors = FindElementBySelector(`.hamContent a`, false, true)

//Drum 
let allActiveDrumBeats = FindElementBySelector(`.opacity-0-3`, false, true)
let drumInfo = FindElementBySelector(`drum-info`, true, false)

//Initialize Current Song List and Trending Song

let songsList = FindElementBySelector(`.play-music-button`, false, true)
let showTrendingSong = FindElementBySelector(`#show-trending-song`, false, true)
let playTrendingSongButton = FindElementBySelector(`play-trending-song`, true, false)
//#endregion

//#region Initialize Global Variables
let Song_StartInterval
let RecordingTime = 0
let MediaRcdr
let ClassList = []
let IsFirstSong = true
const TrackTime = 5
let audio = new Audio()
//#endregion

//#region Global Functions

//This generic function can be used to create element/ tag for HTML
let CreateDynamicElementByTagNameAndClasses = (tagName, classList) => {
    let tagElement = document.createElement(tagName)
    for (let index = 0; index < classList.length; index++) {
        tagElement.classList.add(classList[index])
    }
    return tagElement
}

//this is used to reset the recordind bar section
let ResetRecorderSettings = (forceReset) => {
    playBtn.parentElement.classList.add(`visibility-hidden`)
    playBtnSmall.parentElement.classList.add(`visibility-hidden`)
    showCurrentRecordingTimer.innerText = showCurrentRecordingTimerSmall.innerText = ``
    recordingSlider.value = 0
    recordingSlider.max = 100
    stopBtn.classList.add(`fa-stop-circle`)
    stopBtn.classList.remove(`fa-pause-circle`)
    stopBtnSmall.classList.add(`fa-stop-circle`)
    stopBtnSmall.classList.remove(`fa-pause-circle`)
    try {
        if (forceReset) {
            pauseAudio()
            MediaRcdr.stop()
        }
    }
    catch (ex) { }
}

//this is used to convert the seconds from audio to MM:SS time
let ConvertSecondsToMinutesAndSecondString = (seconds) => {
    let currentDateTime = new Date(seconds * 1000)
    return currentDateTime.getUTCMinutes().toString().padStart(2, `0`)
        + `:`
        + currentDateTime.getUTCSeconds().toString().padStart(2, `0`)
}

//to toggle the recording and play section
let ToggleRecordingSectionBar = (fromPlaySong) => {
    if (fromPlaySong != true) {
        playSongMobileNavBar.classList.toggle(`hidden`)
        recordSongMobileNavBar.classList.toggle(`hidden`)

        recordingSection.classList.toggle(`hidden`)
        playSongSection.classList.toggle(`hidden`)
    }
    else {
        console.log(fromPlaySong)
        playSongMobileNavBar.classList.remove(`hidden`)
        playSongSection.classList.remove(`hidden`)

        recordSongMobileNavBar.classList.add(`hidden`)
        recordingSection.classList.add(`hidden`)

    }
}

//this will help to show Live visualization to enhance UI
let StartLiveVisualizationForUI = (audiofile) => {
    try {
        if (audiofile !== undefined) {
            let audioContext = new AudioContext()
            let analyser = audioContext.createAnalyser()
            let audioSrc = audioContext.createMediaElementSource(audiofile)

            audioSrc.connect(analyser)
            analyser.connect(audioContext.destination)

            let primaryColorForMyWebsite = `#3BC8E7`
            let secondaryColorForMyWebsite = `#FFFFFF`
            let canvas = document.querySelector(`.canvas`),
                canvasWidth = canvas.width,
                canvasHeight = canvas.height - 2,
                meterWidth = 12,
                capHeight = 6,
                meterNum = 800 / (12 + 2),
                positionYArray = []

            audioContext = canvas.getContext(`2d`),
                gradient = audioContext.createLinearGradient(0, 0, 0, 300)
            gradient.addColorStop(1, secondaryColorForMyWebsite)
            gradient.addColorStop(0.5, primaryColorForMyWebsite)
            gradient.addColorStop(0, secondaryColorForMyWebsite)

            let renderFrameForAnimation = () => {
                let int8Array = new Uint8Array(analyser.frequencyBinCount)
                analyser.getByteFrequencyData(int8Array)
                let step = Math.round(int8Array.length / meterNum)
                audioContext.clearRect(0, 0, canvasWidth, canvasHeight)
                for (let i = 0; i < meterNum; i++) {
                    let value = int8Array[i * step]
                    if (positionYArray.length < Math.round(meterNum)) {
                        positionYArray.push(value)
                    }
                    audioContext.fillStyle = primaryColorForMyWebsite

                    if (value < positionYArray[i]) {
                        audioContext.fillRect(i * 12, canvasHeight - (--positionYArray[i]), meterWidth, capHeight)
                    } else {
                        audioContext.fillRect(i * 12, canvasHeight - value, meterWidth, capHeight)
                        positionYArray[i] = value
                    }
                    audioContext.fillStyle = gradient
                    audioContext.fillRect(i * 12, canvasHeight - value + capHeight, meterWidth, canvasHeight)
                }
                requestAnimationFrame(renderFrameForAnimation)
            }
            renderFrameForAnimation()
        }
    }
    catch (ex) { console.log(ex) }
}

//#endregion