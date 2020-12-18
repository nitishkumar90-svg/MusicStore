//defaults
window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext

//variables
const trackTime = 5
let hamAnchor = document.querySelector('.ham'),
    hamContent = document.querySelector('.hamContent'),
    btnRecording = document.getElementById('btnRecording'),
    recordingSection = document.getElementById('recording-section'),
    playSongSection = document.getElementById('play-song-section'),
    songsList = document.querySelectorAll('.play-music-button'),
    playButton = document.getElementById('playpausebtn'),
    playButtonSmall = document.getElementById('playpausebtn-small'),
    seekSlider = document.getElementById('seekslider'),
    volumeSlider = document.getElementById('volumeslider'),
    songNameBar = document.getElementById('song-name-bar'),
    songNameSmallBar = document.getElementById('song-name-small-bar'),
    currentSongImage = document.getElementById('current-song-image'),
    txtBoxSearch = document.getElementById('txtSearch'),
    staticSearchDiv = document.getElementById('static-search-div'),
    pauseButtons = document.querySelectorAll('.fa-pause-circle'),
    rewindTrack = document.querySelectorAll('#rewindTrack'),
    forwardTrack = document.querySelectorAll('#forwardTrack'),
    showCurrentSongTimer = document.getElementById('showCurrentSongTimer'),
    showCurrentSongTimerSmall = document.getElementById('showCurrentSongTimerSmall'),
    showTrendingSong = document.querySelectorAll('#show-trending-song'),
    playSongMobileNavBar = document.getElementById('play-song-mobile-nav'),
    recordSongMobileNavBar = document.getElementById('record-song-mobile-nav'),
    playTrendingSongButton = document.getElementById('play-trending-song'),
    classList = [],
    isFirstSong = true,
    audio = new Audio()


// functions
let toggleHam = () => {
    hamContent.classList.toggle('hidden')
}

let toggleRecordingSection = () => {
    playSongMobileNavBar.classList.toggle('hidden')
    recordSongMobileNavBar.classList.toggle('hidden')
    recordingSection.classList.toggle('hidden')
    playSongSection.classList.toggle('hidden')
}

let startVisualization = () => {
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

let createItemElementForMusic = (addPlayIcon) => {
    classList.splice(0, classList.length)
    classList.push('far')
    classList.push((addPlayIcon ? 'fa-play-circle' : 'fa-pause-circle'))
    classList.push('color-white')
    classList.push('font-20')
    let iconElement = dynamicElement('i', classList)
    iconElement.setAttribute('title', (addPlayIcon ? 'Play' : 'Pause'))
    return iconElement
}

let dynamicElement = (tagName, classList) => {
    let tagElement = document.createElement(tagName)
    for (let index = 0; index < classList.length; index++) {
        tagElement.classList.add(classList[index])
    }
    return tagElement
}

let createElementWithContent = (serialNumber, songDetail) => {
    //div element 
    classList.splice(0, classList.length)
    classList.push('flex')
    let parentElement = dynamicElement('div', classList)

    //span element
    classList.splice(0, classList.length)
    classList.push('font-40')
    classList.push('pad-top-10')
    let element = dynamicElement('span', classList)
    element.innerText = '0' + serialNumber
    parentElement.append(element)

    //image element
    classList.splice(0, classList.length)
    element = dynamicElement('img', classList)
    element.setAttribute('src', songDetail.imageUrl)
    element.setAttribute('height', '50')
    parentElement.append(element)

    //span element
    classList.splice(0, classList.length)
    classList.push('fixed-width-150')
    classList.push('pad-top-20')
    element = dynamicElement('span', classList)
    element.innerText = songDetail.name
    parentElement.append(element)

    //span element
    classList.splice(0, classList.length)
    classList.push('pad-top-20')
    element = dynamicElement('span', classList)
    element.innerText = convertSecondstoTime(songDetail.max)
    parentElement.append(element)

    //font awesome element
    classList.splice(0, classList.length)
    classList.push('far')
    classList.push('fa-play-circle')
    classList.push('color-white')
    classList.push('font-20')
    let iconElement = dynamicElement('i', classList)
    iconElement.setAttribute('title', songDetail.id)

    //button element
    classList.splice(0, classList.length)
    classList.push('play-music-button')
    classList.push('btn-without-bg')
    classList.push('pad-top-3')
    element = dynamicElement('button', classList)
    element.append(iconElement)
    parentElement.append(element)

    return parentElement

}

let loadWeeklySongs = (numberOfSongs) => {
    shuffleAvailablePlayList(availableSongsList)
    for (let index = 0; index < numberOfSongs; index++) {
        if (index === 0)
            assignSongToTrendingBar(availableSongsList[index])
        document.getElementById('weekly-top-9-content').append(createElementWithContent((index + 1), availableSongsList[index]))
    }
}

let assignSongToTrendingBar = (songDetail) => {
    showTrendingSong.forEach(trend => {
        trend.setAttribute('value', songDetail.id)
        trend.innerText = songDetail.name
    })
    playTrendingSongButton.setAttribute('value', songDetail.id)
}

let shuffleAvailablePlayList = (availableSongsList) => {
    for (let i = availableSongsList.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [availableSongsList[i], availableSongsList[j]] = [availableSongsList[j], availableSongsList[i]];
    }
}

let initializeContent = () => {
    initAudioPlayer()
    staticSearchDiv.clientWidth = txtBoxSearch.clientWidth
    setTimeout(function () { document.querySelector('.modal').remove() }, 1000)
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
            songUrl = element
        }
    })
    return songUrl
}


