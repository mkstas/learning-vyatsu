'use client';

import { EditIcon, TrashIcon } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

type Pizza = {
  id: string;
  name: string;
  dough: number;
  weight: number;
  price: number;
};

type PizzaWithFullprice = {
  pizza: Pizza;
  fullprice: number;
};

type Salad = {
  id: string;
  name: string;
  dressing: number;
  weight: number;
  price: number;
};

type SaladWithFullprice = {
  salad: Salad;
  fullprice: number;
};

type PizzaFormInputs = Omit<Pizza, 'id'>;
type SaladFormInputs = Omit<Salad, 'id'>;

const PIZZA_API_URL = 'http://localhost:5000/pizzas';
const SALAD_API_URL = 'http://localhost:5000/salads';

const EMPTY_PIZZA = { name: '', weight: 0, price: 0 };
const EMPTY_SALAD = { name: '', weight: 0, price: 0 };

const DOUGH = ['Thin', 'Think'];
const DRESSING = ['Olive Oil', 'Mayonnaise'];

export default function Home() {
  const [currentTab, setCurrentTab] = useState<number>(0);
  const [pizzas, setPizzas] = useState<PizzaWithFullprice[]>([]);
  const [salads, setSalads] = useState<SaladWithFullprice[]>([]);

  const [editingPizzaId, setEditingPizzaId] = useState<string | null>(null);
  const [editingSaladId, setEditingSaladId] = useState<string | null>(null);

  const pizzaForm = useForm<PizzaFormInputs>();
  const { register: registerPizza, handleSubmit: handlePizzaSubmit, reset: resetPizza } = pizzaForm;

  const saladForm = useForm<SaladFormInputs>();
  const { register: registerSalad, handleSubmit: handleSaladSubmit, reset: resetSalad } = saladForm;

  const fetchPizzas = useCallback(async () => {
    const res = await fetch(PIZZA_API_URL);
    const data = (await res.json()) as Pizza[];
    const pizzasWithFullprice = await Promise.all(
      data.map(async p => {
        const res = await fetch(`${PIZZA_API_URL}/${p.id}/fullprice`, { method: 'GET' });
        const fullprice = res.ok ? ((await res.json()) as number) : p.price;
        return { pizza: p, fullprice };
      }),
    );
    return pizzasWithFullprice;
  }, []);

  const fetchSalads = useCallback(async () => {
    const res = await fetch(SALAD_API_URL);
    const data = (await res.json()) as Salad[];
    const saladsWithFullprice = await Promise.all(
      data.map(async s => {
        const res = await fetch(`${SALAD_API_URL}/${s.id}/fullprice`, { method: 'GET' });
        const fullprice = res.ok ? ((await res.json()) as number) : s.price;
        return { salad: s, fullprice };
      }),
    );
    return saladsWithFullprice;
  }, []);

  const createPizza = async (data: PizzaFormInputs) => {
    const payload = {
      name: data.name,
      weight: data.weight,
      price: data.price,
    };
    const res = await fetch(PIZZA_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const updated = await fetchPizzas();
      setPizzas(updated);
      resetPizza(EMPTY_PIZZA);
    }
  };

  const updatePizza = async (id: string, data: PizzaFormInputs) => {
    const payload = { name: data.name, weight: data.weight, price: data.price };
    const res = await fetch(`${PIZZA_API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const updated = await fetchPizzas();
      setPizzas(updated);
      setEditingPizzaId(null);
      resetPizza(EMPTY_PIZZA);
    }
  };

  const deletePizza = async (id: string) => {
    const res = await fetch(`${PIZZA_API_URL}/${id}`, { method: 'DELETE' });
    if (res.ok) {
      const updated = await fetchPizzas();
      setPizzas(updated);
      if (editingPizzaId === id) {
        setEditingPizzaId(null);
        resetPizza(EMPTY_PIZZA);
      }
    }
  };

  const createSalad = async (data: SaladFormInputs) => {
    const payload = {
      name: data.name,
      weight: data.weight,
      price: data.price,
    };
    const res = await fetch(SALAD_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const updated = await fetchSalads();
      setSalads(updated);
      resetSalad(EMPTY_SALAD);
    }
  };

  const updateSalad = async (id: string, data: SaladFormInputs) => {
    const payload = { name: data.name, weight: data.weight, price: data.price };
    const res = await fetch(`${SALAD_API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const updated = await fetchSalads();
      setSalads(updated);
      setEditingSaladId(null);
      resetSalad(EMPTY_SALAD);
    }
  };

  const deleteSalad = async (id: string) => {
    const res = await fetch(`${SALAD_API_URL}/${id}`, { method: 'DELETE' });
    if (res.ok) {
      const updated = await fetchSalads();
      setSalads(updated);
      if (editingSaladId === id) {
        setEditingSaladId(null);
        resetSalad(EMPTY_SALAD);
      }
    }
  };

  const onSubmitPizza: SubmitHandler<PizzaFormInputs> = data => {
    if (editingPizzaId) {
      updatePizza(editingPizzaId, data);
    } else {
      createPizza(data);
    }
  };

  const startEditPizza = (item: PizzaWithFullprice) => {
    setEditingPizzaId(item.pizza.id);
    resetPizza({
      name: item.pizza.name,
      weight: item.pizza.weight,
      price: item.pizza.price,
      dough: item.pizza.dough,
    });
  };

  const changeDough = async (id: string) => {
    const res = await fetch(`${PIZZA_API_URL}/${id}/dough`, { method: 'PATCH' });
    if (res.ok) {
      const updated = await fetchPizzas();
      setPizzas(updated);
    }
  };

  const displayPizzaInfo = async (id: string) => {
    const res = await fetch(`${PIZZA_API_URL}/${id}/info`, { method: 'GET' });
    if (res.ok) {
      alert(await res.text());
    }
  };

  const cutPizza = async (id: string) => {
    const res = await fetch(`${PIZZA_API_URL}/${id}/cut`, { method: 'GET' });
    if (res.ok) {
      alert(await res.text());
    }
  };

  const onSubmitSalad: SubmitHandler<SaladFormInputs> = data => {
    if (editingSaladId) {
      updateSalad(editingSaladId, data);
    } else {
      createSalad(data);
    }
  };

  const startEditSalad = (item: SaladWithFullprice) => {
    setEditingSaladId(item.salad.id);
    resetSalad({
      name: item.salad.name,
      weight: item.salad.weight,
      price: item.salad.price,
      dressing: item.salad.dressing,
    });
  };

  const changeDressing = async (id: string) => {
    const res = await fetch(`${SALAD_API_URL}/${id}/dressing`, { method: 'PATCH' });
    if (res.ok) {
      const updated = await fetchSalads();
      setSalads(updated);
    }
  };

  const displaySaladInfo = async (id: string) => {
    const res = await fetch(`${SALAD_API_URL}/${id}/info`, { method: 'GET' });
    if (res.ok) {
      alert(await res.text());
    }
  };

  const tossSalad = async (id: string) => {
    const res = await fetch(`${SALAD_API_URL}/${id}/toss`, { method: 'GET' });
    if (res.ok) {
      alert(await res.text());
    }
  };

  useEffect(() => {
    let ignore = false;
    const fetchData = async () => {
      try {
        if (!ignore) {
          if (currentTab === 0) {
            setPizzas(await fetchPizzas());
          } else {
            setSalads(await fetchSalads());
          }
        }
      } catch (error) {
        console.error('Error fetching ', error);
      }
    };
    fetchData();
    return () => {
      ignore = true;
    };
  }, [currentTab, fetchPizzas, fetchSalads]);

  return (
    <div className='min-h-screen bg-linear-to-br from-slate-50 to-slate-100 py-8'>
      <div className='container mx-auto max-w-6xl px-6'>
        <div className='mb-10'>
          <h1 className='text-4xl font-bold tracking-tight text-slate-900'>Menu Manager</h1>
        </div>

        <div className='mb-8 flex gap-2 rounded-2xl bg-white p-1 shadow-sm'>
          <button
            onClick={() => setCurrentTab(0)}
            className={`flex-1 rounded-xl px-8 py-3.5 text-lg font-semibold transition-all ${
              currentTab === 0
                ? 'bg-slate-900 text-white shadow'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            🍕 Pizzas
          </button>
          <button
            onClick={() => setCurrentTab(1)}
            className={`flex-1 rounded-xl px-8 py-3.5 text-lg font-semibold transition-all ${
              currentTab === 1
                ? 'bg-slate-900 text-white shadow'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            🥗 Salads
          </button>
        </div>

        <div className='rounded-3xl bg-white p-8 shadow-xl'>
          {currentTab === 0 ? (
            <div className='space-y-10'>
              {pizzas.length > 0 && (
                <div>
                  <h2 className='mb-4 text-2xl font-semibold text-slate-800'>Your Pizzas</h2>
                  <div className='overflow-hidden rounded-2xl border border-slate-200'>
                    <table className='w-full text-left'>
                      <thead className='bg-slate-50'>
                        <tr>
                          <th className='px-6 py-4 font-medium text-slate-600'>Name</th>
                          <th className='px-6 py-4 font-medium text-slate-600'>Dough</th>
                          <th className='px-6 py-4 font-medium text-slate-600'>Weight (g)</th>
                          <th className='px-6 py-4 font-medium text-slate-600'>Price</th>
                          <th className='w-64 px-6 py-4 text-center font-medium text-slate-600'>
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className='divide-y divide-slate-100'>
                        {pizzas.map(p => (
                          <tr key={p.pizza.id} className='transition-colors hover:bg-slate-50'>
                            <td className='px-6 py-4 font-medium'>{p.pizza.name}</td>
                            <td className='px-6 py-4'>
                              <span className='inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700'>
                                {DOUGH[p.pizza.dough]}
                              </span>
                            </td>
                            <td className='px-6 py-4 text-slate-600'>{p.pizza.weight}</td>
                            <td className='px-6 py-4 font-medium text-emerald-600'>
                              ${p.pizza.price} (${p.fullprice})
                            </td>
                            <td className='w-96 px-6 py-4'>
                              <div className='flex justify-center gap-1.5'>
                                <button
                                  onClick={() => displayPizzaInfo(p.pizza.id)}
                                  className='rounded-xl bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700 disabled:cursor-not-allowed disabled:bg-amber-400'
                                >
                                  Info
                                </button>
                                <button
                                  onClick={() => cutPizza(p.pizza.id)}
                                  className='rounded-xl bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700 disabled:cursor-not-allowed disabled:bg-amber-400'
                                >
                                  Cut
                                </button>
                                <button
                                  onClick={() => !editingPizzaId && changeDough(p.pizza.id)}
                                  disabled={!!editingPizzaId}
                                  className='rounded-xl bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700 disabled:cursor-not-allowed disabled:bg-amber-400'
                                >
                                  Change Dough
                                </button>
                                <button
                                  onClick={() => startEditPizza(p)}
                                  className='flex rounded-xl bg-blue-600 p-2.5 text-sm font-medium text-white hover:bg-blue-700'
                                >
                                  <EditIcon className='size-4' />
                                </button>
                                <button
                                  onClick={() => deletePizza(p.pizza.id)}
                                  className='flex rounded-xl bg-red-600 p-2.5 font-medium text-white hover:bg-red-700'
                                >
                                  <TrashIcon className='size-4' />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <div className='rounded-2xl border border-slate-200 bg-slate-50 p-8'>
                <h3 className='mb-6 text-2xl font-semibold text-slate-800'>
                  {editingPizzaId ? '✏️ Edit Pizza' : '🍕 Add New Pizza'}
                </h3>
                <form onSubmit={handlePizzaSubmit(onSubmitPizza)} className='flex flex-wrap gap-4'>
                  <input
                    type='text'
                    placeholder='Pizza name'
                    {...registerPizza('name', { required: true })}
                    className='flex-1 rounded-2xl border border-slate-300 px-5 py-3 focus:border-slate-500 focus:outline-none'
                  />
                  <input
                    type='number'
                    placeholder='Weight (g)'
                    {...registerPizza('weight', { required: true, valueAsNumber: true })}
                    className='w-40 rounded-2xl border border-slate-300 px-5 py-3 focus:border-slate-500 focus:outline-none'
                  />
                  <input
                    type='number'
                    placeholder='Price ($)'
                    {...registerPizza('price', { required: true, valueAsNumber: true })}
                    className='w-40 rounded-2xl border border-slate-300 px-5 py-3 focus:border-slate-500 focus:outline-none'
                  />

                  <button
                    type='submit'
                    className='rounded-2xl bg-slate-900 px-10 py-3 font-semibold text-white transition hover:bg-black'
                  >
                    {editingPizzaId ? 'Save Changes' : 'Add Pizza'}
                  </button>

                  {editingPizzaId && (
                    <button
                      type='button'
                      onClick={() => {
                        setEditingPizzaId(null);
                        resetPizza(EMPTY_PIZZA);
                      }}
                      className='rounded-2xl border border-slate-300 px-8 py-3 font-medium text-slate-700 hover:bg-white'
                    >
                      Cancel
                    </button>
                  )}
                </form>
              </div>
            </div>
          ) : (
            <div className='space-y-10'>
              {salads.length > 0 && (
                <div>
                  <h2 className='mb-4 text-2xl font-semibold text-slate-800'>Your Salads</h2>
                  <div className='overflow-hidden rounded-2xl border border-slate-200'>
                    <table className='w-full text-left'>
                      <thead className='bg-slate-50'>
                        <tr>
                          <th className='px-6 py-4 font-medium text-slate-600'>Name</th>
                          <th className='px-6 py-4 font-medium text-slate-600'>Dressing</th>
                          <th className='px-6 py-4 font-medium text-slate-600'>Weight (g)</th>
                          <th className='px-6 py-4 font-medium text-slate-600'>Price</th>
                          <th className='w-64 px-6 py-4 text-center font-medium text-slate-600'>
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className='divide-y divide-slate-100'>
                        {salads.map(s => (
                          <tr key={s.salad.id} className='transition-colors hover:bg-slate-50'>
                            <td className='px-6 py-4 font-medium'>{s.salad.name}</td>
                            <td className='px-6 py-4'>
                              <span className='inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700'>
                                {DRESSING[s.salad.dressing]}
                              </span>
                            </td>
                            <td className='px-6 py-4 text-slate-600'>{s.salad.weight}</td>
                            <td className='px-6 py-4 font-medium text-emerald-600'>
                              ${s.salad.price} (${s.fullprice})
                            </td>
                            <td className='px-6 py-4'>
                              <div className='flex w-96 justify-center gap-1.5'>
                                <button
                                  onClick={() => displaySaladInfo(s.salad.id)}
                                  className='rounded-xl bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700 disabled:cursor-not-allowed disabled:bg-amber-400'
                                >
                                  Info
                                </button>
                                <button
                                  onClick={() => tossSalad(s.salad.id)}
                                  className='rounded-xl bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700 disabled:cursor-not-allowed disabled:bg-amber-400'
                                >
                                  Toss
                                </button>
                                <button
                                  onClick={() => !editingSaladId && changeDressing(s.salad.id)}
                                  disabled={!!editingSaladId}
                                  className='rounded-xl bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700 disabled:cursor-not-allowed disabled:bg-amber-400'
                                >
                                  Change Dressing
                                </button>
                                <button
                                  onClick={() => startEditSalad(s)}
                                  className='flex rounded-xl bg-blue-600 p-2.5 text-sm font-medium text-white hover:bg-blue-700'
                                >
                                  <EditIcon className='size-4' />
                                </button>
                                <button
                                  onClick={() => deleteSalad(s.salad.id)}
                                  className='flex rounded-xl bg-red-600 p-2.5 font-medium text-white hover:bg-red-700'
                                >
                                  <TrashIcon className='size-4' />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <div className='rounded-2xl border border-slate-200 bg-slate-50 p-8'>
                <h3 className='mb-6 text-2xl font-semibold text-slate-800'>
                  {editingSaladId ? '✏️ Edit Salad' : '🥗 Add New Salad'}
                </h3>
                <form onSubmit={handleSaladSubmit(onSubmitSalad)} className='flex flex-wrap gap-4'>
                  <input
                    type='text'
                    placeholder='Salad name'
                    {...registerSalad('name', { required: true })}
                    className='flex-1 rounded-2xl border border-slate-300 px-5 py-3 focus:border-slate-500 focus:outline-none'
                  />
                  <input
                    type='number'
                    placeholder='Weight (g)'
                    {...registerSalad('weight', { required: true, valueAsNumber: true })}
                    className='w-40 rounded-2xl border border-slate-300 px-5 py-3 focus:border-slate-500 focus:outline-none'
                  />
                  <input
                    type='number'
                    placeholder='Price ($)'
                    {...registerSalad('price', { required: true, valueAsNumber: true })}
                    className='w-40 rounded-2xl border border-slate-300 px-5 py-3 focus:border-slate-500 focus:outline-none'
                  />

                  <button
                    type='submit'
                    className='rounded-2xl bg-slate-900 px-10 py-3 font-semibold text-white transition hover:bg-black'
                  >
                    {editingSaladId ? 'Save Changes' : 'Add Salad'}
                  </button>

                  {editingSaladId && (
                    <button
                      type='button'
                      onClick={() => {
                        setEditingSaladId(null);
                        resetSalad(EMPTY_SALAD);
                      }}
                      className='rounded-2xl border border-slate-300 px-8 py-3 font-medium text-slate-700 hover:bg-white'
                    >
                      Cancel
                    </button>
                  )}
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
