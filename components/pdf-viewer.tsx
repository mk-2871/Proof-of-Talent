"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Download, ZoomIn, ZoomOut } from "lucide-react"

interface PDFViewerProps {
  file: any // In a real app, this would be a File or URL
  onDownload?: () => void
}

export function PDFViewer({ file, onDownload }: PDFViewerProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(5) // Mock total pages
  const [zoom, setZoom] = useState(100)

  // In a real app, we would use a PDF.js or similar library to render the PDF
  // For this demo, we'll just simulate a PDF viewer with mock content

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const handleZoomIn = () => {
    if (zoom < 200) {
      setZoom(zoom + 25)
    }
  }

  const handleZoomOut = () => {
    if (zoom > 50) {
      setZoom(zoom - 25)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center p-2 border-b">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handlePrevPage} disabled={currentPage === 1}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <Button variant="outline" size="icon" onClick={handleNextPage} disabled={currentPage === totalPages}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handleZoomOut} disabled={zoom <= 50}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm">{zoom}%</span>
          <Button variant="outline" size="icon" onClick={handleZoomIn} disabled={zoom >= 200}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          {onDownload && (
            <Button variant="outline" size="icon" onClick={onDownload}>
              <Download className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-gray-100 p-4 flex justify-center">
        <div
          className="bg-white shadow-md"
          style={{
            width: `${(8.5 * zoom) / 100}in`,
            height: `${(11 * zoom) / 100}in`,
            padding: "1in",
            position: "relative",
          }}
        >
          {/* Mock PDF content */}
          <div className="space-y-4">
            <h1 className="text-2xl font-bold">{file?.name || "Resume"}</h1>
            <p className="text-sm text-gray-500">
              This is a mock PDF viewer. In a real application, you would see the actual PDF content rendered here.
            </p>

            <div className="space-y-2">
              <h2 className="text-lg font-semibold">Contact Information</h2>
              <p>Email: candidate@example.com</p>
              <p>Phone: (555) 123-4567</p>
              <p>Location: New York, NY</p>
            </div>

            <div className="space-y-2">
              <h2 className="text-lg font-semibold">Skills</h2>
              <ul className="list-disc pl-5">
                <li>Solidity</li>
                <li>Smart Contract Development</li>
                <li>Web3.js</li>
                <li>React</li>
                <li>TypeScript</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h2 className="text-lg font-semibold">Experience</h2>
              <div>
                <h3 className="font-medium">Senior Blockchain Developer</h3>
                <p className="text-sm">DeFi Protocol • 2020 - Present</p>
                <p className="text-sm mt-1">Led development of smart contracts for lending and borrowing platform.</p>
              </div>
            </div>

            <div className="absolute bottom-4 right-4 text-xs text-gray-400">
              Page {currentPage} of {totalPages}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
