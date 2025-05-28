import {
    Cartesian3,
    Matrix3,
    Matrix4,
    Quaternion
} from "cesium";

export function createTranslationRotationScaleFromModelMatrixOptional(
  matrix: Matrix4
) {
  const scale = Matrix4.getScale(matrix, new Cartesian3());
  const translation = Matrix4.getTranslation(matrix, new Cartesian3());

  const rotationMatrix = Matrix4.getRotation(matrix, new Matrix3());

  const rotation = Quaternion.fromRotationMatrix(
    rotationMatrix,
    new Quaternion()
  );

  return { scale, translation, rotation };
}

export function createModelMatrixFromModelMatrixAndOptionalTranslationOrRotationOrScale(
  matrix: Matrix4,
  translation?: Cartesian3,
  rotation?: Quaternion,
  scale?: Cartesian3
) {
  const newScale = scale ?? Matrix4.getScale(matrix, new Cartesian3());
  const newTranslation =
    translation ?? Matrix4.getTranslation(matrix, new Cartesian3());

  const rotationMatrix = Matrix4.getRotation(matrix, new Matrix3());

  const newRotation =
    rotation ?? Quaternion.fromRotationMatrix(rotationMatrix, new Quaternion());

  return Matrix4.fromTranslationQuaternionRotationScale(
    newTranslation,
    newRotation,
    newScale
  );
}
