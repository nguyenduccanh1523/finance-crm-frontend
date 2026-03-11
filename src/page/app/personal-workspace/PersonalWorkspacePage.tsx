import { useEffect, useRef, useState } from "react";
import {
  Edit2,
  Loader,
  Calendar,
  Users,
  DollarSign,
  Shield,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppToast } from "@/components/common/toast/useToast";
import {
  useGetPersonalWorkspace,
  useUpdatePersonalWorkspace,
} from "@/lib/hooks/workspace/usePersonalWorkspace";

const CURRENCIES = [
  "USD",
  "EUR",
  "VND",
  "GBP",
  "JPY",
  "CNY",
  "AUD",
  "CAD",
  "CHF",
  "SGD",
];

const TIMEZONES = [
  "UTC",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Paris",
  "Europe/Amsterdam",
  "Asia/Bangkok",
  "Asia/Ho_Chi_Minh",
  "Asia/Manila",
  "Asia/Singapore",
  "Asia/Tokyo",
  "Asia/Shanghai",
  "Asia/Hong_Kong",
  "Asia/Kolkata",
  "Australia/Sydney",
  "Australia/Melbourne",
];

export function PersonalWorkspacePage() {
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState<{
    name: string;
    defaultCurrency: string;
    timezone: string;
  }>({ name: "", defaultCurrency: "USD", timezone: "UTC" });
  const hasInitialized = useRef(false);

  const { workspace, setWorkspace, loading, fetchWorkspace } =
    useGetPersonalWorkspace();
  const { updateWorkspace, loading: updateLoading } =
    useUpdatePersonalWorkspace();
  const { showSuccess, showError } = useAppToast();

  // Fetch workspace on mount
  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    fetchWorkspace().catch((err) => {
      console.error("Failed to load workspace:", err);
    });
  }, [fetchWorkspace]);

  // Update form data when workspace loads
  useEffect(() => {
    if (workspace) {
      setFormData({
        name: workspace.name || "",
        defaultCurrency: workspace.defaultCurrency || "USD",
        timezone: workspace.timezone || "UTC",
      });
    }
  }, [workspace]);

  const handleEditClick = () => {
    setIsEditMode(true);
  };

  const handleCancel = () => {
    setIsEditMode(false);
    if (workspace) {
      setFormData({
        name: workspace.name,
        defaultCurrency: workspace.defaultCurrency || "USD",
        timezone: workspace.timezone || "UTC",
      });
    }
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      showError("Workspace name is required");
      return;
    }

    try {
      const updated = await updateWorkspace({
        name: formData.name,
        defaultCurrency: formData.defaultCurrency,
        timezone: formData.timezone,
      });

      setWorkspace(updated);
      setIsEditMode(false);
      showSuccess("Workspace updated successfully");
    } catch (err: any) {
      const errorMsg =
        err?.response?.data?.message || "Failed to update workspace";
      showError(errorMsg);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <Loader className="animate-spin w-8 h-8 mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600 dark:text-gray-400">
            Loading workspace...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Personal Workspace
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your workspace settings and preferences
          </p>
        </div>
        {!isEditMode && (
          <Button
            onClick={handleEditClick}
            className="gap-2"
            disabled={loading || updateLoading}
          >
            <Edit2 size={18} />
            Edit Workspace
          </Button>
        )}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Workspace Info Card */}
        <div className="lg:col-span-2 space-y-4">
          {isEditMode ? (
            // Edit Mode
            <Card className="p-6 border border-gray-200 dark:border-gray-800">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Edit Workspace Details
              </h2>
              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Workspace Name*
                  </label>
                  <Input
                    placeholder="Enter workspace name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    disabled={updateLoading}
                    className="text-base"
                  />
                </div>

                {/* Currency */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Default Currency
                  </label>
                  <Select
                    value={formData.defaultCurrency}
                    onValueChange={(value) =>
                      setFormData({ ...formData, defaultCurrency: value })
                    }
                    disabled={updateLoading}
                  >
                    <SelectTrigger className="text-base">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      {CURRENCIES.map((currency) => (
                        <SelectItem key={currency} value={currency}>
                          {currency}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Timezone */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Timezone
                  </label>
                  <Select
                    value={formData.timezone}
                    onValueChange={(value) =>
                      setFormData({ ...formData, timezone: value })
                    }
                    disabled={updateLoading}
                  >
                    <SelectTrigger className="text-base">
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIMEZONES.map((tz) => (
                        <SelectItem key={tz} value={tz}>
                          {tz}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={handleSubmit}
                    disabled={updateLoading}
                    className="flex-1 gap-2"
                  >
                    {updateLoading && (
                      <Loader size={16} className="animate-spin" />
                    )}
                    Save Changes
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    disabled={updateLoading}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            // View Mode
            <>
              {/* Workspace Info Card */}
              <Card className="p-6 border border-gray-200 dark:border-gray-800 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
                <div className="space-y-4">
                  {/* Name and Status */}
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                        Workspace Name
                      </p>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                        {workspace?.name}
                      </h2>
                    </div>
                    {workspace?.status && (
                      <Badge
                        className={
                          workspace.status === "active"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                        }
                      >
                        {workspace.status.charAt(0).toUpperCase() +
                          workspace.status.slice(1)}
                      </Badge>
                    )}
                  </div>

                  {/* Stats Row */}
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    {/* Currency */}
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                        <DollarSign
                          size={20}
                          className="text-blue-600 dark:text-blue-400"
                        />
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          Currency
                        </p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {workspace?.defaultCurrency || "USD"}
                        </p>
                      </div>
                    </div>

                    {/* Timezone */}
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                        <Globe
                          size={20}
                          className="text-indigo-600 dark:text-indigo-400"
                        />
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          Timezone
                        </p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {workspace?.timezone || "UTC"}
                        </p>
                      </div>
                    </div>

                    {/* Role */}
                    {workspace?.role && (
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                          <Shield
                            size={20}
                            className="text-purple-600 dark:text-purple-400"
                          />
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            Your Role
                          </p>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {workspace.role}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Created Date */}
                    {workspace?.createdAt && (
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                          <Calendar
                            size={20}
                            className="text-orange-600 dark:text-orange-400"
                          />
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            Created
                          </p>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {new Date(workspace.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              },
                            )}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </>
          )}
        </div>

        {/* Sidebar - Quick Stats */}
        <div className="space-y-4">
          {/* Members Card */}
          {workspace?.members !== undefined && (
            <Card className="p-4 border border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Users
                    size={20}
                    className="text-blue-600 dark:text-blue-400"
                  />
                </div>
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Total Members
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {workspace.members}
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* Security Card */}
          <Card className="p-4 border border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Shield
                  size={20}
                  className="text-green-600 dark:text-green-400"
                />
              </div>
              <p className="font-semibold text-gray-900 dark:text-white">
                Security
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Status</span>
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                  Secure
                </Badge>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
