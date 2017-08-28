import GameObject from 'GameObject';

export default abstract class Character extends GameObject {
  private targets: any[] = [];

  constructor(public entity: any, position: any, attributes: {} = {}) {
    super();
    super.setAttributes({
      searchInterval: 0.1,
      range: 2,
      material: new pc.PhongMaterial()
    }, attributes);
    super.addTimedUpdate(this.searchForTargets, this.attributes.searchInterval);
    this.targets = [];
    this.entity = entity;
    this.entity.model.material = this.attributes.material;
    this.entity.setPosition(position);
    this.entity.enabled = true;

    this.entity.addComponent('rigidbody', {
      type: 'dynamic'
    });
  }

  public addTarget(target: any) {
    this.targets.push(target);
  }

  protected abstract handleTargets(dt: number, targetsInRange: any[], targetsOutOfRange: any[]): void;

  private searchForTargets(dt: number) {
    const targetsInRange: any[] = [];
    const targetsOutOfRange: any[] = [];
    this.targets.forEach((target) => {
      (this.isInRange(this.entity, target) ? targetsInRange : targetsOutOfRange).push(target);
    });
    this.handleTargets(dt, targetsInRange, targetsOutOfRange);
  }

  private isInRange(entity: any, target: any) {
    const distance = target.getPosition().clone().sub(entity.getPosition()).length();

    return distance <= this.attributes.range;
  }
}
