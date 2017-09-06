import BaseEnemy from 'characters/enemies/BaseEnemy';
import Player from 'characters/player/Player';
import Projectile from 'environment/Projectile';

export default class RangedEnemy extends BaseEnemy {
  constructor(position: pc.Vec3, attributes: {} = {}) {
    super(position, 20, {
      speed: 100,
      attackSpeed: 0.2,
      damage: 15
    });
  }

  public attack(target: pc.Entity) {
    const projectile = new Projectile(this.entity.getPosition().clone(), target.getPosition().clone(), this.onHit);
  }

  public handleClosest(diffToClosest: pc.Vec3, dt: number) {
    this.entity.rigidbody.applyForce(diffToClosest.normalize().scale(-dt * this.attributes.speed));
  }

  private onHit(projectile: Projectile, contactResult: pc.ContactResult) {
    projectile.destroy();
    const player: Player = Player.getByEntity(contactResult.other);
    if (player) {
      // player.inflictDamage(this.attributes.damage);
    }
  }
}
