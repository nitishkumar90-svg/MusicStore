//defaults
window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext

//variables
let hamAnchor = document.querySelector(".ham"),
    hamContent = document.querySelector(".hamContent"),
    btnRecording = document.getElementById("btnRecording"),
    recordingSection = document.getElementById("recording-section"),
    playSongSection = document.getElementById("play-song-section"),
    songsList = document.querySelectorAll(".play-music-button"),
    playbtn = document.getElementById("playpausebtn"),
    seekslider = document.getElementById("seekslider"),
    volumeslider = document.getElementById("volumeslider"),
    songNameBar = document.getElementById("song-name-bar"),
    songNameSmallBar = document.getElementById("song-name-small-bar"),
    currentSongImage = document.getElementById("current-song-image"),
    seeking = false,
    seekto,
    audioPlayBackRate = 1.0,
    audio = new Audio()


// functions
let toggleHam = () => {
    hamContent.classList.toggle("hidden")
}

let toggleRecordingSection = () => {
    recordingSection.classList.toggle("hidden")
    playSongSection.classList.toggle("hidden")
}

let startVisualization = (audio) => {
    let audioContext = new AudioContext()
    let analyser = audioContext.createAnalyser()
    let audioSrc = audioContext.createMediaElementSource(audio)

    audioSrc.connect(analyser)
    analyser.connect(audioContext.destination)

    let frequencyData = new Uint8Array(analyser.frequencyBinCount)

    let canvas = document.querySelector('.canvas'),
        cwidth = canvas.width,
        cheight = canvas.height - 2,
        meterWidth = 10, //width of the meters in the spectrum
        gap = 2, //gap between meters
        capHeight = 2,
        capStyle = '#3BC8E7',
        meterNum = 800 / (10 + 2), //count of the meters
        capYPositionArray = [] ////store the vertical position of hte caps for the preivous frame

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
    audio.play()
}

let initializeContent = () => {
    initAudioPlayer()
    setTimeout(function () { document.querySelector(".modal").remove() }, 4000)
}

let filterSongsByKeyword = (chars) => {
    let searchList = []
    for (let index = 0; index < songsList.length; index++) {
        const song = songsList[index]
        searchList.push(song)
    }
    return searchList
}

let searchSong = (songId) => {
    let songUrl
    availableSongsList.forEach(element => {
        if (element.id == songId) {
            console.log(songId)
            songUrl = element
        }
    })
    console.log(songUrl)
    return songUrl
}


let playPause = () => {
    if (audio.paused) {
        audio.play()
        playbtn.innerHTML = '<i class="far fa-pause-circle color-white font-20"></i>'
    } else {
        audio.pause()
        playbtn.innerHTML = '<i class="far fa-play-circle color-white font-20"></i>'
    }
}
let seek = (event) => {
    if (seeking) {
        seekslider.value = event.clientX - seekslider.offsetLeft
        seekto = audio.duration * (seekslider.value / 100)
        audio.currentTime = seekto
    }
}
let setvolume = (event) => {
    audio.volume = volumeslider.value / 100
}

let initAudioPlayer = (event) => {
    var autoPlay = false;
    let songId
    if (event === undefined)
        songId = "tenderness"
    else {
        songId = event.target.id
        autoPlay = true;
    }
    let songDetail = searchSong(songId)
    console.log(songDetail)
    if (songDetail !== undefined) {
        audio.pause()
        audio.currentTime = 0
        seekslider.value = 0
        audio = new Audio()
        audio.src = songDetail.url
        audio.loop = false
        audio.defaultPlaybackRate = audioPlayBackRate
        audio.audioPlayBackRate = audioPlayBackRate
        audio.volume = volumeslider.value / 100
        assignValuesToPlayer(songDetail, autoPlay)
        if (autoPlay) {
            audio.play()
            startVisualization(audio)
        }
    }
}


let assignValuesToPlayer = (songDetail, startMusic) => {
    songNameBar.innerText = songDetail.name
    songNameSmallBar.innerText = songDetail.name
    seekslider.min = songDetail.min
    seekslider.max = songDetail.max
    if (startMusic)
        playbtn.innerHTML = '<i class="far fa-pause-circle color-white font-20"></i>'
    currentSongImage.src = songDetail.imageUrl
}



//event handlers
window.addEventListener("load", initializeContent)
hamAnchor.addEventListener("click", toggleHam)
songsList.forEach(element => { element.addEventListener("click", initAudioPlayer) })
playbtn.addEventListener("click", playPause)
seekslider.addEventListener("mousemove", function (event) { seek(event) })
seekslider.addEventListener("mousedown", function (event) { seeking = true; seek(event) })
seekslider.addEventListener("mouseup", function () { seeking = false })
volumeslider.addEventListener("mousemove", setvolume)


