import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const job = {
  title: "Service Engineer",
  company: "Unitech Technocrats",
  logo: "U",
  logoColor: "#e53935",
  rating: 4.6,
  reviews: 6,
  experience: "1 - 2 years",
  salary: "₹ 2.28-2.4 Lacs P.A.",
  location: "Ahmedabad",
  posted: "1 day ago",
  openings: 1,
  applicants: "Less than 10",
  description: {
    responsibilities: [
      "Collaborate with cross-functional teams on product development",
      "Maintain equipment performance & customer satisfaction",
      "Provide technical support through field services",
    ],
    role: "Customer Service",
    industryType: "Industrial Equipment / Machinery",
    department: "Customer Success, Service & Operations",
    employmentType: "Full Time, Permanent",
    roleCategory: "Customer Success, Service & Operations - Other",
    education: "Diploma in Any Specialization",
    preferredSkills: ["Service Engineering"],
    skills: ["English", "Gujarati", "Product Support", "Hindi", "Field Service", "Technical Services"],
  },
};

function StarRating({ rating }) {
  return (
    <span className="flex items-center gap-1 text-sm">
      <svg className="w-4 h-4 fill-amber-400 text-amber-400" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
      <span className="font-semibold text-gray-800">{rating}</span>
      <span className="text-blue-600 underline cursor-pointer">{job.reviews} Reviews</span>
    </span>
  );
}

