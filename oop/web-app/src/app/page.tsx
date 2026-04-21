'use client';

import { useState, useEffect, useCallback } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { 
  Trash2, Pencil, Plus, ShoppingCart, ChefHat, X,
  DollarSign, Info, Scissors, RotateCw, RefreshCw, Minus
} from 'lucide-react';

type Dough = 'THIN' | 'THICK';
type Dressing = 'OLIVE_OIL' | 'MAYONNAISE';

interface BaseDish {
  id: string;
  name: string;
  weight: number;
  price: number;
}

export interface Pizza extends BaseDish {
  type: 'Pizza';
  dough: Dough;
}

export interface Salad extends BaseDish {
  type: 'Salad';
  dressing: Dressing;
}

export type Dish = Pizza | Salad;

interface CartItem {
  dish: Dish;
  quantity: number;
}

interface DishFormValues {
  name: string;
  weight: number;
  price: number;
}

const API_BASE = 'http://localhost:8080/api';

async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options?.headers },
  });
  if (!response.ok) throw new Error('API request failed');
  const text = await response.text();
  return text ? JSON.parse(text) : {} as T;
}

const ActionResultModal = ({ message, onClose }: { message: string; onClose: () => void }) => (
  <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-60 flex items-center justify-center p-4">
    <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full animate-in fade-in zoom-in duration-200">
      <h3 className="font-bold text-lg mb-2">Result</h3>
      <p className="text-slate-600 mb-6">{message}</p>
      <button onClick={onClose} className="w-full bg-slate-900 text-white py-2 rounded-lg hover:bg-slate-800 transition-colors">Close</button>
    </div>
  </div>
);

