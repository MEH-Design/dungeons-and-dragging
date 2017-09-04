import BaseEnemy from 'characters/enemies/BaseEnemy';
import Player from 'characters/player/Player';

export default class MeleeEnemy extends BaseEnemy {
    constructor(position: pc.Vec3, attributes: {} = {}) {
        super(position);
        super.setAttributes({
          damage: 10
        }, attributes);
        this.entity.collision.on('collisionstart', this.onTriggerEnter, this);
    }
    public attack(target: pc.Entity) {
      this.animateAttack(target);
    }
    private animateAttack(target: pc.Entity) {
      const diff = this.entity.getPosition().sub(target.getPosition()).normalize().scale(-700);
      this.entity.rigidbody.applyForce(diff);
    }
    private onTriggerEnter(contactResult: pc.ContactResult) {
      const player: Player = Player.getByEntity(contactResult.other);
      if (player) {
        player.inflictDamage(this.attributes.damage);
      }
    }
}
