import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three-stdlib';
import { OrbitControls } from 'three-stdlib';
import type { RoomDevice, RoomParticipant } from '@shared/schema';

interface ThreeRoomRendererProps {
  devices: RoomDevice[];
  participants: RoomParticipant[];
  onDeviceClick?: (device: RoomDevice) => void;
  onParticipantClick?: (participant: RoomParticipant) => void;
}

export default function ThreeRoomRenderer({
  devices,
  participants,
  onDeviceClick,
  onParticipantClick
}: ThreeRoomRendererProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const controlsRef = useRef<OrbitControls>();

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a1a);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 5, 8);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;
    mountRef.current.appendChild(renderer.domElement);

    // Camera controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = true;
    controls.enableRotate = true;
    controls.enablePan = true;
    controls.maxDistance = 20;
    controls.minDistance = 2;
    controls.maxPolarAngle = Math.PI / 2.2; // Prevent going below floor
    controlsRef.current = controls;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    // Create dungeon room geometry
    createDungeonRoom(scene);

    // Add devices to scene
    devices.forEach(device => {
      const deviceMesh = createDeviceMesh(device);
      scene.add(deviceMesh);
    });

    // Add participants to scene
    participants.forEach(participant => {
      const participantMesh = createParticipantMesh(participant);
      scene.add(participantMesh);
    });

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update(); // Update controls for damping
      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!mountRef.current) return;
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      controls.update();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Update devices when they change
  useEffect(() => {
    if (!sceneRef.current) return;

    // Remove existing device meshes
    const existingDevices = sceneRef.current.children.filter(
      child => child.userData.type === 'device'
    );
    existingDevices.forEach(device => sceneRef.current!.remove(device));

    // Add new device meshes
    devices.forEach(device => {
      const deviceMesh = createDeviceMesh(device);
      sceneRef.current!.add(deviceMesh);
    });
  }, [devices]);

  // Update participants when they change
  useEffect(() => {
    if (!sceneRef.current) return;

    // Remove existing participant meshes
    const existingParticipants = sceneRef.current.children.filter(
      child => child.userData.type === 'participant'
    );
    existingParticipants.forEach(participant => sceneRef.current!.remove(participant));

    // Add new participant meshes
    participants.forEach(participant => {
      const participantMesh = createParticipantMesh(participant);
      sceneRef.current!.add(participantMesh);
    });
  }, [participants]);

  return (
    <div 
      ref={mountRef} 
      className="w-full h-full bg-gray-900 rounded-lg overflow-hidden"
      style={{ minHeight: '400px' }}
    />
  );
}

