import app from 'app';
import GameObject from 'GameObject';

export default abstract class Character extends GameObject {
  public entity: pc.Entity;
  public targets: pc.Entity[] = [];
  public health: number;

  constructor(position: pc.Vec3, attributes: {} = {}) {
    super();
    super.setAttributes({
      searchInterval: 0.1,
      range: 2,
      material: 'assets/materials/player.json'
    }, attributes);
    super.addTimedUpdate(this.searchForTargets, this.attributes.searchInterval);
    this.targets = [];

    this.entity = new pc.Entity();
    this.entity.setPosition(position);
    this.entity.addComponent('model', {
      type: 'box'
    });
    this.entity.addComponent('collision', {
      type: 'box'
    });
    //has to be done last because it interferes with .setPosition.
    this.entity.addComponent('rigidbody', {
      type: 'dynamic'
    });
    this.entity.name = 'Character';

    this.entity.enabled = true;
    app.root.addChild(this.entity);
    app.getAsset(this.attributes.material, 'material').then((asset) => {
      this.entity.model.material = asset.resource;
    });
  }

  public flashRed(strength: number) {
      (<any>this.entity.model.material).emissiveUniform = new Float32Array([1, 0, 0]);
      this.entity.model.material.update();
      console.log(this.entity.model.material);
  }

  public addTarget(target: pc.Entity) {
    this.targets.push(target);
  }

  protected abstract handleTargets(dt: number, targetsInRange: pc.Entity[], targetsOutOfRange: pc.Entity[]): void;

  private searchForTargets(dt: number) {
    const targetsInRange: pc.Entity[] = [];
    const targetsOutOfRange: pc.Entity[] = [];
    this.targets.forEach((target) => {
      (this.isInRange(this.entity, target) ? targetsInRange : targetsOutOfRange).push(target);
    });
    if (this.targets) {
      this.handleTargets(dt, targetsInRange, targetsOutOfRange);
    }
  }

  private isInRange(entity: pc.Entity, target: pc.Entity) {
    const distance = target.getPosition().clone().sub(entity.getPosition()).length();

    return distance <= this.attributes.range;
  }
}
