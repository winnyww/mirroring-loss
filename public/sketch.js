var kinectron = null;
// let depthData = [];
let socket;
let sender = false;
let pointData = [];

let pointDataInUse = [];
let colorDistance = [];

var resolution = 1;
var thresholdMin = 2400;
var thresholdMax = 2900;
let currentTime;

function setup() {
  sender = confirm("Is this the sender?");
  socket = io();
  console.log("socket is on");

  if (sender){
    kinectron = new Kinectron("172.28.144.1");
    kinectron.makeConnection();
    // kinectron.setRawDepthCallback(rawDepthCallback);
    kinectron.setRawDepthCallback(updateDepthDataProcessing);
    console.log("kinect");
  } else {
    //socket.on("connection_name", receive);
    console.log("this is the receiver");
    initTHREE();
    socket.on("connection_name", receive);
  }
}

// function rawDepthCallback(data) {
//   //console.log(data);
//   depthData = data; //raw depth data
// }j

function draw() {
  if (sender) {
  //  if (frameCount % (2) == 0) {
      updateDepthDataProcessing(data);
      // setInterval(updateDepthDataProcessing(), 500);
  //  }
  }
}

function updateDepthDataProcessing(data) {
//  if (depthData != []) {
  pointData = [];
    for (var i = 0; i < data.length ; i += 3) {
      let x = i % 512;
      let y = Math.floor(i / 512);
      let depthInUse = data[i];

      if (depthInUse >= thresholdMin &&depthInUse <= thresholdMax &&depthInUse != 0) {
        if (x % resolution == 0 && y % resolution == 0) {
          let point = {}; // declare the JS object
          // data.x = map(y, 0, 424, -1.0, 1.0).toFixed(2);
          // data.y = map(x, 0, 424, 1.5, -0.5).toFixed(2);
          point.x = (map(y, 0, 512, -1.0, 1.0)).toFixed(5);
          point.y = (map(x, 0, 512, -1.0, 1.0)).toFixed(5);
          point.z = (map(Math.sqrt(depthInUse*depthInUse-(424-y)*(424-y)*10), thresholdMin, thresholdMax, 0.5, -0.5)).toFixed(5);
          // point.z = (map(depthInUse, thresholdMin, thresholdMax-300, 0.5, -0.5)).toFixed(5);
          pointData.push(point);
          //colorDistance.push(map(depthInUse, thresholdMin, thresholdMax, 1.0, 0.0));
          //console.log(colorDistance);
        }
      }
    }

   socket.emit("connection_name", pointData);
    console.log(pointData)
    // console.log(millis() - currentTime);
    // currentTime = millis();
  //}
}

