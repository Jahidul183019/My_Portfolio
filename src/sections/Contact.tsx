import { useMediaQuery } from "@/hooks/use-media-query";
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Github, Linkedin, Mail, MapPin, Send, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

/* ---------------------------
   Schema
----------------------------*/
const formSchema = z.object({
  email: z.string().trim().max(254).email("Enter a valid reply email address"),
  name: z.string().trim().min(1, "Name is required").max(100),
  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters")
    .max(5000),
});

type FormData = z.infer<typeof formSchema>;

/* ---------------------------
   Contact API
   Configure with VITE_CONTACT_FORM_ENDPOINT
----------------------------*/
const sendMessageAPI = async (data: FormData) => {
  const endpoint = import.meta.env.VITE_CONTACT_FORM_ENDPOINT || "/api/contact";

  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 30000);
  try {
    const response = await fetch(endpoint, {
      signal: controller.signal,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      let errorMessage = "Failed to send message.";

      try {
        const payload = await response.json();
        errorMessage = payload?.error || payload?.message || errorMessage;
      } catch {
        // Keep default error message when response is not JSON.
      }

      throw new Error(errorMessage);
    }
  } catch (error) {
    if (controller.signal.aborted) {
      throw new Error("Delivery could not be confirmed within 30 seconds. Your message may already have been sent. Please wait before sending again; it will not be retried automatically.");
    }
    throw error;
  } finally {
    window.clearTimeout(timeout);
  }
};

/* ---------------------------
   Component
----------------------------*/
export function Contact() {
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const { toast } = useToast();
  const pendingRef = useRef(false);
  const [isPending, setIsPending] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    if (pendingRef.current) return;
    pendingRef.current = true;
    try {
      setIsPending(true);

      await sendMessageAPI(data);

      toast({
        title: "Message sent!",
        description: "Thank you for reaching out. I'll get back to you soon.",
      });

      reset();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to send message. Please try again later.";

      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      pendingRef.current = false;
      setIsPending(false);
    }
  };

  return (
    <section id="contact" className="py-16 sm:py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute top-1/2 left-0 w-full h-[500px] bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none -skew-y-6 transform-gpu" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 20 }}
          animate={reducedMotion ? { opacity: [1, 1], y: [0, 0] } : undefined}
          whileInView={reducedMotion ? { opacity: [1, 1], y: [0, 0] } : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
          transition={reducedMotion ? { duration: 0, delay: 0 } : undefined}
        >
          <h2 className="text-3xl md:text-4xl font-bold">
            Get In <span className="text-gradient">Touch</span>
          </h2>

          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Currently open for opportunities. Feel free to reach out!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-12">
          {/* LEFT SIDE */}
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, x: -30 }}
            animate={reducedMotion ? { opacity: [1, 1], x: [0, 0] } : undefined}
            whileInView={reducedMotion ? { opacity: [1, 1], x: [0, 0] } : { opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2 glass-card rounded-2xl p-6 sm:p-8"
            transition={reducedMotion ? { duration: 0, delay: 0 } : undefined}
          >
            <h3 className="text-2xl font-bold mb-6">
              Contact Information
            </h3>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-cyan-500/10 text-cyan-800 dark:text-cyan-300 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="font-medium">Email</p>
                  <a href="mailto:mdjahidulislamsarker@gmail.com" className="text-sm text-muted-foreground [overflow-wrap:anywhere] underline underline-offset-4">
                    mdjahidulislamsarker@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-violet-500/10 text-violet-700 dark:text-violet-300 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium">Location</p>
                  <p className="text-sm text-muted-foreground">
                    Dhaka, Bangladesh
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-white/10">
                <p className="font-medium mb-4">Connect with me</p>
                <div className="flex items-center gap-4">
                  <a
                    href="https://github.com/Jahidul183019"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="GitHub profile"
                    className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-foreground hover:text-primary hover:-translate-y-0.5 transition-all"
                  >
                    <Github className="w-5 h-5" />
                  </a>
                  <a
                    href="https://www.linkedin.com/in/md-jahidul-islam-231879321"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="LinkedIn profile"
                    className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-foreground hover:text-primary hover:-translate-y-0.5 transition-all"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* RIGHT SIDE FORM */}
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, x: 30 }}
            animate={reducedMotion ? { opacity: [1, 1], x: [0, 0] } : undefined}
            whileInView={reducedMotion ? { opacity: [1, 1], x: [0, 0] } : { opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-3 glass-card rounded-2xl p-6 sm:p-8"
            transition={reducedMotion ? { duration: 0, delay: 0 } : undefined}
          >
            <form noValidate aria-busy={isPending} onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Name */}
              <div>
                <div>
                  <label htmlFor="contact-name" className="block text-sm font-medium mb-2">Name</label>
                  <Input
                    id="contact-name"
                    autoComplete="name"
                    maxLength={100}
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "contact-name-error" : undefined}
                    placeholder="Your Name"
                    {...register("name")}
                  />
                  {errors.name && (
                    <p id="contact-name-error" role="alert" className="text-red-700 dark:text-red-300 text-xs mt-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>

              </div>

              <div>
                <label htmlFor="contact-email" className="block text-sm font-medium mb-2">Reply email</label>
                <Input id="contact-email" type="email" autoComplete="email" maxLength={254}
                  placeholder="you@example.com" aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "contact-email-error" : undefined}
                  {...register("email")} />
                {errors.email && <p id="contact-email-error" role="alert" className="text-red-700 dark:text-red-300 text-xs mt-1">{errors.email.message}</p>}
              </div>

              {/* Message */}
              <div>
                <label htmlFor="contact-message" className="block text-sm font-medium mb-2">Message</label>
                <Textarea
                  id="contact-message"
                  maxLength={5000}
                  aria-invalid={!!errors.message}
                  aria-describedby={errors.message ? "contact-message-error" : undefined}
                  placeholder="Your Message"
                  {...register("message")}
                />
                {errors.message && (
                  <p id="contact-message-error" role="alert" className="text-red-700 dark:text-red-300 text-xs mt-1">
                    {errors.message.message}
                  </p>
                )}
              </div>

              {/* Submit */}
              <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Send Message
                  </>
                )}
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
