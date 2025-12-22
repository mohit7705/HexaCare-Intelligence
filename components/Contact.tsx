import React, { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import Button from './Button';
import { ButtonVariant } from '../types';

const Contact: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulated API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSuccess(true);
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <section id="contact" className="py-24 bg-gradient-to-b from-pale to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 gap-16 items-center">

          {/* LEFT CONTENT */}
          <div className="mb-12 lg:mb-0">
            <h2 className="font-heading font-bold text-4xl text-navy mb-6">
              Ready to experience the future of health screening?
            </h2>

            <p className="font-sans text-xl text-bodyText mb-8">
              Connect with us to schedule a platform demo, explore enterprise
              integrations, or learn how HexaCare can support preventive care
              workflows.
            </p>

            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-navy">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                <span className="font-medium">
                  Sales Team Available: 9am – 5pm EST
                </span>
              </div>

              <div className="flex items-center space-x-3 text-navy">
                <span className="w-2 h-2 rounded-full bg-techBlue"></span>
                <span className="font-medium">
                  Technical Support: 24/7
                </span>
              </div>
            </div>
          </div>

          {/* FORM CARD */}
          <div className="bg-white/80 backdrop-blur-xl border border-skyGlow/20 rounded-3xl p-8 shadow-2xl relative overflow-hidden min-h-[460px]">

            {isSuccess ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 animate-in fade-in duration-500">
                <CheckCircle className="w-20 h-20 text-green-500 mb-6" />
                <h3 className="text-2xl font-bold text-navy mb-2">
                  Message Sent Successfully
                </h3>
                <p className="text-bodyText text-center mb-8">
                  Thank you for contacting HexaCare. Our team will review your
                  message and respond shortly.
                </p>

                <Button
                  variant={ButtonVariant.OUTLINE}
                  onClick={() => setIsSuccess(false)}
                >
                  Send another message
                </Button>
              </div>
            ) : (
              <form
                className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500"
                onSubmit={handleSubmit}
              >
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-navy mb-2">
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Dr. Sarah Johnson"
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-techBlue focus:ring-2 focus:ring-techBlue/20 outline-none transition-all bg-white/50"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-navy mb-2">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="sarah@clinic.com"
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-techBlue focus:ring-2 focus:ring-techBlue/20 outline-none transition-all bg-white/50"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-navy mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    required
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="I'm interested in integrating HexaCare into our workflow…"
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-techBlue focus:ring-2 focus:ring-techBlue/20 outline-none transition-all bg-white/50"
                  />
                </div>

                {/* PRIVACY NOTICE */}
                <p className="text-xs text-navy/60 leading-relaxed">
                  Your information is kept confidential and used only to respond
                  to your inquiry. HexaCare does not provide medical advice and
                  does not store personal health data through this form.
                </p>

                <Button
                  variant={ButtonVariant.PRIMARY}
                  className="w-full"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      Sending…
                    </span>
                  ) : (
                    'Submit Message'
                  )}
                </Button>
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};

export default Contact;
