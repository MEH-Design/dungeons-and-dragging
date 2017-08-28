import Player from 'characters/player/Player';
import OrbitCamera from 'environment/OrbitCamera';
import { Stage } from 'environment/stages';
import GameObject from 'GameObject';

// tslint:disable-next-line
class App extends (pc.Application as { new(...args: any[]): any; }) {
  public camera: OrbitCamera;
  public lights: any[] = [];

  constructor(...args: any[]) {
    super(...args);
    super.start();

    super.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW);
    super.setCanvasResolution(pc.RESOLUTION_AUTO);

    window.addEventListener('resize', () => {
      super.resizeCanvas();
    });
  }

  public start (): void {
    this.lights.push(
      this.createLight(new pc.Color(1, 1, 1), new pc.Vec3(45, 0, 0))
    );
    this.camera = new OrbitCamera(new pc.Color(1, 1, 1), new pc.Vec3(0, 20, 30), new pc.Vec3(-30, 0, 0));

    const stageEntity: any = new pc.Entity();
    const playerEntity: any = new pc.Entity();

    this.root.addChild(stageEntity);
    this.root.addChild(playerEntity);

    this.stage = new Stage(stageEntity, this.camera);
    this.player = new Player(playerEntity, new pc.Vec3(0, 20, 0));
  }

  public onUpdate (callback: (dt: number) => void): void {
    this.on('update', callback);
  }

  private createLight (color: any, angle: any): void {
    const light: any = new pc.Entity('light');
    light.addComponent('light', {
      color: new pc.Color(1, 1, 1)
    });
    this.root.addChild(light);
    light.setEulerAngles(45, 0, 0);
  }
}

const app: App = new App(document.getElementById('canvas'), {});
app.onUpdate((dt: number) => {
  GameObject.objects.forEach((obj: GameObject) => obj.update(dt));
});
export default app;
