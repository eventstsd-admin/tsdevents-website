import { motion } from 'motion/react';
import { Phone, Mail, Clock, Send, MessageCircle, MapPin, User, Calendar } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router';
import { SEOComponent, PAGE_SEO } from '../components/SEO-fallback';
import contactHeroImage from '../images/Hero Fallback/Contact/Contact.jpg';
import { inquiryOperations } from '../../supabase';

// Service-specific quote message templates
const serviceMessages: Record<string, string> = {
  'Traditional Weddings': 'I am interested in booking TSD Events & Decor for a traditional wedding celebration. Please provide details about your services, packages, and availability for my preferred dates.',
  'Destination Weddings': 'I would like to inquire about destination wedding services. Please share information about your experience, locations, and customized packages for international or exotic venue weddings.',
  'Reception Planning': 'I am interested in professional reception planning services. Could you please provide details about your reception packages, catering options, and decoration services?',
  'Conferences': 'I would like to discuss conference organization services for our upcoming corporate event. Please share your experience with similar events and what services you offer.',
  'Team Building': 'I am interested in organizing a team building event for our company. Could you provide information about your team building packages and activity options?',
  'Product Launches': 'We are planning a product launch event and would like to inquire about your event organization services. Please share your experience with similar launches.',
  'Birthday Parties': 'I would like to plan a memorable birthday party. Could you please share your theme options, decoration services, and party package details?',
  'Anniversary Events': 'We are celebrating a special anniversary and would like your help to organize a memorable event. Please share your services and packages.',
  'Social Gatherings': 'I am interested in organizing a social gathering event. Could you please provide information about your services and custom packages?',
  'Concerts & Shows': 'We are interested in organizing a live entertainment event. Please share your experience with concerts/shows and what services you provide.',
  'Charity Galas': 'We are planning a charity gala and need professional event organization. Could you share your experience with similar fundraising events?',
  'Cultural Festivals': 'I would like to organize a cultural festival event. Could you please share your experience with cultural celebrations and available services?',
};

