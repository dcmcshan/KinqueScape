import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ChartPie, DollarSign, BellRing, ServerCog, Calendar } from "lucide-react";

interface PlanSectionsProps {
  onSave: (data: any) => void;
}

export default function PlanSections({ onSave }: PlanSectionsProps) {
  const [activeSection, setActiveSection] = useState("overview");
  const [planData, setPlanData] = useState({
    businessName: "",
    location: "",
    missionStatement: "",
    targetMarket: {
      primary: ["Young professionals (25-35)", "Date night couples", "Corporate team building"],
      secondary: ["Birthday parties", "Student groups", "Families with teens"],
    },
    revenueStreams: [
      { name: "Room Bookings", description: "$35/person • 6 people avg", amount: 210 },
      { name: "Private Events", description: "$450/room • 2-3 hours", amount: 450 },
      { name: "Merchandise", description: "T-shirts, puzzles, souvenirs", amount: 15 },
      { name: "Corporate Events", description: "Team building packages", amount: 750 },
    ],
    expenses: [
      { name: "Rent & Utilities", amount: 8500, percentage: 28 },
      { name: "Staff Salaries", amount: 12000, percentage: 40 },
      { name: "Marketing", amount: 3000, percentage: 10 },
      { name: "Maintenance & Supplies", amount: 2500, percentage: 8 },
    ],
    marketingStrategy: {
      digital: [
        { channel: "Facebook Ads", description: "Targeted local campaigns", budget: 800 },
        { channel: "Google Ads", description: "Search & local listings", budget: 600 },
        { channel: "Social Media", description: "Instagram & TikTok content", budget: 400 },
      ],
      traditional: [
        { channel: "Local Partnerships", description: "Hotels, restaurants, events", budget: 200 },
        { channel: "Print & Radio", description: "Local media coverage", budget: 300 },
        { channel: "Events & Demos", description: "Pop-up experiences", budget: 500 },
      ],
    },
  });

  const sections = [
    { id: "overview", label: "Overview", icon: ChartPie },
    { id: "financial", label: "Financial", icon: DollarSign },
    { id: "marketing", label: "Marketing", icon: BellRing },
    { id: "operations", label: "Operations", icon: ServerCog },
    { id: "timeline", label: "Timeline", icon: Calendar },
  ];

  const timelineItems = [
    { phase: "Business Planning", description: "Complete business plan and secure funding", status: "completed" },
    { phase: "Location & Permits", description: "Secure lease, obtain permits and licenses", status: "active" },
    { phase: "Room Construction", description: "Build out escape rooms and install tech", status: "upcoming" },
    { phase: "Staff Hiring & Training", description: "Recruit and train game masters", status: "upcoming" },
    { phase: "Grand Opening", description: "Launch marketing campaign and open doors", status: "upcoming", date: "Q2 2024" },
  ];

  const handleSave = () => {
    onSave(planData);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Plan Navigation */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Plan Sections</h3>
          <nav className="space-y-1">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  className={`plan-nav-item ${activeSection === section.id ? "active" : ""}`}
                  onClick={() => setActiveSection(section.id)}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {section.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Plan Content */}
      <div className="lg:col-span-3">
        {/* Overview Section */}
        {activeSection === "overview" && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Business Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="businessName">Business Name</Label>
                  <Input 
                    id="businessName"
                    placeholder="Enter business name"
                    value={planData.businessName}
                    onChange={(e) => setPlanData(prev => ({ ...prev, businessName: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input 
                    id="location"
                    placeholder="City, State"
                    value={planData.location}
                    onChange={(e) => setPlanData(prev => ({ ...prev, location: e.target.value }))}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="mission">Mission Statement</Label>
                  <Textarea 
                    id="mission"
                    rows={3} 
                    placeholder="Describe your business mission"
                    value={planData.missionStatement}
                    onChange={(e) => setPlanData(prev => ({ ...prev, missionStatement: e.target.value }))}
                  />
                </div>
              </div>
            </div>

            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="metric-card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Projected Monthly Revenue</p>
                    <p className="text-2xl font-bold text-green-600">$45,000</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="metric-card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Break-even Point</p>
                    <p className="text-2xl font-bold text-blue-600">8 months</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold">📈</span>
                  </div>
                </div>
              </div>

              <div className="metric-card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Initial Investment</p>
                    <p className="text-2xl font-bold text-purple-600">$120,000</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 font-bold">🏦</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Target Market */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Target Market</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Primary Audience</h4>
                  <ul className="space-y-2 text-gray-600">
                    {planData.targetMarket.primary.map((audience, index) => (
                      <li key={index} className="flex items-center">
                        <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                        {audience}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Secondary Audience</h4>
                  <ul className="space-y-2 text-gray-600">
                    {planData.targetMarket.secondary.map((audience, index) => (
                      <li key={index} className="flex items-center">
                        <span className="w-2 h-2 bg-secondary rounded-full mr-3"></span>
                        {audience}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Financial Section */}
        {activeSection === "financial" && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Financial Projections</h3>
            
            {/* Revenue Model */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Revenue Streams</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {planData.revenueStreams.map((stream, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="font-medium text-gray-900">{stream.name}</h5>
                        <p className="text-sm text-gray-600">{stream.description}</p>
                      </div>
                      <span className="text-lg font-bold text-green-600">${stream.amount}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Expense Breakdown */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Monthly Expenses</h4>
              <div className="space-y-3">
                {planData.expenses.map((expense, index) => (
                  <div key={index} className="p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">{expense.name}</span>
                      <span className="font-medium text-gray-900">${expense.amount.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div 
                        className="bg-red-400 h-2 rounded-full" 
                        style={{ width: `${expense.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Marketing Section */}
        {activeSection === "marketing" && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Marketing Strategy</h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Digital Marketing</h4>
                <div className="space-y-4">
                  {planData.marketingStrategy.digital.map((channel, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 text-sm">📱</span>
                          </div>
                          <div>
                            <h5 className="font-medium text-gray-900">{channel.channel}</h5>
                            <p className="text-sm text-gray-600">{channel.description}</p>
                          </div>
                        </div>
                        <span className="text-sm font-medium text-gray-900">${channel.budget}/mo</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Traditional Marketing</h4>
                <div className="space-y-4">
                  {planData.marketingStrategy.traditional.map((channel, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-green-600 text-sm">📢</span>
                          </div>
                          <div>
                            <h5 className="font-medium text-gray-900">{channel.channel}</h5>
                            <p className="text-sm text-gray-600">{channel.description}</p>
                          </div>
                        </div>
                        <span className="text-sm font-medium text-gray-900">${channel.budget}/mo</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Operations Section */}
        {activeSection === "operations" && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Operations Plan</h3>
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Staffing Requirements</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h5 className="font-medium text-gray-900">Game Masters (4)</h5>
                    <p className="text-sm text-gray-600">Lead games, assist players, reset rooms</p>
                    <p className="text-sm font-medium text-green-600">$18/hour</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h5 className="font-medium text-gray-900">Manager (1)</h5>
                    <p className="text-sm text-gray-600">Oversee operations, handle bookings</p>
                    <p className="text-sm font-medium text-green-600">$55,000/year</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Daily Schedule</h4>
                <div className="space-y-3">
                  {[
                    { time: "10:00 AM", activity: "Opening & Room Prep" },
                    { time: "11:00 AM", activity: "First Sessions Begin" },
                    { time: "6:00 PM", activity: "Peak Hours" },
                    { time: "10:00 PM", activity: "Last Sessions" },
                  ].map((slot, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <span className="font-medium text-gray-900">{slot.time}</span>
                      <span className="text-gray-600">{slot.activity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Timeline Section */}
        {activeSection === "timeline" && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Launch Timeline</h3>
            <div className="space-y-6">
              {timelineItems.map((item, index) => (
                <div key={index} className={`timeline-item ${item.status}`}>
                  <div className="timeline-marker"></div>
                  <div className="timeline-content">
                    <h4 className="font-semibold text-gray-900">{item.phase}</h4>
                    <p className="text-sm text-gray-600">{item.description}</p>
                    <span className={`text-xs font-medium ${
                      item.status === "completed" ? "text-green-600" :
                      item.status === "active" ? "text-blue-600" : "text-gray-500"
                    }`}>
                      {item.status === "completed" ? "Completed" :
                       item.status === "active" ? "In Progress" : 
                       item.date || "Upcoming"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="mt-6">
          <div className="flex justify-end space-x-3">
            <Button variant="outline">Export PDF</Button>
            <Button onClick={handleSave}>Save Plan</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
