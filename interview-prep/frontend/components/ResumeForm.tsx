"use client";

import { useState } from "react";

export type ResumePayload = {
  name: string;
  email: string;
  phone: string;
  summary: string;
  skills: string;
  experienceTitle: string;
  experienceCompany: string;
  experienceDuration: string;
  experienceDescription: string;
  education: string;
};

type ResumeFormProps = {
  onSubmit: (value: ResumePayload) => void;
};

export function ResumeForm({ onSubmit }: ResumeFormProps) {
  const [form, setForm] = useState<ResumePayload>({
    name: "",
    email: "",
    phone: "",
    summary: "",
    skills: "",
    experienceTitle: "",
    experienceCompany: "",
    experienceDuration: "",
    experienceDescription: "",
    education: ""
  });

  function update(field: keyof ResumePayload, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <form
      className="grid gap-3"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(form);
      }}
    >
      <input className="input-base" placeholder="Name" value={form.name} onChange={(e) => update("name", e.target.value)} />
      <input className="input-base" placeholder="Email" value={form.email} onChange={(e) => update("email", e.target.value)} />
      <input className="input-base" placeholder="Phone" value={form.phone} onChange={(e) => update("phone", e.target.value)} />
      <textarea className="input-base" placeholder="Summary" value={form.summary} onChange={(e) => update("summary", e.target.value)} />
      <input className="input-base" placeholder="Skills (comma-separated)" value={form.skills} onChange={(e) => update("skills", e.target.value)} />
      <input className="input-base" placeholder="Experience Title" value={form.experienceTitle} onChange={(e) => update("experienceTitle", e.target.value)} />
      <input className="input-base" placeholder="Company" value={form.experienceCompany} onChange={(e) => update("experienceCompany", e.target.value)} />
      <input className="input-base" placeholder="Duration" value={form.experienceDuration} onChange={(e) => update("experienceDuration", e.target.value)} />
      <textarea
        className="input-base"
        placeholder="Experience Description"
        value={form.experienceDescription}
        onChange={(e) => update("experienceDescription", e.target.value)}
      />
      <textarea className="input-base" placeholder="Education" value={form.education} onChange={(e) => update("education", e.target.value)} />
      <button type="submit" className="button-primary px-4 py-2">
        Preview
      </button>
    </form>
  );
}
