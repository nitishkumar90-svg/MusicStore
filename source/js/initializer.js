
let findElement = (selector, findSelectorByID) => {
    return findSelectorByID ? document.getElementById(selector) : document.querySelector(selector)
}

//Mobile Nav Bar
let playSongMobileNavBar = findElement('play-song-mobile-nav', true)
let startBtnSmall = findElement(`start-recording-small`, true)
let songNameSmallBar = findElement('song-name-small-bar', true)
let showCurrentSongTimerSmall = findElement('showCurrentSongTimerSmall', true)
let playButtonSmall = findElement('playpausebtn-small', true)

//Mobile Recording Nav Bar
let recordSongMobileNavBar = findElement('record-song-mobile-nav', true)
let playBtnSmall = findElement(`play-recording-small`, true)
let stopBtnSmall = findElement(`stop-recording-small`, true)
let btnRecordingSmall = findElement('btnRecordingSmall', true)
let showCurrentRecordingTimerSmall = findElement('showCurrentRecordingTimerSmall', true)


//Normal Player
let seekSlider = findElement('seekslider', true)
let volumeSlider = findElement('volumeslider', true)
let pauseButtons = document.querySelectorAll('.fa-pause-circle')
let rewindTrack = document.querySelectorAll('#rewindTrack')
let forwardTrack = document.querySelectorAll('#forwardTrack')
let playButton = findElement('playpausebtn', true)
let songNameBar = findElement('song-name-bar', true)
let currentSongImage = findElement('current-song-image', true)
let showCurrentSongTimer = findElement('showCurrentSongTimer', true)

//Normal Recording Player
let startBtn = findElement(`start-recording`, true)
let playBtn = findElement(`play-recording`, true)
let stopBtn = findElement(`stop-recording`, true)
let recordingSlider = findElement('recordingSlider', true)
let showCurrentRecordingTimer = findElement('showCurrentRecordingTimer', true)
let volumeRecordingSlider = findElement('volumeRecordingSlider', true)
let btnRecording = findElement('btnRecording', true)
let recordingSection = findElement('recording-section', true)
let playSongSection = findElement('play-song-section', true)


//Search Section
let txtBoxSearch = findElement('txtSearch', true)
let staticSearchDiv = findElement('static-search-div', true)

//Navigation Bar
let hamAnchor = findElement('.ham', false)
let hamContent = findElement('.hamContent', false)

//Initialize Current Song List and Trending Song

let songsList = document.querySelectorAll('.play-music-button')
let showTrendingSong = document.querySelectorAll('#show-trending-song')
let playTrendingSongButton = findElement('play-trending-song', true)

//Initialize Global Variables
let songStartInterval;
let recordingTime = 0
let audio = new Audio()
let mediaRecorder
let classList = []
let isFirstSong = true
const trackTime = 5


let dynamicElement = (tagName, classList) => {
    let tagElement = document.createElement(tagName)
    for (let index = 0; index < classList.length; index++) {
        tagElement.classList.add(classList[index])
    }
    return tagElement
}

let resetRecorder = () => {
    playBtn.parentElement.classList.add('visibility-hidden')
    playBtnSmall.parentElement.classList.add('visibility-hidden')
    showCurrentRecordingTimer.innerText = showCurrentRecordingTimerSmall.innerText = ''
    recordingSlider.value = 0
    recordingSlider.max = 100
    stopBtn.classList.add('fa-stop-circle')
    stopBtn.classList.remove('fa-pause-circle')
    stopBtnSmall.classList.add('fa-stop-circle')
    stopBtnSmall.classList.remove('fa-pause-circle')
}


let convertSecondstoTime = (seconds) => {
    let currentDateTime = new Date(seconds * 1000)
    return currentDateTime.getUTCMinutes().toString().padStart(2, '0')
        + ':'
        + currentDateTime.getUTCSeconds().toString().padStart(2, '0')
}

let toggleRecordingSection = () => {
    playSongMobileNavBar.classList.toggle('hidden')
    recordSongMobileNavBar.classList.toggle('hidden')

    recordingSection.classList.toggle('hidden')
    playSongSection.classList.toggle('hidden')
}



let startVisualization = (audio) => {
    try {
        if (audio !== undefined) {
            let audioContext = new AudioContext()
            let analyser = audioContext.createAnalyser()
            let audioSrc = audioContext.createMediaElementSource(audio)

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
    catch (ex) {
        console.log(ex)
    }
}