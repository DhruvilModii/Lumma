import React, { useState, useEffect } from 'react';
import { ShoppingBag, User, LogOut, Plus, Minus, Star, Heart, Sparkles, Package, ShieldCheck } from 'lucide-react';

const LOCAL_USER_KEY = 'lumina-user';
const LOCAL_CART_KEY = 'lumina-cart';

const sampleProducts = [
  {
    id: '1',
    name: 'Silk Cashmere Scarf',
    category: 'Accessories',
    price: 145,
    description: 'A soft, sculptural scarf made from the finest cashmere blend.',
    image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: '2',
    name: 'Minimalist Leather Tote',
    category: 'Bags',
    price: 220,
    description: 'A refined everyday tote with clean lines and premium leather.',
    image: 'https://images.unsplash.com/photo-1495121605193-b116b5b9c5d1?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: '3',
    name: 'Modern Wool Coat',
    category: 'Outerwear',
    price: 395,
    description: 'A structured wool coat with minimalist tailoring and luxe finish.',
    image: 'https://images.unsplash.com/photo-1521120098171-3b95c01706c8?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: '4',
    name: 'Classic Runner Sneakers',
    category: 'Footwear',
    price: 180,
    description: 'Contemporary sneakers crafted for everyday comfort and style.',
    image: 'https://images.unsplash.com/photo-1528701800489-20ec48c77dd3?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: '5',
    name: 'Organic Linen Shirt',
    category: 'Clothing',
    price: 110,
    description: 'A breathable linen shirt designed for relaxed luxury.',
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: '6',
    name: 'Fine Knit Sweater',
    category: 'Clothing',
    price: 155,
    description: 'Lightweight knitwear with an elevated, everyday silhouette.',
    image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&q=80',
  },
];

const categories = ['All', 'Accessories', 'Bags', 'Outerwear', 'Footwear', 'Clothing'];

