/* tslint:disable:variable-name */

import app from 'app';
import Player from 'characters/player/Player';
import GameObject from 'GameObject';

class MouseInput {
  public distanceSensitivity: number = 0.3;
  public orbitSensitivity: number = 0.5;
  public fromWorldPoint: pc.Vec3 = new pc.Vec3();
  public toWorldPoint: pc.Vec3 = new pc.Vec3();
  public worldDiff: pc.Vec3 = new pc.Vec3();
  public entity: pc.Entity;

  private mouse: pc.Mouse;
  private lookButtonDown: boolean = false;
  private panButtonDown: boolean = false;
  private lastPoint: pc.Vec2 = new pc.Vec2();

  constructor(public orbitCamera: OrbitCamera) {
    this.entity = orbitCamera.entity;

    if (this.orbitCamera) {
      const onMouseOut = () => this.onMouseOut();
      app.mouse.on(pc.EVENT_MOUSEDOWN, this.onMouseDown, this);
      app.mouse.on(pc.EVENT_MOUSEUP, this.onMouseUp, this);
      app.mouse.on(pc.EVENT_MOUSEMOVE, this.onMouseMove, this);
      app.mouse.on(pc.EVENT_MOUSEWHEEL, this.onMouseWheel, this);

      // Listen to when the mouse travels out of the window
      window.addEventListener('mouseout', onMouseOut, false);
    }

    // Disabling the context menu stops the browser displaying a menu when
    // you right-click the page
    app.mouse.disableContextMenu();
  }

  public pan(screenPoint: pc.Vec2) {
    const fromWorldPoint = this.fromWorldPoint;
    const toWorldPoint = this.toWorldPoint;
    const worldDiff = this.worldDiff;

    // For panning to work at any zoom level, we use screen point to world projection
    // to work out how far we need to pan the pivotEntity in world space
    const camera = this.entity.camera;
    const distance = this.orbitCamera.distance;

    camera.screenToWorld(screenPoint.x, screenPoint.y, distance, fromWorldPoint);
    camera.screenToWorld(this.lastPoint.x, this.lastPoint.y, distance, toWorldPoint);

    worldDiff.sub2(toWorldPoint, fromWorldPoint);

    this.orbitCamera.pivotPoint.add(worldDiff);
  }

  public onMouseDown(event: pc.MouseEvent) {
    // select players on click
    const camera = this.entity.camera;
    const source = camera.screenToWorld(event.x, event.y, camera.nearClip);
    const target = camera.screenToWorld(event.x, event.y, camera.farClip);

    const result = app.systems.rigidbody.raycastFirst(source, target);
    if (result) {
        const player: Player = Player.getByEntity(result.entity);
        if (player) {
          player.select();
        }
    }

    switch (event.button) {
      case pc.MOUSEBUTTON_LEFT:
        // this.lookButtonDown = true;
        break;

      case pc.MOUSEBUTTON_MIDDLE:
      case pc.MOUSEBUTTON_RIGHT:
        this.lookButtonDown = true;
        break;
      default: break;
    }
  }

  public onMouseUp(event: pc.MouseEvent) {
    switch (event.button) {
      case pc.MOUSEBUTTON_LEFT:
        // this.lookButtonDown = false;
        break;

      case pc.MOUSEBUTTON_MIDDLE:
      case pc.MOUSEBUTTON_RIGHT:
        this.lookButtonDown = false;
        break;
      default: break;
    }
  }

  public onMouseMove(event: pc.MouseEvent) {
    if (this.lookButtonDown) {
      this.orbitCamera.pitch -= event.dy * this.orbitSensitivity;
      this.orbitCamera.yaw -= event.dx * this.orbitSensitivity;
    } else if (this.panButtonDown) {
      this.pan(new pc.Vec2(event.x, event.y));
    }

    this.lastPoint.set(event.x, event.y);
  }

  public onMouseWheel(event: pc.MouseEvent) {
    this.orbitCamera.distance -=
      event.wheel * this.distanceSensitivity * this.orbitCamera.distance * 0.1;
    event.event.preventDefault();
  }

