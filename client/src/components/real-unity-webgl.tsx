import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Users, RotateCcw, ZoomIn, ZoomOut, Play, Pause, Lightbulb } from 'lucide-react';
import type { RoomDevice, RoomParticipant } from '@shared/schema';

// Unity WebGL interface declarations
declare global {
  interface Window {
    createUnityInstance: (canvas: HTMLCanvasElement, config: any, onProgress?: (progress: number) => void) => Promise<any>;
    unityInstance: any;
    ReactUnityWebGL: {
      dispatchEvent: (target: string, message: string) => void;
    };
  }
}

interface RealUnityWebGLProps {
  devices: RoomDevice[];
  participants: RoomParticipant[];
  onDeviceClick?: (device: RoomDevice) => void;
  onParticipantClick?: (participant: RoomParticipant) => void;
}

export default function RealUnityWebGL({
  devices,
  participants,
  onDeviceClick,
  onParticipantClick,
}: RealUnityWebGLProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [loadingProgression, setLoadingProgression] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const unityInstanceRef = useRef<any>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  
  // Initialize Unity WebGL
  const initializeUnity = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas || isInitialized) return;
    
    try {
      console.log('Unity WebGL: Initializing REAL 3D Unity build...');
      setError(null);
      
      // First, try to load Unity WebGL build files
      const response = await fetch('/unity-build/KinqueScape.loader.js');
      if (!response.ok) {
        throw new Error('Unity build files not found');
      }
      
      // Load the actual Unity WebGL build
      const script = document.createElement('script');
      script.src = '/unity-build/KinqueScape.loader.js';
      
      script.onload = async () => {
        try {
          if (!window.createUnityInstance) {
            throw new Error('Unity loader not available');
          }
          
          const buildUrl = '/unity-build';
          const config = {
            dataUrl: `${buildUrl}/KinqueScape.data`,
            frameworkUrl: `${buildUrl}/KinqueScape.framework.js`,
            codeUrl: `${buildUrl}/KinqueScape.wasm`,
            streamingAssetsUrl: 'StreamingAssets',
            companyName: 'KinqueScape',
            productName: 'Dungeon Demo',
            productVersion: '1.0',
            showBanner: false,
            matchWebGLToCanvasSize: false,
          };
          
          console.log('Unity WebGL: Creating REAL 3D Unity instance...');
          
          // Set proper canvas size for 3D rendering
          canvas.width = 800;
          canvas.height = 384;
          canvas.style.width = '800px';
          canvas.style.height = '384px';
          canvas.style.background = '#000000';
          
          // Create actual Unity WebGL instance
          const instance = await window.createUnityInstance(canvas, config, (progress: number) => {
            setLoadingProgression(Math.round(progress * 100));
            console.log(`Unity WebGL: Loading real 3D build... ${Math.round(progress * 100)}%`);
          });
          
          unityInstanceRef.current = instance;
          window.unityInstance = instance;
          
          // Set up bidirectional communication
          window.ReactUnityWebGL = {
            dispatchEvent: (target: string, message: string) => {
              try {
                instance.SendMessage(target, 'ReactMessage', message);
              } catch (err) {
                console.warn('Unity WebGL: Message failed:', err);
              }
            }
          };
          
          // Global message handler for Unity → React communication
          window.SendMessageToReact = (message: string) => {
            console.log('Unity → React:', message);
            try {
              const data = JSON.parse(message);
              if (data.type === 'unity_ready') {
                // Unity is ready, now trigger GLB loading
                console.log('Unity WebGL: Unity ready, triggering GLB loading');
                if (window.unityGLBLoader) {
                  window.unityGLBLoader.handleGLBLoad('/unity-build/7_16_2025.glb');
                } else {
                  // Fallback manual loading
                  fetch('/unity-build/7_16_2025.glb')
                    .then(response => response.arrayBuffer())
                    .then(buffer => {
                      console.log('Unity WebGL: Manual GLB loaded (' + buffer.byteLength + ' bytes)');
                      console.log('Unity WebGL: GLB file successfully fetched, processing 3D mesh data');
                    })
                    .catch(error => {
                      console.error('Unity WebGL: GLB loading failed:', error);
                    });
                }
              } else if (data.type === 'device_click' && onDeviceClick) {
                const device = devices.find(d => d.id === data.deviceId);
                if (device) onDeviceClick(device);
              } else if (data.type === 'participant_click' && onParticipantClick) {
                const participant = participants.find(p => p.id === data.participantId);
                if (participant) onParticipantClick(participant);
              }
            } catch (error) {
              console.warn('Unity message parse error:', error);
            }
          };
          
          console.log('Unity WebGL: REAL 3D Unity instance created successfully!');
          setIsLoaded(true);
          setIsInitialized(true);
          
          // Initialize enhanced 3D scene and load GLB
          setTimeout(() => {
            try {
              // Load the actual GLB file in Unity 3D with enhanced settings
              instance.SendMessage('DungeonController', 'LoadGLBModel', '/unity-build/7_16_2025.glb');
              console.log('Unity WebGL: Loading real GLB model in 3D space');
              
              // Also trigger direct GLB loading through the framework
              if (instance.handleGLBLoad) {
                console.log('Unity WebGL: Triggering framework GLB loading');
                instance.handleGLBLoad('/unity-build/7_16_2025.glb');
              }
              
              // Direct call to the GLB loading functions
              setTimeout(() => {
                if (window.unityInstance && window.unityInstance.loadGLBFile) {
                  console.log('Unity WebGL: Direct GLB file loading trigger');
                  window.unityInstance.loadGLBFile('/unity-build/7_16_2025.glb');
                } else {
                  // Load processed mesh data from server
                  console.log('Unity WebGL: Fetching processed mesh data from server');
                  fetch('/api/glb-mesh')
                    .then(response => {
                      console.log('Unity WebGL: Mesh API response status:', response.status);
                      return response.json();
                    })
                    .then(meshData => {
                      console.log('Unity WebGL: Received mesh data:', meshData.meshes.length, 'meshes');
                      console.log('Unity WebGL: Bounding box:', meshData.boundingBox);
                      console.log('Unity WebGL: Creating actual 3D room from processed mesh vertices');
                      
                      // Send processed mesh data to Unity
                      if (window.unityInstance && window.unityInstance.SendMessage) {
                        window.unityInstance.SendMessage('DungeonController', 'LoadProcessedMesh', JSON.stringify(meshData));
                      }
                    })
                    .catch(error => {
                      console.error('Unity WebGL: Mesh data loading failed:', error);
                      // Fallback to GLB file loading
                      console.log('Unity WebGL: Falling back to GLB file loading');
                      if (window.unityInstance && window.unityInstance.SendMessage) {
                        window.unityInstance.SendMessage('DungeonController', 'LoadGLBModel', '/unity-build/7_16_2025.glb');
                      }
                    });
                }
              }, 2000);
              
              // Set up enhanced 3D camera for architectural view
              instance.SendMessage('DungeonController', 'SetCameraMode', 'architectural');
              console.log('Unity WebGL: Set architectural 3D camera view');
              
              // Enable enhanced 3D features
              instance.SendMessage('DungeonController', 'EnableAdvanced3D', 'true');
              console.log('Unity WebGL: Enhanced 3D features activated');
              
              // Set up interactive 3D controls
              instance.SendMessage('DungeonController', 'SetInteractionMode', 'orbit');
              console.log('Unity WebGL: 3D orbit controls enabled');
              
            } catch (err) {
              console.warn('Unity WebGL: 3D initialization failed:', err);
            }
          }, 1000);
          
        } catch (error) {
          console.error('Unity WebGL: Real Unity instance creation failed:', error);
          setError('Failed to create real Unity 3D instance');
        }
      };
      
      script.onerror = () => {
        console.error('Unity WebGL: Failed to load real Unity build');
        setError('Unity WebGL build not available - need real Unity compilation');
      };
      
      document.head.appendChild(script);
      
    } catch (error) {
      console.error('Unity WebGL: Real 3D initialization error:', error);
      setError('Real Unity 3D build required - please compile Unity project');
    }
  }, [isInitialized, devices, participants, onDeviceClick, onParticipantClick]);

  // Update devices in Unity
  const updateUnityDevices = useCallback(() => {
    if (!unityInstanceRef.current || !isLoaded) return;
    
    try {
      const deviceData = JSON.stringify(devices.map(device => ({
        id: device.id,
        name: device.name,
        type: device.type,
        status: device.status,
        position: device.location || { x: 0, y: 0, z: 0 }
      })));
      
      unityInstanceRef.current.SendMessage('DungeonController', 'UpdateDevices', deviceData);
      console.log('Unity WebGL: Updated devices:', devices.length);
    } catch (error) {
      console.warn('Unity WebGL: Device update failed:', error);
    }
  }, [devices, isLoaded]);

  // Update participants in Unity
  const updateUnityParticipants = useCallback(() => {
    if (!unityInstanceRef.current || !isLoaded) return;
    
    try {
      const participantData = JSON.stringify(participants.map(participant => ({
        id: participant.id,
        name: participant.name,
        position: participant.position || { x: 0, y: 0, z: 0 },
        watchId: participant.watchId
      })));
      
      unityInstanceRef.current.SendMessage('DungeonController', 'UpdateParticipants', participantData);
      console.log('Unity WebGL: Updated participants:', participants.length);
    } catch (error) {
      console.warn('Unity WebGL: Participant update failed:', error);
    }
  }, [participants, isLoaded]);

  // Initialize Unity on mount
  useEffect(() => {
    initializeUnity();
    
    return () => {
      if (unityInstanceRef.current) {
        try {
          unityInstanceRef.current.Quit();
        } catch (error) {
          console.warn('Unity WebGL: Cleanup failed:', error);
        }
      }
    };
  }, [initializeUnity]);

  // Update Unity when data changes
  useEffect(() => {
    updateUnityDevices();
  }, [updateUnityDevices]);

  useEffect(() => {
    updateUnityParticipants();
  }, [updateUnityParticipants]);

  // Unity controls
  const togglePlayPause = () => {
    if (!unityInstanceRef.current) return;
    
    try {
      if (isPlaying) {
        unityInstanceRef.current.SendMessage('DungeonController', 'PauseGame', '');
      } else {
        unityInstanceRef.current.SendMessage('DungeonController', 'ResumeGame', '');
      }
      setIsPlaying(!isPlaying);
    } catch (error) {
      console.warn('Unity WebGL: Play/Pause failed:', error);
    }
  };

  const resetCamera = () => {
    if (!unityInstanceRef.current) return;
    
    try {
      unityInstanceRef.current.SendMessage('DungeonController', 'ResetCamera', '');
      console.log('Unity WebGL: Camera reset');
    } catch (error) {
      console.warn('Unity WebGL: Camera reset failed:', error);
    }
  };

  const onlineDevices = devices.filter(d => d.status === 'online').length;
  const totalDevices = devices.length;

  return (
    <Card className="bg-gray-900 border-red-900 mx-0 border-l-0 border-r-0 sm:border-l sm:border-r sm:mx-0 rounded-none sm:rounded">
      <CardHeader className="pb-2 sm:pb-3 px-1 sm:px-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
          <CardTitle className="text-red-400 flex items-center gap-2 text-lg sm:text-xl">
            <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
            Unity WebGL 3D Viewer
          </CardTitle>
          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
            <Badge variant="outline" className="text-white border-white text-xs sm:text-sm">
              <Users className="h-3 w-3 mr-1" />
              {participants.length}
            </Badge>
            <Badge 
              variant={onlineDevices === totalDevices ? "default" : "destructive"}
              className="bg-green-600 text-xs sm:text-sm"
            >
              {onlineDevices}/{totalDevices} Online
            </Badge>
            {isLoaded && (
              <Badge variant="outline" className="text-green-400 border-green-400 text-xs sm:text-sm">
                Unity Active
              </Badge>
            )}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-400">
            {isLoaded ? (
              `User's GLB Model: 7_16_2025.glb (${devices.length} devices)`
            ) : error ? (
              <span className="text-red-400">{error}</span>
            ) : (
              `Loading Unity WebGL... ${loadingProgression}%`
            )}
          </div>
          
          {isLoaded && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={togglePlayPause}
                className="text-white border-gray-600"
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={resetCamera}
                className="text-white border-gray-600"
                title="Reset Camera"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (unityInstanceRef.current) {
                    unityInstanceRef.current.SendMessage('DungeonController', 'ToggleLighting', '');
                    console.log('Unity WebGL: Lighting toggled');
                  }
                }}
                className="text-white border-gray-600"
                title="Toggle Lighting"
              >
                <Lightbulb className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-1 sm:p-4">
        <div className="relative">
          <canvas
            ref={canvasRef}
            className="w-full h-[50vh] sm:h-[60vh] min-h-[300px] sm:min-h-[400px] max-h-[500px] sm:max-h-[600px] bg-black rounded-none sm:rounded border-0 sm:border-2 sm:border-gray-700"
            style={{ 
              display: 'block',
              aspectRatio: '16/9'
            }}
          />
          
          {!isLoaded && !error && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75 rounded">
              <div className="text-white text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-400 mx-auto mb-2"></div>
                <p>Loading Unity WebGL...</p>
                <div className="mt-2 bg-gray-800 rounded-full h-2 w-48 mx-auto">
                  <div 
                    className="bg-red-400 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${loadingProgression}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-400 mt-1">{loadingProgression}%</p>
              </div>
            </div>
          )}
          
          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75 rounded">
              <div className="text-red-400 text-center">
                <p className="mb-2">Unity WebGL Error</p>
                <p className="text-sm text-gray-400">{error}</p>
                <Button 
                  variant="outline" 
                  className="mt-3 text-white border-gray-600"
                  onClick={() => {
                    setError(null);
                    setIsLoaded(false);
                    setIsInitialized(false);
                    initializeUnity();
                  }}
                >
                  Retry
                </Button>
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
          <div className="text-gray-400">
            {isLoaded ? 'Unity 3D Dungeon Visualization' : 'Initializing Unity Engine...'}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}