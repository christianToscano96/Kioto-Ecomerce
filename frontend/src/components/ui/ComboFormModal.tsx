import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useCombosStore } from "@/store/combos";
import type { Combo, Product } from "../../../../shared/src/index";

interface ComboFormModalProps {
  open: boolean;
  onClose: () => void;
  combo?: Combo | null;
  products: Product[];
}

export function ComboFormModal({
  open,
  onClose,
  combo,
  products,
}: ComboFormModalProps) {
  const { createCombo, updateCombo } = useCombosStore();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [discount, setDiscount] = useState(10);
  const [active, setActive] = useState(true);

  useEffect(() => {
    if (combo) {
      setName(combo.name);
      setDescription(combo.description || "");
      setSelectedProducts(
        combo.products.map((p) => (typeof p === "string" ? p : p._id))
      );
      setDiscount(combo.discount);
      setActive(combo.active);
    } else {
      setName("");
      setDescription("");
      setSelectedProducts([]);
      setDiscount(10);
      setActive(true);
    }
  }, [combo]);

  // Agrupar productos por categoría
  const productsByCategory = products.reduce((acc, product) => {
    const categoryName =
      typeof product.category === "object" && product.category !== null
        ? (product.category as any).name
        : "Sin categoría";
    if (!acc[categoryName]) {
      acc[categoryName] = [];
    }
    acc[categoryName].push(product);
    return acc;
  }, {} as Record<string, Product[]>);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      name,
      description,
      products: selectedProducts,
      discount,
      active,
    };

    if (combo) {
      await updateCombo(combo._id, data);
    } else {
      await createCombo(data);
    }
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col px-6 py-4">
        <DialogHeader>
          <DialogTitle>
            {combo ? "Editar Combo" : "Nuevo Combo"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto space-y-6">
          {/* Nombre y Descuento en fila */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Nombre</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: Combo Verano"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">
                Descuento (%)
              </label>
              <Input
                type="number"
                min="0"
                max="100"
                value={discount}
                onChange={(e) => setDiscount(Number(e.target.value))}
              />
            </div>
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium mb-1.5">
              Descripción
            </label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descripción del combo..."
            />
          </div>

          {/* Productos con preview */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">
                Productos ({selectedProducts.length} seleccionados)
              </label>
              {selectedProducts.length > 0 && (
                <span className="text-xs text-on-surface-variant">
                  Precio calculado: ${selectedProducts
                    .reduce((sum, id) => {
                      const p = products.find((p) => p._id === id);
                      return sum + (p?.price || 0);
                    }, 0)
                    .toLocaleString()}
                </span>
              )}
            </div>

            <div className="max-h-80 overflow-y-auto border border-outline-variant/30 rounded-lg p-3 space-y-3">
              {Object.entries(productsByCategory).map(([category, prods]) => (
                <div key={category} className="space-y-1.5">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-xs font-semibold text-on-surface-variant uppercase">
                      {category}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const allSelected = prods.every((p) =>
                          selectedProducts.includes(p._id)
                        );
                        if (allSelected) {
                          setSelectedProducts(
                            selectedProducts.filter(
                              (id) => !prods.some((p) => p._id === id)
                            )
                          );
                        } else {
                          setSelectedProducts([
                            ...selectedProducts,
                            ...prods
                              .filter((p) => !selectedProducts.includes(p._id))
                              .map((p) => p._id),
                          ]);
                        }
                      }}
                      className="text-xs text-primary hover:underline"
                    >
                      {prods.every((p) => selectedProducts.includes(p._id))
                        ? "Quitar"
                        : "Seleccionar"}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {prods.map((product) => {
                      const isSelected = selectedProducts.includes(product._id);
                      return (
                        <label
                          key={product._id}
                          className={`
                            flex items-center gap-2 p-2 rounded-md cursor-pointer text-sm
                            transition-colors
                            ${isSelected
                              ? "bg-primary/10 border border-primary/30"
                              : "hover:bg-surface-container-low border border-transparent"}
                          `}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedProducts([...selectedProducts, product._id]);
                              } else {
                                setSelectedProducts(
                                  selectedProducts.filter((id) => id !== product._id)
                                );
                              }
                            }}
                            className="rounded border-outline-variant"
                          />
                          <span className="flex-1 truncate">{product.name}</span>
                          <span className="text-xs text-on-surface-variant">
                            ${product.price.toLocaleString()}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Estado activo */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="active"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
              className="rounded border-outline-variant"
            />
            <label htmlFor="active" className="text-sm">
              Activo
            </label>
          </div>

          {/* Acciones */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">{combo ? "Actualizar" : "Crear"} Combo</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}