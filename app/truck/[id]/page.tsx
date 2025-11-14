import { supabase } from '@/lib/supabaseClient'

type Props = {
  params: { id: string }
}

export default async function TruckPage({ params }: Props) {
  const truckId = params.id

  const [{ data: truck }, { data: items }] = await Promise.all([
    supabase
      .from('food_truck')
      .select('display_name, cuisines, is_open')
      .eq('id', truckId)
      .single(),
    supabase
      .from('menu_item')
      .select('id, name, description, price_cents, prep_secs_avg, is_active')
      .eq('truck_id', truckId)
      .eq('is_active', true)
      .order('price_cents', { ascending: true }),
  ])

  const safeItems = items ?? []

  return (
    <main className="min-h-screen p-8">
      <a href="/" className="text-sm text-blue-600 underline">
        ← Volver al listado
      </a>

      <h1 className="text-3xl font-bold mt-4 mb-2">
        {truck?.display_name ?? 'Food truck'}
      </h1>

      <p className="text-sm text-slate-600 mb-6">
        {truck?.cuisines?.join(', ') || 'Sin categoría'} ·{' '}
        {truck?.is_open ? 'Abierto' : 'Cerrado'}
      </p>

      {safeItems.length === 0 && (
        <p className="text-sm text-slate-500">
          No hay productos activos en el menú.
        </p>
      )}

      <ul className="space-y-3">
        {safeItems.map((item) => (
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
                CHF {(item.price_cents / 100).toFixed(2)}
              </div>

              <button className="mt-2 px-3 py-1 rounded-full text-xs bg-black text-white">
                Pedir (demo)
              </button>
            </div>
          </li>
        ))}
      </ul>
    </main>
  )
}
