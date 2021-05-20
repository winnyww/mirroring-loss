/*
To Do:
- performance
- noise
*/



const WORLD_SIZE = 300;
const MAX_PARTICLE_NUMBER = 50000;

let pointCloud;
let movers = [];
let currentMovers = [];
let originalMovers = [];
let gap = [];

let originalX = [];
let originalY = [];
let originalZ = [];

let currentX = [];
let currentY = [];
let currentZ = [];

let test = false;
let testArray = [];
let playedOnce = false;
let leaveDuringProcess;

//text and falling effect
let counter = 0;
// let timeSequence = [3, 8, 11, 16, 21, 28, 36, 44, 48, 55, 59];//time
let timeSequence = [0, 3, 5, 7, 10, 13, 16, 19, 22, 25, 28, 31, 33];//time
let dateSequence = [" ", "covid","2020-01-29", "2020-03-10", "2020-04-04", "2020-05-15", "2020-06-29", "2020-08-23", "2020-10-31"
                   , "2021-01-01", "2021-02-05", "2021-04-01", "2021-05-17"];//time
let deathSequence = [" ", "death toll", "131", "3,815", "54,340", "295,109", "494,723", "797,380", "1,182,459", "1,802,579", "2,264,674", "2,798,474", "3,311,767"];//particle number
let testSequence = [0, 0, 0.00004, 0.0012, 0.0172, 0.072, 0.06, 0.092, 0.116, 0.19, 0.14, 0.16, 0.15];//particle number
let start;
let end = MAX_PARTICLE_NUMBER;
let frameBefore = 0;

let dataCounter = 0;
let datesData = [];
let deathsData = [];


function setupThree() {
  // //set up particles
  for (let i = 0; i < MAX_PARTICLE_NUMBER; i++) {
    // get the origin position
    let origin = createVector(random(-1, 1), random(-1.0, 1.0), random(-1.0, 1.0));
    origin.normalize();
    origin.mult(50);

    originalX.push(origin.x);
    originalY.push(origin.y);
    originalZ.push(origin.z);

    //get current position
    let current= createVector(random(-1, 1), random(-1.0, 1.0), random(-1.0, 1.0));
    current.normalize();
    current.mult(100);

    currentX.push(current.x);
    currentY.push(current.y);
    currentZ.push(current.z);

     // generate the object
    let theMover = new Mover()
      .setPosition(origin.x, origin.y, origin.z)
      .setVelocity(random(-1.0, 1.0), random(-1.0, 1.0), random(-1.0, 1.0))
      .setOriginPosition(current.x, current.y, current.z);
    movers.push(theMover);
  }

  // set point cloud
  pointCloud = getPoints();
  scene.add(pointCloud);
  // setup the GUI

  // params.numParticle = 0;
  // gui
  //   .add(params, "numParticle")
  //   .min(0)
  //   .max(MAX_PARTICLE_NUMBER)
  //   .step(1)
  //   .listen();
  //
  // params.near = 0.5;
  // params.far = 0;//100
  // params.density = 0;//0.1
  // let folder = gui.addFolder("FOG");
  // folder.add(params, "near", 0, 100).step(1);
  // folder.add(params, "far", 0, 100).step(1);
  // folder.add(params, "density", 0, 0.10).step(0.001);
}

