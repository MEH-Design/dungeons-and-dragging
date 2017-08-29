import Character from 'characters/Character';

export default class Player extends Character {
  private static players: Player[] = [];

  constructor(parent: pc.Entity, position: pc.Vec3) {
    const entity = new pc.Entity();
    parent.addChild(entity);

    entity.addComponent('model', {
      type: 'box'
    });

    entity.addComponent('collision', {
      type: 'box'
    });

    super(entity, position);
    Player.addPlayer(this);
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

  public select() {
    console.log('im selected!');
  }

  protected handleTargets() {
    return;
  }
}
