import { supabase } from '@/lib/supabaseClient'

type OrderRow = {
  id: string
  truck_id: string
  item_name: string
  price_cents: number
  status: string | null
  created_at: string
}

export default async function AdminPage() {
  const { data } = await supabase
    .from('orders')
    .select('id, truck_id, item_name, price_cents, status, created_at')
    .order('created_at', { ascending: false })
    .limit(30)

  const orders: OrderRow[] = (data as OrderRow[]) ?? []

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-4">Panel de pedidos (demo)</h1>

      <p className="text-sm text-slate-600 mb-6">
        Últimos pedidos creados desde la app de cliente.
      </p>

      {orders.length === 0 && (
        <p className="text-sm text-slate-500">
          Todavía no hay pedidos. Ve a la página principal, entra en un truck y
          pulsa "Pedir (demo)".
        </p>
      )}

      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2">Hora</th>
            <th className="text-left py-2">Truck</th>
            <th className="text-left py-2">Producto</th>
            <th className="text-right py-2">Precio</th>
            <th className="text-left py-2">Estado</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id} className="border-b">
              <td className="py-2">
                {new Date(o.created_at).toLocaleTimeString('es-CH', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </td>
              <td className="py-2 text-xs">{o.truck_id}</td>
              <td className="py-2">{o.item_name}</td>
              <td className="py-2 text-right">
                CHF {(o.price_cents / 100).toFixed(2)}
              </td>
              <td className="py-2">
                {o.status ?? 'pending'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  )
}

