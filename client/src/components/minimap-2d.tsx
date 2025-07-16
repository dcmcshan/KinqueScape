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

    // Clear canvas with dark background
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 0.5;
    const gridSize = 20;
    
    for (let x = 0; x < canvas.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    
    for (let y = 0; y < canvas.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Draw room boundaries
    ctx.strokeStyle = '#ff0040';
    ctx.lineWidth = 2;
    ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

    // Title
    ctx.fillStyle = '#ff0040';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Dungeon Layout (Top View)', canvas.width / 2, 15);

    // Draw devices
    devices.forEach(device => {
      const position = device.location || { x: 0, y: 0, z: 0 };
      // Convert 3D coordinates to 2D minimap (x, z -> x, y in 2D)
      const x = (position.x / 10) * (canvas.width * 0.6) + canvas.width * 0.2;
      const y = (position.z / 10) * (canvas.height * 0.6) + canvas.height * 0.2;

      // Device appearance based on type
      let color = '#00ff00'; // Default green for online
      let shape = 'circle';
      
      if (device.status === 'offline') {
        color = '#ff0000';
      }
      
      switch (device.type) {
        case 'lock':
          shape = 'square';
          color = device.status === 'online' ? '#ffa500' : '#ff0000';
          break;
        case 'light':
          color = device.status === 'online' ? '#ffff00' : '#ff0000';
          break;
        case 'camera':
          shape = 'triangle';
          color = device.status === 'online' ? '#00ffff' : '#ff0000';
          break;
        case 'prop':
          shape = 'diamond';
          color = device.status === 'online' ? '#8a2be2' : '#ff0000';
          break;
      }

      ctx.fillStyle = color;
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 1;

      if (shape === 'circle') {
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
      } else if (shape === 'square') {
        ctx.fillRect(x - 4, y - 4, 8, 8);
        ctx.strokeRect(x - 4, y - 4, 8, 8);
      } else if (shape === 'triangle') {
        ctx.beginPath();
        ctx.moveTo(x, y - 4);
        ctx.lineTo(x - 4, y + 4);
        ctx.lineTo(x + 4, y + 4);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      } else if (shape === 'diamond') {
        ctx.beginPath();
        ctx.moveTo(x, y - 4);
        ctx.lineTo(x + 4, y);
        ctx.lineTo(x, y + 4);
        ctx.lineTo(x - 4, y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }
    });

    // Draw participants
    participants.forEach(participant => {
      const x = ((participant.positionX || 0) / 10) * (canvas.width * 0.6) + canvas.width * 0.2;
      const y = ((participant.positionZ || 0) / 10) * (canvas.height * 0.6) + canvas.height * 0.2;
      
      // Participant with pulsing effect if active
      const alpha = participant.isActive ? (Math.sin(Date.now() / 500) * 0.3 + 0.7) : 0.5;
      
      ctx.fillStyle = `rgba(0, 153, 255, ${alpha})`;
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;

      // Draw participant as person icon
      // Head
      ctx.beginPath();
      ctx.arc(x, y - 6, 3, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();

      // Body
      ctx.fillRect(x - 2, y - 3, 4, 8);
      ctx.strokeRect(x - 2, y - 3, 4, 8);

      // Arms
      ctx.fillRect(x - 5, y - 1, 3, 2);
      ctx.fillRect(x + 2, y - 1, 3, 2);

      // Name label
      if (participant.participantName) {
        ctx.fillStyle = '#fff';
        ctx.font = '8px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(participant.participantName, x, y + 12);
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
      const position = device.location || { x: 0, y: 0, z: 0 };
      const deviceX = (position.x / 10) * (canvas.width * 0.6) + canvas.width * 0.2;
      const deviceY = (position.z / 10) * (canvas.height * 0.6) + canvas.height * 0.2;

      const distance = Math.sqrt(Math.pow(x - deviceX, 2) + Math.pow(y - deviceY, 2));
      if (distance < 8) {
        onDeviceClick?.(device);
      }
    });

    // Check participant clicks
    participants.forEach(participant => {
      const participantX = ((participant.positionX || 0) / 10) * (canvas.width * 0.6) + canvas.width * 0.2;
      const participantY = ((participant.positionZ || 0) / 10) * (canvas.height * 0.6) + canvas.height * 0.2;

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