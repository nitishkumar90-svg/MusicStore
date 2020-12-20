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

//Mobile Nav Bar
let playSongMobileNavBar = FindElementBySelector('play-song-mobile-nav', true, false)
let startBtnSmall = FindElementBySelector(`start-recording-small`, true, false)
let songNameSmallBar = FindElementBySelector('song-name-small-bar', true, false)
let showCurrentSongTimerSmall = FindElementBySelector('showCurrentSongTimerSmall', true, false)
let playButtonSmall = FindElementBySelector('playpausebtn-small', true, false)

//Mobile Recording Nav Bar
let recordSongMobileNavBar = FindElementBySelector('record-song-mobile-nav', true, false)
let playBtnSmall = FindElementBySelector(`play-recording-small`, true, false)
let stopBtnSmall = FindElementBySelector(`stop-recording-small`, true, false)
let btnRecordingSmall = FindElementBySelector('btnRecordingSmall', true, false)
let showCurrentRecordingTimerSmall = FindElementBySelector('showCurrentRecordingTimerSmall', true, false)


//Normal Player
let seekSlider = FindElementBySelector('seekslider', true, false)
let volumeSlider = FindElementBySelector('volumeslider', true, false)
let pauseButtons = FindElementBySelector('.fa-pause-circle', false, true)
let rewindTrack = FindElementBySelector('#rewindTrack', false, true)
let forwardTrack = FindElementBySelector('#forwardTrack', false, true)
let playButton = FindElementBySelector('playpausebtn', true, false)
let songNameBar = FindElementBySelector('song-name-bar', true, false)
let currentSongImage = FindElementBySelector('current-song-image', true, false)
let showCurrentSongTimer = FindElementBySelector('showCurrentSongTimer', true, false)

//Normal Recording Player
let startBtn = FindElementBySelector(`start-recording`, true, false)
let playBtn = FindElementBySelector(`play-recording`, true, false)
let stopBtn = FindElementBySelector(`stop-recording`, true, false)
let recordingSlider = FindElementBySelector('recordingSlider', true, false)
let showCurrentRecordingTimer = FindElementBySelector('showCurrentRecordingTimer', true, false)
let volumeRecordingSlider = FindElementBySelector('volumeRecordingSlider', true, false)
let btnRecording = FindElementBySelector('btnRecording', true, false)
let recordingSection = FindElementBySelector('recording-section', true, false)
let playSongSection = FindElementBySelector('play-song-section', true, false)

//Navigation Bar
let hamAnchor = FindElementBySelector('.ham', false, false)
let hamContent = FindElementBySelector('.hamContent', false, false)

//Drum 
let allActiveDrumBeats = FindElementBySelector('.opacity-0-3', false, true)
let drumInfo = FindElementBySelector('drum-info', true, false)

//Initialize Current Song List and Trending Song

let songsList = FindElementBySelector('.play-music-button', false, true)
let showTrendingSong = FindElementBySelector('#show-trending-song', false, true)
let playTrendingSongButton = FindElementBySelector('play-trending-song', true, false)
//#endregion

//#region Initialize Global Variables
let Song_StartInterval
let recordingTime = 0
let audio = new Audio()
let mediaRecorder
let classList = []
let isFirstSong = true
const trackTime = 5
//#endregion

//#region Global Functions
let CreateDynamicElementByTagNameAndClasses = (tagName, classList) => {
    let tagElement = document.createElement(tagName)
    for (let index = 0; index < classList.length; index++) {
        tagElement.classList.add(classList[index])
    }
    return tagElement
}

let ResetRecorderSettings = (forceReset) => {
    playBtn.parentElement.classList.add('visibility-hidden')
    playBtnSmall.parentElement.classList.add('visibility-hidden')
    showCurrentRecordingTimer.innerText = showCurrentRecordingTimerSmall.innerText = ''
    recordingSlider.value = 0
    recordingSlider.max = 100
    stopBtn.classList.add('fa-stop-circle')
    stopBtn.classList.remove('fa-pause-circle')
    stopBtnSmall.classList.add('fa-stop-circle')
    stopBtnSmall.classList.remove('fa-pause-circle')
    try {
        if (forceReset) {
            pauseAudio()
            mediaRecorder.stop()
        }
    }
    catch (ex) { }
}


let ConvertSecondsToMinutesAndSecondString = (seconds) => {
    let currentDateTime = new Date(seconds * 1000)
    return currentDateTime.getUTCMinutes().toString().padStart(2, '0')
        + ':'
        + currentDateTime.getUTCSeconds().toString().padStart(2, '0')
}

let ToggleRecordingSectionBar = (fromPlaySong) => {
    if (fromPlaySong != true) {
        playSongMobileNavBar.classList.toggle('hidden')
        recordSongMobileNavBar.classList.toggle('hidden')

        recordingSection.classList.toggle('hidden')
        playSongSection.classList.toggle('hidden')
    }
    else {
        console.log(fromPlaySong)
        playSongMobileNavBar.classList.remove('hidden')
        playSongSection.classList.remove('hidden')

        recordSongMobileNavBar.classList.add('hidden')
        recordingSection.classList.add('hidden')
        
    }
}

let StartLiveVisualizationForUI = (audiofile) => {
        if (audiofile !== undefined) {
            debugger
            let audioContext = new AudioContext()
            let analyser = audioContext.createAnalyser()
            let audioSrc = audioContext.createMediaElementSource(audiofile)

            audioSrc.connect(analyser)
            analyser.connect(audioContext.destination)

            let frequencyData = new Uint8Array(analyser.frequencyBinCount)

            let canvas = document.querySelector('.canvas'),
                cwidth = canvas.width,
                cheight = canvas.height - 2,
                meterWidth = 10,
                gap = 2,
                capHeight = 4,
                capStyle = '#3BC8E7',
                meterNum = 800 / (10 + 2),
                capYPositionArray = []

            audioContext = canvas.getContext('2d'),
                gradient = audioContext.createLinearGradient(0, 0, 0, 300)
            gradient.addColorStop(1, '#ffffff')
            gradient.addColorStop(0.5, '#3BC8E7')
            gradient.addColorStop(0, '#3BC8E7')

            let renderFrame = () => {
                let array = new Uint8Array(analyser.frequencyBinCount)
                analyser.getByteFrequencyData(array)
                let step = Math.round(array.length / meterNum) //sample limited data from the total array
                audioContext.clearRect(0, 0, cwidth, cheight)
                for (let i = 0; i < meterNum; i++) {
                    let value = array[i * step]
                    if (capYPositionArray.length < Math.round(meterNum)) {
                        capYPositionArray.push(value)
                    }
                    audioContext.fillStyle = capStyle

                    if (value < capYPositionArray[i]) {
                        audioContext.fillRect(i * 12, cheight - (--capYPositionArray[i]), meterWidth, capHeight)
                    } else {
                        audioContext.fillRect(i * 12, cheight - value, meterWidth, capHeight)
                        capYPositionArray[i] = value
                    }
                    audioContext.fillStyle = gradient
                    audioContext.fillRect(i * 12, cheight - value + capHeight, meterWidth, cheight)
                }
                requestAnimationFrame(renderFrame)
            }
            renderFrame()
        }
}

//#endregion