export default function Button({
  children,
  styles,
}: {
  children: React.ReactNode;
  styles?: string;
}) {
  return (
    <button
      className={
        "rounded self-center bg-black text-white hover:bg-slate-800 transition-all w-fit py-2 px-4 " +
        styles
      }
    >
      {children}
    </button>
  );
}
