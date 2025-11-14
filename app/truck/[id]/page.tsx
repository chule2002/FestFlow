type Props = {
  params: { id: string }
}

export default async function TruckPage({ params }: Props) {
  return (
    <main className="min-h-screen p-8">
      <a href="/" className="text-sm text-blue-600 underline">
        ← Volver al listado
      </a>

      <h1 className="text-3xl font-bold mt-4">
        Detalle del food truck
      </h1>

      <p className="mt-4 text-lg">
        ID del truck: <code>{params.id}</code>
      </p>
    </main>
  )
}
