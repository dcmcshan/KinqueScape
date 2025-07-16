import React, { useEffect, useCallback, useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Users, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';
import type { RoomDevice, RoomParticipant } from '@shared/schema';

// Unity WebGL interface declarations
declare global {
  interface Window {
    createUnityInstance: (canvas: HTMLCanvasElement, config: any, onProgress?: (progress: number) => void) => Promise<any>;
    unityInstance: any;
  }
}

interface UnityWebGLComponentProps {
  devices: RoomDevice[];
  participants: RoomParticipant[];
  onDeviceClick?: (device: RoomDevice) => void;
  onParticipantClick?: (participant: RoomParticipant) => void;
}

export default function UnityWebGLComponent({
  devices,
  participants,
  onDeviceClick,
  onParticipantClick,
}: UnityWebGLComponentProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [loadingProgression, setLoadingProgression] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const unityInstanceRef = useRef<any>(null);
  
  // Load Unity WebGL build
  const loadUnityBuild = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    try {
      console.log('Unity WebGL: Loading Unity build...');
      
      // Load Unity loader script
      const script = document.createElement('script');
      script.src = '/unity-build/KinqueScape.loader.js';
      script.onload = async () => {
        try {
          const buildUrl = '/unity-build';
          const config = {
            dataUrl: `${buildUrl}/KinqueScape.data`,
            frameworkUrl: `${buildUrl}/KinqueScape.framework.js`,
            codeUrl: `${buildUrl}/KinqueScape.wasm`,
            streamingAssetsUrl: 'StreamingAssets',
            companyName: 'KinqueScape',
            productName: 'Dungeon Demo',
            productVersion: '1.0',
          };
          
          console.log('Unity WebGL: Creating instance with config:', config);
          
          // Set canvas dimensions before Unity initialization
          canvas.width = 800;
          canvas.height = 384;
          
          const instance = await window.createUnityInstance(canvas, config, (progress: number) => {
            setLoadingProgression(progress);
            console.log(`Unity WebGL: Loading progress: ${Math.round(progress * 100)}%`);
          });
          
          unityInstanceRef.current = instance;
          window.unityInstance = instance;
          
          console.log('Unity WebGL: Instance created successfully');
          setIsLoaded(true);
          setIsInitialized(true);
          
          // Set up communication bridge
          setupUnityBridge();
          
        } catch (error) {
          console.error('Unity WebGL: Failed to create instance:', error);
          setError('Failed to load Unity build');
        }
      };
      
      script.onerror = (error) => {
        console.error('Unity WebGL: Failed to load loader script:', error);
        setError('Failed to load Unity loader');
      };
      
      document.head.appendChild(script);
      
    } catch (error) {
      console.error('Unity WebGL: Error loading build:', error);
      setError('Error loading Unity build');
    }
  }, []);
  
  // Set up Unity communication bridge
  const setupUnityBridge = useCallback(() => {
    // React to Unity message receiver
    window.SendMessageToReact = (message: string) => {
      try {
        const data = JSON.parse(message);
        console.log('Unity → React:', data);
        
        switch (data.type) {
          case 'device_click':
            const device = devices.find(d => d.id === data.deviceId);
            if (device && onDeviceClick) {
              onDeviceClick(device);
            }
            break;
            
          case 'participant_click':
            const participant = participants.find(p => p.id === data.participantId);
            if (participant && onParticipantClick) {
              onParticipantClick(participant);
            }
            break;
            
          case 'unity_ready':
            console.log('Unity WebGL: Ready for communication');
            break;
            
          default:
            console.log('Unity WebGL: Unknown message type:', data.type);
        }
      } catch (error) {
        console.error('Unity WebGL: Error parsing message from Unity:', error);
      }
    };
  }, [devices, participants, onDeviceClick, onParticipantClick]);
  
  // Send message to Unity
  const sendToUnity = useCallback((gameObjectName: string, methodName: string, parameter?: any) => {
    if (unityInstanceRef.current && isInitialized) {
      try {
        const paramStr = parameter ? JSON.stringify(parameter) : '';
        unityInstanceRef.current.SendMessage(gameObjectName, methodName, paramStr);
        console.log(`React → Unity: ${gameObjectName}.${methodName}(${paramStr})`);
      } catch (error) {
        console.error('Unity WebGL: Error sending message to Unity:', error);
      }
    }
  }, [isInitialized]);
  
  // Initialize Unity on mount
  useEffect(() => {
    loadUnityBuild();
    
    return () => {
      // Cleanup
      if (unityInstanceRef.current) {
        try {
          unityInstanceRef.current.Quit();
        } catch (error) {
          console.warn('Unity WebGL: Error during cleanup:', error);
        }
      }
    };
  }, [loadUnityBuild]);

  // Load custom GLB model when Unity is ready
  useEffect(() => {
    if (isInitialized) {
      console.log('Unity WebGL: Loading custom GLB model...');
      sendToUnity('SceneController', 'LoadCustomModel', '/unity-build/7_16_2025.glb');
    }
  }, [isInitialized, sendToUnity]);
  
  // Update Unity with device data
  useEffect(() => {
    if (isInitialized && devices.length > 0) {
      const deviceData = devices.map(device => ({
        id: device.id,
        name: device.name,
        type: device.type,
        status: device.status,
        position: device.location || { x: 0, y: 0, z: 0 },
      }));
      
      sendToUnity('DungeonController', 'UpdateDevices', deviceData);
    }
  }, [devices, isInitialized, sendToUnity]);
  
  // Update Unity with participant data
  useEffect(() => {
    if (isInitialized && participants.length > 0) {
      const participantData = participants.map(participant => ({
        id: participant.id,
        name: participant.participantName,
        watchId: participant.watchId,
        position: {
          x: participant.positionX || 0,
          y: 0,
          z: participant.positionZ || 0,
        },
        isActive: participant.isActive,
      }));
      
      sendToUnity('DungeonController', 'UpdateParticipants', participantData);
    }
  }, [participants, isInitialized, sendToUnity]);

  // Unity camera control functions
  const resetCamera = useCallback(() => {
    sendToUnity('DungeonController', 'ResetCamera');
  }, [sendToUnity]);

  const zoomIn = useCallback(() => {
    sendToUnity('DungeonController', 'ZoomIn');
  }, [sendToUnity]);

  const zoomOut = useCallback(() => {
    sendToUnity('DungeonController', 'ZoomOut');
  }, [sendToUnity]);

  return (
    <Card className="tron-card h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-accent flex items-center">
            <Eye className="w-5 h-5 mr-2" />
            Unity WebGL 3D Viewer
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-xs">
              {participants.length} <Users className="w-3 h-3 ml-1" />
            </Badge>
            <Badge variant="outline" className="text-xs">
              {devices.filter(d => d.status === 'online').length}/{devices.length} Online
            </Badge>
            {isInitialized && (
              <Badge className="text-xs bg-green-500/20 text-green-400 border-green-500/20">
                Unity Ready
              </Badge>
            )}
            {error && (
              <Badge className="text-xs bg-red-500/20 text-red-400 border-red-500/20">
                Unity Error
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Unity WebGL Canvas */}
          <div className="w-full h-96 bg-gray-900 rounded-lg relative overflow-hidden border border-accent/20">
            {!isLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
                <div className="text-center">
                  <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                  <p className="text-accent text-sm">Loading Unity Environment...</p>
                  <p className="text-accent/70 text-xs mt-1">
                    {Math.round(loadingProgression * 100)}%
                  </p>
                </div>
              </div>
            )}

            {error && (
              <div className="absolute inset-0 flex items-center justify-center bg-red-900/20 z-10">
                <div className="text-center">
                  <p className="text-red-400 text-sm">Unity Error: {error}</p>
                </div>
              </div>
            )}

            <canvas
              ref={canvasRef}
              width={800}
              height={384}
              style={{
                width: '100%',
                height: '100%',
                display: 'block',
                background: '#1a1a1a',
                border: '1px solid #ff0040',
              }}
              className="rounded-lg"
            />
            
            {/* Debug info */}
            {isInitialized && (
              <div className="absolute top-2 left-2 text-xs text-green-400 bg-black/50 p-2 rounded">
                Unity Active: {devices.length} devices loaded
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="absolute bottom-4 left-4 flex items-center space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={resetCamera}
              disabled={!isInitialized}
              className="bg-black/50 border-accent/30 hover:bg-accent/10"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={zoomIn}
              disabled={!isInitialized}
              className="bg-black/50 border-accent/30 hover:bg-accent/10"
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={zoomOut}
              disabled={!isInitialized}
              className="bg-black/50 border-accent/30 hover:bg-accent/10"
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
          </div>

          {/* Legend */}
          <div className="absolute bottom-4 right-4 flex items-center space-x-4 text-xs">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-white">Participants</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-white">Devices Online</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-white">Devices Offline</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}