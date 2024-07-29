import React, { useState } from "react";

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

interface TaskFormProps {
  task: Task;
  onSubmit: (task: Task) => void;
  onCancel: () => void;
  isEdit: boolean;
  allowStatusChange: boolean;
  columns: Column[];
}

const TaskForm: React.FC<TaskFormProps> = ({
  task,
  onSubmit,
  onCancel,
  isEdit,
  allowStatusChange,
  columns,
}) => {
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
          ❌
        </button>
        <input
          className="w-full mb-2 p-2 border rounded"
          placeholder="Title (required)"
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
            Priority (optional)
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
            Deadline (optional)
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
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description (optional)
          </label>
          <textarea
            id="description"
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

export default TaskForm;
