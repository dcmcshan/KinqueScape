import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, Heart, Activity, Lock, Shield, Zap, Flame } from "lucide-react";

interface ScapeCard {
  id: string;
  title: string;
  description: string;
  duration: string;
  participants: string;
  difficulty: "Gentle" | "Moderate" | "Intense" | "Extreme";
  features: string[];
  image: string;
  price: number;
  tags: string[];
}

const scapes: ScapeCard[] = [
  {
    id: "dungeon-initiation",
    title: "Dungeon Initiation",
    description: "A gentle introduction to BDSM in a medieval dungeon setting. Perfect for couples exploring power dynamics with smart restraints and biometric monitoring.",
    duration: "45-60 min",
    participants: "1-2 people",
    difficulty: "Gentle",
    features: [
      "Smart restraint introduction",
      "Basic predicament scenarios", 
      "Partner communication exercises",
      "Safety protocol training"
    ],
    image: "🏰",
    price: 149,
    tags: ["Beginner Friendly", "Educational", "Trust Building"]
  },
  {
    id: "silk-shadows",
    title: "Silk & Shadows",
    description: "An elegant sensory deprivation experience combining silk restraints, temperature play, and smart toy integration in a luxurious setting.",
    duration: "60-75 min", 
    participants: "1-2 people",
    difficulty: "Moderate",
    features: [
      "Sensory deprivation elements",
      "Temperature control systems",
      "Synchronized smart toys",
      "Biometric intensity adaptation"
    ],
    image: "🎭",
    price: 199,
    tags: ["Sensory Play", "Luxury", "Temperature"]
  },
  {
    id: "clockwork-torment",
    title: "Clockwork Torment",
    description: "A steampunk-inspired predicament room where escape requires enduring increasing stimulation while solving mechanical puzzles under time pressure.",
    duration: "75-90 min",
    participants: "1-2 people", 
    difficulty: "Intense",
    features: [
      "Escalating predicament scenarios",
      "Mechanical puzzle integration",
      "Time-pressure elements",
      "Advanced restraint systems"
    ],
    image: "⚙️",
    price: 249,
    tags: ["Predicament", "Puzzles", "Steampunk"]
  },
  {
    id: "electric-dreams",
    title: "Electric Dreams",
    description: "High-tech BDSM experience featuring e-stim devices, LED feedback systems, and cyberpunk aesthetics with advanced biometric control.",
    duration: "60-90 min",
    participants: "1-2 people",
    difficulty: "Intense", 
    features: [
      "E-stimulation devices",
      "LED biometric feedback",
      "Cyberpunk environment",
      "Neural response tracking"
    ],
    image: "⚡",
    price: 299,
    tags: ["E-Stim", "Tech", "Cyberpunk"]
  },
  {
    id: "masters-trial",
    title: "Master's Trial",
    description: "An extreme psychological and physical challenge for experienced practitioners. Features advanced predicaments and stress-response adaptation.",
    duration: "90-120 min",
    participants: "1-2 people",
    difficulty: "Extreme",
    features: [
      "Psychological predicaments",
      "Advanced stress monitoring", 
      "Adaptive difficulty scaling",
      "Master/slave dynamics"
    ],
    image: "👑",
    price: 399,
    tags: ["Extreme", "Psychological", "Advanced"]
  },
  {
    id: "couples-conquest",
    title: "Couples Conquest",
    description: "Collaborative predicament experience where partners must work together while restrained, featuring synchronized challenges and shared consequences.",
    duration: "75-90 min",
    participants: "2 people",
    difficulty: "Moderate",
    features: [
      "Partner synchronization",
      "Shared predicaments",
      "Communication challenges",
      "Trust-building exercises"
    ],
    image: "💑",
    price: 279,
    tags: ["Couples", "Teamwork", "Communication"]
  },
  {
    id: "midnight-manor",
    title: "Midnight Manor",
    description: "Victorian gothic mansion experience with period-appropriate restraints, ghost stories, and supernatural predicament scenarios.",
    duration: "90-105 min",
    participants: "1-3 people",
    difficulty: "Moderate",
    features: [
      "Gothic atmosphere",
      "Supernatural elements",
      "Period restraints",
      "Storytelling integration"
    ],
    image: "🦇",
    price: 229,
    tags: ["Gothic", "Supernatural", "Victorian"]
  },
  {
    id: "arctic-endurance",
    title: "Arctic Endurance",
    description: "Temperature-focused predicament experience featuring ice play, heat/cold contrasts, and endurance challenges in a winter wonderland setting.",
    duration: "60-75 min",
    participants: "1-2 people",
    difficulty: "Intense",
    features: [
      "Temperature extremes",
      "Ice play elements",
      "Endurance challenges",
      "Thermal monitoring"
    ],
    image: "❄️",
    price: 269,
    tags: ["Temperature", "Endurance", "Ice Play"]
  }
];

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "Gentle": return "bg-green-100 text-green-800 border-green-200";
    case "Moderate": return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "Intense": return "bg-orange-100 text-orange-800 border-orange-200";
    case "Extreme": return "bg-red-100 text-red-800 border-red-200";
    default: return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

export default function ScapesPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="relative overflow-hidden tron-border border-b">
        <div className="absolute inset-0 bg-gradient-to-r from-accent/20 to-accent/30"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold tron-text mb-6">
              Adult 'Scapes
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Explore our collection of adult-themed predicament escape rooms. Each experience combines 
              smart technology, biometric monitoring, and carefully crafted scenarios for unforgettable intimate adventures.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Badge className="bg-accent/10 text-accent border-accent">Smart Technology</Badge>
              <Badge className="bg-accent/10 text-accent border-accent">Biometric Monitoring</Badge>
              <Badge className="bg-accent/10 text-accent border-accent">Safety First</Badge>
              <Badge className="bg-accent/10 text-accent border-accent">Professional Staff</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Scapes Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {scapes.map((scape) => (
            <Card key={scape.id} className="border-2 hover:border-accent transition-all duration-300 tron-border group">
              <CardHeader>
                <div className="flex items-start justify-between mb-4">
                  <div className="text-4xl mb-2">{scape.image}</div>
                  <Badge className={`${getDifficultyColor(scape.difficulty)} border`}>
                    {scape.difficulty}
                  </Badge>
                </div>
                <CardTitle className="tron-text group-hover:text-accent transition-colors">
                  {scape.title}
                </CardTitle>
                <CardDescription className="text-sm leading-relaxed">
                  {scape.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Experience Details */}
                <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{scape.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{scape.participants}</span>
                  </div>
                </div>

                {/* Features */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-foreground mb-2">Experience Features:</h4>
                  <ul className="space-y-1">
                    {scape.features.map((feature, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-accent mt-1">•</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {scape.tags.map((tag, index) => (
                    <Badge 
                      key={index} 
                      variant="outline" 
                      className="text-xs border-accent/30 text-accent hover:bg-accent/10"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Price and Book Button */}
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="text-2xl font-bold tron-text">
                    ${scape.price}
                  </div>
                  <Link href={`/room/${scape.id}`}>
                    <Button className="tron-button">
                      Book Experience
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="bg-muted/20 py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            New to Adult Escape Rooms?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Start with our Dungeon Initiation experience or consult with our staff to find the perfect adventure for your comfort level.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/room/dungeon-initiation">
              <Button size="lg" className="w-full sm:w-auto tron-button">
                <Shield className="w-4 h-4 mr-2" />
                Start with Beginner
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="w-full sm:w-auto tron-button">
              <Heart className="w-4 h-4 mr-2" />
              Consultation
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}