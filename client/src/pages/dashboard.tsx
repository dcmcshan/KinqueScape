import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  Clock, 
  Trophy, 
  AlertCircle, 
  CheckCircle, 
  Play, 
  Pause,
  RefreshCw,
  Calendar,
  DollarSign,
  TrendingUp,
  MapPin,
  Plus,
  Shield,
  Activity,
  Heart
} from "lucide-react";

export default function DashboardPage() {
  const [selectedRoom, setSelectedRoom] = useState("dungeon");

  const activeScapes = [
    {
      id: "dungeon",
      name: "Dungeon Demo",
      status: "active",
      players: 4,
      timeRemaining: 28,
      startTime: "2:30 PM",
      difficulty: "Hard",
      progress: 65,
      biometrics: {
        avgHeartRate: 98,
        highStressCount: 1,
        batteryLevel: 85
      },
      controlPath: "/room/dungeon"
    },
    {
      id: "haunted-mansion",
      name: "Haunted Mansion",
      status: "waiting",
      players: 6,
      timeRemaining: 60,
      startTime: "3:00 PM",
      difficulty: "Hard",
      progress: 0,
      biometrics: null,
      controlPath: null
    },
    {
      id: "space-station",
      name: "Space Station Escape",
      status: "completed",
      players: 3,
      timeRemaining: 0,
      startTime: "1:00 PM",
      difficulty: "Medium",
      progress: 100,
      biometrics: {
        avgHeartRate: 85,
        highStressCount: 0,
        batteryLevel: 92
      },
      controlPath: null
    }
  ];

  const todayStats = {
    totalGames: 12,
    revenue: 2140,
    successRate: 78,
    avgTime: 42
  };

  const upcomingBookings = [
    { time: "3:00 PM", room: "Space Station Escape", players: 6, customer: "Birthday Party Group" },
    { time: "4:30 PM", room: "Haunted Mansion", players: 4, customer: "Corporate Team" },
    { time: "6:00 PM", room: "Detective's Office", players: 2, customer: "Date Night" },
    { time: "7:30 PM", room: "Pirate Ship", players: 8, customer: "Friends Group" }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500";
      case "waiting": return "bg-yellow-500";
      case "completed": return "bg-blue-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active": return <Play className="w-4 h-4" />;
      case "waiting": return <Clock className="w-4 h-4" />;
      case "completed": return <CheckCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-background p-6 pt-20 lg:pt-6">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tron-text">Live Dashboard</h1>
            <p className="text-muted-foreground mt-1">Monitor and manage your active 'scapes with real-time biometrics</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" className="tron-button">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button size="sm" className="tron-button">
              <Plus className="w-4 h-4 mr-2" />
              New Session
            </Button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        <Card className="tron-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-accent">Today's Games</CardTitle>
            <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold text-foreground">{todayStats.totalGames}</div>
            <p className="text-xs text-muted-foreground">+20% from yesterday</p>
          </CardContent>
        </Card>

        <Card className="tron-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-accent">Revenue</CardTitle>
            <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold text-foreground">${todayStats.revenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+15% from yesterday</p>
          </CardContent>
        </Card>

        <Card className="tron-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-accent">Success Rate</CardTitle>
            <Trophy className="h-3 w-3 sm:h-4 sm:w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold text-foreground">{todayStats.successRate}%</div>
            <p className="text-xs text-muted-foreground">+3% from yesterday</p>
          </CardContent>
        </Card>

        <Card className="tron-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-accent">Avg. Heart Rate</CardTitle>
            <Heart className="h-3 w-3 sm:h-4 sm:w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold text-foreground">92 BPM</div>
            <p className="text-xs text-muted-foreground">Biometric monitoring active</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Scapes */}
        <div className="lg:col-span-2">
          <Card className="tron-card">
            <CardHeader>
              <CardTitle className="text-accent">Active 'Scapes</CardTitle>
              <CardDescription>Monitor games in progress with real-time biometrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeScapes.map((scape) => (
                  <div
                    key={scape.id}
                    className={`p-3 sm:p-4 rounded-lg border-2 transition-colors cursor-pointer ${
                      selectedRoom === scape.id ? "border-accent bg-accent/5 tron-glow" : "border-muted hover:border-accent/50"
                    }`}
                    onClick={() => setSelectedRoom(scape.id)}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(scape.status)} tron-pulse`}></div>
                        <h3 className="font-semibold text-foreground text-sm sm:text-base">{scape.name}</h3>
                        <Badge variant="outline" className="text-xs border-accent text-accent">
                          {scape.difficulty}
                        </Badge>
                        {scape.id === "dungeon" && (
                          <Badge variant="outline" className="text-xs border-accent text-accent hidden sm:inline-flex">
                            <Activity className="w-3 h-3 mr-1" />
                            Biometric
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(scape.status)}
                        <span className="text-sm text-muted-foreground capitalize">{scape.status}</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-3">
                      <div className="text-center">
                        <div className="flex items-center justify-center text-muted-foreground mb-1">
                          <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                          <span className="text-xs sm:text-sm">Players</span>
                        </div>
                        <div className="font-semibold text-foreground text-sm sm:text-base">{scape.players}</div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center text-muted-foreground mb-1">
                          <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                          <span className="text-xs sm:text-sm">Time Left</span>
                        </div>
                        <div className="font-semibold text-foreground text-sm sm:text-base">{scape.timeRemaining}m</div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center text-muted-foreground mb-1">
                          <Play className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                          <span className="text-xs sm:text-sm">Started</span>
                        </div>
                        <div className="font-semibold text-foreground text-sm sm:text-base">{scape.startTime}</div>
                      </div>
                    </div>
                    
                    {/* Biometric Data */}
                    {scape.biometrics && (
                      <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-3 p-2 sm:p-3 bg-accent/10 rounded-lg">
                        <div className="text-center">
                          <div className="flex items-center justify-center text-accent mb-1">
                            <Heart className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                            <span className="text-xs sm:text-sm">Avg HR</span>
                          </div>
                          <div className="font-semibold text-accent text-sm sm:text-base">{scape.biometrics.avgHeartRate} BPM</div>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center text-accent mb-1">
                            <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                            <span className="text-xs sm:text-sm">Stress</span>
                          </div>
                          <div className="font-semibold text-accent text-sm sm:text-base">{scape.biometrics.highStressCount} High</div>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center text-accent mb-1">
                            <Activity className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                            <span className="text-xs sm:text-sm">Battery</span>
                          </div>
                          <div className="font-semibold text-accent text-sm sm:text-base">{scape.biometrics.batteryLevel}%</div>
                        </div>
                      </div>
                    )}
                    
                    {scape.status === "active" && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-medium text-accent">{scape.progress}%</span>
                        </div>
                        <Progress value={scape.progress} className="h-2" />
                      </div>
                    )}
                    
                    {scape.status === "active" && (
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mt-3">
                        <Button size="sm" variant="outline" className="tron-button flex-1 sm:flex-initial">
                          <Pause className="w-4 h-4 mr-2" />
                          <span className="hidden sm:inline">Pause</span>
                        </Button>
                        <Button size="sm" variant="outline" className="tron-button flex-1 sm:flex-initial">
                          <AlertCircle className="w-4 h-4 mr-2" />
                          <span className="hidden sm:inline">Hint</span>
                        </Button>
                        {scape.controlPath ? (
                          <Link href={scape.controlPath} className="flex-1 sm:flex-initial">
                            <Button size="sm" variant="outline" className="tron-button w-full">
                              <Shield className="w-4 h-4 mr-2" />
                              Control Room
                            </Button>
                          </Link>
                        ) : (
                          <Button size="sm" variant="outline" className="tron-button flex-1 sm:flex-initial">
                            <MapPin className="w-4 h-4 mr-2" />
                            <span className="hidden sm:inline">Monitor</span>
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Bookings */}
        <div>
          <Card className="tron-card">
            <CardHeader>
              <CardTitle className="text-accent">Upcoming Bookings</CardTitle>
              <CardDescription>Today's scheduled sessions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingBookings.map((booking, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-accent/5 rounded-lg border border-accent/20">
                    <div>
                      <div className="font-semibold text-foreground">{booking.time}</div>
                      <div className="text-sm text-muted-foreground">{booking.room}</div>
                      <div className="text-xs text-muted-foreground">{booking.customer}</div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center text-sm text-accent">
                        <Users className="w-4 h-4 mr-1" />
                        {booking.players}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <Button className="w-full mt-4 tron-button" variant="outline">
                <Calendar className="w-4 h-4 mr-2" />
                View Full Schedule
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="mt-6 tron-card">
            <CardHeader>
              <CardTitle className="text-accent">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-2">
                <Link href="/room/dungeon">
                  <Button className="w-full tron-button" variant="outline">
                    <Shield className="w-4 h-4 mr-2" />
                    Dungeon Control Room
                  </Button>
                </Link>
                <Button className="w-full tron-button" variant="outline">
                  <Play className="w-4 h-4 mr-2" />
                  Start Walk-in Session
                </Button>
                <Button className="w-full tron-button" variant="outline">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Emergency Reset
                </Button>
                <Button className="w-full tron-button" variant="outline">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  View Analytics
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}