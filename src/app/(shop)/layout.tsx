export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return <main className="min-h-[60vh] bg-surface/60 backdrop-blur-xl">{children}</main>;
}
