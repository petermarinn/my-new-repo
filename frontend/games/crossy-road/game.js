const counterDOM = document.getElementById('counter');
const finalScoreDOM = document.getElementById('final-score');
const gameOverDOM = document.getElementById('game-over');
const retryBtn = document.getElementById('retry');

const scene = new THREE.Scene();

const camera = new THREE.OrthographicCamera( window.innerWidth / -2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / -2, 0.1, 10000 );

camera.rotation.x = 50 * Math.PI / 180;
camera.rotation.y = 20 * Math.PI / 180;
camera.rotation.z = 10 * Math.PI / 180;

const initialCameraPosition = new THREE.Vector3( -300, -350, 400 );
camera.position.copy(initialCameraPosition);

const chickenSize = 15;

const positionWidth = 42;
const columns = 17;
const boardWidth = positionWidth * columns;

let lanes;
let currentLane;
let currentColumn;

let previousTimestamp;
let gameOver;

const laneTypes = ['car', 'car', 'forest', 'forest', 'forest'];
const laneSpeeds = [2, 2.5, 3];
const vehicleColors = [0xa52523, 0xbdb638, 0x78b14b];
const treeHeights = [20, 25, 30, 40];

const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
scene.add(hemiLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
dirLight.position.set(-100, -100, 200);
dirLight.castShadow = true;
scene.add(dirLight);

const backLight = new THREE.DirectionalLight(0xffffff, .4);
backLight.position.set(200, 200, 50);
backLight.castShadow = true;
scene.add(backLight);

const renderer = new THREE.WebGLRenderer({
  alpha: true,
  antialias: true
});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const WheelGeometry = new THREE.BoxBufferGeometry(12, 33, 12);
const WheelMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });

function Car() {
  const car = new THREE.Group();
  car.userData.type = 'car';
  const color = vehicleColors[Math.floor(Math.random() * vehicleColors.length)];

  const main = new THREE.Mesh(
    new THREE.BoxBufferGeometry(60, 30, 15),
    new THREE.MeshLambertMaterial({ color })
  );
  main.position.z = 12;
  main.castShadow = true;
  main.receiveShadow = true;
  car.add(main);

  const cabin = new THREE.Mesh(
    new THREE.BoxBufferGeometry(33, 24, 12),
    new THREE.MeshLambertMaterial({ color: 0xffffff })
  );
  cabin.position.x = 6;
  cabin.position.z = 25.5;
  cabin.castShadow = true;
  cabin.receiveShadow = true;
  car.add(cabin);

  const frontWheel = new THREE.Mesh( WheelGeometry, WheelMaterial );
  frontWheel.position.x = -18;
  frontWheel.position.z = 6;
  car.add(frontWheel);

  const backWheel = new THREE.Mesh( WheelGeometry, WheelMaterial );
  backWheel.position.x = 18;
  backWheel.position.z = 6;
  car.add(backWheel);

  return car;
}

function Truck() {
  const truck = new THREE.Group();
  truck.userData.type = 'truck';
  const color = vehicleColors[Math.floor(Math.random() * vehicleColors.length)];

  const base = new THREE.Mesh(
    new THREE.BoxBufferGeometry(100, 25, 5),
    new THREE.MeshLambertMaterial({ color: 0xb4c6fc })
  );
  base.position.z = 10;
  truck.add(base);

  const cargo = new THREE.Mesh(
    new THREE.BoxBufferGeometry(75, 35, 40),
    new THREE.MeshLambertMaterial({ color: 0xffffff })
  );
  cargo.position.x = 15;
  cargo.position.z = 30;
  cargo.castShadow = true;
  cargo.receiveShadow = true;
  truck.add(cargo);

  const cabin = new THREE.Mesh(
    new THREE.BoxBufferGeometry(25, 30, 30),
    new THREE.MeshLambertMaterial({ color })
  );
  cabin.position.x = -34;
  cabin.position.z = 20;
  cabin.castShadow = true;
  cabin.receiveShadow = true;
  truck.add(cabin);

  const frontWheel = new THREE.Mesh( WheelGeometry, WheelMaterial );
  frontWheel.position.x = -38;
  frontWheel.position.z = 6;
  truck.add(frontWheel);

  const middleWheel = new THREE.Mesh( WheelGeometry, WheelMaterial );
  middleWheel.position.x = -10;
  middleWheel.position.z = 6;
  truck.add(middleWheel);

  const backWheel = new THREE.Mesh( WheelGeometry, WheelMaterial );
  backWheel.position.x = 30;
  backWheel.position.z = 6;
  truck.add(backWheel);

  return truck;
}

