let hamAnchor = document.querySelector(".ham"),
    hamContent = document.querySelector(".hamContent"),
    djIcon = document.querySelector("img.dj"),
    mixOptions = document.getElementById("mix-section"),
    btnRecording= document.getElementById("btnRecording")
    recordingSection = document.getElementById("recording-section")
    playSongSection = document.getElementById("play-song-section")
let toggleHam = function() {
    hamContent.classList.toggle("hidden")
}
let toggleDJOptions = () => {
    mixOptions.classList.toggle("hidden")
}
let toggleRecordingSection = () => {
    recordingSection.classList.toggle("hidden")
    playSongSection.classList.toggle("hidden")
}
hamAnchor.addEventListener("click", toggleHam)
djIcon.addEventListener("click", toggleDJOptions)
btnRecording.addEventListener("click", toggleRecordingSection)