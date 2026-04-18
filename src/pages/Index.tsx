import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users } from "lucide-react";
import { Link } from "react-router-dom";

export default function Index() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-lg">
            Paradise Awaits
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 drop-shadow">
            Experience luxury in the heart of Palawan, Philippines
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-6 text-lg">
              <Calendar className="mr-2 h-5 w-5" />
              Book Your Stay
            </Button>
            <Button size="lg" variant="outline" className="bg-white/10 backdrop-blur text-white border-white/30 hover:bg-white/20 px-8 py-6 text-lg">
              Explore Rooms
            </Button>
          </div>
        </div>
      </section>

      {/* Quick Info Bar */}
      <section className="bg-emerald-900 text-white py-6">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-center gap-8 md:gap-16">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-emerald-300" />
            <span>Palawan, Philippines</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-emerald-300" />
            <span>Beachfront Villas</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-emerald-300" />
            <span>Year-Round Paradise</span>
          </div>
        </div>
      </section>

      {/* Rooms Preview */}
      <section className="py-20 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4">Our Accommodations</h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            From garden retreats to beachfront villas, find your perfect escape
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Garden Suite", price: "₱8,000", image: "garden-suite" },
              { name: "Ocean View Villa", price: "₱15,000", image: "ocean-villa" },
              { name: "Beachfront Bungalow", price: "₱22,000", image: "beach-bungalow" },
            ].map((room) => (
              <div key={room.name} className="group relative rounded-2xl overflow-hidden shadow-lg">
                <img 
                  src={`https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&q=80`}
                  alt={room.name}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-0 p-6 text-white">
                  <h3 className="text-xl font-semibold">{room.name}</h3>
                  <p className="text-emerald-300">From {room.price}/night</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-10">
            <Button asChild variant="outline" className="border-emerald-600 text-emerald-600 hover:bg-emerald-50">
              <Link to="/rooms">View All Rooms →</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Activities Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4">Experiences</h2>
          <p className="text-gray-600 text-center mb-12">
            Discover the beauty of Palawan through curated activities
          </p>
          
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { name: "Island Hopping", icon: "🏝️" },
              { name: "Diving & Snorkeling", icon: "🤿" },
              { name: "Spa & Wellness", icon: "💆" },
              { name: "Fine Dining", icon: "🍽️" },
            ].map((activity) => (
              <div key={activity.name} className="text-center p-6 rounded-xl bg-stone-50 hover:bg-emerald-50 transition-colors">
                <span className="text-4xl mb-3 block">{activity.icon}</span>
                <h3 className="font-semibold text-gray-800">{activity.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-emerald-900 text-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl font-bold mb-4">Ready for Paradise?</h2>
          <p className="text-emerald-200 mb-8">
            Book your dream vacation in Palawan today and create memories that last forever
          </p>
          <Button size="lg" className="bg-white text-emerald-900 hover:bg-emerald-100 px-8 py-6">
            <Calendar className="mr-2 h-5 w-5" />
            Check Availability
          </Button>
        </div>
      </section>
    </div>
  );
}
