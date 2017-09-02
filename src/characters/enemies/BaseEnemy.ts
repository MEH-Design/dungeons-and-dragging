import app from 'app';
import Character from 'characters/Character';
import Player from 'characters/player/Player';

export default abstract class BaseEnemy extends Character {
    constructor(position: pc.Vec3, attributes: {} = {}) {
        super(position, {
          material: 'assets/materials/enemyred.json'
        });
        super.setAttributes({
          speed: 500
        }, attributes);
        Player.players.forEach((player: Player) => {
          super.addTarget(player.entity);
        });
    }

    public handleTargets(dt: number, targetsInRange: pc.Entity[], targetsOutOfRange: pc.Entity[]) {
        if (targetsInRange.length > 0) {
            this.attack(targetsInRange[0]);
        } else {
            this.moveToClosest(dt * this.attributes.speed);
        }
    }

    public abstract attack(entity: pc.Entity): void;

    private moveToClosest(scale: number) {
        const diffToTarget = this.targets.map((target) => {
            const result = app.systems.rigidbody.raycastFirst(this.entity.getPosition(), target.getPosition());
            if (result && result.entity.name === 'Character') {
                const targetPosition = target.getPosition().clone();
                targetPosition.y = 0;

                return targetPosition.sub(this.entity.getPosition());
            }
        }).filter(Boolean).sort((a, b) => Number(a.length() > b.length()))[0];
        if (diffToTarget && !Number.isNaN(diffToTarget.clone().normalize().scale(scale).x)) {
            // this.entity.rigidbody.linearVelocity = pc.Vec3.ZERO;
            this.entity.rigidbody.applyForce(diffToTarget.normalize().scale(scale));
        }
    }
}
