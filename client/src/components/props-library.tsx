import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, Search, ExternalLink, Wifi, Bluetooth, Zap, Plus } from "lucide-react";

interface PropDevice {
  id: string;
  name: string;
  brand: string;
  category: "toys" | "locks" | "lighting" | "sensors" | "restraints";
  connectivity: string[];
  price: number;
  amazonUrl: string;
  description: string;
  features: string[];
  researchValue: string;
  integration: string;
}

const smartDevices: PropDevice[] = [
  // LOVENSE COLLECTION
  {
    id: "lovense-lush-3",
    name: "Lush 3",
    brand: "LOVENSE",
    category: "toys",
    connectivity: ["BLE", "App"],
    price: 119,
    amazonUrl: "https://www.amazon.com/LOVENSE-Vibrator-Redesigned-Stimulator-Bluetooth/dp/B089Q6JVX8",
    description: "Most popular app-controlled vibrator with excellent BLE connectivity and biometric integration potential.",
    features: ["Bluetooth Low Energy 4.0", "Smartphone app control", "Unlimited vibration patterns", "Body-safe silicone", "2+ hour battery life"],
    researchValue: "Perfect for biometric integration testing",
    integration: "Heart rate responsive patterns, stress level adaptation"
  },
  {
    id: "lovense-edge-2",
    name: "Edge 2",
    brand: "LOVENSE",
    category: "toys",
    connectivity: ["BLE", "App"],
    price: 149,
    amazonUrl: "https://www.amazon.com/Lovense-Prostate-Massager-Bluetooth-Controlled/dp/B087QZPK2Y",
    description: "Adjustable prostate massager with dual motors and smartphone connectivity.",
    features: ["Dual motor design", "Adjustable neck", "App control", "Magnetic charging", "Waterproof design"],
    researchValue: "Male prostate stimulation, biometric response testing",
    integration: "Synchronized with partner devices, stress monitoring"
  },
  {
    id: "we-vibe-sync",
    name: "Sync",
    brand: "We-Vibe",
    category: "toys",
    connectivity: ["BLE", "App"],
    price: 179,
    amazonUrl: "https://www.amazon.com/Sync-Vibrating-Vibrations-Controlled-Stimulator/dp/B0CHK1FG27",
    description: "Couples vibrator with dual connectivity options and partner remote control capabilities.",
    features: ["Dual motor design", "Partner remote control", "10+ vibration modes", "Rechargeable battery", "Waterproof design"],
    researchValue: "Couples synchronization and remote control",
    integration: "Partner biometric sync, shared experiences"
  },
  {
    id: "master-lock-4400d",
    name: "4400D Smart Padlock",
    brand: "Master Lock",
    category: "locks",
    connectivity: ["BLE", "App"],
    price: 59,
    amazonUrl: "https://www.amazon.com/Master-Lock-4400D-Bluetooth-Padlock/dp/B01E7FFTAG",
    description: "Entry-level smart padlock perfect for basic restraint applications with reliable BLE connectivity.",
    features: ["Bluetooth 4.0 connectivity", "Smartphone app control", "Backup key access", "Weather-resistant design", "2-year battery life"],
    researchValue: "Basic smart lock testing, restraint applications",
    integration: "Timer-based release, emergency protocols"
  },
  {
    id: "philips-hue-play",
    name: "Hue Play Light Bar",
    brand: "Philips",
    category: "lighting",
    connectivity: ["WiFi", "BLE", "App"],
    price: 129,
    amazonUrl: "https://www.amazon.com/Philips-Hue-Bluetooth-Entertainment-Compatible/dp/B07GXB3S7Z",
    description: "Smart light bars with millions of colors and entertainment sync capabilities.",
    features: ["16 million colors", "Entertainment sync", "App control", "Voice control", "Easy setup"],
    researchValue: "Mood lighting, biometric color response",
    integration: "Heart rate color mapping, arousal visualization"
  },
  {
    id: "aqara-motion-sensor",
    name: "Motion Sensor P1",
    brand: "Aqara",
    category: "sensors",
    connectivity: ["WiFi", "BLE", "App"],
    price: 19,
    amazonUrl: "https://www.amazon.com/Aqara-Motion-Sensor-Detection-Compatible/dp/B07PJT939B",
    description: "Ultra-precise motion sensor with customizable detection zones and smart home integration.",
    features: ["120-degree detection", "Customizable zones", "Smart home integration", "Battery powered", "Compact design"],
    researchValue: "Motion tracking, position monitoring",
    integration: "Participant position tracking, movement pattern analysis"
  }
];

