import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { 
  Activity, 
  Heart, 
  Users, 
  Play, 
  Pause, 
  Square, 
  Settings, 
  Eye,
  Zap,
  Shield,
  MapPin,
  Clock,
  Battery,
  UserPlus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { apiRequest, queryClient } from "@/lib/queryClient";
import RealUnityWebGL from "@/components/real-unity-webgl";
import Minimap2D from "@/components/minimap-2d";
import ThreeJS3DViewer from "@/components/threejs-3d-viewer";
import type { Room, RoomParticipant, RoomDevice, BiometricData } from "@shared/schema";

export default function RoomDungeonPage() {
  const [roomStatus, setRoomStatus] = useState<"waiting" | "active" | "paused" | "completed">("waiting");
  const [selectedParticipant, setSelectedParticipant] = useState<number | null>(null);

  // Fetch room data
  const { data: room } = useQuery<Room>({
    queryKey: ["/api/rooms/dungeon"],
    refetchInterval: 5000,
  });

  const { data: participants = [] } = useQuery<RoomParticipant[]>({
    queryKey: ["/api/rooms", room?.id, "participants"],
    enabled: !!room?.id,
    refetchInterval: 2000,
  });

  const { data: devices = [] } = useQuery<RoomDevice[]>({
    queryKey: ["/api/rooms", room?.id, "devices"],
    enabled: !!room?.id,
    refetchInterval: 3000,
  });

  const { data: biometrics = [] } = useQuery<BiometricData[]>({
    queryKey: ["/api/rooms", room?.id, "biometrics"],
    enabled: !!room?.id,
    refetchInterval: 1000,
  });

  // Device control mutation
  const controlDeviceMutation = useMutation({
    mutationFn: async ({ deviceId, status, properties }: { deviceId: number, status: string, properties?: any }) => {
      const response = await apiRequest("PUT", `/api/rooms/${room?.id}/devices/${deviceId}`, {
        status,
        properties,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/rooms", room?.id, "devices"] });
    },
  });

  // Add participant mutation
  const addParticipantMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", `/api/rooms/${room?.id}/participants/demo`, {});
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/rooms", room?.id, "participants"] });
    },
  });

  // Start biometric simulation
  const startBiometricSimulation = useMutation({
    mutationFn: async (participantId: number) => {
      const response = await apiRequest("POST", `/api/rooms/${room?.id}/participants/${participantId}/simulate-biometrics`, {});
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/rooms", room?.id, "biometrics"] });
    },
  });

  const getParticipantBiometrics = (participantId: number) => {
    return biometrics
      .filter(b => b.participantId === participantId)
      .sort((a, b) => new Date(b.timestamp!).getTime() - new Date(a.timestamp!).getTime())[0];
  };

  const getStressLevel = (heartRate?: number, hrv?: number) => {
    if (!heartRate) return "unknown";
    if (heartRate > 120 || (hrv && hrv < 20)) return "high";
    if (heartRate > 90 || (hrv && hrv < 30)) return "medium";
    return "low";
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case "light": return <Zap className="w-4 h-4" />;
      case "lock": return <Shield className="w-4 h-4" />;
      case "camera": return <Eye className="w-4 h-4" />;
      case "sound": return <Activity className="w-4 h-4" />;
      default: return <Settings className="w-4 h-4" />;
    }
  };

  if (!room) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="tron-pulse">
            <Activity className="w-12 h-12 text-accent mx-auto mb-4" />
          </div>
          <h2 className="text-xl font-semibold tron-text mb-2">Initializing Dungeon</h2>
          <p className="text-muted-foreground">Loading room systems...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-1 sm:p-4 lg:p-6">
      {/* Header */}
      <div className="mb-4 sm:mb-6 lg:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tron-text">{room.name}</h1>
            <p className="text-sm sm:text-base text-muted-foreground">Unity 3D Room Control & Biometric Monitoring</p>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
            <Badge variant={roomStatus === "active" ? "default" : "secondary"} className="text-xs sm:text-sm">
              {roomStatus.toUpperCase()}
            </Badge>
            <div className="flex flex-wrap gap-1 sm:gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setRoomStatus("active")}
                disabled={roomStatus === "active"}
                className="tron-button text-xs sm:text-sm px-2 sm:px-3"
              >
                <Play className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                Start
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setRoomStatus("paused")}
                disabled={roomStatus !== "active"}
                className="tron-button text-xs sm:text-sm px-2 sm:px-3"
              >
                <Pause className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                Pause
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setRoomStatus("completed")}
                className="tron-button text-xs sm:text-sm px-2 sm:px-3"
              >
                <Square className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                End
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3 sm:space-y-4 lg:space-y-6">
        {/* Unity 3D Viewer - Full Width Priority */}
        <div className="w-full -mx-1 sm:mx-0">
          <RealUnityWebGL
            devices={devices}
            participants={participants}
            onDeviceClick={(device) => {
              controlDeviceMutation.mutate({
                deviceId: device.id,
                status: device.status === "online" ? "offline" : "online",
              });
            }}
            onParticipantClick={(participant) => {
              setSelectedParticipant(participant.id);
            }}
          />
        </div>

        {/* Secondary Controls Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 2D Mini-Map */}
          <div className="lg:col-span-1">
            <Minimap2D
              devices={devices}
              participants={participants}
              onDeviceClick={(device) => {
                controlDeviceMutation.mutate({
                  deviceId: device.id,
                  status: device.status === "online" ? "offline" : "online",
                });
              }}
              onParticipantClick={(participant) => {
                setSelectedParticipant(participant.id);
              }}
            />
          </div>

          {/* Device Controls */}
          <div className="lg:col-span-2">
            <Card className="tron-card">
              <CardHeader>
                <CardTitle className="text-accent">Device Controls</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {devices.slice(0, 8).map((device) => (
                    <div
                      key={device.id}
                      className="tron-card p-3 rounded-lg text-center"
                    >
                      <div className="flex items-center justify-center mb-1">
                        {getDeviceIcon(device.type)}
                      </div>
                      <h4 className="font-medium text-xs mb-1 truncate">{device.name}</h4>
                      <Badge
                        variant={device.status === "online" ? "default" : "secondary"}
                        className="text-xs mb-1"
                      >
                        {device.status}
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full tron-button text-xs"
                        onClick={() => controlDeviceMutation.mutate({
                          deviceId: device.id,
                          status: device.status === "online" ? "offline" : "online",
                        })}
                      >
                        Toggle
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Monitoring Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Participants */}
          <Card className="tron-card">
            <CardHeader>
              <CardTitle className="text-accent flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Participants ({participants.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {participants.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-gray-400 mb-3">No participants in the room</p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="tron-button"
                      onClick={() => addParticipantMutation.mutate()}
                      disabled={addParticipantMutation.isPending}
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      Add Demo Participant
                    </Button>
                  </div>
                ) : (
                  participants.map((participant) => {
                    const biometric = getParticipantBiometrics(participant.id);
                    const stressLevel = getStressLevel(biometric?.heartRate || undefined, biometric?.hrv || undefined);
                    
                    return (
                      <div
                        key={participant.id}
                        className={`tron-card p-3 rounded-lg cursor-pointer transition-all ${
                          selectedParticipant === participant.id ? 'tron-glow' : ''
                        }`}
                        onClick={() => setSelectedParticipant(participant.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{participant.name}</h4>
                            <p className="text-sm text-gray-400">Watch: {participant.watchId}</p>
                          </div>
                          <div className="text-right">
                            <Badge variant={getStressBadgeVariant(stressLevel)}>
                              {stressLevel}
                            </Badge>
                            {biometric && (
                              <div className="text-xs text-gray-400 mt-1">
                                HR: {biometric.heartRate} BPM
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>

          {/* Device Controls */}
          <Card className="tron-card">
            <CardHeader>
              <CardTitle className="text-accent">Device Controls</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {devices.map((device) => (
                  <div
                    key={device.id}
                    className="tron-card p-4 rounded-lg text-center"
                  >
                    <div className="flex items-center justify-center mb-2">
                      {getDeviceIcon(device.type)}
                    </div>
                    <h4 className="font-medium text-sm mb-1">{device.name}</h4>
                    <Badge
                      variant={device.status === "online" ? "default" : "secondary"}
                      className="text-xs mb-2"
                    >
                      {device.status}
                    </Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full tron-button text-xs"
                      onClick={() => controlDeviceMutation.mutate({
                        deviceId: device.id,
                        status: device.status === "online" ? "offline" : "online",
                      })}
                    >
                      Toggle
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Participant Monitoring */}
        <div className="space-y-6">
          <Card className="tron-card">
            <CardHeader>
              <CardTitle className="text-accent flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Participants ({participants.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {participants.map((participant) => {
                  const biometric = getParticipantBiometrics(participant.id);
                  const stressLevel = getStressLevel(biometric?.heartRate || undefined, biometric?.hrv || undefined);
                  
                  return (
                    <div
                      key={participant.id}
                      className={`tron-card p-3 rounded-lg cursor-pointer transition-all ${
                        selectedParticipant === participant.id ? 'tron-glow' : ''
                      }`}
                      onClick={() => setSelectedParticipant(
                        selectedParticipant === participant.id ? null : participant.id
                      )}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm">{participant.participantName}</span>
                        <div className="flex items-center space-x-2">
                          <Badge
                            variant={stressLevel === "high" ? "destructive" : stressLevel === "medium" ? "secondary" : "default"}
                            className="text-xs"
                          >
                            {stressLevel}
                          </Badge>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              startBiometricSimulation.mutate(participant.id);
                            }}
                            className="tron-button text-xs px-2 py-1"
                          >
                            <Activity className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      
                      {biometric && (
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="flex items-center">
                            <Heart className="w-3 h-3 mr-1 text-red-500" />
                            <span>{biometric.heartRate || "--"} BPM</span>
                          </div>
                          <div className="flex items-center">
                            <Activity className="w-3 h-3 mr-1 text-blue-500" />
                            <span>{biometric.hrv || "--"} ms</span>
                          </div>
                          <div className="flex items-center">
                            <MapPin className="w-3 h-3 mr-1 text-green-500" />
                            <span>({participant.positionX?.toFixed(1)}, {participant.positionY?.toFixed(1)})</span>
                          </div>
                          <div className="flex items-center">
                            <Battery className="w-3 h-3 mr-1 text-yellow-500" />
                            <span>{biometric.batteryLevel || "--"}%</span>
                          </div>
                        </div>
                      )}
                      
                      {participant.watchId && (
                        <div className="mt-2 text-xs text-muted-foreground">
                          Watch: {participant.watchId}
                        </div>
                      )}
                    </div>
                  );
                })}
                
                {participants.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No participants in room</p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => addParticipantMutation.mutate()}
                      className="tron-button mt-2"
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      Add Demo Participant
                    </Button>
                  </div>
                )}
                
                {participants.length > 0 && (
                  <div className="pt-3 border-t border-accent/30">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => addParticipantMutation.mutate()}
                      className="tron-button w-full"
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      Add Another Participant
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Room Stats */}
          <Card className="tron-card">
            <CardHeader>
              <CardTitle className="text-accent">Room Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Capacity</span>
                  <span className="font-medium">{participants.length}/{room.maxParticipants}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Average HR</span>
                  <span className="font-medium">
                    {biometrics.length > 0 
                      ? Math.round(biometrics.reduce((sum, b) => sum + (b.heartRate || 0), 0) / biometrics.length)
                      : "--"} BPM
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Session Time</span>
                  <span className="font-medium flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {roomStatus === "active" ? "15:42" : "00:00"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Devices Online</span>
                  <span className="font-medium">
                    {devices.filter(d => d.status === "online").length}/{devices.length}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Emergency Controls */}
          <Card className="tron-card">
            <CardHeader>
              <CardTitle className="text-destructive">Emergency Controls</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button variant="destructive" size="sm" className="w-full">
                  <Shield className="w-4 h-4 mr-2" />
                  Emergency Stop
                </Button>
                <Button variant="outline" size="sm" className="w-full">
                  <Eye className="w-4 h-4 mr-2" />
                  Security Override
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}