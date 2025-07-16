import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three-stdlib';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Users, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';
import type { RoomDevice, RoomParticipant } from '@shared/schema';

interface ThreeJSWebGLViewerProps {
  devices: RoomDevice[];
  participants: RoomParticipant[];
  onDeviceClick?: (device: RoomDevice) => void;
  onParticipantClick?: (participant: RoomParticipant) => void;
}

export default function ThreeJSWebGLViewer({
  devices,
  participants,
  onDeviceClick,
  onParticipantClick,
}: ThreeJSWebGLViewerProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const roomModelRef = useRef<THREE.Group>();
  const deviceMeshesRef = useRef<Map<number, THREE.Mesh>>(new Map());
  const participantMeshesRef = useRef<Map<number, THREE.Mesh>>(new Map());
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize Three.js scene
  useEffect(() => {
    if (!mountRef.current) return;

    console.log('ThreeJS: Initializing 3D scene');

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0a);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      800 / 384,
      0.1,
      1000
    );
    camera.position.set(0, 8, 10);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(800, 384);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    mountRef.current.appendChild(renderer.domElement);

    // Lighting setup
    const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Load GLB model
    loadGLBModel('/unity-build/7_16_2025.glb');

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    animate();

    return () => {
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Load GLB model
  const loadGLBModel = async (path: string) => {
    console.log('ThreeJS: Loading GLB model from', path);
    
    try {
      const loader = new GLTFLoader();
      const gltf = await new Promise<any>((resolve, reject) => {
        loader.load(
          path,
          (gltf) => resolve(gltf),
          (progress) => {
            console.log('ThreeJS: Loading progress', (progress.loaded / progress.total * 100) + '%');
          },
          (error) => reject(error)
        );
      });

      console.log('ThreeJS: GLB model loaded successfully');
      
      const model = gltf.scene;
      model.scale.setScalar(1);
      model.position.set(0, 0, 0);
      
      // Enable shadows for all meshes
      model.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          
          // Enhance materials for dungeon look
          if (child.material) {
            const material = child.material as THREE.MeshStandardMaterial;
            if (material.map) {
              material.map.encoding = THREE.sRGBEncoding;
            }
          }
        }
      });

      roomModelRef.current = model;
      sceneRef.current?.add(model);
      setIsLoaded(true);
      
      // Add devices after model loads
      updateDeviceVisuals();
      
    } catch (error) {
      console.error('ThreeJS: Error loading GLB model:', error);
      setError('Failed to load 3D room model');
    }
  };

  // Update device visualizations
  const updateDeviceVisuals = () => {
    if (!sceneRef.current) return;

    console.log('ThreeJS: Updating device visuals for', devices.length, 'devices');

    // Clear existing device meshes
    deviceMeshesRef.current.forEach((mesh) => {
      sceneRef.current?.remove(mesh);
    });
    deviceMeshesRef.current.clear();

    // Add device meshes
    devices.forEach((device) => {
      const mesh = createDeviceMesh(device);
      if (mesh) {
        sceneRef.current?.add(mesh);
        deviceMeshesRef.current.set(device.id, mesh);
      }
    });
  };

  // Create 3D mesh for device
  const createDeviceMesh = (device: RoomDevice): THREE.Mesh | null => {
    let geometry: THREE.BufferGeometry;
    let material: THREE.Material;

    const position = device.location;

    switch (device.type) {
      case 'light':
        // Torch light with flame effect
        geometry = new THREE.SphereGeometry(0.3, 16, 16);
        material = new THREE.MeshBasicMaterial({ 
          color: device.status === 'online' ? 0xffff44 : 0x666666,
          emissive: device.status === 'online' ? 0xff6600 : 0x000000,
          emissiveIntensity: 0.5
        });
        
        // Add point light for illumination
        if (device.status === 'online') {
          const pointLight = new THREE.PointLight(0xffaa44, 2, 10);
          pointLight.position.set(position.x, position.y, position.z);
          pointLight.castShadow = true;
          sceneRef.current?.add(pointLight);
        }
        break;
        
      case 'prop':
        geometry = new THREE.BoxGeometry(0.8, 1.2, 0.8);
        material = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
        break;
        
      case 'lock':
        geometry = new THREE.CylinderGeometry(0.2, 0.2, 0.4, 8);
        material = new THREE.MeshStandardMaterial({ color: 0xff4444 });
        break;
        
      case 'camera':
        geometry = new THREE.ConeGeometry(0.2, 0.4, 8);
        material = new THREE.MeshStandardMaterial({ color: 0x4444ff });
        break;
        
      case 'sensor':
        geometry = new THREE.CylinderGeometry(0.3, 0.3, 0.1, 16);
        material = new THREE.MeshStandardMaterial({ color: 0xaa44ff });
        break;
        
      default:
        geometry = new THREE.SphereGeometry(0.2, 8, 8);
        material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    }

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(position.x, position.y, position.z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    
    // Store device reference for click handling
    (mesh as any).deviceData = device;
    
    return mesh;
  };

  // Update devices when props change
  useEffect(() => {
    if (isLoaded) {
      updateDeviceVisuals();
    }
  }, [devices, isLoaded]);

  // Handle mouse interactions
  useEffect(() => {
    if (!rendererRef.current || !cameraRef.current || !sceneRef.current) return;

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleClick = (event: MouseEvent) => {
      const rect = rendererRef.current!.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, cameraRef.current!);
      const intersects = raycaster.intersectObjects(Array.from(deviceMeshesRef.current.values()));

      if (intersects.length > 0) {
        const deviceData = (intersects[0].object as any).deviceData;
        if (deviceData && onDeviceClick) {
          console.log('ThreeJS: Device clicked:', deviceData.name);
          onDeviceClick(deviceData);
        }
      }
    };

    rendererRef.current.domElement.addEventListener('click', handleClick);

    return () => {
      rendererRef.current?.domElement.removeEventListener('click', handleClick);
    };
  }, [onDeviceClick, isLoaded]);

  const onlineDevices = devices.filter(d => d.status === 'online').length;
  const totalDevices = devices.length;

  return (
    <Card className="bg-gray-900 border-red-900">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-red-400 flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Three.js WebGL 3D Viewer
          </CardTitle>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="text-white border-white">
              <Users className="h-3 w-3 mr-1" />
              {participants.length}
            </Badge>
            <Badge 
              variant={onlineDevices === totalDevices ? "default" : "destructive"}
              className="bg-green-600"
            >
              {onlineDevices}/{totalDevices} Online
            </Badge>
            <Badge variant="outline" className="text-green-400 border-green-400">
              3D Ready
            </Badge>
          </div>
        </div>
        
        <div className="text-sm text-gray-400">
          {isLoaded ? (
            `3D Room Active: ${devices.length} devices loaded - Custom GLB Space`
          ) : error ? (
            <span className="text-red-400">{error}</span>
          ) : (
            'Loading 3D room geometry...'
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        <div className="relative">
          <div 
            ref={mountRef} 
            className="w-full h-[384px] bg-black rounded border-2 border-gray-700"
            style={{ minHeight: '384px' }}
          />
          
          {!isLoaded && !error && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75 rounded">
              <div className="text-white text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-400 mx-auto mb-2"></div>
                <p>Loading 3D Environment...</p>
              </div>
            </div>
          )}
          
          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75 rounded">
              <div className="text-red-400 text-center">
                <p className="mb-2">Error Loading 3D Model</p>
                <p className="text-sm text-gray-400">{error}</p>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex justify-between items-center mt-4 text-xs">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-white">Devices Online</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-white">Devices Offline</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-white">Participants</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}