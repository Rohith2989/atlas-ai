import { vertexSource, fragmentSource } from './approach-shaders.js';

const files = ['founder', 'engineering', 'wafer'];
const urls = files.map(name => '/assets/approach/' + name + '.webp');
let decodedImages;

// Shared decoding survives layout rebuilds. No video, frame stack, or idle render loop.
export function preloadRevealArtwork() {
  if (!decodedImages) decodedImages = Promise.all(urls.map(src => new Promise((resolve, reject) => {
    const image = new Image();
    image.decoding = 'async';
    image.fetchPriority = 'low';
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Unable to load approach artwork'));
    image.src = src;
  }))).catch(error => { decodedImages = undefined; throw error; });
  return decodedImages;
}

export async function createRevealRenderer(stage, onFailure) {
  const images = await preloadRevealArtwork();
  const canvas = document.createElement('canvas');
  canvas.className = 'approach-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  const gl = canvas.getContext('webgl', {
    alpha: true, antialias: false, depth: false, stencil: false,
    premultipliedAlpha: true, powerPreference: 'low-power',
  });
  if (!gl) throw new Error('WebGL unavailable');

  let program, buffer, textures = [], uniforms, disposed = false, lost = false, last;
  function compile(type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const message = gl.getShaderInfoLog(shader);
      gl.deleteShader(shader);
      throw new Error(message);
    }
    return shader;
  }
  function init() {
    const vertex = compile(gl.VERTEX_SHADER, vertexSource);
    const fragment = compile(gl.FRAGMENT_SHADER, fragmentSource);
    program = gl.createProgram();
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    gl.deleteShader(vertex);
    gl.deleteShader(fragment);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program));
    gl.useProgram(program);
    buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]), gl.STATIC_DRAW);
    const location = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(location);
    gl.vertexAttribPointer(location, 2, gl.FLOAT, false, 0, 0);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
    textures = images.map((image, index) => {
      const texture = gl.createTexture();
      gl.activeTexture(gl.TEXTURE0 + index);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      gl.uniform1i(gl.getUniformLocation(program, 'u_' + files[index]), index);
      return texture;
    });
    uniforms = Object.fromEntries(['fit','progress','entry','portraitExit','engineeringIn','engineeringOut','waferIn','split']
      .map(name => [name, gl.getUniformLocation(program, 'u_' + name)]));
    gl.clearColor(0,0,0,0);
  }

  function resize() {
    if (disposed || lost) return;
    const rect = stage.getBoundingClientRect();
    const ratio = Math.min(window.devicePixelRatio || 1, 1.5, 1920 / Math.max(rect.width, 1));
    canvas.width = Math.max(1, Math.round(rect.width * ratio));
    canvas.height = Math.max(1, Math.round(rect.height * ratio));
    gl.viewport(0, 0, canvas.width, canvas.height);
    const scale = Math.min(rect.width / 1586, rect.height / 992);
    gl.uniform2f(uniforms.fit, 1586 * scale / rect.width, 992 * scale / rect.height);
    if (last) draw(last, true);
  }
  function draw(state, force = false) {
    if (disposed) return;
    const unchanged = last?.progress === state.progress;
    last = state;
    if (lost || (!force && unchanged)) return;
    gl.uniform1f(uniforms.progress, state.progress);
    gl.uniform1f(uniforms.split, state.split);
    gl.uniform4f(uniforms.entry, state.portrait, state.diffraction, state.drawing, 0);
    gl.uniform4fv(uniforms.portraitExit, state.portraitExit);
    gl.uniform4fv(uniforms.engineeringIn, state.engineering);
    gl.uniform4fv(uniforms.engineeringOut, state.engineeringExit);
    gl.uniform4f(uniforms.waferIn, state.wafer, state.hand, state.detail, state.aperture);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }
  function contextLost(event) {
    event.preventDefault();
    lost = true;
    stage.dataset.renderer = 'fallback';
  }
  function contextRestored() {
    if (disposed) return;
    try {
      lost = false;
      init();
      resize();
      stage.dataset.renderer = 'webgl';
    } catch (error) { lost = true; onFailure(error); }
  }
  try { init(); } catch (error) {
    textures.forEach(texture => gl.deleteTexture(texture));
    if (program) gl.deleteProgram(program);
    if (buffer) gl.deleteBuffer(buffer);
    throw error;
  }
  canvas.addEventListener('webglcontextlost', contextLost);
  canvas.addEventListener('webglcontextrestored', contextRestored);
  stage.append(canvas);
  resize();
  return {
    draw, resize,
    dispose() {
      disposed = true;
      canvas.removeEventListener('webglcontextlost', contextLost);
      canvas.removeEventListener('webglcontextrestored', contextRestored);
      if (!lost) {
        textures.forEach(texture => gl.deleteTexture(texture));
        gl.deleteBuffer(buffer);
        gl.deleteProgram(program);
      }
      canvas.remove();
    },
  };
}

