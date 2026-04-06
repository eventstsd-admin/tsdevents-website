import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router';
import {
  Check,
  ChevronRight,
  ChevronLeft,
  Heart,
  Briefcase,
  PartyPopper,
  Music,
  Calendar as CalendarIcon,
  MapPin,
  Users,
  Palette,
  Utensils,
  Camera,
  CheckCircle,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { toast } from 'sonner';

const eventTypes = [
  { id: 'wedding', name: 'Wedding', icon: Heart, color: 'bg-red-500' },
  { id: 'corporate', name: 'Corporate Event', icon: Briefcase, color: 'bg-blue-500' },
  { id: 'party', name: 'Private Party', icon: PartyPopper, color: 'bg-purple-500' },
  { id: 'concert', name: 'Concert/Show', icon: Music, color: 'bg-amber-500' },
];

const services = [
  { id: 'decor', name: 'Decoration', icon: Palette },
  { id: 'catering', name: 'Catering', icon: Utensils },
  { id: 'photography', name: 'Photography', icon: Camera },
  { id: 'entertainment', name: 'Entertainment', icon: Music },
];

export function BookingFlow() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    eventType: '',
    date: '',
    location: '',
    guests: '',
    services: [] as string[],
    budget: '',
    name: '',
    email: '',
    phone: '',
    notes: '',
  });

  const steps = [
    { number: 1, title: 'Event Type', description: 'Select your event' },
    { number: 2, title: 'Details', description: 'Date & Location' },
    { number: 3, title: 'Customize', description: 'Services & Budget' },
    { number: 4, title: 'Confirm', description: 'Review & Book' },
  ];

  const handleNext = () => {
    if (currentStep === 1 && !formData.eventType) {
      toast.error('Please select an event type');
      return;
    }
    if (currentStep === 2 && (!formData.date || !formData.location || !formData.guests)) {
      toast.error('Please fill all required fields');
      return;
    }
    if (currentStep === 3 && (formData.services.length === 0 || !formData.budget)) {
      toast.error('Please select services and budget');
      return;
    }
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.email || !formData.phone) {
      toast.error('Please fill all contact details');
      return;
    }
    toast.success('Booking request submitted successfully! We will contact you shortly.');
    setTimeout(() => navigate('/'), 2000);
  };

  const toggleService = (serviceId: string) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.includes(serviceId)
        ? prev.services.filter((s) => s !== serviceId)
        : [...prev.services, serviceId],
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Progress Indicator */}
        <div className="pt-32 pb-12">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, idx) => (
              <div key={step.number} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-12 h-12 flex items-center justify-center font-bold text-white mb-2 ${
                      currentStep >= step.number ? 'bg-amber-500 shadow-md' : 'bg-gray-300'
                    }`}
                  >
                    {currentStep > step.number ? (
                      <Check className="w-6 h-6" />
                    ) : (
                      step.number
                    )}
                  </div>
                  <div className="text-center">
                    <p
                      className={`font-semibold ${
                        currentStep >= step.number ? 'text-gray-900' : 'text-gray-400'
                      }`}
                    >
                      {step.title}
                    </p>
                    <p className="text-xs text-gray-500">{step.description}</p>
                  </div>
                </div>
                {idx < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-4 ${
                      currentStep > step.number ? 'bg-amber-500' : 'bg-gray-300'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white shadow-sm p-8 md:p-12"
          >
            {/* Step 1: Event Type */}
            {currentStep === 1 && (
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-3">Select Event Type</h2>
                <p className="text-gray-600 mb-8">Choose the type of event you're planning</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {eventTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <button
                        key={type.id}
                        onClick={() =>
                          setFormData((prev) => ({ ...prev, eventType: type.id }))
                        }
                        className={`relative p-8 border-2 transition-all shadow-sm hover:shadow-md overflow-hidden group flex items-center justify-center ${
                          formData.eventType === type.id
                            ? 'border-red-500 bg-red-50'
                            : 'border-gray-200 hover:border-red-400 bg-white'
                        }`}
                      >
                        {formData.eventType === type.id && (
                          <div className="absolute top-4 right-4 bg-red-800 text-white p-2 shadow-md z-20">
                            <Check className="w-5 h-5" />
                          </div>
                        )}
                        
                        <div className="relative z-10 flex flex-col items-center">
                          <div
                            className={`w-20 h-20 ${type.color} flex items-center justify-center mb-4 shadow-md flex-shrink-0`}
                          >
                            <Icon className="w-10 h-10 text-white" />
                          </div>
                          <h3 className="text-2xl font-bold text-gray-900 group-hover:text-red-800 transition-colors text-center">{type.name}</h3>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 2: Date & Location */}
            {currentStep === 2 && (
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-3">Event Details</h2>
                <p className="text-gray-600 mb-8">When and where is your event?</p>
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="date" className="text-lg font-semibold mb-2 flex items-center">
                      <CalendarIcon className="w-5 h-5 mr-2 text-amber-500" />
                      Event Date
                    </Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, date: e.target.value }))
                      }
                      className="text-lg p-6 border-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="location" className="text-lg font-semibold mb-2 flex items-center">
                      <MapPin className="w-5 h-5 mr-2 text-amber-500" />
                      Event Location
                    </Label>
                    <Input
                      id="location"
                      placeholder="City or venue name"
                      value={formData.location}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, location: e.target.value }))
                      }
                      className="text-lg p-6 border-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="guests" className="text-lg font-semibold mb-2 flex items-center">
                      <Users className="w-5 h-5 mr-2 text-amber-500" />
                      Number of Guests
                    </Label>
                    <Input
                      id="guests"
                      type="number"
                      placeholder="Estimated guest count"
                      value={formData.guests}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, guests: e.target.value }))
                      }
                      className="text-lg p-6 border-2"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Customize */}
            {currentStep === 3 && (
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-3">Customize Your Event</h2>
                <p className="text-gray-600 mb-8">Select services and set your budget</p>
                <div className="space-y-8">
                  <div>
                    <Label className="text-lg font-semibold mb-4 block">Services Required</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {services.map((service) => {
                        const Icon = service.icon;
                        return (
                          <button
                            key={service.id}
                            onClick={() => toggleService(service.id)}
                            className={`relative p-6 border-2 transition-all shadow-sm hover:shadow-md overflow-hidden group flex flex-col items-center justify-center text-center ${
                              formData.services.includes(service.id)
                                ? 'border-red-500 bg-red-50'
                                : 'border-gray-200 hover:border-red-400 bg-white'
                            }`}
                          >
                            {formData.services.includes(service.id) && (
                              <div className="absolute top-2 right-2 z-10">
                                <div className="bg-red-800 text-white p-1 shadow-md">
                                  <Check className="w-4 h-4" />
                                </div>
                              </div>
                            )}
                            
                            <div className="relative z-10 mb-2">
                              <Icon className="w-8 h-8 text-red-700 group-hover:text-red-800 transition-colors" />
                            </div>
                            <p className="font-semibold text-gray-900 text-sm group-hover:text-red-800 transition-colors relative z-10">
                              {service.name}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="budget" className="text-lg font-semibold mb-2 block">
                      Budget Range
                    </Label>
                    <select
                      id="budget"
                      value={formData.budget}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, budget: e.target.value }))
                      }
                      className="w-full p-4 border-2 text-lg"
                    >
                      <option value="">Select your budget</option>
                      <option value="basic">Rs.2-4 Lakh (Basic)</option>
                      <option value="premium">Rs.5-8 Lakh (Premium)</option>
                      <option value="luxury">Rs.10+ Lakh (Luxury)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Confirm */}
            {currentStep === 4 && (
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-3">Review & Confirm</h2>
                <p className="text-gray-600 mb-8">
                  Please verify your details and provide contact information
                </p>
                <div className="space-y-8">
                  {/* Summary */}
                  <div className="bg-gray-50 p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Booking Summary</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Event Type:</span>
                        <span className="font-semibold text-gray-900 capitalize">
                          {formData.eventType}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Date:</span>
                        <span className="font-semibold text-gray-900">{formData.date}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Location:</span>
                        <span className="font-semibold text-gray-900">{formData.location}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Guests:</span>
                        <span className="font-semibold text-gray-900">{formData.guests}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Services:</span>
                        <span className="font-semibold text-gray-900 capitalize">
                          {formData.services.join(', ')}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Budget:</span>
                        <span className="font-semibold text-gray-900 capitalize">
                          {formData.budget}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Contact Form */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-900">Contact Information</h3>
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        placeholder="Your name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, name: e.target.value }))
                        }
                        className="p-4"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, email: e.target.value }))
                        }
                        className="p-4"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+91 98254 13606"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, phone: e.target.value }))
                        }
                        className="p-4"
                      />
                    </div>
                    <div>
                      <Label htmlFor="notes">Additional Notes (Optional)</Label>
                      <Textarea
                        id="notes"
                        placeholder="Any special requirements or preferences..."
                        value={formData.notes}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, notes: e.target.value }))
                        }
                        className="p-4 min-h-[100px]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-12">
              <Button
                onClick={handleBack}
                disabled={currentStep === 1}
                variant="outline"
                className="px-8 py-6 text-lg"
              >
                <ChevronLeft className="mr-2" />
                Back
              </Button>
              {currentStep < 4 ? (
                <Button
                  onClick={handleNext}
                  className="bg-red-800 hover:bg-red-900 text-white px-8 py-6 text-lg"
                >
                  Next
                  <ChevronRight className="ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg"
                >
                  <CheckCircle className="mr-2" />
                  Submit Booking
                </Button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}