import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bluetooth, Wifi, Zap, Heart, Lock, Shield, ExternalLink, DollarSign } from "lucide-react";

interface PropDevice {
  id: string;
  name: string;
  brand: string;
  category: "toys" | "locks" | "lighting" | "sensors" | "restraints";
  connectivity: ("BLE" | "WiFi" | "NFC" | "App")[];
  price: number;
  amazonUrl: string;
  description: string;
  features: string[];
  image?: string;
  researchValue: string;
  integration: string;
}

const smartDevices: PropDevice[] = [
  {
    id: "lovense-lush-3",
    name: "Lush 3",
    brand: "LOVENSE",
    category: "toys",
    connectivity: ["BLE", "App"],
    price: 119,
    amazonUrl: "https://www.amazon.com/Lovense-Bluetooth-Controlled-Rechargeable-Waterproof/dp/B07QMKQX8R",
    description: "Most popular app-controlled vibrator with excellent BLE connectivity and biometric integration potential.",
    features: [
      "Bluetooth Low Energy 4.0",
      "Smartphone app control",
      "Unlimited vibration patterns",
      "Body-safe silicone",
      "2+ hour battery life"
    ],
    researchValue: "Perfect for biometric integration testing",
    integration: "Heart rate responsive patterns, stress level adaptation"
  },
  {
    id: "we-vibe-sync",
    name: "Sync",
    brand: "We-Vibe",
    category: "toys",
    connectivity: ["BLE", "App"],
    price: 179,
    amazonUrl: "https://www.amazon.com/We-Vibe-Couples-Vibrator-Remote/dp/B071Z8PQMX",
    description: "Couples vibrator with dual connectivity options and partner remote control capabilities.",
    features: [
      "Dual motor design",
      "Partner remote control",
      "10+ vibration modes", 
      "Rechargeable battery",
      "Waterproof design"
    ],
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
    features: [
      "Bluetooth 4.0 connectivity",
      "Smartphone app control",
      "Backup key access",
      "Weather-resistant design",
      "2-year battery life"
    ],
    researchValue: "Basic smart lock testing, restraint applications",
    integration: "Timer-based release, emergency protocols"
  },
  {
    id: "smonet-padlock",
    name: "Smart Fingerprint Padlock",
    brand: "SMONET",
    category: "locks",
    connectivity: ["WiFi", "BLE", "App"],
    price: 49,
    amazonUrl: "https://www.amazon.com/SMONET-Bluetooth-Fingerprint-Waterproof-Rechargeable/dp/B08HHXM7KL",
    description: "Multi-access smart lock with fingerprint scanner, perfect for biometric integration testing.",
    features: [
      "Fingerprint recognition",
      "WiFi and Bluetooth dual connectivity",
      "IP65 waterproof rating",
      "Rechargeable battery",
      "100 fingerprint storage"
    ],
    researchValue: "Biometric integration, multi-access testing",
    integration: "Partner fingerprint access, biometric safety release"
  },
  {
    id: "lelo-hugo",
    name: "Hugo",
    brand: "LELO",
    category: "toys",
    connectivity: ["BLE", "App"],
    price: 179,
    amazonUrl: "https://www.amazon.com/LELO-Remote-Control-Couples-Massager/dp/B00O7F8PQI",
    description: "Premium couples massager with sophisticated app control and multiple intensity settings.",
    features: [
      "SenseMotion technology",
      "Remote control capability",
      "8 stimulation patterns",
      "Ultra-quiet operation",
      "Rechargeable battery"
    ],
    researchValue: "Premium device testing, advanced pattern control",
    integration: "Biometric pattern adaptation, couples coordination"
  },
  {
    id: "lockly-secure-pro",
    name: "Secure Pro Smart Lock",
    brand: "Lockly",
    category: "locks",
    connectivity: ["WiFi", "BLE", "App"],
    price: 189,
    amazonUrl: "https://www.amazon.com/Lockly-Smart-Lock-Keyless-Biometric/dp/B0B3JQXM9P",
    description: "Heavy-duty smart lock with 3D fingerprint technology and voice control integration.",
    features: [
      "3D fingerprint scanner",
      "Voice control support",
      "Anti-peep keypad",
      "Military-grade construction",
      "Mobile app control"
    ],
    researchValue: "Heavy-duty restraint testing, voice activation",
    integration: "Voice safety commands, high-security restraints"
  },
  {
    id: "kiiroo-onyx",
    name: "Onyx+",
    brand: "Kiiroo",
    category: "toys",
    connectivity: ["BLE", "WiFi", "App"],
    price: 179,
    amazonUrl: "https://www.amazon.com/Kiiroo-Interactive-Male-Masturbator-Onyx/dp/B07D7TWQZV",
    description: "Interactive male device with real-time connectivity and partner synchronization capabilities.",
    features: [
      "Real-time interaction",
      "Partner device sync",
      "Touch-sensitive technology",
      "Rechargeable design",
      "Multiple speed settings"
    ],
    researchValue: "Male device integration, real-time sync",
    integration: "Partner device coordination, biometric response"
  },
  {
    id: "egetouch-padlock",
    name: "3rd Gen Smart Padlock",
    brand: "eGeeTouch",
    category: "locks",
    connectivity: ["BLE", "NFC", "App"],
    price: 119,
    amazonUrl: "https://www.amazon.com/eGeeTouch-Generation-Padlock-Bluetooth-Commercial/dp/B07BQXM8VL",
    description: "Commercial-grade smart lock with NFC capabilities and GPS tracking for professional applications.",
    features: [
      "NFC quick access",
      "GPS location tracking",
      "Commercial durability",
      "Audit trail logging",
      "Weather-resistant"
    ],
    researchValue: "Commercial-grade testing, NFC integration",
    integration: "Professional dungeon equipment, NFC quick-release"
  }
];

