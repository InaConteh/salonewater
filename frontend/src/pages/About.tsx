import { Button } from '@/components/ui'
import { CheckCircle2, Shield, Globe, Users, Award } from 'lucide-react'
import { Link } from 'react-router-dom'

export function About() {
  const values = [
    {
      title: 'Transparency',
      description: 'Open access to water quality data for every community and stakeholder.',
      icon: <CheckCircle2 className="h-6 w-6 text-primary" />,
    },
    {
      title: 'Resilience',
      description: 'Building systems that withstand seasonal changes and technical failures.',
      icon: <Shield className="h-6 w-6 text-primary" />,
    },
    {
      title: 'Local First',
      description: 'Empowering local technicians and water committees through SMS coordination.',
      icon: <Users className="h-6 w-6 text-primary" />,
    },
    {
      title: 'Open Source',
      description: 'A platform built for the public good, adaptable for any region.',
      icon: <Globe className="h-6 w-6 text-primary" />,
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-primary pt-24 pb-32 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <img
            src="https://images.unsplash.com/photo-1444210971048-6130cf0c46cf?q=80&w=2073&auto=format&fit=crop"
            alt="Sierra Leone landscape"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="page-container relative z-10">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6">Our Mission</h1>
          <p className="mx-auto max-w-2xl text-xl text-white/80 font-medium">
            Bridging the gap between rural communities and clean water security through technology and coordination.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 -mt-16 relative z-20">
        <div className="page-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-2">
                <Award className="h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Solving the Water Crisis</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold leading-tight">Technology Built for <span className="gradient-text">Real Impact</span></h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Many water points fail within two years of installation due to lack of monitoring and maintenance.
                CleanFlow SL solves this by connecting communities, water committees, and district partners
                with real-time status and data-driven coordination.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                {values.map((value, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="mt-1">{value.icon}</div>
                    <div>
                      <h4 className="font-bold text-lg">{value.title}</h4>
                      <p className="text-sm text-muted-foreground">{value.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl relative">
                <img
                  src="https://images.unsplash.com/photo-1547523177-3ba001b647f5?q=80&w=1974&auto=format&fit=crop"
                  alt="Community members at a well"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-8 left-8 right-8 text-white">
                  <p className="text-2xl font-bold italic mb-2">"CleanFlow has transformed how we respond to pump failures in Kambia."</p>
                  <p className="font-medium opacity-80">— Local Water Committee Member</p>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl p-4 text-center leading-tight shadow-xl">
                100% Focused
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team/Open Source Section */}
      <section className="py-24 bg-muted/50">
        <div className="page-container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">Part of a Global Movement</h2>
          <div className="max-w-3xl mx-auto mb-12">
            <p className="text-lg text-muted-foreground mb-8">
              CleanFlow SL is an open-source initiative dedicated to improving public health infrastructure.
              The platform is MIT-licensed so NGOs and government partners can deploy and extend it freely.
            </p>
            <div className="flex justify-center gap-4">
              <a href="https://github.com" target="_blank" rel="noreferrer">
                <Button variant="outline" className="h-12 px-8 rounded-xl border-2">
                  View on GitHub
                </Button>
              </a>
              <Link to="/contact">
                <Button className="h-12 px-8 rounded-xl">
                  Work With Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
