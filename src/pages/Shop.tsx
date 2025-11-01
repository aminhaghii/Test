import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Heart, Star } from "lucide-react";
import { toast } from "sonner";

const Shop = () => {
  const { elementRef: headerRef, isVisible: headerVisible } = useScrollReveal();
  const { elementRef: productsRef, isVisible: productsVisible } = useScrollReveal();
  const [cart, setCart] = useState<number>(0);

  const products = [
    { id: 1, name: "White Marble Tile", rating: 4.8, reviews: 24 },
    { id: 2, name: "Wood-Look Porcelain", rating: 4.9, reviews: 31 },
    { id: 3, name: "Concrete Ceramic", rating: 4.7, reviews: 18 },
    { id: 4, name: "Black Marble", rating: 4.9, reviews: 42 },
    { id: 6, name: "Modern Porcelain", rating: 4.6, reviews: 28 },
    { id: 7, name: "Mosaic Tile", rating: 4.8, reviews: 35 },
    { id: 8, name: "Cream Travertine", rating: 4.9, reviews: 22 },
  ];

  const addToCart = (productName: string) => {
    setCart(cart + 1);
    toast.success(`${productName} added to cart`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
        <div 
          ref={headerRef}
          className={`container mx-auto px-4 text-center transition-all duration-1000 ${
            headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Online Shop</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Easy product shopping with free shipping
          </p>
          {cart > 0 && (
            <div className="mt-6 inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full">
              <ShoppingCart className="h-5 w-5" />
              <span className="font-bold">{cart} items in cart</span>
            </div>
          )}
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 bg-background">
        <div 
          ref={productsRef}
          className={`container mx-auto px-4 transition-all duration-1000 ${
            productsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="overflow-hidden group hover:shadow-xl transition-all">
                <div className="aspect-square bg-gradient-to-br from-muted to-muted/50 relative overflow-hidden">
                  <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors" />
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="absolute top-2 left-2 bg-background/80 hover:bg-background"
                  >
                    <Heart className="h-5 w-5" />
                  </Button>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-bold text-lg mb-2">{product.name}</h3>
                  <div className="flex items-center gap-1 mb-3">
                    <Star className="h-4 w-4 fill-primary text-primary" />
                    <span className="font-medium">{product.rating}</span>
                    <span className="text-sm text-muted-foreground">({product.reviews})</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <Button 
                      size="sm"
                      onClick={() => addToCart(product.name)}
                      className="w-full"
                    >
                      Add to Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center p-6">
              <div className="text-4xl mb-4">🚚</div>
              <h3 className="text-xl font-bold mb-2">Free Shipping</h3>
              <p className="text-muted-foreground">For orders over 5 million Toman</p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-bold mb-2">Secure Payment</h3>
              <p className="text-muted-foreground">With trusted banking gateways</p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-4">↩️</div>
              <h3 className="text-xl font-bold mb-2">Return Policy</h3>
              <p className="text-muted-foreground">Up to 7 days return guarantee</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Shop;