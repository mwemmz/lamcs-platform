import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Reveal } from "@/components/ui";

export const runtime = 'edge';

export const dynamic = "force-dynamic";

export default async function ProducePage() {
  const listings = await prisma.produceListing.findMany({
    where: { status: "ACTIVE" },
    orderBy: { name: "asc" },
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-20 md:py-28">
      <Reveal>
        <div className="rounded-2xl bg-gradient-to-br from-avocado-flesh/15 to-avocado-flesh/5 p-10 md:p-16">
          <span className="inline-block rounded-full bg-avocado-flesh/30 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-avocado-skin">Market</span>
          <h1 className="mt-4 font-serif text-4xl md:text-5xl text-avocado-skin">Our Produce</h1>
          <p className="mt-4 max-w-xl text-lg text-ink/70">
            Fresh from our member farms, graded and ready for you.
          </p>
        </div>
      </Reveal>

      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3 md:mt-16">
        {listings.map((item, i) => (
          <Reveal key={item.id} delay={(i % 3) * 100} className="h-full">
            <Link
              href={`/produce/${item.id}`}
              className="group glass-card block h-full p-6 transition-all hover:shadow-lg hover:shadow-black/10"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="rounded-full bg-avocado-flesh/20 px-3 py-1 text-xs font-semibold text-avocado-skin">
                  {item.grade}
                </span>
                <span className="font-mono text-sm text-pit">
                  ZMW {Number(item.price).toFixed(2)}/kg
                </span>
              </div>
              <h2 className="font-serif text-xl text-avocado-skin group-hover:underline">
                {item.name}
              </h2>
              <p className="mt-1 text-sm text-ink/60 capitalize">{item.category}</p>
              <p className="mt-2 font-mono text-xs text-ink/40">
                {Number(item.quantityKg).toFixed(0)} kg available
              </p>
            </Link>
          </Reveal>
        ))}
      </div>

      {listings.length === 0 && (
        <div className="mt-20 text-center">
          <p className="text-ink/50">No produce available right now. Check back soon.</p>
        </div>
      )}
    </div>
  );
}
