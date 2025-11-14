import { supabase } from '@/lib/supabaseClient'

type TruckRow = {
  id: string
  display_name: string
  cuisines: string[] | null
  is_open: boolean | null
  capacity_per_15m: number | null
}

export default async function Home() {
  const { data } = await supabase
    .from('food_truck')
    .select('id, display_name, cuisines, is_open, capacity_per_15m')
    .order('display_name', { ascending: true })

  const trucks: TruckRow[] = (data as TruckRow[]) ?? []

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-4">FestivalFuel demo</h1>
      <p>Food trucks conectados a Supabase:</p>

      {trucks.length === 0 && (
        <p className="mt-4 text-sm text-slate-600">
          No hay registros en la tabla <code>food_truck</code>.
        </p>
      )}

      <ul className="mt-6 space-y-4">
        {trucks.map((t) => (
          <li
            key={t.id}
            className="border rounded-xl p-4 flex items-center justify-between"
          >
            <div>
              <div className="font-semibold">{t.display_name}</div>
              <div className="text-sm text-slate-500">
                {(t.cuisines || []).join(', ') || 'Sin categoría'}
              </div>
              <div className="text-xs text-slate-400 mt-1">
                ID: <code>{t.id}</code>
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

