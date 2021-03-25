import { makeName } from "../../hooks/useName";

export const makeSphereMesh = (assets) => {
    const name = makeName("sphere");
    const _mesh = assets.sphere.clone(name)
    _mesh.makeGeometryUnique();
    return _mesh
}