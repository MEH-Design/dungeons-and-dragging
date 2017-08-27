import GameObject from 'gameobject';
import OrbitCamera from 'environment/orbitCamera';
import { Stage } from 'environment/stages';
import Player from 'characters/player/player';

class App extends (pc.Application as { new(...args: any[]): any; }) {
  camera: OrbitCamera = new OrbitCamera();
  lights: any[] = [];

  constructor(...args: any[]) {
    super(...args);
    super.start();

    super.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW);
    super.setCanvasResolution(pc.RESOLUTION_AUTO);

    window.addEventListener('resize', () => {
      super.resizeCanvas();
    });

    this.lights.push(
      this.createLight(new pc.Color(1, 1, 1), new pc.Vec3(45, 0, 0))
    );
    this.camera = new OrbitCamera();
  }

  private createLight(color: any, angle: any) {
    const light = new pc.Entity('light');
    light.addComponent('light', {
      color: new pc.Color(1, 1, 1),
    });
    this.root.addChild(light);
    light.setEulerAngles(45, 0, 0);
  }

  start() {
    const stageEntity = new pc.Entity();
    const playerEntity = new pc.Entity();

    this.root.addChild(stageEntity);
    this.root.addChild(playerEntity);

    new Stage(stageEntity, this.camera);
    new Player(playerEntity, new pc.Vec3(0, 20, 0));
  }

  onUpdate(callback: (dt: number) => void) {
    this.on('update', callback);
  }
}

const app = new App(document.getElementById('canvas'), {});
app.onUpdate((dt: number) => {
  GameObject.objects.forEach((obj: GameObject) => obj.update(dt));
});

export default app;
