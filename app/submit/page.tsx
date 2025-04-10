import { Metadata } from "next";
import SubmitForm from "@/components/submit-form";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Submit Tool | AI Character Directory",
  description: "Submit your AI character or chat tool to our directory for review and publication.",
};

export default function SubmitPage() {
  return (
    <div className="container py-8 max-w-5xl">
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
        
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Submit Your AI Tool</h1>
          <p className="text-muted-foreground">
            Share your AI character or chat tool and let more people discover it. Your submission will be reviewed before being published.
          </p>
        </div>
      </div>
      
      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-1 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                <span className="text-sm font-bold text-primary">1</span>
              </div>
              <h3 className="font-medium">Submission Guidelines</h3>
            </div>
            
            <div className="ml-10 space-y-3 text-sm">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-3 w-3 text-green-600"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <p>Tool must be related to AI characters, chat, or virtual assistants</p>
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-3 w-3 text-green-600"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <p>Provide complete and accurate information about your tool</p>
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-3 w-3 text-green-600"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <p>Logo should be clear and visible (min 100x100px recommended)</p>
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-3 w-3 text-green-600"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <p>Website must be accessible and functioning properly</p>
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-3 w-3 text-green-600"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <p>Please be patient during the review process (24-48 hours)</p>
                </div>
              </div>
              
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                <span className="text-sm font-bold text-primary">2</span>
              </div>
              <h3 className="font-medium">Automatic Capture</h3>
            </div>
            
            <div className="ml-10 space-y-3 text-sm">
              <p className="text-muted-foreground">
                Our system will automatically analyze your website and extract the following information:
              </p>
              
              <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                <li>Website screenshots</li>
                <li>Website icon, title, and description</li>
                <li>Key features and characteristics</li>
                <li>Usage instructions and statistics</li>
                <li>SEO suggestions and optimization directions</li>
              </ul>
              
              <p className="text-muted-foreground">
                Just enter the URL and the system will automatically extract and fill in all the information.
              </p>
            </div>
          </div>
        </div>
        
        <div className="md:col-span-2">
          <div className="rounded-lg border bg-background p-6">
            <SubmitForm />
          </div>
        </div>
      </div>
    </div>
  );
} 