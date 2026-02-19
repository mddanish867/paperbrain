import React, { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Marketing Director, TechCorp",
      avatar: "/client1.png",
      content: "AutoDocuGen has transformed how we manage our documentation. We've seen a 40% increase in productivity since we started using it."
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Social Media Manager, Startup Inc",
      avatar: "/client2.png",
      content: "The automated documentation features give us insights we never had before. It's like having a documentation expert on the team."
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      role: "Founder, Design Studio",
      avatar: "/client3.png",
      content: "As a small business owner, AutoDocuGen has saved me countless hours. I can now generate all my documents in just minutes."
    },
    {
      id: 4,
      name: "David Wilson",
      role: "CTO, FinTech Solutions",
      avatar: "/client4.png",
      content: "The accuracy and speed of AutoDocuGen's document generation is remarkable. It's become an essential tool for our compliance department."
    },
    {
      id: 5,
      name: "Lisa Thompson",
      role: "Operations Manager, HealthPlus",
      avatar: "/client5.jpg",
      content: "We've reduced document creation time by 70% with AutoDocuGen. The templates are comprehensive and easy to customize."
    },
    {
      id: 6,
      name: "Robert Kim",
      role: "CEO, Innovate Labs",
      avatar: "/vite.svg",
      content: "AutoDocuGen has streamlined our entire documentation process. It's a game-changer for our business operations."
    }
  ]

  const [currentIndex, setCurrentIndex] = useState(0)

  const nextTestimonial = () => {
    if (currentIndex < testimonials.length - 3) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const prevTestimonial = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  // Get 3 testimonials to show based on current index
  const visibleTestimonials = testimonials.slice(currentIndex, currentIndex + 3)

  return (
    <section id="testimonials" className="w-full py-12 md:py-24 lg:py-32 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header Section - Centered */}
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-blue-100 px-3 py-1 text-sm text-blue-700">
              Testimonials
            </div>
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
              Loved by businesses worldwide
            </h2>
            <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mx-auto">
              See what our customers have to say about AutoDocuGen.
            </p>
          </div>
        </div>

        {/* Testimonials Container with Navigation */}
        <div className="relative max-w-5xl mx-auto">
          {/* Navigation Arrows */}
          <button
            onClick={prevTestimonial}
            disabled={currentIndex === 0}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-8 z-10 
              p-2 rounded-md bg-white shadow-lg border border-gray-200 hover:bg-blue-50 
              transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>

          <button
            onClick={nextTestimonial}
            disabled={currentIndex >= testimonials.length - 3}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-8 z-10 
              p-2 rounded-md bg-white shadow-lg border border-gray-200 hover:bg-blue-50 
              transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-6 h-6 text-gray-700" />
          </button>

          {/* Testimonials Grid - Shows exactly 3 */}
          <div className="mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {visibleTestimonials.map((testimonial) => (
              <div key={testimonial.id} className="flex flex-col rounded-lg border border-blue-100 bg-white p-6">
                <div className="flex items-center space-x-2">
                  <div className="flex-shrink-0">
                    <img
                      src={testimonial.avatar}
                      width={40}
                      height={40}
                      alt="User avatar"
                      className="h-10 w-10 rounded-full"
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold">{testimonial.name}</h4>
                    <p className="text-xs text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
                <p className="mt-4 text-sm text-gray-600">
                  "{testimonial.content}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Testimonials