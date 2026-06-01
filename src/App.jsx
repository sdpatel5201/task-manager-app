import { useEffect, useState } from "react";
import {
  Plus,
  Trash2,
  Pencil,
  LogOut,
  Loader2,
} from "lucide-react";

const stages = ["Todo", "In Progress", "Done"];

export default function App() {
  const [user, setUser] = useState(null);
  const [isLogin, setIsLogin] = useState(true);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [tasks, setTasks] = useState([]);

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [stage, setStage] = useState("Todo");

  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);

  // Boot
  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");

    if (currentUser) {
      setUser(currentUser);

      const savedTasks =
        JSON.parse(localStorage.getItem(`tasks_${currentUser}`)) || [];

      setTasks(savedTasks);
    }

    setTimeout(() => {
      setLoading(false);
    }, 800);
  }, []);

  // Save tasks
  useEffect(() => {
    if (user) {
      localStorage.setItem(`tasks_${user}`, JSON.stringify(tasks));
    }
  }, [tasks, user]);

  // Auth
  const handleAuth = () => {
    if (!username || !password) {
      alert("Please fill all fields");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || {};

    if (isLogin) {
      if (users[username] !== password) {
        alert("Invalid credentials");
        return;
      }
    } else {
      if (users[username]) {
        alert("User already exists");
        return;
      }

      users[username] = password;
      localStorage.setItem("users", JSON.stringify(users));
    }

    localStorage.setItem("currentUser", username);
    setUser(username);

    const savedTasks =
      JSON.parse(localStorage.getItem(`tasks_${username}`)) || [];

    setTasks(savedTasks);
  };

  // Add/Edit Task
  const handleTask = () => {
    if (!title) {
      alert("Task title required");
      return;
    }

    if (editingId) {
      const updated = tasks.map((task) =>
        task.id === editingId
          ? { ...task, title, desc, stage }
          : task
      );

      setTasks(updated);
      setEditingId(null);
    } else {
      const newTask = {
        id: Date.now(),
        title,
        desc,
        stage,
      };

      setTasks([...tasks, newTask]);
    }

    setTitle("");
    setDesc("");
    setStage("Todo");
  };

  // Delete
  const deleteTask = (id) => {
    const filtered = tasks.filter((task) => task.id !== id);
    setTasks(filtered);
  };

  // Edit
  const editTask = (task) => {
    setTitle(task.title);
    setDesc(task.desc);
    setStage(task.stage);
    setEditingId(task.id);
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("currentUser");
    setUser(null);
    setTasks([]);
  };

  // Loading Screen
 // 1. Loading Screen
if (loading) {
  return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center p-4">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="animate-spin text-emerald-500 w-10 h-10" />
        <p className="text-zinc-500 text-sm animate-pulse">Loading workspace...</p>
      </div>
    </div>
  );
}

// 2. Auth Screen
if (!user) {
  return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center p-4">
      <div className="bg-[#18181b] border border-zinc-800 p-8 rounded-2xl w-full max-w-md shadow-2xl">
        <h1 className="text-3xl font-bold text-white mb-2">
          Task Manager
        </h1>
          <p className="text-zinc-400 mb-6">
            Manage your workflow efficiently
          </p>

          <input
            type="text"
            placeholder="Username"
            className="w-full p-3 rounded-lg bg-black border border-zinc-700 text-white mb-4 outline-none"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded-lg bg-black border border-zinc-700 text-white mb-4 outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={handleAuth}
            className="w-full bg-emerald-500 hover:bg-emerald-600 transition-all text-white py-3 rounded-lg font-semibold"
          >
            {isLogin ? "Login" : "Register"}
          </button>

          <p className="text-zinc-400 mt-4 text-center">
            {isLogin
              ? "Don't have an account?"
              : "Already have an account?"}
          </p>

          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-emerald-400 w-full mt-2"
          >
            {isLogin ? "Register" : "Login"}
          </button>
        </div>
      </div>
    );
  }

  // Main App
  return (
    <div className="min-h-screen bg-[#09090b] text-white">
      {/* Navbar */}
      <div className="flex justify-between items-center p-5 border-b border-zinc-800">
        <div>
          <h1 className="text-2xl font-bold">Task Manager</h1>
          <p className="text-zinc-400 text-sm">@{user}</p>
        </div>

        <button
          onClick={logout}
          className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-lg"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>

      {/* Task Form */}
      <div className="p-5">
        <div className="bg-[#18181b] border border-zinc-800 rounded-2xl p-5 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {editingId ? "Edit Task" : "Create Task"}
          </h2>

          <input
            type="text"
            placeholder="Task title"
            className="w-full p-3 rounded-lg bg-black border border-zinc-700 mb-4 outline-none"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            placeholder="Description"
            className="w-full p-3 rounded-lg bg-black border border-zinc-700 mb-4 outline-none"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />

          <select
            className="w-full p-3 rounded-lg bg-black border border-zinc-700 mb-4 outline-none"
            value={stage}
            onChange={(e) => setStage(e.target.value)}
          >
            {stages.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>

          <button
            onClick={handleTask}
            className="bg-emerald-500 hover:bg-emerald-600 transition-all px-5 py-3 rounded-lg flex items-center gap-2"
          >
            <Plus size={18} />
            {editingId ? "Update Task" : "Add Task"}
          </button>
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {stages.map((column) => (
            <div
              key={column}
              className="bg-[#18181b] border border-zinc-800 rounded-2xl p-4 min-h-[400px]"
            >
              <h2 className="text-lg font-bold mb-4">
                {column}
              </h2>

              <div className="space-y-4">
                {tasks
                  .filter((task) => task.stage === column)
                  .map((task) => (
                    <div
                      key={task.id}
                      className="bg-black border border-zinc-800 rounded-xl p-4"
                    >
                      <h3 className="font-semibold text-lg">
                        {task.title}
                      </h3>

                      <p className="text-zinc-400 text-sm mt-2">
                        {task.desc}
                      </p>

                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={() => editTask(task)}
                          className="bg-emerald-500 hover:bg-emerald-600 p-2 rounded-lg"
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          onClick={() => deleteTask(task.id)}
                          className="bg-red-500 hover:bg-red-600 p-2 rounded-lg"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
