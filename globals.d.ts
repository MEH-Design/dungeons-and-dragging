/* tslint:disable */
declare interface ResourceRequest { }
declare interface VRFrameData { }
declare module pc {
  interface AudioManager { }
  interface ResolutionMode { }
  interface LightComponentSystem { }
  interface ProgramLibrary { }
  interface MOUSEBUTTON { }
  interface ResourceHandler { }
  interface CLEARFLAG { }
  class Node {
    constructor();
  }
  class Animation {
    constructor();
    private getDuration(): number;
    private getName(): string;
    getNode(name: string): pc.Node;
    nodes: pc.Node[];
    private getNodes(): pc.Node[];
    private setDuration(duration: number): void;
    private setName(name: string): void;
    addNode(node: pc.Node): void;
  }
  class Skeleton {
    constructor(graph: pc.GraphNode);
    addTime(delta: number): void;
    blend(skel1: pc.Skeleton, skel2: pc.Skeleton, alpha: number): void;
    animation: pc.Animation;
    private getAnimation(): pc.Animation;
    currentTime: number;
    private getCurrentTime(): number;
    private setCurrentTime(time: number): void;
    numNodes: number;
    private getNumNodes(): number;
    private setAnimation(animation: pc.Animation): void;
    setGraph(graph: pc.GraphNode): void;
    updateGraph(): void;
    private setLooping(looping: Boolean): void;
    private getLooping(): Boolean;
  }
  class AssetRegistry {
    constructor(loader: pc.ResourceLoader);
    list(filters: Object): pc.Asset[];
    add(asset: pc.Asset): void;
    remove(asset: pc.Asset): void;
    get(id: number): pc.Asset;
    getByUrl(url: string): pc.Asset;
    load(asset: pc.Asset): void;
    loadFromUrl(url: string, type: string, callback: ((err: Error, asset: pc.Asset) => void)): void;
    findAll(name: string, type?: string): pc.Asset[];
    findByTag(tag: string): pc.Asset[];
    filter(callback: (() => any)): pc.Asset[];
    find(name: string, type?: string): pc.Asset;
  }
  class Asset {
    constructor(name: string, type: string, file: Object, data?: Object);
    getFileUrl(): string;
    ready(callback: (() => any)): void;
    unload(): void;
    resource: any;
  }
  class Channel {
    constructor(manager: pc.AudioManager, sound: pc.Sound, options: {
      volume: number,
      pitch: number,
      loop: Boolean
    });
    private play(): void;
    private pause(): void;
    private unpause(): void;
    private stop(): void;
    private setLoop(): void;
    private setVolume(): void;
    private getVolume(): void;
    private getLoop(): void;
    private getPitch(): void;
    private onManagerVolumeChange(): void;
    private onManagerSuspend(): void;
    private onManagerResume(): void;
  }
  class Color {
    constructor(r: number, g: number, b: number, a?: number);
    clone(): pc.Color;
    copy(rhs: pc.Color): pc.Color;
    set(r: number, g: number, b: number, a?: number): pc.Color;
    fromstring(hex: string): pc.Color;
    tostring(): string;
  }
  const config: any;
  const apps: any;
  const data: any;
  function makeArray(arr: Object): Array<Object>;
  function type(obj: Object): string;
  function extend(target: Object, ex: Object): Object;
  function isDefined(o: Object): Boolean;
  function _typeLookup(): void;
  module debug {
    const display: any;
  }
  module events {
    function attach(target: Object): Object;
    function on(name: string, callback: (() => any), scope?: Object): void;
    function off(name: string, callback?: (() => any), scope?: Object): void;
    function fire(name: Object): void;
    function hasEvent(name: string): void;
  }
  module guid {
    function create(): string;
  }
  function inherits(Self: (() => any), Super: (() => any)): (() => any);
  module path {
    const delimiter: any;
    function join(one: string, two: string): void;
    function split(): void;
    function getBasename(): string;
    function getDirectory(path: string): void;
  }
  module string {
    const ASCII_LOWERCASE: string;
    const ASCII_UPPERCASE: string;
    const ASCII_LETTERS: string;
    function format(s: string, arguments?: Object): string;
    function startsWith(s: string, subs: string): Boolean;
    function endsWith(s: string, subs: string): Boolean;
    function toBool(s: string, strict?: Boolean): Boolean;
  }
  class Tags {
    constructor(parent?: Object);
    add(name: string): Boolean;
    remove(name: string): Boolean;
    clear(): void;
    has(name: string): Boolean;
    list(): string[];
    size: number;
  }
  class Timer {
    constructor();
    private start(): void;
    private stop(): void;
    private getMilliseconds(): void;
  }
  function now(): number;
  function createURI(options: {
    scheme: string,
    authority: string,
    host: string,
    path: string,
    hostpath: string,
    query: string,
    fragment: string
  }): string;
  class URI {
    constructor(uri: string);
    scheme: any;
    authority: any;
    path: any;
    query: any;
    fragment: any;
    tostring(): void;
    getQuery(): void;
    setQuery(params: Object): void;
  }
  interface ApplicationOptions {
    keyboard?: pc.Keyboard,
    mouse?: pc.Mouse,
    touch?: pc.TouchDevice,
    gamepads?: pc.GamePads,
    scriptPrefix?: string,
    assetPrefix?: string,
    graphicsDeviceOptions?: Object
  }
  class Application {
    constructor(canvas: Element, options: ApplicationOptions);
    scene: pc.Scene;
    timeScale: number;
    assets: pc.AssetRegistry;
    graphicsDevice: pc.GraphicsDevice;
    systems: pc.ComponentSystem;
    loader: pc.ResourceLoader;
    root: pc.Entity;
    keyboard: pc.Keyboard;
    mouse: pc.Mouse;
    touch: pc.TouchDevice;
    gamepads: pc.GamePads;
    scripts: pc.ScriptRegistry;
    configure(url: string, callback: (() => any)): void;
    preload(callback: (() => any)): void;
    loadSceneHierarchy(url: string, callback: (() => any)): void;
    loadSceneSettings(url: string, callback: (() => any)): void;
    start(): void;
    update(dt: number): void;
    render(): void;
    setCanvasFillMode(mode: string, width?: number, height?: number): void;
    setCanvasResolution(mode: pc.ResolutionMode, width?: number, height?: number): void;
    isFullscreen(): Boolean;
    enableFullscreen(element?: Element, success?: (() => any), error?: (() => any)): void;
    disableFullscreen(success?: (() => any)): void;
    isHidden(): Boolean;
    private onVisibilityChange(): void;
    resizeCanvas(width?: number, height?: number): Object;
    private onLibrariesLoaded: any;
    destroy(): void;
    on(event: string, callback: (dt: number) => void): void;
    renderLine(start: pc.Vec3, end: pc.Vec3, color: pc.Color): void;
    renderLine(start: pc.Vec3, end: pc.Vec3, startColor: pc.Color, endColor: pc.Color): void;
    renderLine(start: pc.Vec3, end: pc.Vec3, color: pc.Color, lineType: number): void;
    renderLine(start: pc.Vec3, end: pc.Vec3, startColor: pc.Color, endColor: pc.Color, lineType: number): void;
    renderLines(position: pc.Vec3[], color: pc.Color[], lineType?: number): void;
    static getApplication(): pc.Application;
  }
  const FILLMODE_NONE: string
  const FILLMODE_FILL_WINDOW: string
  const FILLMODE_KEEP_ASPECT: string
  const RESOLUTION_AUTO: string
  const RESOLUTION_FIXED: string
  class AnimationComponent extends pc.Component {
    constructor(system: pc.AnimationComponentSystem, entity: pc.Entity);
    play(name: string, blendTime?: number): void;
    getAnimation(name: string): pc.Animation;
  }
  class AnimationComponentSystem extends pc.ComponentSystem {
    constructor(app: pc.Application);
  }
  class AudioListenerComponent extends pc.Component {
    constructor(system: pc.AudioListenerComponentSystem, entity: pc.Entity);
  }
  class AudioListenerComponentSystem extends pc.ComponentSystem {
    constructor();
  }
  class AudioSourceComponent extends pc.Component {
    constructor(system: pc.AudioSourceComponentSystem, entity: pc.Entity);
    play(name: string): void;
    pause(): void;
    unpause(): void;
    stop(): void;
  }
  class AudioSourceComponentData {
    constructor();
  }
  class AudioSourceComponentSystem extends pc.ComponentSystem {
    constructor(app: pc.Application, manager: pc.SoundManager);
    setVolume(value: number): void;
  }
  class CameraComponent extends pc.Component {
    constructor(system: pc.CameraComponentSystem, entity: pc.Entity);
    projectionMatrix: pc.Mat4;
    viewMatrix: pc.Mat4;
    frustum: pc.Frustum;
    vrDisplay: pc.VrDisplay;
    screenToWorld(screenx: number, screeny: number, cameraz: number, worldCoord?: pc.Vec3): pc.Vec3;
    worldToScreen(worldCoord: pc.Vec3, screenCoord?: pc.Vec3): pc.Vec3;
    private frameBegin(): void;
    private frameEnd(): void;
    enterVr(display?: pc.VrDisplay, callback?: (() => any)): void;
    exitVr(callback: (() => any)): void;
  }
  class CameraComponentData extends pc.ComponentData {
    constructor();
  }
  class PostEffectQueue {
    constructor(app: pc.Application, camera: pc.CameraComponent);
    private _createOffscreenTarget(useDepth: Boolean, hdr: Boolean): pc.RenderTarget;
    addEffect(effect: pc.PostEffect): void;
    removeEffect(effect: pc.PostEffect): void;
    destroy(): void;
    enable(): void;
    disable(): void;
  }
  class CameraComponentSystem extends pc.ComponentSystem {
    constructor(app: pc.Application);
  }
  class CollisionComponent extends pc.Component {
    constructor(system: pc.CollisionComponentSystem, entity: pc.Entity);
  }
  class CollisionComponentSystem extends pc.ComponentSystem {
    constructor(app: pc.Application);
    model: pc.Model;
  }
  class Trigger {
    constructor(app: pc.Application, component: pc.Component, data: pc.ComponentData);
  }
  class Component {
    constructor(system: pc.ComponentSystem, entity: pc.Entity);
    private data: pc.ComponentData;
  }
  class ComponentData {
    constructor();
  }
  class ElementComponentSystem extends pc.ComponentSystem {
    constructor(app: pc.Application);
  }
  class LightComponent extends pc.Component {
    constructor(system: pc.LightComponentSystem, entity: pc.Entity);
  }
  class ModelComponent extends pc.Component {
    constructor(system: pc.ModelComponentSystem, entity: pc.Entity);
    private onSetType(): void;
    hide(): void;
    show(): void;
  }
  class ModelComponentData extends pc.ComponentData {
    constructor();
  }
  class ModelComponentSystem extends pc.ComponentSystem {
    constructor(app: pc.Application);
  }
  class ParticleSystemComponent extends pc.Component {
    constructor(system: pc.ParticleSystemComponent, entity: pc.Entity);
    reset(): void;
    stop(): void;
    pause(): void;
    unpause(): void;
    play(): void;
    isPlaying(): void;
    private rebuild(): void;
  }
  class ParticleSystemComponentSystem extends pc.ComponentSystem {
    constructor(app: pc.Application);
  }
  class ComponentSystemRegistry {
    constructor();
    private add(name: Object, component: Object): void;
    private remove(name: Object): void;
    private list(): pc.ComponentSystem[];
  }
  class RigidBodyComponent extends pc.Component {
    constructor(system: pc.RigidBodyComponentSystem, entity: pc.Entity);
    private createBody(): void;
    isActive(): Boolean;
    activate(): void;
    applyForce(force: pc.Vec3, relativePoint?: pc.Vec3): void;
    applyForce(x: number, y: number, z: number, px?: number, py?: number, pz?: number): void;
    applyTorque(force: pc.Vec3): void;
    applyTorque(x: number, y: number, z: number): void;
    applyImpulse(impulse: pc.Vec3, relativePoint?: pc.Vec3): void;
    applyImpulse(x: number, y: number, z: number, px?: number, py?: number, pz?: number): void;
    applyTorqueImpulse(torqueImpulse: pc.Vec3): void;
    applyTorqueImpulse(x: number, y: number, z: number): void;
    isStatic(): Boolean;
    isStaticOrKinematic(): Boolean;
    isKinematic(): Boolean;
    private syncEntityToBody(): void;
    private syncBodyToEntity(): void;
    teleport(x?: number, y?: number, z?: number): void;
    teleport(position: pc.Vec3, angles?: pc.Vec3): void;
    teleport(position: pc.Vec3, rotation?: pc.Quat): void;
    private _updateKinematic(): void;
  }
  class RigidBodyComponentData extends pc.ComponentData {
    constructor();
  }
  class RaycastResult {
    entity: pc.Entity;
    constructor(entity: pc.Entity, point: pc.Vec3, normal: pc.Vec3);
  }
  class SingleContactResult {
    constructor(a: pc.Entity, b: pc.Entity, contactPoint: pc.ContactPoint);
  }
  class ContactPoint {
    constructor(localPoint: pc.Vec3, localPointOther: pc.Vec3, point: pc.Vec3, pointOther: pc.Vec3, normal: pc.Vec3);
  }
  class ContactResult {
    constructor(other: pc.Entity, contacts: pc.ContactPoint[]);
  }
  class RigidBodyComponentSystem extends pc.ComponentSystem {
    constructor(app: pc.Application);
    setGravity(gravity: pc.Vec3): void;
    setGravity(x: number, y: number, z: number): void;
    raycastFirst(start: pc.Vec3, end: pc.Vec3): pc.RaycastResult;
    private _storeCollision(entity: pc.Entity, other: pc.Entity): void;
    private _cleanOldCollisions(): void;
    private raycast: any;
  }
  class ScreenComponentSystem extends pc.ComponentSystem {
    constructor(app: pc.Application);
  }
  class ScriptComponent extends pc.Component {
    constructor(system: pc.ScriptComponentSystem, entity: pc.Entity);
    has(name: string): Boolean;
    create(name: string, args?: {
      enabled: Boolean,
      attributes: Object
    }): ScriptType;
    destroy(name: string): Boolean;
    move(name: string, ind: number): Boolean;
  }
  class ScriptComponentSystem extends pc.ComponentSystem {
    constructor(app: pc.Application);
  }
  class SoundComponent extends pc.Component {
    constructor(system: pc.SoundComponentSystem, entity: pc.Entity);
    addSlot(name: string, options: {
      volume: number,
      pitch: number,
      loop: Boolean,
      startTime: number,
      duration: number,
      overlap: Boolean,
      autoPlay: Boolean,
      asset: number
    }): pc.SoundSlot;
    removeSlot(name: string): void;
    slot(name: string): pc.SoundSlot;
    play(name: string): pc.SoundInstance;
    pause(name?: string): void;
    resume(name: string): void;
    stop(name: string): void;
  }
  const DISTANCE_LINEAR: string;
  const DISTANCE_INVERSE: string;
  const DISTANCE_EXPONENTIAL: string;
  class SoundComponentData {
    constructor();
  }
  class SoundSlot {
    constructor(component: pc.SoundComponent, name: string, options: {
      volume: number,
      pitch: number,
      loop: Boolean,
      startTime: number,
      duration: number,
      overlap: Boolean,
      autoPlay: Boolean,
      asset: number
    });
    play(): pc.SoundInstance;
    pause(): void;
    resume(): Boolean;
    stop(): Boolean;
    load(): void;
    setExternalNodes(firstNode: AudioNode, lastNode?: AudioNode): void;
    clearExternalNodes(): void;
    getExternalNodes(): AudioNode[];
    private _hasAsset(): Boolean;
    private _createInstance(): pc.SoundInstance;
  }
  class SoundComponentSystem extends pc.ComponentSystem {
    constructor(app: pc.Application, manager: pc.SoundManager);
  }
  class ComponentSystem {
    constructor(app: pc.Application);
    private store: Array<Object>;
    private addComponent(entity: pc.Entity, data: Object): pc.Component;
    private removeComponent(entity: pc.Entity): void;
    private cloneComponent(entity: pc.Entity, clone: pc.Entity): void;
    private initializeComponentData(): void;
    rigidbody: pc.RigidBodyComponentSystem;
  }
  class ZoneComponent extends pc.Component {
    constructor(system: pc.ZoneComponentSystem, size: pc.Vec3);
  }
  class ZoneComponentSystem extends pc.ComponentSystem {
    constructor(app: pc.Application);
  }
  class Entity extends pc.GraphNode {
    constructor(name?: string);
    addComponent(type: string, data: Object): pc.Component;
    removeComponent(type: string): void;
    private getGuid(): string;
    private setGuid(guid: string): void;
    private setRequest(request: ResourceRequest): void;
    private getRequest(): ResourceRequest;
    findByGuid(): pc.Entity;
    destroy(): void;
    clone(): pc.Entity;
  }
  module script {
    function create(name: string, callback: (() => any)): void;
    function attribute(name: string, type: string, defaultValue: Object, options: Object): void;
    function createLoadingScreen(callback: (() => any)): void;
  }
  class ApplicationStats {
    constructor();
  }
  class GraphicsDevice {
    constructor(canvas: Object, options?: Object);
    precision: string;
    maxCubeMapSize: number;
    maxTextureSize: number;
    setViewport(x: number, y: number, w: number, h: number): void;
    setScissor(x: number, y: number, w: number, h: number): void;
    private getProgramLibrary(): pc.ProgramLibrary;
    private setProgramLibrary(programLib: pc.ProgramLibrary): void;
    updateBegin(): void;
    updateEnd(): void;
    draw(primitive: {
      type: number,
      base: number,
      count: number,
      indexed: Boolean
    }): void;
    clear(options: {
      color: number[],
      depth: number,
      flags: number
    }): void;
    setRenderTarget(renderTarget: pc.RenderTarget): void;
    getRenderTarget(): pc.RenderTarget;
    getDepthTest(): Boolean;
    setDepthTest(depthTest: Boolean): void;
    getDepthWrite(): Boolean;
    setDepthWrite(writeDepth: Boolean): void;
    setColorWrite(writeRed: Boolean, writeGreen: Boolean, writeBlue: Boolean, writeAlpha: Boolean): void;
    getBlending(): Boolean;
    setBlending(blending: Boolean): void;
    setStencilTest(enable: Boolean): void;
    setStencilFunc(func: number, ref: number, mask: number): void;
    setStencilFuncFront(): void;
    setStencilFuncBack(): void;
    setStencilOperation(fail: number, zfail: number, zpass: number): void;
    setStencilOperationFront(): void;
    setStencilOperationBack(): void;
    setBlendFunction(blendSrc: number, blendDst: number): void;
    setBlendEquation(blendEquation: number): void;
    setCullMode(cullMode: number): void;
    setIndexBuffer(indexBuffer: pc.IndexBuffer): void;
    setVertexBuffer(vertexBuffer: pc.VertexBuffer, stream: number): void;
    setShader(shader: pc.Shader): void;
    private getBoneLimit(): number;
    private setBoneLimit(maxBones: number): void;
    resizeCanvas(): void;
    clearShaderCache(): void;
    width: number;
    height: number;
    maxAnisotropy: number;
  }
  const ADDRESS_REPEAT: number;
  const ADDRESS_CLAMP_TO_EDGE: number;
  const ADDRESS_MIRRORED_REPEAT: number;
  const BLENDMODE_ZERO: string;
  const BLENDMODE_ONE: string;
  const BLENDMODE_SRC_COLOR: string;
  const BLENDMODE_ONE_MINUS_SRC_COLOR: string;
  const BLENDMODE_DST_COLOR: string;
  const BLENDMODE_ONE_MINUS_DST_COLOR: string;
  const BLENDMODE_SRC_ALPHA: string;
  const BLENDMODE_SRC_ALPHA_SATURATE: string;
  const BLENDMODE_ONE_MINUS_SRC_ALPHA: string;
  const BLENDMODE_DST_ALPHA: string;
  const BLENDMODE_ONE_MINUS_DST_ALPHA: string;
  const BLENDEQUATION_ADD: string;
  const BLENDEQUATION_SUBTRACT: string;
  const BLENDEQUATION_REVERSE_SUBTRACT: string;
  const BUFFER_STATIC: string;
  const BUFFER_DYNAMIC: string;
  const BUFFER_STREAM: string;
  const CLEARFLAG_COLOR: string;
  const CLEARFLAG_DEPTH: string;
  const CLEARFLAG_STENCIL: string;
  const CUBEFACE_POSX: string;
  const CUBEFACE_NEGX: string;
  const CUBEFACE_POSY: string;
  const CUBEFACE_NEGY: string;
  const CUBEFACE_POSZ: string;
  const CUBEFACE_NEGZ: string;
  const CULLFACE_NONE: string;
  const CULLFACE_BACK: string;
  const CULLFACE_FRONT: string;
  const CULLFACE_FRONTANDBACK: string;
  const ELEMENTTYPE_INT8: string;
  const ELEMENTTYPE_UINT8: string;
  const ELEMENTTYPE_INT16: string;
  const ELEMENTTYPE_UINT16: string;
  const ELEMENTTYPE_INT32: string;
  const ELEMENTTYPE_UINT32: string;
  const ELEMENTTYPE_FLOAT32: string;
  const FILTER_NEAREST: string;
  const FILTER_LINEAR: string;
  const FILTER_NEAREST_MIPMAP_NEAREST: string;
  const FILTER_NEAREST_MIPMAP_LINEAR: string;
  const FILTER_LINEAR_MIPMAP_NEAREST: string;
  const FILTER_LINEAR_MIPMAP_LINEAR: string;
  const INDEXFORMAT_UINT8: string;
  const INDEXFORMAT_UINT16: string;
  const INDEXFORMAT_UINT32: string;
  const PIXELFORMAT_A8: string;
  const PIXELFORMAT_L8: string;
  const PIXELFORMAT_L8_A8: string;
  const PIXELFORMAT_R5_G6_B5: string;
  const PIXELFORMAT_R5_G5_B5_A1: string;
  const PIXELFORMAT_R4_G4_B4_A4: string;
  const PIXELFORMAT_R8_G8_B8: string;
  const PIXELFORMAT_R8_G8_B8_A8: string;
  const PIXELFORMAT_DXT1: string;
  const PIXELFORMAT_DXT3: string;
  const PIXELFORMAT_DXT5: string;
  const PIXELFORMAT_RGB16F: string;
  const PIXELFORMAT_RGBA16F: string;
  const PIXELFORMAT_RGB32F: string;
  const PIXELFORMAT_RGBA32F: string;
  const PRIMITIVE_POINTS: string;
  const PRIMITIVE_LINES: string;
  const PRIMITIVE_LINELOOP: string;
  const PRIMITIVE_LINESTRIP: string;
  const PRIMITIVE_TRIANGLES: string;
  const PRIMITIVE_TRISTRIP: string;
  const PRIMITIVE_TRIFAN: string;
  const SEMANTIC_POSITION: string;
  const SEMANTIC_NORMAL: string;
  const SEMANTIC_TANGENT: string;
  const SEMANTIC_BLENDWEIGHT: string;
  const SEMANTIC_BLENDINDICES: string;
  const SEMANTIC_COLOR: string;
  const SEMANTIC_TEXCOORD0: string;
  const SEMANTIC_TEXCOORD1: string;
  const SEMANTIC_TEXCOORD2: string;
  const SEMANTIC_TEXCOORD3: string;
  const SEMANTIC_TEXCOORD4: string;
  const SEMANTIC_TEXCOORD5: string;
  const SEMANTIC_TEXCOORD6: string;
  const SEMANTIC_TEXCOORD7: string;
  const SEMANTIC_ATTR0: string;
  const SEMANTIC_ATTR1: string;
  const SEMANTIC_ATTR2: string;
  const SEMANTIC_ATTR3: string;
  const SEMANTIC_ATTR4: string;
  const SEMANTIC_ATTR5: string;
  const SEMANTIC_ATTR6: string;
  const SEMANTIC_ATTR7: string;
  const SEMANTIC_ATTR8: string;
  const SEMANTIC_ATTR9: string;
  const SEMANTIC_ATTR10: string;
  const SEMANTIC_ATTR11: string;
  const SEMANTIC_ATTR12: string;
  const SEMANTIC_ATTR13: string;
  const SEMANTIC_ATTR14: string;
  const SEMANTIC_ATTR15: string;
  const TEXTURELOCK_READ: string;
  const TEXTURELOCK_WRITE: string;
  class IndexBuffer {
    constructor(graphicsDevice: pc.GraphicsDevice, format: number, numIndices: number, usage?: number);
    destroy(): void;
    getFormat(): number;
    getNumIndices(): number;
    lock(): ArrayBuffer;
    unlock(): void;
  }
  class PostEffect {
    constructor(graphicsDevice: pc.GraphicsDevice);
    render(inputTarget: pc.RenderTarget, outputTarget: pc.RenderTarget, rect: pc.Vec4): void;
  }
  class RenderTarget {
    constructor(graphicsDevice: pc.GraphicsDevice, colorBuffer: pc.Texture, options: {
      depth: Boolean,
      stencil: Boolean,
      face: number
    });
    destroy(): void;
    colorBuffer: pc.Texture;
    face: number;
    width: number;
    height: number;
  }
  class Shader {
    constructor(graphicsDevice: pc.GraphicsDevice, definition: {
      attributes: Object,
      vshader: string,
      fshader: string
    });
    destroy(): void;
  }
  class Texture {
    constructor(graphicsDevice: pc.GraphicsDevice, options: {
      width: number,
      height: number,
      format: number,
      cubemap: Boolean,
      rgbm: Boolean,
      fixCubemapSeams: Boolean
    });
    minFilter: number;
    magFilter: number;
    addressU: number;
    addressV: number;
    private autoMipmap: Boolean;
    mipmaps: Boolean;
    anisotropy: number;
    width: number;
    height: number;
    format: number;
    cubemap: Boolean;
    private bind(): void;
    destroy(): void;
    lock(options: {
      level: number,
      face: number
    }): void;
    private recover(): void;
    setSource(source: (HTMLCanvasElement | HTMLImageElement | HTMLVideoElement | Array<Object>)): void;
    getSource(): HTMLImageElement;
    unlock(): void;
    upload(): void;
  }
  class VertexBuffer {
    constructor(graphicsDevice: pc.GraphicsDevice, format: pc.VertexFormat, numVertices: number, usage?: number);
    destroy(): void;
    getFormat(): pc.VertexFormat;
    getUsage(): number;
    getNumVertices(): number;
    lock(): ArrayBuffer;
    unlock(): void;
  }
  class VertexFormat {
    constructor(graphicsDevice: pc.GraphicsDevice, description: Object[]);
  }
  class VertexIterator {
    constructor(vertexBuffer: pc.VertexBuffer);
    next(): void;
    end(): void;
  }
  class Controller {
    constructor(element?: Element, options?: {
      keyboard: pc.Keyboard,
      mouse: pc.Mouse,
      gamepads: pc.GamePads
    });
    attach(element: Element): void;
    detach(): void;
    disableContextMenu(): void;
    enableContextMenu(): void;
    update(dt: Object): void;
    registerKeys(action: string, keys: number[]): void;
    registerMouse(action: string, button: number): void;
    registerPadButton(action: string, pad: number, button: number): void;
    registerAxis(options?: {
      pad: Object
    }): void;
    isPressed(action: string): void;
    wasPressed(action: string): Boolean;
  }
  class GamePads {
    constructor();
    update(): void;
    poll(): Object[];
    isPressed(index: number, button: number): Boolean;
    wasPressed(index: number, button: number): Boolean;
    getAxis(index: number, axes: number): number;
  }
  const EVENT_KEYDOWN: string;
  const EVENT_KEYUP: string;
  const EVENT_MOUSEDOWN: string;
  const EVENT_MOUSEMOVE: string;
  const EVENT_MOUSEUP: string;
  const EVENT_MOUSEWHEEL: string;
  const EVENT_TOUCHSTART: string;
  const EVENT_TOUCHEND: string;
  const EVENT_TOUCHMOVE: string;
  const EVENT_TOUCHCANCEL: string;
  const KEY_BACKSPACE: string;
  const KEY_TAB: string;
  const KEY_RETURN: string;
  const KEY_ENTER: string;
  const KEY_SHIFT: string;
  const KEY_CONTROL: string;
  const KEY_ALT: string;
  const KEY_PAUSE: string;
  const KEY_CAPS_LOCK: string;
  const KEY_ESCAPE: string;
  const KEY_SPACE: string;
  const KEY_PAGE_UP: string;
  const KEY_PAGE_DOWN: string;
  const KEY_END: string;
  const KEY_HOME: string;
  const KEY_LEFT: string;
  const KEY_UP: string;
  const KEY_RIGHT: string;
  const KEY_DOWN: string;
  const KEY_PRINT_SCREEN: string;
  const KEY_INSERT: string;
  const KEY_DELETE: string;
  const KEY_0: string;
  const KEY_1: string;
  const KEY_2: string;
  const KEY_3: string;
  const KEY_4: string;
  const KEY_5: string;
  const KEY_6: string;
  const KEY_7: string;
  const KEY_8: string;
  const KEY_9: string;
  const KEY_SEMICOLON: string;
  const KEY_EQUAL: string;
  const KEY_A: string;
  const KEY_B: string;
  const KEY_C: string;
  const KEY_D: string;
  const KEY_E: string;
  const KEY_F: string;
  const KEY_G: string;
  const KEY_H: string;
  const KEY_I: string;
  const KEY_J: string;
  const KEY_K: string;
  const KEY_L: string;
  const KEY_M: string;
  const KEY_N: string;
  const KEY_O: string;
  const KEY_P: string;
  const KEY_Q: string;
  const KEY_R: string;
  const KEY_S: string;
  const KEY_T: string;
  const KEY_U: string;
  const KEY_V: string;
  const KEY_W: string;
  const KEY_X: string;
  const KEY_Y: string;
  const KEY_Z: string;
  const KEY_WINDOWS: string;
  const KEY_CONTEXT_MENU: string;
  const KEY_NUMPAD_0: string;
  const KEY_NUMPAD_1: string;
  const KEY_NUMPAD_2: string;
  const KEY_NUMPAD_3: string;
  const KEY_NUMPAD_4: string;
  const KEY_NUMPAD_5: string;
  const KEY_NUMPAD_6: string;
  const KEY_NUMPAD_7: string;
  const KEY_NUMPAD_8: string;
  const KEY_NUMPAD_9: string;
  const KEY_MULTIPLY: string;
  const KEY_ADD: string;
  const KEY_SEPARATOR: string;
  const KEY_SUBTRACT: string;
  const KEY_DECIMAL: string;
  const KEY_DIVIDE: string;
  const KEY_F1: string;
  const KEY_F2: string;
  const KEY_F3: string;
  const KEY_F4: string;
  const KEY_F5: string;
  const KEY_F6: string;
  const KEY_F7: string;
  const KEY_F8: string;
  const KEY_F9: string;
  const KEY_F10: string;
  const KEY_F11: string;
  const KEY_F12: string;
  const KEY_COMMA: string;
  const KEY_PERIOD: string;
  const KEY_SLASH: string;
  const KEY_OPEN_BRACKET: string;
  const KEY_BACK_SLASH: string;
  const KEY_CLOSE_BRACKET: string;
  const KEY_META: string;
  const MOUSEBUTTON_NONE: string;
  const MOUSEBUTTON_LEFT: string;
  const MOUSEBUTTON_MIDDLE: string;
  const MOUSEBUTTON_RIGHT: string;
  class KeyboardEvent {
    constructor(keyboard: pc.Keyboard, event: pc.KeyboardEvent);
  }
  function toKeyCode(s: (string | number)): void;
  class Keyboard {
    constructor(element?: Element, options?: {
      preventDefault: Boolean,
      stopPropagation: Boolean
    });
    attach(element: Element): void;
    detach(): void;
    private toKeyIdentifier(keyCode: number): void;
    private update(): void;
    isPressed(key: number): Boolean;
    wasPressed(key: number): Boolean;
    wasReleased(key: number): Boolean;
  }
  class MouseEvent {
    x: number;
    y: number;
    dx: number;
    dy: number;
    wheel: number;
    event: Event;
    button: pc.MOUSEBUTTON;
    constructor(mouse: pc.Mouse, event: MouseEvent);
  }
  class Mouse {
    constructor(element?: Element);
    static isPointerLocked(): Boolean;
    attach(element: Element): void;
    detach(): void;
    disableContextMenu(): void;
    enableContextMenu(): void;
    enablePointerLock(success?: (() => any), error?: (() => any)): void;
    disablePointerLock(success?: (() => any)): void;
    update(dt: Object): void;
    isPressed(button: pc.MOUSEBUTTON): Boolean;
    wasPressed(button: pc.MOUSEBUTTON): Boolean;
    wasReleased(button: pc.MOUSEBUTTON): Boolean;
    on(event: string, callback: ((event: pc.MouseEvent) => void), something: any): void;
  }
  class TouchEvent {
    constructor(device: pc.TouchDevice, event: TouchEvent);
    getTouchById(id: number, list: pc.Touch[]): pc.Touch;
  }
  class Touch {
    constructor(touch: Touch);
  }
  class TouchDevice {
    constructor(element: Element);
    attach(element: Element): void;
    detach(): void;
  }
  let getTouchTargetCoords: any;
  class CurveSet {
    constructor(curveKeys?: Array<Object>);
    get(index: number): pc.Curve;
    value(time: number, result?: Array<Object>): Array<Object>;
    clone(): pc.CurveSet;
    length: number;
    type: number;
  }
  const CURVE_LINEAR: string;
  const CURVE_SMOOTHSTEP: string;
  const CURVE_CATMULL: string;
  const CURVE_CARDINAL: string;
  class Curve {
    constructor(data?: number[]);
    add(time: number, value: number): number[];
    get(index: number): number[];
    sort(): void;
    value(time: number): number;
    clone(): pc.Curve;
  }
  class Mat3 {
    constructor();
    clone(): pc.Mat3;
    copy(src: pc.Mat3): pc.Mat3;
    equals(rhs: pc.Mat3): Boolean;
    isIdentity(): Boolean;
    setIdentity(): pc.Mat3;
    tostring(): string;
    transpose(): pc.Mat3;
    static IDENTITY: pc.Mat3;
    static ZERO: pc.Mat3;
  }
  class Mat4 {
    constructor();
    add2(lhs: pc.Mat4, rhs: pc.Mat4): pc.Mat4;
    add(rhs: pc.Mat4): pc.Mat4;
    clone(): pc.Mat4;
    copy(rhs: pc.Mat4): pc.Mat4;
    equals(rhs: pc.Mat4): Boolean;
    isIdentity(): Boolean;
    mul2(lhs: pc.Mat4, rhs: pc.Mat4): pc.Mat4;
    mul(rhs: pc.Mat4): pc.Mat4;
    transformPoint(vec: pc.Vec3, res?: pc.Vec3): pc.Vec3;
    transformVector(vec: pc.Vec3, res?: pc.Vec3): pc.Vec3;
    setLookAt(position: pc.Vec3, target: pc.Vec3, up: pc.Vec3): pc.Mat4;
    private setFrustum(left: number, right: number, bottom: number, top: number, znear: number, zfar: number): pc.Mat4;
    setPerspective(fovy: number, aspect: number, znear: number, zfar: number): pc.Mat4;
    setOrtho(left: number, right: number, bottom: number, top: number, znear: number, zfar: number): pc.Mat4;
    setFromAxisAngle(axis: pc.Vec3, angle: number): pc.Mat4;
    private setTranslate(x: number, y: number, z: number): pc.Mat4;
    private setScale(x: number, y: number, z: number): pc.Mat4;
    invert(): pc.Mat4;
    set(Source: Array<Object>): void;
    setIdentity(): pc.Mat4;
    setTRS(t: pc.Vec3, r: pc.Quat, s: pc.Vec3): pc.Mat4;
    transpose(): pc.Mat4;
    getTranslation(t?: pc.Vec3): pc.Vec3;
    getX(x?: pc.Vec3): pc.Vec3;
    getY(y?: pc.Vec3): pc.Vec3;
    getZ(z?: pc.Vec3): pc.Vec3;
    getScale(scale?: pc.Vec3): pc.Vec3;
    setFromEulerAngles(ex: number, ey: number, ez: number): pc.Mat4;
    getEulerAngles(eulers?: pc.Vec3): pc.Vec3;
    tostring(): string;
    static IDENTITY: pc.Mat4;
    static ZERO: pc.Mat4;
  }
  module math {
    const DEG_TO_RAD: number;
    const RAD_TO_DEG: number;
    const INV_LOG2: number;
    function clamp(value: number, min: number, max: number): number;
    function intToBytes24(i: number): number[];
    function intToBytes32(i: number): number[];
    function bytesToInt24(r: number, g: number, b: number): number;
    function bytesToInt32(r: number, g: number, b: number, a: number): number;
    function lerp(a: number, b: number, alpha: number): number;
    function lerpAngle(a: number, b: number, alpha: number): number;
    function powerOfTwo(x: number): Boolean;
    function nextPowerOfTwo(val: number): number;
    function random(min: number, max: number): number;
    function smoothstep(min: number, max: number, x: number): number;
    function smootherstep(min: number, max: number, x: number): number;
  }
  class Quat {
    constructor(x?: number, y?: number, z?: number, w?: number);
    x: number;
    y: number;
    z: number;
    w: number;
    clone(): pc.Quat;
    copy(rhs: pc.Quat): pc.Quat;
    equals(): Boolean;
    getEulerAngles(eulers?: pc.Vec3): pc.Vec3;
    invert(): pc.Quat;
    length(): number;
    lengthSq(): number;
    mul(rhs: pc.Quat): pc.Quat;
    mul2(lhs: pc.Quat, rhs: pc.Quat): pc.Quat;
    normalize(): pc.Quat;
    set(x: number, y: number, z: number, w: number): void;
    setFromAxisAngle(axis: pc.Vec3, angle: number): pc.Quat;
    setFromEulerAngles(ex: number, ey: number, ez: number): pc.Quat;
    setFromMat4(m: pc.Mat4): pc.Quat;
    slerp(lhs: pc.Quat, rhs: pc.Quat, alpha: number): pc.Quat;
    transformVector(vec: pc.Vec3, res?: pc.Vec3): pc.Vec3;
    tostring(): string;
    static IDENTITY: pc.Quat;
    static ZERO: pc.Quat;
  }
  class Vec2 {
    constructor();
    constructor(x: number, y: number);
    add(rhs: pc.Vec2): pc.Vec2;
    add2(lhs: pc.Vec2, rhs: pc.Vec2): pc.Vec2;
    clone(): pc.Vec2;
    copy(rhs: pc.Vec2): pc.Vec2;
    dot(rhs: pc.Vec2): number;
    equals(rhs: pc.Vec2): Boolean;
    length(): number;
    lengthSq(): number;
    lerp(lhs: pc.Vec2, rhs: pc.Vec2, alpha: number): pc.Vec2;
    mul(rhs: pc.Vec2): pc.Vec2;
    mul2(lhs: pc.Vec2, rhs: pc.Vec2): pc.Vec2;
    normalize(): pc.Vec2;
    scale(scalar: number): pc.Vec2;
    set(x: number, y: number): void;
    sub(rhs: pc.Vec2): pc.Vec2;
    sub2(lhs: pc.Vec2, rhs: pc.Vec2): pc.Vec2;
    tostring(): string;
    x: number;
    y: number;
    static ONE: pc.Vec2;
    static RIGHT: pc.Vec2;
    static UP: pc.Vec2;
    static ZERO: pc.Vec2;
  }
  class Vec3 {
    constructor(x?: number, y?: number, z?: number);
    add(rhs: pc.Vec3): pc.Vec3;
    add2(lhs: pc.Vec3, rhs: pc.Vec3): pc.Vec3;
    clone(): pc.Vec3;
    copy(rhs: pc.Vec3): pc.Vec3;
    cross(lhs: pc.Vec3, rhs: pc.Vec3): pc.Vec3;
    dot(rhs: pc.Vec3): number;
    equals(rhs: pc.Vec3): Boolean;
    length(): number;
    lengthSq(): number;
    lerp(lhs: pc.Vec3, rhs: pc.Vec3, alpha: number): pc.Vec3;
    mul(rhs: pc.Vec3): pc.Vec3;
    mul2(lhs: pc.Vec3, rhs: pc.Vec3): pc.Vec3;
    normalize(): pc.Vec3;
    project(rhs: pc.Vec3): pc.Vec3;
    scale(scalar: number): pc.Vec3;
    set(x: number, y: number, z: number): void;
    sub(rhs: pc.Vec3): pc.Vec3;
    sub2(lhs: pc.Vec3, rhs: pc.Vec3): pc.Vec3;
    tostring(): string;
    x: number;
    y: number;
    z: number;
    static BACK: pc.Vec3;
    static DOWN: pc.Vec3;
    static FORWARD: pc.Vec3;
    static LEFT: pc.Vec3;
    static ONE: pc.Vec3;
    static RIGHT: pc.Vec3;
    static UP: pc.Vec3;
    static ZERO: pc.Vec3;
  }
  class Vec4 {
    constructor();
    add(rhs: pc.Vec4): pc.Vec4;
    add2(lhs: pc.Vec4, rhs: pc.Vec4): pc.Vec4;
    clone(): pc.Vec4;
    copy(rhs: pc.Vec4): pc.Vec4;
    dot(rhs: pc.Vec4): number;
    equals(rhs: pc.Vec4): Boolean;
    length(): number;
    lengthSq(): number;
    lerp(lhs: pc.Vec4, rhs: pc.Vec4, alpha: number): pc.Vec4;
    mul(rhs: pc.Vec4): pc.Vec4;
    mul2(lhs: pc.Vec4, rhs: pc.Vec4): pc.Vec4;
    normalize(): pc.Vec4;
    scale(scalar: number): pc.Vec4;
    set(x: number, y: number, z: number, w: number): void;
    sub(rhs: pc.Vec4): pc.Vec4;
    sub2(lhs: pc.Vec4, rhs: pc.Vec4): pc.Vec4;
    tostring(): string;
    x: number;
    y: number;
    z: number;
    w: number;
    static ONE: pc.Vec4;
    static ZERO: pc.Vec4;
  }
  class Http {
    constructor();
    get(url: string, options: {
      headers: Object,
      async: Boolean,
      cache: Object,
      withCredentials: Boolean,
      responseType: string,
      postdata: (Document | Object)
    }, callback: (() => any)): void;
    post(url: string, options: {
      headers: Object,
      async: Boolean,
      cache: Object,
      withCredentials: Boolean,
      responseType: string
    }, data: Object, callback: (() => any)): void;
    put(url: string, options: {
      headers: Object,
      async: Boolean,
      cache: Object,
      withCredentials: Boolean,
      responseType: string
    }, data: (Document | Object), callback: (() => any)): void;
    del(url: Object, options: {
      headers: Object,
      async: Boolean,
      cache: Object,
      withCredentials: Boolean,
      responseType: string,
      postdata: (Document | Object)
    }, callback: (() => any)): void;
    request(method: string, url: string, options: {
      headers: Object,
      async: Boolean,
      cache: Object,
      withCredentials: Boolean,
      responseType: string,
      postdata: (Document | Object)
    }, callback: (() => any)): void;
  }
  function createStyle(cssstring: string): Element;
  class ResourceLoader {
    constructor();
    addHandler(type: string, handler: pc.ResourceHandler): void;
    load(url: string, type: string, callback: (() => any)): void;
    open(): void;
    patch(): void;
    getFromCache(): void;
    destroy(): void;
  }
  class ModelHandler {
    constructor(device: pc.GraphicsDevice);
    load(): void;
    open(data: Object): void;
  }
  class ScriptHandler {
    constructor(app: pc.Application);
  }
  class BasicMaterial extends pc.Material {
    constructor();
    clone(): pc.BasicMaterial;
  }
  class PhongMaterial extends pc.Material {
    constructor();
    clone(): pc.PhongMaterial;
  }
  class Camera {
    constructor();
    clone(): pc.Camera;
    worldToScreen(worldCoord: pc.Vec3, cw: number, ch: number, screenCoord?: pc.Vec3): pc.Vec3;
    screenToWorld(x: number, y: number, cw: number, worldCoord?: pc.Vec3): pc.Vec3;
    getClearOptions(): Object;
    getProjectionMatrix(): pc.Mat4;
    setClearOptions(clearOptions: {
      color: number[],
      depth: number,
      flags: pc.CLEARFLAG
    }): void;
    aspectRatio: number;
    projection: number;
    nearClip: number;
    farClip: number;
    fov: number;
    horizontalFov: Boolean;
    orthoHeight: number;
    clearColor: Array<Object>;
    clearDepth: number;
    clearStencil: number;
    clearFlags: number;
  }
  class DepthMaterial {
    constructor();
    private clone(): pc.DepthMaterial;
  }
  class ForwardRenderer {
    constructor(graphicsDevice: pc.GraphicsDevice);
    private render(scene: pc.Scene, camera: pc.Camera): void;
  }
  class GraphNode {
    constructor(name?: string);
    right: pc.Vec3;
    up: pc.Vec3;
    forward: pc.Vec3;
    enabled: Boolean;
    parent: pc.GraphNode;
    root: pc.GraphNode;
    children: pc.GraphNode[];
    find(fn: (() => any)): pc.GraphNode[];
    findOne(fn: (() => any)): pc.GraphNode;
    findByTag(query: string): pc.GraphNode[];
    findByName(name: string): pc.GraphNode;
    findByPath(path: string): pc.GraphNode;
    getPath(): string;
    private getRoot(): pc.GraphNode;
    private getParent(): pc.GraphNode;
    isDescendantOf(): Boolean;
    isAncestorOf(): Boolean;
    private getChildren(): pc.GraphNode[];
    getEulerAngles(): pc.Vec3;
    getLocalEulerAngles(): pc.Vec3;
    getLocalPosition(): pc.Vec3;
    getLocalRotation(): pc.Quat;
    getLocalScale(): pc.Vec3;
    getLocalTransform(): pc.Mat4;
    private getName(): string;
    getPosition(): pc.Vec3;
    getRotation(): pc.Quat;
    getWorldTransform(): pc.Mat4;
    reparent(parent: pc.GraphNode, index: number): void;
    setLocalEulerAngles(x: number, y: number, z: number): void;
    setLocalPosition(x: number, y: number, z: number): void;
    setLocalRotation(q: pc.Quat): void;
    setLocalScale(x: number, y: number, z: number): void;
    private setName(name: string): void;
    setPosition(x: number, y: number, z: number): void;
    setPosition(position: pc.Vec3): void;
    setRotation(rot: pc.Quat): void;
    setEulerAngles(ex: number, ey: number, ez: number): void;
    setEulerAngles(angles: pc.Vec3): void;
    addChild(node: pc.GraphNode): void;
    insertChild(node: pc.GraphNode, index: number): void;
    removeChild(node: pc.GraphNode): void;
    private addLabel(label: string): void;
    private getLabels(): string[];
    private hasLabel(label: string): Boolean;
    private removeLabel(label: string): void;
    private findByLabel(label: string, results?: pc.GraphNode[]): pc.GraphNode[];
    syncHierarchy(): void;
    lookAt(tx: number, ty: number, tz: number, ux?: number, uy?: number, uz?: number): void;
    lookAt(target: pc.Vec3, up?: pc.Vec3): void;
    translate(translation: pc.Vec3): void;
    translate(x: number, y: number, z: number): void;
    translateLocal(translation: pc.Vec3): void;
    translateLocal(x: number, y: number, z: number): void;
    rotate(rot: pc.Vec3): void;
    rotate(ex: number, ey: number, ez: number): void;
    rotateLocal(rot: pc.Vec3): void;
    rotateLocal(ex: number, ey: number, ez: number): void;
    model: pc.Model;
    rigidbody: pc.RigidBodyComponentSystem;
    camera: pc.Camera;
    collision: pc.CollisionComponentSystem;
  }
  class Light {
    constructor();
    private clone(): pc.Light;
  }
  class Lightmapper {
    constructor();
    bake(nodes: pc.Entity, mode: number): void;
  }
  class Material {
    constructor();
    getParameter(name: string): Object;
    setParameter(name: string, data: (number | Array<Object> | pc.Texture)): void;
    deleteParameter(name: string): void;
    setParameters(): void;
    update(): void;
    init(data: Object): void;
    private getName(): string;
    private setName(name: string): void;
    private getShader(): pc.Shader;
    private setShader(shader: pc.Shader): void;
    private destroy(): void;
  }
  class StencilParameters {
    constructor();
  }
  class Mesh {
    constructor();
  }
  class MeshInstance {
    constructor(node: pc.GraphNode, mesh: pc.Mesh, material: pc.Material);
    mask: number;
    aabb: pc.BoundingBox;
    material: pc.Material;
  }
  class Model {
    constructor();
    clone(): pc.Model;
    destroy(): void;
    generateWireframe(): void;
    material: pc.Material;
    meshInstances: pc.MeshInstance[];
    graph: pc.GraphNode;
  }
  class Picker {
    constructor(device: pc.GraphicsDevice, width: number, height: number);
    getSelection(rect: {
      x: number,
      y: number,
      width: number,
      height: number
    }): pc.MeshInstance[];
    prepare(camera: pc.Camera, scene: pc.Scene): void;
    resize(width: number, height: number): void;
  }
  function calculateNormals(positions: number[], indices: number[]): number[];
  function calculateTangents(positions: number[], normals: number[], uvs: number[], indices: number[]): number[];
  function createMesh(device: pc.GraphicsDevice, positions: number[], opts: {
    normals: number[],
    tangents?: number[],
    colors?: number[],
    uvs: number[],
    uvs1?: number[],
    indices: number[]
  }): pc.Mesh;
  function createTorus(device: pc.GraphicsDevice, opts: {
    tubeRadius: number,
    ringRadius: number,
    segments: number,
    sides: number
  }): pc.Mesh;
  function createCylinder(device: pc.GraphicsDevice, opts: {
    radius: number,
    height: number,
    heightSegments: number,
    capSegments: number
  }): pc.Mesh;
  function createCapsule(device: pc.GraphicsDevice, opts: {
    radius: number,
    height: number,
    heightSegments: number,
    sides: number
  }): pc.Mesh;
  function createCone(device: pc.GraphicsDevice, opts: {
    baseRadius: number,
    peakRadius: number,
    height: number,
    heightSegments: number,
    capSegments: number
  }): pc.Mesh;
  function createSphere(device: pc.GraphicsDevice, opts: {
    radius: number,
    segments: number
  }): pc.Mesh;
  function createPlane(device: pc.GraphicsDevice, opts: {
    halfExtents: pc.Vec2,
    widthSegments: number,
    lengthSegments: number
  }): pc.Mesh;
  function createBox(device: pc.GraphicsDevice, opts: {
    halfExtents: pc.Vec3,
    widthSegments: number,
    lengthSegments: number,
    heightSegments: number
  }): pc.Mesh;
  const BLEND_SUBTRACTIVE: string;
  const BLEND_ADDITIVE: string;
  const BLEND_NORMAL: string;
  const BLEND_NONE: string;
  const BLEND_PREMULTIPLIED: string;
  const BLEND_MULTIPLICATIVE: string;
  const BLEND_ADDITIVEALPHA: string;
  const BLEND_MULTIPLICATIVE2X: string;
  const BLEND_SCREEN: string;
  const FOG_NONE: string;
  const FOG_LINEAR: string;
  const FOG_EXP: string;
  const FOG_EXP2: string;
  const LIGHTTYPE_DIRECTIONAL: string;
  const LIGHTTYPE_POINT: string;
  const LIGHTTYPE_SPOT: string;
  const PROJECTION_PERSPECTIVE: string;
  const PROJECTION_ORTHOGRAPHIC: string;
  class Scene {
    constructor();
    addModel(model: pc.Model): void;
    removeModel(model: pc.Model): void;
    update(): void;
  }
  class Skin {
    constructor(graphicsDevice: pc.GraphicsDevice, ibp: pc.Mat4[], boneNames: string[]);
  }
  class SkinInstance {
    constructor(skin: pc.Skin);
  }
  class StandardMaterial extends pc.Material {
    constructor();
    clone(): pc.StandardMaterial;
  }
  class ScriptRegistry {
    constructor(app: pc.Application);
    add(scriptType: ScriptType): Boolean;
    remove(name: string): Boolean;
    get(name: string): ScriptType;
    has(name: string): Boolean;
    list(): ScriptType[];
  }
  class ScriptAttributes {
    constructor(scriptType: ScriptType);
    add(name: string, args: {
      type: string,
      default: any,
      title: string,
      description: string,
      placeholder: (string | string[]),
      array: Boolean,
      size: number,
      min: number,
      max: number,
      precision: number,
      assetType: string,
      curves: string[],
      color: string,
      const: Object[]
    }): void;
    remove(name: string): Boolean;
    has(name: string): Boolean;
    get(name: string): Object;
  }
  function createScript(name: string, app?: pc.Application): (() => any);
  class BoundingBox {
    center: pc.Vec3;
    halfExtents: pc.Vec3;
    constructor(center?: pc.Vec3, halfExtents?: pc.Vec3);
    add(other: pc.BoundingBox): void;
    intersects(other: pc.BoundingBox): Boolean;
    intersectsRay(ray: pc.Ray, point?: pc.Vec3): Boolean;
    getMin(): pc.Vec3;
    getMax(): pc.Vec3;
    copy(other: pc.BoundingBox): void;
    containsPoint(point: pc.Vec3): Boolean;
    setFromTransformedAabb(aabb: pc.BoundingBox, m: pc.Mat4): void;
  }
  class BoundingSphere {
    constructor(center?: pc.Vec3, radius?: number);
    intersectsRay(ray: pc.Ray, point?: pc.Vec3): Boolean;
  }
  class Frustum {
    constructor(projectionMatrix: pc.Mat4, viewMatrix: pc.Mat4);
    update(projectionMatrix: pc.Mat4, viewMatrix: pc.Mat4): void;
    containsPoint(point: pc.Vec3): Boolean;
    containsSphere(sphere: pc.BoundingSphere): number;
  }
  class Plane {
    constructor(point?: pc.Vec3, normal?: pc.Vec3);
    intersectsLine(start: pc.Vec3, end: pc.Vec3, point?: pc.Vec3): Boolean;
    intersectsRay(ray: pc.Ray, point?: pc.Vec3): Boolean;
  }
  class Ray {
    constructor(origin?: pc.Vec3, direction?: pc.Vec3);
  }
  class SoundInstance {
    constructor(manager: pc.SoundManager, sound: pc.Sound, options: {
      volume: number,
      pitch: number,
      loop: Boolean,
      startTime: number,
      duration: number,
      onPlay: (() => any),
      onPause: (() => any),
      onResume: (() => any),
      onStop: (() => any),
      onEnd: (() => any)
    });
    private _initializeNodes(): void;
    play(): Boolean;
    pause(): Boolean;
    resume(): Boolean;
    stop(): void;
    setExternalNodes(firstNode: AudioNode, lastNode?: AudioNode): void;
    clearExternalNodes(): void;
    getExternalNodes(): AudioNode[];
    private _onManagerDestroy(): void;
    private _onManagerVolumeChange(): void;
    private _onManagerSuspend(): void;
    private _onManagerResume(): void;
  }
  class SoundInstance3d extends pc.SoundInstance {
    constructor(manager: pc.SoundManager, sound: pc.Sound, options: {
      volume: number,
      pitch: number,
      loop: Boolean,
      startTime: number,
      duration: number,
      position: pc.Vec3,
      velocity: pc.Vec3,
      distanceModel: string,
      refDistance: number,
      maxDistance: number,
      rollOffFactor: number
    });
  }
  class Listener {
    constructor(manager: pc.SoundManager);
  }
  class SoundManager {
    constructor(options?: {
      forceWebAudioApi: Boolean
    });
    private static hasAudio(): any;
    private static hasAudioContext(): any;
    private playSound(sound: pc.Sound, options: {
      volume: number,
      loop: Boolean
    }): void;
    private playSound3d(sound: pc.Sound, position: pc.Vec3, options: {
      volume: number,
      loop: Boolean
    }): void;
  }
  class Sound {
    constructor();
  }
  class VrDisplay {
    constructor();
    destroy(): void;
    poll(): void;
    requestPresent(callback: (() => any)): void;
    exitPresent(callback: (() => any)): void;
    requestAnimationFrame(fn: (() => any)): void;
    submitFrame(): void;
    reset(): void;
    setClipPlanes(n: number, f: number): void;
    getFrameData(): VRFrameData;
  }
  class VrManager {
    constructor(app: pc.Application);
    static isSupported: Boolean;
    static usesPolyfill: Boolean;
    destroy(): void;
    poll(): void;
  }
}
declare function _createImplementation(): void;
declare function _getImplementation(): void;
declare function changeType(): void;
declare function recreatePhysicalShapes(): void;
declare function update(): void;
declare function fixedUpdate(): void;
declare function postUpdate(): void;
declare class ScriptType {
  constructor();
  private static __name: string;
  static attributes: pc.ScriptAttributes;
  static extend(methods: Object): void;
}
