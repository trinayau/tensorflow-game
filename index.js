const config = {
    video:{
        width: 200,
        height: 200,
        fps: 30
    }
}

console.log('hi')

async function initVideo(width, height, fps){
    const constraints = {
        audio: false,
        video: {
            facingMode: "user",
            width: width,
            height: height,
            frameRate: {max: fps}
        }
    }

    const video = document.querySelector("#pose-video");
    video.width = width;
    video.height = height;

    const stream = await navigator.mediaDevices.getUserMedia(constraints);

    video.srcObject = stream;

    // Wait for the video to start to play before loading the model.
    return new Promise((resolve) => {
        video.onloadedmetadata = () => {
            resolve(video);
        };
    });

}

window.addEventListener('DOMContentLoaded', () => {
    initVideo(config.video.width, config.video.height, config.video.fps).then(video => {
        video.play()
        video.addEventListener('loadeddata', event=>{
            console.log('video loaded')

        })
    })
})
