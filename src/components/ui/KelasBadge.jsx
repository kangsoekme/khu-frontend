export const KelasBadge = ({ namaKelas }) => {
  if (!namaKelas) return <span>-</span>;

  const kelasStr = namaKelas.trim().toUpperCase();
  const isPutra = kelasStr.endsWith("A");
  const isPutri = kelasStr.endsWith("B");

  return (
    <div className="inline-flex items-center gap-1.5 font-medium">
      <span className="text-neutral-800">{namaKelas}</span>
      {isPutra && (
        <span className="px-2 py-0.5 text-[11px] rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-semibold">
          Putra
        </span>
      )}
      {isPutri && (
        <span className="px-2 py-0.5 text-[11px] rounded-full bg-pink-50 text-pink-700 border border-pink-200 font-semibold">
          Putri
        </span>
      )}
    </div>
  );
};
