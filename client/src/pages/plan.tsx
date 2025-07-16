import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Download, Save } from "lucide-react";
import PlanSections from "@/components/plan-sections";
import type { BusinessPlan } from "@shared/schema";

export default function PlanPage() {
  const { toast } = useToast();

  const { data: plans, isLoading } = useQuery<BusinessPlan[]>({
    queryKey: ["/api/plans"],
  });

  const createPlanMutation = useMutation({
    mutationFn: async (planData: any) => {
      const response = await apiRequest("POST", "/api/plans", planData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/plans"] });
      toast({
        title: "Success",
        description: "Business plan saved successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save business plan. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSavePlan = (planData: any) => {
    if (!planData.businessName) {
      toast({
        title: "Validation Error",
        description: "Please enter a business name before saving.",
        variant: "destructive",
      });
      return;
    }

    createPlanMutation.mutate(planData);
  };

  const handleExportPDF = () => {
    toast({
      title: "Export Feature",
      description: "PDF export will be available soon!",
    });
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
            <h1 className="text-3xl font-bold text-gray-900">Business Plan</h1>
            <p className="text-gray-600 mt-1">Plan, budget, and track your escape room business</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button 
              variant="outline" 
              onClick={handleExportPDF}
            >
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </div>
      </div>

      {/* Existing Plans */}
      {plans && plans.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Your Business Plans</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {plans.map((plan) => (
              <div key={plan.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
                <h3 className="font-medium text-gray-900">{plan.businessName || "Untitled Plan"}</h3>
                <p className="text-sm text-gray-600 mt-1">{plan.location || "No location specified"}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs text-gray-500">
                    {plan.createdAt ? new Date(plan.createdAt).toLocaleDateString() : "Recently created"}
                  </span>
                  <Button variant="outline" size="sm">Edit</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Business Plan Sections */}
      <PlanSections onSave={handleSavePlan} />

      {/* Empty State */}
      {(!plans || plans.length === 0) && !createPlanMutation.isPending && (
        <div className="text-center py-12">
          <div className="text-4xl text-gray-400 mb-4">📊</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No business plans yet</h3>
          <p className="text-gray-600 mb-4">Start planning your escape room business today</p>
        </div>
      )}
    </div>
  );
}
