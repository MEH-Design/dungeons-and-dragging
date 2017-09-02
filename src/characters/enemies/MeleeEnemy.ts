import BaseEnemy from 'characters/enemies/BaseEnemy';

export default class MeleeEnemy extends BaseEnemy {
    constructor(position: pc.Vec3, attributes: {} = {}) {
        super(position);
        super.setAttributes(attributes);
    }
    public attack() {
      return;
    }
}
