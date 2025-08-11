"use client"

import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Search, RotateCcw } from "lucide-react"
import { priorities } from "@/lib/constants"

export default function TodoFilters({ filters, onFiltersChange, onResetFilters }) {
  const handleFilterChange = (key, value) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6 items-end">
      {" "}
      <div className="relative flex-1 w-full sm:w-auto">
        {" "}
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search todos..."
          value={filters.search || ""}
          onChange={(e) => handleFilterChange("search", e.target.value)}
          className="pl-10"
        />
      </div>
      <Select value={filters.status || "all"} onValueChange={(value) => handleFilterChange("status", value)}>
        <SelectTrigger className="w-full sm:w-[140px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
          <SelectItem value="overdue">Overdue</SelectItem>
        </SelectContent>
      </Select>
      <Select value={filters.priority || "all"} onValueChange={(value) => handleFilterChange("priority", value)}>
        <SelectTrigger className="w-full sm:w-[140px]">
          <SelectValue placeholder="Priority" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Priority</SelectItem>
          {priorities.map((priority) => (
            <SelectItem key={priority.value} value={priority.value}>
              <span className={priority.color}>{priority.label}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={filters.orderBy || "date-latest"} onValueChange={(value) => handleFilterChange("orderBy", value)}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Order By" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="date-latest">Date (Latest)</SelectItem>
          <SelectItem value="date-oldest">Date (Oldest)</SelectItem>
        </SelectContent>
      </Select>
      {/* New: Reset Filters Button */}
      <Button variant="outline" onClick={onResetFilters} className="w-full sm:w-auto bg-transparent">
        <RotateCcw className="h-4 w-4 mr-2" />
        Reset
      </Button>
    </div>
  )
}
