import Character from 'characters/Character';

export default class Player extends Character {
  private static players: any[] = [];

  constructor(parent: any, position: any) {
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

  public static getByEntity(entity: any): any {
    let result;
    this.players.forEach((player: any) => {
      if (player.entity === entity) {
        result = player;
      }
    });

    return result;
  }

  private static addPlayer(player: any) {
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
