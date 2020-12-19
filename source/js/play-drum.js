let allActiveDrumBeats = FindElementBySelector('.opacity-0-3', false, true)

let searchBeat = (beatId) => {
    return drumBeatsList.find(element => element.id === beatId)
}

let playBeat = (event) => {
    const beatDetail = searchBeat(event.target.id)
    if (beatDetail === undefined)
        return
    let audio = new Audio(beatDetail.url)
    audio.play()
    StartLiveVisualizationForUI(audio)
}

allActiveDrumBeats.forEach(element => { element.addEventListener('click', playBeat) });