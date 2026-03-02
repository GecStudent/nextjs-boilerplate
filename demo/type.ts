// ─── Job ──────────────────────────────────────────────────────────────────────

export type JobStatus =
  | "Applied"
  | "Under Review"
  | "Shortlisted"
  | "Interview Scheduled"
  | "Rejected"
  | "Hired";

export type JobType =
  | "Full Time"
  | "Part Time"
  | "Contract"
  | "Internship"
  | "Remote";

export interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  salary: string;         // e.g. "₹2.28–2.4 LPA"
  jobType: JobType;
  experience: string;     // e.g. "1 – 2 years"
  skills: string[];
  postedAt: string;       // e.g. "2026-03-01"
  openings: number;
  isActive: boolean;
}

export interface AppliedJob {
  id: number;
  job: Job;
  appliedDate: string;
  status: JobStatus;
}


// ─── User ─────────────────────────────────────────────────────────────────────

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  experience: string;     // e.g. "1 – 2 years"
  qualification: string;  // e.g. "B.Tech / B.E."
  skills: string[];
  currentSalary?: number; // in LPA
  expectedSalary?: number;// in LPA
  noticePeriod?: string;  // e.g. "30 Days"
  linkedin?: string;
  portfolio?: string;
  profileComplete: number;// 0–100
  createdAt: string;
}