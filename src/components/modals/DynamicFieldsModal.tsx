
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Edit2 } from "lucide-react";
import { useDynamicFields, DynamicField } from "@/hooks/useDynamicFields";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";

interface DynamicFieldsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DynamicFieldsModal({ isOpen, onClose }: DynamicFieldsModalProps) {
  const { fields, addField, updateField, deleteField, getFieldsByCategory } = useDynamicFields();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingField, setEditingField] = useState<DynamicField | null>(null);
  const [activeCategory, setActiveCategory] = useState<'cliente' | 'fornecedor' | 'empresa'>('cliente');
  
  const [newField, setNewField] = useState<{
    label: string;
    key: string;
    type: 'text' | 'number' | 'date' | 'email' | 'phone';
    category: 'cliente' | 'fornecedor' | 'empresa';
    required: boolean;
  }>({
    label: '',
    key: '',
    type: 'text',
    category: 'cliente',
    required: false
  });

  const handleAddField = () => {
    if (!newField.label || !newField.key) return;
    
    addField({
      ...newField,
      category: activeCategory
    });
    
    setNewField({
      label: '',
      key: '',
      type: 'text',
      category: 'cliente',
      required: false
    });
    setShowAddForm(false);
  };

  const handleEditField = (field: DynamicField) => {
    setEditingField(field);
    setNewField({
      label: field.label,
      key: field.key,
      type: field.type,
      category: field.category,
      required: field.required
    });
    setShowAddForm(true);
  };

  const handleUpdateField = () => {
    if (!editingField || !newField.label || !newField.key) return;
    
    updateField(editingField.id, {
      label: newField.label,
      key: newField.key,
      type: newField.type,
      required: newField.required
    });
    
    setEditingField(null);
    setNewField({
      label: '',
      key: '',
      type: 'text',
      category: 'cliente',
      required: false
    });
    setShowAddForm(false);
  };

  const handleCancel = () => {
    setEditingField(null);
    setNewField({
      label: '',
      key: '',
      type: 'text',
      category: 'cliente',
      required: false
    });
    setShowAddForm(false);
  };

  const categoryFields = getFieldsByCategory(activeCategory);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-orange-600">
            Gerenciar Campos Dinâmicos
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeCategory} onValueChange={(value) => setActiveCategory(value as any)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="cliente">Clientes</TabsTrigger>
            <TabsTrigger value="fornecedor">Fornecedores</TabsTrigger>
            <TabsTrigger value="empresa">Empresas</TabsTrigger>
          </TabsList>

          {(['cliente', 'fornecedor', 'empresa'] as const).map((category) => (
            <TabsContent key={category} value={category} className="space-y-4 mt-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">
                  Campos de {category === 'cliente' ? 'Cliente' : category === 'fornecedor' ? 'Fornecedor' : 'Empresa'}
                </h3>
                <Button
                  onClick={() => {
                    setActiveCategory(category);
                    setShowAddForm(true);
                  }}
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  <Plus size={16} />
                  Adicionar Campo
                </Button>
              </div>

              {showAddForm && activeCategory === category && (
                <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                  <h4 className="font-semibold">
                    {editingField ? 'Editar Campo' : 'Novo Campo'}
                  </h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="label">Nome do Campo</Label>
                      <Input
                        id="label"
                        value={newField.label}
                        onChange={(e) => setNewField({ ...newField, label: e.target.value })}
                        placeholder="Ex: Nome do Cliente"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="key">Chave do Campo</Label>
                      <Input
                        id="key"
                        value={newField.key}
                        onChange={(e) => setNewField({ ...newField, key: e.target.value })}
                        placeholder="Ex: cliente.nome"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="type">Tipo do Campo</Label>
                      <Select value={newField.type} onValueChange={(value: 'text' | 'number' | 'date' | 'email' | 'phone') => setNewField({ ...newField, type: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="text">Texto</SelectItem>
                          <SelectItem value="number">Número</SelectItem>
                          <SelectItem value="date">Data</SelectItem>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="phone">Telefone</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center space-x-2 mt-6">
                      <Switch
                        id="required"
                        checked={newField.required}
                        onCheckedChange={(checked) => setNewField({ ...newField, required: checked })}
                      />
                      <Label htmlFor="required">Campo obrigatório</Label>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={editingField ? handleUpdateField : handleAddField}
                      className="bg-orange-500 hover:bg-orange-600"
                    >
                      {editingField ? 'Atualizar' : 'Adicionar'}
                    </Button>
                    <Button variant="outline" onClick={handleCancel}>
                      Cancelar
                    </Button>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                {getFieldsByCategory(category).map((field) => (
                  <div
                    key={field.id}
                    className="flex items-center justify-between p-3 bg-white border rounded-lg"
                  >
                    <div>
                      <h4 className="font-medium">{field.label}</h4>
                      <p className="text-sm text-gray-500">
                        {field.key} • {field.type} {field.required && '• Obrigatório'}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditField(field)}
                      >
                        <Edit2 size={14} />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteField(field.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        <div className="flex justify-end pt-4">
          <Button onClick={onClose}>
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