export default function JobListingPage() {
  const [applyOpen, setApplyOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [applied, setApplied] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", resume: "" });

  const handleApply = () => {
    setApplied(true);
    setApplyOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#f3f5f8]" style={{ fontFamily: "'Noto Sans', 'Segoe UI', sans-serif" }}>
      {/* Top Nav */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-sm">J</div>
            <span className="font-bold text-gray-800 text-lg tracking-tight">JobPortal</span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="text-blue-600 border-blue-600 hover:bg-blue-50 text-sm rounded-full px-4">
              Register
            </Button>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-full px-4">
              Login
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
        {/* Main Job Card */}
        <Card className="bg-white shadow-sm border border-gray-200 rounded-2xl overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-xl font-bold text-gray-900">{job.title}</h1>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <span className="text-gray-600 text-sm font-medium">{job.company}</span>
                  <StarRating rating={job.rating} />
                </div>

                <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-600">
                  <span className="flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 3H8a2 2 0 00-2 2v2h12V5a2 2 0 00-2-2z" />
                    </svg>
                    {job.experience}
                  </span>
                  <span className="text-gray-300">|</span>
                  <span className="flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {job.salary}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 mt-2 text-sm text-gray-600">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                  {job.location}
                </div>
              </div>

              {/* Company Logo */}
              <div
                className="w-16 h-16 rounded-xl border border-gray-200 flex items-center justify-center text-2xl font-bold flex-shrink-0 shadow-sm"
                style={{ color: job.logoColor, backgroundColor: "#fef2f2" }}
              >
                {job.logo}
              </div>
            </div>

            <Separator className="my-4 bg-gray-100" />

            {/* Meta row */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                <span>
                  Posted: <span className="text-gray-700 font-medium">{job.posted}</span>
                </span>
                <span>
                  Openings: <span className="text-gray-700 font-medium">{job.openings}</span>
                </span>
                <span>
                  Applicants: <span className="text-gray-700 font-medium">{job.applicants}</span>
                </span>
              </div>

              <div className="flex gap-3">
                {applied ? (
                  <div className="flex items-center gap-2 text-green-600 font-semibold text-sm">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    Application Submitted!
                  </div>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => setApplyOpen(true)}
                      className="rounded-full border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold px-5 text-sm"
                    >
                      Register to apply
                    </Button>
                    <Button
                      onClick={() => setLoginOpen(true)}
                      className="rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 text-sm"
                    >
                      Login to apply
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Job Description Card */}
        <Card className="bg-white shadow-sm border border-gray-200 rounded-2xl">
          <CardContent className="p-6 space-y-5">
            <h2 className="text-lg font-bold text-gray-900">Job description</h2>

            {/* Responsibilities */}
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-1">Responsibilities:</p>
              <ul className="space-y-1">
                {job.description.responsibilities.map((r, i) => (
                  <li key={i} className="text-sm text-gray-600 flex items-start gap-1.5">
                    <span className="text-gray-400 mt-0.5">*</span>
                    {r}
                  </li>
                ))}
              </ul>
            </div>

            {/* Role details */}
            <div className="space-y-2 text-sm">
              {[
                { label: "Role", value: job.description.role },
                { label: "Industry Type", value: job.description.industryType },
                { label: "Department", value: job.description.department },
                { label: "Employment Type", value: job.description.employmentType },
                { label: "Role Category", value: job.description.roleCategory },
              ].map(({ label, value }) => (
                <div key={label} className="flex gap-2">
                  <span className="font-semibold text-gray-800 min-w-[130px]">{label}:</span>
                  <span className="text-gray-600">{value}</span>
                </div>
              ))}
            </div>

            <Separator className="bg-gray-100" />

            {/* Education */}
            <div>
              <p className="text-sm font-bold text-gray-800 mb-1">Education</p>
              <p className="text-sm text-gray-600">
                <span className="font-semibold text-gray-700">UG: </span>
                {job.description.education}
              </p>
            </div>

            <Separator className="bg-gray-100" />

            {/* Key Skills */}
            <div>
              <p className="text-sm font-bold text-gray-800 mb-1">Key Skills</p>
              <p className="text-xs text-gray-400 mb-3">
                Skills highlighted with '☆' are preferred keyskills
              </p>
              <div className="flex flex-wrap gap-2">
                {job.description.preferredSkills.map((s) => (
                  <span
                    key={s}
                    className="text-xs border border-gray-300 rounded-full px-3 py-1 text-gray-600 flex items-center gap-1 bg-white"
                  >
                    <span className="text-gray-400">☆</span> {s}
                  </span>
                ))}
                {job.description.skills.map((s) => (
                  <span
                    key={s}
                    className="text-xs border border-gray-300 rounded-full px-3 py-1 text-gray-600 bg-white"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* About Company Card */}
        <Card className="bg-white shadow-sm border border-gray-200 rounded-2xl">
          <CardContent className="p-6 space-y-3">
            <h2 className="text-lg font-bold text-gray-900">About company</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              Unitech Technocrats is a leading provider of industrial equipment solutions, specializing in machinery maintenance, customer service, and technical support across India. With a dedicated team of engineers, we ensure seamless operations for our clients across multiple sectors.
            </p>
            <div className="flex flex-wrap gap-4 text-sm text-gray-500 pt-1">
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                Ahmedabad, Gujarat
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                </svg>
                51-200 Employees
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253" />
                </svg>
                Industrial Equipment / Machinery
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Register to Apply Dialog */}
      <Dialog open={applyOpen} onOpenChange={setApplyOpen}>
        <DialogContent className="bg-white rounded-2xl max-w-md">
          <DialogHeader>
            <DialogTitle className="text-gray-900">Register to Apply</DialogTitle>
            <DialogDescription className="text-gray-500">Create an account to apply for this position.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <Label className="text-gray-700 text-sm font-medium">Full Name</Label>
              <Input placeholder="Your full name" value={form.name} onChange={(e) => setForm(f => ({...f, name: e.target.value}))} className="border-gray-300 rounded-lg text-sm" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-gray-700 text-sm font-medium">Email</Label>
              <Input type="email" placeholder="you@email.com" value={form.email} onChange={(e) => setForm(f => ({...f, email: e.target.value}))} className="border-gray-300 rounded-lg text-sm" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-gray-700 text-sm font-medium">Phone</Label>
              <Input type="tel" placeholder="+91 98765 43210" value={form.phone} onChange={(e) => setForm(f => ({...f, phone: e.target.value}))} className="border-gray-300 rounded-lg text-sm" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-gray-700 text-sm font-medium">Resume Link / Drive URL</Label>
              <Input placeholder="https://drive.google.com/..." value={form.resume} onChange={(e) => setForm(f => ({...f, resume: e.target.value}))} className="border-gray-300 rounded-lg text-sm" />
            </div>
            <Button onClick={handleApply} className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold">
              Submit Application
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Login Dialog */}
      <Dialog open={loginOpen} onOpenChange={setLoginOpen}>
        <DialogContent className="bg-white rounded-2xl max-w-md">
          <DialogHeader>
            <DialogTitle className="text-gray-900">Login to Apply</DialogTitle>
            <DialogDescription className="text-gray-500">Sign in to your account to apply instantly.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <Label className="text-gray-700 text-sm font-medium">Email / Mobile</Label>
              <Input placeholder="you@email.com or 9876543210" className="border-gray-300 rounded-lg text-sm" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-gray-700 text-sm font-medium">Password</Label>
              <Input type="password" placeholder="••••••••" className="border-gray-300 rounded-lg text-sm" />
            </div>
            <p className="text-xs text-blue-600 underline cursor-pointer text-right -mt-2">Forgot password?</p>
            <Button
              onClick={() => { setLoginOpen(false); setApplied(true); }}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold"
            >
              Login &amp; Apply
            </Button>
            <p className="text-center text-xs text-gray-500">
              Don't have an account?{" "}
              <span className="text-blue-600 underline cursor-pointer" onClick={() => { setLoginOpen(false); setApplyOpen(true); }}>
                Register here
              </span>
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
