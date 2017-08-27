interface TimedUpdate {
  callback: (dt: number) => void,
  interval: number,
  counter: number,
};

export default class GameObject {
  public static objects: GameObject[] = [];
  private static knownAssets: { [tag: string] : any } = {};
  private static mouse: any;

  private attributes: Object = {};
  private timedUpdates: TimedUpdate[] = [];

  constructor() {
    GameObject._addObject(this);
  }
  setAttributes(...attributes: string[]) {
    attributes.forEach((<any>Object).assign.bind(this, this.attributes));
  }

  static _addObject(obj: GameObject): void {
    this.objects.push(obj);
  }

  static getEntity(...names: string[]) {
    return GameObject._getResource(GameObject.getApp().root, 'findByName', names);
  }

  static getMouse() {
    if(!this.mouse) {
      this.mouse = new pc.Mouse(GameObject.getApp().root);
      this.mouse.attach(document.getElementById('canvas'));
    }
    return this.mouse;
  }

  static getAsset(path: string, type: string) {
    if (this.knownAssets[path]) {
      return new Promise((resolve) => {
        resolve(this.knownAssets[path]);
      });
    }

    return new Promise((resolve, reject) => {
      GameObject.getApp().assets.loadFromUrl(path, type, (err: any, asset: any) => {
        GameObject.knownAssets[path] = asset;

        if (err) reject(err);
        resolve(asset);
      });
    });
  }
  static requireOverride() {
    const error = new Error();
    const functionName = ((error.stack).split('at ')[2]).trim().split(' ')[0];
    error.message = `${functionName} needs to be overriden`;
    throw error;
  }
  static _getResource(root:any, functionName:string, names:string[]) {
    let resource: any;
    names.forEach((name) => {
      resource = (resource || root)[functionName](name);
    });
    return resource;
  }
  static getApp() {
    return pc.Application.getApplication();
  }
  addTimedUpdate(callback: (dt: number) => void, interval = 0.2) {
    this.timedUpdates.push(<TimedUpdate>{
      callback: callback.bind(this),
      interval,
      counter: 0,
    });
  }
  update(dt: number) {
    this.timedUpdates.forEach((tu: TimedUpdate) => {
      tu.counter += dt;
      if (tu.counter >= tu.interval) {
        tu.callback(tu.counter);
        tu.counter = 0;
      }
    });
  }
}
