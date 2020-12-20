//#region Generic HTML Generator

//This function will create <i> tag for player
let createItemElementForMusic = (addPlayIcon) => {
    ClassList.splice(0, ClassList.length)
    ClassList.push(`far`)
    ClassList.push((addPlayIcon ? `fa-play-circle` : `fa-pause-circle`))
    ClassList.push(`color-white`)
    ClassList.push(`font-20`)
    let iconElement = CreateDynamicElementByTagNameAndClasses(`i`, ClassList)
    iconElement.setAttribute(`title`, (addPlayIcon ? `Play` : `Pause`))
    return iconElement
}

//This function will create generic HTML tag for Weekly Top 9 Section
let createElementWithContent = (serialNumber, songDetail) => {
    //div element 
    ClassList.splice(0, ClassList.length)
    ClassList.push(`flex`)
    let parentElement = CreateDynamicElementByTagNameAndClasses(`div`, ClassList)

    //span element
    ClassList.splice(0, ClassList.length)
    ClassList.push(`font-40`)
    ClassList.push(`pad-top-10`)
    let element = CreateDynamicElementByTagNameAndClasses(`span`, ClassList)
    element.innerText = `0` + serialNumber
    parentElement.append(element)

    //image element
    ClassList.splice(0, ClassList.length)
    element = CreateDynamicElementByTagNameAndClasses(`img`, ClassList)
    element.setAttribute(`src`, songDetail.imageUrl)
    element.setAttribute(`height`, `50`)
    parentElement.append(element)

    //span element
    ClassList.splice(0, ClassList.length)
    ClassList.push(`fixed-width-150`)
    ClassList.push(`pad-top-20`)
    element = CreateDynamicElementByTagNameAndClasses(`span`, ClassList)
    element.innerText = songDetail.name
    parentElement.append(element)

    //span element
    ClassList.splice(0, ClassList.length)
    ClassList.push(`pad-top-20`)
    element = CreateDynamicElementByTagNameAndClasses(`span`, ClassList)
    element.innerText = ConvertSecondsToMinutesAndSecondString(songDetail.max)
    parentElement.append(element)

    //font awesome element
    ClassList.splice(0, ClassList.length)
    ClassList.push(`far`)
    ClassList.push(`fa-play-circle`)
    ClassList.push(`color-white`)
    ClassList.push(`font-20`)
    let iconElement = CreateDynamicElementByTagNameAndClasses(`i`, ClassList)
    iconElement.setAttribute(`title`, songDetail.id)

    //button element
    ClassList.splice(0, ClassList.length)
    ClassList.push(`play-music-button`)
    ClassList.push(`btn-without-bg`)
    ClassList.push(`pad-top-3`)
    element = CreateDynamicElementByTagNameAndClasses(`button`, ClassList)
    element.append(iconElement)
    parentElement.append(element)

    return parentElement

}

//#endregion

//#region functions
//This function will toggle Hamburger menu
let toggleHam = () => {
    hamContent.classList.toggle(`hidden`)
}

//This function will be used to find song from available songs list in music-list.js file
let searchSong = (songId) => {
    return availableSongsList.find(element => element.id === songId)
}


//This function will change the inner html of play button
//If song is in progress, user will see pause button
// else if song is in pause state, user will see play button
let togglePlayPauseButtonUI = (toShowPlayButton) => {
    playButtonSmall.innerHTML = ``
    playButtonSmall.append(createItemElementForMusic(toShowPlayButton))
    playButton.innerHTML = ``
    playButton.append(createItemElementForMusic(toShowPlayButton))

}
//#endregion

//#region Player

//This function will set the current volume of song played
let setvolume = (event) => {
    audio.volume = volumeSlider.value / 100
}

//This function is used to reset the current audio and also reset the timee for it.
let resetAudioPlayer = () => {
    seekSlider.value = 0
    showCurrentSongTimer.innerText = showCurrentSongTimerSmall.innerText = ``
}

//This function will initialize the player and set the audio into it to play
let initAudioPlayer = (event) => {
    var autoPlay = false
    let songId
    if (event === undefined)
        songId = `tenderness`
    else {
        if (!event.target.hasAttribute(`title`)) {
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
        audio.addEventListener(`timeupdate`, (event) => {
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

//this function will rewind the current audio by 5 seconds
// TrackTime is set to 5s in initializer.js
let rewindCurrentTrack = () => {
    audio.currentTime -= TrackTime
}

//this function will forward the current audio by 5 seconds
// TrackTime is set to 5s in initializer.js
let forwardCurrentTrack = () => {
    audio.currentTime += TrackTime
}


//this function will be used to assign the values from audio to player bar
let assignValuesToPlayer = (songDetail, toStartMusic) => {
    songNameBar.innerText = songDetail.name
    songNameSmallBar.innerText = songDetail.name
    songNameSmallBar.innerText = songDetail.name
    if (toStartMusic)
        togglePlayPauseButtonUI(false)
    currentSongImage.src = songDetail.imageUrl
}

//This function will be used to toggle between play and pause for audio track
let playPause = () => {
    if (audio.paused) {
        if (IsFirstSong) {
            StartLiveVisualizationForUI(audio)
            IsFirstSong = false
        }
        audio.play()
        togglePlayPauseButtonUI(false)
    } else {
        audio.pause()
        togglePlayPauseButtonUI(true)
    }
}
//#endregion

//#region Initialization of content on page
let initializeContent = () => {
    initAudioPlayer()
    setTimeout(function () { document.querySelector(`.modal`).remove() }, 5000)
}

//This function will load weekly 9 songs on window load
// and we can provide the number of songs required in that section
let loadWeeklySongs = (numberOfSongs) => {
    shuffleAvailablePlayList(availableSongsList)
    for (let index = 0; index < numberOfSongs; index++) {
        if (index === 0)
            assignSongToTrendingBar(availableSongsList[index])
        FindElementBySelector(`weekly-top-9-content`, true).append(createElementWithContent((index + 1), availableSongsList[index]))
    }
}

//This will assign current trending song to header section
let assignSongToTrendingBar = (songDetail) => {
    showTrendingSong.forEach(trend => {
        trend.setAttribute(`value`, songDetail.id)
        trend.innerText = songDetail.name
    })
    playTrendingSongButton.setAttribute(`value`, songDetail.id)
}

//This function is used to shuffle the current available playlist
let shuffleAvailablePlayList = (availableSongsList) => {
    for (let i = availableSongsList.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [availableSongsList[i], availableSongsList[j]] = [availableSongsList[j], availableSongsList[i]]
    }
}

//#endregion

//#region Event Handlers
document.onreadystatechange = function (event) {
    if (document.readyState === `complete`)
        loadWeeklySongs(9)
}
window.onload = function (event) {
    songsList = document.querySelectorAll(`.play-music-button`)
    songsList.forEach(element => { element.addEventListener(`click`, initAudioPlayer) })
    hamAnchor.addEventListener(`click`, toggleHam)
    hamAllAnchors.forEach(element => { element.addEventListener(`click`, toggleHam) })
    playButton.addEventListener(`click`, playPause)
    playButtonSmall.addEventListener(`click`, playPause)
    volumeSlider.addEventListener(`change`, setvolume)
    rewindTrack.forEach(element => { element.addEventListener(`click`, rewindCurrentTrack) })
    forwardTrack.forEach(element => { element.addEventListener(`click`, forwardCurrentTrack) })
    initializeContent()
}
//#endregion