function loadJson(key, fallback) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
}

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [user, setUser] = useState(() => loadJson(LOCAL_USER_KEY, null));
  const [cart, setCart] = useState(() => loadJson(LOCAL_CART_KEY, []));
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    if (!user) return setCurrentPage('login');

    setCart((current) => {
      const existing = current.find((item) => item.id === product.id);
      if (existing) {
        return current.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...current, { ...product, quantity: 1 }];
    });
  };

  const updateQty = (id, delta) => {
    setCart((current) =>
      current
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + delta } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleAuthSubmit = (email) => {
    setUser({ email });
    setCurrentPage('home');
  };

  const signOut = () => {
    setUser(null);
    setCurrentPage('home');
  };

  const filteredProducts = sampleProducts.filter((product) => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase()) || product.description.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#F7F4EB] text-[#313852]">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/70 bg-white/90 backdrop-blur-lg shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-4">
          <button className="text-2xl font-black tracking-[0.3em] uppercase text-[#23273D]" onClick={() => setCurrentPage('home')}>
            LUMINA
          </button>

          <div className="hidden items-center gap-8 md:flex text-xs uppercase tracking-[0.3em] text-gray-500">
            <button onClick={() => setCurrentPage('home')} className={currentPage === 'home' ? 'text-[#23273D]' : ''}>
              Home
            </button>
            <button onClick={() => setCurrentPage('products')} className={currentPage === 'products' ? 'text-[#23273D]' : ''}>
              Shop
            </button>
            <button onClick={() => setCurrentPage('cart')} className={currentPage === 'cart' ? 'text-[#23273D]' : ''}>
              Cart
            </button>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={() => setCurrentPage('cart')} className="relative rounded-2xl border border-gray-200 bg-white p-3 shadow-sm transition hover:border-gray-300">
              <ShoppingBag size={20} />
              {cart.length > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-[#23273D] text-[10px] text-white">
                  {cart.length}
                </span>
              )}
            </button>
            {user ? (
              <button onClick={signOut} className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-[#23273D] shadow-sm transition hover:border-gray-300">
                Logout
              </button>
            ) : (
              <button onClick={() => setCurrentPage('login')} className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-[#23273D] shadow-sm transition hover:border-gray-300">
                Login
              </button>
            )}
          </div>
        </div>
      </nav>

      <main className="pt-28">
        {currentPage === 'home' && (
          <>
            <section className="relative overflow-hidden bg-[#F2EFE9] pb-28 pt-20">
              <div className="absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_top_right,_rgba(49,56,82,0.15),_transparent_40%)]" />
              <div className="mx-auto flex max-w-7xl flex-col gap-16 px-8 lg:flex-row lg:items-center lg:justify-between lg:px-10">
                <div className="max-w-2xl space-y-8">
                  <div className="inline-flex items-center gap-3 rounded-full bg-white/80 px-4 py-2 text-xs uppercase tracking-[0.35em] text-[#313852] shadow-sm">
                    <Sparkles size={16} />
                    Limited Edition Launch
                  </div>
                  <div className="space-y-6">
                    <h1 className="text-6xl font-black leading-tight tracking-tight text-[#23273D] md:text-7xl">
                      Quiet luxury made for every day.
                    </h1>
                    <p className="max-w-xl text-lg leading-8 text-[#5A5F71]">
                      Discover effortless silhouettes and premium essentials curated for modern minimalist living. From tailored outerwear to statement accessories, every piece is designed to refine your wardrobe.
                    </p>
                  </div>
                  <div className="flex flex-col gap-4 sm:flex-row">
                    <button onClick={() => setCurrentPage('products')} className="inline-flex items-center justify-center rounded-full bg-[#23273D] px-8 py-4 text-sm font-semibold text-white shadow-lg transition hover:bg-black">
                      Shop the Collection
                    </button>
                    <button onClick={() => setCurrentPage('products')} className="inline-flex items-center justify-center rounded-full border border-gray-300 bg-white px-8 py-4 text-sm font-semibold text-[#23273D] transition hover:border-gray-400">
                      Explore new arrivals
                    </button>
                  </div>
                </div>

                <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:max-w-2xl">
                  {sampleProducts.slice(0, 4).map((product) => (
                    <div key={product.id} className="group overflow-hidden rounded-[2rem] bg-white shadow-[0_20px_60px_rgba(49,56,82,0.08)] transition hover:-translate-y-1">
                      <img src={product.image} alt={product.name} className="h-80 w-full object-cover transition duration-500 group-hover:scale-105" />
                      <div className="space-y-3 p-6">
                        <span className="text-xs uppercase tracking-[0.35em] text-gray-400">{product.category}</span>
                        <h2 className="text-xl font-bold text-[#23273D]">{product.name}</h2>
                        <p className="text-sm leading-6 text-[#6B7185]">{product.description}</p>
                        <div className="flex items-center justify-between pt-4">
                          <span className="text-lg font-bold">{formatCurrency(product.price)}</span>
                          <button onClick={() => addToCart(product)} className="rounded-full bg-[#23273D] px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-white transition hover:bg-black">
                            Add
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="bg-white px-8 py-20 lg:px-10">
              <div className="mx-auto max-w-7xl">
                <div className="grid gap-8 lg:grid-cols-3">
                  <div className="space-y-4 rounded-[2rem] border border-gray-200 bg-[#F9F8F5] p-8 shadow-sm">
                    <div className="inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-[#23273D] text-white">
                      <Package size={24} />
                    </div>
                    <h3 className="text-xl font-bold">Refined craftsmanship</h3>
                    <p className="text-sm leading-7 text-[#616575]">Each piece is crafted from premium materials and designed for lasting style.</p>
                  </div>
                  <div className="space-y-4 rounded-[2rem] border border-gray-200 bg-[#F9F8F5] p-8 shadow-sm">
                    <div className="inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-[#23273D] text-white">
                      <ShieldCheck size={24} />
                    </div>
                    <h3 className="text-xl font-bold">Trusted quality</h3>
                    <p className="text-sm leading-7 text-[#616575]">Premium finishes and attention to detail make every item feel luxurious.</p>
                  </div>
                  <div className="space-y-4 rounded-[2rem] border border-gray-200 bg-[#F9F8F5] p-8 shadow-sm">
                    <div className="inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-[#23273D] text-white">
                      <Heart size={24} />
                    </div>
                    <h3 className="text-xl font-bold">Capsule elegance</h3>
                    <p className="text-sm leading-7 text-[#616575]">Designed to mix seamlessly, our pieces become effortless wardrobe essentials.</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="px-8 py-20 lg:px-10">
              <div className="mx-auto max-w-7xl">
                <div className="flex flex-col gap-16 lg:flex-row lg:items-center lg:justify-between">
                  <div className="max-w-2xl space-y-6">
                    <p className="text-sm uppercase tracking-[0.45em] text-[#7B8191]">Featured collection</p>
                    <h2 className="text-4xl font-black leading-tight text-[#23273D]">Discover pieces with standout details.</h2>
                    <p className="text-base leading-8 text-[#5A5F71]">A refined edit of elevated essentials and modern staples, curated for polished everyday dressing.</p>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2 lg:w-[38rem]">
                    <div className="rounded-[2rem] bg-[#23273D] p-8 text-white shadow-lg">
                      <div className="flex items-center gap-3 text-sm uppercase tracking-[0.35em] text-[#A5A9B7]">New</div>
                      <p className="mt-6 text-2xl font-bold">Timeless silhouettes</p>
                    </div>
                    <div className="rounded-[2rem] bg-[#F2EFE9] p-8 shadow-sm">
                      <div className="flex items-center gap-3 text-sm uppercase tracking-[0.35em] text-[#7B8191]">Style</div>
                      <p className="mt-6 text-2xl font-bold text-[#23273D]">Everyday luxury.</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <footer className="border-t border-gray-200 bg-[#23273D] px-8 py-16 text-white lg:px-10">
              <div className="mx-auto flex max-w-7xl flex-col gap-10 lg:flex-row lg:justify-between">
                <div className="max-w-xl space-y-4">
                  <h2 className="text-3xl font-black">LUMINA</h2>
                  <p className="text-sm leading-7 text-[#B7BAC4]">A modern luxury boutique built for quiet style and elevated essentials.</p>
                </div>
                <div className="grid gap-8 sm:grid-cols-3">
                  <div>
                    <h3 className="text-sm uppercase tracking-[0.35em] text-[#8F93A3]">Shop</h3>
                    <ul className="mt-4 space-y-3 text-sm text-[#B7BAC4]">
                      <li>New arrivals</li>
                      <li>Best sellers</li>
                      <li>Gift cards</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-sm uppercase tracking-[0.35em] text-[#8F93A3]">Company</h3>
                    <ul className="mt-4 space-y-3 text-sm text-[#B7BAC4]">
                      <li>About</li>
                      <li>Careers</li>
                      <li>Contact</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-sm uppercase tracking-[0.35em] text-[#8F93A3]">Support</h3>
                    <ul className="mt-4 space-y-3 text-sm text-[#B7BAC4]">
                      <li>Shipping</li>
                      <li>Returns</li>
                      <li>Privacy</li>
                    </ul>
                  </div>
                </div>
              </div>
            </footer>
          </>
        )}

        {currentPage === 'products' && (
          <section className="px-8 py-20 lg:px-10">
            <div className="mx-auto max-w-7xl">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.35em] text-[#7B8191]">Shop the edit</p>
                  <h1 className="mt-4 text-4xl font-black text-[#23273D]">Modern essentials for refined living.</h1>
                </div>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <div className="rounded-full border border-gray-200 bg-white p-3 shadow-sm">
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search products"
                      className="w-72 border-0 bg-transparent text-sm text-[#23273D] outline-none placeholder:text-[#A5A9B7]"
                    />
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`rounded-full border px-4 py-2 text-sm transition ${selectedCategory === category ? 'border-black bg-black text-white' : 'border-gray-200 bg-white text-[#23273D]'}`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-12 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="overflow-hidden rounded-[2rem] bg-white shadow-[0_20px_80px_rgba(49,56,82,0.08)]">
                    <img src={product.image} alt={product.name} className="h-80 w-full object-cover" />
                    <div className="space-y-4 p-6">
                      <div className="flex items-center justify-between text-xs uppercase tracking-[0.35em] text-[#7B8191]">
                        <span>{product.category}</span>
                        <span className="inline-flex items-center gap-1 text-[#F59E0B]">
                          <Star size={14} /> 4.9
                        </span>
                      </div>
                      <div className="space-y-3">
                        <h2 className="text-2xl font-bold text-[#23273D]">{product.name}</h2>
                        <p className="text-sm leading-7 text-[#6B7185]">{product.description}</p>
                      </div>
                      <div className="flex items-center justify-between gap-4 pt-4">
                        <div>
                          <p className="text-sm uppercase tracking-[0.3em] text-[#7B8191]">Starting at</p>
                          <p className="text-xl font-black">{formatCurrency(product.price)}</p>
                        </div>
                        <button onClick={() => addToCart(product)} className="rounded-full bg-[#23273D] px-5 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-black">
                          Add to bag
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {currentPage === 'cart' && (
          <section className="px-8 py-20 lg:px-10">
            <div className="mx-auto max-w-6xl space-y-8">
              <div className="rounded-[2rem] bg-white p-10 shadow-[0_20px_60px_rgba(49,56,82,0.08)]">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.35em] text-[#7B8191]">Your basket</p>
                    <h1 className="mt-3 text-4xl font-black text-[#23273D]">Ready for checkout</h1>
                  </div>
                  <div className="rounded-full border border-gray-200 bg-[#F2EFE9] px-6 py-4 text-sm uppercase tracking-[0.35em] text-[#23273D]">
                    {cart.length} products
                  </div>
                </div>

                {cart.length === 0 ? (
                  <div className="mt-10 rounded-[2rem] border border-dashed border-gray-300 bg-[#F9F8F5] p-12 text-center text-[#616575]">
                    Your cart is empty. Add something beautiful to your collection.
                  </div>
                ) : (
                  <div className="mt-10 space-y-6">
                    {cart.map((item) => (
                      <div key={item.id} className="grid gap-6 rounded-[2rem] border border-gray-200 p-6 md:grid-cols-[auto_1fr_auto] md:items-center">
                        <img src={item.image} alt={item.name} className="h-28 w-28 rounded-3xl object-cover" />
                        <div>
                          <h2 className="text-xl font-bold text-[#23273D]">{item.name}</h2>
                          <p className="mt-2 text-sm text-[#6B7185]">{item.category}</p>
                          <p className="mt-3 text-lg font-semibold text-[#23273D]">{formatCurrency(item.price)}</p>
                        </div>
                        <div className="flex items-center gap-4 rounded-full bg-[#F3F2EE] p-3">
                          <button onClick={() => updateQty(item.id, -1)} className="rounded-full bg-white p-2 shadow-sm">
                            <Minus size={14} />
                          </button>
                          <span className="font-black">{item.quantity}</span>
                          <button onClick={() => updateQty(item.id, 1)} className="rounded-full bg-white p-2 shadow-sm">
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                    ))}

                    <div className="rounded-[2rem] border border-gray-200 bg-[#F2EFE9] p-8 md:flex md:items-center md:justify-between">
                      <div>
                        <p className="text-sm uppercase tracking-[0.35em] text-[#7B8191]">Order summary</p>
                        <p className="mt-3 text-2xl font-black text-[#23273D]">Subtotal {formatCurrency(cartTotal)}</p>
                      </div>
                      <button className="mt-6 rounded-full bg-[#23273D] px-8 py-4 text-sm font-semibold uppercase tracking-[0.25em] text-white transition hover:bg-black md:mt-0">
                        Proceed to Checkout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {(currentPage === 'login' || currentPage === 'signup') && (
          <section className="px-8 py-20 lg:px-10">
            <div className="mx-auto max-w-md rounded-[3rem] bg-white p-10 shadow-[0_25px_70px_rgba(49,56,82,0.12)]">
              <div className="space-y-4 text-center">
                <p className="text-sm uppercase tracking-[0.35em] text-[#7B8191]">Welcome back</p>
                <h1 className="text-4xl font-black text-[#23273D] capitalize">{currentPage}</h1>
                <p className="text-sm leading-7 text-[#6B7185]">
                  Enter your email and password to continue shopping the Lumina collection.
                </p>
              </div>
              <form
                className="mt-10 space-y-6"
                onSubmit={(e) => {
                  e.preventDefault();
                  const email = e.target.email.value;
                  handleAuthSubmit(email);
                }}
              >
                <input name="email" type="email" placeholder="Email" className="w-full rounded-3xl border border-gray-200 bg-[#F8F7F3] px-5 py-4 text-sm text-[#23273D] outline-none focus:border-[#23273D]" required />
                <input name="password" type="password" placeholder="Password" className="w-full rounded-3xl border border-gray-200 bg-[#F8F7F3] px-5 py-4 text-sm text-[#23273D] outline-none focus:border-[#23273D]" required />
                <button className="w-full rounded-full bg-[#23273D] px-5 py-4 text-sm font-semibold uppercase tracking-[0.25em] text-white transition hover:bg-black">
                  Continue
                </button>
              </form>
              <button type="button" onClick={() => setCurrentPage(currentPage === 'login' ? 'signup' : 'login')} className="mt-6 w-full rounded-full border border-gray-200 bg-white px-5 py-4 text-sm font-semibold text-[#23273D] transition hover:border-gray-300">
                {currentPage === 'login' ? 'Create an account' : 'Have an account? Login'}
              </button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
