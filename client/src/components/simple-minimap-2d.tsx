import React from 'react';
import type { RoomDevice, RoomParticipant } from '@shared/schema';

interface SimpleMinimap2DProps {
  devices: RoomDevice[];
  participants: RoomParticipant[];
  onDeviceClick?: (device: RoomDevice) => void;
  onParticipantClick?: (participant: RoomParticipant) => void;
}

export default function SimpleMinimap2D({
  devices,
  participants,
  onDeviceClick,
  onParticipantClick,
}: SimpleMinimap2DProps) {
  // Convert 3D coordinates to 2D top-down view
  const to2D = (x: number, z: number) => ({
    x: 50 + (x * 3), // Scale and center X coordinate
    y: 50 - (z * 3), // Scale and flip Z coordinate (top-down view)
  });

  return (
    <div className="relative w-full h-full bg-gray-900 border border-red-500/30 rounded-lg overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 to-transparent"></div>
      
      {/* Dungeon room layout - top-down view */}
      <div className="absolute inset-4">
        
        {/* Main dungeon chamber */}
        <div className="absolute inset-0 border-2 border-red-500/50 rounded-lg bg-red-500/5">
          
          {/* Room walls and architecture */}
          <div className="absolute inset-2 border border-red-600/30 rounded">
            {/* Stone walls representation */}
            <div className="absolute inset-0 bg-gradient-radial from-transparent via-red-900/10 to-red-900/30 rounded"></div>
          </div>
          
          {/* Door opening */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-gray-700 border-x border-red-500/50"></div>
          
          {/* Chamber sections */}
          <div className="absolute top-1/4 left-1/4 right-1/4 bottom-1/4 border border-red-500/20 rounded bg-red-500/5">
            {/* Central chamber area */}
          </div>
          
          {/* Grid overlay for positioning reference */}
          <div className="absolute inset-0 opacity-30">
            {[...Array(6)].map((_, i) => (
              <div
                key={`h-${i}`}
                className="absolute w-full h-px bg-red-500/20"
                style={{ top: `${(i + 1) * 16.66}%` }}
              />
            ))}
            {[...Array(6)].map((_, i) => (
              <div
                key={`v-${i}`}
                className="absolute h-full w-px bg-red-500/20"
                style={{ left: `${(i + 1) * 16.66}%` }}
              />
            ))}
          </div>
        </div>
        
        {/* Devices positioned in 3D space */}
        {devices.map((device) => {
          const pos = to2D(device.position?.x || 0, device.position?.z || 0);
          return (
            <div
              key={device.id}
              className="absolute w-3 h-3 -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
              style={{
                left: `${Math.max(5, Math.min(95, pos.x))}%`,
                top: `${Math.max(5, Math.min(95, pos.y))}%`,
              }}
              onClick={() => onDeviceClick?.(device)}
            >
              <div className={`w-full h-full ${
                device.type === 'light' ? 'bg-yellow-500 rounded-full shadow-yellow-500/50 shadow-lg' :
                device.type === 'camera' ? 'bg-blue-500 rounded-sm shadow-blue-500/50 shadow-lg' :
                device.type === 'lock' ? 'bg-red-600 rounded-sm shadow-red-600/50 shadow-lg' :
                device.type === 'sound' ? 'bg-purple-500 rounded-full shadow-purple-500/50 shadow-lg' :
                device.type === 'prop' ? 'bg-orange-500 rounded shadow-orange-500/50 shadow-lg' :
                device.type === 'sensor' ? 'bg-green-500 rounded-full shadow-green-500/50 shadow-lg' :
                device.type === 'display' ? 'bg-cyan-500 rounded-sm shadow-cyan-500/50 shadow-lg' :
                'bg-gray-500 rounded shadow-gray-500/50 shadow-lg'
              } ${device.status === 'online' ? 'animate-pulse' : 'opacity-50'} 
                group-hover:scale-150 transition-all duration-200`}>
              </div>
              
              {/* Device status indicator */}
              <div className={`absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full ${
                device.status === 'online' ? 'bg-green-400' : 'bg-red-400'
              }`}></div>
              
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-black/90 text-white text-xs rounded border border-red-500/30 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                {device.name} ({device.type})
              </div>
            </div>
          );
        })}
        
        {/* Participants positioned in 3D space */}
        {participants.map((participant) => {
          const pos = to2D(participant.position?.x || 0, participant.position?.z || 0);
          return (
            <div
              key={participant.id}
              className="absolute w-4 h-4 -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
              style={{
                left: `${Math.max(5, Math.min(95, pos.x))}%`,
                top: `${Math.max(5, Math.min(95, pos.y))}%`,
              }}
              onClick={() => onParticipantClick?.(participant)}
            >
              {/* Participant avatar */}
              <div className="w-full h-full bg-green-400 rounded-full shadow-lg shadow-green-400/50 border border-green-300 group-hover:scale-125 transition-transform animate-pulse">
                {/* Simple stick figure representation */}
                <div className="absolute inset-0.5 bg-green-600 rounded-full"></div>
              </div>
              
              {/* Movement trail effect */}
              <div className="absolute inset-0 bg-green-400/30 rounded-full animate-ping"></div>
              
              {/* Participant info tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-black/90 text-white text-xs rounded border border-green-500/30 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                {participant.name}
                {participant.heartRate && (
                  <div className="text-red-400">❤️ {participant.heartRate} BPM</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Compass in top-right */}
      <div className="absolute top-2 right-2 w-10 h-10 border border-red-500/50 rounded-full bg-black/70 flex items-center justify-center">
        <div className="text-red-400 text-xs font-bold">N</div>
        <div className="absolute top-1 w-px h-2 bg-red-400"></div>
      </div>
      
      {/* Legend */}
      <div className="absolute bottom-2 left-2 text-red-400 text-xs bg-black/50 px-2 py-1 rounded">
        <div>🟡 Lights 🔵 Cameras 🔴 Locks</div>
        <div>🟢 Participants • Top-Down View</div>
      </div>
      
      {/* Scale reference */}
      <div className="absolute bottom-2 right-2 text-red-400 text-xs bg-black/50 px-2 py-1 rounded">
        Scale: 1:10
      </div>
    </div>
  );
}