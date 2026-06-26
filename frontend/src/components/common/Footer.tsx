import { Link } from 'react-router-dom'
import { Droplet, Bird, Mail, MapPin, Phone } from 'lucide-react'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-slate-900 text-slate-400 py-16">
      <div className="page-container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="h-10 w-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                <Droplet className="h-6 w-6 text-white" fill="white" />
              </div>
              <span className="text-xl font-black tracking-tight text-white">SALONE<span className="text-primary">WATERWATCH</span></span>
            </Link>
            <p className="text-sm leading-relaxed">
              Securing Sierra Leone's water future through real-time monitoring,
              community-driven reporting, and coordinated maintenance.
            </p>
            <div className="flex gap-4">
              <a href="#" className="h-10 w-10 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                <Bird className="h-5 w-5" />
              </a>
              <a href="#" className="h-10 w-10 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-primary hover:text-white transition-all">
              </a>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-[0.2em] text-xs">Platform</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link to="/map" className="hover:text-primary transition-colors">Interactive Map</Link></li>
              <li><Link to="/find-water" className="hover:text-primary transition-colors">Find Safe Water</Link></li>
              <li><Link to="/health" className="hover:text-primary transition-colors">Health Library</Link></li>
              <li><Link to="/sms-guide" className="hover:text-primary transition-colors">SMS Commands</Link></li>
              <li><Link to="/admin/login" className="hover:text-primary transition-colors">Admin Access</Link></li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-[0.2em] text-xs">Organization</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link to="/about" className="hover:text-primary transition-colors">Our Mission</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
              <li><Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-[0.2em] text-xs">Contact</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li className="flex gap-3">
                <MapPin className="h-5 w-5 text-primary shrink-0" />
                <span>Siaka Stevens St, Freetown, SL</span>
              </li>
              <li className="flex gap-3">
                <Phone className="h-5 w-5 text-primary shrink-0" />
                <span>+232 00 000 000</span>
              </li>
              <li className="flex gap-3">
                <Mail className="h-5 w-5 text-primary shrink-0" />
                <span>support@salonewaterwatch.org</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs font-medium">
            © {year} Salone Water Watch Platform. Built for the public good in Sierra Leone.
          </p>
          <div className="flex gap-6 text-xs font-bold uppercase tracking-widest">
            <span className="text-slate-600">MIT Licensed</span>
            <span className="text-emerald-500 flex items-center gap-1.5">
               <div className="h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
               System Status: Operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
