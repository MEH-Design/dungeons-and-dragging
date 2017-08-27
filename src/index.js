import GameObject from 'gameobject';
import OrbitCamera from 'environment/orbitCamera.ts';
import { Stage } from 'environment/stages';
import Player from 'characters/player/player';

const canvas = document.getElementById('canvas');
const app = new pc.Application(canvas, { });
app.start();

// fill the available space at full resolution
app.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW);
app.setCanvasResolution(pc.RESOLUTION_AUTO);


// ensure canvas is resized when window changes size
window.addEventListener('resize', () => {
  app.resizeCanvas();
});

// create camera entity
const camera = new pc.Entity('camera');
camera.addComponent('camera', {
  clearColor: new pc.Color(1, 1, 1),
});

// create directional light entity
const light = new pc.Entity('light');
light.addComponent('light', {
  color: new pc.Color(1, 1, 1),
});

// add to hierarchy
app.root.addChild(camera);
app.root.addChild(light);

// set up initial positions and orientations
camera.setPosition(0, 20, 30);
camera.setEulerAngles(-30, 0, 0);
const orbitCamera = new OrbitCamera(camera);

light.setEulerAngles(45, 0, 0);

const stageEntity = new pc.Entity();
const playerEntity = new pc.Entity();

app.root.addChild(stageEntity);
app.root.addChild(playerEntity);

new Stage(stageEntity, orbitCamera);
new Player(playerEntity, new pc.Vec3(0, 20, 0));

app.on('update', (dt) => {
  GameObject.objects.forEach(obj => obj.update(dt));
});
//
// app.assets.loadFromUrl('/assets/clouds.jpg', 'texture', (err, asset) => {
//   const material = new pc.PhongMaterial();
//   material.diffuseMap = asset.resource;
//   material.update();
//   box.model.model.meshInstances[0].material = material;
// });
