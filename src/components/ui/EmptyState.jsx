import { FaRegFolderOpen } from "react-icons/fa";

export function EmptyState({ message = "Data tidak ditemukan" }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-white rounded-lg border border-dashed shadow-sm">
      <FaRegFolderOpen className="w-12 h-12 text-neutral-300 mb-4" />
      <h3 className="text-lg font-semibold text-neutral-700">{message}</h3>
      <p className="text-sm text-neutral-500 mt-1">
        Silakan ubah filter atau tambahkan data baru.
      </p>
    </div>
  );
}
