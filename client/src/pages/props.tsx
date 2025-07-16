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
  // LOVENSE COLLECTION
  {
    id: "lovense-lush-3",
    name: "Lush 3",
    brand: "LOVENSE",
    category: "toys",
    connectivity: ["BLE", "App"],
    price: 119,
    amazonUrl: "https://www.amazon.com/Lovense-Bluetooth-Controlled-Rechargeable-Waterproof/dp/B07QMKQX8R",
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
    id: "lovense-domi-2",
    name: "Domi 2",
    brand: "LOVENSE",
    category: "toys",
    connectivity: ["BLE", "App"],
    price: 99,
    amazonUrl: "https://www.amazon.com/Lovense-Wand-Massager-Bluetooth-Controlled/dp/B08FXQZ4JM",
    description: "Powerful wand massager with app control and unlimited vibration patterns.",
    features: ["Powerful motor", "App connectivity", "Multiple attachments", "Rechargeable", "Quiet operation"],
    researchValue: "High-power stimulation testing",
    integration: "Intensity control based on biometric feedback"
  },
  {
    id: "lovense-nora",
    name: "Nora",
    brand: "LOVENSE",
    category: "toys",
    connectivity: ["BLE", "App"],
    price: 149,
    amazonUrl: "https://www.amazon.com/Lovense-Rotating-Vibrator-Bluetooth-Controlled/dp/B01N5IXQZC",
    description: "Rotating rabbit vibrator with dual stimulation and app control.",
    features: ["Rotating head", "Dual stimulation", "App control", "Body-safe silicone", "Rechargeable"],
    researchValue: "Complex stimulation patterns, dual-zone testing",
    integration: "Multi-zone biometric response coordination"
  },
  {
    id: "lovense-hush-2",
    name: "Hush 2",
    brand: "LOVENSE",
    category: "toys",
    connectivity: ["BLE", "App"],
    price: 79,
    amazonUrl: "https://www.amazon.com/Lovense-Vibrating-Bluetooth-Controlled-Rechargeable/dp/B0842QKQJG",
    description: "App-controlled vibrating plug with long-distance connectivity.",
    features: ["App control", "Long battery life", "Body-safe silicone", "Waterproof", "Multiple sizes"],
    researchValue: "Continuous wear testing, long-term biometric monitoring",
    integration: "24/7 biometric integration, stress response tracking"
  },

  // WE-VIBE COLLECTION
  {
    id: "we-vibe-sync",
    name: "Sync",
    brand: "We-Vibe",
    category: "toys",
    connectivity: ["BLE", "App"],
    price: 179,
    amazonUrl: "https://www.amazon.com/We-Vibe-Couples-Vibrator-Remote/dp/B071Z8PQMX",
    description: "Couples vibrator with dual connectivity options and partner remote control capabilities.",
    features: ["Dual motor design", "Partner remote control", "10+ vibration modes", "Rechargeable battery", "Waterproof design"],
    researchValue: "Couples synchronization and remote control",
    integration: "Partner biometric sync, shared experiences"
  },
  {
    id: "we-vibe-chorus",
    name: "Chorus",
    brand: "We-Vibe",
    category: "toys",
    connectivity: ["BLE", "App"],
    price: 199,
    amazonUrl: "https://www.amazon.com/We-Vibe-Couples-Vibrator-Purple/dp/B08FYJQBNN",
    description: "Advanced couples vibrator with squeeze remote and touch-sensitive controls.",
    features: ["Squeeze remote", "Touch-sensitive", "App control", "10+ speeds", "Body-safe silicone"],
    researchValue: "Advanced touch sensing, pressure detection",
    integration: "Touch pressure biometric feedback, arousal monitoring"
  },
  {
    id: "we-vibe-melt",
    name: "Melt",
    brand: "We-Vibe",
    category: "toys",
    connectivity: ["BLE", "App"],
    price: 149,
    amazonUrl: "https://www.amazon.com/We-Vibe-Clitoral-Stimulator-Purple/dp/B07RPQSRPX",
    description: "Clitoral stimulator with pleasure air technology and app control.",
    features: ["Pleasure air technology", "App control", "12 intensity levels", "Waterproof", "Rechargeable"],
    researchValue: "Air pressure stimulation, precision control",
    integration: "Breath-synchronized patterns, anxiety response"
  },

  // KIIROO COLLECTION
  {
    id: "kiiroo-onyx",
    name: "Onyx+",
    brand: "Kiiroo",
    category: "toys",
    connectivity: ["BLE", "WiFi", "App"],
    price: 179,
    amazonUrl: "https://www.amazon.com/Kiiroo-Interactive-Male-Masturbator-Onyx/dp/B07D7TWQZV",
    description: "Interactive male device with real-time connectivity and partner synchronization capabilities.",
    features: ["Real-time interaction", "Partner device sync", "Touch-sensitive technology", "Rechargeable design", "Multiple speed settings"],
    researchValue: "Male device integration, real-time sync",
    integration: "Partner device coordination, biometric response"
  },
  {
    id: "kiiroo-pearl-2",
    name: "Pearl 2",
    brand: "Kiiroo",
    category: "toys",
    connectivity: ["BLE", "WiFi", "App"],
    price: 149,
    amazonUrl: "https://www.amazon.com/Kiiroo-Pearl2-Interactive-Vibrator-Women/dp/B07MXQH3NK",
    description: "Interactive vibrator for women with touch-sensitive technology and partner sync.",
    features: ["Touch-sensitive zones", "Partner sync", "App control", "Rechargeable", "Body-safe materials"],
    researchValue: "Female interactive technology, touch sensing",
    integration: "Partner coordination, mutual biometric feedback"
  },

  // LELO COLLECTION
  {
    id: "lelo-hugo",
    name: "Hugo",
    brand: "LELO",
    category: "toys",
    connectivity: ["BLE", "App"],
    price: 179,
    amazonUrl: "https://www.amazon.com/LELO-Remote-Control-Couples-Massager/dp/B00O7F8PQI",
    description: "Premium couples massager with sophisticated app control and multiple intensity settings.",
    features: ["SenseMotion technology", "Remote control capability", "8 stimulation patterns", "Ultra-quiet operation", "Rechargeable battery"],
    researchValue: "Premium device testing, advanced pattern control",
    integration: "Biometric pattern adaptation, couples coordination"
  },
  {
    id: "lelo-ida",
    name: "Ida",
    brand: "LELO",
    category: "toys",
    connectivity: ["BLE", "App"],
    price: 189,
    amazonUrl: "https://www.amazon.com/LELO-Couples-Massager-SenseMotion-Technology/dp/B01MDQAW7Q",
    description: "Couples massager with SenseMotion technology and remote control capabilities.",
    features: ["SenseMotion technology", "Couples design", "Remote control", "Premium materials", "Waterproof"],
    researchValue: "Motion-sensitive control, premium testing",
    integration: "Movement-based biometric triggers, luxury experience"
  },

  // SMART LOCKS COLLECTION
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
    id: "smonet-padlock",
    name: "Smart Fingerprint Padlock",
    brand: "SMONET",
    category: "locks",
    connectivity: ["WiFi", "BLE", "App"],
    price: 49,
    amazonUrl: "https://www.amazon.com/SMONET-Bluetooth-Fingerprint-Waterproof-Rechargeable/dp/B08HHXM7KL",
    description: "Multi-access smart lock with fingerprint scanner, perfect for biometric integration testing.",
    features: ["Fingerprint recognition", "WiFi and Bluetooth dual connectivity", "IP65 waterproof rating", "Rechargeable battery", "100 fingerprint storage"],
    researchValue: "Biometric integration, multi-access testing",
    integration: "Partner fingerprint access, biometric safety release"
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
    features: ["3D fingerprint scanner", "Voice control support", "Anti-peep keypad", "Military-grade construction", "Mobile app control"],
    researchValue: "Heavy-duty restraint testing, voice activation",
    integration: "Voice safety commands, high-security restraints"
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
    features: ["NFC quick access", "GPS location tracking", "Commercial durability", "Audit trail logging", "Weather-resistant"],
    researchValue: "Commercial-grade testing, NFC integration",
    integration: "Professional dungeon equipment, NFC quick-release"
  },
  {
    id: "yale-assure-lock",
    name: "Assure Lock 2",
    brand: "Yale",
    category: "locks",
    connectivity: ["WiFi", "BLE", "App"],
    price: 279,
    amazonUrl: "https://www.amazon.com/Yale-Assure-Lock-Touchscreen-Deadbolt/dp/B07GLBX7Q4",
    description: "Premium smart deadbolt with touchscreen keypad and professional-grade security.",
    features: ["Touchscreen keypad", "Multiple access methods", "Professional installation", "Smart home integration", "Tamper alerts"],
    researchValue: "Premium lock testing, professional installation",
    integration: "High-security room access, professional dungeon setups"
  },
  {
    id: "august-smart-lock",
    name: "Smart Lock Pro",
    brand: "August",
    category: "locks",
    connectivity: ["WiFi", "BLE", "App"],
    price: 229,
    amazonUrl: "https://www.amazon.com/August-Smart-Lock-Pro-Generation/dp/B0752V8D8D",
    description: "Smart lock with auto-unlock, remote access, and activity monitoring.",
    features: ["Auto-unlock", "Remote access", "Activity monitoring", "Easy installation", "Voice control"],
    researchValue: "Auto-unlock testing, activity tracking",
    integration: "Biometric auto-unlock, activity correlation with arousal"
  },

  // SMART LIGHTING COLLECTION
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
    id: "govee-immersion",
    name: "Immersion TV Light Strip",
    brand: "Govee",
    category: "lighting",
    connectivity: ["WiFi", "BLE", "App"],
    price: 79,
    amazonUrl: "https://www.amazon.com/Govee-Immersion-Backlights-Compatible-Assistant/dp/B08LVPW8VZ",
    description: "Camera-based TV backlight with real-time color matching and app control.",
    features: ["Camera color matching", "Real-time sync", "App control", "Voice control", "Easy installation"],
    researchValue: "Environmental lighting sync, real-time response",
    integration: "Scene-responsive lighting, biometric environment adaptation"
  },
  {
    id: "nanoleaf-shapes",
    name: "Shapes Hexagons",
    brand: "Nanoleaf",
    category: "lighting",
    connectivity: ["WiFi", "BLE", "App"],
    price: 199,
    amazonUrl: "https://www.amazon.com/Nanoleaf-Shapes-Hexagons-Smarter-Kit/dp/B08P3C7Q2Z",
    description: "Modular smart light panels with touch control and music sync.",
    features: ["Modular design", "Touch control", "Music sync", "Screen mirroring", "Programmable"],
    researchValue: "Touch-responsive lighting, modular design testing",
    integration: "Touch-activated scenes, stress-responsive patterns"
  },
  {
    id: "lifx-beam",
    name: "LIFX Beam Kit",
    brand: "LIFX",
    category: "lighting",
    connectivity: ["WiFi", "App"],
    price: 199,
    amazonUrl: "https://www.amazon.com/LIFX-Beam-Kit-Multicolor-Corner/dp/B075G2B5TY",
    description: "Modular light bars with corner connectors and millions of colors.",
    features: ["Modular design", "Corner connectors", "16 million colors", "No hub required", "Voice control"],
    researchValue: "Modular lighting design, room accent testing",
    integration: "Biometric zone lighting, stress visualization"
  },

  // SENSORS COLLECTION
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
  },
  {
    id: "ecobee-smartsensor",
    name: "SmartSensor",
    brand: "ecobee",
    category: "sensors",
    connectivity: ["WiFi", "App"],
    price: 79,
    amazonUrl: "https://www.amazon.com/ecobee-SmartSensor-Temperature-Occupancy-Detector/dp/B07NQVWRR3",
    description: "Temperature and occupancy sensor with room-by-room monitoring.",
    features: ["Temperature monitoring", "Occupancy detection", "Room-by-room control", "Smart scheduling", "Easy installation"],
    researchValue: "Temperature correlation with arousal, occupancy tracking",
    integration: "Thermal arousal monitoring, room occupancy correlation"
  },
  {
    id: "fibaro-door-sensor",
    name: "Door/Window Sensor",
    brand: "Fibaro",
    category: "sensors",
    connectivity: ["WiFi", "BLE", "App"],
    price: 49,
    amazonUrl: "https://www.amazon.com/Fibaro-Door-Window-Sensor-FGDW-002/dp/B01MYSQ4GQ",
    description: "Ultra-compact door and window sensor with temperature monitoring.",
    features: ["Ultra-compact design", "Temperature sensor", "Tamper detection", "Long battery life", "Smart alerts"],
    researchValue: "Entry monitoring, security integration",
    integration: "Room access tracking, security protocol activation"
  },

  // RESTRAINTS COLLECTION
  {
    id: "sportsheets-under-bed",
    name: "Under Bed Restraint System",
    brand: "Sportsheets",
    category: "restraints",
    connectivity: ["App"],
    price: 49,
    amazonUrl: "https://www.amazon.com/Sportsheets-Under-Bed-Restraint-System/dp/B002JVMEJS",
    description: "Versatile under-bed restraint system with adjustable straps and cuffs.",
    features: ["Under-bed design", "Adjustable straps", "Comfortable cuffs", "Easy setup", "Discreet storage"],
    researchValue: "Basic restraint integration, comfort testing",
    integration: "Smart lock integration, biometric safety monitoring"
  },
  {
    id: "kink-leather-cuffs",
    name: "Leather Wrist Cuffs",
    brand: "Kink",
    category: "restraints",
    connectivity: ["App"],
    price: 79,
    amazonUrl: "https://www.amazon.com/Kink-Leather-Wrist-Cuffs-Black/dp/B01N6QH8JL",
    description: "Premium leather wrist cuffs with D-rings and comfortable padding.",
    features: ["Premium leather", "Comfortable padding", "Strong D-rings", "Adjustable fit", "Professional quality"],
    researchValue: "Premium restraint testing, comfort analysis",
    integration: "Smart sensor integration, stress monitoring during restraint"
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
  const brandCounts = smartDevices.reduce((acc, device) => {
    acc[device.brand] = (acc[device.brand] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

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
              Comprehensive research collection of {smartDevices.length} smart adult devices across {Object.keys(categoryStats).length - 1} categories. 
              Each device researched for biometric integration, BLE/WiFi connectivity, and KinqueScape compatibility.
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
          <Button 
            variant={selectedCategory === "lighting" ? "default" : "outline"} 
            onClick={() => setSelectedCategory("lighting")}
            className="tron-button"
          >
            Lighting ({categoryStats.lighting})
          </Button>
          <Button 
            variant={selectedCategory === "sensors" ? "default" : "outline"} 
            onClick={() => setSelectedCategory("sensors")}
            className="tron-button"
          >
            Sensors ({categoryStats.sensors})
          </Button>
          <Button 
            variant={selectedCategory === "restraints" ? "default" : "outline"} 
            onClick={() => setSelectedCategory("restraints")}
            className="tron-button"
          >
            Restraints ({categoryStats.restraints})
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
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-8">
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
              <CardTitle className="tron-text">Brand Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(brandCounts)
                  .sort(([,a], [,b]) => b - a)
                  .map(([brand, count]) => (
                    <div key={brand} className="flex justify-between">
                      <span className="text-muted-foreground">{brand}</span>
                      <span className="font-bold">{count} devices</span>
                    </div>
                  ))}
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
                  <span className="text-muted-foreground">Core Collection Complete</span>
                  <Badge className="bg-green-100 text-green-800 border-green-200">✓ Done</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">BLE/WiFi Integration</span>
                  <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Testing</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Biometric Sync</span>
                  <Badge className="bg-blue-100 text-blue-800 border-blue-200">Development</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Dungeon Deployment</span>
                  <Badge className="bg-purple-100 text-purple-800 border-purple-200">Planned</Badge>
                </div>
                <div className="pt-3 border-t border-border">
                  <p className="text-sm text-muted-foreground">
                    {smartDevices.length} devices across {Object.keys(brandCounts).length} premium brands ready for KinqueScape integration.
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