function receive(data){
  //pointDataInUse = data;
  //colorDistance = [];
  pointDataInUse = data;
//  console.log(data);
  // for (var i = 0; i < data.length; i += 1) {
  //   colorDistance.push((map(data[i].z, -1.0, 1.0, 1.0, 0.0)).toFixed(1));
  // }
   //console.log( performance.now() );
  // console.log(  pointDataInUse );
}
/* global
initTHREE
THREE p5 ml5 Stats dat alpha blue brightness color green hue lerpColor lightness red saturation background clear colorMode fill noFill noStroke stroke erase noErase 2D Primitives arc ellipse circle line point quad rect square triangle ellipseMode noSmooth rectMode smooth strokeCap strokeJoin strokeWeight bezier bezierDetail bezierPoint bezierTangent curve curveDetail curveTightness curvePoint curveTangent beginContour beginShape bezierVertex curveVertex endContour endShape quadraticVertex vertex plane box sphere cylinder cone ellipsoid torus loadModel model HALF_PI PI QUARTER_PI TAU TWO_PI DEGREES RADIANS print frameCount deltaTime focused cursor frameRate noCursor displayWidth displayHeight windowWidth windowHeight windowResized width height fullscreen pixelDensity displayDensity getURL getURLPath getURLParams remove disableFriendlyErrors noLoop loop isLooping push pop redraw select selectAll removeElements changed input createDiv createP createSpan createImg createA createSlider createButton createCheckbox createSelect createRadio createColorPicker createInput createFileInput createVideo createAudio VIDEO AUDIO createCapture createElement createCanvas resizeCanvas noCanvas createGraphics blendMode drawingContext setAttributes boolean string number applyMatrix resetMatrix rotate rotateX rotateY rotateZ scale shearX shearY translate storeItem getItem clearStorage removeItem createStringDict createNumberDict append arrayCopy concat reverse shorten shuffle sort splice subset float int str byte char unchar hex unhex join match matchAll nf nfc nfp nfs split splitTokens trim deviceOrientation accelerationX accelerationY accelerationZ pAccelerationX pAccelerationY pAccelerationZ rotationX rotationY rotationZ pRotationX pRotationY pRotationZ turnAxis setMoveThreshold setShakeThreshold deviceMoved deviceTurned deviceShaken keyIsPressed key keyCode keyPressed keyReleased keyTyped keyIsDown movedX movedY mouseX mouseY pmouseX pmouseY winMouseX winMouseY pwinMouseX pwinMouseY mouseButton mouseWheel mouseIsPressed requestPointerLock exitPointerLock touches createImage saveCanvas saveFrames image tint noTint imageMode pixels blend copy filter THRESHOLD GRAY OPAQUE INVERT POSTERIZE BLUR ERODE DILATE get loadPixels set updatePixels loadImage loadJSON loadStrings loadTable loadXML loadBytes httpGet httpPost httpDo Output createWriter save saveJSON saveStrings saveTable day hour minute millis month second year abs ceil constrain dist exp floor lerp log mag map max min norm pow round sq sqrt fract createVector noise noiseDetail noiseSeed randomSeed random randomGaussian acos asin atan atan2 cos sin tan degrees radians angleMode textAlign textLeading textSize textStyle textWidth textAscent textDescent loadFont text textFont orbitControl debugMode noDebugMode ambientLight specularColor directionalLight pointLight lights lightFalloff spotLight noLights loadShader createShader shader resetShader normalMaterial texture textureMode textureWrap ambientMaterial emissiveMaterial specularMaterial shininess camera perspective ortho frustum createCamera setCamera ADD CENTER CORNER CORNERS POINTS WEBGL RGB ARGB HSB LINES CLOSE BACKSPACE DELETE ENTER RETURN TAB ESCAPE SHIFT CONTROL OPTION ALT UP_ARROW DOWN_ARROW LEFT_ARROW RIGHT_ARROW sampleRate freqToMidi midiToFreq soundFormats getAudioContext userStartAudio loadSound createConvolver setBPM saveSound getMasterVolume masterVolume soundOut chain drywet biquadFilter process freq res gain toggle setType pan phase triggerAttack triggerRelease setADSR attack decay sustain release dispose notes polyvalue AudioVoice noteADSR noteAttack noteRelease isLoaded playMode set isPlaying isPaused setVolume getPan rate duration currentTime jump channels frames getPeaks reverseBuffer onended setPath setBuffer processPeaks addCue removeCue clearCues getBlob getLevel toggleNormalize waveform analyze getEnergy getCentroid linAverages logAverages getOctaveBands fade attackTime attackLevel decayTime decayLevel releaseTime releaseLevel setRange setExp width output stream mediaStream currentSource enabled amplitude getSources setSource bands panner positionX positionY positionZ orient orientX orientY orientZ setFalloff maxDist rollof leftDelay rightDelay delayTime feedback convolverNode impulses addImpulse resetImpulse toggleImpulse sequence getBPM addPhrase removePhrase getPhrase replaceSequence onStep musicalTimeMode maxIterations synced bpm timeSignature interval iterations compressor knee ratio threshold reduction record isDetected update onPeak WaveShaperNode getAmount getOversample amp setInput connect disconnect play pause stop start add mult
*/
