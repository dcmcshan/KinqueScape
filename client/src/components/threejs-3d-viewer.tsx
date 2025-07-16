import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three-stdlib';
import { OrbitControls } from 'three-stdlib';
import type { RoomDevice, RoomParticipant } from '@shared/schema';

interface ThreeJS3DViewerProps {
  modelPath: string;
  devices: RoomDevice[];
  participants: RoomParticipant[];
  onDeviceClick?: (device: RoomDevice) => void;
  onParticipantClick?: (participant: RoomParticipant) => void;
}

export default function ThreeJS3DViewer({
  modelPath,
  devices,
  participants,
  onDeviceClick,
  onParticipantClick
}: ThreeJS3DViewerProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const controlsRef = useRef<OrbitControls>();
  const deviceMeshesRef = useRef<Map<number, THREE.Mesh>>(new Map());
  const participantMeshesRef = useRef<Map<number, THREE.Mesh>>(new Map());
  const raycasterRef = useRef<THREE.Raycaster>();
  const mouseRef = useRef<THREE.Vector2>();

  useEffect(() => {
    if (!mountRef.current) return;

    // Initialize Three.js scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0a);
    sceneRef.current = scene;

    // Initialize camera
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 5, 10);
    cameraRef.current = camera;

    // Initialize renderer
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true 
    });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    rendererRef.current = renderer;
    mountRef.current.appendChild(renderer.domElement);

    // Initialize controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = true;
    controls.enablePan = true;
    controlsRef.current = controls;

    // Initialize raycaster for mouse interactions
    raycasterRef.current = new THREE.Raycaster();
    mouseRef.current = new THREE.Vector2();

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    // Add red accent lighting for Tron theme
    const accentLight = new THREE.PointLight(0xff0040, 0.5, 50);
    accentLight.position.set(0, 5, 0);
    scene.add(accentLight);

    // Load GLB model
    const loader = new GLTFLoader();
    loader.load(
      modelPath,
      (gltf) => {
        console.log('GLB model loaded successfully:', gltf);
        
        // Add the model to the scene
        scene.add(gltf.scene);
        
        // Enable shadows for the model
        gltf.scene.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        // Auto-fit camera to model
        const box = new THREE.Box3().setFromObject(gltf.scene);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        
        const maxDim = Math.max(size.x, size.y, size.z);
        const fov = camera.fov * (Math.PI / 180);
        let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));
        
        camera.position.set(center.x, center.y + maxDim * 0.5, center.z + cameraZ * 1.5);
        camera.lookAt(center);
        controls.target.copy(center);
        controls.update();
      },
      (progress) => {
        console.log('Loading progress:', (progress.loaded / progress.total * 100) + '%');
      },
      (error) => {
        console.error('Error loading GLB model:', error);
        
        // Fallback: Create a simple room if model fails to load
        const geometry = new THREE.BoxGeometry(20, 6, 20);
        const material = new THREE.MeshPhongMaterial({ 
          color: 0x333333,
          transparent: true,
          opacity: 0.1,
          wireframe: true
        });
        const room = new THREE.Mesh(geometry, material);
        room.position.y = 3;
        scene.add(room);

        // Add floor
        const floorGeometry = new THREE.PlaneGeometry(20, 20);
        const floorMaterial = new THREE.MeshPhongMaterial({ color: 0x222222 });
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.rotation.x = -Math.PI / 2;
        floor.receiveShadow = true;
        scene.add(floor);
      }
    );

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Handle window resize
    const handleResize = () => {
      if (!mountRef.current) return;
      
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };
    
    window.addEventListener('resize', handleResize);

    // Mouse click handler
    const handleClick = (event: MouseEvent) => {
      if (!mountRef.current || !raycasterRef.current || !mouseRef.current) return;

      const rect = mountRef.current.getBoundingClientRect();
      mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycasterRef.current.setFromCamera(mouseRef.current, camera);
      
      // Check for device clicks
      const deviceIntersects = raycasterRef.current.intersectObjects(
        Array.from(deviceMeshesRef.current.values())
      );
      if (deviceIntersects.length > 0) {
        const clickedMesh = deviceIntersects[0].object as THREE.Mesh;
        const device = devices.find(d => deviceMeshesRef.current.get(d.id) === clickedMesh);
        if (device && onDeviceClick) {
          onDeviceClick(device);
        }
        return;
      }

      // Check for participant clicks
      const participantIntersects = raycasterRef.current.intersectObjects(
        Array.from(participantMeshesRef.current.values())
      );
      if (participantIntersects.length > 0) {
        const clickedMesh = participantIntersects[0].object as THREE.Mesh;
        const participant = participants.find(p => participantMeshesRef.current.get(p.id) === clickedMesh);
        if (participant && onParticipantClick) {
          onParticipantClick(participant);
        }
      }
    };

    renderer.domElement.addEventListener('click', handleClick);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('click', handleClick);
      if (mountRef.current && renderer.domElement.parentNode === mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [modelPath]);

  // Update devices
  useEffect(() => {
    if (!sceneRef.current) return;

    // Clear existing device meshes
    deviceMeshesRef.current.forEach((mesh) => {
      sceneRef.current!.remove(mesh);
    });
    deviceMeshesRef.current.clear();

    // Add new device meshes
    devices.forEach((device) => {
      const geometry = new THREE.SphereGeometry(0.3, 16, 16);
      
      // Color based on device type and status
      let color = 0x666666;
      if (device.status === 'online') {
        switch (device.type) {
          case 'light': color = 0xffff00; break;
          case 'camera': color = 0x00ff00; break;
          case 'lock': color = 0xff0000; break;
          case 'sensor': color = 0x0080ff; break;
          case 'sound': color = 0xff8000; break;
          case 'prop': color = 0xff0080; break;
          case 'display': color = 0x80ff00; break;
          default: color = 0xffffff;
        }
      }

      const material = new THREE.MeshPhongMaterial({ 
        color,
        emissive: device.status === 'online' ? color : 0x000000,
        emissiveIntensity: device.status === 'online' ? 0.2 : 0
      });
      
      const mesh = new THREE.Mesh(geometry, material);
      
      // Position device (convert to Three.js coordinate system)
      mesh.position.set(
        device.positionX || 0,
        device.positionZ || 1, // Y becomes height
        -(device.positionY || 0) // Flip Z for proper orientation
      );
      
      mesh.castShadow = true;
      sceneRef.current.add(mesh);
      deviceMeshesRef.current.set(device.id, mesh);
    });
  }, [devices]);

  // Update participants
  useEffect(() => {
    if (!sceneRef.current) return;

    // Clear existing participant meshes
    participantMeshesRef.current.forEach((mesh) => {
      sceneRef.current!.remove(mesh);
    });
    participantMeshesRef.current.clear();

    // Add new participant meshes
    participants.forEach((participant) => {
      const geometry = new THREE.CylinderGeometry(0.3, 0.3, 1.8, 8);
      const material = new THREE.MeshPhongMaterial({ 
        color: 0x00ffff,
        emissive: 0x004444,
        emissiveIntensity: 0.3
      });
      
      const mesh = new THREE.Mesh(geometry, material);
      
      // Position participant
      mesh.position.set(
        participant.positionX || 0,
        0.9, // Half height of cylinder
        -(participant.positionY || 0)
      );
      
      mesh.castShadow = true;
      sceneRef.current.add(mesh);
      participantMeshesRef.current.set(participant.id, mesh);
    });
  }, [participants]);

  return (
    <div className="relative w-full h-[600px] tron-card rounded-lg overflow-hidden">
      <div className="absolute top-4 left-4 z-10 bg-background/80 backdrop-blur-sm tron-border border rounded-lg p-3">
        <h3 className="text-sm font-semibold text-accent mb-1">3D Room View</h3>
        <p className="text-xs text-muted-foreground">
          Mouse: Orbit • Wheel: Zoom • Click: Interact
        </p>
      </div>
      <div ref={mountRef} className="w-full h-full" />
    </div>
  );
}