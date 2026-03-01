import { useState } from "react";
import { useFormik } from "formik";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

// ─── Validation ───────────────────────────────────────────────
function validate(values) {
  const errors = {};

  if (!values.email.trim()) {
    errors.email = "Email is required.";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!values.password) {
    errors.password = "Password is required.";
  } else if (values.password.length < 6) {
    errors.password = "Password must be at least 6 characters.";
  }

  return errors;
}

// ─── Fake API call ────────────────────────────────────────────
// Simulates backend responses:
//   wrong@test.com  → "User not found"
//   right@test.com + wrongpass → "Incorrect password"
//   right@test.com + password123 → success
async function fakeLogin(email, password) {
  await new Promise((r) => setTimeout(r, 1200)); // simulate network delay

  if (email !== "right@test.com") {
    throw { type: "USER_NOT_FOUND", message: "No account found with this email address." };
  }
  if (password !== "password123") {
    throw { type: "WRONG_PASSWORD", message: "Incorrect password. Please try again." };
  }
  return { success: true, user: { name: "Rahul Sharma", email } };
}

// ─── Field Error ─────────────────────────────────────────────
function FieldError({ msg }) {
  if (!msg) return null;
  return (
    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
      <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" /><path strokeLinecap="round" d="M12 8v4m0 4h.01" />
      </svg>
      {msg}
    </p>
  );
}

// ─── Main Component ───────────────────────────────────────────
export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validate,
    onSubmit: async (values, { setSubmitting }) => {
      setServerError(null);
      try {
        const result = await fakeLogin(values.email, values.password);
        setUser(result.user);
        setLoggedIn(true);
      } catch (err) {
        setServerError(err);
      } finally {
        setSubmitting(false);
      }
    },
  });

  // ── Success Screen ──
  if (loggedIn) {
    return (
      <div className="min-h-screen bg-[#f3f5f8] flex items-center justify-center px-4"
        style={{ fontFamily: "'Nunito', 'Segoe UI', sans-serif" }}>
        <Card className="w-full max-w-sm bg-white border border-gray-200 rounded-2xl shadow-md text-center">
          <CardContent className="p-10 flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-green-50 border-2 border-green-400 flex items-center justify-center">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-gray-900">Welcome back!</h2>
              <p className="text-sm text-gray-500 mt-1">Logged in as <span className="font-semibold text-blue-600">{user?.email}</span></p>
            </div>
            <Button
              className="rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 text-sm"
              onClick={() => { setLoggedIn(false); setUser(null); formik.resetForm(); }}
            >
              Logout
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ── Login Form ──
  return (
    <div className="min-h-screen bg-[#f3f5f8] flex items-center justify-center px-4"
      style={{ fontFamily: "'Nunito', 'Segoe UI', sans-serif" }}>
      <div className="w-full max-w-sm space-y-5">

        {/* Logo */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-11 h-11 bg-blue-600 rounded-xl flex items-center justify-center text-white font-extrabold text-lg shadow-md">J</div>
          <h1 className="text-xl font-extrabold text-gray-800 tracking-tight">JobPortal</h1>
        </div>

        <Card className="bg-white border border-gray-200 rounded-2xl shadow-md">
          <CardHeader className="pb-2 pt-6 px-6">
            <CardTitle className="text-lg font-extrabold text-gray-900">Sign in to your account</CardTitle>
            <CardDescription className="text-sm text-gray-400">
              New here?{" "}
              <span className="text-blue-600 font-semibold underline cursor-pointer hover:text-blue-700">Create an account</span>
            </CardDescription>
          </CardHeader>

          <CardContent className="px-6 pb-7 pt-4">

            {/* ── Backend Error Alert ── */}
            {serverError && (
              <Alert className={`mb-5 rounded-xl border ${
                serverError.type === "USER_NOT_FOUND"
                  ? "bg-orange-50 border-orange-200"
                  : "bg-red-50 border-red-200"
              }`}>
                <AlertDescription className={`text-sm flex items-start gap-2 ${
                  serverError.type === "USER_NOT_FOUND" ? "text-orange-700" : "text-red-700"
                }`}>
                  <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                  </svg>
                  <span>
                    <strong className="block">{serverError.type === "USER_NOT_FOUND" ? "Account not found" : "Login failed"}</strong>
                    {serverError.message}
                    {serverError.type === "USER_NOT_FOUND" && (
                      <span className="block mt-1 text-orange-600">
                        <span className="underline cursor-pointer">Register here</span> to create a new account.
                      </span>
                    )}
                  </span>
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={formik.handleSubmit} noValidate className="space-y-4">

              {/* Email */}
              <div>
                <Label htmlFor="email" className="text-xs font-bold text-gray-600 mb-1 block">
                  Email Address
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  value={formik.values.email}
                  onChange={(e) => { formik.handleChange(e); setServerError(null); }}
                  onBlur={formik.handleBlur}
                  className={`rounded-lg text-sm transition-all ${
                    formik.touched.email && formik.errors.email
                      ? "border-red-400 focus-visible:ring-red-300 bg-red-50"
                      : "border-gray-300"
                  }`}
                />
                {formik.touched.email && <FieldError msg={formik.errors.email} />}
              </div>

              {/* Password */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <Label htmlFor="password" className="text-xs font-bold text-gray-600">
                    Password
                  </Label>
                  <span className="text-xs text-blue-600 underline cursor-pointer hover:text-blue-700">
                    Forgot password?
                  </span>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    value={formik.values.password}
                    onChange={(e) => { formik.handleChange(e); setServerError(null); }}
                    onBlur={formik.handleBlur}
                    className={`rounded-lg text-sm pr-10 transition-all ${
                      formik.touched.password && formik.errors.password
                        ? "border-red-400 focus-visible:ring-red-300 bg-red-50"
                        : "border-gray-300"
                    }`}
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                  </button>
                </div>
                {formik.touched.password && <FieldError msg={formik.errors.password} />}
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={formik.isSubmitting}
                className="w-full rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm py-2.5 mt-1 shadow transition-all disabled:opacity-70"
              >
                {formik.isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
                    </svg>
                    Signing in...
                  </span>
                ) : "Sign In"}
              </Button>
            </form>

            {/* Demo hint */}
            <div className="mt-5 bg-gray-50 border border-gray-200 rounded-xl p-3 space-y-1">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Demo credentials</p>
              <p className="text-xs text-gray-500">✅ <span className="font-semibold text-gray-700">right@test.com</span> / <span className="font-semibold text-gray-700">password123</span> → Success</p>
              <p className="text-xs text-gray-500">🔴 Any other email → "User not found"</p>
              <p className="text-xs text-gray-500">🟠 right@test.com + wrong pass → "Incorrect password"</p>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-gray-400">
          © 2025 JobPortal. All rights reserved.
        </p>
      </div>
    </div>
  );
}
