"use client";

import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { emailjs as emailjsConfig, profile } from "@/lib/content";
import { SpecHeader } from "./SpecHeader";
import { MailIcon, TwitterIcon, WhatsappIcon } from "./icons";

const channels = [
  {
    icon: MailIcon,
    label: "Email",
    value: profile.email,
    href: `mailto:${profile.email}`,
  },
  {
    icon: TwitterIcon,
    label: "X / Twitter",
    value: profile.socials.twitterHandle,
    href: `${profile.socials.twitter}/messages`,
  },
  {
    icon: WhatsappIcon,
    label: "WhatsApp",
    value: profile.socials.whatsappLabel,
    href: profile.socials.whatsapp,
  },
];

type Status = "idle" | "sending" | "sent" | "error";

export function ServiceRequest() {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<Status>("idle");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formRef.current) return;
    setStatus("sending");

    emailjs
      .sendForm(
        emailjsConfig.serviceId,
        emailjsConfig.templateId,
        formRef.current,
        emailjsConfig.publicKey,
      )
      .then(() => {
        setStatus("sent");
        formRef.current?.reset();
      })
      .catch(() => setStatus("error"));
  };

  return (
    <section id="request" className="relative py-24 md:py-32 shop-texture">
      <div className="mx-auto w-[90%] max-w-6xl">
        <SpecHeader sec="Sec. 04" title="Service Request" />

        <div className="grid md:grid-cols-[34%_1fr] gap-12 md:gap-16">
          <div className="flex flex-col gap-4">
            {channels.map((channel) => (
              <a
                key={channel.label}
                href={channel.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 bg-blue blueprint-grid text-paper px-5 py-4 border border-blue-line
                hover:border-accent transition-colors"
              >
                <span className="w-8 h-8 shrink-0 text-accent-bright">
                  <channel.icon className="w-full h-full" />
                </span>
                <span>
                  <span className="block font-label text-[0.6rem] tracking-[0.2em] uppercase text-paper-dim">
                    {channel.label}
                  </span>
                  <span className="block font-display text-base leading-snug break-all">
                    {channel.value}
                  </span>
                </span>
              </a>
            ))}
          </div>

          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="flex flex-col gap-5"
          >
            <p className="font-label text-xs text-steel-dim tracking-wide leading-relaxed max-w-md">
              File a request with your name and a note — every ticket is read
              and answered from the address above.
            </p>

            <input
              type="text"
              name="name"
              placeholder="Full name"
              required
              className="w-full bg-transparent border-b border-blue-line px-1 py-3 text-steel
              placeholder:text-steel-dim/70 font-label focus:outline-none focus:border-accent-bright transition-colors"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              className="w-full bg-transparent border-b border-blue-line px-1 py-3 text-steel
              placeholder:text-steel-dim/70 font-label focus:outline-none focus:border-accent-bright transition-colors"
            />
            <textarea
              name="message"
              rows={5}
              placeholder="Request details"
              required
              className="w-full bg-transparent border-b border-blue-line px-1 py-3 text-steel resize-none
              placeholder:text-steel-dim/70 font-label focus:outline-none focus:border-accent-bright transition-colors"
            />

            <div className="flex items-center gap-5 mt-2">
              <button
                type="submit"
                disabled={status === "sending"}
                className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-shop-deep font-label
                font-bold text-sm tracking-[0.08em] uppercase hover:bg-accent-bright transition-colors disabled:opacity-60"
              >
                {status === "sending" ? "Filing…" : "Submit Request"}
              </button>
              {status === "sent" && (
                <span className="font-label text-sm text-accent-bright">
                  Ticket filed — thank you.
                </span>
              )}
              {status === "error" && (
                <span className="font-label text-sm text-steel-dim">
                  Something went wrong — email me directly instead.
                </span>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