const getConnectivityIcon = (type: string) => {
  switch (type) {
    case "BLE": return <Bluetooth className="w-4 h-4" />;
    case "WiFi": return <Wifi className="w-4 h-4" />;
    case "App": return <Heart className="w-4 h-4" />;
    case "NFC": return <Zap className="w-4 h-4" />;
    default: return <Shield className="w-4 h-4" />;
  }
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case "toys": return "bg-pink-100 text-pink-800 border-pink-200";
    case "locks": return "bg-blue-100 text-blue-800 border-blue-200";
    case "lighting": return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "sensors": return "bg-green-100 text-green-800 border-green-200";
    case "restraints": return "bg-purple-100 text-purple-800 border-purple-200";
    default: return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

export default function PropsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredDevices = selectedCategory === "all" 
    ? smartDevices 
    : smartDevices.filter(device => device.category === selectedCategory);

  const categoryStats = {
    all: smartDevices.length,
    toys: smartDevices.filter(d => d.category === "toys").length,
    locks: smartDevices.filter(d => d.category === "locks").length,
    lighting: smartDevices.filter(d => d.category === "lighting").length,
    sensors: smartDevices.filter(d => d.category === "sensors").length,
    restraints: smartDevices.filter(d => d.category === "restraints").length,
  };

  const totalValue = smartDevices.reduce((sum, device) => sum + device.price, 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="relative overflow-hidden tron-border border-b">
        <div className="absolute inset-0 bg-gradient-to-r from-accent/20 to-accent/30"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold tron-text mb-6">
              Smart Props Collection
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Research and development collection of BLE and WiFi-enabled adult devices for KinqueScape integration. 
              Each device has been researched for connectivity, features, and integration potential.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Badge className="bg-accent/10 text-accent border-accent">
                <Bluetooth className="w-4 h-4 mr-1" />
                BLE Connected
              </Badge>
              <Badge className="bg-accent/10 text-accent border-accent">
                <Wifi className="w-4 h-4 mr-1" />
                WiFi Enabled
              </Badge>
              <Badge className="bg-accent/10 text-accent border-accent">
                <DollarSign className="w-4 h-4 mr-1" />
                Total Value: ${totalValue.toLocaleString()}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          <Button 
            variant={selectedCategory === "all" ? "default" : "outline"} 
            onClick={() => setSelectedCategory("all")}
            className="tron-button"
          >
            All ({categoryStats.all})
          </Button>
          <Button 
            variant={selectedCategory === "toys" ? "default" : "outline"} 
            onClick={() => setSelectedCategory("toys")}
            className="tron-button"
          >
            Toys ({categoryStats.toys})
          </Button>
          <Button 
            variant={selectedCategory === "locks" ? "default" : "outline"} 
            onClick={() => setSelectedCategory("locks")}
            className="tron-button"
          >
            Locks ({categoryStats.locks})
          </Button>
        </div>

        <div className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDevices.map((device) => (
                <Card key={device.id} className="border-2 hover:border-accent transition-all duration-300 tron-border">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <Badge className={`${getCategoryColor(device.category)} border text-xs`}>
                        {device.category.toUpperCase()}
                      </Badge>
                      <div className="text-2xl font-bold tron-text">
                        ${device.price}
                      </div>
                    </div>
                    <CardTitle className="text-lg group-hover:text-accent transition-colors">
                      {device.brand} {device.name}
                    </CardTitle>
                    <CardDescription className="text-sm leading-relaxed">
                      {device.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Connectivity */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {device.connectivity.map((conn, index) => (
                        <Badge key={index} variant="outline" className="text-xs border-accent/30">
                          {getConnectivityIcon(conn)}
                          <span className="ml-1">{conn}</span>
                        </Badge>
                      ))}
                    </div>

                    {/* Features */}
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-foreground mb-2">Key Features:</h4>
                      <ul className="space-y-1">
                        {device.features.slice(0, 3).map((feature, index) => (
                          <li key={index} className="text-xs text-muted-foreground flex items-start gap-2">
                            <span className="text-accent mt-1">•</span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Research Value */}
                    <div className="mb-4 p-3 bg-muted/20 rounded-md">
                      <h4 className="text-xs font-medium text-accent mb-1">Research Value:</h4>
                      <p className="text-xs text-muted-foreground">{device.researchValue}</p>
                    </div>

                    {/* Integration Potential */}
                    <div className="mb-4 p-3 bg-accent/5 rounded-md border border-accent/20">
                      <h4 className="text-xs font-medium text-accent mb-1">KinqueScape Integration:</h4>
                      <p className="text-xs text-muted-foreground">{device.integration}</p>
                    </div>

                    {/* Amazon Link */}
                    <div className="pt-4 border-t border-border">
                      <a 
                        href={device.amazonUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-full"
                      >
                        <Button className="w-full tron-button text-sm" size="sm">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          View on Amazon
                        </Button>
                      </a>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
        </div>

        {/* Research Summary */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="tron-border">
            <CardHeader>
              <CardTitle className="tron-text">Research Investment Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Devices Researched</span>
                  <span className="font-bold">{smartDevices.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">BLE Connected Devices</span>
                  <span className="font-bold">{smartDevices.filter(d => d.connectivity.includes("BLE")).length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">WiFi Enabled Devices</span>
                  <span className="font-bold">{smartDevices.filter(d => d.connectivity.includes("WiFi")).length}</span>
                </div>
                <div className="border-t border-border pt-3">
                  <div className="flex justify-between">
                    <span className="font-medium">Total Research Investment</span>
                    <span className="font-bold text-accent text-lg">${totalValue.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="tron-border">
            <CardHeader>
              <CardTitle className="tron-text">Integration Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Phase 1: Core Devices</span>
                  <Badge className="bg-green-100 text-green-800 border-green-200">Researched</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Phase 2: Advanced Integration</span>
                  <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">In Progress</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Phase 3: Professional Deployment</span>
                  <Badge className="bg-gray-100 text-gray-800 border-gray-200">Planned</Badge>
                </div>
                <div className="pt-3 border-t border-border">
                  <p className="text-sm text-muted-foreground">
                    All devices researched for connectivity protocols, app integration, and biometric response capabilities.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}