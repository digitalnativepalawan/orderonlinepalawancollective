import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Package, ShoppingBag, Building, LogOut, Plus, Edit, Trash2 } from 'lucide-react';

export default function AdminDashboard() {
  const { products, orders, adminMode, setAdminMode, toggleAvailability, updateInventory, deleteProduct, addProduct, updateProduct, business, updateBusinessSettings } = useApp();
  const [selectedTab, setSelectedTab] = useState('products');
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Sausages',
    price: 0,
    unit: 'pack',
    inventory: 0,
    image: '',
    isAvailable: true
  });

  // Business settings form
  const [businessForm, setBusinessForm] = useState({
    businessName: business.businessName,
    phone: business.phone,
    email: business.email,
    facebook: business.facebook,
    instagram: business.instagram,
    address: business.address,
    logoBase64: business.logoBase64
  });

  const handleExitAdmin = () => {
    setAdminMode(false);
    window.location.href = "/";
  };

  const handleSaveProduct = async () => {
    if (editingProduct) {
      await updateProduct({ ...editingProduct, ...formData });
    } else {
      await addProduct(formData);
    }
    setIsDialogOpen(false);
    setEditingProduct(null);
    setFormData({ name: '', category: 'Sausages', price: 0, unit: 'pack', inventory: 0, image: '', isAvailable: true });
  };

  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price,
      unit: product.unit,
      inventory: product.inventory,
      image: product.image,
      isAvailable: product.isAvailable
    });
    setIsDialogOpen(true);
  };

  const handleSaveBusiness = async () => {
    await updateBusinessSettings(businessForm);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setBusinessForm({ ...businessForm, logoBase64: event.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  if (!adminMode) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Admin Access Required</h1>
        <p className="text-muted-foreground mb-4">Please log in as admin to access this page.</p>
        <Button onClick={() => window.location.href = "/"}>Return to Home</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <div className="sticky top-0 z-50 bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4 max-w-7xl flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground">Manage your store</p>
          </div>
          <Button variant="destructive" onClick={handleExitAdmin}>
            <LogOut className="h-4 w-4 mr-2" />
            Exit Admin
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="products">
              <Package className="h-4 w-4 mr-2" />
              Products
            </TabsTrigger>
            <TabsTrigger value="orders">
              <ShoppingBag className="h-4 w-4 mr-2" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Building className="h-4 w-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Product Management ({products.length} products)</h2>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => { setEditingProduct(null); setFormData({ name: '', category: 'Sausages', price: 0, unit: 'pack', inventory: 0, image: '', isAvailable: true }); }}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Name</Label>
                      <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                    </div>
                    <div>
                      <Label>Category</Label>
                      <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Sausages">Sausages</SelectItem>
                          <SelectItem value="Meats">Meats</SelectItem>
                          <SelectItem value="Seafood">Seafood</SelectItem>
                          <SelectItem value="Dairy's">Dairy's</SelectItem>
                          <SelectItem value="Pampangga's">Pampangga's</SelectItem>
                          <SelectItem value="Butter">Butter</SelectItem>
                          <SelectItem value="Syrup">Syrup</SelectItem>
                          <SelectItem value="Baking">Baking</SelectItem>
                          <SelectItem value="Fries">Fries</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Price (₱)</Label>
                        <Input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })} />
                      </div>
                      <div>
                        <Label>Unit</Label>
                        <Input value={formData.unit} onChange={(e) => setFormData({ ...formData, unit: e.target.value })} />
                      </div>
                    </div>
                    <div>
                      <Label>Inventory</Label>
                      <Input type="number" value={formData.inventory} onChange={(e) => setFormData({ ...formData, inventory: parseInt(e.target.value) })} />
                    </div>
                    <div>
                      <Label>Image URL</Label>
                      <Input value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} placeholder="https://..." />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Available for customers</Label>
                      <Switch checked={formData.isAvailable} onCheckedChange={(v) => setFormData({ ...formData, isAvailable: v })} />
                    </div>
                    <Button onClick={handleSaveProduct} className="w-full">Save Product</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="grid gap-4">
              {products.map(product => (
                <Card key={product.id}>
                  <CardContent className="flex flex-wrap items-center justify-between p-4 gap-4">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded" onError={(e) => { e.currentTarget.src = 'https://placehold.co/400x300/DDDDDD/555?text=Food'; }} />
                      <div className="min-w-0 flex-1">
                        <p className="font-medium truncate">{product.name}</p>
                        <p className="text-sm text-muted-foreground">₱{product.price}/{product.unit} | Stock: {product.inventory}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">Available</span>
                        <Switch checked={product.isAvailable} onCheckedChange={() => toggleAvailability(product.id)} />
                      </div>
                      <Button variant="outline" size="sm" onClick={() => handleEditProduct(product)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => deleteProduct(product.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <h2 className="text-xl font-semibold mb-6">Order Management ({orders.length} orders)</h2>
            <div className="space-y-4">
              {orders.length === 0 ? (
                <p className="text-center text-muted-foreground py-12">No orders yet</p>
              ) : (
                orders.map(order => (
                  <Card key={order.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold">Order #{order.id.slice(-6)}</p>
                          <p className="text-sm text-muted-foreground">{new Date(order.timestamp).toLocaleString()}</p>
                        </div>
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">{order.status}</span>
                      </div>
                      <p className="text-sm"><strong>Customer:</strong> {order.customer_name}</p>
                      <p className="text-sm"><strong>Phone:</strong> {order.customer_phone}</p>
                      <p className="text-sm"><strong>Delivery:</strong> {order.delivery_type}</p>
                      <div className="mt-2">
                        <strong>Items:</strong>
                        {order.items?.map((item: any, idx: number) => (
                          <p key={idx} className="text-sm ml-4">{item.quantity}x {item.name} - ₱{(item.price * item.quantity).toFixed(2)}</p>
                        ))}
                      </div>
                      <p className="font-bold mt-2">Total: ₱{order.total.toFixed(2)}</p>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <h2 className="text-xl font-semibold mb-6">Business Settings</h2>
            <Card>
              <CardContent className="p-6 space-y-4">
                <div>
                  <Label>Business Logo</Label>
                  <input type="file" accept="image/*" onChange={handleLogoUpload} className="mt-1 block w-full text-sm" />
                  {businessForm.logoBase64 && (
                    <img src={businessForm.logoBase64} alt="Logo preview" className="mt-2 h-20 object-contain" />
                  )}
                </div>
                <div>
                  <Label>Business Name</Label>
                  <Input value={businessForm.businessName} onChange={(e) => setBusinessForm({ ...businessForm, businessName: e.target.value })} />
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input value={businessForm.phone} onChange={(e) => setBusinessForm({ ...businessForm, phone: e.target.value })} />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input value={businessForm.email} onChange={(e) => setBusinessForm({ ...businessForm, email: e.target.value })} />
                </div>
                <div>
                  <Label>Facebook</Label>
                  <Input value={businessForm.facebook} onChange={(e) => setBusinessForm({ ...businessForm, facebook: e.target.value })} />
                </div>
                <div>
                  <Label>Instagram</Label>
                  <Input value={businessForm.instagram} onChange={(e) => setBusinessForm({ ...businessForm, instagram: e.target.value })} />
                </div>
                <div>
                  <Label>Address</Label>
                  <Input value={businessForm.address} onChange={(e) => setBusinessForm({ ...businessForm, address: e.target.value })} />
                </div>
                <Button onClick={handleSaveBusiness}>Save Business Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
