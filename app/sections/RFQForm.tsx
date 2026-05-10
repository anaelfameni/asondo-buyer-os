"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useI18n } from "@/lib/i18n-context";
import { AnimatedSection } from "@/app/components/AnimatedSection";
import { Send, CheckCircle2, Clock, FileText, Package, MapPin, Building2, User, Mail as MailIcon } from "lucide-react";

export function RFQForm() {
  const { t } = useI18n();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    country: "",
    volume: "",
    port: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 6000);
  };

  return (
    <section id="rfq-form" className="relative py-24 lg:py-32 overflow-hidden bg-gradient-to-br from-[#FEF3E7] via-[#FDFBF7] to-[#F4A866]/20">
      {/* Decorative orbs */}
      <div className="absolute top-10 left-10 w-80 h-80 bg-[#F4A866]/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-[#F2B83E]/30 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-3xl mx-auto">
          <AnimatedSection className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#E8833D] to-[#D06B1F] text-white text-sm font-semibold mb-6 shadow-lg shadow-[#E8833D]/25">
              <Clock className="w-4 h-4" />
              {t.rfq.badge}
            </div>
            <h2 className="text-headline text-[#1A1A1A] mb-5 text-balance">
              {t.rfq.title}
            </h2>
            <p className="text-lg text-[#6B7280] leading-relaxed">
              {t.rfq.subtitle}
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <div className="relative">
              {/* Glow behind card */}
              <div className="absolute -inset-4 bg-gradient-to-r from-[#E8833D]/20 via-[#F2B83E]/20 to-[#D06B1F]/20 rounded-3xl blur-2xl opacity-70" />

              <div className="relative bg-white rounded-3xl border border-[#E8833D]/15 shadow-2xl shadow-[#E8833D]/10 p-8 sm:p-10">
                <AnimatePresence mode="wait">
                  {submitted ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="text-center py-10"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", bounce: 0.5, delay: 0.1 }}
                        className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#15803D] to-[#14532D] flex items-center justify-center shadow-xl shadow-green-500/25"
                      >
                        <CheckCircle2 className="w-10 h-10 text-white" strokeWidth={2.5} />
                      </motion.div>
                      <h3 className="text-2xl font-bold text-[#1A1A1A] mb-3">
                        {t.rfq.success.title}
                      </h3>
                      <p className="text-[#6B7280] mb-4 max-w-md mx-auto">
                        {t.rfq.success.message}{" "}
                        <span className="font-semibold text-[#D06B1F]">{formData.email}</span>
                        {t.rfq.success.followUp}
                      </p>
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FEF3E7] text-[#D06B1F] text-sm font-mono font-semibold">
                        {t.rfq.success.reference} : RFQ-{Date.now().toString(36).toUpperCase()}
                      </div>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      onSubmit={handleSubmit}
                      className="space-y-5"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <FieldGroup icon={User} label={t.rfq.labels.name}>
                          <Input
                            required
                            placeholder={t.rfq.placeholders.name}
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="h-12 bg-[#FDFBF7] border-[#E8833D]/20 focus:border-[#E8833D] focus:ring-[#E8833D]/20 rounded-xl"
                          />
                        </FieldGroup>
                        <FieldGroup icon={MailIcon} label={t.rfq.labels.email}>
                          <Input
                            type="email"
                            required
                            placeholder={t.rfq.placeholders.email}
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="h-12 bg-[#FDFBF7] border-[#E8833D]/20 focus:border-[#E8833D] focus:ring-[#E8833D]/20 rounded-xl"
                          />
                        </FieldGroup>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <FieldGroup icon={Building2} label={t.rfq.labels.company}>
                          <Input
                            required
                            placeholder={t.rfq.placeholders.company}
                            value={formData.company}
                            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                            className="h-12 bg-[#FDFBF7] border-[#E8833D]/20 focus:border-[#E8833D] focus:ring-[#E8833D]/20 rounded-xl"
                          />
                        </FieldGroup>
                        <FieldGroup icon={MapPin} label={t.rfq.labels.country}>
                          <Input
                            required
                            placeholder={t.rfq.placeholders.country}
                            value={formData.country}
                            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                            className="h-12 bg-[#FDFBF7] border-[#E8833D]/20 focus:border-[#E8833D] focus:ring-[#E8833D]/20 rounded-xl"
                          />
                        </FieldGroup>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <FieldGroup icon={Package} label={t.rfq.labels.volume}>
                          <Input
                            type="number"
                            placeholder={t.rfq.placeholders.volume}
                            value={formData.volume}
                            onChange={(e) => setFormData({ ...formData, volume: e.target.value })}
                            className="h-12 bg-[#FDFBF7] border-[#E8833D]/20 focus:border-[#E8833D] focus:ring-[#E8833D]/20 rounded-xl"
                          />
                        </FieldGroup>
                        <FieldGroup icon={MapPin} label={t.rfq.labels.port}>
                          <Input
                            placeholder={t.rfq.placeholders.port}
                            value={formData.port}
                            onChange={(e) => setFormData({ ...formData, port: e.target.value })}
                            className="h-12 bg-[#FDFBF7] border-[#E8833D]/20 focus:border-[#E8833D] focus:ring-[#E8833D]/20 rounded-xl"
                          />
                        </FieldGroup>
                      </div>

                      <FieldGroup icon={FileText} label={t.rfq.labels.message}>
                        <Textarea
                          rows={4}
                          placeholder={t.rfq.placeholders.message}
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          className="bg-[#FDFBF7] border-[#E8833D]/20 focus:border-[#E8833D] focus:ring-[#E8833D]/20 rounded-xl resize-none"
                        />
                      </FieldGroup>

                      <button
                        type="submit"
                        className="group relative w-full overflow-hidden inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-[#E8833D] to-[#D06B1F] text-white font-semibold text-lg shadow-xl shadow-[#E8833D]/30 hover:shadow-2xl hover:shadow-[#E8833D]/40 hover:-translate-y-0.5 transition-all btn-premium"
                      >
                        {t.rfq.submit}
                        <Send className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </button>

                      <p className="text-xs text-center text-[#6B7280] leading-relaxed pt-2">
                        {t.rfq.privacy}
                      </p>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}

function FieldGroup({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ElementType;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-[#6B7280]">
        <Icon className="w-3.5 h-3.5 text-[#E8833D]" />
        {label}
      </Label>
      {children}
    </div>
  );
}
