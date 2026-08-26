const positions = [
  "top-6 left-6 border-t border-l",
  "top-6 right-6 border-t border-r",
  "bottom-6 left-6 border-b border-l",
  "bottom-6 right-6 border-b border-r",
];

export function CornerMarks() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-40 hidden lg:block">
      {positions.map((pos) => (
        <div key={pos} className={`fixed h-6 w-6 ${pos} border-primary/25`} />
      ))}
    </div>
  );
}