  public onMouseOut() {
    this.lookButtonDown = false;
    this.panButtonDown = false;
  }
}

// TODO: make this inherit from pc.Camera
export default class OrbitCamera extends GameObject {
  public readonly distanceMax: number = 700;
  public readonly distanceMin: number = 100;
  public readonly pitchAngleMax: number = 90;
  public readonly pitchAngleMin: number = -90;
  public readonly inertiaFactor: number = 0;
  public readonly distanceFactor: number = 0.4;
  public readonly frameOnStart: boolean = true;

  public entity: pc.Entity;
  public distanceBetween: pc.Vec3 = new pc.Vec3();
  public quatWithoutYaw: pc.Quat = new pc.Quat();
  public yawOffset: pc.Quat = new pc.Quat();

  private mouseInput: MouseInput;
  private _distance: number;
  private _yaw: number;
  private _pitch: number;
  private _targetDistance: number;
  private _targetYaw: number;
  private _targetPitch: number;
  private _modelsAabb: pc.BoundingBox = new pc.BoundingBox();
  private _pivotPoint: pc.Vec3 = new pc.Vec3();
  private doesTransition: boolean = false;

  constructor(clearColor: pc.Color, position: pc.Vec3, eulerAngles: pc.Vec3) {
    super();
    this.entity = new pc.Entity();
    this.entity.addComponent('camera', {
      clearColor: clearColor
    });
    this.entity.setPosition(position);
    this.entity.setEulerAngles(eulerAngles);
    app.root.addChild(this.entity);

    this.mouseInput = new MouseInput(this);
    super.addTimedUpdate((dt: number) => {
      // Add inertia, if any
      const t = this.inertiaFactor === 0 ? 1 : Math.min(dt / this.inertiaFactor, 1);
      this._distance = pc.math.lerp(this._distance, this._targetDistance, t);
      this._yaw = pc.math.lerp(this._yaw, this._targetYaw, t);
      this._pitch = pc.math.lerp(this._pitch, this._targetPitch, t);

      this._updatePosition();
    },                   0);

    window.addEventListener('resize', () => {
      this._checkAspectRatio();
    },                      false);
    this._checkAspectRatio();

    // Find all the models in the scene that are under the focused entity
    this._buildAabb(this.entity || app.root, 0);
    this.entity.lookAt(this._modelsAabb.center);
    this._pivotPoint.copy(this._modelsAabb.center);

    // Calculate the camera euler angle rotation around x and y axes
    // This allows us to place the camera at a particular rotation to begin with in the scene
    const cameraQuat = this.entity.getRotation();

    // Preset the camera
    this._yaw = OrbitCamera._calcYaw(cameraQuat);
    this._pitch = this._clampPitchAngle(this._calcPitch(cameraQuat, this._yaw));
    this.entity.setLocalEulerAngles(this._pitch, this._yaw, 0);

    this._distance = 0;

    this._targetYaw = this._yaw;
    this._targetPitch = this._pitch;

    // If we have ticked focus on start, then attempt to position the camera where it frames
    // the focused entity and move the pivot point to entity's position otherwise, set the distance
    // to be between the camera position in the scene and the pivot point
    if (this.frameOnStart) {
      this.focus(this.entity || app.root);
    } else {
      const distanceBetween = new pc.Vec3();
      distanceBetween.sub2(this.entity.getPosition(), this._pivotPoint);
      this._distance = this._clampDistance(distanceBetween.length());
    }

    this._targetDistance = this._distance;
  }

  public static _calcYaw(quat: pc.Quat) {
    const transformedForward = new pc.Vec3();
    quat.transformVector(pc.Vec3.FORWARD, transformedForward);

    return Math.atan2(-transformedForward.x, -transformedForward.z) * pc.math.RAD_TO_DEG;
  }

