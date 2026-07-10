export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <main
      className="min-h-[60vh]"
      style={{
        backgroundColor: "rgba(35, 43, 28, 0.60)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      }}
    >
      {children}
    </main>
  );
}
