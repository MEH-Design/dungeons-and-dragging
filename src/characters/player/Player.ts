import app from 'app';
import Character from 'characters/Character';

export default class Player extends Character {
  private static players: Player[] = [];
  private isSelected: boolean = false;
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

  protected handleTargets() {
    return;
  }
}
