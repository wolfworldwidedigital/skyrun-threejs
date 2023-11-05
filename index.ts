import * as THREE from 'three';

const scene = new THREE.Scene();

const camera = new THREE.OrthographicCamera(
  window.innerWidth / -2,
  window.innerWidth / 2,
  window.innerHeight / 2,
  window.innerHeight / -2,
  1,
  1000
);

camera.position.z = 1;

const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const setVideoBackground = () => {
  const video = document.createElement('video');
  video.autoplay = true;
  video.loop = true;
  video.muted = true;
  video.src = 'https://skyrun.pictures/wp-content/uploads/2023/10/homevid.mp4';
  video.style.position = 'fixed';
  video.style.width = '100%';
  video.style.height = '100%';
  video.style.top = '0';
  video.style.left = '0';
  video.style.zIndex = '-1';
  video.style.objectFit = 'cover';
  document.body.appendChild(video);
};

setVideoBackground();

// Create and set the custom cursor
const cursor: HTMLImageElement = document.createElement('img');
cursor.src = 'https://skyrun.pictures/wp-content/uploads/2023/11/brown.png';
cursor.classList.add('custom-cursor');
document.body.appendChild(cursor);

document.addEventListener('mousemove', (e: MouseEvent) => {
  cursor.style.left = `${e.clientX}px`;
  cursor.style.top = `${e.clientY}px`;
});

// Create an element that responds to mouse interaction
const interactiveElement = new THREE.Mesh(
  new THREE.PlaneGeometry(window.innerWidth, window.innerHeight),
  new THREE.MeshBasicMaterial({ visible: false }) // Invisible mesh that will catch mouse events
);
scene.add(interactiveElement);

const scrollContainer = document.getElementById('scroll-container');

// Only add event listeners if scrollContainer is not null
if (scrollContainer) {
  let startX;
  let scrollLeft;

  scrollContainer.addEventListener('touchstart', (e) => {
    startX = e.touches[0].pageX - scrollContainer.offsetLeft;
    scrollLeft = scrollContainer.scrollLeft;
  }, { passive: true });

  scrollContainer.addEventListener('touchmove', (e) => {
    e.preventDefault(); // Prevent the default vertical scroll
    const x = e.touches[0].pageX - scrollContainer.offsetLeft;
    const walk = (x - startX) * 2; // Multiply for speed
    scrollContainer.scrollLeft = scrollLeft - walk;
  }, { passive: false });
}

// Set up raycaster for mouse interaction
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

document.addEventListener('mousemove', (event) => {
  // Calculate mouse position in normalized device coordinates
  // (-1 to +1) for both components
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Update the picking ray with the camera and mouse position
  raycaster.setFromCamera(mouse, camera);

  // Calculate objects intersecting the picking ray
  const intersects = raycaster.intersectObjects(scene.children);

  if (intersects.length > 0) {
    // Handle interaction with the invisible plane
    // Change cursor image or other effects
    cursor.src = 'https://skyrun.pictures/wp-content/uploads/2023/11/red.png';
  } else {
    cursor.src = 'https://skyrun.pictures/wp-content/uploads/2023/11/brown.png';
  }
});

// Render loop
const animate = () => {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
};

animate();