const DishForm = ({ 
  defaultValues,
  dishType,
  onSubmit, 
  onCancel,
  onRefresh
}: { 
  defaultValues: Dish | null;
  dishType: 'Pizza' | 'Salad';
  onSubmit: SubmitHandler<DishFormValues>; 
  onCancel: () => void;
  onRefresh: () => void;
}) => {
  const [localDish, setLocalDish] = useState<Dish | null>(defaultValues);

  useEffect(() => {
    setLocalDish(defaultValues);
  }, [defaultValues]);

  const { register, handleSubmit } = useForm<DishFormValues>({
    defaultValues: defaultValues ? { 
      name: defaultValues.name, 
      weight: defaultValues.weight, 
      price: defaultValues.price
    } : { name: '', weight: 0, price: 0 }
  });

  const handleToggle = async () => {
    if (!localDish) return;
    
    let property: 'dough' | 'dressing';
    let nextValue: string;

    if (dishType === 'Pizza') {
      property = 'dough';
      nextValue = (localDish as Pizza).dough === 'THIN' ? 'THICK' : 'THIN';
    } else {
      property = 'dressing';
      nextValue = (localDish as Salad).dressing === 'OLIVE_OIL' ? 'MAYONNAISE' : 'OLIVE_OIL';
    }

    setLocalDish(prev => {
      if (!prev) return null;
      const updated = { ...prev };
      if (dishType === 'Pizza') (updated as Pizza).dough = nextValue as Dough;
      else (updated as Salad).dressing = nextValue as Dressing;
      return updated;
    });

    const endpoint = dishType === 'Pizza' ? 'pizzas' : 'salads';
    await fetch(`${API_BASE}/${endpoint}/${localDish.id}/${property}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ value: nextValue })
    });
    
    onRefresh();
  };

  const getButtonText = () => {
    if (!localDish) return '';
    if (dishType === 'Pizza') {
      const current = (localDish as Pizza).dough;
      return `Switch to ${current === 'THIN' ? 'Thick' : 'Thin'} Dough`;
    } else {
      const current = (localDish as Salad).dressing;
      return `Switch to ${current === 'OLIVE_OIL' ? 'Mayonnaise' : 'Olive Oil'}`;
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <h2 className="text-xl font-semibold text-slate-800">{defaultValues ? 'Edit Dish' : 'Create Dish'}</h2>
      <input {...register('name', { required: true })} placeholder="Name" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
      <div className="grid grid-cols-2 gap-4">
        <input type="number" {...register('weight', { valueAsNumber: true })} placeholder="Weight (g)" className="px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
        <input type="number" step="0.1" {...register('price', { valueAsNumber: true })} placeholder="Price ($)" className="px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
      </div>

      {localDish && (
        <button 
          type="button" 
          onClick={handleToggle}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-indigo-100 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors font-medium"
        >
          <RefreshCw size={16} /> {getButtonText()}
        </button>
      )}

      <div className="flex gap-3 mt-6">
        <button type="submit" className="flex-1 bg-slate-900 text-white py-2 rounded-lg hover:bg-slate-800 transition-colors">Save Details</button>
        <button type="button" onClick={onCancel} className="px-6 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors">Cancel</button>
      </div>
    </form>
  );
};

const DishManagerModal = ({ onClose, onRefresh }: { onClose: () => void; onRefresh: () => void }) => {
  const [activeTab, setActiveTab] = useState<'pizza' | 'salad'>('pizza');
  const [items, setItems] = useState<Dish[]>([]);
  const [editingItem, setEditingItem] = useState<Dish | null>(null);
  const [isForm, setIsForm] = useState(false);

  const loadData = useCallback(async () => {
    const data = await apiFetch<Dish[]>(`/${activeTab}s`);
    setItems(data.map(item => ({ ...item, type: activeTab === 'pizza' ? 'Pizza' : 'Salad' } as Dish)));
  }, [activeTab]);

  useEffect(() => { loadData(); }, [loadData]);

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><X size={20} /></button>
        
        {!isForm ? (
          <>
            <h2 className="text-2xl font-bold mb-6">Menu Management</h2>
            <div className="flex bg-slate-100 p-1 rounded-lg mb-6">
              {(['pizza', 'salad'] as const).map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 py-2 rounded-md capitalize ${activeTab === tab ? 'bg-white shadow-sm font-medium' : 'text-slate-500'}`}>{tab}</button>
              ))}
            </div>
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
              {items.map(item => (
                <div key={item.id} className="flex justify-between items-center p-3 border border-slate-100 rounded-xl hover:shadow-md transition-shadow">
                  <span className="font-medium">{item.name}</span>
                  <div className="flex gap-2">
                    <button onClick={() => { setEditingItem(item); setIsForm(true); }} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg"><Pencil size={16}/></button>
                    <button onClick={async () => { await apiFetch(`/${activeTab}s/${item.id}`, { method: 'DELETE' }); loadData(); onRefresh(); }} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={16}/></button>
                  </div>
                </div>
              ))}
              <button onClick={() => { setEditingItem(null); setIsForm(true); }} className="w-full py-3 border-2 border-dashed border-slate-200 text-slate-400 rounded-xl hover:border-indigo-400 hover:text-indigo-600 transition-colors">+ Add New</button>
            </div>
          </>
        ) : (
          <DishForm 
            dishType={activeTab === 'pizza' ? 'Pizza' : 'Salad'}
            defaultValues={editingItem} 
            onSubmit={async (data) => {
              await apiFetch(editingItem ? `/${activeTab}s/${editingItem.id}` : `/${activeTab}s`, { method: editingItem ? 'PUT' : 'POST', body: JSON.stringify(data) });
              setIsForm(false); loadData(); onRefresh();
            }} 
            onCancel={() => setIsForm(false)}
            onRefresh={() => { loadData(); onRefresh(); }}
          />
        )}
      </div>
    </div>
  );
};

