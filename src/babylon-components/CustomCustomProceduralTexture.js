import { __extends } from "tslib";
import { Logger } from "@babylonjs/core/Misc/logger";
import { Vector3, Vector2 } from "@babylonjs/core/Maths/math.vector";
import { Color4, Color3 } from '@babylonjs/core/Maths/math.color';
import { Texture } from "@babylonjs/core/Materials/Textures/texture";
import { ProceduralTexture } from "@babylonjs/core/Materials/Textures/Procedurals/proceduralTexture";
import { WebRequest } from '@babylonjs/core/Misc/webRequest';
/**
 * Procedural texturing is a way to programmatically create a texture. There are 2 types of procedural textures: code-only, and code that references some classic 2D images, sometimes called 'refMaps' or 'sampler' images.
 * Custom Procedural textures are the easiest way to create your own procedural in your application.
 * @see https://doc.babylonjs.com/how_to/how_to_use_procedural_textures#creating-custom-procedural-textures
 */
var CustomCustomProceduralTexture = /** @class */ (function (_super) {
    __extends(CustomCustomProceduralTexture, _super);
    /**
     * Instantiates a new Custom Procedural Texture.
     * Procedural texturing is a way to programmatically create a texture. There are 2 types of procedural textures: code-only, and code that references some classic 2D images, sometimes called 'refMaps' or 'sampler' images.
     * Custom Procedural textures are the easiest way to create your own procedural in your application.
     * @see https://doc.babylonjs.com/how_to/how_to_use_procedural_textures#creating-custom-procedural-textures
     * @param name Define the name of the texture
     * @param texturePath Define the folder path containing all the cutom texture related files (config, shaders...)
     * @param size Define the size of the texture to create
     * @param scene Define the scene the texture belongs to
     * @param fallbackTexture Define a fallback texture in case there were issues to create the custom texture
     * @param generateMipMaps Define if the texture should creates mip maps or not
     */
    function CustomCustomProceduralTexture(name, texturePath, size, scene, fallbackTexture, generateMipMaps, isCube, type) {
        var _this = _super.call(this, name, size, null, scene, fallbackTexture, generateMipMaps, isCube, type) || this;
        _this._animate = true;
        _this._time = 0;
        _this._texturePath = texturePath;
        //Try to load json
        _this._loadJson(texturePath);
        _this.refreshRate = 1;
        return _this;
    }
    CustomCustomProceduralTexture.prototype._loadJson = function (jsonUrl) {
        var _this = this;
        var noConfigFile = function () {
            try {
                _this.setFragment(_this._texturePath);
            }
            catch (ex) {
                Logger.Error("No json or ShaderStore or DOM element found for CustomCustomProceduralTexture");
            }
        };
        var configFileUrl = jsonUrl + "/config.json";
        var xhr = new WebRequest();
        xhr.open("GET", configFileUrl);
        xhr.addEventListener("load", function () {
            if (xhr.status === 200 || (xhr.responseText && xhr.responseText.length > 0)) {
                try {
                    _this._config = JSON.parse(xhr.response);
                    _this.updateShaderUniforms();
                    _this.updateTextures();
                    _this.setFragment(_this._texturePath + "/custom");
                    _this._animate = _this._config.animate;
                    _this.refreshRate = _this._config.refreshrate;
                }
                catch (ex) {
                    noConfigFile();
                }
            }
            else {
                noConfigFile();
            }
        }, false);
        xhr.addEventListener("error", function () {
            noConfigFile();
        }, false);
        try {
            xhr.send();
        }
        catch (ex) {
            Logger.Error("CustomCustomProceduralTexture: Error on XHR send request.");
        }
    };
    /**
     * Is the texture ready to be used ? (rendered at least once)
     * @returns true if ready, otherwise, false.
     */
    CustomCustomProceduralTexture.prototype.isReady = function () {
        if (!_super.prototype.isReady.call(this)) {
            return false;
        }
        for (var name in this._textures) {
            var texture = this._textures[name];
            if (!texture.isReady()) {
                return false;
            }
        }
        return true;
    };
    /**
     * Render the texture to its associated render target.
     * @param useCameraPostProcess Define if camera post process should be applied to the texture
     */
    CustomCustomProceduralTexture.prototype.render = function (useCameraPostProcess) {
        var scene = this.getScene();
        if (this._animate && scene) {
            this._time += scene.getAnimationRatio() * 0.03;
            this.updateShaderUniforms();
        }
        _super.prototype.render.call(this, useCameraPostProcess);
    };
    /**
     * Update the list of dependant textures samplers in the shader.
     */
    CustomCustomProceduralTexture.prototype.updateTextures = function () {
        for (var i = 0; i < this._config.sampler2Ds.length; i++) {
            this.setTexture(this._config.sampler2Ds[i].sample2Dname, new Texture(this._texturePath + "/" + this._config.sampler2Ds[i].textureRelativeUrl, this.getScene()));
        }
    };
    /**
     * Update the uniform values of the procedural texture in the shader.
     */
    CustomCustomProceduralTexture.prototype.updateShaderUniforms = function () {
        if (this._config) {
            for (var j = 0; j < this._config.uniforms.length; j++) {
                var uniform = this._config.uniforms[j];
                switch (uniform.type) {
                    case "float":
                        this.setFloat(uniform.name, uniform.value);
                        break;
                    case "color3":
                        this.setColor3(uniform.name, new Color3(uniform.r, uniform.g, uniform.b));
                        break;
                    case "color4":
                        this.setColor4(uniform.name, new Color4(uniform.r, uniform.g, uniform.b, uniform.a));
                        break;
                    case "vector2":
                        this.setVector2(uniform.name, new Vector2(uniform.x, uniform.y));
                        break;
                    case "vector3":
                        this.setVector3(uniform.name, new Vector3(uniform.x, uniform.y, uniform.z));
                        break;
                }
            }
        }
        this.setFloat("time", this._time);
    };
    Object.defineProperty(CustomCustomProceduralTexture.prototype, "animate", {
        /**
         * Define if the texture animates or not.
         */
        get: function () {
            return this._animate;
        },
        set: function (value) {
            this._animate = value;
        },
        enumerable: false,
        configurable: true
    });
    return CustomCustomProceduralTexture;
}(ProceduralTexture));
export { CustomCustomProceduralTexture };
//# sourceMappingURL=CustomcustomProceduralTexture.js.map