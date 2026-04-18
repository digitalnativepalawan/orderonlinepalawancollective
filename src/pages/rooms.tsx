import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wifi, Car, Utensils, Waves, Users, BedDouble } from "lucide-react";
import { useState } from "react";

const rooms = [
  {
    id: 1,
    name: "Garden Suite",
    description: "A peaceful retreat surrounded by tropical gardens",
    price: 8000,
    capacity: 2,
    size: "45 sqm",
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80",
    amenities: ["King Bed", "Garden View", "Mini Bar", "Safe"],
  },
  {
    id: 2,
    name: "Ocean View Villa",
    description: "Stunning ocean views with modern amenities",
    price: 15000,
    capacity: 4,
    size: "75 sqm",
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80",
    amenities: ["King Bed + Twin Beds", "Ocean View", "Private Balcony", "Jacuzzi"],
  },
  {
    id: 3,
    name: "Beachfront Bungalow",
    description: "Direct beach access with luxury furnishings",
    price: 22000,
    capacity: 6,
    size: "120 sqm",
    image: "https://images.unsplash.com/photo-1499793983690-d291fd7ae491?w=800&q=80",
    amenities: ["2 Bedrooms", "Private Pool", "Beach Access", "Butler Service"],
  },
  {
    id: 4,
    name: "Presidential Suite",
    description: "Ultimate luxury with panoramic views",
    price: 45000,
    capacity: 8,
    size: "200 sqm",
    image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&q=80",
    amenities: ["3 Bedrooms", "Private Pool", "Chef Kitchen", "Private Staff"],
  },
];

export default function Rooms() {
  const [selectedRoom, setSelectedRoom] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <div className="relative h-[40vh] flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1566073771259-6a5e09b5a54e?w=1920&q=80')",
          }}
        >
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <h1 className="relative z-10 text-5xl font-bold text-white">Our Rooms</h1>
      </div>

      {/* Rooms Grid */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-8">
          {rooms.map((room) => (
            <Card key={room.id} className="overflow-hidden hover:shadow-xl transition-shadow">
              <div className="relative h-64">
                <img src={room.image} alt={room.name} className="w-full h-full object-cover" />
                <div className="absolute top-4 right-4">
                  <Badge className="bg-emerald-600">₱{room.price.toLocaleString()}/night</Badge>
                </div>
              </div>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-2xl font-bold">{room.name}</h2>
                  <div className="flex items-center gap-1 text-gray-500">
                    <Users className="h-4 w-4" />
                    <span>{room.capacity}</span>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">{room.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {room.amenities.map((amenity) => (
                    <Badge key={amenity} variant="outline" className="border-emerald-200 text-emerald-700">
                      {amenity}
                    </Badge>
                  ))}
                </div>
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                  Book This Room
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
