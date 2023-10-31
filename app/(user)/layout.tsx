export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className='flex flex-col flex-1 w-full h-full max-w-6xl mx-auto'>
      {children}
    </main>
  );
}
