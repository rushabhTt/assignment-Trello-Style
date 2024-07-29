"use client";
import React, { useState, useEffect } from "react";
import TaskBoard from "../components/TaskBoard";
import TaskForm from "../components/TaskForm";

export type TaskStatus = "To-Do" | "In Progress" | "Under Review" | "Completed";
export type TaskPriority = "Low" | "Medium" | "Urgent" | null;

export type Task = {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  deadline: string | null;
};

export type Column = {
  id: TaskStatus;
  title: string;
};

const columns: Column[] = [
  { id: "To-Do", title: "To-Do" },
  { id: "In Progress", title: "In Progress" },
  { id: "Under Review", title: "Under Review" },
  { id: "Completed", title: "Completed" },
];

const MainPage: React.FC = () => {
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
        className="mb-4 bg-indigo-800 text-white px-4 py-2 rounded-lg"
        onClick={() => openModalWithStatus(null)}
      >
        Create New Task +
      </button>
      <TaskBoard
        tasks={tasks}
        columns={columns}
        onDeleteTask={handleDeleteTask}
        onEditTask={handleEditTask}
        openModalWithStatus={openModalWithStatus}
      />
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
          columns={columns}
        />
      )}
    </div>
  );
};

export default MainPage;
