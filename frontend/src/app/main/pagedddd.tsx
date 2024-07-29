// src/app/main/page.tsx
"use client";
import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Clock } from "lucide-react";

// Types
type TaskStatus = "To-Do" | "In Progress" | "Under Review" | "Completed";
type TaskPriority = "Low" | "Medium" | "Urgent" | null;

type Task = {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  deadline: string | null;
};

type Column = {
  id: TaskStatus;
  title: string;
};

// Constants
const columns: Column[] = [
  { id: "To-Do", title: "To-Do" },
  { id: "In Progress", title: "In Progress" },
  { id: "Under Review", title: "Under Review" },
  { id: "Completed", title: "Completed" },
];

// Components
const TaskForm: React.FC<{
  task: Task;
  onSubmit: (task: Task) => void;
  onCancel: () => void;
  isEdit: boolean;
  allowStatusChange: boolean;
}> = ({ task, onSubmit, onCancel, isEdit, allowStatusChange }) => {
  const [formData, setFormData] = useState(task);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert("Title is mandatory");
      return;
    }
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 rounded relative max-w-md w-full"
      >
        <h2 className="text-lg font-semibold mb-2">
          {isEdit ? "Edit Task" : "Create New Task"}
        </h2>
        <button
          type="button"
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={onCancel}
        >
          ✕
        </button>
        <input
          className="w-full mb-2 p-2 border rounded"
          placeholder="Task Title (required)"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Status
          </label>
          {allowStatusChange ? (
            <select
              className="w-full p-2 border rounded"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              {columns.map((column) => (
                <option key={column.id} value={column.id}>
                  {column.title}
                </option>
              ))}
            </select>
          ) : (
            <input
              className="w-full p-2 border rounded bg-gray-100"
              value={formData.status}
              readOnly
            />
          )}
        </div>
        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Priority
          </label>
          <select
            className="w-full p-2 border rounded"
            name="priority"
            value={formData.priority || ""}
            onChange={handleChange}
          >
            <option value="">Select Priority (optional)</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="Urgent">Urgent</option>
          </select>
        </div>
        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Deadline
          </label>
          <input
            className="w-full p-2 border rounded"
            type="date"
            name="deadline"
            value={formData.deadline || ""}
            onChange={handleChange}
            placeholder="Deadline (optional)"
          />
        </div>
        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            className="w-full p-2 border rounded"
            placeholder="Task Description (optional)"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
        >
          {isEdit ? "Update Task" : "Create Task"}
        </button>
        <button
          type="button"
          className="bg-gray-300 px-2 py-1 rounded"
          onClick={onCancel}
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

const TaskItem: React.FC<{
  task: Task;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}> = ({ task, onDelete, onEdit }) => {
  return (
    <div className="bg-white p-2 mb-2 rounded shadow">
      <h3 className="font-semibold">{task.title}</h3>
      <p className="text-sm text-gray-600">{task.description}</p>
      <div className="flex items-center mt-2">
        {task.priority && (
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2">
            {task.priority}
          </span>
        )}
        {task.deadline && (
          <span className="text-xs text-gray-500 flex items-center">
            <Clock size={12} className="mr-1" />
            {task.deadline}
          </span>
        )}
      </div>
      <div className="mt-2">
        <button
          className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
          onClick={() => onEdit(task)}
        >
          Edit
        </button>
        <button
          className="bg-red-500 text-white px-2 py-1 rounded"
          onClick={() => onDelete(task.id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

// Main component
const TaskBoard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [newTaskStatus, setNewTaskStatus] = useState<TaskStatus | null>(null);

  useEffect(() => {
    // Fetch tasks from the database here
    // For now, we'll use mock data
    setTasks([
      {
        id: "1",
        title: "Task 1",
        description: "Description 1",
        status: "To-Do",
        priority: "Low",
        deadline: "2024-08-01",
      },
      {
        id: "2",
        title: "Task 2",
        description: "Description 2",
        status: "In Progress",
        priority: "Medium",
        deadline: null,
      },
    ]);
  }, []);

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const { source, destination } = result;

    const updatedTasks = Array.from(tasks);
    const [reorderedTask] = updatedTasks.splice(source.index, 1);
    reorderedTask.status = destination.droppableId as TaskStatus;
    updatedTasks.splice(destination.index, 0, reorderedTask);

    setTasks(updatedTasks);
    // Update task in the database here
  };

  const handleCreateOrUpdateTask = (task: Task) => {
    if (editingTask) {
      setTasks(tasks.map((t) => (t.id === task.id ? task : t)));
      setEditingTask(null);
    } else {
      const newTask = { ...task, id: Date.now().toString() };
      setTasks([...tasks, newTask]);
    }
    setIsModalOpen(false);
    setNewTaskStatus(null);
    // Create or update task in the database here
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
    // Delete task from the database here
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const openModalWithStatus = (status: TaskStatus | null) => {
    setEditingTask(null);
    setNewTaskStatus(status);
    setIsModalOpen(true);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Task Board</h1>
      <button
        className="mb-4 bg-green-500 text-white px-4 py-2 rounded"
        onClick={() => openModalWithStatus(null)}
      >
        Add New Task
      </button>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex space-x-4">
          {columns.map((column) => (
            <div key={column.id} className="bg-gray-100 p-4 rounded-lg w-1/4">
              <h2 className="text-lg font-semibold mb-2">{column.title}</h2>
              <Droppable droppableId={column.id}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="min-h-[200px]"
                  >
                    {tasks
                      .filter((task) => task.status === column.id)
                      .map((task, index) => (
                        <Draggable
                          key={task.id}
                          draggableId={task.id}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <TaskItem
                                task={task}
                                onDelete={handleDeleteTask}
                                onEdit={handleEditTask}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
              <button
                className="w-full mt-2 bg-blue-500 text-white px-2 py-1 rounded"
                onClick={() => openModalWithStatus(column.id)}
              >
                Add Task
              </button>
            </div>
          ))}
        </div>
      </DragDropContext>
      {isModalOpen && (
        <TaskForm
          task={
            editingTask || {
              id: "",
              title: "",
              description: "",
              status: newTaskStatus || "To-Do",
              priority: null,
              deadline: null,
            }
          }
          onSubmit={handleCreateOrUpdateTask}
          onCancel={() => {
            setIsModalOpen(false);
            setEditingTask(null);
            setNewTaskStatus(null);
          }}
          isEdit={!!editingTask}
          allowStatusChange={!newTaskStatus || !!editingTask}
        />
      )}
    </div>
  );
};

export default TaskBoard;