interface PropsLibraryProps {
  onAddProp?: (prop: PropDevice) => void;
}

export default function PropsLibrary({ onAddProp }: PropsLibraryProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredDevices = smartDevices.filter(device => {
    const matchesSearch = device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         device.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         device.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || device.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categoryStats = {
    all: smartDevices.length,
    toys: smartDevices.filter(d => d.category === "toys").length,
    locks: smartDevices.filter(d => d.category === "locks").length,
    lighting: smartDevices.filter(d => d.category === "lighting").length,
    sensors: smartDevices.filter(d => d.category === "sensors").length,
    restraints: smartDevices.filter(d => d.category === "restraints").length,
  };

  const getConnectivityIcon = (type: string) => {
    switch (type) {
      case "BLE": return <Bluetooth className="w-3 h-3" />;
      case "WiFi": return <Wifi className="w-3 h-3" />;
      case "App": return <Zap className="w-3 h-3" />;
      default: return <Package className="w-3 h-3" />;
    }
  };

  const getConnectivityColor = (type: string) => {
    switch (type) {
      case "BLE": return "bg-blue-100 text-blue-800 border-blue-200";
      case "WiFi": return "bg-green-100 text-green-800 border-green-200";
      case "App": return "bg-purple-100 text-purple-800 border-purple-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold tron-text">Smart Props Library</h3>
          <Badge className="bg-accent/10 text-accent border-accent">
            {filteredDevices.length} devices
          </Badge>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search props by name, brand, or features..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          <Button 
            variant={selectedCategory === "all" ? "default" : "outline"} 
            size="sm"
            onClick={() => setSelectedCategory("all")}
            className="tron-button"
          >
            All ({categoryStats.all})
          </Button>
          <Button 
            variant={selectedCategory === "toys" ? "default" : "outline"} 
            size="sm"
            onClick={() => setSelectedCategory("toys")}
            className="tron-button"
          >
            Toys ({categoryStats.toys})
          </Button>
          <Button 
            variant={selectedCategory === "locks" ? "default" : "outline"} 
            size="sm"
            onClick={() => setSelectedCategory("locks")}
            className="tron-button"
          >
            Locks ({categoryStats.locks})
          </Button>
          <Button 
            variant={selectedCategory === "lighting" ? "default" : "outline"} 
            size="sm"
            onClick={() => setSelectedCategory("lighting")}
            className="tron-button"
          >
            Lighting ({categoryStats.lighting})
          </Button>
          <Button 
            variant={selectedCategory === "sensors" ? "default" : "outline"} 
            size="sm"
            onClick={() => setSelectedCategory("sensors")}
            className="tron-button"
          >
            Sensors ({categoryStats.sensors})
          </Button>
        </div>
      </div>

      {/* Props List */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {filteredDevices.map((device) => (
            <Card key={device.id} className="tron-border">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <CardTitle className="text-sm">{device.name}</CardTitle>
                      <Badge variant="outline" className="text-xs">
                        {device.brand}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{device.description}</p>
                    
                    {/* Connectivity Badges */}
                    <div className="flex flex-wrap gap-1 mb-2">
                      {device.connectivity.map((conn) => (
                        <Badge 
                          key={conn} 
                          className={`text-xs ${getConnectivityColor(conn)}`}
                        >
                          {getConnectivityIcon(conn)}
                          <span className="ml-1">{conn}</span>
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-semibold text-accent">${device.price}</div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <div className="text-xs text-muted-foreground">
                    {device.researchValue}
                  </div>
                  <div className="flex gap-2">
                    {onAddProp && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => onAddProp(device)}
                        className="text-xs"
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Add to Room
                      </Button>
                    )}
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => window.open(device.amazonUrl, '_blank')}
                      className="text-xs"
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      View
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {filteredDevices.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No props found matching your criteria</p>
              <p className="text-sm">Try adjusting your search or category filter</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}