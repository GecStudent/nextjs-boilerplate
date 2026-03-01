import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

const jobMeta = {
  title: "Service Engineer",
  company: "Unitech Technocrats",
  logo: "U",
  location: "Ahmedabad",
  type: "Full Time, Permanent",
  salary: "₹ 2.28–2.4 Lacs P.A.",
};

function SectionHeading({ icon, title }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 text-base">
        {icon}
      </div>
      <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide">{title}</h3>
    </div>
  );
}

function FieldError({ msg }) {
  return msg ? <p className="text-xs text-red-500 mt-1">{msg}</p> : null;
}

export default function JobApplicationForm() {
  const fileInputRef = useRef(null);
  const [submitted, setSubmitted] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeError, setResumeError] = useState("");
  const [errors, setErrors] = useState({});
  const [dragOver, setDragOver] = useState(false);

  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "", dob: "",
    gender: "", maritalStatus: "", address: "", city: "", state: "", pincode: "",
    currentDesignation: "", currentCompany: "", totalExp: "", currentSalary: "",
    noticePeriod: "", expectedSalary: "", highestQualification: "", institution: "",
    passYear: "", specialization: "", skills: "", linkedin: "", portfolio: "",
    coverLetter: "", referral: "",
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleFile = (file) => {
    setResumeError("");
    if (!file) return;
    if (file.type !== "application/pdf") {
      setResumeError("Only PDF files are allowed. Please upload a .pdf file.");
      setResumeFile(null);
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setResumeError("File size must be under 5MB.");
      setResumeFile(null);
      return;
    }
    setResumeFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = "First name is required";
    if (!form.lastName.trim()) e.lastName = "Last name is required";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Valid email is required";
    if (!form.phone.trim() || !/^\d{10}$/.test(form.phone.replace(/\s/g, ""))) e.phone = "Valid 10-digit phone is required";
    if (!form.totalExp) e.totalExp = "Please select experience";
    if (!form.highestQualification) e.highestQualification = "Please select qualification";
    if (!resumeFile) e.resume = "Resume (PDF) is required";
    if (!form.coverLetter.trim()) e.coverLetter = "Cover letter is required";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length === 0) setSubmitted(true);
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#f3f5f8] flex items-center justify-center px-4"
        style={{ fontFamily: "'Nunito', 'Segoe UI', sans-serif" }}>
        <Card className="bg-white border border-gray-200 rounded-2xl shadow-md max-w-md w-full">
          <CardContent className="p-10 flex flex-col items-center gap-5 text-center">
            <div className="w-20 h-20 rounded-full bg-green-50 border-2 border-green-400 flex items-center justify-center">
              <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-gray-900">Application Sent! 🎉</h2>
              <p className="text-gray-500 text-sm mt-2 leading-relaxed">
                Thank you, <strong className="text-gray-800">{form.firstName}</strong>! Your application for{" "}
                <strong className="text-blue-600">{jobMeta.title}</strong> at{" "}
                <strong className="text-gray-800">{jobMeta.company}</strong> has been received.
              </p>
            </div>
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-700 text-left w-full">
              A confirmation email has been sent to <strong>{form.email}</strong>. The hiring team will review your application within <strong>5–7 business days</strong>.
            </div>
            <Button
              className="rounded-full bg-blue-600 hover:bg-blue-700 text-white px-8 font-semibold"
              onClick={() => { setSubmitted(false); setResumeFile(null); setForm({ firstName:"",lastName:"",email:"",phone:"",dob:"",gender:"",maritalStatus:"",address:"",city:"",state:"",pincode:"",currentDesignation:"",currentCompany:"",totalExp:"",currentSalary:"",noticePeriod:"",expectedSalary:"",highestQualification:"",institution:"",passYear:"",specialization:"",skills:"",linkedin:"",portfolio:"",coverLetter:"",referral:"" }); }}
            >
              Apply for Another Job
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f5f8]" style={{ fontFamily: "'Nunito', 'Segoe UI', sans-serif" }}>
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">J</div>
            <span className="font-extrabold text-gray-800 text-lg tracking-tight">JobPortal</span>
          </div>
          <span className="text-xs text-gray-400 hidden sm:block">Applying for: <span className="text-blue-600 font-semibold">{jobMeta.title}</span></span>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-5">

        {/* Job Summary Banner */}
        <Card className="bg-white border border-gray-200 rounded-2xl shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-red-50 border border-gray-200 flex items-center justify-center text-2xl font-extrabold text-red-600 flex-shrink-0">
                {jobMeta.logo}
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-extrabold text-gray-900">{jobMeta.title}</h2>
                <p className="text-sm text-gray-500">{jobMeta.company} &bull; {jobMeta.location}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge className="bg-blue-50 text-blue-700 border-0 text-xs font-semibold rounded-full">{jobMeta.type}</Badge>
                  <Badge className="bg-green-50 text-green-700 border-0 text-xs font-semibold rounded-full">{jobMeta.salary}</Badge>
                </div>
              </div>
              <div className="hidden sm:flex flex-col items-end text-xs text-gray-400">
                <span>Step 1 of 1</span>
                <span className="font-semibold text-blue-600 mt-0.5">Full Application</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Validation Error Summary */}
        {Object.keys(errors).length > 0 && (
          <Alert className="bg-red-50 border border-red-200 rounded-xl">
            <AlertDescription className="text-red-700 text-sm font-medium">
              ⚠️ Please fix {Object.keys(errors).length} error(s) below before submitting.
            </AlertDescription>
          </Alert>
        )}

        {/* ── SECTION 1: Personal Information ── */}
        <Card className="bg-white border border-gray-200 rounded-2xl shadow-sm">
          <CardContent className="p-6">
            <SectionHeading icon="👤" title="Personal Information" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-semibold text-gray-600 mb-1 block">First Name <span className="text-red-500">*</span></Label>
                <Input value={form.firstName} onChange={e => set("firstName", e.target.value)} placeholder="Rahul" className="rounded-lg border-gray-300 text-sm" />
                <FieldError msg={errors.firstName} />
              </div>
              <div>
                <Label className="text-xs font-semibold text-gray-600 mb-1 block">Last Name <span className="text-red-500">*</span></Label>
                <Input value={form.lastName} onChange={e => set("lastName", e.target.value)} placeholder="Sharma" className="rounded-lg border-gray-300 text-sm" />
                <FieldError msg={errors.lastName} />
              </div>
              <div>
                <Label className="text-xs font-semibold text-gray-600 mb-1 block">Email Address <span className="text-red-500">*</span></Label>
                <Input type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="rahul@example.com" className="rounded-lg border-gray-300 text-sm" />
                <FieldError msg={errors.email} />
              </div>
              <div>
                <Label className="text-xs font-semibold text-gray-600 mb-1 block">Mobile Number <span className="text-red-500">*</span></Label>
                <div className="flex gap-2">
                  <span className="flex items-center px-3 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-600 whitespace-nowrap">🇮🇳 +91</span>
                  <Input type="tel" value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="9876543210" className="rounded-lg border-gray-300 text-sm" />
                </div>
                <FieldError msg={errors.phone} />
              </div>
              <div>
                <Label className="text-xs font-semibold text-gray-600 mb-1 block">Date of Birth</Label>
                <Input type="date" value={form.dob} onChange={e => set("dob", e.target.value)} className="rounded-lg border-gray-300 text-sm text-gray-700" />
              </div>
              <div>
                <Label className="text-xs font-semibold text-gray-600 mb-1 block">Gender</Label>
                <Select onValueChange={v => set("gender", v)}>
                  <SelectTrigger className="rounded-lg border-gray-300 text-sm text-gray-600">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="prefer-not">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs font-semibold text-gray-600 mb-1 block">Marital Status</Label>
                <Select onValueChange={v => set("maritalStatus", v)}>
                  <SelectTrigger className="rounded-lg border-gray-300 text-sm text-gray-600">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">Single</SelectItem>
                    <SelectItem value="married">Married</SelectItem>
                    <SelectItem value="divorced">Divorced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator className="my-5 bg-gray-100" />

            {/* Address */}
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Current Address</p>
            <div className="space-y-3">
              <div>
                <Label className="text-xs font-semibold text-gray-600 mb-1 block">Street Address</Label>
                <Input value={form.address} onChange={e => set("address", e.target.value)} placeholder="12, Nehru Nagar, Near Civil Hospital" className="rounded-lg border-gray-300 text-sm" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <Label className="text-xs font-semibold text-gray-600 mb-1 block">City</Label>
                  <Input value={form.city} onChange={e => set("city", e.target.value)} placeholder="Ahmedabad" className="rounded-lg border-gray-300 text-sm" />
                </div>
                <div>
                  <Label className="text-xs font-semibold text-gray-600 mb-1 block">State</Label>
                  <Select onValueChange={v => set("state", v)}>
                    <SelectTrigger className="rounded-lg border-gray-300 text-sm text-gray-600">
                      <SelectValue placeholder="State" />
                    </SelectTrigger>
                    <SelectContent>
                      {["Gujarat","Maharashtra","Rajasthan","Delhi","Karnataka","Tamil Nadu","Uttar Pradesh","West Bengal","Madhya Pradesh","Punjab","Haryana","Telangana","Kerala","Bihar","Odisha"].map(s => (
                        <SelectItem key={s} value={s.toLowerCase()}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs font-semibold text-gray-600 mb-1 block">PIN Code</Label>
                  <Input type="text" maxLength={6} value={form.pincode} onChange={e => set("pincode", e.target.value)} placeholder="380001" className="rounded-lg border-gray-300 text-sm" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ── SECTION 2: Professional Details ── */}
        <Card className="bg-white border border-gray-200 rounded-2xl shadow-sm">
          <CardContent className="p-6">
            <SectionHeading icon="💼" title="Professional Details" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-semibold text-gray-600 mb-1 block">Current Designation</Label>
                <Input value={form.currentDesignation} onChange={e => set("currentDesignation", e.target.value)} placeholder="Junior Engineer" className="rounded-lg border-gray-300 text-sm" />
              </div>
              <div>
                <Label className="text-xs font-semibold text-gray-600 mb-1 block">Current Company</Label>
                <Input value={form.currentCompany} onChange={e => set("currentCompany", e.target.value)} placeholder="ABC Corp" className="rounded-lg border-gray-300 text-sm" />
              </div>
              <div>
                <Label className="text-xs font-semibold text-gray-600 mb-1 block">Total Experience <span className="text-red-500">*</span></Label>
                <Select onValueChange={v => set("totalExp", v)}>
                  <SelectTrigger className="rounded-lg border-gray-300 text-sm text-gray-600">
                    <SelectValue placeholder="Select experience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fresher">Fresher (0 years)</SelectItem>
                    <SelectItem value="0-1">Less than 1 year</SelectItem>
                    <SelectItem value="1-2">1 – 2 years</SelectItem>
                    <SelectItem value="2-4">2 – 4 years</SelectItem>
                    <SelectItem value="4-6">4 – 6 years</SelectItem>
                    <SelectItem value="6-10">6 – 10 years</SelectItem>
                    <SelectItem value="10+">10+ years</SelectItem>
                  </SelectContent>
                </Select>
                <FieldError msg={errors.totalExp} />
              </div>
              <div>
                <Label className="text-xs font-semibold text-gray-600 mb-1 block">Current Salary (LPA)</Label>
                <Input value={form.currentSalary} onChange={e => set("currentSalary", e.target.value)} placeholder="e.g. 2.4" className="rounded-lg border-gray-300 text-sm" />
              </div>
              <div>
                <Label className="text-xs font-semibold text-gray-600 mb-1 block">Expected Salary (LPA)</Label>
                <Input value={form.expectedSalary} onChange={e => set("expectedSalary", e.target.value)} placeholder="e.g. 3.0" className="rounded-lg border-gray-300 text-sm" />
              </div>
              <div>
                <Label className="text-xs font-semibold text-gray-600 mb-1 block">Notice Period</Label>
                <Select onValueChange={v => set("noticePeriod", v)}>
                  <SelectTrigger className="rounded-lg border-gray-300 text-sm text-gray-600">
                    <SelectValue placeholder="Select notice period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediate">Immediate</SelectItem>
                    <SelectItem value="15">15 Days</SelectItem>
                    <SelectItem value="30">30 Days</SelectItem>
                    <SelectItem value="60">60 Days</SelectItem>
                    <SelectItem value="90">90 Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="sm:col-span-2">
                <Label className="text-xs font-semibold text-gray-600 mb-1 block">Key Skills <span className="text-gray-400">(comma separated)</span></Label>
                <Input value={form.skills} onChange={e => set("skills", e.target.value)} placeholder="Service Engineering, Field Service, Technical Support, English" className="rounded-lg border-gray-300 text-sm" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ── SECTION 3: Education ── */}
        <Card className="bg-white border border-gray-200 rounded-2xl shadow-sm">
          <CardContent className="p-6">
            <SectionHeading icon="🎓" title="Education" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-semibold text-gray-600 mb-1 block">Highest Qualification <span className="text-red-500">*</span></Label>
                <Select onValueChange={v => set("highestQualification", v)}>
                  <SelectTrigger className="rounded-lg border-gray-300 text-sm text-gray-600">
                    <SelectValue placeholder="Select qualification" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="diploma">Diploma</SelectItem>
                    <SelectItem value="btech">B.Tech / B.E.</SelectItem>
                    <SelectItem value="bsc">B.Sc.</SelectItem>
                    <SelectItem value="bcom">B.Com</SelectItem>
                    <SelectItem value="ba">B.A.</selectItem>
                    <SelectItem value="mtech">M.Tech / M.E.</SelectItem>
                    <SelectItem value="msc">M.Sc.</SelectItem>
                    <SelectItem value="mba">MBA</SelectItem>
                    <SelectItem value="phd">PhD</SelectItem>
                    <SelectItem value="12th">12th / HSC</SelectItem>
                    <SelectItem value="10th">10th / SSC</SelectItem>
                  </SelectContent>
                </Select>
                <FieldError msg={errors.highestQualification} />
              </div>
              <div>
                <Label className="text-xs font-semibold text-gray-600 mb-1 block">Specialization / Stream</Label>
                <Input value={form.specialization} onChange={e => set("specialization", e.target.value)} placeholder="Mechanical Engineering" className="rounded-lg border-gray-300 text-sm" />
              </div>
              <div>
                <Label className="text-xs font-semibold text-gray-600 mb-1 block">Institution / University</Label>
                <Input value={form.institution} onChange={e => set("institution", e.target.value)} placeholder="Gujarat Technological University" className="rounded-lg border-gray-300 text-sm" />
              </div>
              <div>
                <Label className="text-xs font-semibold text-gray-600 mb-1 block">Year of Passing</Label>
                <Input type="number" min="1990" max="2030" value={form.passYear} onChange={e => set("passYear", e.target.value)} placeholder="2023" className="rounded-lg border-gray-300 text-sm" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ── SECTION 4: Resume Upload ── */}
        <Card className="bg-white border border-gray-200 rounded-2xl shadow-sm">
          <CardContent className="p-6">
            <SectionHeading icon="📄" title="Resume Upload" />

            <div
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all select-none
                ${dragOver ? "border-blue-500 bg-blue-50" : resumeFile ? "border-green-400 bg-green-50" : "border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50/40"}
              `}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={e => handleFile(e.target.files[0])}
              />

              {resumeFile ? (
                <>
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-green-700">{resumeFile.name}</p>
                    <p className="text-xs text-gray-400 mt-1">{(resumeFile.size / 1024).toFixed(1)} KB · PDF</p>
                  </div>
                  <button
                    type="button"
                    onClick={e => { e.stopPropagation(); setResumeFile(null); }}
                    className="text-xs text-red-500 hover:text-red-700 underline mt-1"
                  >
                    Remove & re-upload
                  </button>
                </>
              ) : (
                <>
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    </svg>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-gray-700">
                      {dragOver ? "Drop your PDF here" : "Click or drag & drop your resume"}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">Only <strong>.PDF</strong> files are accepted &bull; Max 5MB</p>
                  </div>
                  <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-full px-3 py-1 text-xs text-gray-500 shadow-sm mt-1">
                    <svg className="w-3.5 h-3.5 text-red-500" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm0 0v6h6M10 17l-2-2m0 0l2-2m-2 2h8"/>
                    </svg>
                    PDF only
                  </div>
                </>
              )}
            </div>

            {resumeError && (
              <div className="flex items-center gap-2 mt-2 text-red-600 text-xs bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
                {resumeError}
              </div>
            )}
            {errors.resume && !resumeFile && <FieldError msg={errors.resume} />}
          </CardContent>
        </Card>

        {/* ── SECTION 5: Links & Extra ── */}
        <Card className="bg-white border border-gray-200 rounded-2xl shadow-sm">
          <CardContent className="p-6">
            <SectionHeading icon="🔗" title="Links & Additional Info" />
            <div className="space-y-4">
              <div>
                <Label className="text-xs font-semibold text-gray-600 mb-1 block">LinkedIn Profile URL</Label>
                <div className="flex items-center gap-2">
                  <span className="text-blue-600">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/>
                    </svg>
                  </span>
                  <Input value={form.linkedin} onChange={e => set("linkedin", e.target.value)} placeholder="https://linkedin.com/in/rahulsharma" className="rounded-lg border-gray-300 text-sm" />
                </div>
              </div>
              <div>
                <Label className="text-xs font-semibold text-gray-600 mb-1 block">Portfolio / GitHub / Website</Label>
                <Input value={form.portfolio} onChange={e => set("portfolio", e.target.value)} placeholder="https://rahulsharma.dev" className="rounded-lg border-gray-300 text-sm" />
              </div>
              <div>
                <Label className="text-xs font-semibold text-gray-600 mb-1 block">How did you hear about us?</Label>
                <Select onValueChange={v => set("referral", v)}>
                  <SelectTrigger className="rounded-lg border-gray-300 text-sm text-gray-600">
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="naukri">Naukri.com</SelectItem>
                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                    <SelectItem value="indeed">Indeed</SelectItem>
                    <SelectItem value="referral">Employee Referral</SelectItem>
                    <SelectItem value="company-site">Company Website</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ── SECTION 6: Cover Letter ── */}
        <Card className="bg-white border border-gray-200 rounded-2xl shadow-sm">
          <CardContent className="p-6">
            <SectionHeading icon="✉️" title="Cover Letter" />
            <Textarea
              value={form.coverLetter}
              onChange={e => set("coverLetter", e.target.value)}
              placeholder="Dear Hiring Manager,&#10;&#10;I am excited to apply for the Service Engineer position at Unitech Technocrats. With my background in..."
              rows={7}
              className="rounded-lg border-gray-300 text-sm resize-none"
            />
            <div className="flex justify-between mt-1.5">
              <FieldError msg={errors.coverLetter} />
              <p className={`text-xs ml-auto ${form.coverLetter.length > 2000 ? "text-red-500" : "text-gray-400"}`}>
                {form.coverLetter.length}/2000
              </p>
            </div>
          </CardContent>
        </Card>

        {/* ── Submit ── */}
        <Card className="bg-white border border-gray-200 rounded-2xl shadow-sm">
          <CardContent className="p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <p className="text-xs text-gray-400 leading-relaxed">
                By submitting, you agree to our{" "}
                <span className="text-blue-600 underline cursor-pointer">Terms of Service</span> and{" "}
                <span className="text-blue-600 underline cursor-pointer">Privacy Policy</span>.
                Your data will be shared with {jobMeta.company} for review.
              </p>
              <Button
                onClick={handleSubmit}
                className="rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-2.5 text-sm whitespace-nowrap shadow-md hover:shadow-lg transition-all"
              >
                Submit Application →
              </Button>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-gray-400 pb-4">
          Need help? <span className="text-blue-600 underline cursor-pointer">Contact support</span>
        </p>
      </div>
    </div>
  );
}
