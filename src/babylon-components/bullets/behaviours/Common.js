import { glsl } from "../../BabylonUtils"

export const collisionSnippet = glsl`
    float collidedWithAnything = clamp(collision.w, 0.0, 1.0);
    float noCollision = 1. - collidedWithAnything;

    out_Position = (collidedWithAnything * vec4(-1000000., -1000000., -1000000., 1.)) + (noCollision * out_Position);
`;