import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DraftingCompass, ChartLine, BarChart3, Users, Star, Check, ArrowRight, Play } from "lucide-react";
const logoPath = "/kinquescape-logo-red.svg";

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
                className="w-8 h-8 object-contain"
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
              src="/kinquescape-logo-red.svg" 
              alt="KinqueScape Logo" 
              className="w-24 h-24 object-contain"
            />
          </div>
          <Badge className="mb-4 bg-accent/10 text-accent border-accent">Launch Your Escape Room Empire</Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Design, Plan & Execute
            <br />
            <span className="tron-text">Amazing 'Scapes</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            The complete platform for escape room entrepreneurs. From initial concept to profitable business - 
            design immersive experiences, create solid business plans, and manage your 'scapes with confidence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/design">
              <Button size="lg" className="w-full sm:w-auto tron-button">
                <Play className="w-4 h-4 mr-2" />
                Start Designing
              </Button>
            </Link>
            <Link href="/dash">
              <Button size="lg" variant="outline" className="w-full sm:w-auto tron-button">
                <BarChart3 className="w-4 h-4 mr-2" />
                View Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Everything You Need to Launch</h2>
            <p className="text-xl text-gray-600">Three powerful tools in one integrated platform</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Design Studio */}
            <Card className="border-2 hover:border-primary transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <DraftingCompass className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Design Studio</CardTitle>
                <CardDescription>Create immersive 'scape experiences</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    Interactive room layout canvas
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    Puzzle & clue management system
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    Props and effects library
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    Atmosphere & theme settings
                  </li>
                </ul>
                <Link href="/design">
                  <Button className="w-full mt-4">
                    Explore Design Tools
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Business Planner */}
            <Card className="border-2 hover:border-primary transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                  <ChartLine className="w-6 h-6 text-secondary" />
                </div>
                <CardTitle>Business Planner</CardTitle>
                <CardDescription>Build your escape room business</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    Financial projections & budgeting
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    Marketing strategy templates
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    Operations & staffing plans
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    Launch timeline management
                  </li>
                </ul>
                <Link href="/plan">
                  <Button className="w-full mt-4" variant="outline">
                    Create Business Plan
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Dashboard */}
            <Card className="border-2 hover:border-primary transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-accent" />
                </div>
                <CardTitle>Live Dashboard</CardTitle>
                <CardDescription>Monitor and execute your 'scapes</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    Real-time game monitoring
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    Customer booking management
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    Performance analytics
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    Staff coordination tools
                  </li>
                </ul>
                <Link href="/dash">
                  <Button className="w-full mt-4" variant="outline">
                    View Dashboard
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>



      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">Ready to Launch Your Escape Room Business?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Experience the complete KinqueScape platform with our interactive demo featuring the Dungeon 'scape.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/design">
              <Button size="lg" className="w-full sm:w-auto tron-button">
                Start Your First 'Scape
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/plan">
              <Button size="lg" variant="outline" className="w-full sm:w-auto tron-button">
                View Business Plan
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
              <p className="text-gray-400">The complete platform for escape room entrepreneurs.</p>
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