function createDungeonRoom(scene: THREE.Scene) {
  // Create dungeon floor with stone texture
  const floorGeometry = new THREE.PlaneGeometry(5.9, 6.4);
  const floorMaterial = new THREE.MeshLambertMaterial({ 
    color: 0x3a3a3a,
    side: THREE.DoubleSide 
  });
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -1.5;
  floor.receiveShadow = true;
  scene.add(floor);

  // Add stone floor tiles for detail
  for (let x = -2.5; x <= 2.5; x += 0.5) {
    for (let z = -3; z <= 3; z += 0.5) {
      const tileGeo = new THREE.PlaneGeometry(0.45, 0.45);
      const tileMat = new THREE.MeshLambertMaterial({ 
        color: 0x2a2a2a + Math.random() * 0x202020 
      });
      const tile = new THREE.Mesh(tileGeo, tileMat);
      tile.rotation.x = -Math.PI / 2;
      tile.position.set(x, -1.49, z);
      tile.receiveShadow = true;
      scene.add(tile);
    }
  }

  // Create walls with proper dungeon shape and stone texture
  const wallHeight = 2.9;
  const wallThickness = 0.2;

  // Enhanced stone wall material
  const wallMaterial = new THREE.MeshLambertMaterial({ 
    color: 0x5a4a3a
  });

  // Front wall
  const frontWallGeo = new THREE.BoxGeometry(5.9, wallHeight, wallThickness);
  const frontWall = new THREE.Mesh(frontWallGeo, wallMaterial);
  frontWall.position.set(0, 0, 3.2);
  frontWall.castShadow = true;
  frontWall.receiveShadow = true;
  scene.add(frontWall);

  // Left wall
  const leftWallGeo = new THREE.BoxGeometry(wallThickness, wallHeight, 6.4);
  const leftWall = new THREE.Mesh(leftWallGeo, wallMaterial);
  leftWall.position.set(-2.95, 0, 0);
  leftWall.castShadow = true;
  scene.add(leftWall);

  // Right wall
  const rightWallGeo = new THREE.BoxGeometry(wallThickness, wallHeight, 6.4);
  const rightWall = new THREE.Mesh(rightWallGeo, wallMaterial);
  rightWall.position.set(2.95, 0, 0);
  rightWall.castShadow = true;
  scene.add(rightWall);

  // Back wall with angled corners
  const backWallGeo = new THREE.BoxGeometry(3.5, wallHeight, wallThickness);
  const backWall = new THREE.Mesh(backWallGeo, wallMaterial);
  backWall.position.set(0, 0, -3.2);
  backWall.castShadow = true;
  scene.add(backWall);

  // Angled corner walls
  const angleWallGeo = new THREE.BoxGeometry(1.5, wallHeight, wallThickness);
  const leftAngleWall = new THREE.Mesh(angleWallGeo, wallMaterial);
  leftAngleWall.position.set(-2.2, 0, -3.2);
  leftAngleWall.rotation.y = Math.PI / 6;
  leftAngleWall.castShadow = true;
  scene.add(leftAngleWall);

  const rightAngleWall = new THREE.Mesh(angleWallGeo, wallMaterial);
  rightAngleWall.position.set(2.2, 0, -3.2);
  rightAngleWall.rotation.y = -Math.PI / 6;
  rightAngleWall.castShadow = true;
  scene.add(rightAngleWall);

  // Add medieval windows
  addMedievalWindow(scene, 1.5, 0.5, 3.15);
  addMedievalWindow(scene, -1.5, 0.5, 3.15);
}

function addMedievalWindow(scene: THREE.Scene, x: number, y: number, z: number) {
  const windowFrame = new THREE.BoxGeometry(0.8, 1.2, 0.05);
  const frameMaterial = new THREE.MeshLambertMaterial({ color: 0x2F4F4F });
  const window = new THREE.Mesh(windowFrame, frameMaterial);
  window.position.set(x, y, z);
  scene.add(window);

  // Window bars
  const barMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
  
  // Vertical bar
  const vBarGeo = new THREE.BoxGeometry(0.05, 1.2, 0.05);
  const vBar = new THREE.Mesh(vBarGeo, barMaterial);
  vBar.position.set(x, y, z + 0.01);
  scene.add(vBar);

  // Horizontal bar
  const hBarGeo = new THREE.BoxGeometry(0.8, 0.05, 0.05);
  const hBar = new THREE.Mesh(hBarGeo, barMaterial);
  hBar.position.set(x, y, z + 0.01);
  scene.add(hBar);
}

function createDeviceMesh(device: RoomDevice): THREE.Mesh {
  let geometry: THREE.BufferGeometry;
  let material: THREE.Material;

  switch (device.type) {
    case 'light':
      geometry = new THREE.SphereGeometry(0.1, 8, 8);
      material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
      break;
    case 'camera':
      geometry = new THREE.BoxGeometry(0.15, 0.1, 0.1);
      material = new THREE.MeshLambertMaterial({ color: 0x333333 });
      break;
    case 'sensor':
      geometry = new THREE.CylinderGeometry(0.05, 0.05, 0.1, 8);
      material = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
      break;
    case 'lock':
      geometry = new THREE.BoxGeometry(0.2, 0.3, 0.1);
      material = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
      break;
    default:
      geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
      material = new THREE.MeshLambertMaterial({ color: 0xff0000 });
  }

  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(device.x || 0, device.y || 0, device.z || 0);
  mesh.userData = { type: 'device', device };
  mesh.castShadow = true;

  return mesh;
}

function createParticipantMesh(participant: RoomParticipant): THREE.Mesh {
  const geometry = new THREE.CapsuleGeometry(0.3, 1.5, 4, 8);
  const material = new THREE.MeshLambertMaterial({ color: 0x0080ff });
  
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(participant.x || 0, participant.y || 0, participant.z || 0);
  mesh.userData = { type: 'participant', participant };
  mesh.castShadow = true;

  return mesh;
}