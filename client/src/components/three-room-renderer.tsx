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
      const deviceGroup = createDeviceMesh(device);
      scene.add(deviceGroup);
    });

    // Add participants to scene
    participants.forEach(participant => {
      const participantMesh = createParticipantMesh(participant);
      scene.add(participantMesh);
    });

    // Animation loop with heartbeat animation
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update(); // Update controls for damping
      
      // Animate heartbeat indicators
      const time = Date.now() * 0.005;
      scene.traverse((child) => {
        if (child.userData.type === 'heartbeat') {
          // Pulse effect: scale and opacity based on sine wave
          const pulse = Math.sin(time * 2) * 0.5 + 0.5; // 0 to 1
          child.scale.setScalar(0.8 + pulse * 0.4); // Scale from 0.8 to 1.2
          if (child.material) {
            child.material.opacity = 0.6 + pulse * 0.4; // Opacity from 0.6 to 1.0
          }
        }
      });
      
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
      const deviceGroup = createDeviceMesh(device);
      sceneRef.current!.add(deviceGroup);
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
      const participantGroup = createParticipantMesh(participant);
      sceneRef.current!.add(participantGroup);
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

function createDeviceMesh(device: RoomDevice): THREE.Group {
  const deviceGroup = new THREE.Group();
  let mainMesh: THREE.Mesh;
  let iconColor: number;
  
  switch (device.type) {
    case 'light':
      // Light bulb shape
      const bulbGeometry = new THREE.SphereGeometry(0.08, 12, 12);
      const bulbMaterial = new THREE.MeshLambertMaterial({ 
        color: device.status === 'online' ? 0xffff00 : 0x666666,
        emissive: device.status === 'online' ? 0xffff00 : 0x000000,
        emissiveIntensity: 0.3
      });
      mainMesh = new THREE.Mesh(bulbGeometry, bulbMaterial);
      
      // Light fixture
      const fixtureGeometry = new THREE.CylinderGeometry(0.12, 0.12, 0.05, 8);
      const fixtureMaterial = new THREE.MeshLambertMaterial({ color: 0x888888 });
      const fixture = new THREE.Mesh(fixtureGeometry, fixtureMaterial);
      fixture.position.y = 0.1;
      deviceGroup.add(fixture);
      iconColor = 0xffff00;
      break;
      
    case 'camera':
      // Camera body
      const cameraGeometry = new THREE.BoxGeometry(0.15, 0.1, 0.12);
      const cameraMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
      mainMesh = new THREE.Mesh(cameraGeometry, cameraMaterial);
      
      // Camera lens
      const lensGeometry = new THREE.CylinderGeometry(0.04, 0.04, 0.02, 16);
      const lensMaterial = new THREE.MeshLambertMaterial({ color: 0x111111 });
      const lens = new THREE.Mesh(lensGeometry, lensMaterial);
      lens.rotation.x = Math.PI / 2;
      lens.position.z = 0.07;
      deviceGroup.add(lens);
      
      // Status LED
      const ledGeometry = new THREE.SphereGeometry(0.01, 8, 8);
      const ledMaterial = new THREE.MeshLambertMaterial({ 
        color: device.status === 'online' ? 0x00ff00 : 0xff0000,
        emissive: device.status === 'online' ? 0x00ff00 : 0xff0000,
        emissiveIntensity: 0.5
      });
      const led = new THREE.Mesh(ledGeometry, ledMaterial);
      led.position.set(0.06, 0.04, 0.05);
      deviceGroup.add(led);
      iconColor = 0x666666;
      break;
      
    case 'sensor':
      // Sensor body
      const sensorGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.12, 8);
      const sensorMaterial = new THREE.MeshLambertMaterial({ 
        color: device.status === 'online' ? 0x00ff00 : 0x666666 
      });
      mainMesh = new THREE.Mesh(sensorGeometry, sensorMaterial);
      
      // Sensor top
      const topGeometry = new THREE.SphereGeometry(0.03, 8, 8);
      const topMaterial = new THREE.MeshLambertMaterial({ color: 0x444444 });
      const top = new THREE.Mesh(topGeometry, topMaterial);
      top.position.y = 0.08;
      deviceGroup.add(top);
      iconColor = 0x00ff00;
      break;
      
    case 'lock':
      // Lock body
      const lockGeometry = new THREE.BoxGeometry(0.2, 0.25, 0.08);
      const lockMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
      mainMesh = new THREE.Mesh(lockGeometry, lockMaterial);
      
      // Lock shackle
      const shackleGeometry = new THREE.TorusGeometry(0.06, 0.02, 8, 16, Math.PI);
      const shackleMaterial = new THREE.MeshLambertMaterial({ color: 0x666666 });
      const shackle = new THREE.Mesh(shackleGeometry, shackleMaterial);
      shackle.position.y = 0.1;
      shackle.rotation.x = Math.PI;
      deviceGroup.add(shackle);
      iconColor = 0x8B4513;
      break;
      
    case 'sound':
      // Speaker cone
      const speakerGeometry = new THREE.ConeGeometry(0.08, 0.15, 12);
      const speakerMaterial = new THREE.MeshLambertMaterial({ color: 0x444444 });
      mainMesh = new THREE.Mesh(speakerGeometry, speakerMaterial);
      
      // Speaker grill
      const grillGeometry = new THREE.CylinderGeometry(0.09, 0.09, 0.02, 16);
      const grillMaterial = new THREE.MeshLambertMaterial({ color: 0x222222 });
      const grill = new THREE.Mesh(grillGeometry, grillMaterial);
      grill.position.y = 0.08;
      deviceGroup.add(grill);
      iconColor = 0x444444;
      break;
      
    default:
      // Generic device
      const genericGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
      const genericMaterial = new THREE.MeshLambertMaterial({ color: 0xff0000 });
      mainMesh = new THREE.Mesh(genericGeometry, genericMaterial);
      iconColor = 0xff0000;
  }
  
  mainMesh.castShadow = true;
  deviceGroup.add(mainMesh);
  
  // Add device name label
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d')!;
  canvas.width = 256;
  canvas.height = 64;
  context.fillStyle = '#ffffff';
  context.font = '16px Arial';
  context.textAlign = 'center';
  context.fillText(device.name || 'Device', 128, 30);
  context.fillStyle = device.status === 'online' ? '#00ff00' : '#ff0000';
  context.fillText(device.status || 'offline', 128, 50);
  
  const labelTexture = new THREE.CanvasTexture(canvas);
  const labelMaterial = new THREE.SpriteMaterial({ map: labelTexture });
  const labelSprite = new THREE.Sprite(labelMaterial);
  labelSprite.position.set(0, 0.3, 0);
  labelSprite.scale.set(0.5, 0.125, 1);
  deviceGroup.add(labelSprite);
  
  // Position the device group
  deviceGroup.position.set(device.x || 0, device.y || 0, device.z || 0);
  deviceGroup.userData = { type: 'device', device };
  
  return deviceGroup;
}

