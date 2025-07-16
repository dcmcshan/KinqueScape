import React, { useCallback, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Map, Users } from 'lucide-react';
import type { RoomDevice, RoomParticipant } from '@shared/schema';

interface Minimap2DProps {
  devices: RoomDevice[];
  participants: RoomParticipant[];
  onDeviceClick?: (device: RoomDevice) => void;
  onParticipantClick?: (participant: RoomParticipant) => void;
}

export default function Minimap2D({
  devices,
  participants,
  onDeviceClick,
  onParticipantClick,
}: Minimap2DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawMinimap = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    canvas.width = 300;
    canvas.height = 300;

    // Clear canvas with light background like the reference image
    ctx.fillStyle = '#f5f5f5';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw room walls (top-down architectural view)
    const roomMargin = 30;
    const roomWidth = canvas.width - (roomMargin * 2);
    const roomHeight = canvas.height - (roomMargin * 2);
    
    // Outer walls
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 4;
    ctx.strokeRect(roomMargin, roomMargin, roomWidth, roomHeight);
    
    // Inner room area
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(roomMargin + 2, roomMargin + 2, roomWidth - 4, roomHeight - 4);
    
    // Inner walls
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 2;
    ctx.strokeRect(roomMargin + 20, roomMargin + 20, roomWidth - 40, roomHeight - 40);

    // Door opening at the top (entrance)
    ctx.fillStyle = '#f5f5f5';
    const doorWidth = 30;
    const doorX = (canvas.width - doorWidth) / 2;
    ctx.fillRect(doorX, roomMargin - 2, doorWidth, 8);
    
    // Subtle grid for positioning reference
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 0.5;
    const gridSize = 20;
    
    for (let x = roomMargin; x <= canvas.width - roomMargin; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, roomMargin);
      ctx.lineTo(x, canvas.height - roomMargin);
      ctx.stroke();
    }
    
    for (let y = roomMargin; y <= canvas.height - roomMargin; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(roomMargin, y);
      ctx.lineTo(canvas.width - roomMargin, y);
      ctx.stroke();
    }

    // Title
    ctx.fillStyle = '#333';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Room Layout (Top View)', canvas.width / 2, 20);

    // Draw devices with architectural symbols
    devices.forEach(device => {
      const position = device.position || { x: 0, y: 0, z: 0 };
      // Convert 3D coordinates to 2D room coordinates
      const x = roomMargin + ((position.x + 5) / 10) * roomWidth;
      const y = roomMargin + ((position.z + 5) / 10) * roomHeight;

      // Device appearance with architectural styling
      let color = '#4CAF50'; // Green for online
      let symbol = '●';
      
      if (device.status === 'offline') {
        color = '#f44336'; // Red for offline
      }
      
      switch (device.type) {
        case 'lock':
          symbol = '🚪';
          color = device.status === 'online' ? '#FF9800' : '#f44336';
          break;
        case 'light':
          symbol = '💡';
          color = device.status === 'online' ? '#FFC107' : '#f44336';
          break;
        case 'camera':
          symbol = '📷';
          color = device.status === 'online' ? '#2196F3' : '#f44336';
          break;
        case 'sound':
          symbol = '🔊';
          color = device.status === 'online' ? '#9C27B0' : '#f44336';
          break;
        case 'prop':
          symbol = '⚔️';
          color = device.status === 'online' ? '#795548' : '#f44336';
          break;
        case 'sensor':
          symbol = '📡';
          color = device.status === 'online' ? '#00BCD4' : '#f44336';
          break;
        case 'display':
          symbol = '📺';
          color = device.status === 'online' ? '#607D8B' : '#f44336';
          break;
      }

      // Draw device background circle
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, y, 8, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();

      // Draw device symbol
      ctx.fillStyle = color;
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(symbol, x, y);
    });

    // Draw participants with architectural person symbols
    participants.forEach(participant => {
      const position = participant.position || { x: 0, y: 0, z: 0 };
      const x = roomMargin + ((position.x + 5) / 10) * roomWidth;
      const y = roomMargin + ((position.z + 5) / 10) * roomHeight;
      
      // Participant with pulsing effect if active
      const alpha = participant.isActive ? (Math.sin(Date.now() / 500) * 0.3 + 0.7) : 0.8;
      
      // Draw participant background
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = `rgba(76, 175, 80, ${alpha})`;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(x, y, 10, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();

      // Draw person symbol
      ctx.fillStyle = `rgba(76, 175, 80, ${alpha})`;
      ctx.font = '16px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('👤', x, y);

      // Name label
      if (participant.name) {
        ctx.fillStyle = '#333';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(participant.name, x, y + 12);
      }
    });

    // Draw legend
    const legendY = canvas.height - 60;
    ctx.fillStyle = '#fff';
    ctx.font = '8px Arial';
    ctx.textAlign = 'left';

    // Legend items
    const legendItems = [
      { color: '#ffa500', shape: 'square', label: 'Locks' },
      { color: '#ffff00', shape: 'circle', label: 'Lights' },
      { color: '#00ffff', shape: 'triangle', label: 'Cameras' },
      { color: '#8a2be2', shape: 'diamond', label: 'Props' },
      { color: 'rgba(0, 153, 255, 0.8)', shape: 'person', label: 'Participants' }
    ];

    legendItems.forEach((item, index) => {
      const legendX = 25;
      const itemY = legendY + (index * 10);

      ctx.fillStyle = item.color;
      if (item.shape === 'circle') {
        ctx.beginPath();
        ctx.arc(legendX, itemY, 3, 0, 2 * Math.PI);
        ctx.fill();
      } else if (item.shape === 'square') {
        ctx.fillRect(legendX - 3, itemY - 3, 6, 6);
      } else if (item.shape === 'triangle') {
        ctx.beginPath();
        ctx.moveTo(legendX, itemY - 3);
        ctx.lineTo(legendX - 3, itemY + 3);
        ctx.lineTo(legendX + 3, itemY + 3);
        ctx.closePath();
        ctx.fill();
      } else if (item.shape === 'diamond') {
        ctx.beginPath();
        ctx.moveTo(legendX, itemY - 3);
        ctx.lineTo(legendX + 3, itemY);
        ctx.lineTo(legendX, itemY + 3);
        ctx.lineTo(legendX - 3, itemY);
        ctx.closePath();
        ctx.fill();
      } else if (item.shape === 'person') {
        ctx.beginPath();
        ctx.arc(legendX, itemY - 2, 2, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillRect(legendX - 1, itemY, 2, 4);
      }

      ctx.fillStyle = '#fff';
      ctx.fillText(item.label, legendX + 10, itemY + 2);
    });

  }, [devices, participants]);

  const handleCanvasClick = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Check device clicks
    devices.forEach(device => {
      const position = device.position || { x: 0, y: 0, z: 0 };
      const deviceX = (position.x / 10) * (canvas.width * 0.6) + canvas.width * 0.2;
      const deviceY = (position.z / 10) * (canvas.height * 0.6) + canvas.height * 0.2;

      const distance = Math.sqrt(Math.pow(x - deviceX, 2) + Math.pow(y - deviceY, 2));
      if (distance < 8) {
        onDeviceClick?.(device);
      }
    });

    // Check participant clicks
    participants.forEach(participant => {
      const position = participant.position || { x: 0, y: 0, z: 0 };
      const participantX = (position.x / 10) * (canvas.width * 0.6) + canvas.width * 0.2;
      const participantY = (position.z / 10) * (canvas.height * 0.6) + canvas.height * 0.2;

      const distance = Math.sqrt(Math.pow(x - participantX, 2) + Math.pow(y - participantY, 2));
      if (distance < 12) {
        onParticipantClick?.(participant);
      }
    });
  }, [devices, participants, onDeviceClick, onParticipantClick]);

  // Redraw minimap when data changes
  useEffect(() => {
    drawMinimap();
    
    // Set up periodic redraw for animations
    const interval = setInterval(drawMinimap, 100);
    return () => clearInterval(interval);
  }, [drawMinimap]);

  return (
    <Card className="bg-background/80 backdrop-blur-sm border-accent/20">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm text-foreground flex items-center gap-2">
            <Map className="h-4 w-4 text-accent" />
            2D Mini-Map
          </CardTitle>
          <div className="flex items-center gap-1">
            <Badge variant="outline" className="text-xs border-accent/20 text-accent">
              <Users className="h-3 w-3 mr-1" />
              {participants.length}
            </Badge>
            <Badge variant="outline" className="text-xs border-accent/20 text-accent">
              {devices.length} Devices
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        <div className="bg-muted/20 rounded-lg border border-accent/10 p-2">
          <canvas
            ref={canvasRef}
            onClick={handleCanvasClick}
            className="w-full h-auto rounded cursor-pointer"
            style={{ maxWidth: '300px', height: 'auto' }}
          />
        </div>
      </CardContent>
    </Card>
  );
}