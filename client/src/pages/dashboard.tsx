import { useState } from "react";
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
  Plus
} from "lucide-react";

export default function DashboardPage() {
  const [selectedRoom, setSelectedRoom] = useState("haunted-mansion");

  const activeScapes = [
    {
      id: "haunted-mansion",
      name: "Haunted Mansion",
      status: "active",
      players: 4,
      timeRemaining: 28,
      startTime: "2:30 PM",
      difficulty: "Hard",
      progress: 65
    },
    {
      id: "space-station",
      name: "Space Station Escape",
      status: "waiting",
      players: 6,
      timeRemaining: 60,
      startTime: "3:00 PM",
      difficulty: "Medium",
      progress: 0
    },
    {
      id: "detective-office",
      name: "Detective's Office",
      status: "completed",
      players: 3,
      timeRemaining: 0,
      startTime: "1:00 PM",
      difficulty: "Easy",
      progress: 100
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
    <div className="p-6 pt-20 lg:pt-6">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Live Dashboard</h1>
            <p className="text-gray-600 mt-1">Monitor and manage your active 'scapes in real-time</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              New Session
            </Button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Games</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayStats.totalGames}</div>
            <p className="text-xs text-muted-foreground">+20% from yesterday</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${todayStats.revenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+15% from yesterday</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayStats.successRate}%</div>
            <p className="text-xs text-muted-foreground">+3% from yesterday</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayStats.avgTime}m</div>
            <p className="text-xs text-muted-foreground">-2m from yesterday</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Scapes */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Active 'Scapes</CardTitle>
              <CardDescription>Monitor games in progress and upcoming sessions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeScapes.map((scape) => (
                  <div
                    key={scape.id}
                    className={`p-4 rounded-lg border-2 transition-colors cursor-pointer ${
                      selectedRoom === scape.id ? "border-primary bg-primary/5" : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => setSelectedRoom(scape.id)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(scape.status)}`}></div>
                        <h3 className="font-semibold text-gray-900">{scape.name}</h3>
                        <Badge variant="outline" className="text-xs">
                          {scape.difficulty}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(scape.status)}
                        <span className="text-sm text-gray-600 capitalize">{scape.status}</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 mb-3">
                      <div className="text-center">
                        <div className="flex items-center justify-center text-gray-600 mb-1">
                          <Users className="w-4 h-4 mr-1" />
                          <span className="text-sm">Players</span>
                        </div>
                        <div className="font-semibold">{scape.players}</div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center text-gray-600 mb-1">
                          <Clock className="w-4 h-4 mr-1" />
                          <span className="text-sm">Time Left</span>
                        </div>
                        <div className="font-semibold">{scape.timeRemaining}m</div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center text-gray-600 mb-1">
                          <Play className="w-4 h-4 mr-1" />
                          <span className="text-sm">Started</span>
                        </div>
                        <div className="font-semibold">{scape.startTime}</div>
                      </div>
                    </div>
                    
                    {scape.status === "active" && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Progress</span>
                          <span className="font-medium">{scape.progress}%</span>
                        </div>
                        <Progress value={scape.progress} className="h-2" />
                      </div>
                    )}
                    
                    {scape.status === "active" && (
                      <div className="flex items-center space-x-2 mt-3">
                        <Button size="sm" variant="outline">
                          <Pause className="w-4 h-4 mr-2" />
                          Pause
                        </Button>
                        <Button size="sm" variant="outline">
                          <AlertCircle className="w-4 h-4 mr-2" />
                          Hint
                        </Button>
                        <Button size="sm" variant="outline">
                          <MapPin className="w-4 h-4 mr-2" />
                          Monitor
                        </Button>
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
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Bookings</CardTitle>
              <CardDescription>Today's scheduled sessions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingBookings.map((booking, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-semibold text-gray-900">{booking.time}</div>
                      <div className="text-sm text-gray-600">{booking.room}</div>
                      <div className="text-xs text-gray-500">{booking.customer}</div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="w-4 h-4 mr-1" />
                        {booking.players}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <Button className="w-full mt-4" variant="outline">
                <Calendar className="w-4 h-4 mr-2" />
                View Full Schedule
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-2">
                <Button className="w-full" variant="outline">
                  <Play className="w-4 h-4 mr-2" />
                  Start Walk-in Session
                </Button>
                <Button className="w-full" variant="outline">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Emergency Reset
                </Button>
                <Button className="w-full" variant="outline">
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