function updateThree() {
  // fog
  //scene.fog = new THREE.Fog("#111111", params.near, params.far);
  // scene.fog = new THREE.FogExp2("#111111", params.density);

   //console.log(pointDataInUse.length)

     if (pointDataInUse.length > 2500){//when someone come in front of kinect
       // form human image
       if (frameBefore == 0 && leaveDuringProcess == false){//set all particles
           for (let i = 0; i < pointDataInUse.length; i++) {
            if (random(1) < 0.01) {
              let scaleAdj = 100;
              let data = pointDataInUse[i];
              let theMover = new Mover()
                .setPosition(data.x * scaleAdj, data.y * scaleAdj, data.z * scaleAdj)
                //.setOriginPosition(data.x * scaleAdj, data.y * scaleAdj, data.z * scaleAdj)
                .setVelocity(0, 0, 0);
               movers.push(theMover);
              }
            }

            for (let i = 0; i < movers.length; i++) {
              let m = movers[i];
              m.update();
              m.updateLifespan();
            }
          } else {  //update only limited particles
            for (let i = 0; i < pointDataInUse.length; i++) {
             if (random(1) < 0.01) {
               let scaleAdj = 100;
               let data = pointDataInUse[i];
               let theMover = new Mover()
                 .setPosition(data.x * scaleAdj, data.y * scaleAdj, data.z * scaleAdj)
                 //.setOriginPosition(data.x * scaleAdj, data.y * scaleAdj, data.z * scaleAdj)
                 .setVelocity(random(0.001, 0.005), 0, 0);
                 if (i < end){
                   movers[i] = theMover;
                 }
               }
             }

             for (let i = 0; i < movers.length; i++) {
               let m = movers[i];
               m.update();
             }
           }



      //process begin
      //wait for few seconds
        if (frameBefore == 0){
          frameBefore = frame + 60*5;//wait 5 seconds
          console.log(frameBefore)
        }

        //start sequence
        if ((frame-frameBefore) / 60 == timeSequence[counter]) {

            console.log((frame-frameBefore) / 60 + " " + dateSequence[counter]);
            counter++;
            console.log("falling=" + Math.round(testSequence[counter]*movers.length));

            //set particles as falling
            if (end == MAX_PARTICLE_NUMBER){
              for (let i = 0; i < movers.length; i++) {
                let m = movers[i];
                m.setVelocity(0, 0, 0);
                m.setVelocity(random(0.001, 0.005), 0, random(0.0003, 0.0005));
              }
            }

            //sequences - particle order
            start = end;
            end = end - Math.round(testSequence[counter]*movers.length);
            console.log('end=' + end + "," + 'start=' + start)
            init(dateSequence[counter], deathSequence[counter]);
          }
        //start text
        // if ((frame-frameBefore) % 8  == 0) {
        //   if (dataCounter < datesData.length-1){
        //     dataCounter++;
        //   }
        //   init(dateSequence[dataCounter], deathSequence[dataCounter]);
        // }

        // let inputDates = dateSequence[dataCounter];
        // let inputDeaths = deathSequence[dataCounter]


        //start falling
        for (let j = end ; j < start; j++) {
          let p_falling = movers[j];
            p_falling.flow(0.0001);
            p_falling.adjustVelocity(0.1); // play with this number
            p_falling.checkFloor(end);
        }

        //finish falling
        if (start == 78 && leaveDuringProcess == true){

          end = MAX_PARTICLE_NUMBER;
          leaveDuringProcess = false;
          setTimeout(init("Mirroring Loss:", "1 year of COVID-19 in 1 minute"), 3000);
          setTimeout(clearAll(), 6000);
          setTimeout(reStart(), 8000);
        }

    } else {

          if (frameBefore != 0 && counter != 0){//restart if people move during the process
            for (let i = 0; i < movers.length; i++) {
              if (movers[i].lifespan < 0.1){
                movers.splice(i, 1);
              }
            }
                init(" ", " ");
                counter = 0;
                frameBefore == 0;
                leaveDuringProcess = true;
                end = MAX_PARTICLE_NUMBER;
                initTHREE();
            }

          if (frameBefore != 0 && counter == 0){//restart if people move before the process
              for (let i = 0; i < movers.length; i++) {
                if (movers[i].lifespan < 0.1){
                  movers.splice(i, 1);
                }
              }
              frameBefore = 0;
            }

            if (movers.length < MAX_PARTICLE_NUMBER){

              for (let i = 0; i < MAX_PARTICLE_NUMBER-movers.length; i++) {//re-enter the points
                let origin = createVector(random(-1.0, 1.0), random(-1.0, 1.0), random(-1.0, 1.0));
                origin.normalize();
                origin.mult(50);
                //get current position
                 let current= createVector(random(-1.0, 1.0), random(-1.0, 1.0), random(-1.0, 1.0));
                current.normalize();
                current.mult(100);
                currentMovers.push(current);

                 // generate the object
                let theMover = new Mover()
                  .setPosition(origin.x, origin.y, origin.z)
                  .setVelocity(random(-1.0, 1.0), random(-1.0, 1.0), random(-1.0, 1.0))
                  .setOriginPosition(current.x, current.y, current.z);
                movers.push(theMover);
              }
          } else {//when no one comes close at all

            for (let i = 0; i < movers.length; i++) {

              let m = movers[i];
                if(m.inactive == true){
                  m.inactive = false;
                }
                m.attractedTo(currentX[i], currentY[i], currentZ[i]);
                m.attractedToOrigin();
                m.update();
            }
          }
        }



    // update gui
    //params.numParticle = movers.length;

    while (movers.length > MAX_PARTICLE_NUMBER) {
      movers.splice(0, 1);
    }

    //update the points
    let positionArray = pointCloud.geometry.attributes.position.array;
    let colorArray= pointCloud.geometry.attributes.color.array;
    for (let i = 0; i < movers.length; i++) {
      let m = movers[i];
      let index = i * 3;
      positionArray[index + 0] = m.pos.x;
      positionArray[index + 1] = m.pos.y;
      positionArray[index + 2] = m.pos.z;
      //color
      colorArray[index + 0] = m.lifespan;
      colorArray[index + 1] = m.lifespan;
      colorArray[index + 2] = m.lifespan;
    }
    pointCloud.geometry.setDrawRange(0, movers.length);
    pointCloud.geometry.attributes.position.needsUpdate = true;
    pointCloud.geometry.attributes.color.needsUpdate = true;
    // console.log("hi");
    //console.log(pointCloud.geometry.attributes.color);
  }

