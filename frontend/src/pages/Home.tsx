import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Book, CloudSun, Droplets, Wrench, Search, ArrowRight, ShieldCheck, MapPin } from 'lucide-react'
import { KpiCards } from '@/components/common/KpiCards'
import { Button, Card, Input } from '@/components/ui'
import { apiClient, type Kpis } from '@/services/api'

export function Home() {
  const navigate = useNavigate()
  const [kpis, setKpis] = useState<Kpis | null>(null)
  const [kpiLoading, setKpiLoading] = useState(true)
  const [sourceId, setSourceId] = useState('')

  useEffect(() => {
    apiClient
      .getKpis()
      .then((res) => setKpis(res.data))
      .catch(() => setKpis(null))
      .finally(() => setKpiLoading(false))
  }, [])

  const handleStatusSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (sourceId.trim()) {
      navigate(`/map?search=${encodeURIComponent(sourceId.trim())}`)
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-16 pb-12 sm:pt-20 lg:pt-32">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1545062990-4a95e8e4b96d?q=80&w=2070&auto=format&fit=crop"
            alt="Water source in Sierra Leone"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-background"></div>
        </div>

        <div className="page-container relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 backdrop-blur-md border border-primary/30 text-primary-foreground mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <ShieldCheck className="h-4 w-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Securing Sierra Leone's Future</span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-[1.1] tracking-tight">
            Clean Water <span className="text-primary-foreground underline decoration-primary decoration-4 underline-offset-8">Security</span> <br /> For Every Community
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg md:text-xl text-white/80 font-medium">
            Real-time status, SMS alerts, and repair dispatch for rural Sierra Leone.
            Accessible on any phone, anytime.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/map">
              <Button size="lg" className="w-full sm:w-auto text-lg px-8 rounded-2xl group shadow-lg shadow-primary/20">
                Explore Interactive Map
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link to="/find-water">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto text-lg px-8 rounded-2xl backdrop-blur-md bg-white/10 text-white border-white/20 hover:bg-white/20 shadow-lg">
                Find Safe Water
              </Button>
            </Link>
          </div>

          <div className="mt-16 max-w-2xl mx-auto glass-card p-6 sm:p-8 rounded-3xl border-primary/20 shadow-2xl animate-in fade-in zoom-in-95 duration-1000">
            <form onSubmit={handleStatusSearch} className="flex flex-col sm:flex-row items-end gap-4">
              <div className="flex-1 w-full text-left">
                <Input
                  label="Quick Source Lookup"
                  name="source-id"
                  placeholder="Enter source name or ID..."
                  value={sourceId}
                  onChange={(e) => setSourceId(e.target.value)}
                  className="bg-white/50 backdrop-blur-sm border-white/50 text-foreground h-14"
                />
              </div>
              <Button
                type="submit"
                className="h-14 px-8 w-full sm:w-auto rounded-xl"
                disabled={!sourceId.trim()}
              >
                <Search className="h-5 w-5 mr-2" />
                Search
              </Button>
            </form>
            <p className="mt-3 text-xs text-muted-foreground font-medium flex items-center justify-center gap-1">
              <MapPin className="h-3 w-3" /> Search by village name, borehole ID, or district
            </p>
          </div>
        </div>
      </section>

      {/* KPI Section */}
      <section className="py-20 bg-background relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[300px] bg-primary/5 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="page-container relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-1 w-10 bg-primary rounded-full"></div>
              <span className="text-primary font-bold uppercase tracking-widest text-sm">Real-time Data</span>
              <div className="h-1 w-10 bg-primary rounded-full"></div>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold">National Impact Snapshot</h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-lg">
              Live metrics from across the country helping us coordinate emergency response and maintenance.
            </p>
          </div>

          <KpiCards kpis={kpis} loading={kpiLoading} />
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-muted/30">
        <div className="page-container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="p-8 border-none bg-white shadow-soft-xl hover:-translate-y-2 transition-all duration-300">
              <div className="h-16 w-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                <Droplets className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Water Quality</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Real-time tracking of contamination and safety levels across all monitored sources.
              </p>
              <Link to="/map" className="inline-flex items-center text-sm font-bold text-primary group">
                Explore Map
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Card>

            <Card className="p-8 border-none bg-white shadow-soft-xl hover:-translate-y-2 transition-all duration-300">
              <div className="h-16 w-16 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6">
                <Wrench className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Maintenance</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Quick repair dispatch system connecting local technicians with communities in need.
              </p>
              <Link to="/sms-guide" className="inline-flex items-center text-sm font-bold text-primary group">
                SMS Commands
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Card>

            <Card className="p-8 border-none bg-white shadow-soft-xl hover:-translate-y-2 transition-all duration-300">
              <div className="h-16 w-16 bg-amber-100 rounded-2xl flex items-center justify-center mb-6">
                <CloudSun className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Climate Alerts</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Early warning system for seasonal drought risks and water scarcity predictions.
              </p>
              <Link to="/map" className="inline-flex items-center text-sm font-bold text-primary group">
                View Alerts
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Card>

            <Card className="p-8 border-none bg-white shadow-soft-xl hover:-translate-y-2 transition-all duration-300">
              <div className="h-16 w-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-6">
                <Book className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Health Library</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Expert resources and AI-powered assistance for maintaining water hygiene and health.
              </p>
              <Link to="/health" className="inline-flex items-center text-sm font-bold text-primary group">
                Learn More
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary pointer-events-none"></div>
        <div className="absolute inset-0 opacity-20 pointer-events-none">
           <img
            src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop"
            alt="Background pattern"
            className="w-full h-full object-cover mix-blend-overlay"
          />
        </div>

        <div className="page-container relative z-10 text-center">
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-8">Ready to secure your community's water?</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/map">
              <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90 px-10 rounded-2xl h-16 text-lg font-bold">
                Get Started Now
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-10 rounded-2xl h-16 text-lg font-bold">
                Contact Our Team
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
