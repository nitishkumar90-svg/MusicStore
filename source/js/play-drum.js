//#region function

let searchBeatById = (beatId) => {
    return drumBeatsList.find(element => element.id === beatId)
}
let searchBeatByAlphabet = (beatKey) => {
    return drumBeatsList.find(element => element.key === beatKey)
}

let playBeat = (event) => {
    const beatDetail = searchBeatById(event.target.id)
    if (beatDetail === undefined)
        return
    playBeatAudio(beatDetail.url)
}

let playBeatByKey = (event) => {
    const beatDetail = searchBeatByAlphabet(event.key)
    if (beatDetail === undefined)
        return
    playBeatAudio(beatDetail.url)
}

let resetPreviousAudio = () => {
    if (audio !== undefined) {
        audio.pause()
        ResetRecorderSettings(true)
        togglePlayPauseButtonUI(true)
    }
}

let playBeatAudio = (url) => {
    resetPreviousAudio()
    let audio = new Audio(url)
    audio.play()
    StartLiveVisualizationForUI(audio)
}

let showAlertForDrumIcons = () => {
    let alertHtml = ''
    let oneLineSpace = '\n'
    for (let index = 0; index < drumBeatsList.length; index++) {
        alertHtml += 'Shift + ' + drumBeatsList[index].key + ' - ' + drumBeatsList[index].id + oneLineSpace
    }
    alert('You can also use following keyboard keys to play drum beats.' + oneLineSpace + alertHtml)
}

//#endregion

//#region Event handlers
allActiveDrumBeats.forEach(element => { element.addEventListener('click', playBeat) });
drumInfo.addEventListener('click', showAlertForDrumIcons)
document.addEventListener('keyup', playBeatByKey)
//#endregion