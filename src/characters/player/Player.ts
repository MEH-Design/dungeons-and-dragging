import app from 'app';
import Character from 'characters/Character';

export default class Player extends Character {
  public static players: Player[] = [];
  private isSelected: boolean = false;
  private boundaries: {
    start: pc.Vec2,
    end: pc.Vec2,
    isOutside: boolean,
    isSet: boolean
  } = {
    start: new pc.Vec2(),
    end: new pc.Vec2(),
    isOutside: false,
    isSet: false
  };
  private depth: number;

  constructor(parent: pc.Entity, position: pc.Vec3) {
    super(parent, position);
    Player.addPlayer(this);

    app.mouse.on(pc.EVENT_MOUSEUP, this.deselect, this);
    super.addTimedUpdate((dt) => {
      if (!this.isSelected) {
        return;
      }
      if (app.keyboard.isPressed(pc.KEY_SHIFT)) {
        this.depth += 50 * dt;
      } else if (app.keyboard.isPressed(pc.KEY_CONTROL)) {
          this.depth -= 50 * dt;
      }

      const targetPosition: pc.Vec3 = new pc.Vec3();
      app.camera.entity.camera.screenToWorld(app.mouse.x, app.mouse.y, this.depth, targetPosition);
      if (this.boundaries.isSet) {
        if (targetPosition.x < this.boundaries.start.x) {
          targetPosition.x = this.boundaries.start.x;
        }
        if (targetPosition.x > this.boundaries.end.x) {
          targetPosition.x = this.boundaries.end.x;
        }
        if (targetPosition.z > this.boundaries.start.y) {
          targetPosition.z = this.boundaries.start.y;
        }
        if (targetPosition.z < this.boundaries.end.y) {
          targetPosition.z = this.boundaries.end.y;
        }
      }

      let diff = targetPosition.sub(this.entity.getPosition());
      diff = diff.scale(100);

      if (diff.length() > 2000) {
          diff.normalize().scale(2000);
      }
      if (diff.length() > 0) {
          this.entity.rigidbody.angularVelocity = pc.Vec3.ZERO;
          this.entity.rigidbody.linearVelocity = pc.Vec3.ZERO;
          this.entity.rigidbody.applyForce(diff);
      }
    }, 0);
  }

  public static getByEntity(entity: pc.Entity): Player {
    let result;
    this.players.forEach((player: Player) => {
      if (player.entity === entity) {
        result = player;
      }
    });

    return result;
  }

  private static addPlayer(player: Player) {
    this.players = this.players || [];
    this.players.push(player);
  }

  public deselect() {
    this.isSelected = false;
  }

  public select() {
    this.depth = app.camera.entity.getPosition().sub(this.entity.getPosition()).length();
    this.isSelected = true;
  }

  // force the player to stay in a box from start to end.
  public setAreaConstraint(start: pc.Vec2, end: pc.Vec2) {
    this.boundaries.isSet = true;
    this.boundaries.start = start.add(new pc.Vec2(2, -2));
    this.boundaries.end = end.add(new pc.Vec2(-2, 2));
    super.addTimedUpdate(() => {
      const pos = this.entity.getPosition();
      if (pos.x < start.x || pos.z > start.y || pos.x > end.x || pos.z < end.y) {
        this.boundaries.isOutside = true;
        this.entity.rigidbody.linearVelocity = new pc.Vec3(0, this.entity.rigidbody.linearVelocity.y, 0);
      } else {
        this.boundaries.isOutside = false;
      }
    }, 0);
  }

  protected handleTargets() {
    return;
  }
}
