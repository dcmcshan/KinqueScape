import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ALargeSmall, Puzzle, BookOpen, Group } from "lucide-react";
import DesignCanvas from "./design-canvas";

interface CanvasElement {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface DesignTabsProps {
  onSave: (data: any) => void;
}

export default function DesignTabs({ onSave }: DesignTabsProps) {
  const [activeTab, setActiveTab] = useState("layout");
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [canvasElements, setCanvasElements] = useState<CanvasElement[]>([]);
  const [designData, setDesignData] = useState({
    name: "",
    theme: "",
    backstory: "",
    victoryCondition: "",
    lighting: "dim",
    soundEffects: {
      ambient: true,
      jumpScares: false,
      backgroundMusic: true,
    },
  });

  const tabs = [
    { id: "layout", label: "Room Layout", icon: ALargeSmall },
    { id: "puzzles", label: "Puzzles & Clues", icon: Puzzle },
    { id: "story", label: "Story & Theme", icon: BookOpen },
    { id: "props", label: "Props & Effects", icon: Group },
  ];

  const tools = [
    { category: "Room Elements", items: [
      { id: "wall", label: "Wall", icon: "⬜" },
      { id: "door", label: "Door", icon: "🚪" },
      { id: "window", label: "Window", icon: "🪟" },
      { id: "furniture", label: "Furniture", icon: "🪑" },
    ]},
    { category: "Interactive", items: [
      { id: "puzzle", label: "Puzzle", icon: "🧩" },
      { id: "clue", label: "Clue", icon: "🔍" },
      { id: "lock", label: "Lock", icon: "🔒" },
      { id: "trigger", label: "Trigger", icon: "👆" },
    ]},
  ];

  const puzzleLibrary = [
    { id: "combination", name: "Combination Lock", description: "4-digit numeric combination", icon: "🔑", color: "blue" },
    { id: "jigsaw", name: "Jigsaw Puzzle", description: "Custom image puzzle", icon: "🧩", color: "green" },
    { id: "cipher", name: "Word Cipher", description: "Caesar cipher decoder", icon: "📝", color: "purple" },
  ];

  const handleElementAdd = (element: CanvasElement) => {
    setCanvasElements(prev => [...prev, element]);
  };

  const handleSave = () => {
    const saveData = {
      ...designData,
      layout: canvasElements,
      puzzles: [], // Would be populated from puzzle tab
      props: [], // Would be populated from props tab
      atmosphere: {
        lighting: designData.lighting,
        soundEffects: designData.soundEffects,
      },
    };
    onSave(saveData);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6" aria-label="Tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                className={`tab-button ${activeTab === tab.id ? "active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Room Layout Tab */}
      {activeTab === "layout" && (
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Tool Palette */}
            <div className="lg:col-span-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Design Tools</h3>
              <div className="space-y-3">
                {tools.map((category) => (
                  <div key={category.category} className="tool-category">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">{category.category}</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {category.items.map((tool) => (
                        <button
                          key={tool.id}
                          className={`tool-item ${selectedTool === tool.id ? "selected" : ""}`}
                          onClick={() => setSelectedTool(selectedTool === tool.id ? null : tool.id)}
                        >
                          <span className="text-lg">{tool.icon}</span>
                          <span>{tool.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Design Canvas */}
            <div className="lg:col-span-3">
              <DesignCanvas 
                selectedTool={selectedTool}
                onElementAdd={handleElementAdd}
                elements={canvasElements}
              />
            </div>
          </div>
        </div>
      )}

      {/* Puzzles Tab */}
      {activeTab === "puzzles" && (
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Puzzle Library</h3>
              <div className="space-y-3">
                {puzzleLibrary.map((puzzle) => (
                  <div key={puzzle.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 bg-${puzzle.color}-100 rounded-lg flex items-center justify-center`}>
                          <span className="text-lg">{puzzle.icon}</span>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{puzzle.name}</h4>
                          <p className="text-sm text-gray-600">{puzzle.description}</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">Add</Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Puzzle Configuration</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-center text-gray-600 py-8">Select a puzzle to configure its settings</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Story Tab */}
      {activeTab === "story" && (
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Story Elements</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="theme">Room Theme</Label>
                  <Select value={designData.theme} onValueChange={(value) => setDesignData(prev => ({ ...prev, theme: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="haunted">Haunted House</SelectItem>
                      <SelectItem value="space">Space Station</SelectItem>
                      <SelectItem value="detective">Detective Office</SelectItem>
                      <SelectItem value="pirate">Pirate Ship</SelectItem>
                      <SelectItem value="medieval">Medieval Castle</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="backstory">Backstory</Label>
                  <Textarea 
                    id="backstory"
                    rows={4} 
                    placeholder="Enter the room's backstory..."
                    value={designData.backstory}
                    onChange={(e) => setDesignData(prev => ({ ...prev, backstory: e.target.value }))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="victory">Victory Condition</Label>
                  <Textarea 
                    id="victory"
                    rows={2} 
                    placeholder="How do players win?"
                    value={designData.victoryCondition}
                    onChange={(e) => setDesignData(prev => ({ ...prev, victoryCondition: e.target.value }))}
                  />
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Atmosphere Settings</h3>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">Lighting</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {["dim", "normal", "bright"].map((option) => (
                      <button
                        key={option}
                        className={`atmosphere-option ${designData.lighting === option ? "active" : ""}`}
                        onClick={() => setDesignData(prev => ({ ...prev, lighting: option }))}
                      >
                        <span className="text-lg mb-1">
                          {option === "dim" ? "🌙" : option === "normal" ? "☀️" : "💡"}
                        </span>
                        <span className="capitalize">{option}</span>
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">Sound Effects</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="ambient"
                        checked={designData.soundEffects.ambient}
                        onCheckedChange={(checked) => 
                          setDesignData(prev => ({ 
                            ...prev, 
                            soundEffects: { ...prev.soundEffects, ambient: !!checked }
                          }))
                        }
                      />
                      <Label htmlFor="ambient" className="text-sm text-gray-700">Ambient sounds</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="jumpScares"
                        checked={designData.soundEffects.jumpScares}
                        onCheckedChange={(checked) => 
                          setDesignData(prev => ({ 
                            ...prev, 
                            soundEffects: { ...prev.soundEffects, jumpScares: !!checked }
                          }))
                        }
                      />
                      <Label htmlFor="jumpScares" className="text-sm text-gray-700">Jump scares</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="backgroundMusic"
                        checked={designData.soundEffects.backgroundMusic}
                        onCheckedChange={(checked) => 
                          setDesignData(prev => ({ 
                            ...prev, 
                            soundEffects: { ...prev.soundEffects, backgroundMusic: !!checked }
                          }))
                        }
                      />
                      <Label htmlFor="backgroundMusic" className="text-sm text-gray-700">Background music</Label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Props Tab */}
      {activeTab === "props" && (
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Props Inventory</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="w-full h-32 bg-gray-200 rounded-lg mb-3 flex items-center justify-center">
                    <span className="text-3xl text-gray-400">📦</span>
                  </div>
                  <h4 className="font-medium text-gray-900">Mysterious Box</h4>
                  <p className="text-sm text-gray-600">Contains hidden clues</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Available</span>
                    <Button variant="link" size="sm" className="text-primary">Edit</Button>
                  </div>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="w-full h-32 bg-gray-200 rounded-lg mb-3 flex items-center justify-center">
                    <span className="text-3xl text-gray-400">🔑</span>
                  </div>
                  <h4 className="font-medium text-gray-900">Antique Key</h4>
                  <p className="text-sm text-gray-600">Opens the final door</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">In Use</span>
                    <Button variant="link" size="sm" className="text-primary">Edit</Button>
                  </div>
                </div>
              </div>
              
              <Button variant="outline" className="mt-4">
                <span className="mr-2">➕</span>Add New Prop
              </Button>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Effects & Technology</h3>
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">⚡</span>
                      <span className="text-sm font-medium text-gray-900">LED Lighting</span>
                    </div>
                    <label className="switch">
                      <input type="checkbox" defaultChecked />
                      <span className="slider"></span>
                    </label>
                  </div>
                </div>
                
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">🔊</span>
                      <span className="text-sm font-medium text-gray-900">Audio Triggers</span>
                    </div>
                    <label className="switch">
                      <input type="checkbox" />
                      <span className="slider"></span>
                    </label>
                  </div>
                </div>
                
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">⚙️</span>
                      <span className="text-sm font-medium text-gray-900">Mechanical Props</span>
                    </div>
                    <label className="switch">
                      <input type="checkbox" defaultChecked />
                      <span className="slider"></span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Save Button */}
      <div className="border-t border-gray-200 px-6 py-4">
        <div className="flex justify-end space-x-3">
          <Button variant="outline">Save Draft</Button>
          <Button onClick={handleSave}>Save Design</Button>
        </div>
      </div>
    </div>
  );
}