export function ContactPage() {
  const [searchParams] = useSearchParams();
  const serviceParam = searchParams.get('service');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    eventType: '',
    subject: '',
    message: '',
  });

  const eventTypes = [
    'Wedding',
    'Corporate Event',
    'Birthday Party',
    'Anniversary',
    'Religious Ceremony',
    'Social Gathering',
    'Other',
  ];

  // Prefill form if service parameter is provided
  useEffect(() => {
    if (serviceParam) {
      const message = serviceMessages[serviceParam] || `I am interested in booking TSD Events & Decor for ${serviceParam}. Please provide more information about your services and packages.`;
      setFormData(prev => ({
        ...prev,
        subject: `Quote Request - ${serviceParam}`,
        message,
      }));
    }
  }, [serviceParam]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await inquiryOperations.create({
        customer_name: formData.name,
        email: formData.email,
        message: `${formData.eventType ? `Event Type: ${formData.eventType}\n` : ''}${formData.subject ? `Subject: ${formData.subject}\n\n` : ''}${formData.message}${formData.phone ? `\n\nPhone: ${formData.phone}` : ''}`,
      });
      
      toast.success('Message sent successfully! We will get back to you soon.');
      setFormData({ name: '', email: '', phone: '', eventType: '', subject: '', message: '' });
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      toast.error('Failed to send message. Please try again.');
    }
  };

  const handleSendWhatsApp = () => {
    if (!formData.name || !formData.message) {
      toast.error('Please fill in your name and message');
      return;
    }

    // Format the message for WhatsApp
    const whatsappMessage = `Hi TSD Events & Decor,\n\nName: ${formData.name}\nEmail: ${formData.email}\n${formData.phone ? `Phone: ${formData.phone}\n` : ''}${formData.eventType ? `Event Type: ${formData.eventType}\n` : ''}${formData.subject ? `Subject: ${formData.subject}\n` : ''}Message: ${formData.message}`;
    
    // WhatsApp Business number (replace with actual number)
    const phoneNumber = '919825413606';
    
    // Create WhatsApp URL
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(whatsappMessage)}`;
    
    // Open WhatsApp
    window.open(whatsappUrl, '_blank');
    
    toast.success('Opening WhatsApp...');
  };

  return (
    <div className="bg-white">
      <SEOComponent {...PAGE_SEO.contact} />
      
      {/* Hero Section */}
      <section className="relative min-h-[40vh] sm:h-[50vh] text-white flex items-center justify-center pt-16 sm:pt-20">
        <div className="absolute inset-0">
          {/* Background Image */}
          <motion.div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${contactHeroImage})` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          />
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/60" />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
        </div>
        <div className="relative z-10 text-center px-4 max-w-full sm:max-w-4xl w-full sm:w-11/12 mx-auto py-8 sm:py-0">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4"
          >
            Contact Us
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-300"
          >
            Ready to plan your event? Let's discuss your celebration.
          </motion.p>
        </div>
      </section>

      {/* Contact Section - Vertical Layout */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-3xl">
          {/* Contact Information - First */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center" style={{ fontFamily: 'Playfair Display, serif' }}>Contact Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="flex items-start space-x-4 p-6 bg-gray-50 border-l-4 border-red-600">
                <div className="bg-red-600 p-3">
                  <Phone className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Phone</h3>
                  <p className="text-gray-600">+91 98254 13606</p>
                  <a href="tel:+919825413606" className="text-red-600 hover:text-red-700 text-sm font-medium mt-1 inline-block">
                    Call Now
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-6 bg-gray-50 border-l-4 border-amber-500">
                <div className="bg-amber-500 p-3">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Email</h3>
                  <p className="text-gray-600">info@tsdevents.in</p>
                  <a href="mailto:info@tsdevents.in" className="text-amber-600 hover:text-amber-700 text-sm font-medium mt-1 inline-block">
                    Send Email
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-6 bg-gray-50 border-l-4 border-red-600">
                <div className="bg-red-600 p-3">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Location</h3>
                  <p className="text-gray-600">Ahmedabad, Gujarat, India</p>
                  <a href="https://maps.app.goo.gl/oSoJT4RoNKFvVRHU9" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:text-red-700 text-sm font-medium mt-1 inline-block">
                    Get Directions
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-6 bg-gray-50 border-l-4 border-amber-500">
                <div className="bg-amber-500 p-3">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Business Hours</h3>
                  <p className="text-gray-600">Monday - Saturday: 9:00 AM - 7:00 PM</p>
                  <p className="text-gray-500 text-sm">Sunday: By Appointment</p>
                </div>
              </div>
            </div>

            {/* Quick WhatsApp CTA */}
            <div className="bg-green-600 p-6 text-white text-center">
              <h3 className="font-bold text-xl mb-2">Prefer WhatsApp?</h3>
              <p className="text-green-100 mb-4">Get instant response on WhatsApp. We typically reply within minutes.</p>
              <a
                href="https://wa.me/919825413606?text=Hi%2C%20I%20want%20to%20plan%20an%20event.%20Can%20you%20share%20details%3F"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center bg-white text-green-600 px-6 py-3 font-bold hover:bg-green-50 transition-colors"
              >
                <MessageCircle className="mr-2 w-5 h-5" />
                Chat on WhatsApp
              </a>
            </div>
          </motion.div>

          {/* Contact Form - Below */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gray-50 p-8 border border-gray-100"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center" style={{ fontFamily: 'Playfair Display, serif' }}>Send Us a Message</h2>
            <p className="text-gray-600 mb-8 text-center">Fill out the form and we'll get back to you within 24 hours.</p>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="flex items-center gap-2 mb-2">
                    <User className="w-4 h-4 text-red-600" />
                    Full Name *
                  </Label>
                  <Input
                    id="name"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="p-4 border-2 focus:border-red-500 transition-colors"
                  />
                </div>
                <div>
                  <Label htmlFor="phone" className="flex items-center gap-2 mb-2">
                    <Phone className="w-4 h-4 text-red-600" />
                    Phone Number *
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+91 98254 13606"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="p-4 border-2 focus:border-red-500 transition-colors"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email" className="flex items-center gap-2 mb-2">
                    <Mail className="w-4 h-4 text-red-600" />
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="p-4 border-2 focus:border-red-500 transition-colors"
                  />
                </div>
                <div>
                  <Label htmlFor="eventType" className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-red-600" />
                    Event Type
                  </Label>
                  <select
                    id="eventType"
                    value={formData.eventType}
                    onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                    className="w-full p-4 border-2 focus:border-red-500 transition-colors bg-white text-gray-700"
                  >
                    <option value="">Select event type</option>
                    {eventTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <Label htmlFor="message" className="flex items-center gap-2 mb-2">
                  <MessageCircle className="w-4 h-4 text-red-600" />
                  Message *
                </Label>
                <Textarea
                  id="message"
                  placeholder="Tell us about your event requirements, guest count, preferred dates..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="p-4 border-2 min-h-[120px] focus:border-red-500 transition-colors"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <Button
                  type="submit"
                  className="bg-red-600 hover:bg-red-700 text-white py-6 rounded-md text-lg font-semibold transition-all duration-300"
                >
                  <Send className="mr-2 w-5 h-5" />
                  Send Message
                </Button>
                <Button
                  type="button"
                  onClick={handleSendWhatsApp}
                  className="bg-green-600 hover:bg-green-700 text-white py-6 rounded-md text-lg font-semibold transition-all duration-300"
                >
                  <MessageCircle className="mr-2 w-5 h-5" />
                  Send via WhatsApp
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Visit Our Office</h2>
            <p className="text-xl text-gray-600">Come meet us in person for a consultation</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="overflow-hidden shadow-lg bg-white"
          >
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3671.8957428524776!2d72.5917318!3d23.0787576!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e8363c5a639fb%3A0xf8887980584dde31!2sTSD%20Events%20and%20Decor!5e0!3m2!1sen!2sin!4v1740826412000"
              width="100%"
              height="500"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </motion.div>
        </div>
      </section>
    </div>
  );
}