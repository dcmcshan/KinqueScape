import { Activity, Users, TrendingUp, Calendar, Shield, Map, Target, DollarSign } from "lucide-react";

export default function PlanPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-red-600/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold tron-text mb-6">
              KinqueScape
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Revolutionary escape room experiences powered by real-time biometric monitoring, 
              Unity 3D environments, and immersive storytelling
            </p>
            <div className="inline-flex items-center space-x-2 tron-border px-6 py-3 rounded-lg">
              <Activity className="w-5 h-5 text-accent" />
              <span className="text-sm font-medium">Live Biometric Monitoring</span>
            </div>
          </div>
        </div>
      </div>

      {/* Business Overview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Executive Summary */}
          <div className="lg:col-span-2">
            <div className="tron-card p-8 rounded-lg mb-8">
              <h2 className="text-2xl font-bold tron-text mb-4">Executive Summary</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  KinqueScape revolutionizes adult entertainment through immersive, technology-enhanced intimate experiences. 
                  Our platform integrates biometric monitoring, smart adult toys, and interactive environments to create 
                  personalized sensual adventures. The flagship dungeon demonstration facility showcases our technology's 
                  potential through real-time physiological monitoring via AmazFit Active 2 smartwatches and app-controlled devices.
                </p>
                <p>
                  Our comprehensive research and development program includes acquiring and mastering over 50 adult toys and devices, 
                  studying their interfaces (BLE, WiFi, NFC, QR codes), and developing integrated control systems. This hands-on 
                  approach ensures we understand every aspect of the technology before deploying it in customer experiences.
                </p>
                <p>
                  The business model focuses on premium adult experience centers, franchise opportunities, and technology licensing 
                  to established adult entertainment venues. We target the intersection of the $15B adult toy market and the 
                  growing experience economy, creating a new category of data-driven intimate entertainment.
                </p>
              </div>
            </div>

            {/* Market Analysis */}
            <div className="tron-card p-8 rounded-lg mb-8">
              <h2 className="text-2xl font-bold tron-text mb-4">Market Analysis</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-accent mb-3">Market Size</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Global escape room market: $1.8B (2023)</li>
                    <li>• Expected CAGR: 18.2% (2023-2030)</li>
                    <li>• 15,000+ escape rooms worldwide</li>
                    <li>• Average revenue per room: $120k annually</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-accent mb-3">Growth Drivers</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Post-pandemic experience economy boom</li>
                    <li>• Corporate team building demand</li>
                    <li>• Technology integration trends</li>
                    <li>• Social media shareable experiences</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Technology Stack */}
            <div className="tron-card p-8 rounded-lg mb-8">
              <h2 className="text-2xl font-bold tron-text mb-4">Technology Stack</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-accent mb-3">Core Platform</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• React + TypeScript frontend</li>
                    <li>• Node.js + Express backend</li>
                    <li>• PostgreSQL database</li>
                    <li>• Real-time WebSocket connections</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-accent mb-3">Hardware Integration</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• AmazFit Active 2 smartwatches</li>
                    <li>• Unity 3D room visualization</li>
                    <li>• IoT device control systems</li>
                    <li>• Biometric data processing</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Key Metrics & Features */}
          <div className="space-y-6">
            <div className="tron-card p-6 rounded-lg">
              <h3 className="text-lg font-semibold tron-text mb-4">Key Features</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Activity className="w-5 h-5 text-accent mt-0.5" />
                  <div>
                    <h4 className="font-medium text-foreground">Real-time Biometrics</h4>
                    <p className="text-sm text-muted-foreground">Heart rate, HRV, stress monitoring</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Map className="w-5 h-5 text-accent mt-0.5" />
                  <div>
                    <h4 className="font-medium text-foreground">3D Room Control</h4>
                    <p className="text-sm text-muted-foreground">Unity-based visualization</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Users className="w-5 h-5 text-accent mt-0.5" />
                  <div>
                    <h4 className="font-medium text-foreground">Participant Tracking</h4>
                    <p className="text-sm text-muted-foreground">Position and engagement data</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-accent mt-0.5" />
                  <div>
                    <h4 className="font-medium text-foreground">Safety Monitoring</h4>
                    <p className="text-sm text-muted-foreground">Automated stress detection</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="tron-card p-6 rounded-lg">
              <h3 className="text-lg font-semibold tron-text mb-4">Revenue Projections</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Year 1</span>
                  <span className="font-bold text-accent">$250K</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Year 2</span>
                  <span className="font-bold text-accent">$850K</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Year 3</span>
                  <span className="font-bold text-accent">$2.1M</span>
                </div>
                <div className="border-t border-border pt-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-foreground">Break-even</span>
                    <span className="font-bold text-accent">Month 18</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="tron-card p-6 rounded-lg">
              <h3 className="text-lg font-semibold tron-text mb-4">Target Markets</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Target className="w-4 h-4 text-accent" />
                  <span className="text-sm">Existing escape room operators</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Target className="w-4 h-4 text-accent" />
                  <span className="text-sm">Entertainment venues</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Target className="w-4 h-4 text-accent" />
                  <span className="text-sm">Corporate team building</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Target className="w-4 h-4 text-accent" />
                  <span className="text-sm">Research institutions</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Demo Installation Strategy */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold tron-text text-center mb-12">Demo Installation Strategy</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="tron-card p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-accent mb-4">Dungeon Demo Features</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li>• Medieval dungeon theme with immersive props</li>
                <li>• 6-participant capacity with AmazFit Active 2 watches</li>
                <li>• Unity 3D real-time room visualization</li>
                <li>• Biometric stress monitoring and alerts</li>
                <li>• Dynamic puzzle difficulty adjustment</li>
                <li>• Comprehensive analytics dashboard</li>
              </ul>
            </div>
            <div className="tron-card p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-accent mb-4">Installation Investment</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Hardware Package</span>
                  <span className="font-bold">$15,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Room Construction</span>
                  <span className="font-bold">$25,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Technology Integration</span>
                  <span className="font-bold">$10,000</span>
                </div>
                <div className="border-t border-border pt-3">
                  <div className="flex justify-between">
                    <span className="font-medium">Total Investment</span>
                    <span className="font-bold text-accent text-lg">$50,000</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="tron-card p-6 rounded-lg text-center">
              <DollarSign className="w-12 h-12 text-accent mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-3">Phase 1: Demo</h3>
              <p className="text-muted-foreground mb-4">Proof of concept installation for validation</p>
              <div className="text-2xl font-bold text-accent">$50K</div>
            </div>
            <div className="tron-card p-6 rounded-lg text-center">
              <Activity className="w-12 h-12 text-accent mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-3">Phase 2: Franchise</h3>
              <p className="text-muted-foreground mb-4">Licensing model for commercial operators</p>
              <div className="text-2xl font-bold text-accent">$299/month</div>
            </div>
            <div className="tron-card p-6 rounded-lg text-center">
              <Users className="w-12 h-12 text-accent mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-3">Phase 3: DIY Kits</h3>
              <p className="text-muted-foreground mb-4">Self-installation packages for smaller venues</p>
              <div className="text-2xl font-bold text-accent">$15K</div>
            </div>
          </div>
        </div>

        {/* Demo Installation Roadmap */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold tron-text text-center mb-12">Dungeon Demo Roadmap</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="tron-card p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <Calendar className="w-5 h-5 text-accent mr-2" />
                <h3 className="font-semibold">Phase 1: Foundation</h3>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Platform development completion</li>
                <li>• AmazFit Active 2 integration</li>
                <li>• Unity 3D dungeon model</li>
                <li>• Basic biometric monitoring</li>
              </ul>
            </div>
            <div className="tron-card p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <Calendar className="w-5 h-5 text-accent mr-2" />
                <h3 className="font-semibold">Phase 2: Construction</h3>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Physical room construction</li>
                <li>• IoT device installation</li>
                <li>• Lighting and sound systems</li>
                <li>• Safety systems integration</li>
              </ul>
            </div>
            <div className="tron-card p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <Calendar className="w-5 h-5 text-accent mr-2" />
                <h3 className="font-semibold">Phase 3: Testing</h3>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Beta testing with focus groups</li>
                <li>• Stress testing with full capacity</li>
                <li>• Analytics dashboard refinement</li>
                <li>• Emergency protocols validation</li>
              </ul>
            </div>
            <div className="tron-card p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <Calendar className="w-5 h-5 text-accent mr-2" />
                <h3 className="font-semibold">Phase 4: Launch</h3>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Public demo opening</li>
                <li>• Industry showcase events</li>
                <li>• Franchise development</li>
                <li>• DIY kit preparation</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Future Expansion */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold tron-text text-center mb-12">Future Expansion</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="tron-card p-8 rounded-lg">
              <h3 className="text-xl font-semibold text-accent mb-4">Franchise Opportunities</h3>
              <div className="space-y-3 text-muted-foreground">
                <p>
                  Following successful demo validation, KinqueScape will offer franchise packages 
                  to entertainment venues and escape room operators seeking premium experiences.
                </p>
                <ul className="space-y-2">
                  <li>• Complete room design and construction guidance</li>
                  <li>• Hardware package with installation support</li>
                  <li>• Monthly SaaS platform access</li>
                  <li>• Ongoing technical support and updates</li>
                </ul>
              </div>
            </div>
            <div className="tron-card p-8 rounded-lg">
              <h3 className="text-xl font-semibold text-accent mb-4">DIY Installation Kits</h3>
              <div className="space-y-3 text-muted-foreground">
                <p>
                  Streamlined packages for smaller venues wanting to implement biometric 
                  monitoring without full construction requirements.
                </p>
                <ul className="space-y-2">
                  <li>• Pre-configured hardware bundles</li>
                  <li>• Simplified installation guides</li>
                  <li>• Essential platform features</li>
                  <li>• Remote setup assistance</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}