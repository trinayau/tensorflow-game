const ditto = document.getElementById('image')
const cssStyle = window.getComputedStyle(ditto)
const numberText = document.getElementById('number')
const directionText = document.getElementById('direction')
const directionText2 = document.getElementById('direction2')
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

        const prvPos = cssStyle.getPropertyValue('left');
    
        for(const hand of hands){
            const {score, handedness} = hand;
            console.log(score, handedness)
            if(score > 0.85 && handedness === 'Right') {
                ditto.style.left = `calc(${prvPos} + 10px)`
             numberText.innerHTML = parseInt(numberText.innerHTML) + 1
             directionText.innerHTML = 'right'
             directionText2.innerHTML = 'right'
             checkConfetti()
            } else if(score > 0.85 && handedness ==='Left') {
                ditto.style.left = `calc(${prvPos} - 10px)`
                numberText.innerHTML = parseInt(numberText.innerHTML) + 1
                directionText.innerHTML = 'left'
                directionText2.innerHTML = 'left'
                checkConfetti()
            }
        }
        
    setTimeout(()=>{
        detectHand()
    }, 1000/config.video.fps)
    }
    detectHand()
    
    
}

const checkConfetti = () => {
    if (numberText.innerHTML % 100 === 0) {
        setTimeout(function() {
            confetti.start()
        }, 100);
        setTimeout(function() {
            confetti.stop()
        }
        , 3000);

    }
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