function clearAll(){
  for (let i = 0; i < movers.length; i++) {
    movers.splice(0, 1);
  }
}

function reStart(){
  init(" ", " ");
  counter = 0;
  frameBefore == 0;
  end = MAX_PARTICLE_NUMBER;
  initTHREE();
}

function getPoints() {
  const vertices = [];
  const colors = new Float32Array(MAX_PARTICLE_NUMBER * 3);

  for (let i = 0; i < MAX_PARTICLE_NUMBER; i++) {
    vertices.push(0, 0, 0);
  }

  // geometry
  const geometry = new THREE.BufferGeometry();
  // attributes
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(vertices, 3)
  );

  geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  // draw range
  const drawCount = MAX_PARTICLE_NUMBER; // draw the whole objects
  geometry.setDrawRange(0, drawCount);
  // geometry
  // const textureImage = new THREE.FileLoader();
  // textureImage.load("../assets/particle_texture.jpg");
  const texture = new THREE.TextureLoader().load("/assets/particle_texture.jpg");

  //console.log(geometry);

  const material = new THREE.PointsMaterial({
    //color: 0xFFFFFF,
    vertexColors: true,
    size: 0.6,
    sizeAttenuation: true, // default
    opacity: 0.7,
    // transparent: true,
    depthTest: false,
    blending: THREE.AdditiveBlending,
    map: texture
  });
  // Points
  const points = new THREE.Points(geometry, material);
  return points;
}

