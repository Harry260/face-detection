const video = document.getElementById('video')
var isChrome = !!window.chrome;



Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('/models')
]).then(startVideo)

function startVideo() {

  if(isChrome == true){
    document.querySelector('.load-div').style.left = '-100%';
    navigator.getUserMedia(
      { video: {} },
      stream => video.srcObject = stream,
      err => console.error(err)
    )
  }
  else{
    alert('Sorry! This project does not support this browser! Try using Google Chrome');
    window.location.replace('https://harrytom.ml')
  }


}

video.addEventListener('play', () => {
  const canvas = faceapi.createCanvasFromMedia(video)
  document.body.append(canvas)
  const displaySize = { width: video.width, height: video.height }
  faceapi.matchDimensions(canvas, displaySize)
  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
    faceapi.draw.drawDetections(canvas, resizedDetections)

    var checkBox = document.getElementById("landmark-ch");
    if (checkBox.checked == true){
      faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
    } else {}

    faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
  }, 100)
})

