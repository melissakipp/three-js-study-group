import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import GUI from 'lil-gui';

/**
 * Textures
 */
const loadingManager = new THREE.LoadingManager()
loadingManager.onStart = () => {
  console.log('loadingManager: loading started')
}
loadingManager.onLoad = () => {
  console.log('loadingManager: loading finished')
}
loadingManager.onProgress = () => {
  console.log('loadingManager: loading progressing')
}
loadingManager.onError = () => {
  console.log('loadingManager: loading error')
}

const textureLoader = new THREE.TextureLoader(loadingManager);
const colorTexture = textureLoader.load(
  '/../../../static/minecraft.png', 
  () => {
      console.log('textureLoader: loading finished');
  },
  () => {
    console.log('textureLoader: loading progressing');
  },
  () => {
    console.log('textureLoader: loading error');
  }
);
/**
 * Debug
 */
const gui = new GUI({
  width: 300,
  title: 'Debug UI Tool',
  closeFolders: false
});
window.addEventListener('keydown', (event) => {
  if(event.key == 'h')
      gui.show(gui._hidden)
});
const debugObject = {};

// Canvas
const canvas = document.querySelector('canvas#webgl');
// Scene
const scene = new THREE.Scene();
// Axes Helper
const axesHelper = new THREE.AxesHelper(2);
scene.add(axesHelper);
// size
const size = {
    width: 600,
    height: 600
};
// Objects
const group = new THREE.Group();
group.scale.y = 1;
group.rotation.y = 0.2;
scene.add(group);
const cube1 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 'yellow' })
);
cube1.position.x = - 1.25;
group.add(cube1);
const cube2 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 'blue' })
);
cube2.position.x = 0;
group.add(cube2);
const cube3 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 'purple'})
);
cube3.position.x = 1.5;
group.add(cube3);

// Camera
const camera = new THREE.PerspectiveCamera(75, size.width / size.height);
camera.position.z = 3;
scene.add(camera);
// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
});
renderer.setSize(size.width, size.height);
renderer.render(scene, camera);


/**
 * Animation
 */
const animation = document.querySelector('canvas#animation');
// Scene
const sceneTwo = new THREE.Scene();
// Set the background color
sceneTwo.background = new THREE.Color(0xf8f8f8); 
// Axes Helper
const axesHelperTwo = new THREE.AxesHelper();
sceneTwo.add(axesHelperTwo);
// Objects
debugObject.color = '#63478c';
const customCube = new THREE.BoxGeometry(1, 1, 1, 3, 3, 3);
// const material = new THREE.MeshBasicMaterial({ color: debugObject });
const material = new THREE.MeshBasicMaterial({ map: colorTexture });
const mesh = new THREE.Mesh(customCube, material);
sceneTwo.add(mesh);
// GUI
gui.add(mesh.position, 'y').min(-3).max(3).step(0.01).name('Elevation');
gui.add(mesh, 'visible');
gui.add(mesh.material, 'wireframe');
gui.addColor(debugObject, 'color')
  .onChange(() => {
    debugObject.material.color.set(debugObject.material.color);
  });

debugObject.spin = () =>
{
    gsap.to(mesh.rotation, { duration: 1, y: mesh.rotation.y + Math.PI * 2 })
}
// Camera
const cameraTwo = new THREE.PerspectiveCamera(75, size.width / size.height, 0.1, 100);
cameraTwo.position.x = 2;
cameraTwo.position.y = 2;
cameraTwo.position.z = 3;
// cameraTwo.lookAt(geometry.position);
sceneTwo.add(cameraTwo);
// Controls
const controls = new OrbitControls(cameraTwo, animation);
controls.enableDamping = true;
// Renderer
const rendererTwo = new THREE.WebGLRenderer({
  canvas: animation
});
rendererTwo.setSize(size.width, size.height);
rendererTwo.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Cursor
 */
const cursor = {
  x: 0,
  y: 0
};
window.addEventListener('mousemove', (event) => {
  cursor.x = event.clientX / size.width - 0.5;
  cursor.y = -(event.clientY / size.height - 0.5);
});
const clock = new THREE.Clock();
const tick = () =>{
  const elapsedTime = clock.getElapsedTime();
  // Update objects
  // cubeOne.rotation.y = elapsedTime;
  // Update controls
  controls.update();
  // Render
  rendererTwo.render(sceneTwo, cameraTwo);
  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};
tick();