function Tree() {
  const tree = new THREE.Group();

  const trunk = new THREE.Mesh(
    new THREE.BoxBufferGeometry(15, 15, 20),
    new THREE.MeshLambertMaterial({ color: 0x4d2926 })
  );
  trunk.position.z = 10;
  trunk.castShadow = true;
  trunk.receiveShadow = true;
  tree.add(trunk);

  const height = treeHeights[Math.floor(Math.random()*treeHeights.length)];

  const crown = new THREE.Mesh(
    new THREE.BoxBufferGeometry(30, 30, height),
    new THREE.MeshLambertMaterial({ color: 0x7aa21d })
  );
  crown.position.z = height/2 + 20;
  crown.castShadow = true;
  crown.receiveShadow = false;
  tree.add(crown);

  return tree;
}

function Chicken() {
  const chicken = new THREE.Group();

  const body = new THREE.Mesh(
    new THREE.BoxBufferGeometry(chickenSize, chickenSize, 20),
    new THREE.MeshLambertMaterial({ color: 0xffffff })
  );
  body.position.z = 10;
  body.castShadow = true;
  body.receiveShadow = true;
  chicken.add(body);

  const comb = new THREE.Mesh(
    new THREE.BoxBufferGeometry(2, 4, 2),
    new THREE.MeshLambertMaterial({ color: 0xf0619a })
  );
  comb.position.z = 21;
  chicken.add(comb);

  return chicken;
}

const chicken = new Chicken();
scene.add(chicken);

function Lane(index) {
  this.index = index;
  this.type = index <= 0 ? 'field' : laneTypes[Math.floor(Math.random()*laneTypes.length)];

  switch(this.type) {
    case 'field': {
      this.mesh = new THREE.Mesh(
        new THREE.BoxBufferGeometry(boardWidth, positionWidth, 4),
        new THREE.MeshLambertMaterial({ color: 0x67c240 })
      );
      break;
    }
    case 'forest': {
      this.mesh = new THREE.Mesh(
        new THREE.BoxBufferGeometry(boardWidth, positionWidth, 4),
        new THREE.MeshLambertMaterial({ color: 0x67c240 })
      );

      this.occupiedPositions = new Set();
      this.trees = [1,2,3,4].map(() => {
        const tree = new Tree();
        let column;
        do {
          column = Math.floor(Math.random()*columns);
        } while(this.occupiedPositions.has(column))
        this.occupiedPositions.add(column);
        tree.position.x = (column * positionWidth) - boardWidth/2 + positionWidth/2;
        this.mesh.add(tree);
        return tree;
      });
      break;
    }
    case 'car': {
      this.mesh = new THREE.Mesh(
        new THREE.BoxBufferGeometry(boardWidth, positionWidth, 4),
        new THREE.MeshLambertMaterial({ color: 0x454a59 })
      );
      this.direction = Math.random() >= 0.5;

      const occupiedColumn = new Set();
      this.vehicles = [1, 2, 3].map(() => {
        const vehicle = Math.random() >= 0.4 ? new Car() : new Truck();
        let column;
        do {
          column = Math.floor(Math.random()*columns);
        } while(occupiedColumn.has(column))
        occupiedColumn.add(column);
        vehicle.position.x = (column * positionWidth) - boardWidth/2 + positionWidth/2;
        vehicle.rotation.z = this.direction ? 0 : Math.PI;
        this.mesh.add(vehicle);
        return vehicle;
      });

      this.speed = laneSpeeds[Math.floor(Math.random()*laneSpeeds.length)];
      break;
    }
  }

  this.mesh.position.y = index * positionWidth;
  this.mesh.receiveShadow = true;
  scene.add(this.mesh);
}

