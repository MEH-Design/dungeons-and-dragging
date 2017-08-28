interface ITimedUpdate {
  interval: number;
  counter: number;
  callback(dt: number): void;
}

export default class GameObject {
  public static objects: GameObject[] = [];

  private static knownAssets: { [tag: string] : {} } = {};
  private static mouse: any;
  private timedUpdates: ITimedUpdate[] = [];

  public attributes: any = {};

  constructor() {
    GameObject.addObject(this);
  }

  public static addObject (obj: GameObject): void {
    this.objects.push(obj);
  }

  public static getEntity (...names: string[]): any {
    return GameObject.getResource(GameObject.getApp().root, 'findByName', names);
  }

  public static getMouse (): any {
    if (!GameObject.mouse) {
      GameObject.mouse = new pc.Mouse(GameObject.getApp().root);
      GameObject.mouse.attach(document.getElementById('canvas'));
    }

    return this.mouse;
  }

  public static getAsset (path: string, assetType: string): Promise<any> {
    if (this.knownAssets[path]) {
      return new Promise((resolve: (asset: any) => void): void => {
        resolve(this.knownAssets[path]);
      });
    }

    return new Promise((resolve: (asset: any) => void, reject: (err: Error) => void): void => {
      GameObject.getApp().assets.loadFromUrl(path, assetType, (err: Error, asset: {}) => {
        GameObject.knownAssets[path] = asset;

        if (err) {
          reject(err);
        }
        resolve(asset);
      });
    });
  }

  public static requireOverride (): void {
    const error: Error = new Error();
    const functionName: any = ((error.stack).split('at ')[2]).trim().split(' ')[0];
    error.message = `${functionName} needs to be overriden`;
    throw error;
  }

  public static getResource (root: any, functionName: string, names: string[]): any {
    let resource: {};
    names.forEach((name: string) => {
      resource = (resource || root)[functionName](name);
    });

    return resource;
  }

  public static getApp(): any {
    return pc.Application.getApplication();
  }

  public setAttributes (...attributes: any[]): void {
    attributes.forEach((<any>Object).assign.bind(this, this.attributes));
  }

  public addTimedUpdate (callback: (dt: number) => void, interval: number = 0.2): void {
    this.timedUpdates.push(<ITimedUpdate>{
      callback: callback.bind(this),
      interval,
      counter: 0
    });
  }
  public update (dt: number): void {
    this.timedUpdates.forEach((tu: ITimedUpdate) => {
      tu.counter += dt;
      if (tu.counter >= tu.interval) {
        tu.callback(tu.counter);
        tu.counter = 0;
      }
    });
  }
}