  public _clampPitchAngle(pitch: number) {
    // Negative due as the pitch is inversed since the camera is orbiting the entity
    return pc.math.clamp(pitch, -this.pitchAngleMax, -this.pitchAngleMin);
  }

  public _calcPitch(quat: pc.Quat, yaw: number) {
    const quatWithoutYaw = this.quatWithoutYaw;
    const yawOffset = this.yawOffset;

    yawOffset.setFromEulerAngles(0, -yaw, 0);
    quatWithoutYaw.mul2(yawOffset, quat);

    const transformedForward = new pc.Vec3();

    quatWithoutYaw.transformVector(pc.Vec3.FORWARD, transformedForward);

    return Math.atan2(transformedForward.y, -transformedForward.z) * pc.math.RAD_TO_DEG;
  }

  // Moves the camera to look at an entity and all its children so they are all in the view
  public focus(focusEntity: pc.Entity, transition: boolean = false) {
    // Calculate an bounding box that encompasses all the models to frame in the camera view
    this._buildAabb(focusEntity, 0);

    const halfExtents = this._modelsAabb.halfExtents;

    let distance = Math.max(halfExtents.x, Math.max(halfExtents.y, halfExtents.z));
    distance /= Math.tan(0.5 * this.entity.camera.fov * pc.math.DEG_TO_RAD);
    distance *= 2;

    this.distance = distance;
    this._removeInertia();
    this._pivotPoint.copy(focusEntity.getPosition());
    this.doesTransition = transition;
    // this._pivotPoint.copy(this._modelsAabb.center);
  }

  public _updatePosition() {
    // Work out the camera position based on the pivot point, pitch, yaw and distance
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

  public _removeInertia() {
    this._yaw = this._targetYaw;
    this._pitch = this._targetPitch;
    this._distance = this._targetDistance;
  }

  public _checkAspectRatio() {
    const height = app ? app.graphicsDevice.height : 0;
    const width = app ? app.graphicsDevice.width : 0;

    // Match the axis of FOV to match the aspect ratio of the canvas so
    // the focused entities is always in frame
    this.entity.camera.horizontalFov = height > width;
  }

  public _buildAabb(entity: pc.Entity, _modelsAdded: number) {
    let i = 0;
    let modelsAdded = _modelsAdded;

    if (entity.model) {
      const mi = entity.model.meshInstances;
      for (i = 0; i < mi.length; i += 1) {
        if (modelsAdded === 0) {
          this._modelsAabb.copy(mi[i].aabb);
        } else {
          this._modelsAabb.add(mi[i].aabb);
        }

        modelsAdded += 1;
      }
    }
    //
    // for (i = 1; i < entity.children.length; i += 1) {
    //   modelsAdded += this._buildAabb(entity.children[i], modelsAdded);
    // }

    return modelsAdded;
  }

  public _clampDistance(distance: number) {
    if (this.distanceMax > 0) {
      return pc.math.clamp(distance, this.distanceMin, this.distanceMax);
    }

    return Math.max(distance, this.distanceMin);
  }

  get distance() {
    return this._targetDistance;
  }

  set distance(value: number) {
    this._targetDistance = this._clampDistance(value);
  }

  get pitch() {
    return this._targetPitch;
  }

  set pitch(value: number) {
    this._targetPitch = this._clampPitchAngle(value);
  }

  get yaw() {
    return this._targetYaw;
  }

  set yaw(value: number) {
    this._targetYaw = value;

    // Ensure that the yaw takes the shortest route by making sure that
    // the difference between the targetYaw and the actual is 180 degrees
    // in either direction
    const diff = this._targetYaw - this._yaw;
    const reminder = diff % 360;
    if (reminder > 180) {
      this._targetYaw = this._yaw - (360 - reminder);
    } else if (reminder < -180) {
      this._targetYaw = this._yaw + (360 + reminder);
    } else {
      this._targetYaw = this._yaw + reminder;
    }
  }

  get pivotPoint() {
    return this._pivotPoint;
  }

  set pivotPoint(value: pc.Vec3) {
    this._pivotPoint.copy(value);
  }
}
