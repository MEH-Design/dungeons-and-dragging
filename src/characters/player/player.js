import Character from 'characters/character.js';

export default class Player extends Character {
<<<<<<< Updated upstream

}
=======
  static getByEntity(entity) {
    let result;
    this.players.forEach((player) => {
      if(player.entity === entity) {
        result = player;
      }
    });
    return result;
  }
  
  static _addPlayer(player) {
    this.players = this.players || [];
    this.players.push(player);
  }
  
  constructor(parent, position) {
    const entity = new pc.Entity();
    parent.addChild(entity);

    entity.addComponent('model', {
      type: 'box',
    });

    entity.addComponent('collision', {
      type: 'box'
    });

    super(entity, position);
    Player._addPlayer(this);
  }
  
  handleTargets() {
    return;
  }
  
  select() {
    console.log('im selected!');
  }
}
>>>>>>> Stashed changes