class Mover {
  constructor() {
    this.pos = createVector();
    this.vel = createVector();
    this.acc = createVector();
    this.origin = createVector();

    this.scl = createVector(1, 1, 1);
    this.mass = this.scl.x * this.scl.y * this.scl.z;

    this.lifespan = 1.0;
    this.lifeReduction = random(0.007, 0.009);
    this.lifeReductionSlow= random(0.002, 0.005);
    this.isDone = false;
    this.inactive = false;
    // this.fallOffset = random(0, 60);
  }
  setPosition(x, y, z) {
    this.pos = createVector(x, y, z);
    return this;
  }
  setVelocity(x, y, z) {
    this.vel = createVector(x, y, z);
    return this;
  }
  setOriginPosition(x, y, z) {
    this.origin = createVector(x, y, z);
    return this;
  }
  update() {
    if (this.inactive) return;
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0); //clearing the acceleration for each fram
  }
  flow(adjustment) {
    let xFreq = this.pos.x * 0.05 + frame * 0.005;
    let yFreq = this.pos.y * 0.05 + frame * 0.005;
    let zFreq = this.pos.z * 0.05 + frame * 0.005;
    let noiseValue = map(noise(xFreq, yFreq, zFreq), 0.0, 1.0, -1.0, 1.0);
    let force = new p5.Vector(
      cos(frame * 0.005),
      sin(frame * 0.005),
      sin(frame * 0.002)
    );
    force.normalize();
    force.mult(noiseValue * adjustment);
    this.applyForce(force);
  }
  adjustVelocity(amount) {
    this.vel.mult(1 + amount);
  }
  updateLifespan() {
    this.lifespan -= this.lifeReduction = 0.02;
    if (this.lifespan <= 0) {
      this.lifespan = 0;
      this.isDone = true;
    }
  }

  updateLifespanSlowly() {
    this.lifespan -= this.lifeReductionSlow = 0.01;
    if (this.lifespan <= 0) {
      this.lifespan = 0;
      this.isDone = true;
    }
  }

  gainLifespan() {
    this.lifespan += this.lifeIncrease = 1.0;
  }

  applyForce(f) {
    let force = f.copy();
    force.div(this.mass);
    this.acc.add(force);
  }

  stopForce(){
    this.acc = createVector();
  }

  checkFloor(num) {
    let byTime = map(num, 50000, 0, 0, 1.0);
    let pile = Math.random(byTime, byTime+0.1);
    if (this.pos.x > WORLD_SIZE / 5 - pile) {
      this.inactive = true;
    }
  }

  attractedTo(x, y, z) {
    let target = new p5.Vector(x, y, z);
    let force = p5.Vector.sub(target, this.pos);
    if (force.mag() < 10) {
      force.mult(-0.0001 * random(1, 3));
    } else {
      force.mult(0.00001);
    }
    this.applyForce(force);
  }

  attractedToOrigin() {
    let target = new p5.Vector(this.origin.x, this.origin.y, this.origin.z);
    let force = p5.Vector.sub(target, this.pos);
    if (force.mag() < 10) {
      force.mult(-0.0001 * random(1, 3));
    } else {
      force.mult(0.00001);
    }
    this.applyForce(force);
  }
}

///// p5.js /////

///// three.js /////

let stats, gui, params;
let container, scene, camera, renderer;
let frame = 0;

function initTHREE() {
  // scene
  scene = new THREE.Scene();

  // camera (fov, ratio, near, far)
  camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.5,
    5000
  );
  // camera.position.z = 100;
  camera.position.z = 100
  camera.position.x= -40

  // renderer
  renderer = new THREE.WebGLRenderer();
  renderer.setClearColor("#000000");
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  // container
  container = document.getElementById("container-three");
  container.appendChild(renderer.domElement);

  // controls
 let controls = new THREE.OrbitControls(camera, renderer.domElement);

  // gui
  // https://davidwalsh.name/dat-gui
//  gui = new dat.gui.GUI();
//  params = {};

  // stats
  //stats = new Stats();
  //stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
//  container.appendChild(stats.dom);

  //
  setupThree();

  // let's draw!
  animate();
}

function init(input1, input2){
  document.getElementById("container-text").innerHTML = input1 + '&nbsp;' + '&nbsp;'+ input2;
}
function animate() {
  requestAnimationFrame(animate);
  //stats.update();

  updateThree();

  frame++;
  renderer.render(scene, camera);
}

// event listeners
window.addEventListener("resize", onWindowResize, false);
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