const addLane = () => {
  const index = lanes.length;
  const lane = new Lane(index);
  lanes.push(lane);
}

const initializeValues = () => {
  lanes = [];

  [...Array(20)].forEach(() => addLane());

  currentLane = 0;
  currentColumn = Math.floor(columns/2);

  previousTimestamp = null;
  gameOver = false;

  counterDOM.innerHTML = 0;
  gameOverDOM.classList.remove('active');

  chicken.position.x = (currentColumn * positionWidth) - boardWidth/2 + positionWidth/2;
  chicken.position.y = 0;
  chicken.position.z = 0;

  camera.position.copy(initialCameraPosition);
  dirLight.position.set(-100, -100, 200);
}

initializeValues();

const move = (direction) => {
  if(gameOver) return;

  const finalLane = direction === 'forward' ? currentLane + 1 : direction === 'backward' ? currentLane - 1 : currentLane;
  const finalColumn = direction === 'left' ? currentColumn - 1 : direction === 'right' ? currentColumn + 1 : currentColumn;

  if (finalColumn < 0 || finalColumn >= columns) return;
  if (finalLane < 0) return;

  const finalLaneData = lanes[finalLane];
  if(finalLaneData.type === 'forest' && finalLaneData.occupiedPositions.has(finalColumn)) return;

  currentLane = finalLane;
  currentColumn = finalColumn;

  counterDOM.innerHTML = currentLane;

  chicken.position.x = (currentColumn * positionWidth) - boardWidth/2 + positionWidth/2;
  chicken.position.y = currentLane * positionWidth;

  if (currentLane > lanes.length - 12) addLane();
}

window.addEventListener('keydown', event => {
  if (event.keyCode === 38) move('forward');
  else if (event.keyCode === 40) move('backward');
  else if (event.keyCode === 37) move('left');
  else if (event.keyCode === 39) move('right');
});

retryBtn.addEventListener('click', () => {
  lanes.forEach(lane => scene.remove(lane.mesh));
  initializeValues();
});

function animate(timestamp) {
  requestAnimationFrame(animate);

  if (!previousTimestamp) previousTimestamp = timestamp;
  const delta = timestamp - previousTimestamp;
  previousTimestamp = timestamp;

  if(gameOver) {
    renderer.render(scene, camera);
    return;
  }

  // Move vehicles
  lanes.forEach(lane => {
    if (lane.type === 'car') {
      lane.vehicles.forEach(vehicle => {
        if (lane.direction) {
          vehicle.position.x = vehicle.position.x > boardWidth/2 + positionWidth ? -boardWidth/2 - positionWidth : vehicle.position.x + lane.speed * delta / 16;
        } else {
          vehicle.position.x = vehicle.position.x < -boardWidth/2 - positionWidth ? boardWidth/2 + positionWidth : vehicle.position.x - lane.speed * delta / 16;
        }

        // Hit test
        const chickenMinX = chicken.position.x - chickenSize/2;
        const chickenMaxX = chicken.position.x + chickenSize/2;
        const vehicleWidth = vehicle.userData.type === 'car' ? 30 : 50;
        const vehicleMinX = vehicle.position.x - vehicleWidth;
        const vehicleMaxX = vehicle.position.x + vehicleWidth;

        if (lane.index === currentLane && chickenMaxX > vehicleMinX && chickenMinX < vehicleMaxX) {
          gameOver = true;
          finalScoreDOM.innerHTML = currentLane;
          gameOverDOM.classList.add('active');
        }
      });
    }
  });

  // Camera follow
  camera.position.y = initialCameraPosition.y + currentLane * positionWidth;
  dirLight.position.y = -100 + currentLane * positionWidth;

  renderer.render(scene, camera);
}

requestAnimationFrame(animate);

window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize(){
    camera.left = window.innerWidth / -2;
    camera.right = window.innerWidth / 2;
    camera.top = window.innerHeight / 2;
    camera.bottom = window.innerHeight / -2;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}
