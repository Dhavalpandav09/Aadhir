'use client';
import { useState } from 'react';
import PublicLayout from '../../components/layout/PublicLayout';
import { Reveal, Divider, InputField, SelectField } from '../../components/ui/index';
import { submitEnquiry } from '../../lib/api';
import toast from 'react-hot-toast';

const EVENT_TYPES = ['Wedding', 'Pre-wedding', 'Events', 'Portraits', 'Nature', 'Fashion', 'Corporate', 'Other'];

export default function GetStartedPage() {
  const [form, setForm]     = useState({ name: '', email: '', phone: '', eventType: 'Wedding', eventDate: '', message: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [sent, setSent]     = useState(false);

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: '' })); };

  const handleSubmit = async () => {
    const e = {};
    if (!form.name.trim())    e.name    = 'Required';
    if (!form.email.trim())   e.email   = 'Required';
    if (!form.message.trim()) e.message = 'Required';
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    try {
      await submitEnquiry(form);
      setSent(true);
      toast.success('Enquiry submitted!');
    } catch {
      toast.error('Submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PublicLayout>
      <div className="pt-24 pb-20 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-5 gap-16">
          <div className="md:col-span-2">
            <Reveal>
              <span className="section-label">Let's Begin</span>
              <h1 className="font-serif text-4xl md:text-5xl font-bold mb-6">Book a<br /><em>Session</em></h1>
              <Divider />
            </Reveal>
            <Reveal delay={150}>
              <div className="space-y-6 text-sm text-zinc-500">
                {[['✉','Email','hello@marcusphoto.com'],['✆','Phone / WhatsApp','+91 98765 43210'],['◎','Based in','Mumbai · Milan']].map(([icon,label,val]) => (
                  <div key={label} className="flex gap-4">
                    <span className="text-amber-400 text-lg w-6 flex-shrink-0">{icon}</span>
                    <div>
                      <p className="font-semibold text-zinc-800 dark:text-zinc-200 mb-0.5">{label}</p>
                      <p>{val}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          <div className="md:col-span-3">
            {sent ? (
              <Reveal>
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-16 h-16 rounded-full bg-amber-400/20 flex items-center justify-center mb-6">
                    <span className="text-amber-500 text-2xl">✓</span>
                  </div>
                  <h3 className="font-serif text-2xl font-bold mb-3">Enquiry Received!</h3>
                  <p className="text-zinc-500">Thank you! I'll be in touch within 24 hours.</p>
                </div>
              </Reveal>
            ) : (
              <Reveal>
                <div className="space-y-5">
                  <InputField placeholder="Full Name *" value={form.name} error={errors.name}
                    onChange={e => set('name', e.target.value)} />
                  <InputField type="email" placeholder="Email Address *" value={form.email} error={errors.email}
                    onChange={e => set('email', e.target.value)} />
                  <InputField type="tel" placeholder="Phone Number" value={form.phone}
                    onChange={e => set('phone', e.target.value)} />
                  <div className="grid grid-cols-2 gap-5">
                    <SelectField label="Event Type" value={form.eventType} options={EVENT_TYPES}
                      onChange={e => set('eventType', e.target.value)} />
                    <InputField label="Event Date" type="date" value={form.eventDate}
                      onChange={e => set('eventDate', e.target.value)} />
                  </div>
                  <InputField textarea rows={5} placeholder="Tell me about your vision... *"
                    value={form.message} error={errors.message}
                    onChange={e => set('message', e.target.value)} />
                  <button onClick={handleSubmit} disabled={loading}
                    className="w-full py-5 bg-zinc-900 dark:bg-amber-400 text-white dark:text-zinc-900 text-sm tracking-widest uppercase font-bold hover:bg-amber-400 hover:text-zinc-900 dark:hover:bg-amber-300 transition-all duration-300 disabled:opacity-60">
                    {loading ? 'Submitting…' : 'Submit Enquiry'}
                  </button>
                </div>
              </Reveal>
            )}
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
