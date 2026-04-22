'use client';

import {
  ChefHat,
  DollarSign,
  History,
  Info,
  Minus,
  Pencil,
  Plus,
  RefreshCw,
  RotateCw,
  Scissors,
  ShoppingCart,
  Trash2,
  X,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

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

interface Order {
  id: string;
  createdAt: string;
  cost: number;
}

const API_BASE = 'http://localhost:8080/api';

async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options?.headers },
  });
  if (!response.ok) throw new Error('API request failed');
  const text = await response.text();
  return text ? JSON.parse(text) : ({} as T);
}

const ActionResultModal = ({ message, onClose }: { message: string; onClose: () => void }) => (
  <div className='fixed inset-0 z-60 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm'>
    <div className='animate-in fade-in zoom-in w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl duration-200'>
      <h3 className='mb-2 text-lg font-bold'>Result</h3>
      <p className='mb-6 text-slate-600'>{message}</p>
      <button
        onClick={onClose}
        className='w-full rounded-lg bg-slate-900 py-2 text-white transition-colors hover:bg-slate-800'
      >
        Close
      </button>
    </div>
  </div>
);

const DishForm = ({
  defaultValues,
  dishType,
  onSubmit,
  onCancel,
  onRefresh,
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
    defaultValues: defaultValues
      ? {
          name: defaultValues.name,
          weight: defaultValues.weight,
          price: defaultValues.price,
        }
      : { name: '', weight: 0, price: 0 },
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
      body: JSON.stringify({ value: nextValue }),
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
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
      <h2 className='text-xl font-semibold text-slate-800'>
        {defaultValues ? 'Edit Dish' : 'Create Dish'}
      </h2>
      <input
        {...register('name', { required: true })}
        placeholder='Name'
        className='w-full rounded-lg border border-slate-200 px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500'
      />
      <div className='grid grid-cols-2 gap-4'>
        <input
          type='number'
          {...register('weight', { valueAsNumber: true })}
          placeholder='Weight (g)'
          className='rounded-lg border border-slate-200 px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500'
        />
        <input
          type='number'
          step='0.1'
          {...register('price', { valueAsNumber: true })}
          placeholder='Price ($)'
          className='rounded-lg border border-slate-200 px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500'
        />
      </div>

      {localDish && (
        <button
          type='button'
          onClick={handleToggle}
          className='flex w-full items-center justify-center gap-2 rounded-lg border border-indigo-100 bg-indigo-50 px-4 py-2 font-medium text-indigo-700 transition-colors hover:bg-indigo-100'
        >
          <RefreshCw size={16} /> {getButtonText()}
        </button>
      )}

      <div className='mt-6 flex gap-3'>
        <button
          type='submit'
          className='flex-1 rounded-lg bg-slate-900 py-2 text-white transition-colors hover:bg-slate-800'
        >
          Save Details
        </button>
        <button
          type='button'
          onClick={onCancel}
          className='rounded-lg bg-slate-100 px-6 py-2 text-slate-700 transition-colors hover:bg-slate-200'
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

const DishManagerModal = ({
  onClose,
  onRefresh,
}: {
  onClose: () => void;
  onRefresh: () => void;
}) => {
  const [activeTab, setActiveTab] = useState<'pizza' | 'salad'>('pizza');
  const [items, setItems] = useState<Dish[]>([]);
  const [editingItem, setEditingItem] = useState<Dish | null>(null);
  const [isForm, setIsForm] = useState(false);

  const loadData = useCallback(async () => {
    const data = await apiFetch<Dish[]>(`/${activeTab}s`);
    setItems(
      data.map(item => ({ ...item, type: activeTab === 'pizza' ? 'Pizza' : 'Salad' }) as Dish),
    );
  }, [activeTab]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm'>
      <div className='relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl'>
        <button
          onClick={onClose}
          className='absolute top-4 right-4 text-slate-400 hover:text-slate-600'
        >
          <X size={20} />
        </button>

        {!isForm ? (
          <>
            <h2 className='mb-6 text-2xl font-bold'>Menu Management</h2>
            <div className='mb-6 flex rounded-lg bg-slate-100 p-1'>
              {(['pizza', 'salad'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 rounded-md py-2 capitalize ${activeTab === tab ? 'bg-white font-medium shadow-sm' : 'text-slate-500'}`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className='max-h-96 space-y-3 overflow-y-auto pr-2'>
              {items.map(item => (
                <div
                  key={item.id}
                  className='flex items-center justify-between rounded-xl border border-slate-100 p-3 transition-shadow hover:shadow-md'
                >
                  <span className='font-medium'>{item.name}</span>
                  <div className='flex gap-2'>
                    <button
                      onClick={() => {
                        setEditingItem(item);
                        setIsForm(true);
                      }}
                      className='rounded-lg p-2 text-indigo-600 hover:bg-indigo-50'
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={async () => {
                        await apiFetch(`/${activeTab}s/${item.id}`, { method: 'DELETE' });
                        loadData();
                        onRefresh();
                      }}
                      className='rounded-lg p-2 text-red-600 hover:bg-red-50'
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
              <button
                onClick={() => {
                  setEditingItem(null);
                  setIsForm(true);
                }}
                className='w-full rounded-xl border-2 border-dashed border-slate-200 py-3 text-slate-400 transition-colors hover:border-indigo-400 hover:text-indigo-600'
              >
                + Add New
              </button>
            </div>
          </>
        ) : (
          <DishForm
            dishType={activeTab === 'pizza' ? 'Pizza' : 'Salad'}
            defaultValues={editingItem}
            onSubmit={async data => {
              await apiFetch(editingItem ? `/${activeTab}s/${editingItem.id}` : `/${activeTab}s`, {
                method: editingItem ? 'PUT' : 'POST',
                body: JSON.stringify(data),
              });
              setIsForm(false);
              loadData();
              onRefresh();
            }}
            onCancel={() => setIsForm(false)}
            onRefresh={() => {
              loadData();
              onRefresh();
            }}
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
  const [orders, setOrders] = useState<Order[]>([]);

  const loadMenu = async () => {
    const [pizzas, salads, ordersData] = await Promise.all([
      apiFetch<Pizza[]>('/pizzas').then(d => d.map(x => ({ ...x, type: 'Pizza' as const }))),
      apiFetch<Salad[]>('/salads').then(d => d.map(x => ({ ...x, type: 'Salad' as const }))),
      apiFetch<Order[]>('/orders').catch(() => []),
    ]);
    const all = [...pizzas, ...salads];
    setDishes(all);
    setOrders(ordersData);

    const newPrices: Record<string, number> = {};
    await Promise.all(
      all.map(async d => {
        try {
          const path = d.type === 'Pizza' ? '/pizzas' : '/salads';
          const price = await apiFetch<number>(`${path}/${d.id}/price`);
          newPrices[d.id] = price;
        } catch (e) {}
      }),
    );
    setFullPrices(newPrices);
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev =>
      prev
        .map(i => (i.dish.id === id ? { ...i, quantity: i.quantity + delta } : i))
        .filter(i => i.quantity > 0),
    );
  };

  const addToCart = (dish: Dish) => {
    setCart(prev => {
      const existing = prev.find(i => i.dish.id === dish.id);
      return existing
        ? prev.map(i => (i.dish.id === dish.id ? { ...i, quantity: i.quantity + 1 } : i))
        : [...prev, { dish, quantity: 1 }];
    });
  };

  const handleDishAction = async (
    id: string,
    type: 'Pizza' | 'Salad',
    action: 'info' | 'cut' | 'toss',
  ) => {
    const endpoint = type === 'Pizza' ? 'pizzas' : 'salads';
    const res = await fetch(`${API_BASE}/${endpoint}/${id}/${action}`);
    const text = await res.text();
    setActionResult(text);
  };

  const total = cart.reduce((sum, item) => {
    const price = fullPrices[item.dish.id] ?? item.dish.price;
    return sum + price * item.quantity;
  }, 0);

  useEffect(() => {
    loadMenu();
  }, []);

  return (
    <div className='min-h-screen bg-slate-50 p-8 font-sans text-slate-900'>
      <header className='mx-auto mb-10 flex max-w-5xl items-center justify-between'>
        <div>
          <h1 className='text-4xl font-extrabold tracking-tight'>Restaurant</h1>
          <p className='text-slate-500'>Order your favorite dishes</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className='flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-white shadow-lg transition-all hover:bg-slate-800'
        >
          <ChefHat size={20} /> Manage Menu
        </button>
      </header>

      <main className='mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3'>
        <div className='space-y-4 md:col-span-2'>
          {dishes.map(d => (
            <div
              key={d.id}
              className='rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all hover:border-slate-200'
            >
              <div className='flex items-start justify-between'>
                <div>
                  <h3 className='text-lg font-bold'>{d.name}</h3>
                  <div className='mt-1 flex flex-wrap items-center gap-3 text-sm text-slate-500'>
                    <span className='rounded-md bg-slate-100 px-2 py-0.5 font-medium'>
                      {d.type}
                    </span>
                    <span className='rounded-md bg-slate-100 px-2 py-0.5 font-medium'>
                      {d.type === 'Pizza' ? (d as Pizza).dough : (d as Salad).dressing}
                    </span>
                    <div className='flex items-center font-semibold text-slate-700'>
                      <DollarSign size={14} />
                      {d.price}
                      <span className='ml-2 font-normal text-slate-400'>
                        (
                        {fullPrices[d.id] !== undefined ? `$${fullPrices[d.id].toFixed(2)}` : '...'}
                        )
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => addToCart(d)}
                  className='rounded-xl bg-indigo-50 p-3 text-indigo-600 transition-colors hover:bg-indigo-600 hover:text-white'
                >
                  <Plus size={24} />
                </button>
              </div>

              <div className='mt-4 flex gap-2 border-t border-slate-50 pt-4'>
                <button
                  onClick={() => handleDishAction(d.id, d.type, 'info')}
                  className='flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium hover:bg-slate-200'
                >
                  <Info size={14} /> Info
                </button>
                {d.type === 'Pizza' && (
                  <button
                    onClick={() => handleDishAction(d.id, d.type, 'cut')}
                    className='flex items-center gap-1.5 rounded-lg bg-sky-50 px-3 py-1.5 text-xs font-medium text-sky-700 hover:bg-sky-100'
                  >
                    <Scissors size={14} /> Cut
                  </button>
                )}
                {d.type === 'Salad' && (
                  <button
                    onClick={() => handleDishAction(d.id, d.type, 'toss')}
                    className='flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 hover:bg-emerald-100'
                  >
                    <RotateCw size={14} /> Toss
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <aside className='sticky top-8 h-fit space-y-8'>
          <div className='rounded-2xl border border-slate-100 bg-white p-6 shadow-sm'>
            <h2 className='mb-6 flex items-center gap-2 text-xl font-bold'>
              <ShoppingCart /> Cart
            </h2>
            {cart.length === 0 ? (
              <p className='py-10 text-center text-slate-400'>Empty</p>
            ) : (
              <>
                {cart.map(i => (
                  <div key={i.dish.id} className='mb-4 flex items-center justify-between'>
                    <span className='text-sm'>{i.dish.name}</span>
                    <div className='flex items-center gap-2'>
                      <button
                        onClick={() => updateQuantity(i.dish.id, -1)}
                        className='rounded p-1 hover:bg-slate-100'
                      >
                        <Minus size={14} />
                      </button>
                      <span className='w-6 text-center text-sm font-medium'>{i.quantity}</span>
                      <button
                        onClick={() => updateQuantity(i.dish.id, 1)}
                        className='rounded p-1 hover:bg-slate-100'
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                ))}
                <div className='mt-2 border-t pt-4'>
                  <div className='flex justify-between text-lg font-bold'>
                    <span>Total:</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <button
                    onClick={async () => {
                      await apiFetch('/orders', {
                        method: 'POST',
                        body: JSON.stringify({
                          items: cart.map(i => ({ dishId: i.dish.id, quantity: i.quantity })),
                        }),
                      });
                      setCart([]);
                      loadMenu();
                    }}
                    className='mt-4 w-full rounded-xl bg-emerald-600 py-3 font-medium text-white transition-colors hover:bg-emerald-700'
                  >
                    Checkout
                  </button>
                </div>
              </>
            )}
          </div>

          <div className='rounded-2xl border border-slate-100 bg-white p-6 shadow-sm'>
            <h3 className='mb-4 flex items-center gap-2 font-bold'>
              <History size={18} /> Previous Orders
            </h3>
            <div className='space-y-2'>
              {orders.length === 0 ? (
                <p className='text-sm text-slate-400'>No orders yet</p>
              ) : (
                orders.map(order => (
                  <a
                    key={order.id}
                    href={`/orders/${order.id}`}
                    className='flex items-center justify-between rounded-lg border border-slate-100 p-3 text-sm transition-colors hover:bg-slate-50'
                  >
                    <span className='font-medium text-slate-700'>Order #{order.id.slice(-6)}</span>
                    <span className='font-semibold text-emerald-600'>${order.cost.toFixed(2)}</span>
                  </a>
                ))
              )}
            </div>
          </div>
        </aside>
      </main>

      {actionResult && (
        <ActionResultModal message={actionResult} onClose={() => setActionResult(null)} />
      )}
      {isModalOpen && (
        <DishManagerModal onClose={() => setIsModalOpen(false)} onRefresh={loadMenu} />
      )}
    </div>
  );
}
