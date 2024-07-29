import React from "react";
import TaskItem from "./TaskItem";

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

interface TaskBoardProps {
  tasks: Task[];
  columns: Column[];
  onDeleteTask: (id: string) => void;
  onEditTask: (task: Task) => void;
  openModalWithStatus: (status: TaskStatus | null) => void;
}

const TaskBoard: React.FC<TaskBoardProps> = ({
  tasks,
  columns,
  onDeleteTask,
  onEditTask,
  openModalWithStatus,
}) => {
  return (
    <div className="flex space-x-4">
      {columns.map((column) => (
        <div key={column.id} className="bg-gray-100 p-4 rounded-lg w-1/4">
          <h2 className="text-lg font-semibold mb-2">{column.title}</h2>
          <div className="min-h-[200px]">
            {tasks
              .filter((task) => task.status === column.id)
              .map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onDelete={onDeleteTask}
                  onEdit={onEditTask}
                />
              ))}
          </div>
          <button
            className="w-full mt-2 bg-gray-800 text-white px-2 py-1 rounded-lg"
            onClick={() => openModalWithStatus(column.id)}
          >
            Add Task +
          </button>
        </div>
      ))}
    </div>
  );
};

export default TaskBoard;
