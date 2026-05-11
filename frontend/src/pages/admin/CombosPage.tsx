import { useEffect, useState } from "react";
import { useCombosStore } from "@/store/combos";
import { useProductsStore } from "@/store/products";
import { Button } from "@/components/ui/Button";
import { DataTable } from "@/components/ui/DataTable";
import { ComboFormModal } from "@/components/ui/ComboFormModal";
import type { Combo } from "../../../../shared/src/index";

export function CombosPage() {
  const { combos, isLoading, error, fetchCombos, deleteCombo } = useCombosStore();
  const { products, fetchProducts } = useProductsStore();
  const [showModal, setShowModal] = useState(false);
  const [selectedCombo, setSelectedCombo] = useState<Combo | null>(null);

  useEffect(() => {
    fetchCombos();
    fetchProducts();
  }, [fetchCombos, fetchProducts]);

  const handleEdit = (combo: Combo) => {
    setSelectedCombo(combo);
    setShowModal(true);
  };

  const handleDelete = async (combo: Combo) => {
    if (confirm(`¿Eliminar combo "${combo.name}"?`)) {
      await deleteCombo(combo._id);
    }
  };

  const columns: { label: string; render: (_value: any, combo: Combo) => React.ReactNode }[] = [
    {
      label: "Nombre",
      render: (_value, combo) => combo.name,
    },
    {
      label: "Productos",
      render: (_value, combo) => combo.products?.length || 0,
    },
    {
      label: "Descuento",
      render: (_value, combo) => `${combo.discount}%`,
    },
    {
      label: "Precio",
      render: (_value, combo) => `$${combo.comboPrice.toLocaleString()}`,
    },
    {
      label: "Estado",
      render: (_value, combo) => (
        <span
          className={`px-2 py-1 text-xs rounded ${
            combo.active ? "bg-primary/20 text-primary" : "bg-outline/20"
          }`}
        >
          {combo.active ? "Activo" : "Inactivo"}
        </span>
      ),
    },
  ];

  if (error) {
    return (
      <div className="p-6">
        <p className="text-primary">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-serif font-bold text-on-surface">
          Combos
        </h1>
        <Button onClick={() => setShowModal(true)}>
          <i className="fa fa-plus mr-2"></i>
          Nuevo Combo
        </Button>
      </div>

      {/* Table */}
      <DataTable
        data={combos}
        columns={columns}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        emptyMessage="No hay combos creados"
      />

      {/* Modal */}
      <ComboFormModal
        open={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedCombo(null);
          fetchCombos();
        }}
        combo={selectedCombo}
        products={products}
      />
    </div>
  );
}