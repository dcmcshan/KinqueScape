import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DraftingCompass, ChartLine, BarChart3, Users, Star, Check, ArrowRight, Play, Heart, Activity, Lock, Shield, Calendar } from "lucide-react";
import logoPath from "@assets/C40089C9-F4D0-4D4E-8056-BC35F95B05D3_1752696036206.png";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background/95 backdrop-blur-sm tron-border border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <img 
                src={logoPath} 
                alt="KinqueScape Logo" 
                className="w-8 h-8 object-contain logo-glow"
              />
              <span className="text-xl font-bold tron-text">KinqueScape</span>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-muted-foreground hover:text-accent">Features</a>
              <a href="#pricing" className="text-muted-foreground hover:text-accent">Pricing</a>
              <a href="#about" className="text-muted-foreground hover:text-accent">About</a>
              <Link href="/design">
                <Button variant="outline" className="tron-button">Get Started</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <img 
              src={logoPath} 
              alt="KinqueScape Logo" 
              className="w-24 h-24 object-contain logo-glow"
            />
          </div>
          <Badge className="mb-4 bg-accent/10 text-accent border-accent">Adult Entertainment Redefined</Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Intimate Adventures
            <br />
            <span className="tron-text">Beyond Imagination</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Experience next-level intimacy with your partner through immersive escape room adventures. 
            Smart toys, biometric monitoring, and 3D environments create unforgettable date nights and romantic experiences.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/room/dungeon">
              <Button size="lg" className="w-full sm:w-auto tron-button">
                <Play className="w-4 h-4 mr-2" />
                Book Experience
              </Button>
            </Link>
            <Link href="/dash">
              <Button size="lg" variant="outline" className="w-full sm:w-auto tron-button">
                <BarChart3 className="w-4 h-4 mr-2" />
                View Preview
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Revolutionary Intimate Experiences
            </h2>
            <p className="text-xl text-muted-foreground">
              Where technology meets passion for unforgettable moments
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Smart Toy Integration */}
            <Card className="border-2 hover:border-accent transition-colors tron-border">
              <CardHeader>
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <Heart className="w-6 h-6 text-accent" />
                </div>
                <CardTitle className="tron-text">Smart Toy Integration</CardTitle>
                <CardDescription>BLE and WiFi connected toys respond to your biometrics</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-accent mr-2" />
                    Real-time biometric response
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-accent mr-2" />
                    Puzzle progress integration
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-accent mr-2" />
                    Partner synchronization
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-accent mr-2" />
                    Customizable intensity levels
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Biometric Monitoring */}
            <Card className="border-2 hover:border-accent transition-colors tron-border">
              <CardHeader>
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <Activity className="w-6 h-6 text-accent" />
                </div>
                <CardTitle className="tron-text">Biometric Monitoring</CardTitle>
                <CardDescription>Real-time health tracking creates responsive experiences</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-accent mr-2" />
                    Heart rate monitoring
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-accent mr-2" />
                    Stress level detection
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-accent mr-2" />
                    Arousal adaptation
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-accent mr-2" />
                    Safety monitoring
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Smart Restraints */}
            <Card className="border-2 hover:border-accent transition-colors tron-border">
              <CardHeader>
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <Lock className="w-6 h-6 text-accent" />
                </div>
                <CardTitle className="tron-text">Smart Restraints</CardTitle>
                <CardDescription>Bluetooth locks with safety protocols</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-accent mr-2" />
                    App-controlled release
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-accent mr-2" />
                    Emergency protocols
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-accent mr-2" />
                    Timer-based unlock
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-accent mr-2" />
                    Safeword integration
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Couples Adventures */}
            <Card className="border-2 hover:border-accent transition-colors tron-border">
              <CardHeader>
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-accent" />
                </div>
                <CardTitle className="tron-text">Couples Adventures</CardTitle>
                <CardDescription>Synchronized experiences for partners</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-accent mr-2" />
                    Remote partner control
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-accent mr-2" />
                    Shared challenges
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-accent mr-2" />
                    Communication games
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-accent mr-2" />
                    Trust building exercises
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Safety First */}
            <Card className="border-2 hover:border-accent transition-colors tron-border">
              <CardHeader>
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-accent" />
                </div>
                <CardTitle className="tron-text">Safety First</CardTitle>
                <CardDescription>Comprehensive safety monitoring and protocols</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-accent mr-2" />
                    Emergency protocols
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-accent mr-2" />
                    Safeword integration
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-accent mr-2" />
                    Health monitoring
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-accent mr-2" />
                    Instant emergency stop
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Date Night Packages */}
            <Card className="border-2 hover:border-accent transition-colors tron-border">
              <CardHeader>
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <Calendar className="w-6 h-6 text-accent" />
                </div>
                <CardTitle className="tron-text">Date Night Packages</CardTitle>
                <CardDescription>Curated romantic experiences for all preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-accent mr-2" />
                    Gentle intimacy adventures
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-accent mr-2" />
                    Intense BDSM scenarios
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-accent mr-2" />
                    Custom experience design
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-accent mr-2" />
                    Progressive difficulty levels
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>



      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">Ready for an Unforgettable Experience?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Book your intimate adventure in our immersive dungeon environment. Perfect for couples seeking next-level date nights with cutting-edge technology.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/room/dungeon">
              <Button size="lg" className="w-full sm:w-auto tron-button">
                Book Dungeon Experience
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/dash">
              <Button size="lg" variant="outline" className="w-full sm:w-auto tron-button">
                Preview Experience
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <img 
                  src="@assets/9272995D-5FB4-4416-932A-EA7A3B0E0FD8_1752688631328.png" 
                  alt="KinqueScape Logo" 
                  className="w-6 h-6 object-contain"
                />
                <span className="text-lg font-bold">KinqueScape</span>
              </div>
              <p className="text-gray-400">Revolutionary intimate escape room experiences.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/design">Design Studio</Link></li>
                <li><Link href="/plan">Business Planner</Link></li>
                <li><Link href="/dash">Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#help">Help Center</a></li>
                <li><a href="#docs">Documentation</a></li>
                <li><a href="#community">Community</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#about">About</a></li>
                <li><a href="#blog">Blog</a></li>
                <li><a href="#careers">Careers</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 KinqueScape. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}