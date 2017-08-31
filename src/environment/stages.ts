import app from 'app';
import Player from 'characters/player/Player';
import GameObject from 'GameObject';
import { astar, Graph } from 'javascript-astar';
import { Noise } from 'noisejs';

const rand = (...arr: number[]) => {
  let args = arr;
  if (args.length === 0) {
    args = [2];
  }
  if (args.length === 1) {
    // use 1: rand(max)
    return Math.floor(Math.random() * args[0]);
  }

  // use 2: rand(min, max)
  return Math.floor((Math.random() * (args[1] - args[0])) + args[0]);
};

const rand2DVector = (min: pc.Vec2, max: pc.Vec2) => {
  const x = Math.random() * (max.x - min.x) + min.x;
  const y = Math.random() * (max.y - min.y) + min.y;

  return new pc.Vec2(x, y);
};

interface INoiseOptions {
  extend?: number[];
}

export class Terrain extends GameObject {
  public entity: pc.Entity;
  public heightMap: number[][];
  public normals: number[];
  public model: pc.Model;
  public topLeft: pc.Vec2;

  constructor(parent: pc.Entity, attributes: {} = {}) {
    super();
    const defaultAttributes = {
      offset: new pc.Vec2(0, 0),
      size: new pc.Vec2(15, 45),
      terrainMaterial: 'assets/materials/grass.json',
      waterMaterial: 'assets/materials/water.json',
      grayTerrainMaterial: 'assets/materials/gray.json',
      waterLevel: 1,
      meshHeightMultiplier: 5,
      riverProbability: 1,
      riverDepth: 0,
      stoneRange: [2, 7],
      minStoneOffset: 0.1,
      groundThickness: 0.1
    };
    super.setAttributes(defaultAttributes, attributes);
    // assets are cached once loaded so its good to start the request ASAP
    Promise.all([
      app.getAsset(this.attributes.terrainMaterial, 'material'),
      app.getAsset(this.attributes.waterMaterial, 'material'),
      app.getAsset(this.attributes.grayTerrainMaterial, 'material')
    ]);

    this.entity = parent;
    this.topLeft = new pc.Vec2(-(this.attributes.offset.x + ((this.attributes.size.x - 1) / 2.0)),
      this.attributes.offset.y + ((this.attributes.size.y - 1) / 2.0));

    // this has to be called first in order for this.heightMap to exist
    const noiseOptions: INoiseOptions = {};
    if (this.attributes.extend) {
      noiseOptions.extend = this.attributes.extend;
    }
    this._createNoiseMap(noiseOptions);

    // these need this.heightMap
    this._createMesh();
    this._createGround();
    this._createWater();
    this._createRocks();
  }

  public async grayOut() {
    const grayResource = (await app.getAsset(this.attributes.grayTerrainMaterial, 'material')).resource;
    app.scene.removeModel(this.model);
    this.model.meshInstances[0].material = grayResource;
    app.scene.addModel(this.model);

    this.entity.findByName('Water').enabled = false;
    this.entity.findByName('Ground').model.material = grayResource;
  }

