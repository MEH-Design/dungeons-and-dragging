import Player from 'characters/player/Player';
import OrbitCamera from 'environment/OrbitCamera';
import { Stage } from 'environment/stages';
import GameObject from 'GameObject';

interface IPositionMouse extends pc.Mouse {
 x?: number;
 y?: number;
}

// tslint:disable-next-line
class App extends pc.Application {
  public camera: OrbitCamera;
  public lights: pc.Entity[] = [];
  public mouse: IPositionMouse;

  private knownAssets: { [tag: string] : pc.Asset } = {};

  constructor(canvas: Element, options: pc.ApplicationOptions) {
    super(canvas, options);
    super.start();

    super.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW);
    super.setCanvasResolution(pc.RESOLUTION_AUTO);

    window.addEventListener('resize', () => {
      super.resizeCanvas();
    });

    this.mouse = new pc.Mouse(canvas);
    this.mouse.on(pc.EVENT_MOUSEMOVE, (event: pc.MouseEvent) => {
      this.mouse.x = event.x;
      this.mouse.y = event.y;
    }, this);
  }

  public getEntity(...names: string[]): pc.Entity {
    return this.getResource(this.root, 'findByName', names);
  }

  public getAsset(path: string, assetType: string): Promise<pc.Asset> {
    if (this.knownAssets[path]) {
      return new Promise((resolve: (asset: pc.Asset) => void): void => {
        resolve(this.knownAssets[path]);
      });
    }

    return new Promise((resolve: (asset: pc.Asset) => void, reject: (err: Error) => void) => {
      this.assets.loadFromUrl(path, assetType, (err: Error, asset: pc.Asset) => {
        this.knownAssets[path] = asset;
        if (err) {
          reject(err);
        }
        resolve(asset);
      });
    });
  }

  public getResource(root: any, functionName: string, names: string[]): any {
    let resource: {};
    names.forEach((name: string) => {
      resource = (resource || root)[functionName](name);
    });

    return resource;
  }

  public start(): void {
    this.lights.push(
      this.createLight(new pc.Color(1, 1, 1), new pc.Vec3(45, 0, 0))
    );
    this.camera = new OrbitCamera((new pc.Color()).fromString('#0A1117'), new pc.Vec3(0, 20, 30), new pc.Vec3(-30, 0, 0));

    const stageEntity: pc.Entity = new pc.Entity();
    const playerEntity: pc.Entity = new pc.Entity();

    this.root.addChild(stageEntity);
    this.root.addChild(playerEntity);

    const player = new Player(playerEntity, new pc.Vec3(0, 20, 0));
    const stage = new Stage(stageEntity, this.camera);
  }

  public onUpdate(callback: (dt: number) => void): void {
    this.on('update', callback);
  }

  private createLight(color: pc.Color, angle: pc.Vec3): pc.Entity {
    const light: pc.Entity = new pc.Entity();
    light.addComponent('light', {
      color: new pc.Color(1, 1, 1)
    });
    this.root.addChild(light);
    light.setEulerAngles(45, 0, 0);

    return light;
  }
}

const appOptions: pc.ApplicationOptions = {
  keyboard: new pc.Keyboard(window)
};
const app: App = new App(document.getElementById('canvas'), appOptions);
app.onUpdate((dt: number) => {
  GameObject.objects.forEach((obj: GameObject) => obj.update(dt));
});
export default app;
