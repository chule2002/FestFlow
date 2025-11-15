'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

type Truck = {
  display_name: string
  cuisines: string[] | null
  is_open: boolean | null
}

type MenuItem = {
  id: string
  name: string
  description: string | null
  price_cents: number | null
  prep_secs_avg: number | null
  is_active: boolean | null
}

export default function TruckPage() {
  const params = useParams() as { id?: string | string[] }
  const truckId = Array.isArray(params.id) ? params.id?.[0] ?? '' : params.id ?? ''

  const [truck, setTruck] = useState<Truck | null>(null)
  const [items, setItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [creatingId, setCreatingId] = useState<string | null>(null)

  useEffect(() => {
    if (!truckId) return

    const load = async () => {
      setLoading(true)

      const { data: truckData } = await supabase
        .from('food_truck')
        .select('display_name, cuisines, is_open')
        .eq('id', truckId)
        .single()

      const { data: itemData } = await supabase
        .from('menu_item')
        .select('id, name, description, price_cents, prep_secs_avg, is_active')
        .eq('truck_id', truckId)
        .eq('is_active', true)
        .order('price_cents', { ascending: true })

      setTruck(truckData as Truck | null)
      setItems((itemData as MenuItem[]) ?? [])
      setLoading(false)
    }

    load()
  }, [truckId])

  const handleOrderClick = async (item: MenuItem) => {
    if (!truckId || !item.id) return

    try {
      setCreatingId(item.id)

      const res = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          truck_id: truckId,
          item_id: item.id,
          item_name: item.name,
          price_cents: item.price_cents ?? 0
        })
      })

      if (!res.ok) {
        console.error(await res.text())
        alert('Error al crear el pedido (demo)')
        return
      }

      alert('Pedido creado (demo)')
    } catch (e) {
      console.error(e)
      alert('Error al crear el pedido (demo)')
    } finally {
      setCreatingId(null)
    }
  }

  if (!truckId) {
    return (
      <main className="min-h-screen p-8">
        <a href="/" className="text-sm text-blue-600 underline">
          ← Volver al listado
        </a>
        <p className="mt-4 text-sm text-red-600">
          No se ha podido determinar el ID del truck.
        </p>
      </main>
    )
  }

  return (
    <main className="min-h-screen p-8">
      <a href="/" className="text-sm text-blue-600 underline">
        ← Volver al listado
      </a>

      {loading ? (
        <p className="mt-4 text-sm">Cargando menú…</p>
      ) : (
        <>
          <h1 className="text-3xl font-bold mt-4 mb-2">
            {truck?.display_name ?? 'Food truck'}
          </h1>

          <p className="text-sm text-slate-600 mb-6">
            {truck?.cuisines?.join(', ') || 'Sin categoría'} ·{' '}
            {truck?.is_open ? 'Abierto' : 'Cerrado'}
          </p>

          {items.length === 0 && (
            <p className="text-sm text-slate-500">
              No hay productos activos en el menú.
            </p>
          )}

          <ul className="space-y-3">
            {items.map((item) => (
              <li
                key={item.id}
                className="border rounded-xl p-4 flex items-center justify-between"
              >
                <div>
                  <div className="font-semibold">{item.name}</div>
                  {item.description && (
                    <div className="text-sm text-slate-500">
                      {item.description}
                    </div>
                  )}
                  <div className="text-xs text-slate-400 mt-1">
                    Tiempo medio: {item.prep_secs_avg ?? 0} s
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-semibold">
                    CHF {(((item.price_cents ?? 0) as number) / 100).toFixed(2)}
                  </div>
                  <button
                    onClick={() => handleOrderClick(item)}
                    disabled={creatingId === item.id}
                    className="mt-2 px-3 py-1 rounded-full text-xs bg-black text-white disabled:opacity-60"
                  >
                    {creatingId === item.id ? 'Creando…' : 'Pedir (demo)'}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </main>
  )
}

