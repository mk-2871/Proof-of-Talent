import { create } from "zustand"
import { persist } from "zustand/middleware"

// Mock data for jobs
const mockJobs = [
  {
    id: "job1",
    title: "Smart Contract Developer",
    company: "DeFi Protocol",
    description:
      "We're looking for an experienced Solidity developer to help build our DeFi protocol. Must have experience with ERC-20 tokens and DeFi concepts.",
    budget: "0.5 ETH",
    location: "Remote",
    skills: ["Solidity", "ERC-20", "DeFi"],
    date: "Apr 15, 2023",
    recruiterId: "recruiter1",
    status: "active", // active, draft, closed
  },
  {
    id: "job2",
    title: "Frontend Developer",
    company: "NFT Marketplace",
    description:
      "Seeking a frontend developer with React experience to build our NFT marketplace UI. Knowledge of Web3 integration is required.",
    budget: "0.3 ETH",
    location: "Remote",
    skills: ["React", "Web3", "UI/UX"],
    date: "Apr 18, 2023",
    recruiterId: "recruiter2",
    status: "active",
  },
  {
    id: "job3",
    title: "Blockchain Security Auditor",
    company: "Security DAO",
    description:
      "Looking for a security expert to audit our smart contracts. Must have experience with security vulnerabilities and best practices.",
    budget: "0.8 ETH",
    location: "Remote",
    skills: ["Security", "Auditing", "Solidity"],
    date: "Apr 20, 2023",
    recruiterId: "recruiter1",
    status: "active",
  },
]

interface JobStore {
  jobs: typeof mockJobs
  addJob: (job: Omit<(typeof mockJobs)[0], "id" | "date" | "status">) => void
  getActiveJobs: () => typeof mockJobs
  getRecruiterJobs: (recruiterId: string) => typeof mockJobs
  updateJobStatus: (jobId: string, status: "active" | "draft" | "closed") => void
}

export const useJobStore = create<JobStore>()(
  persist(
    (set, get) => ({
      jobs: mockJobs,

      addJob: (job) => {
        const newJob = {
          ...job,
          id: `job${Date.now()}`,
          date: new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          }),
          status: "active" as const,
        }

        set((state) => ({
          jobs: [...state.jobs, newJob],
        }))

        return newJob
      },

      getActiveJobs: () => {
        return get().jobs.filter((job) => job.status === "active")
      },

      getRecruiterJobs: (recruiterId) => {
        return get().jobs.filter((job) => job.recruiterId === recruiterId)
      },

      updateJobStatus: (jobId, status) => {
        set((state) => ({
          jobs: state.jobs.map((job) => (job.id === jobId ? { ...job, status } : job)),
        }))
      },
    }),
    {
      name: "job-store",
    },
  ),
)
