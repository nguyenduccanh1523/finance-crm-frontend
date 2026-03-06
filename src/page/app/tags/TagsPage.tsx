import { useState } from "react";
import { Plus, Edit2, Trash2, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

// Mock data
const mockTags = [
  {
    id: 1,
    name: "Best Seller",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    count: 234,
  },
  {
    id: 2,
    name: "New Arrival",
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    count: 89,
  },
  {
    id: 3,
    name: "On Sale",
    color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    count: 156,
  },
  {
    id: 4,
    name: "Premium",
    color:
      "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    count: 67,
  },
  {
    id: 5,
    name: "Limited Edition",
    color: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
    count: 42,
  },
  {
    id: 6,
    name: "Eco Friendly",
    color:
      "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
    count: 105,
  },
];

export function TagsPage() {
  const [tags, setTags] = useState(mockTags);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTags = tags.filter((tag) =>
    tag.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleDelete = (id: number) => {
    setTags(tags.filter((tag) => tag.id !== id));
  };

  return (
    <div className="flex-1 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Tags
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage product tags and labels
          </p>
        </div>
        <Button className="gap-2">
          <Plus size={18} />
          Add Tag
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={18}
        />
        <Input
          placeholder="Search tags..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Tags Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTags.length > 0 ? (
          filteredTags.map((tag) => (
            <div
              key={tag.id}
              className="p-4 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 hover:shadow-md transition"
            >
              <div className="flex items-center justify-between mb-3">
                <Badge className={`${tag.color} cursor-default`}>
                  {tag.name}
                </Badge>
                <div className="flex gap-1">
                  <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition text-gray-600 dark:text-gray-400">
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(tag.id)}
                    className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition text-red-600 dark:text-red-400"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Used in{" "}
                <span className="font-semibold text-gray-900 dark:text-white">
                  {tag.count}
                </span>{" "}
                products
              </p>
            </div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center">
            <p className="text-gray-500 dark:text-gray-400">No tags found</p>
          </div>
        )}
      </div>
    </div>
  );
}
