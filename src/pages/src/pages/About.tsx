// src/pages/About.tsx
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold mb-4">About Palawan Collective</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Supporting local farmers and artisans in Palawan through fresh, 
          organic products delivered straight to your door.
        </p>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="space-y-6 text-lg">
          <p>
            We started with a simple mission: to connect the rich agricultural 
            heritage of Palawan with conscious consumers who value quality and sustainability.
          </p>
          <p>
            Every order supports local families and helps preserve traditional 
            farming methods in our beautiful island.
          </p>
        </div>

        <div className="mt-12 text-center">
          <Link to="/">
            <Button>Back to Shop</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About;
