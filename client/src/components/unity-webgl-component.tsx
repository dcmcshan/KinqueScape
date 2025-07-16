import React, { useEffect, useCallback, useState } from 'react';
import { Unity, useUnityContext } from 'react-unity-webgl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Users, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';
import type { RoomDevice, RoomParticipant } from '@shared/schema';

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
  const [isInitialized, setIsInitialized] = useState(false);

  const {
    unityProvider,
    loadingProgression,
    isLoaded,
    sendMessage,
    addEventListener,
    removeEventListener,
  } = useUnityContext({
    loaderUrl: '/unity-build/KinqueScape.loader.js',
    dataUrl: '/unity-build/KinqueScape.data',
    frameworkUrl: '/unity-build/KinqueScape.framework.js',
    codeUrl: '/unity-build/KinqueScape.wasm',
    webglContextAttributes: {
      preserveDrawingBuffer: true,
    },
  });

  // Handle messages from Unity
  const handleUnityMessage = useCallback((message: string) => {
    try {
      const data = JSON.parse(message);
      
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
          setIsInitialized(true);
          break;
          
        default:
          console.log('Unknown Unity message:', data);
      }
    } catch (error) {
      console.error('Error parsing Unity message:', error);
    }
  }, [devices, participants, onDeviceClick, onParticipantClick]);

  // Set up Unity event listeners
  useEffect(() => {
    addEventListener('ReactMessage', handleUnityMessage);
    return () => {
      removeEventListener('ReactMessage', handleUnityMessage);
    };
  }, [addEventListener, removeEventListener, handleUnityMessage]);

  // Send device data to Unity when it changes
  useEffect(() => {
    if (isLoaded && isInitialized) {
      const deviceData = devices.map(device => ({
        id: device.id,
        name: device.name,
        type: device.type,
        status: device.status,
        position: device.location || { x: 0, y: 0, z: 0 },
      }));
      
      sendMessage('DungeonController', 'UpdateDevices', JSON.stringify(deviceData));
    }
  }, [devices, isLoaded, isInitialized, sendMessage]);

  // Send participant data to Unity when it changes
  useEffect(() => {
    if (isLoaded && isInitialized) {
      const participantData = participants.map(participant => ({
        id: participant.id,
        name: participant.participantName,
        watchId: participant.watchId,
        position: {
          x: participant.positionX || 0,
          y: 0,
          z: participant.positionY || 0,
        },
        isActive: participant.isActive,
      }));
      
      sendMessage('DungeonController', 'UpdateParticipants', JSON.stringify(participantData));
    }
  }, [participants, isLoaded, isInitialized, sendMessage]);

  // Unity control functions
  const resetCamera = useCallback(() => {
    if (isLoaded && isInitialized) {
      sendMessage('DungeonController', 'ResetCamera');
    }
  }, [isLoaded, isInitialized, sendMessage]);

  const zoomIn = useCallback(() => {
    if (isLoaded && isInitialized) {
      sendMessage('DungeonController', 'ZoomIn');
    }
  }, [isLoaded, isInitialized, sendMessage]);

  const zoomOut = useCallback(() => {
    if (isLoaded && isInitialized) {
      sendMessage('DungeonController', 'ZoomOut');
    }
  }, [isLoaded, isInitialized, sendMessage]);

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
          {/* Unity Viewer */}
          <div className="w-full h-96 bg-black rounded-lg relative overflow-hidden">
            {!isLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <div className="text-center">
                  <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                  <p className="text-accent text-sm">Loading Unity Environment...</p>
                  <p className="text-accent/70 text-xs mt-1">
                    {Math.round(loadingProgression * 100)}%
                  </p>
                </div>
              </div>
            )}
            
            {isLoaded && !isInitialized && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <div className="text-center">
                  <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                  <p className="text-accent text-sm">Initializing Dungeon...</p>
                </div>
              </div>
            )}

            <Unity
              unityProvider={unityProvider}
              style={{
                width: '100%',
                height: '100%',
                display: 'block',
              }}
              className="rounded-lg"
            />
          </div>

          {/* Controls */}
          <div className="absolute bottom-4 left-4 flex items-center space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={resetCamera}
              disabled={!isLoaded || !isInitialized}
              className="bg-black/50 border-accent/30 hover:bg-accent/10"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={zoomIn}
              disabled={!isLoaded || !isInitialized}
              className="bg-black/50 border-accent/30 hover:bg-accent/10"
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={zoomOut}
              disabled={!isLoaded || !isInitialized}
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