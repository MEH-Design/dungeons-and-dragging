import app from 'app';
import Character from 'characters/Character';
import Player from 'characters/player/Player';

export default abstract class BaseEnemy extends Character {
    private timeSinceLastAttack: number = 0;
    constructor(position: pc.Vec3, range: number, attributes: {} = {}) {
        super(position, {
          material: 'assets/materials/enemyred.json',
          range: range
        });
        super.setAttributes({
          attackSpeed: 1
        }, attributes);

        this.entity.rigidbody.group = pc.BODYGROUP_USER_1;
        Player.players.forEach((player: Player) => {
          super.addTarget(player.entity);
        });
    }

    public handleTargets(dt: number, targetsInRange: pc.Entity[], targetsOutOfRange: pc.Entity[]) {
        this.timeSinceLastAttack += dt;
        if (targetsInRange.length > 0) {
            if (this.timeSinceLastAttack >= 1 / this.attributes.attackSpeed) {
              this.attack(targetsInRange[0]);
              this.timeSinceLastAttack = 0;
            }
        } else {
            this.moveToClosest(dt);
        }
    }

    public abstract attack(entity: pc.Entity): void;
    public abstract handleClosest(diffToClosest: pc.Vec3, dt: number): void;

    private moveToClosest(dt: number) {
        const diffToTarget = this.targets.map((target) => {
            const result = app.systems.rigidbody.raycastFirst(this.entity.getPosition(), target.getPosition());
            if (result && result.entity.name === 'Character') {
                const targetPosition = target.getPosition().clone();
                targetPosition.y = 0;

                return targetPosition.sub(this.entity.getPosition());
            }
        }).filter(Boolean).sort((a, b) => Number(a.length() > b.length()))[0];
        if (diffToTarget && !Number.isNaN(diffToTarget.clone().normalize().x)) {
            this.handleClosest(diffToTarget, dt);
        }
    }
}
