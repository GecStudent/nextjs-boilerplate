export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200">
      <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col items-center gap-4">

        {/* Links */}
        <nav className="flex items-center gap-6">
          {["Home", "Jobs", "About", "Contact Us"].map((link) => (
            <a
              key={link}
              href="#"
              className="text-sm text-slate-500 hover:text-blue-600 font-semibold transition-colors"
            >
              {link}
            </a>
          ))}
        </nav>

        {/* Divider */}
        <div className="w-full h-px bg-slate-200" />

        {/* Copyright */}
        <p className="text-xs text-slate-400">© 2025 JobPortal. All rights reserved.</p>

      </div>
    </footer>
  );
}
