import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

// shadcn components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

// ─── Constants ────────────────────────────────────────────────────────────────
const STATES = [
  "Gujarat","Maharashtra","Rajasthan","Delhi","Karnataka",
  "Tamil Nadu","Uttar Pradesh","West Bengal","Punjab","Haryana",
  "Telangana","Kerala","Madhya Pradesh","Bihar","Odisha",
];

// ─── Yup Schemas per step ─────────────────────────────────────────────────────
const step1Schema = Yup.object({
  firstName: Yup.string().trim().required("First name is required"),
  lastName:  Yup.string().trim().required("Last name is required"),
  email:     Yup.string().trim().email("Enter a valid email address").required("Email is required"),
  phone:     Yup.string().trim()
    .matches(/^\d{10}$/, "Enter a valid 10-digit mobile number")
    .required("Phone number is required"),
  password:  Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords do not match")
    .required("Please confirm your password"),
  terms: Yup.boolean().oneOf([true], "You must agree to the Terms of Service"),
});

const step2Schema = Yup.object({
  city:  Yup.string().trim().required("City is required"),
  state: Yup.string().required("State is required"),
});

const step3Schema = Yup.object({
  experience:   Yup.string().required("Please select your experience"),
  qualification: Yup.string().required("Please select your qualification"),
});

// ─── Small helpers ────────────────────────────────────────────────────────────
function FieldError({ touched, error }) {
  if (!touched || !error) return null;
  return (
    <p className="flex items-center gap-1 text-xs text-red-500 mt-1">
      <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10"/><path strokeLinecap="round" d="M12 8v4m0 4h.01"/>
      </svg>
      {error}
    </p>
  );
}

function SectionLabel({ children }) {
  return (
    <div className="flex items-center gap-3 my-5">
      <div className="flex-1 h-px bg-slate-100" />
      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">{children}</span>
      <div className="flex-1 h-px bg-slate-100" />
    </div>
  );
}

// ─── Password strength ────────────────────────────────────────────────────────
function getPwStrength(pw) {
  if (!pw) return null;
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const map = [
    { label: "Too short", color: "bg-red-400",    text: "text-red-500" },
    { label: "Weak",      color: "bg-red-400",    text: "text-red-500" },
    { label: "Fair",      color: "bg-orange-400", text: "text-orange-500" },
    { label: "Good",      color: "bg-yellow-400", text: "text-yellow-600" },
    { label: "Strong",    color: "bg-green-400",  text: "text-green-600" },
  ];
  return { score, ...map[score] };
}

