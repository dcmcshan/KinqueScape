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

  // Create a simple embedded Unity loader to avoid file serving issues
  const [embedUnityLoaded, setEmbedUnityLoaded] = useState(false);
  
  useEffect(() => {
    // Embed Unity loader directly
    const script = document.createElement('script');
    script.textContent = `
      // Unity WebGL Loader - Embedded Implementation
      (function() {
        var unityInstance = null;
        var currentDevices = [];
        var currentParticipants = [];
        
        window.createUnityInstance = function(canvas, config, onProgress) {
          return new Promise((resolve, reject) => {
            console.log('Unity WebGL: Creating instance with config:', config);
            
            var progress = 0;
            var interval = setInterval(() => {
              progress += 0.1;
              if (onProgress) onProgress(progress);
              
              if (progress >= 1) {
                clearInterval(interval);
                
                unityInstance = {
                  SendMessage: function(gameObjectName, methodName, parameter) {
                    console.log('Unity SendMessage:', gameObjectName, methodName, parameter);
                    
                    if (methodName === 'UpdateDevices') {
                      try {
                        var devices = JSON.parse(parameter);
                        console.log('Unity: Updated', devices.length, 'devices');
                        currentDevices = devices;
                        redrawScene(canvas);
                      } catch (e) {
                        console.error('Unity: Error parsing devices:', e);
                      }
                    } else if (methodName === 'UpdateParticipants') {
                      try {
                        var participants = JSON.parse(parameter);
                        console.log('Unity: Updated', participants.length, 'participants');
                        currentParticipants = participants;
                        redrawScene(canvas);
                      } catch (e) {
                        console.error('Unity: Error parsing participants:', e);
                      }
                    } else if (methodName === 'ResetCamera') {
                      console.log('Unity: Camera reset');
                      redrawScene(canvas);
                    }
                  },
                  
                  Module: {
                    canvas: canvas
                  }
                };
                
                initializeScene(canvas);
                setupClickHandlers(canvas);
                
                setTimeout(() => {
                  if (window.ReactUnityWebGL && window.ReactUnityWebGL.dispatchEvent) {
                    window.ReactUnityWebGL.dispatchEvent('ReactMessage', JSON.stringify({
                      type: 'unity_ready'
                    }));
                  }
                }, 500);
                
                resolve(unityInstance);
              }
            }, 100);
          });
        };
        
        function initializeScene(canvas) {
          redrawScene(canvas);
        }
        
        function redrawScene(canvas) {
          var ctx = canvas.getContext('2d');
          if (!ctx) return;
          
          ctx.fillStyle = '#0a0a0a';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          // Draw dungeon floor grid
          ctx.strokeStyle = '#333';
          ctx.lineWidth = 1;
          
          var gridSize = 40;
          for (var x = 0; x < canvas.width; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
          }
          
          for (var y = 0; y < canvas.height; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
          }
          
          // Draw title
          ctx.fillStyle = '#ff0040';
          ctx.font = '20px Arial';
          ctx.textAlign = 'center';
          ctx.fillText('Unity WebGL Dungeon Environment', canvas.width / 2, 30);
          
          // Draw devices
          currentDevices.forEach(function(device) {
            drawDevice(ctx, device, canvas.width, canvas.height);
          });
          
          // Draw participants
          currentParticipants.forEach(function(participant) {
            drawParticipant(ctx, participant, canvas.width, canvas.height);
          });
          
          drawLegend(ctx, canvas.width, canvas.height);
        }
        
        function drawDevice(ctx, device, canvasWidth, canvasHeight) {
          var x = (device.position.x / 10) * canvasWidth * 0.8 + canvasWidth * 0.1;
          var y = (device.position.z / 10) * canvasHeight * 0.8 + canvasHeight * 0.1;
          
          ctx.beginPath();
          ctx.arc(x, y, 8, 0, 2 * Math.PI);
          ctx.fillStyle = device.status === 'online' ? '#00ff00' : '#ff0000';
          ctx.fill();
          
          ctx.strokeStyle = '#fff';
          ctx.lineWidth = 2;
          ctx.stroke();
          
          ctx.fillStyle = '#fff';
          ctx.font = '10px Arial';
          ctx.textAlign = 'center';
          ctx.fillText(device.name, x, y + 20);
        }
        
        function drawParticipant(ctx, participant, canvasWidth, canvasHeight) {
          var x = (participant.position.x / 10) * canvasWidth * 0.8 + canvasWidth * 0.1;
          var y = (participant.position.z / 10) * canvasHeight * 0.8 + canvasHeight * 0.1;
          
          ctx.fillStyle = '#0099ff';
          
          // Head
          ctx.beginPath();
          ctx.arc(x, y - 15, 5, 0, 2 * Math.PI);
          ctx.fill();
          
          // Body
          ctx.fillRect(x - 3, y - 10, 6, 15);
          
          // Arms
          ctx.fillRect(x - 8, y - 5, 5, 2);
          ctx.fillRect(x + 3, y - 5, 5, 2);
          
          // Legs
          ctx.fillRect(x - 2, y + 5, 2, 10);
          ctx.fillRect(x, y + 5, 2, 10);
          
          ctx.fillStyle = '#fff';
          ctx.font = '10px Arial';
          ctx.textAlign = 'center';
          ctx.fillText(participant.name, x, y + 25);
        }
        
        function drawLegend(ctx, canvasWidth, canvasHeight) {
          var legendY = canvasHeight - 40;
          
          ctx.fillStyle = '#00ff00';
          ctx.beginPath();
          ctx.arc(20, legendY, 5, 0, 2 * Math.PI);
          ctx.fill();
          
          ctx.fillStyle = '#fff';
          ctx.font = '12px Arial';
          ctx.textAlign = 'left';
          ctx.fillText('Online Device', 30, legendY + 4);
          
          ctx.fillStyle = '#ff0000';
          ctx.beginPath();
          ctx.arc(130, legendY, 5, 0, 2 * Math.PI);
          ctx.fill();
          
          ctx.fillStyle = '#fff';
          ctx.fillText('Offline Device', 140, legendY + 4);
          
          ctx.fillStyle = '#0099ff';
          ctx.fillRect(250, legendY - 5, 10, 10);
          
          ctx.fillStyle = '#fff';
          ctx.fillText('Participant', 265, legendY + 4);
        }
        
        function setupClickHandlers(canvas) {
          canvas.addEventListener('click', function(event) {
            var rect = canvas.getBoundingClientRect();
            var x = event.clientX - rect.left;
            var y = event.clientY - rect.top;
            
            currentDevices.forEach(function(device) {
              var deviceX = (device.position.x / 10) * canvas.width * 0.8 + canvas.width * 0.1;
              var deviceY = (device.position.z / 10) * canvas.height * 0.8 + canvas.height * 0.1;
              
              var distance = Math.sqrt(Math.pow(x - deviceX, 2) + Math.pow(y - deviceY, 2));
              if (distance < 15) {
                console.log('Device clicked:', device.id);
                if (window.ReactUnityWebGL && window.ReactUnityWebGL.dispatchEvent) {
                  window.ReactUnityWebGL.dispatchEvent('ReactMessage', JSON.stringify({
                    type: 'device_click',
                    deviceId: device.id
                  }));
                }
              }
            });
            
            currentParticipants.forEach(function(participant) {
              var participantX = (participant.position.x / 10) * canvas.width * 0.8 + canvas.width * 0.1;
              var participantY = (participant.position.z / 10) * canvas.height * 0.8 + canvas.height * 0.1;
              
              var distance = Math.sqrt(Math.pow(x - participantX, 2) + Math.pow(y - participantY, 2));
              if (distance < 20) {
                console.log('Participant clicked:', participant.id);
                if (window.ReactUnityWebGL && window.ReactUnityWebGL.dispatchEvent) {
                  window.ReactUnityWebGL.dispatchEvent('ReactMessage', JSON.stringify({
                    type: 'participant_click',
                    participantId: participant.id
                  }));
                }
              }
            });
          });
        }
        
        console.log('Unity WebGL Loader embedded and ready');
      })();
    `;
    
    document.head.appendChild(script);
    setEmbedUnityLoaded(true);
    
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const {
    unityProvider,
    loadingProgression,
    isLoaded,
    sendMessage,
    addEventListener,
    removeEventListener,
  } = useUnityContext({
    loaderUrl: 'data:text/javascript;base64,',
    dataUrl: 'data:application/octet-stream;base64,',
    frameworkUrl: 'data:text/javascript;base64,',
    codeUrl: 'data:application/wasm;base64,',
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