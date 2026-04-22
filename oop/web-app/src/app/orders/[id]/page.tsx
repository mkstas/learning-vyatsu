'use client';

import { ArrowLeft, Clock } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface OrderItem {
  id: string;
  quantity: number;
  dish: {
    name: string;
    price: number;
    weight: number;
    type: 'Pizza' | 'Salad';
    fill: string;
  };
}

interface Order {
  id: string;
  createdAt: string;
  cost: number;
  items: OrderItem[];
}

export default function OrderDetailsPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (id) {
      fetch(`http://localhost:8080/api/orders/${id}`)
        .then(res => res.json())
        .then(data => setOrder(data));
    }
  }, [id]);

  if (!order) return <div className='p-10 text-center'>Loading...</div>;

  return (
    <div className='min-h-screen bg-slate-50 p-8'>
      <div className='mx-auto w-full max-w-5xl'>
        <Link href='/' className='mb-6 flex items-center gap-2 text-slate-500 hover:text-slate-900'>
          <ArrowLeft size={20} /> Back to Menu
        </Link>

        <div className='rounded-2xl border border-slate-100 bg-white p-8 shadow-sm'>
          <div className='mb-8 flex items-start justify-between'>
            <div>
              <h1 className='text-2xl font-bold'>Order Details</h1>
              <p className='text-sm text-slate-500'>ID: {order.id}</p>
            </div>
            <div className='text-right text-sm text-slate-400'>
              <p className='flex items-center gap-1'>
                <Clock size={14} /> {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>
          </div>

          <div className='mb-8 space-y-4'>
            {order.items.map(item => (
              <div
                key={item.id}
                className='flex items-center justify-between border-b border-slate-50 pb-4'
              >
                <div className='flex flex-col'>
                  <div className='mt-1 flex items-center gap-2'>
                    <span className='font-semibold text-slate-900'>{item.dish.name}</span>
                    <span className='rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold tracking-wider text-slate-600 uppercase'>
                      {item.dish.type}
                    </span>
                    <span className='text-xs text-slate-400'>• {item.dish.weight}g</span>
                    <span className='text-xs text-slate-500'>• {item.dish.fill}</span>
                  </div>
                </div>

                <div className='text-right'>
                  <p className='text-sm text-slate-500'>x {item.quantity}</p>
                  <span className='font-bold text-slate-900'>
                    ${(item.dish.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className='flex justify-between border-t-2 pt-4 text-xl font-bold'>
            <span>Total</span>
            <span className='text-emerald-600'>${order.cost.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