export default function RestaurantApp() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [fullPrices, setFullPrices] = useState<Record<string, number>>({});
  const [cart, setCart] = useState<CartItem[]>([]);
  const [actionResult, setActionResult] = useState<string | null>(null);

  const loadMenu = async () => {
    const [pizzas, salads] = await Promise.all([
      apiFetch<Pizza[]>('/pizzas').then(d => d.map(x => ({...x, type: 'Pizza' as const}))),
      apiFetch<Salad[]>('/salads').then(d => d.map(x => ({...x, type: 'Salad' as const})))
    ]);
    const all = [...pizzas, ...salads];
    setDishes(all);
    
    const newPrices: Record<string, number> = {};
    await Promise.all(all.map(async (d) => {
      try {
        const path = d.type === 'Pizza' ? '/pizzas' : '/salads';
        const price = await apiFetch<number>(`${path}/${d.id}/price`);
        newPrices[d.id] = price;
      } catch (e) {}
    }));
    setFullPrices(newPrices);
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(i => i.dish.id === id ? { ...i, quantity: i.quantity + delta } : i).filter(i => i.quantity > 0));
  };

  const addToCart = (dish: Dish) => {
    setCart(prev => {
      const existing = prev.find(i => i.dish.id === dish.id);
      return existing ? prev.map(i => i.dish.id === dish.id ? {...i, quantity: i.quantity + 1} : i) : [...prev, { dish, quantity: 1 }];
    });
  };

  const handleDishAction = async (id: string, type: 'Pizza' | 'Salad', action: 'info' | 'cut' | 'toss') => {
    const endpoint = type === 'Pizza' ? 'pizzas' : 'salads';
    const res = await fetch(`${API_BASE}/${endpoint}/${id}/${action}`);
    const text = await res.text();
    setActionResult(text);
  };

  const total = cart.reduce((sum, item) => {
    const price = fullPrices[item.dish.id] ?? item.dish.price;
    return sum + (price * item.quantity);
  }, 0);

  useEffect(() => { loadMenu(); }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-8 font-sans">
      <header className="max-w-5xl mx-auto flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">Restaurant</h1>
          <p className="text-slate-500">Order your favorite dishes</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl hover:bg-slate-800 transition-all shadow-lg">
          <ChefHat size={20} /> Manage Menu
        </button>
      </header>

      <main className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          {dishes.map(d => (
            <div key={d.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 transition-all hover:border-slate-200">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold">{d.name}</h3>
                  <div className="flex gap-3 text-sm text-slate-500 mt-1 items-center flex-wrap">
                    <span className="bg-slate-100 px-2 py-0.5 rounded-md font-medium">{d.type}</span>
                    <span className="bg-slate-100 px-2 py-0.5 rounded-md font-medium">
                      {d.type === 'Pizza' ? (d as Pizza).dough : (d as Salad).dressing}
                    </span>
                    <div className="flex items-center font-semibold text-slate-700">
                      <DollarSign size={14} />{d.price}
                      <span className="text-slate-400 ml-2 font-normal">
                        ({fullPrices[d.id] !== undefined ? `$${fullPrices[d.id].toFixed(2)}` : '...'})
                      </span>
                    </div>
                  </div>
                </div>
                <button onClick={() => addToCart(d)} className="bg-indigo-50 text-indigo-600 p-3 rounded-xl hover:bg-indigo-600 hover:text-white transition-colors">
                  <Plus size={24} />
                </button>
              </div>

              <div className="flex gap-2 mt-4 pt-4 border-t border-slate-50">
                <button onClick={() => handleDishAction(d.id, d.type, 'info')} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-100 rounded-lg hover:bg-slate-200">
                  <Info size={14} /> Info
                </button>
                {d.type === 'Pizza' && (
                  <button onClick={() => handleDishAction(d.id, d.type, 'cut')} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-sky-50 text-sky-700 rounded-lg hover:bg-sky-100">
                    <Scissors size={14} /> Cut
                  </button>
                )}
                {d.type === 'Salad' && (
                  <button onClick={() => handleDishAction(d.id, d.type, 'toss')} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100">
                    <RotateCw size={14} /> Toss
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <aside className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-fit sticky top-8">
          <h2 className="font-bold text-xl mb-6 flex items-center gap-2"><ShoppingCart /> Cart</h2>
          {cart.length === 0 ? <p className="text-slate-400 text-center py-10">Empty</p> : (
            <>
              {cart.map(i => (
                <div key={i.dish.id} className="flex justify-between items-center mb-4">
                  <span className="text-sm">{i.dish.name}</span>
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateQuantity(i.dish.id, -1)} className="p-1 hover:bg-slate-100 rounded"><Minus size={14}/></button>
                    <span className="w-6 text-center text-sm font-medium">{i.quantity}</span>
                    <button onClick={() => updateQuantity(i.dish.id, 1)} className="p-1 hover:bg-slate-100 rounded"><Plus size={14}/></button>
                  </div>
                </div>
              ))}
              <div className="border-t pt-4 mt-2">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <button onClick={async () => {
                  await apiFetch('/orders', { method: 'POST', body: JSON.stringify({ items: cart.map(i => ({ dishId: i.dish.id, quantity: i.quantity })) }) });
                  setCart([]);
                }} className="w-full bg-emerald-600 text-white py-3 rounded-xl font-medium hover:bg-emerald-700 mt-4 transition-colors">Checkout</button>
              </div>
            </>
          )}
        </aside>
      </main>

      {actionResult && <ActionResultModal message={actionResult} onClose={() => setActionResult(null)} />}
      {isModalOpen && <DishManagerModal onClose={() => setIsModalOpen(false)} onRefresh={loadMenu} />}
    </div>
  );
}