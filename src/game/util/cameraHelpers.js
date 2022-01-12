// Helping functions for camera
import * as THREE from 'three'

// returns true or false
// given a camera and a three.js's scene object, check is the object is visible on the canvas (screen)
export function isObjectWithinCamerasFrustrum (object, camera, canvas) {
  // TODO:
  const frustum = new THREE.Frustum()
  const cameraViewProjectionMatrix = new THREE.Matrix4()
  cameraViewProjectionMatrix.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse)
  frustum.setFromMatrix(cameraViewProjectionMatrix)
  return frustum.intersectsObject(object)
}
