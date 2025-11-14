import { supabase } from '@/lib/supabaseClient'

export default async function Home() {
  const { data: trucks } = await supabase
    .from('food_truck')
    .select('id, display_name, cuisines, is_open, capacity_per_15m')
    .order('display_name', { ascending: true })

  const safeTrucks = trucks ?? []

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-4">FestivalFuel demo</h1>
      <p className="mb-6 text-slate-600">
        Food trucks conectados a Supabase:
      </p>

      {safeTrucks.length === 0 && (
        <p className="text-sm text-slate-500">
          No hay registros en la tabla <code>food_truck</code> o no se han
          podido cargar.
        </p>
      )}

      <ul className="space-y-3">
        {safeTrucks.map((t) => (
<li
  key={t.id}
  className="border rounded-xl p-4 flex items-center justify-between"
>
  <div>
    <div className="font-semibold">{t.display_name}</div>
    <div className="text-sm text-slate-500">
      {(t.cuisines || []).join(', ') || 'Sin categoría'}
    </div>
  </div>

  <a
    href={`/truck/${t.id}`}
    className="text-sm text-blue-600 underline"
  >
    Ver menú →
  </a>
</li>

        ))}
      </ul>
    </main>
  )
}
