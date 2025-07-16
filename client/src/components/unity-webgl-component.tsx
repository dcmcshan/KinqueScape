import React, { useEffect, useCallback, useState, useRef } from 'react';
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
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadingProgression, setLoadingProgression] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Direct canvas implementation for Unity WebGL visualization
  const initializeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    canvas.width = 800;
    canvas.height = 600;
    
    console.log('Unity WebGL: Canvas initialized');
    drawScene(ctx, canvas.width, canvas.height);
  }, []);
  
  const drawScene = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Clear canvas
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, width, height);
    
    // Draw dungeon floor grid
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    
    const gridSize = 40;
    for (let x = 0; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    
    for (let y = 0; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    
    // Draw title
    ctx.fillStyle = '#ff0040';
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Unity WebGL Dungeon Environment', width / 2, 30);
    
    // Draw devices
    devices.forEach(device => {
      drawDevice(ctx, device, width, height);
    });
    
    // Draw participants
    participants.forEach(participant => {
      drawParticipant(ctx, participant, width, height);
    });
    
    drawLegend(ctx, width, height);
  }, [devices, participants]);
  
  const drawDevice = useCallback((ctx: CanvasRenderingContext2D, device: RoomDevice, canvasWidth: number, canvasHeight: number) => {
    const position = device.location || { x: 0, y: 0, z: 0 };
    const x = (position.x / 10) * canvasWidth * 0.8 + canvasWidth * 0.1;
    const y = (position.z / 10) * canvasHeight * 0.8 + canvasHeight * 0.1;
    
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
  }, []);
  
  const drawParticipant = useCallback((ctx: CanvasRenderingContext2D, participant: RoomParticipant, canvasWidth: number, canvasHeight: number) => {
    const x = ((participant.positionX || 0) / 10) * canvasWidth * 0.8 + canvasWidth * 0.1;
    const y = ((participant.positionZ || 0) / 10) * canvasHeight * 0.8 + canvasHeight * 0.1;
    
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
  }, []);
  
  const drawLegend = useCallback((ctx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number) => {
    const legendY = canvasHeight - 40;
    
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
  }, []);
  
  const handleCanvasClick = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Check device clicks
    devices.forEach(device => {
      const position = device.location || { x: 0, y: 0, z: 0 };
      const deviceX = (position.x / 10) * canvas.width * 0.8 + canvas.width * 0.1;
      const deviceY = (position.z / 10) * canvas.height * 0.8 + canvas.height * 0.1;
      
      const distance = Math.sqrt(Math.pow(x - deviceX, 2) + Math.pow(y - deviceY, 2));
      if (distance < 15) {
        console.log('Device clicked:', device.id);
        onDeviceClick?.(device);
      }
    });
    
    // Check participant clicks
    participants.forEach(participant => {
      const participantX = ((participant.positionX || 0) / 10) * canvas.width * 0.8 + canvas.width * 0.1;
      const participantY = ((participant.positionZ || 0) / 10) * canvas.height * 0.8 + canvas.height * 0.1;
      
      const distance = Math.sqrt(Math.pow(x - participantX, 2) + Math.pow(y - participantY, 2));
      if (distance < 20) {
        console.log('Participant clicked:', participant.id);
        onParticipantClick?.(participant);
      }
    });
  }, [devices, participants, onDeviceClick, onParticipantClick]);
  
  // Initialize canvas on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      initializeCanvas();
      setIsLoaded(true);
      setLoadingProgression(1);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [initializeCanvas]);
  
  // Redraw when devices or participants change
  useEffect(() => {
    if (isLoaded && canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        drawScene(ctx, canvasRef.current.width, canvasRef.current.height);
      }
    }
  }, [isLoaded, devices, participants, drawScene]);

  // Camera control functions
  const resetCamera = useCallback(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        drawScene(ctx, canvasRef.current.width, canvasRef.current.height);
      }
    }
  }, [drawScene]);

  const zoomIn = useCallback(() => {
    // Future implementation for zoom controls
    console.log('Zoom in functionality');
  }, []);

  const zoomOut = useCallback(() => {
    // Future implementation for zoom controls
    console.log('Zoom out functionality');
  }, []);

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
          {/* Unity WebGL Canvas */}
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

            <canvas
              ref={canvasRef}
              onClick={handleCanvasClick}
              style={{
                width: '100%',
                height: '100%',
                display: 'block',
              }}
              className="rounded-lg cursor-pointer"
            />
          </div>

          {/* Controls */}
          <div className="absolute bottom-4 left-4 flex items-center space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={resetCamera}
              disabled={!isLoaded}
              className="bg-black/50 border-accent/30 hover:bg-accent/10"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={zoomIn}
              disabled={!isLoaded}
              className="bg-black/50 border-accent/30 hover:bg-accent/10"
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={zoomOut}
              disabled={!isLoaded}
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