// src/queries/types.ts
export interface College {
    id: string;
    name: string;
    description?: string | null;
    studentCount: number;
    leaderCount: number;
    level: {
      level: string;
    };
    parent?: {
      id: string;
      name: string;
    } | null;
  }
  
  export interface CollegesData {
    allColleges: College[];
  }
  
  export interface CollegesVariables {
    parentId?: string;
    withCandidates?: boolean;
    academicYearId?: string;
    first?: number;
    skip?: number;
  }