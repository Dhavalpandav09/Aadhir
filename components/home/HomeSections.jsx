"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Reveal, Divider } from "../ui/index";
import { submitEnquiry } from "../../lib/api";
import toast from "react-hot-toast";
import aadhir from "/public/aadhir_about.jpg";

const TESTIMONIALS = [
  {
    id: 1,
    name: "Sophia & Liam",
    role: "Wedding Clients",
    text: "Marcus captured our love story with such artistry. Every photo feels like a painting. We cry every time we look at our album.",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
  },
  {
    id: 2,
    name: "Elena Voss",
    role: "Fashion Director, Vogue Italia",
    text: "Exceptional eye for light and composition. Marcus elevates every shoot into something extraordinary. Our go-to photographer for campaigns.",
    avatar:
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100",
  },
  {
    id: 3,
    name: "Rohan Mehta",
    role: "CEO, TechSummit Asia",
    text: "Professional, creative, and incredibly efficient. Our conference coverage exceeded expectations. The candid shots especially were remarkable.",
    avatar:
      "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=100",
  },
];

export function AboutSection() {
  return (
    <section className="py-32 px-6 max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
      <Reveal>
        <div className="relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/aadhir_about.jpg"
            // src={aadhir}
            alt="Aadhir"
            className="w-full aspect-[3/4] object-cover"
          />
          <div className="absolute -bottom-6 -right-6 w-32 h-32 border-4 border-amber-400 -z-10" />
          <div className="absolute -top-6 -left-6 w-32 h-32 bg-amber-400/10 -z-10" />
        </div>
      </Reveal>
      <Reveal delay={200}>
        <span className="section-label">About the Artist</span>
        <h2 className="font-serif text-4xl md:text-5xl font-bold mb-0">
          Every frame tells
          <br />a <em>story</em>
        </h2>
        <Divider />
        <p className="text-zinc-500 leading-relaxed mb-6">
          With over a decade behind the lens, Aadhir Films has built a
          reputation for capturing the unrepeatable — the tear before the vow,
          the laugh between takes, the last light on a mountain ridge. Based
          between Mumbai and Milan, he works globally.
        </p>
        <p className="text-zinc-500 leading-relaxed mb-8">
          Winner of the International Wedding Photography Award 2024 and
          featured in Vogue, Harper's Bazaar, and National Geographic.
        </p>
        <div className="grid grid-cols-3 gap-6 mb-8">
          {[
            ["12+", "Years"],
            ["800+", "Projects"],
            ["50+", "Countries"],
          ].map(([n, l]) => (
            <div key={l}>
              <p className="font-serif text-3xl font-bold text-amber-500">
                {n}
              </p>
              <p className="text-xs tracking-widest uppercase text-zinc-500">
                {l}
              </p>
            </div>
          ))}
        </div>
        <Link
          href="/portfolio"
          className="inline-flex items-center gap-2 text-sm tracking-widest uppercase text-amber-500 border-b border-amber-500 pb-1 hover:gap-4 transition-all"
        >
          See My Work →
        </Link>
      </Reveal>
    </section>
  );
}

export function TestimonialsSection() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const t = setInterval(
      () => setActive((a) => (a + 1) % TESTIMONIALS.length),
      4500,
    );
    return () => clearInterval(t);
  }, []);
  const t = TESTIMONIALS[active];
  return (
    <section
      className="py-32 px-6"
      style={{ background: "linear-gradient(135deg,#1a1a1a 0%,#0f0f0f 100%)" }}
    >
      <div className="max-w-4xl mx-auto text-center text-white">
        <Reveal>
          <span className="section-label">Client Stories</span>
        </Reveal>
        <Reveal delay={100}>
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-16">
            What they say
          </h2>
        </Reveal>
        <div className="relative min-h-[200px] flex flex-col items-center justify-center">
          <p className="text-xl md:text-2xl font-serif italic text-zinc-300 leading-relaxed mb-8 max-w-2xl">
            "{t.text}"
          </p>
          <div className="flex items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={t.avatar}
              alt={t.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="text-left">
              <p className="font-semibold">{t.name}</p>
              <p className="text-zinc-500 text-sm">{t.role}</p>
            </div>
          </div>
        </div>
        <div className="flex justify-center gap-2 mt-8">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`w-2 h-2 rounded-full transition-all ${i === active ? "bg-amber-400 w-6" : "bg-zinc-600"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export function QuickContactSection() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    try {
      await submitEnquiry({
        email,
        name: "Quick Contact",
        message: "Quick contact from homepage",
        eventType: "Other",
      });
      setSent(true);
      toast.success("Message received!");
    } catch {
      toast.error("Please try again.");
    }
  };
  return (
    <section className="py-24 px-6 bg-amber-400">
      <div className="max-w-3xl mx-auto text-center">
        <Reveal>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-zinc-900 mb-4">
            Ready to create something beautiful?
          </h2>
          <p className="text-zinc-700 mb-8">
            Let's discuss your vision. Drop your email and I'll be in touch.
          </p>
        </Reveal>
        {sent ? (
          <p className="text-zinc-900 font-semibold text-lg">
            ✓ Got it! I'll reach out soon.
          </p>
        ) : (
          <Reveal delay={100}>
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-5 py-4 bg-white text-zinc-900 text-sm focus:outline-none placeholder:text-zinc-400"
                required
              />
              <button
                type="submit"
                className="px-8 py-4 bg-zinc-900 text-white text-xs tracking-widest uppercase font-bold hover:bg-zinc-800 transition-colors whitespace-nowrap"
              >
                Get in Touch
              </button>
            </form>
          </Reveal>
        )}
      </div>
    </section>
  );
}