/* global
initTHREE
THREE p5 ml5 Stats dat alpha blue brightness color green hue lerpColor lightness red saturation background clear colorMode fill noFill noStroke stroke erase noErase 2D Primitives arc ellipse circle line point quad rect square triangle ellipseMode noSmooth rectMode smooth strokeCap strokeJoin strokeWeight bezier bezierDetail bezierPoint bezierTangent curve curveDetail curveTightness curvePoint curveTangent beginContour beginShape bezierVertex curveVertex endContour endShape quadraticVertex vertex plane box sphere cylinder cone ellipsoid torus loadModel model HALF_PI PI QUARTER_PI TAU TWO_PI DEGREES RADIANS print frameCount deltaTime focused cursor frameRate noCursor displayWidth displayHeight windowWidth windowHeight windowResized width height fullscreen pixelDensity displayDensity getURL getURLPath getURLParams remove disableFriendlyErrors noLoop loop isLooping push pop redraw select selectAll removeElements changed input createDiv createP createSpan createImg createA createSlider createButton createCheckbox createSelect createRadio createColorPicker createInput createFileInput createVideo createAudio VIDEO AUDIO createCapture createElement createCanvas resizeCanvas noCanvas createGraphics blendMode drawingContext setAttributes boolean string number applyMatrix resetMatrix rotate rotateX rotateY rotateZ scale shearX shearY translate storeItem getItem clearStorage removeItem createStringDict createNumberDict append arrayCopy concat reverse shorten shuffle sort splice subset float int str byte char unchar hex unhex join match matchAll nf nfc nfp nfs split splitTokens trim deviceOrientation accelerationX accelerationY accelerationZ pAccelerationX pAccelerationY pAccelerationZ rotationX rotationY rotationZ pRotationX pRotationY pRotationZ turnAxis setMoveThreshold setShakeThreshold deviceMoved deviceTurned deviceShaken keyIsPressed key keyCode keyPressed keyReleased keyTyped keyIsDown movedX movedY mouseX mouseY pmouseX pmouseY winMouseX winMouseY pwinMouseX pwinMouseY mouseButton mouseWheel mouseIsPressed requestPointerLock exitPointerLock touches createImage saveCanvas saveFrames image tint noTint imageMode pixels blend copy filter THRESHOLD GRAY OPAQUE INVERT POSTERIZE BLUR ERODE DILATE get loadPixels set updatePixels loadImage loadJSON loadStrings loadTable loadXML loadBytes httpGet httpPost httpDo Output createWriter save saveJSON saveStrings saveTable day hour minute millis month second year abs ceil constrain dist exp floor lerp log mag map max min norm pow round sq sqrt fract createVector noise noiseDetail noiseSeed randomSeed random randomGaussian acos asin atan atan2 cos sin tan degrees radians angleMode textAlign textLeading textSize textStyle textWidth textAscent textDescent loadFont text textFont orbitControl debugMode noDebugMode ambientLight specularColor directionalLight pointLight lights lightFalloff spotLight noLights loadShader createShader shader resetShader normalMaterial texture textureMode textureWrap ambientMaterial emissiveMaterial specularMaterial shininess camera perspective ortho frustum createCamera setCamera ADD CENTER CORNER CORNERS POINTS WEBGL RGB ARGB HSB LINES CLOSE BACKSPACE DELETE ENTER RETURN TAB ESCAPE SHIFT CONTROL OPTION ALT UP_ARROW DOWN_ARROW LEFT_ARROW RIGHT_ARROW sampleRate freqToMidi midiToFreq soundFormats getAudioContext userStartAudio loadSound createConvolver setBPM saveSound getMasterVolume masterVolume soundOut chain drywet biquadFilter process freq res gain toggle setType pan phase triggerAttack triggerRelease setADSR attack decay sustain release dispose notes polyvalue AudioVoice noteADSR noteAttack noteRelease isLoaded playMode set isPlaying isPaused setVolume getPan rate duration currentTime jump channels frames getPeaks reverseBuffer onended setPath setBuffer processPeaks addCue removeCue clearCues getBlob getLevel toggleNormalize waveform analyze getEnergy getCentroid linAverages logAverages getOctaveBands fade attackTime attackLevel decayTime decayLevel releaseTime releaseLevel setRange setExp width output stream mediaStream currentSource enabled amplitude getSources setSource bands panner positionX positionY positionZ orient orientX orientY orientZ setFalloff maxDist rollof leftDelay rightDelay delayTime feedback convolverNode impulses addImpulse resetImpulse toggleImpulse sequence getBPM addPhrase removePhrase getPhrase replaceSequence onStep musicalTimeMode maxIterations synced bpm timeSignature interval iterations compressor knee ratio threshold reduction record isDetected update onPeak WaveShaperNode getAmount getOversample amp setInput connect disconnect play pause stop start add mult
*/
