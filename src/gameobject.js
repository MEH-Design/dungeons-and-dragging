export default class GameObject {
  static _addObject(obj) {
    this.objects = this.objects || [];
    this.objects.push(obj);
  }

  static getEntity(...names) {
    return GameObject._getResource(GameObject.getApp().root, 'findByName', names);
  }

  static getAsset(path, type) {
    this.knownAssets = this.knownAssets || {};

    if (this.knownAssets[path]) {
      return new Promise((resolve) => {
        resolve(this.knownAssets[path]);
      });
    }

    return new Promise((resolve, reject) => {
      GameObject.getApp().assets.loadFromUrl(path, type, (err, asset) => {
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
  static _getResource(root, functionName, names) {
    let resource;
    names.forEach((name) => {
      resource = (resource || root)[functionName](name);
    });
    return resource;
  }
  static getApp() {
    return pc.Application.getApplication();
  }
  constructor() {
    GameObject._addObject(this);

    this.attributes = {};
    this._timedUpdates = [];
  }
  setAttributes(...attributes) {
    attributes.forEach(Object.assign.bind(this, this.attributes));
  }
  addTimedUpdate(callback, interval = 0.2) {
    this._timedUpdates.push({
      callback: callback.bind(this),
      interval,
      counter: 0
    });
  }
  update(dt) {
    this._timedUpdates.forEach((tu) => {
      tu.counter += dt;
      if (tu.counter >= tu.interval) {
        tu.callback(tu.counter);
        tu.counter = 0;
      }
    });
  }
}