function createParticipantMesh(participant: RoomParticipant): THREE.Group {
  const stickFigure = new THREE.Group();
  
  // Stick figure material
  const stickMaterial = new THREE.MeshLambertMaterial({ color: 0x0080ff });
  const jointMaterial = new THREE.MeshLambertMaterial({ color: 0x00ff80 });
  
  // Head
  const headGeometry = new THREE.SphereGeometry(0.15, 8, 8);
  const head = new THREE.Mesh(headGeometry, jointMaterial);
  head.position.set(0, 1.6, 0);
  head.castShadow = true;
  stickFigure.add(head);
  
  // Body (torso)
  const bodyGeometry = new THREE.CylinderGeometry(0.05, 0.05, 1.0, 8);
  const body = new THREE.Mesh(bodyGeometry, stickMaterial);
  body.position.set(0, 1.0, 0);
  body.castShadow = true;
  stickFigure.add(body);
  
  // Arms
  const armGeometry = new THREE.CylinderGeometry(0.03, 0.03, 0.6, 8);
  
  // Left arm
  const leftArm = new THREE.Mesh(armGeometry, stickMaterial);
  leftArm.position.set(-0.3, 1.2, 0);
  leftArm.rotation.z = Math.PI / 4;
  leftArm.castShadow = true;
  stickFigure.add(leftArm);
  
  // Right arm
  const rightArm = new THREE.Mesh(armGeometry, stickMaterial);
  rightArm.position.set(0.3, 1.2, 0);
  rightArm.rotation.z = -Math.PI / 4;
  rightArm.castShadow = true;
  stickFigure.add(rightArm);
  
  // Legs
  const legGeometry = new THREE.CylinderGeometry(0.04, 0.04, 0.8, 8);
  
  // Left leg
  const leftLeg = new THREE.Mesh(legGeometry, stickMaterial);
  leftLeg.position.set(-0.15, 0.1, 0);
  leftLeg.castShadow = true;
  stickFigure.add(leftLeg);
  
  // Right leg
  const rightLeg = new THREE.Mesh(legGeometry, stickMaterial);
  rightLeg.position.set(0.15, 0.1, 0);
  rightLeg.castShadow = true;
  stickFigure.add(rightLeg);
  
  // Joint spheres for better visibility
  const jointGeometry = new THREE.SphereGeometry(0.08, 6, 6);
  
  // Shoulder joints
  const leftShoulder = new THREE.Mesh(jointGeometry, jointMaterial);
  leftShoulder.position.set(-0.2, 1.4, 0);
  stickFigure.add(leftShoulder);
  
  const rightShoulder = new THREE.Mesh(jointGeometry, jointMaterial);
  rightShoulder.position.set(0.2, 1.4, 0);
  stickFigure.add(rightShoulder);
  
  // Hip joint
  const hip = new THREE.Mesh(jointGeometry, jointMaterial);
  hip.position.set(0, 0.5, 0);
  stickFigure.add(hip);
  
  // Position the stick figure
  stickFigure.position.set(participant.positionX || 0, participant.positionY || -1, participant.positionZ || 0);
  stickFigure.userData = { type: 'participant', participant };
  
  // Add name label above head
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d')!;
  canvas.width = 256;
  canvas.height = 64;
  context.fillStyle = '#ffffff';
  context.font = '24px Arial';
  context.textAlign = 'center';
  context.fillText(participant.participantName || 'Unknown', 128, 40);
  
  const nameTexture = new THREE.CanvasTexture(canvas);
  const nameMaterial = new THREE.SpriteMaterial({ map: nameTexture });
  const nameSprite = new THREE.Sprite(nameMaterial);
  nameSprite.position.set(0, 2.2, 0);
  nameSprite.scale.set(1, 0.25, 1);
  stickFigure.add(nameSprite);
  
  // Add heartbeat indicator above name
  const heartGeometry = new THREE.SphereGeometry(0.08, 8, 8);
  const heartMaterial = new THREE.MeshBasicMaterial({ 
    color: 0xff0000,
    transparent: true,
    opacity: 0.8
  });
  const heartbeat = new THREE.Mesh(heartGeometry, heartMaterial);
  heartbeat.position.set(0, 2.6, 0);
  heartbeat.userData = { type: 'heartbeat', participantId: participant.id };
  stickFigure.add(heartbeat);
  
  return stickFigure;
}