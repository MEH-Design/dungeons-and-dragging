interface ITimedUpdate {
  interval: number;
  counter: number;
  callback(dt: number): void;
  source(dt: number): void;
}

export default class GameObject {
  public static objects: GameObject[] = [];
  private static mouse: pc.Mouse;

  public attributes: any = {};
  private timedUpdates: ITimedUpdate[] = [];

  constructor() {
    GameObject.addObject(this);
  }

  public static addObject (obj: GameObject): void {
    this.objects.push(obj);
  }

  public setAttributes (...attributes: any[]): void {
    attributes.forEach(Object.assign.bind(this, this.attributes));
  }

  public clearInstance () {
    this.timedUpdates = [];
    GameObject.objects = GameObject.objects.filter((obj) => obj !== this);
  }

  public addTimedUpdate (callback: (dt: number) => void, interval: number = 0.2): void {
    this.timedUpdates.push(<ITimedUpdate>{
      callback: callback.bind(this),
      interval,
      counter: 0,
      source: callback
    });
  }

  public removeTimedUpdate(toRemove: (dt: number) => void) {
    this.timedUpdates = this.timedUpdates.filter((timedUpdate) => timedUpdate.source !== toRemove);
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
