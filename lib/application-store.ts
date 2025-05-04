import { create } from "zustand"
import { persist } from "zustand/middleware"

// Mock data for applications
const mockApplications = [
  {
    id: "app1",
    jobId: "job1",
    job: {
      title: "Smart Contract Developer",
      company: "DeFi Protocol",
      location: "Remote",
    },
    candidate: {
      id: "user123",
      name: "Alex Johnson",
      title: "Blockchain Developer",
      email: "alex@example.com",
      location: "New York, USA",
      avatar: "/placeholder.svg?height=40&width=40&text=AJ",
      skills: ["Solidity", "Ethereum", "Smart Contracts", "DeFi"],
    },
    application:
      "I have 5+ years of experience developing smart contracts for DeFi protocols. I've worked on lending platforms, DEXs, and yield farming protocols. I'm particularly interested in your project because of its innovative approach to decentralized finance.",
    resume: null, // Will store resume file info
    date: "Apr 15, 2023",
    status: "pending",
  },
  {
    id: "app2",
    jobId: "job2",
    job: {
      title: "Frontend Developer",
      company: "NFT Marketplace",
      location: "Remote",
    },
    candidate: {
      id: "user124",
      name: "Emma Davis",
      title: "React Developer",
      email: "emma@example.com",
      location: "London, UK",
      avatar: "/placeholder.svg?height=40&width=40&text=ED",
      skills: ["React", "TypeScript", "Web3.js", "UI/UX"],
    },
    application:
      "I'm a frontend developer with 3 years of experience building web3 applications. I've worked on multiple NFT marketplaces and have a strong understanding of connecting frontend applications to blockchain backends. I'm excited about the opportunity to work on your NFT marketplace.",
    resume: null,
    date: "Apr 18, 2023",
    status: "pending",
  },
  {
    id: "app3",
    jobId: "job3",
    job: {
      title: "Blockchain Security Auditor",
      company: "Security DAO",
      location: "Remote",
    },
    candidate: {
      id: "user125",
      name: "Michael Chen",
      title: "Security Engineer",
      email: "michael@example.com",
      location: "San Francisco, USA",
      avatar: "/placeholder.svg?height=40&width=40&text=MC",
      skills: ["Security", "Auditing", "Solidity", "Smart Contracts"],
    },
    application:
      "I have conducted security audits for over 20 DeFi protocols and NFT projects. My background in traditional cybersecurity combined with my blockchain expertise allows me to identify vulnerabilities that others might miss. I'm interested in helping your DAO improve the security of blockchain projects.",
    resume: null,
    date: "Apr 20, 2023",
    status: "pending",
  },
]

interface ApplicationStore {
  applications: typeof mockApplications
  addApplication: (application: Omit<(typeof mockApplications)[0], "id" | "date" | "status">) => void
  shortlistCandidate: (applicationId: string) => void
  rejectCandidate: (applicationId: string) => void
  getShortlistedApplications: () => typeof mockApplications
  removeFromShortlist: (applicationId: string) => void
  getApplicationsByJob: (jobId: string) => typeof mockApplications
  getApplicationsByCandidate: (candidateId: string) => typeof mockApplications
  updateResumeForApplication: (applicationId: string, resumeData: any) => void
  updateResumeForCandidate: (candidateId: string, resumeData: any) => void
  getCandidateResume: (candidateId: string) => any
}

export const useApplicationStore = create<ApplicationStore>()(
  persist(
    (set, get) => ({
      applications: mockApplications,

      addApplication: (application) => {
        const newApplication = {
          ...application,
          id: `app${Date.now()}`,
          date: new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          }),
          status: "pending" as const,
        }

        set((state) => ({
          applications: [...state.applications, newApplication],
        }))

        return newApplication
      },

      shortlistCandidate: (applicationId: string) => {
        set((state) => ({
          applications: state.applications.map((app) =>
            app.id === applicationId ? { ...app, status: "shortlisted" } : app,
          ),
        }))
      },

      rejectCandidate: (applicationId: string) => {
        set((state) => ({
          applications: state.applications.map((app) =>
            app.id === applicationId ? { ...app, status: "rejected" } : app,
          ),
        }))
      },

      getShortlistedApplications: () => {
        return get().applications.filter((app) => app.status === "shortlisted")
      },

      removeFromShortlist: (applicationId: string) => {
        set((state) => ({
          applications: state.applications.map((app) =>
            app.id === applicationId ? { ...app, status: "pending" } : app,
          ),
        }))
      },

      getApplicationsByJob: (jobId: string) => {
        return get().applications.filter((app) => app.jobId === jobId)
      },

      getApplicationsByCandidate: (candidateId: string) => {
        return get().applications.filter((app) => app.candidate.id === candidateId)
      },

      updateResumeForApplication: (applicationId: string, resumeData: any) => {
        set((state) => ({
          applications: state.applications.map((app) =>
            app.id === applicationId ? { ...app, resume: resumeData } : app,
          ),
        }))
      },

      updateResumeForCandidate: (candidateId: string, resumeData: any) => {
        set((state) => ({
          applications: state.applications.map((app) =>
            app.candidate.id === candidateId ? { ...app, resume: resumeData } : app,
          ),
        }))
      },

      getCandidateResume: (candidateId: string) => {
        const candidateApp = get().applications.find((app) => app.candidate.id === candidateId)
        return candidateApp?.resume || null
      },
    }),
    {
      name: "application-store",
    },
  ),
)
