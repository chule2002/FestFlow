import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function POST(req: Request) {
  const body = await req.json()

  const { truck_id, item_id, item_name, price_cents } = body

  if (!truck_id || !item_id) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
  }

  const { error } = await supabase.from('orders').insert([
    {
      truck_id,
      item_id,
      item_name,
      price_cents,
    },
  ])

  if (error) {
    console.error(error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
