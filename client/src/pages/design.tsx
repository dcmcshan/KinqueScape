import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Save, Plus, Palette, Package, Layers } from "lucide-react";
import DesignTabs from "@/components/design-tabs";
import PropsLibrary from "@/components/props-library";
import type { EscapeRoomDesign } from "@shared/schema";

export default function DesignPage() {
  const { toast } = useToast();
  const [newRoomName, setNewRoomName] = useState("");

  const { data: designs, isLoading } = useQuery<EscapeRoomDesign[]>({
    queryKey: ["/api/designs"],
  });

  const createDesignMutation = useMutation({
    mutationFn: async (designData: any) => {
      const response = await apiRequest("POST", "/api/designs", designData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/designs"] });
      toast({
        title: "Success",
        description: "Design saved successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save design. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSaveDesign = (designData: any) => {
    if (!designData.name) {
      toast({
        title: "Validation Error",
        description: "Please enter a room name before saving.",
        variant: "destructive",
      });
      return;
    }

    createDesignMutation.mutate(designData);
  };

  const handleNewRoom = () => {
    if (!newRoomName.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a room name.",
        variant: "destructive",
      });
      return;
    }

    const newDesign = {
      name: newRoomName,
      theme: "",
      backstory: "",
      victoryCondition: "",
      layout: [],
      puzzles: [],
      props: [],
      atmosphere: {
        lighting: "dim",
        soundEffects: {
          ambient: true,
          jumpScares: false,
          backgroundMusic: true,
        },
      },
    };

    createDesignMutation.mutate(newDesign);
    setNewRoomName("");
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 pt-20 lg:pt-6">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Design Studio</h1>
            <p className="text-gray-600 mt-1">Create and customize your escape room experiences</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex space-x-2">
              <Input
                placeholder="Enter room name"
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
                className="w-48"
              />
              <Button 
                onClick={handleNewRoom}
                disabled={createDesignMutation.isPending}
              >
                <Plus className="w-4 h-4 mr-2" />
                New Room
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Existing Designs */}
      {designs && designs.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Your Designs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {designs.map((design) => (
              <div key={design.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
                <h3 className="font-medium text-gray-900">{design.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{design.theme || "No theme selected"}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs text-gray-500">
                    {design.createdAt ? new Date(design.createdAt).toLocaleDateString() : "Recently created"}
                  </span>
                  <Button variant="outline" size="sm">Edit</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Design Studio Tabs */}
      <Tabs defaultValue="canvas" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="canvas" className="flex items-center gap-2">
            <Palette className="w-4 h-4" />
            Design Canvas
          </TabsTrigger>
          <TabsTrigger value="props" className="flex items-center gap-2">
            <Package className="w-4 h-4" />
            Smart Props Library
          </TabsTrigger>
          <TabsTrigger value="layers" className="flex items-center gap-2">
            <Layers className="w-4 h-4" />
            Layer Manager
          </TabsTrigger>
        </TabsList>

        <TabsContent value="canvas" className="mt-6">
          <DesignTabs onSave={handleSaveDesign} />
        </TabsContent>

        <TabsContent value="props" className="mt-6">
          <div className="h-[800px] border border-border rounded-lg">
            <PropsLibrary onAddProp={(prop) => {
              toast({
                title: "Prop Added",
                description: `${prop.name} added to your design palette`,
              });
            }} />
          </div>
        </TabsContent>

        <TabsContent value="layers" className="mt-6">
          <div className="h-[800px] border border-border rounded-lg p-6 flex items-center justify-center">
            <div className="text-center">
              <Layers className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">Layer Manager</h3>
              <p className="text-muted-foreground">
                Organize your room elements into layers for better design control.
                This feature will help you manage lighting, props, and interactive elements.
              </p>
              <Button className="mt-4" variant="outline">
                Coming Soon
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Empty State */}
      {(!designs || designs.length === 0) && !createDesignMutation.isPending && (
        <div className="text-center py-12">
          <div className="text-4xl text-gray-400 mb-4">🎭</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No escape rooms yet</h3>
          <p className="text-gray-600 mb-4">Start by creating your first escape room design</p>
        </div>
      )}
    </div>
  );
}
