declare module 'javascript-astar' {
  export class Graph {
      grid: Array<Array<GridNode>>;
      constructor(grid: Array<Array<number>>, options?: {diagonal?: boolean});
  }

  export class GridNode {
      x: number;
      y: number;
  }

  interface Heuristic {
      (pos0: {x: number, y: number}, pos1: {x: number, y: number}): number;
  }

  interface Heuristics {
      manhatten: Heuristic;
      diagonal: Heuristic;
  }

  export namespace astar {
      function search(
          graph: Graph,
          start: {x: number, y: number},
          end: {x: number, y: number},
          options?: {
              closest?: boolean,
              heuristic?: Heuristic
          }
      ): Array<GridNode>;
      var heuristics: Heuristics;
  }
}

declare module 'noisejs' {
  export class Noise {
    /**
     * Passing in seed will seed this Noise instance
     * @param  {number} seed
     * @return {Noise}       Noise instance
     */
    constructor(seed?: number);

    /**
     * 2D simplex noise
     * @param  {number} x
     * @param  {number} y
     * @return {number} noise value
     */
    simplex2(x: number, y: number): number;

    /**
     * 3D simplex noise
     * @param  {number} x
     * @param  {number} y
     * @param  {number} z
     * @return {number} noise value
     */
    simplex3(x: number, y: number, z: number): number;

    /**
     * 2D Perlin Noise
     * @param  {number} x
     * @param  {number} y
     * @return {number} noise value
     */
    perlin2(x: number, y: number): number;

    /**
     * 3D Perlin Noise
     * @param  {number} x
     * @param  {number} y
     * @param  {number} z
     * @return {number} noise value
     */
    perlin3(x: number, y: number, z: number): number;

    /**
     * This isn't a very good seeding function, but it works ok. It supports 2^16
     * different seed values. Write something better if you need more seeds.
     * @param {number} seed [description]
     */
    seed(seed: number): void;
  }
}
