import GameObject from 'gameobject';

const pc = require('playcanvas');

class MouseInput {
  constructor(orbitCamera) {
    this.distanceSensitivity = 0.3;
    this.orbitSensitivity = 0.5;

    this.fromWorldPoint = new pc.Vec3();
    this.toWorldPoint = new pc.Vec3();
    this.worldDiff = new pc.Vec3();
    this.app = GameObject.getApp();
    this.orbitCamera = orbitCamera;
    this.mouse = new pc.Mouse(orbitCamera.entity);
    this.mouse.attach(document.getElementById('canvas'));

    this.entity = orbitCamera.entity;

    if (this.orbitCamera) {
      const onMouseOut = e => this.onMouseOut(e);

      this.mouse.on(pc.EVENT_MOUSEDOWN, this.onMouseDown, this);
      this.mouse.on(pc.EVENT_MOUSEUP, this.onMouseUp, this);
      this.mouse.on(pc.EVENT_MOUSEMOVE, this.onMouseMove, this);
      this.mouse.on(pc.EVENT_MOUSEWHEEL, this.onMouseWheel, this);

      // Listen to when the mouse travels out of the window
      window.addEventListener('mouseout', onMouseOut, false);
    }

    // Disabling the context menu stops the browser displaying a menu when
    // you right-click the page
    this.mouse.disableContextMenu();

    this.lookButtonDown = false;
    this.panButtonDown = false;
    this.lastPoint = new pc.Vec2();
  }

  pan(screenPoint) {
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

  onMouseDown(event) {
    switch (event.button) {
      case pc.MOUSEBUTTON_LEFT:
        this.lookButtonDown = true;
        break;

      case pc.MOUSEBUTTON_MIDDLE:
      case pc.MOUSEBUTTON_RIGHT:
        this.panButtonDown = true;
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
    } else if (this.panButtonDown) {
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


export default class OrbitCamera extends GameObject {
  constructor(entity) {
    super();
    this.distanceMax = 700;
    this.distanceMin = 100;
    this.pitchAngleMax = 90;
    this.pitchAngleMin = -90;
    this.inertiaFactor = 0;
    this.distanceFactor = 0.4;
    this.focusEntity = entity;
    this.frameOnStart = true;

    this.app = GameObject.getApp();
    this.entity = entity;

    this.distanceBetween = new pc.Vec3();
    this.quatWithoutYaw = new pc.Quat();
    this.yawOffset = new pc.Quat();
    this.mouseInput = new MouseInput(this);

    const onWindowResize = () => {
      this._checkAspectRatio();
    };

    super.addTimedUpdate((dt) => {
      // Add inertia, if any
      const t = this.inertiaFactor === 0 ? 1 : Math.min(dt / this.inertiaFactor, 1);
      this._distance = pc.math.lerp(this._distance, this._targetDistance, t);
      this._yaw = pc.math.lerp(this._yaw, this._targetYaw, t);
      this._pitch = pc.math.lerp(this._pitch, this._targetPitch, t);

      this._updatePosition();
    }, 0);

    window.addEventListener('resize', onWindowResize, false);
    this._checkAspectRatio();

    // Find all the models in the scene that are under the focused entity
    this._modelsAabb = new pc.BoundingBox();
    this._buildAabb(this.focusEntity || this.app.root, 0);

    this.entity.lookAt(this._modelsAabb.center);

    this._pivotPoint = new pc.Vec3();
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
      this.focus(this.focusEntity || this.app.root);
    } else {
      const distanceBetween = new pc.Vec3();
      distanceBetween.sub2(this.entity.getPosition(), this._pivotPoint);
      this._distance = this._clampDistance(distanceBetween.length());
    }

    this._targetDistance = this._distance;
  }

  _clampPitchAngle(pitch) {
    // Negative due as the pitch is inversed since the camera is orbiting the entity
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

  // Moves the camera to look at an entity and all its children so they are all in the view
  focus(focusEntity) {
    // Calculate an bounding box that encompasses all the models to frame in the camera view
    this._buildAabb(focusEntity, 0);

    const halfExtents = this._modelsAabb.halfExtents;

    let distance = Math.max(halfExtents.x, Math.max(halfExtents.y, halfExtents.z));
    distance /= Math.tan(0.5 * this.entity.camera.fov * pc.math.DEG_TO_RAD);
    distance *= 2;

    this.distance = distance;

    this._removeInertia();

    this._pivotPoint.copy(this._modelsAabb.center);
  }

  _updatePosition() {
    // Work out the camera position based on the pivot point, pitch, yaw and distance
    this.entity.setLocalPosition(0, 0, 0);
    this.entity.setLocalEulerAngles(this._pitch, this._yaw, 0);

    const position = this.entity.getPosition();
    position.copy(this.entity.forward);
    position.scale(-this._distance * this.distanceFactor);
    position.add(this.pivotPoint);
    this.entity.setPosition(position);
  }


  _removeInertia() {
    this._yaw = this._targetYaw;
    this._pitch = this._targetPitch;
    this._distance = this._targetDistance;
  }


  _checkAspectRatio() {
    const height = this.app.graphicsDevice.height;
    const width = this.app.graphicsDevice.width;

    // Match the axis of FOV to match the aspect ratio of the canvas so
    // the focused entities is always in frame
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
        } else {
          this._modelsAabb.add(mi[i].aabb);
        }

        modelsAdded += 1;
      }
    }

    for (i = 1; i <= entity.children.length; i += 1) {
      modelsAdded += this._buildAabb(entity.children[i], modelsAdded);
    }

    return modelsAdded;
  }

  static _calcYaw(quat) {
    const transformedForward = new pc.Vec3();
    quat.transformVector(pc.Vec3.FORWARD, transformedForward);

    return Math.atan2(-transformedForward.x, -transformedForward.z) * pc.math.RAD_TO_DEG;
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

  set pivotPoint(value) {
    this._pivotPoint.copy(value);
  }
}
