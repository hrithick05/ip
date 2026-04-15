"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { ResumeForm, ResumePayload } from "@/components/ResumeForm";
import { useApi } from "@/lib/api";
import { MotionPage } from "@/components/MotionPage";
import { LoadingSpinner } from "@/components/LoadingSpinner";

function previewClass(templateId: string) {
  if (templateId === "2") return "border-indigo-400/30 bg-indigo-500/10";
  if (templateId === "3") return "border-violet-400/30 bg-violet-500/10";
  if (templateId === "4") return "border-rose-400/30 bg-rose-500/10";
  return "";
}

export default function ResumeBuilderPage() {
  const params = useParams<{ templateId: string }>();
  const { apiFetch } = useApi();
  const templateId = params.templateId;
  const [previewData, setPreviewData] = useState<ResumePayload | null>(null);
  const [downloading, setDownloading] = useState(false);

  const skills = useMemo(() => previewData?.skills.split(",").map((value) => value.trim()).filter(Boolean) ?? [], [previewData]);

  async function downloadPdf() {
    if (!previewData) return;
    setDownloading(true);
    try {
      const blob = await apiFetch("/api/resume/pdf", {
        method: "POST",
        body: JSON.stringify({
          templateId,
          name: previewData.name,
          email: previewData.email,
          phone: previewData.phone,
          summary: previewData.summary,
          skills,
          experience: {
            title: previewData.experienceTitle,
            company: previewData.experienceCompany,
            duration: previewData.experienceDuration,
            description: previewData.experienceDescription
          },
          education: previewData.education
        })
      });

      const url = URL.createObjectURL(blob as Blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "resume.pdf";
      anchor.click();
      URL.revokeObjectURL(url);
    } finally {
      setDownloading(false);
    }
  }

  return (
    <MotionPage>
      <section className="grid min-h-[calc(100vh-8rem)] gap-6 md:grid-cols-2">
      <div className="card">
        <h1 className="mb-3 text-2xl font-bold">Resume Builder</h1>
        <p className="mb-4 text-sm text-[#9B99B8]">Template {templateId} • Live update preview</p>
        <ResumeForm onSubmit={setPreviewData} />
      </div>
      <div className={`card ${previewClass(templateId)} space-y-3`}>
        <h2 className="text-xl font-semibold">Preview</h2>
        {previewData ? (
          <>
            <h3 className="text-lg font-bold">{previewData.name}</h3>
            <p className="text-sm text-slate-600">
              {previewData.email} | {previewData.phone}
            </p>
            <p>{previewData.summary}</p>
            <p>
              <strong>Skills:</strong> {skills.join(", ")}
            </p>
            <p>
              <strong>Experience:</strong> {previewData.experienceTitle} at {previewData.experienceCompany} ({previewData.experienceDuration})
            </p>
            <p>{previewData.experienceDescription}</p>
            <p>
              <strong>Education:</strong> {previewData.education}
            </p>
            <button type="button" className="rounded bg-slate-900 px-4 py-2 text-white disabled:opacity-50" disabled={downloading} onClick={downloadPdf}>
              {downloading ? (
                <span className="inline-flex items-center gap-2">
                  <LoadingSpinner size={16} />
                  Preparing PDF...
                </span>
              ) : (
                "Download PDF"
              )}
            </button>
          </>
        ) : (
          <p className="text-[#9B99B8]">Fill and preview your resume details.</p>
        )}
      </div>
    </section>
    </MotionPage>
  );
}
