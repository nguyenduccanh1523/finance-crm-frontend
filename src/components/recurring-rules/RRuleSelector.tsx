import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  RRULE_TEMPLATES,
  getTemplatesByCategory,
  getDetailedRRuleDescription,
} from "@/lib/utils/rrule";
import { Info } from "lucide-react";

const CATEGORIES = ["daily", "weekly", "monthly", "quarterly", "yearly"];
const CATEGORY_LABELS = {
  daily: "Daily",
  weekly: "Weekly",
  monthly: "Monthly",
  quarterly: "Quarterly",
  yearly: "Yearly",
};

interface RRuleSelectorProps {
  value: string;
  onChange: (rrule: string) => void;
  disabled?: boolean;
}

export function RRuleSelector({
  value,
  onChange,
  disabled = false,
}: RRuleSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("monthly");

  const categoryTemplates = getTemplatesByCategory(selectedCategory);
  const selectedTemplate = RRULE_TEMPLATES.find((t) => t.rrule === value);
  const description = value
    ? getDetailedRRuleDescription(value)
    : "Select a recurrence pattern";

  return (
    <div className="space-y-4">
      {/* Category Selector */}
      <div>
        <label className="text-sm font-medium mb-2 block">
          Recurrence Type
        </label>
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map((category) => (
            <Button
              key={category}
              type="button"
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setSelectedCategory(category);
                onChange("");
              }}
              disabled={disabled}
            >
              {CATEGORY_LABELS[category as keyof typeof CATEGORY_LABELS]}
            </Button>
          ))}
        </div>
      </div>

      {/* Template Selector */}
      <div>
        <label className="text-sm font-medium mb-2 block">Select Pattern</label>
        <Select
          value={selectedTemplate?.id || ""}
          onValueChange={(templateId) => {
            const template = RRULE_TEMPLATES.find((t) => t.id === templateId);
            if (template) {
              onChange(template.rrule);
            }
          }}
          disabled={disabled}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a recurrence pattern..." />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {categoryTemplates.map((template) => (
                <SelectItem key={template.id} value={template.id}>
                  {template.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Description Card */}
      {selectedTemplate && (
        <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-900 p-3">
          <div className="flex gap-2">
            <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-blue-900 dark:text-blue-300">
                {selectedTemplate.label}
              </p>
              <p className="text-sm text-blue-800 dark:text-blue-300 mt-1">
                {selectedTemplate.description}
              </p>
              <div className="mt-2 flex gap-2">
                <Badge
                  variant="secondary"
                  className="font-mono text-xs dark:bg-blue-900 dark:text-blue-200"
                >
                  {selectedTemplate.rrule}
                </Badge>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Description Display */}
      {value && (
        <div className="p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-900 rounded-md">
          <p className="text-sm text-green-900 dark:text-green-300">
            <strong>Repeats:</strong> {description}
          </p>
        </div>
      )}
    </div>
  );
}
