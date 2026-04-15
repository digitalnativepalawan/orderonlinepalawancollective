import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Tag } from "lucide-react";

// Static specials data (we'll make this dynamic from Supabase later)
const specialsData = [
  {
    id: 1,
    title: "Weekend Bundle Deal",
    description: "Get 20% off on all vegetable bundles every Saturday and Sunday!",
    discount: "20% OFF",
    validUntil: "Every Weekend",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=300&fit=crop",
    isActive: true,
  },
  {
    id: 2,
    title: "First Order Discount",
    description: "New customer? Get ₱100 off your first order of ₱500 or more!",
    discount: "₱100 OFF",
    validUntil: "Ongoing",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=300&fit=crop",
    isActive: true,
  },
  {
    id: 3,
    title: "Free Delivery",
    description: "Free delivery for orders above ₱1,500 within Palawan area!",
    discount: "FREE DELIVERY",
    validUntil: "Ongoing",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=300&fit=crop",
    isActive: true,
  },
];

export default function Specials() {
  const activeSpecials = specialsData.filter(s => s.isActive);

  return (
    <div className="container max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
          🔥 Special Promotions
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Check out our latest deals and save big on your favorite products!
        </p>
      </div>

      {/* Specials Grid */}
      {activeSpecials.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeSpecials.map((special) => (
            <Card key={special.id} className="overflow-hidden border-border hover:shadow-lg transition-shadow">
              <CardHeader className="p-0">
                <div className="relative h-48 bg-secondary">
                  <img
                    src={special.image}
                    alt={special.title}
                    className="w-full h-full object-cover"
                  />
                  <Badge className="absolute top-3 right-3 bg-destructive text-destructive-foreground font-bold">
                    {special.discount}
                  </Badge>
                </div>
                <CardTitle className="p-4 text-lg">{special.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">{special.description}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock size={14} />
                  <span>Valid: {special.validUntil}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <Tag size={48} className="mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">No Specials Available</h2>
          <p className="text-muted-foreground">Check back later for new promotions!</p>
        </div>
      )}

      {/* CTA Section */}
      <div className="mt-12 text-center">
        <p className="text-muted-foreground mb-4">
          Want to be notified about new specials?
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <a
            href="https://wa.me/639917093792"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:opacity-90 transition-opacity"
          >
            <Clock size={18} />
            Contact Us on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
