const config = {
    video:{
        width: 200,
        height: 200,
        fps: 30
    }
}

async function createDetector(){
    return window.handPoseDetection.createDetector(window.handPoseDetection.SupportedModels.MediaPipeHands, {
        runtime: 'mediapipe',
        modelType: 'lite',
        maxHands: 1,
        solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1646424915'

    })

}

async function main(){
    const video = document.querySelector('#pose-video')
    const detector = await createDetector()
    console.log('ML model created')

    const detectHand = async()=>{
        const hands = await detector.estimateHands(video, {flipHorizontal: true})
        console.log(hands)

        for(const hand of hands){
            const {score, handedness} = hand;
            console.log(score, handedness)
        }
        
    setTimeout(()=>{
        detectHand()
    }, 1000/config.video.fps)
    }
    detectHand()
    
    
}

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
            console.log('camera loaded')
            main()

        })
    })
})
