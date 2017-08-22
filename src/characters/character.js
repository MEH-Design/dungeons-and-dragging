import GameObject from 'gameobject';

export default class Character extends GameObject {
  constructor(entity, position, attributes = {}) {
    super();
    super.setAttributes({
      searchInterval: 0.1,
      range: 2,
      material: new pc.PhongMaterial(),
    }, attributes);
    super.addTimedUpdate(this._searchForTargets, this.attributes.searchInterval);
    this.targets = [];
    this.entity = entity;
    this.entity.model.material = this.attributes.material;
    this.entity.setPosition(position);
    this.entity.enabled = true;
    
    this.entity.addComponent('rigidbody', {
      type: 'dynamic',
    });
    
    
  }
  addTarget(target) {
    this.targets.push(target);
  }
  _searchForTargets(dt) {
    const targetsInRange = [];
    const targetsOutOfRange = [];
    this.targets.forEach((target) => {
      (this._isInRange(this.entity, target) ? targetsInRange : targetsOutOfRange).push(target);
    });
    this.handleTargets(dt, targetsInRange, targetsOutOfRange);
  }
  _isInRange(entity, target) {
    const distance = target.getPosition().clone().sub(entity.getPosition()).length();
    return distance <= this.attributes.range;
  }
  handleTargets(dt, targetsInRange, targetsOutOfRange) {
    GameObject.requireOverride();
  }
}
