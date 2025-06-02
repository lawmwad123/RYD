"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  Users, 
  ClipboardList, 
  FolderKanban, 
  Clock,
  CheckCircle,
  AlertTriangle,
  UserPlus,
  Calendar,
  TrendingUp
} from "lucide-react"
import { useDashboardStats } from "@/lib/hooks/use-dashboard-stats"
import { cn } from "@/lib/utils"

interface StatCardProps {
  title: string
  value: number | string
  icon: React.ElementType
  description?: string
  trend?: {
    value: number
    isPositive: boolean
  }
  variant?: 'default' | 'success' | 'warning' | 'danger'
}

function StatCard({ title, value, icon: Icon, description, trend, variant = 'default' }: StatCardProps) {
  const variantStyles = {
    default: "bg-background border-border",
    success: "bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800",
    warning: "bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800", 
    danger: "bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800"
  }

  const iconStyles = {
    default: "text-muted-foreground",
    success: "text-green-600 dark:text-green-400",
    warning: "text-yellow-600 dark:text-yellow-400",
    danger: "text-red-600 dark:text-red-400"
  }

  return (
    <Card className={cn("transition-all hover:shadow-md", variantStyles[variant])}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={cn("h-4 w-4", iconStyles[variant])} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
        {trend && (
          <div className={cn(
            "flex items-center text-xs mt-2",
            trend.isPositive ? "text-green-600" : "text-red-600"
          )}>
            <TrendingUp className={cn(
              "h-3 w-3 mr-1",
              !trend.isPositive && "rotate-180"
            )} />
            {Math.abs(trend.value)}% from last week
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function StatCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-4" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-16 mb-2" />
        <Skeleton className="h-3 w-32" />
      </CardContent>
    </Card>
  )
}

export function StatsCards() {
  const { data: stats, isLoading, error } = useDashboardStats()

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (error || !stats) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="col-span-full">
          <CardContent className="p-6">
            <div className="text-center text-muted-foreground">
              <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
              <p>Failed to load dashboard statistics</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const completionRate = stats.totalTasks > 0 
    ? Math.round((stats.completedTasks / stats.totalTasks) * 100)
    : 0

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Tasks Overview */}
      <StatCard
        title="Total Tasks"
        value={stats.totalTasks}
        icon={ClipboardList}
        description={`${stats.tasksInProgress} in progress`}
      />
      
      <StatCard
        title="Completed Tasks"
        value={stats.completedTasks}
        icon={CheckCircle}
        description={`${completionRate}% completion rate`}
        variant="success"
      />
      
      <StatCard
        title="Overdue Tasks"
        value={stats.overdueTasks}
        icon={AlertTriangle}
        description="Need attention"
        variant={stats.overdueTasks > 0 ? "danger" : "default"}
      />

      {/* Team Overview */}
      <StatCard
        title="Team Members"
        value={stats.totalTeamMembers}
        icon={Users}
        description={`${stats.activeTeamMembers} active`}
      />

      {/* Projects Overview */}
      <StatCard
        title="Projects"
        value={stats.totalProjects}
        icon={FolderKanban}
        description={`${stats.activeProjects} active`}
      />

      {/* Pending Approvals */}
      <StatCard
        title="Pending Approvals"
        value={stats.pendingApprovals}
        icon={UserPlus}
        description="Awaiting review"
        variant={stats.pendingApprovals > 0 ? "warning" : "default"}
      />

      {/* Recent Activity */}
      <StatCard
        title="Tasks This Week"
        value={stats.recentActivity.tasksCompleted}
        icon={Calendar}
        description="Completed this week"
        variant="success"
      />

      <StatCard
        title="New Registrations"
        value={stats.recentActivity.newRegistrations}
        icon={UserPlus}
        description="This week"
      />
    </div>
  )
} 