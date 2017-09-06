import app from 'app';
import GameObject from 'GameObject';

type IOnBulletHit = (projectile: Projectile, contactResult: pc.ContactResult) => void;

export default class Projectile extends GameObject {
  private entity: pc.Entity = new pc.Entity();
  private counter: number = 0;
  private diff: pc.Vec3;
  private willBeDestroyed: boolean = false;

  constructor(private start: pc.Vec3, private target: pc.Vec3, onHit: IOnBulletHit, attributes: {} = {}) {
    super();
    super.setAttributes({
      speed: 1,
      size: 0.5,
      shrinkSpeed: 1,
      material: 'assets/materials/projectile.json'
    }, attributes);
    this.entity.setPosition(start);
    this.entity.addComponent('model', {
      type: 'box'

    });
    this.entity.addComponent('collision', {
      type: 'box'
    });
    this.entity.addComponent('rigidbody', {
      type: 'dynamic',
      group: pc.BODYGROUP_USER_2,
      mask: ~pc.BODYGROUP_USER_1
    });
    this.entity.setLocalScale(this.attributes.size, this.attributes.size, this.attributes.size);
    this.entity.rigidbody.applyTorqueImpulse(1, 1, 1);
    app.getAsset(this.attributes.material, 'material').then((asset) => {
      this.entity.model.material = asset.resource;
    });

    // neccessary to prevent detecting the shooter as a collision
    setTimeout(() => {
      this.entity.collision.on('collisionstart', (contactResult: pc.ContactResult) => {
        if (!this.willBeDestroyed) {
          super.removeTimedUpdate(this.moveTowardsTarget);
          onHit(this, contactResult);
        }
      }, this);
    }, 300);

    this.diff = this.start.clone().sub(this.target);
    app.root.addChild(this.entity);

    super.addTimedUpdate(this.moveTowardsTarget, 0);
  }
  public destroy() {
    if (this.willBeDestroyed) {
      return;
    }
    this.willBeDestroyed = true;

    let size = 1;
    const shrinkEntity = (dt: number) => {
      size = Math.max(size - dt * this.attributes.shrinkSpeed, 0);
      const relativeSize = easeIn(size) * this.attributes.size;
      this.entity.setLocalScale(relativeSize, relativeSize, relativeSize);
      if (size === 0) {
        this.entity.destroy();
        super.clearInstance();
      }
    };

    setTimeout(() => {
      super.addTimedUpdate(shrinkEntity, 0);
    }, 1000);
    // this.entity.destroy();
  }
  private getPoint(n: number): pc.Vec3 {
    // the function can be anything that has it's zero points at 1 (to hit the target) and 0 (to originate in the caster).
    const height = -((n * 2 - 1) ** 2) + 1; // see https://www.wolframalpha.com/input/?i=-((x*2-1)**2)%2B1
    const distanceFromStart = this.diff.clone().scale(-n);
    distanceFromStart.y += height * 10;

    return this.start.clone().add(distanceFromStart);
  }
  private moveTowardsTarget(dt: number) {
    this.counter = this.counter + dt * this.attributes.speed;
    const current = this.counter;

    this.entity.rigidbody.linearVelocity = pc.Vec3.ZERO;
    this.entity.rigidbody.teleport(this.getPoint(current));
  }
}

function easeInOut(t: number) {
  t /= 1 / 2;
  if (t < 1) {
    return 1 / 2 * t ** 2;
  }
  t -= 1;

  return -1 / 2 * (t * (t - 2) - 1);
}

function easeIn(t: number) {
  return t ** 3;
}
