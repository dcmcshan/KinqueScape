import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three-stdlib';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Eye, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';
import type { RoomDevice, RoomParticipant } from '@shared/schema';

interface UnityWebGLViewerProps {
  modelPath: string;
  devices: RoomDevice[];
  participants: RoomParticipant[];
  onDeviceClick?: (device: RoomDevice) => void;
  onParticipantClick?: (participant: RoomParticipant) => void;
}

export default function UnityWebGLViewer({
  modelPath,
  devices,
  participants,
  onDeviceClick,
  onParticipantClick
}: UnityWebGLViewerProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cameraMode, setCameraMode] = useState<'orbit' | 'firstPerson'>('orbit');

  useEffect(() => {
    if (!mountRef.current) return;

    // Initialize Three.js scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0a);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(8, 8, 8);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.8;
    rendererRef.current = renderer;

    mountRef.current.appendChild(renderer.domElement);

    // Lighting setup for dungeon atmosphere
    const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
    scene.add(ambientLight);

    // Torch-like lighting
    const torchLight1 = new THREE.PointLight(0xff4500, 1, 20);
    torchLight1.position.set(-2, 2, 0);
    torchLight1.castShadow = true;
    scene.add(torchLight1);

    const torchLight2 = new THREE.PointLight(0xff4500, 1, 20);
    torchLight2.position.set(2, 2, 0);
    torchLight2.castShadow = true;
    scene.add(torchLight2);

    // Directional light for general illumination
    const directionalLight = new THREE.DirectionalLight(0x404040, 0.5);
    directionalLight.position.set(5, 10, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Create basic dungeon geometry if model fails to load
    const createBasicDungeon = () => {
      // Floor
      const floorGeometry = new THREE.PlaneGeometry(20, 20);
      const floorMaterial = new THREE.MeshLambertMaterial({ color: 0x2a2a2a });
      const floor = new THREE.Mesh(floorGeometry, floorMaterial);
      floor.rotation.x = -Math.PI / 2;
      floor.receiveShadow = true;
      scene.add(floor);

      // Walls
      const wallMaterial = new THREE.MeshLambertMaterial({ color: 0x3a3a3a });
      
      // Front wall
      const frontWall = new THREE.Mesh(new THREE.PlaneGeometry(20, 8), wallMaterial);
      frontWall.position.set(0, 4, -10);
      scene.add(frontWall);

      // Back wall
      const backWall = new THREE.Mesh(new THREE.PlaneGeometry(20, 8), wallMaterial);
      backWall.position.set(0, 4, 10);
      backWall.rotation.y = Math.PI;
      scene.add(backWall);

      // Left wall
      const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(20, 8), wallMaterial);
      leftWall.position.set(-10, 4, 0);
      leftWall.rotation.y = Math.PI / 2;
      scene.add(leftWall);

      // Right wall
      const rightWall = new THREE.Mesh(new THREE.PlaneGeometry(20, 8), wallMaterial);
      rightWall.position.set(10, 4, 0);
      rightWall.rotation.y = -Math.PI / 2;
      scene.add(rightWall);

      // Ceiling
      const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(20, 20), wallMaterial);
      ceiling.position.set(0, 8, 0);
      ceiling.rotation.x = Math.PI / 2;
      scene.add(ceiling);
    };

    // Load GLB model or create basic dungeon
    const loader = new GLTFLoader();
    
    // Always create basic dungeon for now since GLB loading needs proper asset handling
    createBasicDungeon();
    setIsLoading(false);
    setError(null);
    
    // Try to load GLB model if available
    if (modelPath && modelPath.includes('.glb')) {
      loader.load(
        modelPath,
        (gltf) => {
          // Clear basic dungeon and add loaded model
          const basicElements = scene.children.filter(child => 
            child.userData.type !== 'device' && child.userData.type !== 'participant'
          );
          basicElements.forEach(element => scene.remove(element));
          
          scene.add(gltf.scene);
          setError(null);
        },
        (progress) => {
          console.log('Loading progress:', progress.loaded / progress.total * 100);
        },
        (error) => {
          console.warn('GLB model not available, using basic dungeon:', error);
          // Keep basic dungeon as fallback
        }
      );
    }

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Animate torch lights
      const time = Date.now() * 0.001;
      torchLight1.intensity = 0.8 + Math.sin(time * 2) * 0.2;
      torchLight2.intensity = 0.8 + Math.sin(time * 2.5) * 0.2;
      
      renderer.render(scene, camera);
    };
    animate();

    // Handle window resize
    const handleResize = () => {
      if (!mountRef.current || !camera || !renderer) return;
      
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [modelPath]);

  // Add device markers
  useEffect(() => {
    if (!sceneRef.current) return;

    // Clear existing device markers
    const devicesToRemove = sceneRef.current.children.filter(child => 
      child.userData.type === 'device'
    );
    devicesToRemove.forEach(device => sceneRef.current!.remove(device));

    // Add new device markers
    devices.forEach(device => {
      const geometry = new THREE.SphereGeometry(0.2, 16, 16);
      const material = new THREE.MeshBasicMaterial({ 
        color: device.status === 'online' ? 0x00ff00 : 0xff0000,
        transparent: true,
        opacity: 0.8
      });
      const marker = new THREE.Mesh(geometry, material);
      
      if (device.location) {
        marker.position.set(device.location.x, device.location.y, device.location.z);
      }
      
      marker.userData = { type: 'device', data: device };
      sceneRef.current!.add(marker);
    });
  }, [devices]);

  // Add participant markers
  useEffect(() => {
    if (!sceneRef.current) return;

    // Clear existing participant markers and labels
    const participantsToRemove = sceneRef.current.children.filter(child => 
      child.userData.type === 'participant' || child.userData.type === 'participant-label'
    );
    participantsToRemove.forEach(participant => sceneRef.current!.remove(participant));

    // Add new participant markers (human-like figures)
    participants.forEach(participant => {
      const group = new THREE.Group();
      
      // Position participant within the dungeon bounds
      const x = (participant.positionX || 0) * 0.3; // Scale down positions
      const z = (participant.positionY || 0) * 0.3; // Use Y as Z coordinate
      
      // Create human-like figure
      const bodyMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x0099ff,
        transparent: true,
        opacity: 0.9
      });
      
      // Head
      const headGeometry = new THREE.SphereGeometry(0.15, 8, 8);
      const head = new THREE.Mesh(headGeometry, bodyMaterial);
      head.position.set(0, 1.6, 0);
      group.add(head);
      
      // Body (torso)
      const bodyGeometry = new THREE.BoxGeometry(0.4, 0.8, 0.2);
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
      body.position.set(0, 1.0, 0);
      group.add(body);
      
      // Arms
      const armGeometry = new THREE.BoxGeometry(0.1, 0.6, 0.1);
      const leftArm = new THREE.Mesh(armGeometry, bodyMaterial);
      leftArm.position.set(-0.3, 1.0, 0);
      group.add(leftArm);
      
      const rightArm = new THREE.Mesh(armGeometry, bodyMaterial);
      rightArm.position.set(0.3, 1.0, 0);
      group.add(rightArm);
      
      // Legs
      const legGeometry = new THREE.BoxGeometry(0.15, 0.6, 0.15);
      const leftLeg = new THREE.Mesh(legGeometry, bodyMaterial);
      leftLeg.position.set(-0.1, 0.3, 0);
      group.add(leftLeg);
      
      const rightLeg = new THREE.Mesh(legGeometry, bodyMaterial);
      rightLeg.position.set(0.1, 0.3, 0);
      group.add(rightLeg);
      
      // Position the entire figure
      group.position.set(x, 0, z);
      
      // Add a label above the participant
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d')!;
      canvas.width = 256;
      canvas.height = 64;
      context.fillStyle = '#ffffff';
      context.font = '20px Arial';
      context.fillText(participant.participantName, 10, 40);
      
      const texture = new THREE.CanvasTexture(canvas);
      const labelMaterial = new THREE.SpriteMaterial({ map: texture });
      const label = new THREE.Sprite(labelMaterial);
      label.position.set(x, 2.5, z);
      label.scale.set(2, 0.5, 1);
      
      group.userData = { type: 'participant', data: participant };
      label.userData = { type: 'participant-label', data: participant };
      
      sceneRef.current!.add(group);
      sceneRef.current!.add(label);
    });
  }, [participants]);

  const resetCamera = () => {
    if (cameraRef.current) {
      cameraRef.current.position.set(0, 5, 10);
      cameraRef.current.lookAt(0, 0, 0);
    }
  };

  const zoomIn = () => {
    if (cameraRef.current) {
      cameraRef.current.position.multiplyScalar(0.8);
    }
  };

  const zoomOut = () => {
    if (cameraRef.current) {
      cameraRef.current.position.multiplyScalar(1.2);
    }
  };

  return (
    <Card className="tron-card h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-accent flex items-center">
            <Eye className="w-5 h-5 mr-2" />
            Unity WebGL Viewer
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-xs">
              {participants.length} <Users className="w-3 h-3 ml-1" />
            </Badge>
            <Badge variant="outline" className="text-xs">
              {devices.filter(d => d.status === 'online').length}/{devices.length} Online
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* 3D Viewer */}
          <div 
            ref={mountRef} 
            className="w-full h-96 bg-black rounded-lg relative overflow-hidden"
            style={{ minHeight: '400px' }}
          >
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <div className="text-center">
                  <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                  <p className="text-accent text-sm">Loading 3D Environment...</p>
                </div>
              </div>
            )}
            
            {error && (
              <div className="absolute top-2 left-2 bg-yellow-500/10 border border-yellow-500/30 rounded px-2 py-1">
                <p className="text-yellow-500 text-xs">{error}</p>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="absolute bottom-4 left-4 flex space-x-2">
            <Button size="sm" variant="outline" onClick={resetCamera} className="tron-button">
              <RotateCcw className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="outline" onClick={zoomIn} className="tron-button">
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="outline" onClick={zoomOut} className="tron-button">
              <ZoomOut className="w-4 h-4" />
            </Button>
          </div>

          {/* Legend */}
          <div className="absolute bottom-4 right-4 bg-background/90 backdrop-blur-sm rounded p-2 text-xs">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-1"></div>
                <span>Participants</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
                <span>Devices Online</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div>
                <span>Devices Offline</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}