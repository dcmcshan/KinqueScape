import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Plus, Settings, Play, Pause, Trash2, Edit, Brain, Zap, Clock, User, Activity } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface ScapeRule {
  id: number;
  roomId: number;
  name: string;
  description?: string;
  isActive: boolean;
  priority: number;
  trigger: any;
  action: any;
  cooldown: number;
  maxExecutions?: number;
  currentExecutions: number;
  lastExecuted?: string;
  createdAt: string;
  updatedAt: string;
}

export default function RulesPage() {
  const [selectedRule, setSelectedRule] = useState<ScapeRule | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newRule, setNewRule] = useState({
    name: "",
    description: "",
    priority: 1,
    trigger: {},
    action: {},
    cooldown: 0,
    maxExecutions: undefined,
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch rules for the dungeon room (roomId = 1)
  const { data: rules = [], isLoading } = useQuery({
    queryKey: ["/api/rooms/1/rules"],
  });

  const createRuleMutation = useMutation({
    mutationFn: async (ruleData: any) => {
      return await apiRequest("POST", "/api/rooms/1/rules", ruleData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/rooms/1/rules"] });
      setNewRule({
        name: "",
        description: "",
        priority: 1,
        trigger: {},
        action: {},
        cooldown: 0,
        maxExecutions: undefined,
      });
      toast({
        title: "Rule Created",
        description: "Scape rule has been created successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create rule",
        variant: "destructive",
      });
    },
  });

  const updateRuleMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      return await apiRequest("PUT", `/api/rules/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/rooms/1/rules"] });
      setIsEditing(false);
      setSelectedRule(null);
      toast({
        title: "Rule Updated",
        description: "Scape rule has been updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update rule",
        variant: "destructive",
      });
    },
  });

  const deleteRuleMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest("DELETE", `/api/rules/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/rooms/1/rules"] });
      setSelectedRule(null);
      toast({
        title: "Rule Deleted",
        description: "Scape rule has been deleted successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete rule",
        variant: "destructive",
      });
    },
  });

  const handleCreateRule = () => {
    if (!newRule.name.trim()) {
      toast({
        title: "Error",
        description: "Rule name is required",
        variant: "destructive",
      });
      return;
    }

    createRuleMutation.mutate(newRule);
  };

  const handleUpdateRule = (ruleData: any) => {
    if (!selectedRule) return;
    updateRuleMutation.mutate({ id: selectedRule.id, data: ruleData });
  };

  const handleDeleteRule = (id: number) => {
    deleteRuleMutation.mutate(id);
  };

  const toggleRuleActive = async (rule: ScapeRule) => {
    try {
      await apiRequest("PUT", `/api/rules/${rule.id}`, {
        ...rule,
        isActive: !rule.isActive,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/rooms/1/rules"] });
      toast({
        title: rule.isActive ? "Rule Disabled" : "Rule Enabled",
        description: `${rule.name} has been ${rule.isActive ? "disabled" : "enabled"}.`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to toggle rule",
        variant: "destructive",
      });
    }
  };

  const getRuleTypeIcon = (trigger: any) => {
    if (trigger.type === "biometric") return <Activity className="w-4 h-4" />;
    if (trigger.type === "device") return <Zap className="w-4 h-4" />;
    if (trigger.type === "time") return <Clock className="w-4 h-4" />;
    if (trigger.type === "participant") return <User className="w-4 h-4" />;
    if (trigger.type === "combination") return <Brain className="w-4 h-4" />;
    return <Settings className="w-4 h-4" />;
  };

  const formatTrigger = (trigger: any) => {
    if (trigger.type === "biometric") {
      return `${trigger.metric} ${trigger.operator} ${trigger.value}`;
    }
    if (trigger.type === "device") {
      return `Device ${trigger.deviceId} ${trigger.property || "status"} ${trigger.operator} ${trigger.value}`;
    }
    if (trigger.type === "time") {
      return `Duration: ${trigger.value}s`;
    }
    if (trigger.type === "participant") {
      return `${trigger.action} in ${trigger.zone || "any zone"}`;
    }
    if (trigger.type === "combination") {
      return `${trigger.conditions?.length || 0} conditions (${trigger.operator})`;
    }
    return "Custom trigger";
  };

  const formatAction = (action: any) => {
    if (Array.isArray(action)) {
      return `${action.length} actions`;
    }
    if (action.type === "device") {
      return `Control device ${action.deviceId}: ${action.command}`;
    }
    if (action.type === "notification") {
      return `Notify ${action.target}: ${action.content?.substring(0, 30)}...`;
    }
    if (action.type === "lighting") {
      return `Lighting: ${action.parameters?.effect || "control"}`;
    }
    if (action.type === "audio") {
      return `Audio: ${action.type}`;
    }
    return "Custom action";
  };

  return (
    <div className="min-h-screen bg-black text-green-400">
      {/* Header */}
      <div className="border-b border-red-900/20 bg-black/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-red-400 tron-text">Scape Rules Engine</h1>
              <p className="text-green-300 mt-2">Create and manage biometric triggers and smart device automation</p>
            </div>
            <Badge variant="outline" className="tron-border text-green-400">
              {rules.filter((r: ScapeRule) => r.isActive).length} Active Rules
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="rules" className="space-y-6">
          <TabsList className="tron-tabs">
            <TabsTrigger value="rules" className="tron-tab">
              <Settings className="w-4 h-4 mr-2" />
              Rules
            </TabsTrigger>
            <TabsTrigger value="create" className="tron-tab">
              <Plus className="w-4 h-4 mr-2" />
              Create Rule
            </TabsTrigger>
          </TabsList>

          {/* Rules List */}
          <TabsContent value="rules" className="space-y-6">
            <Card className="tron-border">
              <CardHeader>
                <CardTitle className="tron-text flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Active Scape Rules
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full mx-auto mb-4" />
                    <p className="text-green-300">Loading rules...</p>
                  </div>
                ) : rules.length === 0 ? (
                  <div className="text-center py-8">
                    <Brain className="w-12 h-12 text-red-400 mx-auto mb-4" />
                    <p className="text-green-300 mb-4">No rules defined yet</p>
                    <p className="text-green-500 text-sm">Create your first scape rule to automate your escape room experience</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {rules.map((rule: ScapeRule) => (
                      <Card key={rule.id} className="tron-border bg-black/50">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                {getRuleTypeIcon(rule.trigger)}
                                <h3 className="font-semibold text-red-400">{rule.name}</h3>
                                <Badge variant={rule.isActive ? "default" : "secondary"} className="text-xs">
                                  {rule.isActive ? "Active" : "Inactive"}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  Priority: {rule.priority}
                                </Badge>
                              </div>
                              {rule.description && (
                                <p className="text-green-300 text-sm mb-2">{rule.description}</p>
                              )}
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <span className="text-green-500">Trigger: </span>
                                  <span className="text-green-300">{formatTrigger(rule.trigger)}</span>
                                </div>
                                <div>
                                  <span className="text-green-500">Action: </span>
                                  <span className="text-green-300">{formatAction(rule.action)}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-4 mt-2 text-xs text-green-500">
                                <span>Executions: {rule.currentExecutions}/{rule.maxExecutions || "∞"}</span>
                                <span>Cooldown: {rule.cooldown}s</span>
                                {rule.lastExecuted && (
                                  <span>Last: {new Date(rule.lastExecuted).toLocaleString()}</span>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={rule.isActive}
                                onCheckedChange={() => toggleRuleActive(rule)}
                                className="tron-switch"
                              />
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedRule(rule);
                                  setIsEditing(true);
                                }}
                                className="tron-button"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeleteRule(rule.id)}
                                className="tron-button-danger"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Create Rule */}
          <TabsContent value="create" className="space-y-6">
            <Card className="tron-border">
              <CardHeader>
                <CardTitle className="tron-text flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Create New Scape Rule
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="ruleName" className="text-green-400">Rule Name</Label>
                    <Input
                      id="ruleName"
                      value={newRule.name}
                      onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                      placeholder="e.g., Heart Rate Response"
                      className="tron-input"
                    />
                  </div>
                  <div>
                    <Label htmlFor="priority" className="text-green-400">Priority</Label>
                    <Input
                      id="priority"
                      type="number"
                      value={newRule.priority}
                      onChange={(e) => setNewRule({ ...newRule, priority: parseInt(e.target.value) })}
                      min="1"
                      max="10"
                      className="tron-input"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description" className="text-green-400">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    value={newRule.description}
                    onChange={(e) => setNewRule({ ...newRule, description: e.target.value })}
                    placeholder="Describe what this rule does..."
                    className="tron-input"
                  />
                </div>

                <Separator className="border-red-900/20" />

                <div>
                  <Label className="text-green-400 text-lg">Trigger Configuration</Label>
                  <p className="text-green-500 text-sm mb-4">Define the condition that activates this rule</p>
                  <Textarea
                    value={JSON.stringify(newRule.trigger, null, 2)}
                    onChange={(e) => {
                      try {
                        setNewRule({ ...newRule, trigger: JSON.parse(e.target.value) });
                      } catch (error) {
                        // Invalid JSON, ignore
                      }
                    }}
                    placeholder='{\n  "type": "biometric",\n  "metric": "heartRate",\n  "operator": "<",\n  "value": 90\n}'
                    rows={6}
                    className="tron-input font-mono"
                  />
                </div>

                <div>
                  <Label className="text-green-400 text-lg">Action Configuration</Label>
                  <p className="text-green-500 text-sm mb-4">Define what happens when the trigger activates</p>
                  <Textarea
                    value={JSON.stringify(newRule.action, null, 2)}
                    onChange={(e) => {
                      try {
                        setNewRule({ ...newRule, action: JSON.parse(e.target.value) });
                      } catch (error) {
                        // Invalid JSON, ignore
                      }
                    }}
                    placeholder='{\n  "type": "device",\n  "deviceId": 5,\n  "command": "setIntensity",\n  "parameters": {\n    "level": 75\n  }\n}'
                    rows={6}
                    className="tron-input font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="cooldown" className="text-green-400">Cooldown (seconds)</Label>
                    <Input
                      id="cooldown"
                      type="number"
                      value={newRule.cooldown}
                      onChange={(e) => setNewRule({ ...newRule, cooldown: parseInt(e.target.value) })}
                      min="0"
                      className="tron-input"
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxExecutions" className="text-green-400">Max Executions (Optional)</Label>
                    <Input
                      id="maxExecutions"
                      type="number"
                      value={newRule.maxExecutions || ""}
                      onChange={(e) => setNewRule({ 
                        ...newRule, 
                        maxExecutions: e.target.value ? parseInt(e.target.value) : undefined 
                      })}
                      min="1"
                      placeholder="Unlimited"
                      className="tron-input"
                    />
                  </div>
                </div>

                <Button
                  onClick={handleCreateRule}
                  disabled={createRuleMutation.isPending}
                  className="w-full tron-button"
                >
                  {createRuleMutation.isPending ? (
                    <div className="animate-spin w-4 h-4 border-2 border-green-400 border-t-transparent rounded-full mr-2" />
                  ) : (
                    <Plus className="w-4 h-4 mr-2" />
                  )}
                  Create Scape Rule
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}