let playPause = () => {
    if (audio.paused) {
        if (isFirstSong) {
            startVisualization()
            isFirstSong = false
        }
        audio.play()
        playButtonSmall.innerHTML = ''
        playButtonSmall.append(createItemElementForMusic(false))
        playButton.innerHTML = ''
        playButton.append(createItemElementForMusic(false))
    } else {
        audio.pause()
        playButtonSmall.innerHTML = ''
        playButtonSmall.append(createItemElementForMusic(true))
        playButton.innerHTML = ''
        playButton.append(createItemElementForMusic(true))
    }
}
let setvolume = (event) => {
    audio.volume = volumeSlider.value / 100
}

let initAudioPlayer = (event) => {
    var autoPlay = false
    let songId
    if (event === undefined)
        songId = 'tenderness'
    else {
        if (!event.target.hasAttribute('title')) {
            songId = event.target.value
        }
        else {
            songId = event.target.title
        }
        autoPlay = true
    }
    let songDetail = searchSong(songId)
    if (songDetail !== undefined) {
        audio.pause()
        audio = new Audio()
        audio.src = songDetail.url
        audio.addEventListener('timeupdate', (event) => {
            const { currentTime } = event.target
            seekSlider.value = currentTime
            let calculatedTime = convertSecondstoTime(Math.floor(currentTime))
            showCurrentSongTimer.innerText = calculatedTime
            showCurrentSongTimerSmall.innerText = calculatedTime
        })
        audio.onloadedmetadata = () => seekSlider.max = audio.duration
        seekSlider.onclick = () => audio.currentTime = seekSlider.value
        audio.loop = true
        audio.volume = volumeSlider.value / 100
        assignValuesToPlayer(songDetail, autoPlay)
        if (autoPlay) {
            audio.play()
            startVisualization()
        }
    }
}


let convertSecondstoTime = (seconds) => {
    let currentDateTime = new Date(seconds * 1000)
    return currentDateTime.getUTCMinutes().toString().padStart(2, '0')
        + ':'
        + currentDateTime.getUTCSeconds().toString().padStart(2, '0')
}

let rewindCurrentTrack = () => {
    audio.currentTime -= trackTime
}

let forwardCurrentTrack = () => {
    audio.currentTime += trackTime
}


let assignValuesToPlayer = (songDetail, toStartMusic) => {
    songNameBar.innerText = songDetail.name
    songNameSmallBar.innerText = songDetail.name
    songNameSmallBar.innerText = songDetail.name
    if (toStartMusic) {
        playButtonSmall.innerHTML = ''
        playButtonSmall.append(createItemElementForMusic(false))
        playButton.innerHTML = ''
        playButton.append(createItemElementForMusic(false))
    }
    currentSongImage.src = songDetail.imageUrl
}


document.onreadystatechange = function (event) {
    if (document.readyState === 'complete')
        loadWeeklySongs(9)
}
window.onload = function (event) {
    songsList = document.querySelectorAll('.play-music-button')
    songsList.forEach(element => { element.addEventListener('click', initAudioPlayer) })
    btnRecording.addEventListener('click', toggleRecordingSection)
    hamAnchor.addEventListener('click', toggleHam)
    playButton.addEventListener('click', playPause)
    playButtonSmall.addEventListener('click', playPause)
    volumeSlider.addEventListener('change', setvolume)
    rewindTrack.forEach(element => { element.addEventListener('click', rewindCurrentTrack) })
    forwardTrack.forEach(element => { element.addEventListener('click', forwardCurrentTrack) })
    initializeContent()
}