  // TODO: make this static
  private _createNoiseMap(options: INoiseOptions) {
    const mapWidth = this.attributes.size.x - 2;
    const mapHeight = this.attributes.size.y - 2;

    let noiseMap: number[][] = [];
    const noise = new Noise(Math.random());
    for (let y = 0; y < mapHeight; y += 1) {
      noiseMap[y] = [];

      for (let x = 0; x < mapWidth; x += 1) {
        // .simplex2d is between -1 and 1 per default, we need it between 0 and 1
        noiseMap[y][x] = (noise.simplex2(y * 0.1, x * 0.1) + 1) * 0.5;
        // clamp the noiseMap between 0.5 and 1, to make room for possible rivers (0 to 0.5)
        noiseMap[y][x] = (noiseMap[y][x] + 1) * 0.5;
      }
    }

    if (Math.random() <= this.attributes.riverProbability) {
      interface IEdges {
        x: [number, number];
        y: [number, number];
        [key: string]: [number, number];
      }

      const edges: IEdges = {
        x: [0, mapHeight - 1],
        y: [0, mapWidth - 1]
      };

      for (let i = 0; i < 2; i += 1) {
        const key: string = Object.keys(edges)[rand()];
        edges[key].splice(rand(edges[key].length), 1);
      }

      const actualEdges: number[][] = [];
      Object.keys(edges).forEach((key) => {
        edges[key].forEach((val) => {
          let xCoord;
          let yCoord;
          if (key === 'x') {
            xCoord = val;
            yCoord = rand(mapWidth);
          } else if (key === 'y') {
            yCoord = val;
            xCoord = rand(mapHeight);
          }
          actualEdges.push([xCoord, yCoord]);
        });
      });

      // 1 means walkable for astar, 0 means obstacle
      let noiseMask = noiseMap.map(row => row.map(point => Number(point <= 1)));
      const graph = new Graph(noiseMask, {
        diagonal: true
      });

      const start = graph.grid[actualEdges[0][0]][actualEdges[0][1]];
      const end = graph.grid[actualEdges[1][0]][actualEdges[1][1]];
      const result = astar.search(graph, start, end);

      const flattened = noiseMap.reduce((a, b) => a.concat(b));
      const diffToMax = 1 - Math.max(...flattened);
      noiseMap.map(row => row.map(point => point + diffToMax));

      noiseMask = noiseMap.map(row => row.map(point => point + diffToMax));

      const trySet = (x: number, y: number) => {
        if (x < noiseMap.length && y < noiseMap[0].length) {
          noiseMap[x][y] = 0.5 - (this.attributes.riverDepth / 2);
        }
      };
      result.forEach((point) => {
        const x = point.x + rand();
        const y = point.y + rand();
        trySet(x, y);
        trySet(x + 1, y);
        trySet(x, y + 1);
        trySet(x + 1, y + 1);
      });
    }

    if (options.extend) {
      // cut away zeros
      const toExtend = options.extend.slice(1, 14);

      noiseMap.unshift(toExtend);
      const delta = noiseMap[3].map((point, i) => (point - noiseMap[0][i]) / 3.0);
      for (let i = 1; i < 3; i += 1) {
        noiseMap[i] = noiseMap[i - 1].map((point, j) => point + delta[j]);
      }
    } else {
      noiseMap.unshift(Array(mapWidth).fill(0));
    }
    noiseMap.push(Array(mapWidth).fill(0));
    noiseMap = noiseMap.map(row => [0].concat(row, [0]));

    this.heightMap = noiseMap;
  }
  private async _createGround() {
    const ground = new pc.Entity('Ground');
    ground.addComponent('model', {
      type: 'box'
    });
    ground.setLocalPosition(this.attributes.offset.x, 0, this.attributes.offset.y);
    ground.setLocalScale(this.attributes.size.x - 1,
      this.attributes.groundThickness, this.attributes.size.y - 1);
    this.entity.addChild(ground);
    ground.model.material = (await app.getAsset(this.attributes.terrainMaterial, 'material')).resource;
  }
  private async _createWater() {
    const water = new pc.Entity('Water');
    water.addComponent('model', {
      type: 'box'
    });
    water.setLocalScale(this.attributes.size.x - 4,
      this.attributes.waterLevel, this.attributes.size.y - 4);
    water.setLocalPosition(this.attributes.offset.x,
      this.attributes.waterLevel / 2, this.attributes.offset.y);
    this.entity.addChild(water);
    water.model.material = (await app.getAsset(this.attributes.waterMaterial, 'material')).resource;
  }
  private async _createMesh() {
    const width = this.attributes.size.x;
    const height = this.attributes.size.y;

    // A one dimensional array of numbers, holding where the vertices should located be on the mesh.
    const positions = [];
    // A one dimensional array of numbers, holding where the triangles are located on the mesh.
    const indices = [];
    // A one dimensional array of numbers, holding where the texture should be placed on the mesh.
    const uvs = [];
    // A normal map to correctly display light.
    let vertexIndex = 0;

    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        positions.push(...this.coord2pos(x, y));
        uvs.push(x / height, 1.0 - (y / width));

        if (x < width - 1 && y < height - 1) {
          // Creates first triangle of a square.
          indices.push(vertexIndex, vertexIndex + width + 1, vertexIndex + width);
          // Creates second triangle of a square.
          indices.push(vertexIndex + width + 1, vertexIndex, vertexIndex + 1);
        }

        vertexIndex += 1;
      }
    }

    const normals = pc.calculateNormals(positions, indices);
    this.normals = normals;

    const plane = pc.createMesh(app.graphicsDevice, positions, {
      indices,
      normals,
      uvs
    });

    const node = new pc.GraphNode('TerrainNode');
    const meshInstance = new pc.MeshInstance(node, plane, (await app.getAsset(this.attributes.terrainMaterial, 'material')).resource);
    const model = new pc.Model();

    model.graph = node;
    model.meshInstances = [meshInstance];

    if (!this.entity.rigidbody) {
      this.entity.addComponent('rigidbody', {
        type: 'static'
      });
    }
    if (!this.entity.collision) {
      this.entity.addComponent('collision', {
        type: 'mesh'
      });
    }

    this.entity.collision.model = model;
    app.scene.addModel(model);

    const previousTerrainNode = this.entity.findByName('TerrainNode');
    if (previousTerrainNode) {
      this.entity.removeChild(previousTerrainNode);
    }
    this.entity.addChild(node);

    if (this.model) {
      app.scene.removeModel(this.model);
    }
    this.model = model;
  }
  private _createRocks() {
    const width = this.attributes.size.x;
    const height = this.attributes.size.y;

    for (let i = 0; i < rand(this.attributes.stoneRange.x, this.attributes.stoneRange.y); i += 1) {
      const rock = app.getEntity('Prefabs', 'Rock').clone();
      rock.enabled = true;
      const y = rand(height * this.attributes.minStoneOffset,
        height * (1 - this.attributes.minStoneOffset));
      const x = rand(width * this.attributes.minStoneOffset,
        width * (1 - this.attributes.minStoneOffset));
      const coord = this.coord2pos(x, y);
      rock.setPosition(coord[0], coord[1], coord[2]);
    }
  }

  private coord2pos(x: number, y: number) {
    return [(this.topLeft.x + x),
      (this.heightMap[y][x] ** 3) * this.attributes.meshHeightMultiplier,
      (this.topLeft.y - y)
    ];
  }
}

