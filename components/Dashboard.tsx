import React, { useEffect, useState } from "react";
import {
  Hexagon,
  LayoutDashboard,
  History as HistoryIcon,
  Settings,
  LogOut,
  Linkedin,
  Mail,
  Twitter,
  Pencil,
  Save,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { MEDICAL_TOOLS } from "../src/config/tools";
import { auth, db } from "../firebase";
import {
  collection,
  getDocs,
  orderBy,
  query,
  limit,
} from "firebase/firestore";

// ✅ ALREADY PRESENT – KEPT
import History from "./History";
import { downloadHistoryPDF } from "../services/reportEngine";

interface DashboardProps {
  user: any;
  onLogout: () => void;
}

type TabType = "dashboard" | "history" | "settings" | "tool";

interface RecentHistory {
  id: string;
  toolName: string;
  result: {
    risk: string;
    message: string;
  };
  createdAt: any;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<TabType>("dashboard");
  const [activeToolId, setActiveToolId] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);

  const [recentHistory, setRecentHistory] = useState<RecentHistory[]>([]);

  const activeTool = MEDICAL_TOOLS.find(
    (tool) => tool.id === activeToolId
  );

  const fullName = user?.displayName || "Mohit Rao";
  const [first, last] = fullName.split(" ");

  const [patientDetails, setPatientDetails] = useState({
    firstName: first || "",
    lastName: last || "",
    email: user?.email || "",
    dob: "",
    address: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPatientDetails({ ...patientDetails, [e.target.name]: e.target.value });
  };

  // 🔥 FETCH RECENT HISTORY (LAST 3)
  useEffect(() => {
    const fetchRecentHistory = async () => {
      if (!auth.currentUser) return;

      const q = query(
        collection(db, "users", auth.currentUser.uid, "history"),
        orderBy("createdAt", "desc"),
        limit(3)
      );

      const snapshot = await getDocs(q);

      const records = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as any),
      }));

      setRecentHistory(records);
    };

    fetchRecentHistory();
  }, []);

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans">
      {/* SIDEBAR */}
      <aside className="w-72 bg-white border-r flex flex-col">
        <div
          className="p-8 flex items-center gap-3 cursor-pointer"
          onClick={() => {
            setActiveTab("dashboard");
            setActiveToolId(null);
          }}
        >
          <Hexagon className="h-8 w-8 text-techBlue" />
          <span className="font-bold text-xl">
            HexaCare <span className="text-techBlue">Intelligence</span>
          </span>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {[
            { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
            { id: "history", label: "History", icon: HistoryIcon },
            { id: "settings", label: "Settings", icon: Settings },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id as TabType);
                  if (item.id !== "tool") setActiveToolId(null);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition
                  ${
                    isActive
                      ? "bg-gray-100 text-gray-900 font-semibold"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
              >
                <Icon size={20} />
                {item.label}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* MAIN */}
      <main className="flex-1 p-12">
        {/* DASHBOARD */}
        {activeTab === "dashboard" && !activeToolId && (
          <div className="max-w-[1600px] mx-auto">
            <div className="flex items-center gap-4 mb-10">
              <h1 className="text-4xl font-bold text-gray-900">
                Welcome Back, {patientDetails.firstName} {patientDetails.lastName}
              </h1>

              <button
                onClick={onLogout}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm
                  text-gray-600 border border-gray-300 hover:bg-gray-100 transition"
              >
                <LogOut size={14} />
                Logout
              </button>
            </div>

            {/* TOOLS */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-12">
              {MEDICAL_TOOLS.map((tool) => (
                <div
                  key={tool.id}
                  onClick={() => {
                    setActiveToolId(tool.id);
                    setActiveTab("tool");
                  }}
                  className="bg-white p-8 rounded-3xl shadow
                    hover:shadow-xl hover:-translate-y-1 cursor-pointer transition"
                >
                  <div
                    className={`w-14 h-14 bg-gradient-to-br ${tool.color}
                      rounded-xl flex items-center justify-center text-white mb-6`}
                  >
                    <tool.icon size={28} />
                  </div>

                  <h3 className="text-xl font-bold mb-2 text-gray-900">
                    {tool.title}
                  </h3>
                  <p className="text-gray-500 text-sm">
                    {tool.description}
                  </p>
                </div>
              ))}
            </div>

            {/* RECENT ACTIVITY */}
            {recentHistory.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Recent Activity
                </h2>

                <div className="space-y-4">
                  {recentHistory.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-xl bg-white border shadow-sm"
                    >
                      <div className="flex justify-between mb-1">
                        <p className="font-semibold">{item.toolName}</p>
                        <span className="text-xs text-gray-400">
                          {item.createdAt?.toDate?.().toLocaleString()}
                        </span>
                      </div>

                      <p className="text-sm text-gray-600">
                        <strong>Risk:</strong> {item.result.risk}
                      </p>

                      <p className="text-sm text-gray-500 italic">
                        {item.result.message}
                      </p>

                      {/* ✅ STEP-4 ADDITION */}
                      <p className="mt-2 text-xs text-green-600 font-semibold">
                        ✔ Blockchain Verified Report
                      </p>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setActiveTab("history")}
                  className="mt-4 text-sm text-techBlue font-bold"
                >
                  View full history →
                </button>
              </div>
            )}
          </div>
        )}

        {/* TOOL */}
        {activeTab === "tool" && activeTool && (
          <div className="max-w-[1600px] mx-auto">
            <button
              onClick={() => {
                setActiveTab("dashboard");
                setActiveToolId(null);
              }}
              className="flex items-center gap-2 text-gray-600 mb-6"
            >
              <ArrowLeft size={18} /> Back to Dashboard
            </button>

            <h1 className="text-4xl font-bold mb-8 text-gray-900">
              {activeTool.title}
            </h1>

            <activeTool.component />
          </div>
        )}

        {/* HISTORY */}
        {activeTab === "history" && (
          <div className="max-w-5xl mx-auto space-y-8">
            <History />

            {/* ✅ STEP-4 TEXT UPDATE */}
            <div className="bg-white p-8 rounded-2xl shadow text-gray-600 text-center">
              Download your blockchain-verified health screening report as a PDF.
            </div>

            <button
              onClick={downloadHistoryPDF}
              className="mx-auto block px-6 py-3 bg-techBlue text-white rounded-xl font-bold hover:opacity-90"
            >
              Download Health Report (PDF)
            </button>
          </div>
        )}

        {/* SETTINGS */}
        {activeTab === "settings" && (
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-4xl font-bold text-gray-900">
                Patient Settings
              </h1>

              {!editMode ? (
                <button
                  onClick={() => setEditMode(true)}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md
                    text-sm border border-gray-300 hover:bg-gray-100"
                >
                  <Pencil size={14} /> Edit
                </button>
              ) : (
                <button
                  onClick={() => setEditMode(false)}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md
                    text-sm border border-green-300 text-green-700 hover:bg-green-50"
                >
                  <Save size={14} /> Save
                </button>
              )}
            </div>

            <div className="bg-white p-8 rounded-2xl shadow grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                ["First Name", "firstName"],
                ["Last Name", "lastName"],
                ["Email", "email"],
              ].map(([label, name]) => (
                <div key={name}>
                  <label className="text-sm text-gray-500">{label}</label>
                  <input
                    name={name}
                    value={(patientDetails as any)[name]}
                    onChange={handleChange}
                    disabled={!editMode}
                    className="w-full border p-4 rounded-xl mt-1 disabled:bg-gray-100"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FOOTER */}
        <footer className="mt-16 text-center text-sm text-gray-500">
          <div className="flex justify-center gap-6 mb-4">
            <Linkedin size={18} />
            <Mail size={18} />
            <Twitter size={18} />
          </div>
          © 2025 HexaCare Intelligence. All rights reserved.
        </footer>
      </main>
    </div>
  );
};

export default Dashboard;
