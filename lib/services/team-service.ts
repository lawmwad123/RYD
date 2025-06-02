/**
 * Team Member API Service
 * Contains all the functions to interact with the team member API endpoints
 */

export interface TeamMember {
  id: string;
  firstName: string | null;
  lastName: string | null;
  name: string | null;
  email: string;
  avatar?: string | null;
  phone?: string | null;
  nationalId?: string | null;
  role: string;
  status: string;
  district?: string | null;
  region?: string | null;
  availability?: string | null;
  languages?: string | null;
  skills?: string | null;
  emergencyContact?: string | null;
  jobTitle?: string | null;
  department?: string | null;
  createdAt?: string;
  updatedAt?: string;
  approvedAt?: string | null;
}

export interface CreateTeamMemberData {
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  phone?: string;
  nationalId?: string;
  role: string;
  status?: string;
  district?: string;
  region?: string;
  availability?: string;
  languages?: string;
  skills?: string;
  emergencyContact?: string;
  jobTitle?: string;
  department?: string;
}

export type UpdateTeamMemberData = Partial<CreateTeamMemberData>;

// Get all team members
export async function getAllTeamMembers(): Promise<TeamMember[]> {
  const response = await fetch('/api/team', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch team members');
  }

  return response.json();
}

// Get a team member by ID
export async function getTeamMemberById(id: string): Promise<TeamMember> {
  const response = await fetch(`/api/team/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch team member');
  }

  return response.json();
}

// Create a new team member
export async function createTeamMember(data: CreateTeamMemberData): Promise<TeamMember> {
  const response = await fetch('/api/team', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create team member');
  }

  return response.json();
}

// Update a team member
export async function updateTeamMember(id: string, data: UpdateTeamMemberData): Promise<TeamMember> {
  const response = await fetch(`/api/team/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update team member');
  }

  return response.json();
}

// Delete a team member
export async function deleteTeamMember(id: string): Promise<void> {
  const response = await fetch(`/api/team/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to delete team member');
  }
} 