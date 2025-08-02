import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Plus, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

interface TaskNote {
  id: string;
  data: string;
  nome: string;
  tarefa: string;
  status: 25 | 50 | 75 | 100;
}

interface TasksNotesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TasksNotesModal = ({ open, onOpenChange }: TasksNotesModalProps) => {
  const [tasks, setTasks] = useState<TaskNote[]>([]);
  const [newTask, setNewTask] = useState({
    data: format(new Date(), 'yyyy-MM-dd'),
    nome: '',
    tarefa: '',
    status: 25 as 25 | 50 | 75 | 100
  });
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

  const addTask = () => {
    if (newTask.nome && newTask.tarefa) {
      const task: TaskNote = {
        id: Date.now().toString(),
        ...newTask
      };
      setTasks(prev => [...prev, task]);
      setNewTask({
        data: format(new Date(), 'yyyy-MM-dd'),
        nome: '',
        tarefa: '',
        status: 25
      });
    }
  };

  const updateTaskStatus = (id: string, status: 25 | 50 | 75 | 100) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, status } : task
    ));

    // Se status for 100%, mostrar opção de excluir
    if (status === 100) {
      setTaskToDelete(id);
    }
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
    setTaskToDelete(null);
  };

  // Preencher com linhas vazias até completar 10
  const displayTasks = [...tasks];
  while (displayTasks.length < 10) {
    displayTasks.push({
      id: `empty-${displayTasks.length}`,
      data: '',
      nome: '',
      tarefa: '',
      status: 25
    });
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl text-blue-600 mb-4">Tarefas e Anotações</DialogTitle>
          </DialogHeader>
          
          {/* Formulário para adicionar nova tarefa */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-700 mb-3">Adicionar Nova Tarefa</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <Input
                type="date"
                value={newTask.data}
                onChange={(e) => setNewTask(prev => ({ ...prev, data: e.target.value }))}
                className="border-blue-300"
              />
              <Input
                placeholder="Nome"
                value={newTask.nome}
                onChange={(e) => setNewTask(prev => ({ ...prev, nome: e.target.value }))}
                className="border-blue-300"
              />
              <Input
                placeholder="Tarefa"
                value={newTask.tarefa}
                onChange={(e) => setNewTask(prev => ({ ...prev, tarefa: e.target.value }))}
                className="border-blue-300"
              />
              <div className="flex gap-2">
                <Select
                  value={newTask.status.toString()}
                  onValueChange={(value) => setNewTask(prev => ({ ...prev, status: parseInt(value) as 25 | 50 | 75 | 100 }))}
                >
                  <SelectTrigger className="border-blue-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="25">25%</SelectItem>
                    <SelectItem value="50">50%</SelectItem>
                    <SelectItem value="75">75%</SelectItem>
                    <SelectItem value="100">100%</SelectItem>
                  </SelectContent>
                </Select>
                <Button 
                  onClick={addTask}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                  size="sm"
                >
                  <Plus size={16} />
                </Button>
              </div>
            </div>
          </div>

          {/* Tabela de tarefas */}
          <div className="border border-blue-200 rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-blue-100">
                  <TableHead className="text-blue-700 font-bold border-r border-blue-200">Data</TableHead>
                  <TableHead className="text-blue-700 font-bold border-r border-blue-200">Nome</TableHead>
                  <TableHead className="text-blue-700 font-bold border-r border-blue-200">Tarefa</TableHead>
                  <TableHead className="text-blue-700 font-bold">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayTasks.map((task, index) => (
                  <TableRow key={task.id} className="border-b border-blue-100">
                    <TableCell className="border-r border-blue-100">
                      {task.data ? format(new Date(task.data), 'dd/MM/yyyy') : ''}
                    </TableCell>
                    <TableCell className="border-r border-blue-100">{task.nome}</TableCell>
                    <TableCell className="border-r border-blue-100">{task.tarefa}</TableCell>
                    <TableCell>
                      {task.nome ? (
                        <div className="flex items-center gap-2">
                          <Select
                            value={task.status.toString()}
                            onValueChange={(value) => updateTaskStatus(task.id, parseInt(value) as 25 | 50 | 75 | 100)}
                          >
                            <SelectTrigger className="w-20 border-blue-300">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="25">25%</SelectItem>
                              <SelectItem value="50">50%</SelectItem>
                              <SelectItem value="75">75%</SelectItem>
                              <SelectItem value="100">100%</SelectItem>
                            </SelectContent>
                          </Select>
                          {task.status === 100 && (
                            <Button
                              onClick={() => setTaskToDelete(task.id)}
                              variant="destructive"
                              size="sm"
                            >
                              <Trash2 size={14} />
                            </Button>
                          )}
                        </div>
                      ) : null}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de confirmação para excluir */}
      <AlertDialog open={!!taskToDelete} onOpenChange={() => setTaskToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir tarefa</AlertDialogTitle>
            <AlertDialogDescription>
              Esta tarefa foi marcada como 100% concluída. Deseja excluí-la da lista?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => taskToDelete && deleteTask(taskToDelete)}
              className="bg-red-500 hover:bg-red-600"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default TasksNotesModal;