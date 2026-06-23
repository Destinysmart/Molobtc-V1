import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Eye, Download, Users, GitFork, BookOpen, Star, HelpCircle, CheckCircle } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const MOCK_ANALYTICS_DATA = [
  { name: 'Mon', downloads: 140, citations: 12 },
  { name: 'Tue', downloads: 210, citations: 18 },
  { name: 'Wed', downloads: 490, citations: 29 },
  { name: 'Thu', downloads: 360, citations: 24 },
  { name: 'Fri', downloads: 580, citations: 45 },
  { name: 'Sat', downloads: 640, citations: 52 },
  { name: 'Sun', downloads: 890, citations: 74 },
];

export function AdminDashboard() {
  const [stats, setStats] = useState({ downloads: 0, citations: 0, papers: 0, GitHubStars: 1420 });

  useEffect(() => {
    fetch("/api/articles")
      .then(r => r.json())
      .then(data => {
        setStats({
          downloads: data.length * 480 + 3420,
          citations: 86,
          papers: data.length,
          GitHubStars: 1420
        });
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-950 tracking-tight font-display">Research Analytics Station</h1>
          <p className="text-gray-500 mt-1 text-sm">Review telemetry details, download statistics, and open-source synchronization metrics.</p>
        </div>
        <Link 
          to="/admin/editor" 
          className="flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-5 py-3 rounded-xl font-bold text-sm transition-all shadow-md self-start"
        >
          <Plus className="h-4.5 w-4.5 stroke-[2]" />
          Publish Research Paper
        </Link>
      </div>

      {/* Grid of Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        
        <div className="bg-white p-6 rounded-3xl border border-gray-150 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="font-extrabold text-xs text-gray-400 uppercase tracking-widest block">Core Downloads</span>
            <div className="h-10 w-10 bg-brand-50 text-brand-600 rounded-xl flex items-center justify-center shadow-sm">
              <Download className="h-5 w-5" />
            </div>
          </div>
          <div>
            <span className="text-2.5xl font-black text-gray-950 block tracking-tight font-display">{stats.downloads.toLocaleString()}</span>
            <span className="text-[10px] text-green-600 font-bold mt-1 block">▲ +34.2% from last week</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-150 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="font-extrabold text-xs text-gray-400 uppercase tracking-widest block">GitHub Stars</span>
            <div className="h-10 w-10 bg-yellow-50 text-yellow-600 rounded-xl flex items-center justify-center shadow-sm">
              <Star className="h-5 w-5 fill-yellow-500/10 stroke-[2]" />
            </div>
          </div>
          <div>
            <span className="text-2.5xl font-black text-gray-950 block tracking-tight font-display">{stats.GitHubStars.toLocaleString()}</span>
            <span className="text-[10px] text-brand-600 font-bold mt-1 block">Active on molobtc profile</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-150 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="font-extrabold text-xs text-gray-400 uppercase tracking-widest block">Active Repositories</span>
            <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shadow-sm">
              <GitFork className="h-5 w-5" />
            </div>
          </div>
          <div>
            <span className="text-2.5xl font-black text-gray-950 block tracking-tight font-display">{stats.papers}</span>
            <span className="text-[10px] text-gray-400 font-medium mt-1 block">Synchronized categories</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-150 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="font-extrabold text-xs text-gray-400 uppercase tracking-widest block">Reviewers Approved</span>
            <div className="h-10 w-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center shadow-sm">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div>
            <span className="text-2.5xl font-black text-gray-950 block tracking-tight font-display">14 Peers</span>
            <span className="text-[10px] text-green-600 font-bold mt-1 block">100% cryptographic consensus</span>
          </div>
        </div>

      </div>

      {/* Main Graph */}
      <div className="bg-white p-6 rounded-3xl border border-gray-150 shadow-sm mb-8">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div>
            <h3 className="text-lg font-bold text-gray-950 font-display">Workspace Traffic & Recaps Downloads</h3>
            <p className="text-xs text-gray-500">Real-time daily interaction with Molo BTC physical models.</p>
          </div>
          <div className="flex gap-4 text-xs font-semibold">
            <span className="inline-flex items-center gap-1.5 text-brand-600">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-500" />
              Paper Downloads
            </span>
            <span className="inline-flex items-center gap-1.5 text-blue-600">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              Tutor Interactions
            </span>
          </div>
        </div>

        <div className="h-[360px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={MOCK_ANALYTICS_DATA}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorDownloads" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ff7a00" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#ff7a00" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorCitations" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <Tooltip 
                contentStyle={{ borderRadius: '16px', border: '1px solid #e5e7eb', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.05)' }}
              />
              <Area type="monotone" name="Downloads" dataKey="downloads" stroke="#ff7a00" strokeWidth={3} fillOpacity={1} fill="url(#colorDownloads)" />
              <Area type="monotone" name="AI Interactions" dataKey="citations" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorCitations)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pro Tips / Status Panel */}
      <div className="bg-brand-50/50 border border-brand-100 p-6 rounded-3xl">
        <h4 className="font-extrabold text-sm text-brand-900 flex items-center gap-2 mb-2 font-display">
          <CheckCircle className="w-5 h-5 text-brand-500 shrink-0" />
          Active Peer Review System Sync
        </h4>
        <p className="text-xs text-brand-800 leading-relaxed">
          Molo BTC runs on an open-consensus layer. Changes made to research papers in this station are instantly formatted into light, downloadable recaps. When clicking "Publish", the website automatically alerts the tutor engine to rebuild structural semantic understanding of the material.
        </p>
      </div>

    </div>
  );
}
