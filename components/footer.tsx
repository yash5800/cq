import Link from "next/link"
import { Facebook, Twitter, Linkedin, Mail, MapPin, Phone } from "lucide-react"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-slate-900 text-slate-100 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">InterviewHub</h3>
            <p className="text-slate-400 text-sm">
              Empowering students with real interview experiences and insights from top companies.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-slate-400 hover:text-white transition">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/posting" className="text-slate-400 hover:text-white transition">
                  Share Experience
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="text-slate-400 hover:text-white transition">
                  Admin Panel
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-white mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-slate-400 hover:text-white transition">
                  Interview Tips
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-white transition">
                  Company Guides
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-white transition">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <a href="mailto:info@interviewhub.com" className="text-slate-400 hover:text-white transition">
                  info@interviewhub.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span className="text-slate-400">India</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Links */}
        <div className="border-t border-slate-800 pt-8 mb-8">
          <div className="flex justify-center gap-6">
            <a href="#" className="text-slate-400 hover:text-white transition">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="#" className="text-slate-400 hover:text-white transition">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="text-slate-400 hover:text-white transition">
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-slate-800 pt-8 text-center text-sm text-slate-400">
          <p>&copy; {currentYear} InterviewHub. All rights reserved. | Helping students succeed in interviews.</p>
        </div>
      </div>
    </footer>
  )
}