function PasswordStrength({ password }) {
  const s = getPwStrength(password);
  if (!s) return null;
  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1">
        {[1,2,3,4].map(i => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= s.score ? s.color : "bg-slate-200"}`} />
        ))}
      </div>
      <span className={`text-[11px] font-bold ${s.text}`}>{s.label}</span>
    </div>
  );
}

// ─── Step Indicator ───────────────────────────────────────────────────────────
function StepIndicator({ current }) {
  const steps = ["Account", "Profile", "Career"];
  return (
    <div className="flex items-center justify-center gap-0">
      {steps.map((label, i) => {
        const n = i + 1;
        const isDone = n < current;
        const isActive = n === current;
        return (
          <div key={n} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black border-2 transition-all duration-300
                ${isDone   ? "bg-green-500 border-green-500 text-white shadow-md"
                : isActive ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200"
                           : "bg-white border-slate-200 text-slate-400"}`}>
                {isDone ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5"/>
                  </svg>
                ) : n}
              </div>
              <span className={`text-[10px] font-black mt-1 uppercase tracking-wide
                ${isDone ? "text-green-500" : isActive ? "text-blue-600" : "text-slate-400"}`}>
                {label}
              </span>
            </div>
            {i < 2 && (
              <div className={`w-12 h-0.5 mb-4 mx-1 transition-all duration-500 ${n < current ? "bg-green-400" : "bg-slate-200"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Skill Tag Input ──────────────────────────────────────────────────────────
function SkillTagInput({ skills, setSkills, touched, error }) {
  const [input, setInput] = useState("");
  const add = (val) => {
    const s = val.trim().replace(/,$/, "");
    if (s && !skills.includes(s)) setSkills([...skills, s]);
    setInput("");
  };
  return (
    <div>
      <Input
        value={input}
        onChange={e => { if (e.target.value.endsWith(",")) { add(e.target.value); } else setInput(e.target.value); }}
        onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); add(input); } }}
        placeholder="Type a skill and press Enter or comma..."
        className={`rounded-lg text-sm ${touched && error ? "border-red-400 bg-red-50" : "border-slate-200"}`}
      />
      <p className="text-[11px] text-slate-400 mt-1">Press <strong>Enter</strong> or <strong>,</strong> to add a skill tag</p>
      {skills.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {skills.map((s, i) => (
            <span key={i} className="inline-flex items-center gap-1.5 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold rounded-full px-3 py-1">
              {s}
              <button type="button" onClick={() => setSkills(skills.filter((_, j) => j !== i))}
                className="text-blue-400 hover:text-blue-700 font-black text-sm leading-none">×</button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// STEP 1 — Account Details
// ═══════════════════════════════════════════════════════════════════════════════
function Step1({ onNext }) {
  const [showPw, setShowPw] = useState(false);
  const [showCpw, setShowCpw] = useState(false);

  const formik = useFormik({
    initialValues: { firstName:"", lastName:"", email:"", phone:"", password:"", confirmPassword:"", terms: false },
    validationSchema: step1Schema,
    validateOnBlur: true,
    validateOnChange: false,
    onSubmit: (values) => onNext(values),
  });

  const inputCls = (name) =>
    `rounded-lg text-sm transition-all ${formik.touched[name] && formik.errors[name] ? "border-red-400 bg-red-50 focus-visible:ring-red-300" : "border-slate-200"}`;

  return (
    <form onSubmit={formik.handleSubmit} noValidate>
      <Card className="bg-white border border-slate-200 rounded-2xl shadow-sm">
        <CardHeader className="pb-2 pt-6 px-6 border-b border-slate-50">
          <CardTitle className="text-base font-black text-slate-900">👤 Account Details</CardTitle>
          <CardDescription className="text-xs text-slate-400">Set up your login credentials</CardDescription>
        </CardHeader>
        <CardContent className="px-6 pb-7 pt-5 space-y-4">

          {/* Social buttons */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>, label: "Google" },
              { icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#0a66c2"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>, label: "LinkedIn" },
            ].map(({ icon, label }) => (
              <Button key={label} type="button" variant="outline" className="rounded-xl border-slate-200 text-slate-600 text-xs font-bold gap-2 h-10 hover:bg-slate-50">
                {icon} Continue with {label}
              </Button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-100" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">or register with email</span>
            <div className="flex-1 h-px bg-slate-100" />
          </div>

          {/* Names */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-[11px] font-black text-slate-500 uppercase tracking-wide mb-1.5 block">
                First Name <span className="text-red-500">*</span>
              </Label>
              <Input id="firstName" placeholder="Rahul" {...formik.getFieldProps("firstName")} className={inputCls("firstName")} />
              <FieldError touched={formik.touched.firstName} error={formik.errors.firstName} />
            </div>
            <div>
              <Label className="text-[11px] font-black text-slate-500 uppercase tracking-wide mb-1.5 block">
                Last Name <span className="text-red-500">*</span>
              </Label>
              <Input id="lastName" placeholder="Sharma" {...formik.getFieldProps("lastName")} className={inputCls("lastName")} />
              <FieldError touched={formik.touched.lastName} error={formik.errors.lastName} />
            </div>
          </div>

          {/* Email */}
          <div>
            <Label className="text-[11px] font-black text-slate-500 uppercase tracking-wide mb-1.5 block">
              Email Address <span className="text-red-500">*</span>
            </Label>
            <Input type="email" placeholder="rahul@example.com" {...formik.getFieldProps("email")} className={inputCls("email")} />
            <FieldError touched={formik.touched.email} error={formik.errors.email} />
          </div>

          {/* Phone */}
          <div>
            <Label className="text-[11px] font-black text-slate-500 uppercase tracking-wide mb-1.5 block">
              Mobile Number <span className="text-red-500">*</span>
            </Label>
            <div className="flex gap-0">
              <span className="flex items-center px-3 bg-slate-50 border border-r-0 border-slate-200 rounded-l-lg text-sm font-bold text-slate-500 whitespace-nowrap">🇮🇳 +91</span>
              <Input type="tel" placeholder="9876543210" maxLength={10} {...formik.getFieldProps("phone")}
                className={`rounded-l-none ${inputCls("phone")}`} />
            </div>
            <FieldError touched={formik.touched.phone} error={formik.errors.phone} />
          </div>

          {/* Password */}
          <div>
            <Label className="text-[11px] font-black text-slate-500 uppercase tracking-wide mb-1.5 block">
              Password <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                type={showPw ? "text" : "password"}
                placeholder="Min. 8 characters"
                {...formik.getFieldProps("password")}
                className={`pr-10 ${inputCls("password")}`}
              />
              <button type="button" onClick={() => setShowPw(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                {showPw
                  ? <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"/></svg>
                  : <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"/><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                }
              </button>
            </div>
            <PasswordStrength password={formik.values.password} />
            <FieldError touched={formik.touched.password} error={formik.errors.password} />
          </div>

          {/* Confirm Password */}
          <div>
            <Label className="text-[11px] font-black text-slate-500 uppercase tracking-wide mb-1.5 block">
              Confirm Password <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                type={showCpw ? "text" : "password"}
                placeholder="Re-enter your password"
                {...formik.getFieldProps("confirmPassword")}
                className={`pr-10 ${inputCls("confirmPassword")}`}
              />
              <button type="button" onClick={() => setShowCpw(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                {showCpw
                  ? <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"/></svg>
                  : <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"/><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                }
              </button>
            </div>
            <FieldError touched={formik.touched.confirmPassword} error={formik.errors.confirmPassword} />
          </div>

          {/* Terms */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-start gap-3">
              <Checkbox
                id="terms"
                checked={formik.values.terms}
                onCheckedChange={(v) => formik.setFieldValue("terms", v)}
                className="mt-0.5 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
              />
              <label htmlFor="terms" className="text-sm text-slate-500 leading-relaxed cursor-pointer">
                I agree to the <span className="text-blue-600 font-bold underline cursor-pointer">Terms of Service</span> and{" "}
                <span className="text-blue-600 font-bold underline cursor-pointer">Privacy Policy</span> of JobPortal.
              </label>
            </div>
            <FieldError touched={formik.touched.terms} error={formik.errors.terms} />
          </div>

          <Button type="submit" className="w-full rounded-full bg-blue-600 hover:bg-blue-700 text-white font-black h-11 shadow-md shadow-blue-200 transition-all">
            Continue →
          </Button>

          <p className="text-center text-sm text-slate-400">
            Already have an account?{" "}
            <span className="text-blue-600 font-bold underline cursor-pointer">Sign in</span>
          </p>
        </CardContent>
      </Card>
    </form>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// STEP 2 — Personal Profile
// ═══════════════════════════════════════════════════════════════════════════════
function Step2({ onNext, onBack }) {
  const formik = useFormik({
    initialValues: { dob:"", gender:"", address:"", city:"", state:"", pincode:"", linkedin:"", portfolio:"" },
    validationSchema: step2Schema,
    validateOnBlur: true,
    validateOnChange: false,
    onSubmit: (values) => onNext(values),
  });

  const inputCls = (name) =>
    `rounded-lg text-sm ${formik.touched[name] && formik.errors[name] ? "border-red-400 bg-red-50" : "border-slate-200"}`;

  return (
    <form onSubmit={formik.handleSubmit} noValidate>
      <Card className="bg-white border border-slate-200 rounded-2xl shadow-sm">
        <CardHeader className="pb-2 pt-6 px-6 border-b border-slate-50">
          <CardTitle className="text-base font-black text-slate-900">🪪 Personal Profile</CardTitle>
          <CardDescription className="text-xs text-slate-400">Tell employers a bit about yourself</CardDescription>
        </CardHeader>
        <CardContent className="px-6 pb-7 pt-5 space-y-4">

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-[11px] font-black text-slate-500 uppercase tracking-wide mb-1.5 block">Date of Birth</Label>
              <Input type="date" {...formik.getFieldProps("dob")} className="rounded-lg text-sm border-slate-200 text-slate-700" />
            </div>
            <div>
              <Label className="text-[11px] font-black text-slate-500 uppercase tracking-wide mb-1.5 block">Gender</Label>
              <Select onValueChange={v => formik.setFieldValue("gender", v)}>
                <SelectTrigger className="rounded-lg text-sm border-slate-200 text-slate-500">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  {["Male","Female","Other","Prefer not to say"].map(g => (
                    <SelectItem key={g} value={g.toLowerCase()}>{g}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <SectionLabel>📍 Address</SectionLabel>

          <div>
            <Label className="text-[11px] font-black text-slate-500 uppercase tracking-wide mb-1.5 block">Street Address</Label>
            <Input placeholder="12, Nehru Nagar, Near Civil Hospital" {...formik.getFieldProps("address")} className="rounded-lg text-sm border-slate-200" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-[11px] font-black text-slate-500 uppercase tracking-wide mb-1.5 block">
                City <span className="text-red-500">*</span>
              </Label>
              <Input placeholder="Ahmedabad" {...formik.getFieldProps("city")} className={inputCls("city")} />
              <FieldError touched={formik.touched.city} error={formik.errors.city} />
            </div>
            <div>
              <Label className="text-[11px] font-black text-slate-500 uppercase tracking-wide mb-1.5 block">
                State <span className="text-red-500">*</span>
              </Label>
              <Select onValueChange={v => formik.setFieldValue("state", v)}>
                <SelectTrigger className={`rounded-lg text-sm ${formik.touched.state && formik.errors.state ? "border-red-400 bg-red-50" : "border-slate-200"} text-slate-500`}>
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  {STATES.map(s => <SelectItem key={s} value={s.toLowerCase()}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
              <FieldError touched={formik.touched.state} error={formik.errors.state} />
            </div>
          </div>

          <div>
            <Label className="text-[11px] font-black text-slate-500 uppercase tracking-wide mb-1.5 block">PIN Code</Label>
            <Input placeholder="380001" maxLength={6} {...formik.getFieldProps("pincode")} className="rounded-lg text-sm border-slate-200" />
          </div>

          <SectionLabel>🔗 Social Links</SectionLabel>

          <div>
            <Label className="text-[11px] font-black text-slate-500 uppercase tracking-wide mb-1.5 block">LinkedIn URL</Label>
            <Input type="url" placeholder="https://linkedin.com/in/rahulsharma" {...formik.getFieldProps("linkedin")} className="rounded-lg text-sm border-slate-200" />
          </div>

          <div>
            <Label className="text-[11px] font-black text-slate-500 uppercase tracking-wide mb-1.5 block">Portfolio / GitHub</Label>
            <Input type="url" placeholder="https://github.com/rahulsharma" {...formik.getFieldProps("portfolio")} className="rounded-lg text-sm border-slate-200" />
          </div>

          <div className="flex justify-between gap-3 pt-1">
            <Button type="button" variant="outline" onClick={onBack} className="rounded-full border-slate-200 text-slate-500 font-bold px-6">← Back</Button>
            <Button type="submit" className="rounded-full bg-blue-600 hover:bg-blue-700 text-white font-black px-8 shadow-md shadow-blue-200">Next →</Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// STEP 3 — Career Details
// ═══════════════════════════════════════════════════════════════════════════════
function Step3({ onBack, onSubmit }) {
  const [skills, setSkills] = useState([]);
  const [skillsTouched, setSkillsTouched] = useState(false);

  const formik = useFormik({
    initialValues: { experience:"", noticePeriod:"", currentSalary:"", expectedSalary:"", qualification:"", specialization:"", institution:"", referral:"" },
    validationSchema: step3Schema,
    validateOnBlur: true,
    validateOnChange: false,
    onSubmit: (values) => {
      setSkillsTouched(true);
      if (skills.length === 0) return;
      onSubmit({ ...values, skills });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSkillsTouched(true);
    formik.handleSubmit(e);
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Card className="bg-white border border-slate-200 rounded-2xl shadow-sm">
        <CardHeader className="pb-2 pt-6 px-6 border-b border-slate-50">
          <CardTitle className="text-base font-black text-slate-900">💼 Career Details</CardTitle>
          <CardDescription className="text-xs text-slate-400">Help us match you to the right jobs</CardDescription>
        </CardHeader>
        <CardContent className="px-6 pb-7 pt-5 space-y-4">

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-[11px] font-black text-slate-500 uppercase tracking-wide mb-1.5 block">
                Total Experience <span className="text-red-500">*</span>
              </Label>
              <Select onValueChange={v => formik.setFieldValue("experience", v)} onOpenChange={() => formik.setFieldTouched("experience", true)}>
                <SelectTrigger className={`rounded-lg text-sm ${formik.touched.experience && formik.errors.experience ? "border-red-400 bg-red-50" : "border-slate-200"} text-slate-500`}>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {["Fresher (0 years)","Less than 1 year","1 – 2 years","2 – 4 years","4 – 6 years","6 – 10 years","10+ years"].map(e => (
                    <SelectItem key={e} value={e}>{e}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError touched={formik.touched.experience} error={formik.errors.experience} />
            </div>
            <div>
              <Label className="text-[11px] font-black text-slate-500 uppercase tracking-wide mb-1.5 block">Notice Period</Label>
              <Select onValueChange={v => formik.setFieldValue("noticePeriod", v)}>
                <SelectTrigger className="rounded-lg text-sm border-slate-200 text-slate-500">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {["Immediate","15 Days","30 Days","60 Days","90 Days"].map(n => (
                    <SelectItem key={n} value={n}>{n}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-[11px] font-black text-slate-500 uppercase tracking-wide mb-1.5 block">Current Salary (LPA)</Label>
              <Input placeholder="e.g. 3.5" {...formik.getFieldProps("currentSalary")} className="rounded-lg text-sm border-slate-200" />
            </div>
            <div>
              <Label className="text-[11px] font-black text-slate-500 uppercase tracking-wide mb-1.5 block">Expected Salary (LPA)</Label>
              <Input placeholder="e.g. 5.0" {...formik.getFieldProps("expectedSalary")} className="rounded-lg text-sm border-slate-200" />
            </div>
          </div>

          <SectionLabel>🎓 Education</SectionLabel>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-[11px] font-black text-slate-500 uppercase tracking-wide mb-1.5 block">
                Highest Qualification <span className="text-red-500">*</span>
              </Label>
              <Select onValueChange={v => formik.setFieldValue("qualification", v)} onOpenChange={() => formik.setFieldTouched("qualification", true)}>
                <SelectTrigger className={`rounded-lg text-sm ${formik.touched.qualification && formik.errors.qualification ? "border-red-400 bg-red-50" : "border-slate-200"} text-slate-500`}>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {["10th / SSC","12th / HSC","Diploma","B.Tech / B.E.","B.Sc.","B.Com","B.A.","M.Tech / M.E.","M.Sc.","MBA","PhD"].map(q => (
                    <SelectItem key={q} value={q}>{q}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError touched={formik.touched.qualification} error={formik.errors.qualification} />
            </div>
            <div>
              <Label className="text-[11px] font-black text-slate-500 uppercase tracking-wide mb-1.5 block">Specialization</Label>
              <Input placeholder="e.g. Mechanical Engg." {...formik.getFieldProps("specialization")} className="rounded-lg text-sm border-slate-200" />
            </div>
          </div>

          <div>
            <Label className="text-[11px] font-black text-slate-500 uppercase tracking-wide mb-1.5 block">Institution / University</Label>
            <Input placeholder="e.g. Gujarat Technological University" {...formik.getFieldProps("institution")} className="rounded-lg text-sm border-slate-200" />
          </div>

          <SectionLabel>🛠️ Skills</SectionLabel>

          <div>
            <Label className="text-[11px] font-black text-slate-500 uppercase tracking-wide mb-1.5 block">
              Key Skills <span className="text-red-500">*</span>
            </Label>
            <SkillTagInput
              skills={skills}
              setSkills={setSkills}
              touched={skillsTouched}
              error={skills.length === 0 ? "Add at least one skill" : null}
            />
            {skillsTouched && skills.length === 0 && (
              <p className="flex items-center gap-1 text-xs text-red-500 mt-1">
                <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10"/><path strokeLinecap="round" d="M12 8v4m0 4h.01"/>
                </svg>
                Add at least one skill
              </p>
            )}
          </div>

          <div>
            <Label className="text-[11px] font-black text-slate-500 uppercase tracking-wide mb-1.5 block">How did you hear about us?</Label>
            <Select onValueChange={v => formik.setFieldValue("referral", v)}>
              <SelectTrigger className="rounded-lg text-sm border-slate-200 text-slate-500">
                <SelectValue placeholder="Select source" />
              </SelectTrigger>
              <SelectContent>
                {["Naukri.com","LinkedIn","Indeed","Employee Referral","Company Website","Other"].map(r => (
                  <SelectItem key={r} value={r}>{r}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-between gap-3 pt-1">
            <Button type="button" variant="outline" onClick={onBack} className="rounded-full border-slate-200 text-slate-500 font-bold px-6">← Back</Button>
            <Button type="submit" disabled={formik.isSubmitting}
              className="rounded-full bg-blue-600 hover:bg-blue-700 text-white font-black px-8 shadow-md shadow-blue-200 gap-2">
              {formik.isSubmitting
                ? <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"/></svg> Creating...</>
                : "Create Account 🚀"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SUCCESS SCREEN
// ═══════════════════════════════════════════════════════════════════════════════
function SuccessScreen({ data, onReset }) {
  const rows = [
    { icon:"👤", label:"Name",         value:`${data.step1.firstName} ${data.step1.lastName}` },
    { icon:"✉️", label:"Email",        value: data.step1.email },
    { icon:"📱", label:"Phone",        value:`+91 ${data.step1.phone}` },
    { icon:"📍", label:"Location",     value:[data.step2.city, data.step2.state].filter(Boolean).map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(", ") || "—" },
    { icon:"💼", label:"Experience",   value: data.step3.experience || "—" },
    { icon:"🎓", label:"Qualification",value: data.step3.qualification || "—" },
    { icon:"🛠️", label:"Skills",       value: data.step3.skills?.join(", ") || "—" },
  ];

  return (
    <Card className="bg-white border border-slate-200 rounded-2xl shadow-sm">
      <CardContent className="p-10 flex flex-col items-center gap-5 text-center">
        <div className="w-20 h-20 rounded-full bg-green-50 border-2 border-green-400 flex items-center justify-center">
          <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5"/>
          </svg>
        </div>

        <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-1.5 text-xs font-bold text-blue-600">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          Account Created Successfully
        </div>

        <div>
          <h2 className="text-2xl font-black text-slate-900">Welcome to JobPortal! 🎉</h2>
          <p className="text-sm text-slate-400 mt-1 leading-relaxed">
            Hi <strong className="text-slate-700">{data.step1.firstName}</strong>, your account is ready. Start exploring thousands of jobs today!
          </p>
        </div>

        <div className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-left space-y-3">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Your Account Summary</p>
          {rows.map(({ icon, label, value }) => (
            <div key={label} className="flex items-center gap-3 text-sm">
              <span className="text-base w-5">{icon}</span>
              <span className="text-slate-400 font-bold w-24 text-xs">{label}</span>
              <span className="text-slate-700 font-semibold">{value}</span>
            </div>
          ))}
        </div>

        <Button onClick={onReset} className="rounded-full bg-blue-600 hover:bg-blue-700 text-white font-black px-10 shadow-md shadow-blue-200">
          Go to Login →
        </Button>
      </CardContent>
    </Card>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ROOT COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ step1: null, step2: null, step3: null });
  const [submitted, setSubmitted] = useState(false);

  const handleStep1 = (values) => { setFormData(d => ({ ...d, step1: values })); setStep(2); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const handleStep2 = (values) => { setFormData(d => ({ ...d, step2: values })); setStep(3); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const handleStep3 = async (values) => {
    setFormData(d => ({ ...d, step3: values }));
    await new Promise(r => setTimeout(r, 1500));
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const reset = () => { setStep(1); setFormData({ step1: null, step2: null, step3: null }); setSubmitted(false); };

  return (
    <div className="min-h-screen bg-[#f3f5f8]" style={{ fontFamily: "'Nunito', 'Segoe UI', sans-serif" }}>
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black text-sm shadow-md shadow-blue-200">J</div>
            <span className="font-black text-slate-800 text-lg tracking-tight">JobPortal</span>
          </div>
          <Button variant="outline" size="sm" className="rounded-full border-blue-600 text-blue-600 hover:bg-blue-50 font-bold text-xs px-4">
            Sign In
          </Button>
        </div>
      </nav>

      <div className="max-w-lg mx-auto px-4 py-8 space-y-6">
        {/* Heading */}
        {!submitted && (
          <div className="text-center">
            <h1 className="text-2xl font-black text-slate-900">Create your account</h1>
            <p className="text-sm text-slate-400 mt-1">Find your dream job in minutes</p>
          </div>
        )}

        {/* Steps */}
        {!submitted && <StepIndicator current={step} />}

        {/* Panels */}
        {!submitted ? (
          <>
            {step === 1 && <Step1 onNext={handleStep1} />}
            {step === 2 && <Step2 onNext={handleStep2} onBack={() => setStep(1)} />}
            {step === 3 && <Step3 onBack={() => setStep(2)} onSubmit={handleStep3} />}
          </>
        ) : (
          <SuccessScreen data={formData} onReset={reset} />
        )}

        <p className="text-center text-xs text-slate-400 pb-4">© 2025 JobPortal · All rights reserved.</p>
      </div>
    </div>
  );
}
