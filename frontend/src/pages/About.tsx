import { Card } from '@/components/ui'
import { Droplet, Shield, Users, Globe } from 'lucide-react'

export function About() {
  return (
    <div className="page-container py-12 space-y-12">
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold text-primary">About Salone Water Watch</h1>
        <p className="text-xl text-neutral-dark max-w-3xl mx-auto">
          Empowering communities in Sierra Leone through data-driven water security and real-time monitoring.
        </p>
      </section>

      <div className="grid md:grid-cols-2 gap-8">
        <Card className="p-8 space-y-4 border-none shadow-soft-xl bg-white">
          <div className="h-12 w-12 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600">
            <Shield className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold">Our Mission</h2>
          <p className="text-neutral-dark leading-relaxed">
            Our mission is to ensure every citizen in Sierra Leone has access to safe and reliable water.
            By leveraging community reporting and advanced analytics, we provide a platform that
            identifies issues early and coordinates rapid response.
          </p>
        </Card>

        <Card className="p-8 space-y-4 border-none shadow-soft-xl bg-white">
          <div className="h-12 w-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600">
            <Users className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold">Community Driven</h2>
          <p className="text-neutral-dark leading-relaxed">
            Salone Water Watch is built on the strength of the community. From local water committees
            to individual citizens, everyone can contribute by reporting the status of their water
            sources via SMS or our interactive web platform.
          </p>
        </Card>
      </div>

      <section className="bg-slate-900 rounded-[2.5rem] p-8 md:p-16 text-white overflow-hidden relative">
        <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">Technological Innovation</h2>
            <p className="text-slate-300 text-lg leading-relaxed">
              We use modern technologies like React, Flask, and AI to process thousands of data
              points daily. Our predictive engine analyzes rainfall patterns and community reports
              to alert authorities about potential water shortages before they become crises.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
               <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-xl border border-white/10">
                  <Droplet className="h-4 w-4 text-primary" />
                  <span className="text-sm font-bold text-slate-100">Real-time Monitoring</span>
               </div>
               <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-xl border border-white/10">
                  <Globe className="h-4 w-4 text-emerald-400" />
                  <span className="text-sm font-bold text-slate-100">National Coverage</span>
               </div>
            </div>
          </div>
          <div className="relative h-64 lg:h-96 rounded-3xl overflow-hidden shadow-2xl rotate-3">
             <img
               src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop"
               alt="Children with water"
               className="w-full h-full object-cover"
             />
          </div>
        </div>
      </section>
    </div>
  )
}

export default About
