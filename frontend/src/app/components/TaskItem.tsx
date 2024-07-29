import React from "react";
import { Clock } from "lucide-react";

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

interface TaskItemProps {
  task: Task;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onDelete, onEdit }) => {
  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case "Low":
        return "bg-green-100 text-green-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Urgent":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white p-2 mb-2 rounded shadow">
      <h3 className="font-semibold">{task.title}</h3>
      <p className="text-sm text-gray-600">{task.description}</p>
      <div className="flex items-center mt-2">
        {task.priority && (
          <span
            className={`text-xs px-2 py-1 rounded mr-2 ${getPriorityColor(
              task.priority
            )}`}
          >
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

export default TaskItem;
