/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class GameObject {
    constructor() {
        this.timedUpdates = [];
        this.attributes = {};
        GameObject.addObject(this);
    }
    static addObject(obj) {
        this.objects.push(obj);
    }
    static getEntity(...names) {
        return GameObject.getResource(GameObject.getApp().root, 'findByName', names);
    }
    static getMouse() {
        if (!GameObject.mouse) {
            GameObject.mouse = new pc.Mouse(GameObject.getApp().root);
            GameObject.mouse.attach(document.getElementById('canvas'));
        }
        return this.mouse;
    }
    static getAsset(path, assetType) {
        if (this.knownAssets[path]) {
            return new Promise((resolve) => {
                resolve(this.knownAssets[path]);
            });
        }
        return new Promise((resolve, reject) => {
            GameObject.getApp().assets.loadFromUrl(path, assetType, (err, asset) => {
                GameObject.knownAssets[path] = asset;
                if (err) {
                    reject(err);
                }
                resolve(asset);
            });
        });
    }
    static requireOverride() {
        const error = new Error();
        const functionName = ((error.stack).split('at ')[2]).trim().split(' ')[0];
        error.message = `${functionName} needs to be overriden`;
        throw error;
    }
    static getResource(root, functionName, names) {
        let resource;
        names.forEach((name) => {
            resource = (resource || root)[functionName](name);
        });
        return resource;
    }
    static getApp() {
        return pc.Application.getApplication();
    }
    setAttributes(...attributes) {
        attributes.forEach(Object.assign.bind(this, this.attributes));
    }
    addTimedUpdate(callback, interval = 0.2) {
        this.timedUpdates.push({
            callback: callback.bind(this),
            interval,
            counter: 0
        });
    }
    update(dt) {
        this.timedUpdates.forEach((tu) => {
            tu.counter += dt;
            if (tu.counter >= tu.interval) {
                tu.callback(tu.counter);
                tu.counter = 0;
            }
        });
    }
}
GameObject.objects = [];
GameObject.knownAssets = {};
exports.default = GameObject;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Player_1 = __webpack_require__(2);
const OrbitCamera_1 = __webpack_require__(5);
const stages_1 = __webpack_require__(6);
const GameObject_1 = __webpack_require__(0);
class App extends pc.Application {
    constructor(...args) {
        super(...args);
        this.lights = [];
        super.start();
        super.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW);
        super.setCanvasResolution(pc.RESOLUTION_AUTO);
        window.addEventListener('resize', () => {
            super.resizeCanvas();
        });
    }
    start() {
        this.lights.push(this.createLight(new pc.Color(1, 1, 1), new pc.Vec3(45, 0, 0)));
        this.camera = new OrbitCamera_1.default(new pc.Color(1, 1, 1), new pc.Vec3(0, 20, 30), new pc.Vec3(-30, 0, 0));
        const stageEntity = new pc.Entity();
        const playerEntity = new pc.Entity();
        this.root.addChild(stageEntity);
        this.root.addChild(playerEntity);
        this.stage = new stages_1.Stage(stageEntity, this.camera);
        this.player = new Player_1.default(playerEntity, new pc.Vec3(0, 20, 0));
    }
    onUpdate(callback) {
        this.on('update', callback);
    }
    createLight(color, angle) {
        const light = new pc.Entity('light');
        light.addComponent('light', {
            color: new pc.Color(1, 1, 1)
        });
        this.root.addChild(light);
        light.setEulerAngles(45, 0, 0);
    }
}
const app = new App(document.getElementById('canvas'), {});
app.onUpdate((dt) => {
    GameObject_1.default.objects.forEach((obj) => obj.update(dt));
});
exports.default = app;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Character_1 = __webpack_require__(4);
class Player extends Character_1.default {
    constructor(parent, position) {
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
    static getByEntity(entity) {
        let result;
        this.players.forEach((player) => {
            if (player.entity === entity) {
                result = player;
            }
        });
        return result;
    }
    static addPlayer(player) {
        this.players = this.players || [];
        this.players.push(player);
    }
    select() {
        console.log('im selected!');
    }
    handleTargets() {
        return;
    }
}
Player.players = [];
exports.default = Player;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __webpack_require__(1);
app_1.default.start();


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const GameObject_1 = __webpack_require__(0);
class Character extends GameObject_1.default {
    constructor(entity, position, attributes = {}) {
        super();
        this.entity = entity;
        this.targets = [];
        super.setAttributes({
            searchInterval: 0.1,
            range: 2,
            material: new pc.PhongMaterial()
        }, attributes);
        super.addTimedUpdate(this.searchForTargets, this.attributes.searchInterval);
        this.targets = [];
        this.entity = entity;
        this.entity.model.material = this.attributes.material;
        this.entity.setPosition(position);
        this.entity.enabled = true;
        this.entity.addComponent('rigidbody', {
            type: 'dynamic'
        });
    }
    addTarget(target) {
        this.targets.push(target);
    }
    searchForTargets(dt) {
        const targetsInRange = [];
        const targetsOutOfRange = [];
        this.targets.forEach((target) => {
            (this.isInRange(this.entity, target) ? targetsInRange : targetsOutOfRange).push(target);
        });
        this.handleTargets(dt, targetsInRange, targetsOutOfRange);
    }
    isInRange(entity, target) {
        const distance = target.getPosition().clone().sub(entity.getPosition()).length();
        return distance <= this.attributes.range;
    }
}
exports.default = Character;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __webpack_require__(1);
const Player_1 = __webpack_require__(2);
const GameObject_1 = __webpack_require__(0);
class MouseInput {
    constructor(orbitCamera) {
        this.orbitCamera = orbitCamera;
        this.distanceSensitivity = 0.3;
        this.orbitSensitivity = 0.5;
        this.fromWorldPoint = new pc.Vec3();
        this.toWorldPoint = new pc.Vec3();
        this.worldDiff = new pc.Vec3();
        this.lookButtonDown = false;
        this.panButtonDown = false;
        this.lastPoint = new pc.Vec2();
        this.mouse = GameObject_1.default.getMouse();
        this.entity = orbitCamera.entity;
        if (this.orbitCamera) {
            const onMouseOut = () => this.onMouseOut();
            this.mouse.on(pc.EVENT_MOUSEDOWN, this.onMouseDown, this);
            this.mouse.on(pc.EVENT_MOUSEUP, this.onMouseUp, this);
            this.mouse.on(pc.EVENT_MOUSEMOVE, this.onMouseMove, this);
            this.mouse.on(pc.EVENT_MOUSEWHEEL, this.onMouseWheel, this);
            window.addEventListener('mouseout', onMouseOut, false);
        }
        this.mouse.disableContextMenu();
    }
    pan(screenPoint) {
        const fromWorldPoint = this.fromWorldPoint;
        const toWorldPoint = this.toWorldPoint;
        const worldDiff = this.worldDiff;
        const camera = this.entity.camera;
        const distance = this.orbitCamera.distance;
        camera.screenToWorld(screenPoint.x, screenPoint.y, distance, fromWorldPoint);
        camera.screenToWorld(this.lastPoint.x, this.lastPoint.y, distance, toWorldPoint);
        worldDiff.sub2(toWorldPoint, fromWorldPoint);
        this.orbitCamera.pivotPoint.add(worldDiff);
    }
    onMouseDown(event) {
        const camera = this.entity.camera;
        const source = camera.screenToWorld(event.x, event.y, camera.nearClip);
        const target = camera.screenToWorld(event.x, event.y, camera.farClip);
        const result = GameObject_1.default.getApp().systems.rigidbody.raycastFirst(source, target);
        if (result) {
            const player = Player_1.default.getByEntity(result.entity);
            if (player) {
                player.select();
            }
        }
        switch (event.button) {
            case pc.MOUSEBUTTON_LEFT:
                break;
            case pc.MOUSEBUTTON_MIDDLE:
            case pc.MOUSEBUTTON_RIGHT:
                this.lookButtonDown = true;
                break;
            default: break;
        }
    }
    onMouseUp(event) {
        switch (event.button) {
            case pc.MOUSEBUTTON_LEFT:
                this.lookButtonDown = false;
                break;
            case pc.MOUSEBUTTON_MIDDLE:
            case pc.MOUSEBUTTON_RIGHT:
                this.panButtonDown = false;
                break;
            default: break;
        }
    }
    onMouseMove(event) {
        if (this.lookButtonDown) {
            this.orbitCamera.pitch -= event.dy * this.orbitSensitivity;
            this.orbitCamera.yaw -= event.dx * this.orbitSensitivity;
        }
        else if (this.panButtonDown) {
            this.pan(event);
        }
        this.lastPoint.set(event.x, event.y);
    }
    onMouseWheel(event) {
        this.orbitCamera.distance -=
            event.wheel * this.distanceSensitivity * this.orbitCamera.distance * 0.1;
        event.event.preventDefault();
    }
    onMouseOut() {
        this.lookButtonDown = false;
        this.panButtonDown = false;
    }
}
class OrbitCamera extends GameObject_1.default {
    constructor(clearColor, position, eulerAngles) {
        super();
        this.distanceMax = 700;
        this.distanceMin = 100;
        this.pitchAngleMax = 90;
        this.pitchAngleMin = -90;
        this.inertiaFactor = 0;
        this.distanceFactor = 0.4;
        this.frameOnStart = true;
        this.distanceBetween = pc.Vec3();
        this.quatWithoutYaw = new pc.Quat();
        this.yawOffset = new pc.Quat();
        this._modelsAabb = new pc.BoundingBox();
        this._pivotPoint = new pc.Vec3();
        this.doesTransition = false;
        this.entity = new pc.Entity('OrbitCamera');
        this.entity.addComponent('camera', {
            clearColor: clearColor
        });
        this.entity.setPosition(position);
        this.entity.setEulerAngles(eulerAngles);
        GameObject_1.default.getApp().root.addChild(this.entity);
        this.mouseInput = new MouseInput(this);
        super.addTimedUpdate((dt) => {
            const t = this.inertiaFactor === 0 ? 1 : Math.min(dt / this.inertiaFactor, 1);
            this._distance = pc.math.lerp(this._distance, this._targetDistance, t);
            this._yaw = pc.math.lerp(this._yaw, this._targetYaw, t);
            this._pitch = pc.math.lerp(this._pitch, this._targetPitch, t);
            this._updatePosition();
        }, 0);
        window.addEventListener('resize', () => {
            this._checkAspectRatio();
        }, false);
        this._checkAspectRatio();
        this._buildAabb(this.entity || app_1.default.root, 0);
        this.entity.lookAt(this._modelsAabb.center);
        this._pivotPoint.copy(this._modelsAabb.center);
        const cameraQuat = this.entity.getRotation();
        this._yaw = OrbitCamera._calcYaw(cameraQuat);
        this._pitch = this._clampPitchAngle(this._calcPitch(cameraQuat, this._yaw));
        this.entity.setLocalEulerAngles(this._pitch, this._yaw, 0);
        this._distance = 0;
        this._targetYaw = this._yaw;
        this._targetPitch = this._pitch;
        if (this.frameOnStart) {
            this.focus(this.entity || app_1.default.root);
        }
        else {
            const distanceBetween = new pc.Vec3();
            distanceBetween.sub2(this.entity.getPosition(), this._pivotPoint);
            this._distance = this._clampDistance(distanceBetween.length());
        }
        this._targetDistance = this._distance;
    }
    static _calcYaw(quat) {
        const transformedForward = new pc.Vec3();
        quat.transformVector(pc.Vec3.FORWARD, transformedForward);
        return Math.atan2(-transformedForward.x, -transformedForward.z) * pc.math.RAD_TO_DEG;
    }
    _clampPitchAngle(pitch) {
        return pc.math.clamp(pitch, -this.pitchAngleMax, -this.pitchAngleMin);
    }
    _calcPitch(quat, yaw) {
        const quatWithoutYaw = this.quatWithoutYaw;
        const yawOffset = this.yawOffset;
        yawOffset.setFromEulerAngles(0, -yaw, 0);
        quatWithoutYaw.mul2(yawOffset, quat);
        const transformedForward = new pc.Vec3();
        quatWithoutYaw.transformVector(pc.Vec3.FORWARD, transformedForward);
        return Math.atan2(transformedForward.y, -transformedForward.z) * pc.math.RAD_TO_DEG;
    }
    focus(focusEntity, transition = false) {
        this._buildAabb(focusEntity, 0);
        const halfExtents = this._modelsAabb.halfExtents;
        let distance = Math.max(halfExtents.x, Math.max(halfExtents.y, halfExtents.z));
        distance /= Math.tan(0.5 * this.entity.camera.fov * pc.math.DEG_TO_RAD);
        distance *= 2;
        this.distance = distance;
        this._removeInertia();
        this._pivotPoint.copy(focusEntity.getPosition());
        this.doesTransition = transition;
    }
    _updatePosition() {
        this.entity.setLocalEulerAngles(this._pitch, this._yaw, 0);
        const position = this.entity.getPosition();
        position.copy(this.entity.forward);
        position.scale(-this._distance * this.distanceFactor);
        position.add(this.pivotPoint);
        const diff = position.clone().sub(this.entity.getPosition());
        if (diff.length() <= 0.1) {
            this.doesTransition = false;
        }
        diff.scale(this.doesTransition ? 0.1 : 1);
        this.entity.setPosition(this.entity.getPosition().add(diff));
    }
    _removeInertia() {
        this._yaw = this._targetYaw;
        this._pitch = this._targetPitch;
        this._distance = this._targetDistance;
    }
    _checkAspectRatio() {
        const height = app_1.default ? app_1.default.graphicsDevice.height : 0;
        const width = app_1.default ? app_1.default.graphicsDevice.width : 0;
        this.entity.camera.horizontalFov = height > width;
    }
    _buildAabb(entity, _modelsAdded) {
        let i = 0;
        let modelsAdded = _modelsAdded;
        if (entity.model) {
            const mi = entity.model.meshInstances;
            for (i = 0; i < mi.length; i += 1) {
                if (modelsAdded === 0) {
                    this._modelsAabb.copy(mi[i].aabb);
                }
                else {
                    this._modelsAabb.add(mi[i].aabb);
                }
                modelsAdded += 1;
            }
        }
        return modelsAdded;
    }
    _clampDistance(distance) {
        if (this.distanceMax > 0) {
            return pc.math.clamp(distance, this.distanceMin, this.distanceMax);
        }
        return Math.max(distance, this.distanceMin);
    }
    get distance() {
        return this._targetDistance;
    }
    set distance(value) {
        this._targetDistance = this._clampDistance(value);
    }
    get pitch() {
        return this._targetPitch;
    }
    set pitch(value) {
        this._targetPitch = this._clampPitchAngle(value);
    }
    get yaw() {
        return this._targetYaw;
    }
    set yaw(value) {
        this._targetYaw = value;
        const diff = this._targetYaw - this._yaw;
        const reminder = diff % 360;
        if (reminder > 180) {
            this._targetYaw = this._yaw - (360 - reminder);
        }
        else if (reminder < -180) {
            this._targetYaw = this._yaw + (360 + reminder);
        }
        else {
            this._targetYaw = this._yaw + reminder;
        }
    }
    get pivotPoint() {
        return this._pivotPoint;
    }
    set pivotPoint(value) {
        this._pivotPoint.copy(value);
    }
}
exports.default = OrbitCamera;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const noisejs_1 = __webpack_require__(7);
const javascript_astar_1 = __webpack_require__(8);
const GameObject_1 = __webpack_require__(0);
const rand = (...arr) => {
    let args = arr;
    if (args.length === 0) {
        args = [2];
    }
    if (args.length === 1) {
        return Math.floor(Math.random() * args[0]);
    }
    return Math.floor((Math.random() * (args[1] - args[0])) + args[0]);
};
class Terrain extends GameObject_1.default {
    constructor(parent, attributes = {}) {
        super();
        Promise.all([
            GameObject_1.default.getAsset('assets/materials/grass.json', 'material'),
            GameObject_1.default.getAsset('assets/materials/water.json', 'material'),
            GameObject_1.default.getAsset('assets/materials/gray.json', 'material'),
        ]).then((arr) => {
            const [terrainMaterial, waterMaterial, grayTerrainMaterial] = arr.map(asset => asset.resource);
            const defaultAttributes = {
                offset: new pc.Vec2(0, 0),
                size: new pc.Vec2(15, 45),
                terrainMaterial,
                waterMaterial,
                grayTerrainMaterial,
                waterLevel: 1,
                meshHeightMultiplier: 5,
                riverProbability: 1,
                riverDepth: 0,
                stoneRange: [2, 7],
                minStoneOffset: 0.1,
                groundThickness: 0.1,
            };
            super.setAttributes(defaultAttributes, attributes);
            this.entity = parent;
            this.topLeft = new pc.Vec2(-(this.attributes.offset.x + ((this.attributes.size.x - 1) / 2.0)), this.attributes.offset.y + ((this.attributes.size.y - 1) / 2.0));
            const noiseOptions = {};
            if (this.attributes.extend) {
                noiseOptions.extend = this.attributes.extend;
            }
            this._createNoiseMap(noiseOptions);
            this._createMesh();
            this._createGround();
            this._createWater();
            this._createRocks();
        });
    }
    _createNoiseMap(options) {
        const mapWidth = this.attributes.size.x - 2;
        const mapHeight = this.attributes.size.y - 2;
        let noiseMap = [];
        const noise = new noisejs_1.default(Math.random());
        for (let y = 0; y < mapHeight; y += 1) {
            noiseMap[y] = [];
            for (let x = 0; x < mapWidth; x += 1) {
                noiseMap[y][x] = (noise.simplex2(y * 0.1, x * 0.1) + 1) * 0.5;
                noiseMap[y][x] = (noiseMap[y][x] + 1) * 0.5;
            }
        }
        if (Math.random() <= this.attributes.riverProbability) {
            const edges = {
                x: [0, mapHeight - 1],
                y: [0, mapWidth - 1],
            };
            for (let i = 0; i < 2; i += 1) {
                const key = Object.keys(edges)[rand()];
                edges[key].splice(rand(edges[key].length), 1);
            }
            const actualEdges = [];
            Object.keys(edges).forEach((key) => {
                edges[key].forEach((val) => {
                    let xCoord;
                    let yCoord;
                    if (key === 'x') {
                        xCoord = val;
                        yCoord = rand(mapWidth);
                    }
                    else if (key === 'y') {
                        yCoord = val;
                        xCoord = rand(mapHeight);
                    }
                    actualEdges.push([xCoord, yCoord]);
                });
            });
            let noiseMask = noiseMap.map(row => row.map(point => Number(point <= 1)));
            const graph = new javascript_astar_1.Graph(noiseMask, {
                diagonal: true,
            });
            const start = graph.grid[actualEdges[0][0]][actualEdges[0][1]];
            const end = graph.grid[actualEdges[1][0]][actualEdges[1][1]];
            const result = javascript_astar_1.astar.search(graph, start, end);
            const flattened = noiseMap.reduce((a, b) => a.concat(b));
            const diffToMax = 1 - Math.max(...flattened);
            noiseMap.map(row => row.map(point => point + diffToMax));
            noiseMask = noiseMap.map(row => row.map(point => point + diffToMax));
            const trySet = (x, y) => {
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
            const toExtend = options.extend.slice(1, 14);
            noiseMap.unshift(toExtend);
            const delta = noiseMap[3].map((point, i) => (point - noiseMap[0][i]) / 3.0);
            for (let i = 1; i < 3; i += 1) {
                noiseMap[i] = noiseMap[i - 1].map((point, j) => point + delta[j]);
            }
        }
        else {
            noiseMap.unshift(new Array(mapWidth).fill(0));
        }
        noiseMap.push(new Array(mapWidth).fill(0));
        noiseMap = noiseMap.map(row => [0].concat(row, [0]));
        this.heightMap = noiseMap;
    }
    _createGround() {
        const ground = new pc.Entity('Ground');
        ground.addComponent('model', {
            type: 'box',
        });
        ground.model.material = this.attributes.terrainMaterial;
        ground.setLocalPosition(this.attributes.offset.x, 0, this.attributes.offset.y);
        ground.setLocalScale(this.attributes.size.x - 1, this.attributes.groundThickness, this.attributes.size.y - 1);
        this.entity.addChild(ground);
    }
    _createWater() {
        const water = new pc.Entity('Water');
        water.addComponent('model', {
            type: 'box',
        });
        water.model.material = this.attributes.waterMaterial;
        water.setLocalScale(this.attributes.size.x - 4, this.attributes.waterLevel, this.attributes.size.y - 4);
        water.setLocalPosition(this.attributes.offset.x, this.attributes.waterLevel / 2, this.attributes.offset.y);
        this.entity.addChild(water);
    }
    _createMesh() {
        const width = this.attributes.size.x;
        const height = this.attributes.size.y;
        const positions = [];
        const indices = [];
        const uvs = [];
        let vertexIndex = 0;
        for (let y = 0; y < height; y += 1) {
            for (let x = 0; x < width; x += 1) {
                positions.push(...this.coord2pos(x, y));
                uvs.push(x / height, 1.0 - (y / width));
                if (x < width - 1 && y < height - 1) {
                    indices.push(vertexIndex, vertexIndex + width + 1, vertexIndex + width);
                    indices.push(vertexIndex + width + 1, vertexIndex, vertexIndex + 1);
                }
                vertexIndex += 1;
            }
        }
        const normals = pc.calculateNormals(positions, indices);
        this.normals = normals;
        const plane = pc.createMesh(GameObject_1.default.getApp().graphicsDevice, positions, {
            indices,
            normals,
            uvs,
        });
        const node = new pc.GraphNode('TerrainNode');
        const meshInstance = new pc.MeshInstance(node, plane, this.attributes.terrainMaterial);
        const model = new pc.Model();
        model.graph = node;
        model.meshInstances = [meshInstance];
        if (!this.entity.rigidbody) {
            this.entity.addComponent('rigidbody', {
                type: 'static',
            });
        }
        if (!this.entity.collision) {
            this.entity.addComponent('collision', {
                type: 'mesh',
            });
        }
        this.entity.collision.model = model;
        GameObject_1.default.getApp().scene.addModel(model);
        const previousTerrainNode = this.entity.findByName('TerrainNode');
        if (previousTerrainNode) {
            this.entity.removeChild(previousTerrainNode);
        }
        this.entity.addChild(node);
        if (this.model) {
            GameObject_1.default.getApp().scene.removeModel(this.model);
        }
        this.model = model;
    }
    _createRocks() {
        const width = this.attributes.size.x;
        const height = this.attributes.size.y;
        for (let i = 0; i < rand(this.attributes.stoneRange.x, this.attributes.stoneRange.y); i += 1) {
            const rock = GameObject_1.default.getEntity('Prefabs', 'Rock').clone();
            rock.enabled = true;
            const y = rand(height * this.attributes.minStoneOffset, height * (1 - this.attributes.minStoneOffset));
            const x = rand(width * this.attributes.minStoneOffset, width * (1 - this.attributes.minStoneOffset));
            rock.setPosition(...this.coord2pos(x, y));
        }
    }
    coord2pos(x, y) {
        return [(this.topLeft.x + x),
            (Math.pow(this.heightMap[y][x], 3)) * this.attributes.meshHeightMultiplier,
            (this.topLeft.y - y),
        ];
    }
    grayOut() {
        GameObject_1.default.getApp().scene.removeModel(this.model);
        this.model.meshInstances[0].material = this.attributes.grayTerrainMaterial;
        GameObject_1.default.getApp().scene.addModel(this.model);
        this.entity.findByName('Water').enabled = false;
        this.entity.findByName('Ground').model.material = this.attributes.grayTerrainMaterial;
    }
}
exports.Terrain = Terrain;
class Level extends GameObject_1.default {
    constructor(parent, attributes = {}) {
        super();
        this.endZone = new pc.Entity();
        this.entity = new pc.Entity();
        super.setAttributes({
            size: new pc.Vec2(15, 45),
            offset: new pc.Vec2(0, 0),
        }, attributes);
        GameObject_1.default.getAsset('assets/materials/endzone.json', 'material').then((asset) => {
            super.setAttributes({
                endzoneMaterial: asset.resource,
            });
            this._createEndZone();
        });
        this.entity.setPosition(this.attributes.offset.x, 0, this.attributes.offset.y);
        parent.addChild(this.entity);
        const terrainEntity = new pc.Entity();
        this.entity.addChild(terrainEntity);
        this.terrain = new Terrain(terrainEntity, {
            size: this.attributes.size,
        });
    }
    _createEndZone() {
        this.endZone.addComponent('model', {
            type: 'box',
        });
        this.endZone.model.material = this.attributes.endzoneMaterial;
        this.endZone.setLocalScale(this.attributes.size.x - 1, 10, 5);
        this.endZone.setLocalPosition(0, 5, (this.attributes.size.y / -2.0) + 3);
        this.entity.addChild(this.endZone);
    }
    isCompleted() {
        return true;
    }
    onComplete() {
    }
}
exports.Level = Level;
class Stage extends GameObject_1.default {
    constructor(entity, orbitCamera, attributes = {}) {
        super();
        this.levels = [];
        this.currentOffset = new pc.Vec2(0, 0);
        this.levelParent = new pc.Entity();
        super.setAttributes({
            levelCount: 3,
        }, attributes);
        entity.addChild(this.levelParent);
        this.createNextLevel();
    }
    createNextLevel() {
        const attributes = {
            offset: this.currentOffset,
        };
        if (this.levels.length > 0) {
        }
        const level = new Level(this.levelParent, attributes);
        setTimeout(() => this.orbitCam.focus(level.entity, true), 500);
        this.levels.push(level);
        this.currentOffset.y -= 43;
        if (this.levels.length < this.attributes.levelCount) {
            level.onComplete = () => this.createNextLevel();
        }
    }
}
exports.Stage = Stage;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

/*
 * A speed-improved perlin and simplex noise algorithms for 2D.
 *
 * Based on example code by Stefan Gustavson (stegu@itn.liu.se).
 * Optimisations by Peter Eastman (peastman@drizzle.stanford.edu).
 * Better rank ordering method by Stefan Gustavson in 2012.
 * Converted to Javascript by Joseph Gentle.
 *
 * Version 2012-03-09
 *
 * This code was placed in the public domain by its original author,
 * Stefan Gustavson. You may use it as you see fit, but
 * attribution is appreciated.
 *
 */

(function(global){

  // Passing in seed will seed this Noise instance
  function Noise(seed) {
    function Grad(x, y, z) {
      this.x = x; this.y = y; this.z = z;
    }

    Grad.prototype.dot2 = function(x, y) {
      return this.x*x + this.y*y;
    };

    Grad.prototype.dot3 = function(x, y, z) {
      return this.x*x + this.y*y + this.z*z;
    };

    this.grad3 = [new Grad(1,1,0),new Grad(-1,1,0),new Grad(1,-1,0),new Grad(-1,-1,0),
                 new Grad(1,0,1),new Grad(-1,0,1),new Grad(1,0,-1),new Grad(-1,0,-1),
                 new Grad(0,1,1),new Grad(0,-1,1),new Grad(0,1,-1),new Grad(0,-1,-1)];

    this.p = [151,160,137,91,90,15,
    131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,
    190, 6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,
    88,237,149,56,87,174,20,125,136,171,168, 68,175,74,165,71,134,139,48,27,166,
    77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,
    102,143,54, 65,25,63,161, 1,216,80,73,209,76,132,187,208, 89,18,169,200,196,
    135,130,116,188,159,86,164,100,109,198,173,186, 3,64,52,217,226,250,124,123,
    5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,
    223,183,170,213,119,248,152, 2,44,154,163, 70,221,153,101,155,167, 43,172,9,
    129,22,39,253, 19,98,108,110,79,113,224,232,178,185, 112,104,218,246,97,228,
    251,34,242,193,238,210,144,12,191,179,162,241, 81,51,145,235,249,14,239,107,
    49,192,214, 31,181,199,106,157,184, 84,204,176,115,121,50,45,127, 4,150,254,
    138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180];
    // To remove the need for index wrapping, double the permutation table length
    this.perm = new Array(512);
    this.gradP = new Array(512);

    this.seed(seed || 0);
  }

  // This isn't a very good seeding function, but it works ok. It supports 2^16
  // different seed values. Write something better if you need more seeds.
  Noise.prototype.seed = function(seed) {
    if(seed > 0 && seed < 1) {
      // Scale the seed out
      seed *= 65536;
    }

    seed = Math.floor(seed);
    if(seed < 256) {
      seed |= seed << 8;
    }

    var p = this.p;
    for(var i = 0; i < 256; i++) {
      var v;
      if (i & 1) {
        v = p[i] ^ (seed & 255);
      } else {
        v = p[i] ^ ((seed>>8) & 255);
      }

      var perm = this.perm;
      var gradP = this.gradP;
      perm[i] = perm[i + 256] = v;
      gradP[i] = gradP[i + 256] = this.grad3[v % 12];
    }
  };

  /*
  for(var i=0; i<256; i++) {
    perm[i] = perm[i + 256] = p[i];
    gradP[i] = gradP[i + 256] = grad3[perm[i] % 12];
  }*/

  // Skewing and unskewing factors for 2, 3, and 4 dimensions
  var F2 = 0.5*(Math.sqrt(3)-1);
  var G2 = (3-Math.sqrt(3))/6;

  var F3 = 1/3;
  var G3 = 1/6;

  // 2D simplex noise
  Noise.prototype.simplex2 = function(xin, yin) {
    var n0, n1, n2; // Noise contributions from the three corners
    // Skew the input space to determine which simplex cell we're in
    var s = (xin+yin)*F2; // Hairy factor for 2D
    var i = Math.floor(xin+s);
    var j = Math.floor(yin+s);
    var t = (i+j)*G2;
    var x0 = xin-i+t; // The x,y distances from the cell origin, unskewed.
    var y0 = yin-j+t;
    // For the 2D case, the simplex shape is an equilateral triangle.
    // Determine which simplex we are in.
    var i1, j1; // Offsets for second (middle) corner of simplex in (i,j) coords
    if(x0>y0) { // lower triangle, XY order: (0,0)->(1,0)->(1,1)
      i1=1; j1=0;
    } else {    // upper triangle, YX order: (0,0)->(0,1)->(1,1)
      i1=0; j1=1;
    }
    // A step of (1,0) in (i,j) means a step of (1-c,-c) in (x,y), and
    // a step of (0,1) in (i,j) means a step of (-c,1-c) in (x,y), where
    // c = (3-sqrt(3))/6
    var x1 = x0 - i1 + G2; // Offsets for middle corner in (x,y) unskewed coords
    var y1 = y0 - j1 + G2;
    var x2 = x0 - 1 + 2 * G2; // Offsets for last corner in (x,y) unskewed coords
    var y2 = y0 - 1 + 2 * G2;
    // Work out the hashed gradient indices of the three simplex corners
    i &= 255;
    j &= 255;

    var perm = this.perm;
    var gradP = this.gradP;
    var gi0 = gradP[i+perm[j]];
    var gi1 = gradP[i+i1+perm[j+j1]];
    var gi2 = gradP[i+1+perm[j+1]];
    // Calculate the contribution from the three corners
    var t0 = 0.5 - x0*x0-y0*y0;
    if(t0<0) {
      n0 = 0;
    } else {
      t0 *= t0;
      n0 = t0 * t0 * gi0.dot2(x0, y0);  // (x,y) of grad3 used for 2D gradient
    }
    var t1 = 0.5 - x1*x1-y1*y1;
    if(t1<0) {
      n1 = 0;
    } else {
      t1 *= t1;
      n1 = t1 * t1 * gi1.dot2(x1, y1);
    }
    var t2 = 0.5 - x2*x2-y2*y2;
    if(t2<0) {
      n2 = 0;
    } else {
      t2 *= t2;
      n2 = t2 * t2 * gi2.dot2(x2, y2);
    }
    // Add contributions from each corner to get the final noise value.
    // The result is scaled to return values in the interval [-1,1].
    return 70 * (n0 + n1 + n2);
  };

  // 3D simplex noise
  Noise.prototype.simplex3 = function(xin, yin, zin) {
    var n0, n1, n2, n3; // Noise contributions from the four corners

    // Skew the input space to determine which simplex cell we're in
    var s = (xin+yin+zin)*F3; // Hairy factor for 2D
    var i = Math.floor(xin+s);
    var j = Math.floor(yin+s);
    var k = Math.floor(zin+s);

    var t = (i+j+k)*G3;
    var x0 = xin-i+t; // The x,y distances from the cell origin, unskewed.
    var y0 = yin-j+t;
    var z0 = zin-k+t;

    // For the 3D case, the simplex shape is a slightly irregular tetrahedron.
    // Determine which simplex we are in.
    var i1, j1, k1; // Offsets for second corner of simplex in (i,j,k) coords
    var i2, j2, k2; // Offsets for third corner of simplex in (i,j,k) coords
    if(x0 >= y0) {
      if(y0 >= z0)      { i1=1; j1=0; k1=0; i2=1; j2=1; k2=0; }
      else if(x0 >= z0) { i1=1; j1=0; k1=0; i2=1; j2=0; k2=1; }
      else              { i1=0; j1=0; k1=1; i2=1; j2=0; k2=1; }
    } else {
      if(y0 < z0)      { i1=0; j1=0; k1=1; i2=0; j2=1; k2=1; }
      else if(x0 < z0) { i1=0; j1=1; k1=0; i2=0; j2=1; k2=1; }
      else             { i1=0; j1=1; k1=0; i2=1; j2=1; k2=0; }
    }
    // A step of (1,0,0) in (i,j,k) means a step of (1-c,-c,-c) in (x,y,z),
    // a step of (0,1,0) in (i,j,k) means a step of (-c,1-c,-c) in (x,y,z), and
    // a step of (0,0,1) in (i,j,k) means a step of (-c,-c,1-c) in (x,y,z), where
    // c = 1/6.
    var x1 = x0 - i1 + G3; // Offsets for second corner
    var y1 = y0 - j1 + G3;
    var z1 = z0 - k1 + G3;

    var x2 = x0 - i2 + 2 * G3; // Offsets for third corner
    var y2 = y0 - j2 + 2 * G3;
    var z2 = z0 - k2 + 2 * G3;

    var x3 = x0 - 1 + 3 * G3; // Offsets for fourth corner
    var y3 = y0 - 1 + 3 * G3;
    var z3 = z0 - 1 + 3 * G3;

    // Work out the hashed gradient indices of the four simplex corners
    i &= 255;
    j &= 255;
    k &= 255;

    var perm = this.perm;
    var gradP = this.gradP;
    var gi0 = gradP[i+   perm[j+   perm[k   ]]];
    var gi1 = gradP[i+i1+perm[j+j1+perm[k+k1]]];
    var gi2 = gradP[i+i2+perm[j+j2+perm[k+k2]]];
    var gi3 = gradP[i+ 1+perm[j+ 1+perm[k+ 1]]];

    // Calculate the contribution from the four corners
    var t0 = 0.5 - x0*x0-y0*y0-z0*z0;
    if(t0<0) {
      n0 = 0;
    } else {
      t0 *= t0;
      n0 = t0 * t0 * gi0.dot3(x0, y0, z0);  // (x,y) of grad3 used for 2D gradient
    }
    var t1 = 0.5 - x1*x1-y1*y1-z1*z1;
    if(t1<0) {
      n1 = 0;
    } else {
      t1 *= t1;
      n1 = t1 * t1 * gi1.dot3(x1, y1, z1);
    }
    var t2 = 0.5 - x2*x2-y2*y2-z2*z2;
    if(t2<0) {
      n2 = 0;
    } else {
      t2 *= t2;
      n2 = t2 * t2 * gi2.dot3(x2, y2, z2);
    }
    var t3 = 0.5 - x3*x3-y3*y3-z3*z3;
    if(t3<0) {
      n3 = 0;
    } else {
      t3 *= t3;
      n3 = t3 * t3 * gi3.dot3(x3, y3, z3);
    }
    // Add contributions from each corner to get the final noise value.
    // The result is scaled to return values in the interval [-1,1].
    return 32 * (n0 + n1 + n2 + n3);

  };

  // ##### Perlin noise stuff

  function fade(t) {
    return t*t*t*(t*(t*6-15)+10);
  }

  function lerp(a, b, t) {
    return (1-t)*a + t*b;
  }

  // 2D Perlin Noise
  Noise.prototype.perlin2 = function(x, y) {
    // Find unit grid cell containing point
    var X = Math.floor(x), Y = Math.floor(y);
    // Get relative xy coordinates of point within that cell
    x = x - X; y = y - Y;
    // Wrap the integer cells at 255 (smaller integer period can be introduced here)
    X = X & 255; Y = Y & 255;

    // Calculate noise contributions from each of the four corners
    var perm = this.perm;
    var gradP = this.gradP;
    var n00 = gradP[X+perm[Y]].dot2(x, y);
    var n01 = gradP[X+perm[Y+1]].dot2(x, y-1);
    var n10 = gradP[X+1+perm[Y]].dot2(x-1, y);
    var n11 = gradP[X+1+perm[Y+1]].dot2(x-1, y-1);

    // Compute the fade curve value for x
    var u = fade(x);

    // Interpolate the four results
    return lerp(
        lerp(n00, n10, u),
        lerp(n01, n11, u),
       fade(y));
  };

  // 3D Perlin Noise
  Noise.prototype.perlin3 = function(x, y, z) {
    // Find unit grid cell containing point
    var X = Math.floor(x), Y = Math.floor(y), Z = Math.floor(z);
    // Get relative xyz coordinates of point within that cell
    x = x - X; y = y - Y; z = z - Z;
    // Wrap the integer cells at 255 (smaller integer period can be introduced here)
    X = X & 255; Y = Y & 255; Z = Z & 255;

    // Calculate noise contributions from each of the eight corners
    var perm = this.perm;
    var gradP = this.gradP;
    var n000 = gradP[X+  perm[Y+  perm[Z  ]]].dot3(x,   y,     z);
    var n001 = gradP[X+  perm[Y+  perm[Z+1]]].dot3(x,   y,   z-1);
    var n010 = gradP[X+  perm[Y+1+perm[Z  ]]].dot3(x,   y-1,   z);
    var n011 = gradP[X+  perm[Y+1+perm[Z+1]]].dot3(x,   y-1, z-1);
    var n100 = gradP[X+1+perm[Y+  perm[Z  ]]].dot3(x-1,   y,   z);
    var n101 = gradP[X+1+perm[Y+  perm[Z+1]]].dot3(x-1,   y, z-1);
    var n110 = gradP[X+1+perm[Y+1+perm[Z  ]]].dot3(x-1, y-1,   z);
    var n111 = gradP[X+1+perm[Y+1+perm[Z+1]]].dot3(x-1, y-1, z-1);

    // Compute the fade curve value for x, y, z
    var u = fade(x);
    var v = fade(y);
    var w = fade(z);

    // Interpolate
    return lerp(
        lerp(
          lerp(n000, n100, u),
          lerp(n001, n101, u), w),
        lerp(
          lerp(n010, n110, u),
          lerp(n011, n111, u), w),
       v);
  };

  global.Noise = Noise;

})( false ? this : module.exports);


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// javascript-astar 0.4.1
// http://github.com/bgrins/javascript-astar
// Freely distributable under the MIT License.
// Implements the astar search algorithm in javascript using a Binary Heap.
// Includes Binary Heap (with modifications) from Marijn Haverbeke.
// http://eloquentjavascript.net/appendix2.html

(function(definition) {
    /* global module, define */
    if(typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = definition();
    } else if(true) {
        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (definition),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    } else {
        var exports = definition();
        window.astar = exports.astar;
        window.Graph = exports.Graph;
    }
})(function() {

function pathTo(node){
    var curr = node,
        path = [];
    while(curr.parent) {
        path.unshift(curr);
        curr = curr.parent;
    }
    return path;
}

function getHeap() {
    return new BinaryHeap(function(node) {
        return node.f;
    });
}

var astar = {
    /**
    * Perform an A* Search on a graph given a start and end node.
    * @param {Graph} graph
    * @param {GridNode} start
    * @param {GridNode} end
    * @param {Object} [options]
    * @param {bool} [options.closest] Specifies whether to return the
               path to the closest node if the target is unreachable.
    * @param {Function} [options.heuristic] Heuristic function (see
    *          astar.heuristics).
    */
    search: function(graph, start, end, options) {
        graph.cleanDirty();
        options = options || {};
        var heuristic = options.heuristic || astar.heuristics.manhattan,
            closest = options.closest || false;

        var openHeap = getHeap(),
            closestNode = start; // set the start node to be the closest if required

        start.h = heuristic(start, end);

        openHeap.push(start);

        while(openHeap.size() > 0) {

            // Grab the lowest f(x) to process next.  Heap keeps this sorted for us.
            var currentNode = openHeap.pop();

            // End case -- result has been found, return the traced path.
            if(currentNode === end) {
                return pathTo(currentNode);
            }

            // Normal case -- move currentNode from open to closed, process each of its neighbors.
            currentNode.closed = true;

            // Find all neighbors for the current node.
            var neighbors = graph.neighbors(currentNode);

            for (var i = 0, il = neighbors.length; i < il; ++i) {
                var neighbor = neighbors[i];

                if (neighbor.closed || neighbor.isWall()) {
                    // Not a valid node to process, skip to next neighbor.
                    continue;
                }

                // The g score is the shortest distance from start to current node.
                // We need to check if the path we have arrived at this neighbor is the shortest one we have seen yet.
                var gScore = currentNode.g + neighbor.getCost(currentNode),
                    beenVisited = neighbor.visited;

                if (!beenVisited || gScore < neighbor.g) {

                    // Found an optimal (so far) path to this node.  Take score for node to see how good it is.
                    neighbor.visited = true;
                    neighbor.parent = currentNode;
                    neighbor.h = neighbor.h || heuristic(neighbor, end);
                    neighbor.g = gScore;
                    neighbor.f = neighbor.g + neighbor.h;
                    graph.markDirty(neighbor);
                    if (closest) {
                        // If the neighbour is closer than the current closestNode or if it's equally close but has
                        // a cheaper path than the current closest node then it becomes the closest node
                        if (neighbor.h < closestNode.h || (neighbor.h === closestNode.h && neighbor.g < closestNode.g)) {
                            closestNode = neighbor;
                        }
                    }

                    if (!beenVisited) {
                        // Pushing to heap will put it in proper place based on the 'f' value.
                        openHeap.push(neighbor);
                    }
                    else {
                        // Already seen the node, but since it has been rescored we need to reorder it in the heap
                        openHeap.rescoreElement(neighbor);
                    }
                }
            }
        }

        if (closest) {
            return pathTo(closestNode);
        }

        // No result was found - empty array signifies failure to find path.
        return [];
    },
    // See list of heuristics: http://theory.stanford.edu/~amitp/GameProgramming/Heuristics.html
    heuristics: {
        manhattan: function(pos0, pos1) {
            var d1 = Math.abs(pos1.x - pos0.x);
            var d2 = Math.abs(pos1.y - pos0.y);
            return d1 + d2;
        },
        diagonal: function(pos0, pos1) {
            var D = 1;
            var D2 = Math.sqrt(2);
            var d1 = Math.abs(pos1.x - pos0.x);
            var d2 = Math.abs(pos1.y - pos0.y);
            return (D * (d1 + d2)) + ((D2 - (2 * D)) * Math.min(d1, d2));
        }
    },
    cleanNode:function(node){
        node.f = 0;
        node.g = 0;
        node.h = 0;
        node.visited = false;
        node.closed = false;
        node.parent = null;
    }
};

/**
* A graph memory structure
* @param {Array} gridIn 2D array of input weights
* @param {Object} [options]
* @param {bool} [options.diagonal] Specifies whether diagonal moves are allowed
*/
function Graph(gridIn, options) {
    options = options || {};
    this.nodes = [];
    this.diagonal = !!options.diagonal;
    this.grid = [];
    for (var x = 0; x < gridIn.length; x++) {
        this.grid[x] = [];

        for (var y = 0, row = gridIn[x]; y < row.length; y++) {
            var node = new GridNode(x, y, row[y]);
            this.grid[x][y] = node;
            this.nodes.push(node);
        }
    }
    this.init();
}

Graph.prototype.init = function() {
    this.dirtyNodes = [];
    for (var i = 0; i < this.nodes.length; i++) {
        astar.cleanNode(this.nodes[i]);
    }
};

Graph.prototype.cleanDirty = function() {
    for (var i = 0; i < this.dirtyNodes.length; i++) {
        astar.cleanNode(this.dirtyNodes[i]);
    }
    this.dirtyNodes = [];
};

Graph.prototype.markDirty = function(node) {
    this.dirtyNodes.push(node);
};

Graph.prototype.neighbors = function(node) {
    var ret = [],
        x = node.x,
        y = node.y,
        grid = this.grid;

    // West
    if(grid[x-1] && grid[x-1][y]) {
        ret.push(grid[x-1][y]);
    }

    // East
    if(grid[x+1] && grid[x+1][y]) {
        ret.push(grid[x+1][y]);
    }

    // South
    if(grid[x] && grid[x][y-1]) {
        ret.push(grid[x][y-1]);
    }

    // North
    if(grid[x] && grid[x][y+1]) {
        ret.push(grid[x][y+1]);
    }

    if (this.diagonal) {
        // Southwest
        if(grid[x-1] && grid[x-1][y-1]) {
            ret.push(grid[x-1][y-1]);
        }

        // Southeast
        if(grid[x+1] && grid[x+1][y-1]) {
            ret.push(grid[x+1][y-1]);
        }

        // Northwest
        if(grid[x-1] && grid[x-1][y+1]) {
            ret.push(grid[x-1][y+1]);
        }

        // Northeast
        if(grid[x+1] && grid[x+1][y+1]) {
            ret.push(grid[x+1][y+1]);
        }
    }

    return ret;
};

Graph.prototype.toString = function() {
    var graphString = [],
        nodes = this.grid, // when using grid
        rowDebug, row, y, l;
    for (var x = 0, len = nodes.length; x < len; x++) {
        rowDebug = [];
        row = nodes[x];
        for (y = 0, l = row.length; y < l; y++) {
            rowDebug.push(row[y].weight);
        }
        graphString.push(rowDebug.join(" "));
    }
    return graphString.join("\n");
};

function GridNode(x, y, weight) {
    this.x = x;
    this.y = y;
    this.weight = weight;
}

GridNode.prototype.toString = function() {
    return "[" + this.x + " " + this.y + "]";
};

GridNode.prototype.getCost = function(fromNeighbor) {
    // Take diagonal weight into consideration.
    if (fromNeighbor && fromNeighbor.x != this.x && fromNeighbor.y != this.y) {
        return this.weight * 1.41421;
    }
    return this.weight;
};

GridNode.prototype.isWall = function() {
    return this.weight === 0;
};

function BinaryHeap(scoreFunction){
    this.content = [];
    this.scoreFunction = scoreFunction;
}

BinaryHeap.prototype = {
    push: function(element) {
        // Add the new element to the end of the array.
        this.content.push(element);

        // Allow it to sink down.
        this.sinkDown(this.content.length - 1);
    },
    pop: function() {
        // Store the first element so we can return it later.
        var result = this.content[0];
        // Get the element at the end of the array.
        var end = this.content.pop();
        // If there are any elements left, put the end element at the
        // start, and let it bubble up.
        if (this.content.length > 0) {
            this.content[0] = end;
            this.bubbleUp(0);
        }
        return result;
    },
    remove: function(node) {
        var i = this.content.indexOf(node);

        // When it is found, the process seen in 'pop' is repeated
        // to fill up the hole.
        var end = this.content.pop();

        if (i !== this.content.length - 1) {
            this.content[i] = end;

            if (this.scoreFunction(end) < this.scoreFunction(node)) {
                this.sinkDown(i);
            }
            else {
                this.bubbleUp(i);
            }
        }
    },
    size: function() {
        return this.content.length;
    },
    rescoreElement: function(node) {
        this.sinkDown(this.content.indexOf(node));
    },
    sinkDown: function(n) {
        // Fetch the element that has to be sunk.
        var element = this.content[n];

        // When at 0, an element can not sink any further.
        while (n > 0) {

            // Compute the parent element's index, and fetch it.
            var parentN = ((n + 1) >> 1) - 1,
                parent = this.content[parentN];
            // Swap the elements if the parent is greater.
            if (this.scoreFunction(element) < this.scoreFunction(parent)) {
                this.content[parentN] = element;
                this.content[n] = parent;
                // Update 'n' to continue at the new position.
                n = parentN;
            }
            // Found a parent that is less, no need to sink any further.
            else {
                break;
            }
        }
    },
    bubbleUp: function(n) {
        // Look up the target element and its score.
        var length = this.content.length,
            element = this.content[n],
            elemScore = this.scoreFunction(element);

        while(true) {
            // Compute the indices of the child elements.
            var child2N = (n + 1) << 1,
                child1N = child2N - 1;
            // This is used to store the new position of the element, if any.
            var swap = null,
                child1Score;
            // If the first child exists (is inside the array)...
            if (child1N < length) {
                // Look it up and compute its score.
                var child1 = this.content[child1N];
                child1Score = this.scoreFunction(child1);

                // If the score is less than our element's, we need to swap.
                if (child1Score < elemScore){
                    swap = child1N;
                }
            }

            // Do the same checks for the other child.
            if (child2N < length) {
                var child2 = this.content[child2N],
                    child2Score = this.scoreFunction(child2);
                if (child2Score < (swap === null ? elemScore : child1Score)) {
                    swap = child2N;
                }
            }

            // If the element needs to be moved, swap it, and continue.
            if (swap !== null) {
                this.content[n] = this.content[swap];
                this.content[swap] = element;
                n = swap;
            }
            // Otherwise, we are done.
            else {
                break;
            }
        }
    }
};

return {
    astar: astar,
    Graph: Graph
};

});


/***/ })
/******/ ]);