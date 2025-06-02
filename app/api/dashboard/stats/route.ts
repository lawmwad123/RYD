import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { PrismaClient } from '@/lib/generated/prisma'
import { startOfMonth, startOfWeek } from 'date-fns'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const prisma = new PrismaClient()

    try {
      const now = new Date()
      const startOfThisWeek = startOfWeek(now)
      const startOfThisMonth = startOfMonth(now)

      // Task statistics
      const [
        totalTasks,
        completedTasks,
        overdueTasks,
        tasksInProgress,
        
        // Team statistics  
        totalTeamMembers,
        activeTeamMembers,
        pendingApprovals,
        
        // Project statistics
        totalProjects,
        activeProjects,
        completedProjects,
        
        // Recent activity
        recentTasksCompleted,
        recentRegistrations,
      ] = await Promise.all([
        // Tasks
        prisma.task.count(),
        prisma.task.count({ where: { status: 'COMPLETED' } }),
        prisma.task.count({ 
          where: { 
            status: { not: 'COMPLETED' },
            OR: [
              { endDate: { lt: now } },
              { startDate: { lt: now } }
            ]
          } 
        }),
        prisma.task.count({ where: { status: 'IN_PROGRESS' } }),
        
        // Team members
        prisma.user.count(),
        prisma.user.count({ where: { status: 'ACTIVE' } }),
        prisma.user.count({ where: { status: 'PENDING' } }),
        
        // Projects
        prisma.project.count(),
        prisma.project.count({ where: { status: 'ACTIVE' } }),
        prisma.project.count({ where: { status: 'COMPLETED' } }),
        
        // Recent activity (this week)
        prisma.task.count({ 
          where: { 
            status: 'COMPLETED',
            completedAt: { gte: startOfThisWeek }
          } 
        }),
        prisma.user.count({ 
          where: { 
            createdAt: { gte: startOfThisWeek }
          } 
        }),
      ])

      // Calculate total hours (simplified - you might want to use time entries)
      const totalHours = Math.floor(Math.random() * 160) + 40 // Placeholder

      const stats = {
        totalTasks,
        completedTasks,
        overdueTasks,
        tasksInProgress,
        
        totalTeamMembers,
        activeTeamMembers,
        pendingApprovals,
        
        totalProjects,
        activeProjects,
        completedProjects,
        
        recentActivity: {
          tasksCompleted: recentTasksCompleted,
          newRegistrations: recentRegistrations,
          totalHours,
        }
      }

      return NextResponse.json(stats)
    } finally {
      await prisma.$disconnect()
    }
  } catch (error) {
    console.error('[Dashboard Stats API] Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 