export class Level extends GameObject {
  public endZone: pc.Entity = new pc.Entity();
  public entity: pc.Entity = new pc.Entity();
  public terrain: Terrain;
  public isGrayedOut: boolean = false;

  private topLeft: pc.Vec2;

  constructor(parent: pc.Entity, attributes: {} = {}) {
    super();
    super.setAttributes({
      size: new pc.Vec2(15, 45),
      offset: new pc.Vec2(0, 0)
    }, attributes);

    app.getAsset('assets/materials/endzone.json', 'material').then((asset) => {
      super.setAttributes({
        endzoneMaterial: asset.resource
      });

      this._createEndZone();
    });

    this.entity.setPosition(this.attributes.offset.x, 0, this.attributes.offset.y);
    parent.addChild(this.entity);

    const terrainEntity = new pc.Entity();
    this.entity.addChild(terrainEntity);

    this.terrain = new Terrain(terrainEntity, {
      size: this.attributes.size
    });
    this.topLeft = this.terrain.topLeft.clone().add(this.attributes.offset);

    Player.players.forEach((player: Player) => {
      const spawnPos: pc.Vec2 = rand2DVector(
        this.topLeft.clone().add(new pc.Vec2(1, 1)),
        this.topLeft.clone().add(new pc.Vec2(this.attributes.size.x - 1, -10))
      );
      player.deselect();
      player.entity.rigidbody.teleport(new pc.Vec3(spawnPos.x, 30, spawnPos.y));
      player.entity.rigidbody.angularVelocity = pc.Vec3.ZERO;
      player.entity.rigidbody.linearVelocity = pc.Vec3.ZERO;

      player.setAreaConstraint(this.topLeft, this.topLeft.clone().add(new pc.Vec2(this.attributes.size.x, -this.attributes.size.y)));
    });
  }

  public isCompleted() {
    if (Player.players.length === 0) {
      return false;
    }
    let allPlayersInside = true;
    for (const player of Player.players) {
      const boundingBox: pc.BoundingBox = this.endZone.model.meshInstances[0].aabb;
      if (!boundingBox.containsPoint(player.entity.getPosition())) {
        allPlayersInside = false;
        break;
      }
    }

    return allPlayersInside;
  }
  public onComplete() {
    // this is usually overridden from an external function
  }

  private _createEndZone() {
    this.endZone.addComponent('model', {
      type: 'box'
    });
    this.endZone.model.material = this.attributes.endzoneMaterial;

    this.endZone.setLocalScale(this.attributes.size.x - 1, 10, 5);
    this.endZone.setLocalPosition(0, 5, (this.attributes.size.y / -2.0) + 3);

    super.addTimedUpdate(() => {
      if (!this.isGrayedOut && this.isCompleted()) {
        this.isGrayedOut = true;
        this.terrain.grayOut();
        this.endZone.destroy();

        this.onComplete();
      }
    }, 1);
    this.entity.addChild(this.endZone);
  }

}

export class Stage extends GameObject {
  public levels: Level[] = [];
  public currentOffset: pc.Vec2 = new pc.Vec2(0, 0);
  public levelParent: pc.Entity = new pc.Entity();

  constructor(entity: pc.Entity, attributes: {} = {}) {
    super();
    super.setAttributes({
      levelCount: 3
    }, attributes);

    entity.addChild(this.levelParent);
    this.createNextLevel();
  }

  public createNextLevel() {
    const attributes = {
      offset: this.currentOffset
    };
    if (this.levels.length > 0) {
      // attributes.extend = this.levels[this.levels.length - 1].terrain.heightMap[0];
    }

    const level = new Level(this.levelParent, attributes);
    setTimeout(() => app.camera.focus(level.entity, true), 500);

    this.levels.push(level);
    this.currentOffset.y -= 43;
    if (this.levels.length < this.attributes.levelCount) {
      level.onComplete = () => this.createNextLevel();
    }
  }
}
