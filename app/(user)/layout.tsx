export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='flex flex-col flex-1 max-w-6xl mx-auto'>{children}</div>
  );
}
