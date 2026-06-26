import { Button, Card, Input } from '@/components/ui'
import { Mail, Phone, MapPin, MessageSquare, Send, Bird } from 'lucide-react'

export function Contact() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-primary pt-24 pb-32 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <img
            src="https://images.unsplash.com/photo-1523293836414-f04e712e1f3b?q=80&w=2072&auto=format&fit=crop"
            alt="Communication"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="page-container relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6">Get in Touch</h1>
          <p className="mx-auto max-w-2xl text-xl text-white/80 font-medium">
            Have questions about water safety in your area? Interested in partnering with us?
            Our team is here to help.
          </p>
        </div>
      </section>

      <section className="py-20 -mt-20 relative z-20">
        <div className="page-container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Info */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="p-8 border-none bg-primary text-white shadow-xl">
                <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
                <div className="space-y-8">
                  <div className="flex gap-4">
                    <div className="h-12 w-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                      <Phone className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-white/60 text-sm font-medium">Call us</p>
                      <p className="text-lg font-bold">+232 00 000 000</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="h-12 w-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                      <Mail className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-white/60 text-sm font-medium">Email us</p>
                      <p className="text-lg font-bold">hello@salonewaterwatch.org</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="h-12 w-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                      <MapPin className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-white/60 text-sm font-medium">Visit us</p>
                      <p className="text-lg font-bold">123 Siaka Stevens St, Freetown, Sierra Leone</p>
                    </div>
                  </div>
                </div>

                <div className="mt-12">
                  <p className="text-white/60 text-sm font-medium mb-4">Follow us</p>
                  <div className="flex gap-4">
                    <div className="h-10 w-10 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer">
                      <Bird className="h-5 w-5" />
                    </div>
                    <div className="h-10 w-10 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer">
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-8 border-none bg-emerald-600 text-white shadow-xl">
                <div className="flex gap-4">
                  <div className="h-12 w-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                    <MessageSquare className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">SMS Reporting</h4>
                    <p className="text-white/80 text-sm leading-relaxed">
                      You can also report issues via SMS. Send "REPORT" to <span className="font-bold">4444</span> for immediate dispatch.
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="p-8 md:p-12 border-none shadow-soft-xl bg-white h-full">
                <h2 className="text-3xl font-bold mb-8">Send us a message</h2>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input label="Your Name" placeholder="Full Name" />
                    <Input label="Email Address" placeholder="email@example.com" type="email" />
                  </div>
                  <Input label="Subject" placeholder="How can we help?" />
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-foreground/80">Message</label>
                    <textarea
                      className="flex min-h-[160px] w-full rounded-xl border border-input bg-background px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all"
                      placeholder="Write your message here..."
                    ></textarea>
                  </div>
                  <Button className="w-full h-14 rounded-xl text-lg font-bold">
                    <Send className="h-5 w-5 mr-2" />
                    Send Message
                  </Button>
                </form>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Map/Location Section */}
      <section className="py-20 bg-muted/30">
        <div className="page-container">
          <div className="rounded-[2rem] overflow-hidden shadow-xl h-[400px] border-4 border-white">
            {/* Placeholder for actual map or image of office location */}
            <img
              src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=2066&auto=format&fit=crop"
              alt="Location map"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>
    </div>
  )
}
