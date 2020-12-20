//#region Generic HTML Generator
//This function will create <i> tag for player
let createItemElementForMusic = (addPlayIcon) => {
    classList.splice(0, classList.length)
    classList.push('far')
    classList.push((addPlayIcon ? 'fa-play-circle' : 'fa-pause-circle'))
    classList.push('color-white')
    classList.push('font-20')
    let iconElement = CreateDynamicElementByTagNameAndClasses('i', classList)
    iconElement.setAttribute('title', (addPlayIcon ? 'Play' : 'Pause'))
    return iconElement
}

//This function will create generic HTML tag for Weekly Top 9 Section
let createElementWithContent = (serialNumber, songDetail) => {
    //div element 
    classList.splice(0, classList.length)
    classList.push('flex')
    let parentElement = CreateDynamicElementByTagNameAndClasses('div', classList)

    //span element
    classList.splice(0, classList.length)
    classList.push('font-40')
    classList.push('pad-top-10')
    let element = CreateDynamicElementByTagNameAndClasses('span', classList)
    element.innerText = '0' + serialNumber
    parentElement.append(element)

    //image element
    classList.splice(0, classList.length)
    element = CreateDynamicElementByTagNameAndClasses('img', classList)
    element.setAttribute('src', songDetail.imageUrl)
    element.setAttribute('height', '50')
    parentElement.append(element)

    //span element
    classList.splice(0, classList.length)
    classList.push('fixed-width-150')
    classList.push('pad-top-20')
    element = CreateDynamicElementByTagNameAndClasses('span', classList)
    element.innerText = songDetail.name
    parentElement.append(element)

    //span element
    classList.splice(0, classList.length)
    classList.push('pad-top-20')
    element = CreateDynamicElementByTagNameAndClasses('span', classList)
    element.innerText = ConvertSecondsToMinutesAndSecondString(songDetail.max)
    parentElement.append(element)

    //font awesome element
    classList.splice(0, classList.length)
    classList.push('far')
    classList.push('fa-play-circle')
    classList.push('color-white')
    classList.push('font-20')
    let iconElement = CreateDynamicElementByTagNameAndClasses('i', classList)
    iconElement.setAttribute('title', songDetail.id)

    //button element
    classList.splice(0, classList.length)
    classList.push('play-music-button')
    classList.push('btn-without-bg')
    classList.push('pad-top-3')
    element = CreateDynamicElementByTagNameAndClasses('button', classList)
    element.append(iconElement)
    parentElement.append(element)

    return parentElement

}

//#endregion

//#region functions
//This function will toggle Hamburger menu
let toggleHam = () => {
    hamContent.classList.toggle('hidden')
}

let searchSong = (songId) => {
    return availableSongsList.find(element => element.id === songId)
}

let assignHTML_ToPlayButton = (toInclude) => {
    playButtonSmall.innerHTML = ''
    playButtonSmall.append(createItemElementForMusic(toInclude))
    playButton.innerHTML = ''
    playButton.append(createItemElementForMusic(toInclude))

}
//#endregion

//#region Player
let setvolume = (event) => {
    audio.volume = volumeSlider.value / 100
}

let resetAudioPlayer = () => {
    seekSlider.value = 0
    showCurrentSongTimer.innerText = showCurrentSongTimerSmall.innerText = ''
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
        ToggleRecordingSectionBar(true)
    }
    resetAudioPlayer()
    ResetRecorderSettings(true)
    let songDetail = searchSong(songId)
    if (songDetail !== undefined) {
        audio.pause()
        audio = new Audio()
        audio.src = songDetail.url
        audio.addEventListener('timeupdate', (event) => {
            const { currentTime } = event.target
            seekSlider.value = currentTime
            let calculatedTime = ConvertSecondsToMinutesAndSecondString(Math.floor(currentTime))
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
            StartLiveVisualizationForUI(audio)
        }
    }
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
    if (toStartMusic)
        assignHTML_ToPlayButton(false)
    currentSongImage.src = songDetail.imageUrl
}
let playPause = () => {
    if (audio.paused) {
        if (isFirstSong) {
            StartLiveVisualizationForUI(audio)
            isFirstSong = false
        }
        audio.play()
        assignHTML_ToPlayButton(false)
    } else {
        audio.pause()
        assignHTML_ToPlayButton(true)
    }
}
//#endregion

//#region Initialization of content on page
let initializeContent = () => {
    initAudioPlayer()
    setTimeout(function () { document.querySelector('.modal').remove() }, 5000)
}

//This function will load weekly 9 songs on window load
// and we can provide the number of songs required in that section
let loadWeeklySongs = (numberOfSongs) => {
    shuffleAvailablePlayList(availableSongsList)
    for (let index = 0; index < numberOfSongs; index++) {
        if (index === 0)
            assignSongToTrendingBar(availableSongsList[index])
        FindElementBySelector('weekly-top-9-content', true).append(createElementWithContent((index + 1), availableSongsList[index]))
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
        [availableSongsList[i], availableSongsList[j]] = [availableSongsList[j], availableSongsList[i]]
    }
}

//#endregion

//#region Event Handlers
document.onreadystatechange = function (event) {
    if (document.readyState === 'complete')
        loadWeeklySongs(9)
}
window.onload = function (event) {

    songsList = document.querySelectorAll('.play-music-button')
    songsList.forEach(element => { element.addEventListener('click', initAudioPlayer) })
    hamAnchor.addEventListener('click', toggleHam)
    playButton.addEventListener('click', playPause)
    playButtonSmall.addEventListener('click', playPause)
    volumeSlider.addEventListener('change', setvolume)
    rewindTrack.forEach(element => { element.addEventListener('click', rewindCurrentTrack) })
    forwardTrack.forEach(element => { element.addEventListener('click', forwardCurrentTrack) })
    initializeContent()
}
//#endregion


