import GameObject from 'GameObject';

export default abstract class Character extends GameObject {
  public entity: pc.Entity;
  private targets: pc.Entity[] = [];

  constructor(public parent: pc.Entity, position: pc.Vec3, attributes: {} = {}) {
    super();
    super.setAttributes({
      searchInterval: 0.1,
      range: 2,
      material: new pc.PhongMaterial()
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

    this.entity.model.material = this.attributes.material;
    this.entity.enabled = true;

    parent.addChild(this.entity);
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
    this.handleTargets(dt, targetsInRange, targetsOutOfRange);
  }

  private isInRange(entity: pc.Entity, target: pc.Entity) {
    const distance = target.getPosition().clone().sub(entity.getPosition()).length();

    return distance <= this.attributes.range;
  }
}
