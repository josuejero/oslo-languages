
"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { 
  HomeIcon, BookOpen, Users, FileText, Mail, Bell, 
  Settings, LogOut, Plus, Trash2, Edit, Eye, Calendar 
} from "lucide-react";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [notifications, setNotifications] = useState(3);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl text-gray-700">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/admin/login");
  };

  
  const stats = [
    { 
      title: "Total Courses", 
      value: "24", 
      change: "+3 this month", 
      trend: "up",
      icon: <BookOpen className="w-8 h-8 text-blue-500" /> 
    },
    { 
      title: "Student Inquiries", 
      value: "128", 
      change: "+12% from last month", 
      trend: "up",
      icon: <Mail className="w-8 h-8 text-green-500" /> 
    },
    { 
      title: "Blog Posts", 
      value: "32", 
      change: "Last published 2 days ago", 
      trend: "neutral",
      icon: <FileText className="w-8 h-8 text-purple-500" /> 
    },
    { 
      title: "Website Visitors", 
      value: "1,284", 
      change: "+22% from last month", 
      trend: "up",
      icon: <Users className="w-8 h-8 text-amber-500" /> 
    }
  ];

  
  const recentPosts = [
    { id: 1, title: "5 Tips to Improve Your Norwegian Pronunciation", date: "April 1, 2025", status: "Published" },
    { id: 2, title: "Common English Mistakes Made by Norwegian Speakers", date: "March 25, 2025", status: "Published" },
    { id: 3, title: "The History of Spanish Influence in Norway", date: "March 15, 2025", status: "Published" },
    { id: 4, title: "Why Learn Norwegian?", date: "Draft", status: "Draft" }
  ];

  
  const upcomingEvents = [
    { id: 1, title: "Norwegian A1 Class Start", date: "April 15, 2025", time: "18:00" },
    { id: 2, title: "Business English Workshop", date: "April 18, 2025", time: "10:00" },
    { id: 3, title: "Spanish Cultural Evening", date: "April 22, 2025", time: "19:00" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {}
      <aside className="hidden md:flex flex-col w-64 bg-gradient-to-b from-blue-700 via-indigo-600 to-purple-700 text-white">
        <div className="p-5 border-b border-blue-800">
          <div className="flex items-center space-x-3">
            <div className="bg-white p-2 rounded-lg">
              <Image 
                src="/images/logo.png" 
                alt="Oslo Languages Logo" 
                width={40} 
                height={40}
                className="rounded"
              />
            </div>
            <h1 className="text-xl font-bold">Admin Portal</h1>
          </div>
        </div>
        
        <nav className="flex-1 py-6 px-4 space-y-1">
          <button 
            onClick={() => setActiveTab("dashboard")}
            className={`flex items-center w-full px-4 py-3 rounded-lg transition-all ${
              activeTab === "dashboard" 
                ? "bg-white text-blue-700 font-medium shadow" 
                : "text-blue-100 hover:bg-white/10"
            }`}
          >
            <HomeIcon className="w-5 h-5 mr-3" />
            Dashboard
          </button>
          
          <button 
            onClick={() => setActiveTab("courses")}
            className={`flex items-center w-full px-4 py-3 rounded-lg transition-all ${
              activeTab === "courses" 
                ? "bg-white text-blue-700 font-medium shadow" 
                : "text-blue-100 hover:bg-white/10"
            }`}
          >
            <BookOpen className="w-5 h-5 mr-3" />
            Courses
          </button>
          
          <button 
            onClick={() => setActiveTab("blog")}
            className={`flex items-center w-full px-4 py-3 rounded-lg transition-all ${
              activeTab === "blog" 
                ? "bg-white text-blue-700 font-medium shadow" 
                : "text-blue-100 hover:bg-white/10"
            }`}
          >
            <FileText className="w-5 h-5 mr-3" />
            Blog Posts
          </button>
          
          <button 
            onClick={() => setActiveTab("inquiries")}
            className={`flex items-center w-full px-4 py-3 rounded-lg transition-all ${
              activeTab === "inquiries" 
                ? "bg-white text-blue-700 font-medium shadow" 
                : "text-blue-100 hover:bg-white/10"
            }`}
          >
            <Mail className="w-5 h-5 mr-3" />
            Inquiries
          </button>
          
          <button 
            onClick={() => setActiveTab("settings")}
            className={`flex items-center w-full px-4 py-3 rounded-lg transition-all ${
              activeTab === "settings" 
                ? "bg-white text-blue-700 font-medium shadow" 
                : "text-blue-100 hover:bg-white/10"
            }`}
          >
            <Settings className="w-5 h-5 mr-3" />
            Settings
          </button>
        </nav>
        
        <div className="p-4 border-t border-blue-800">
          <button
            onClick={handleSignOut}
            className="flex items-center w-full px-4 py-2 text-blue-100 hover:bg-white/10 rounded-lg transition-all"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Sign Out
          </button>
        </div>
      </aside>
      
      {}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 bg-blue-600 text-white rounded-lg shadow-lg"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>
      </div>
      
      {}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40">
          <div className="fixed inset-0 bg-black opacity-50" onClick={() => setIsMenuOpen(false)}></div>
          <aside className="fixed left-0 top-0 bottom-0 w-64 bg-gradient-to-b from-blue-700 via-indigo-600 to-purple-700 text-white z-50">
            <div className="p-5 border-b border-blue-800">
              <div className="flex items-center space-x-3">
                <div className="bg-white p-2 rounded-lg">
                  <Image 
                    src="/images/logo.png" 
                    alt="Oslo Languages Logo" 
                    width={40} 
                    height={40}
                    className="rounded"
                  />
                </div>
                <h1 className="text-xl font-bold">Admin Portal</h1>
              </div>
            </div>
            
            <nav className="flex-1 py-6 px-4 space-y-1">
              {}
              <button 
                onClick={() => {
                  setActiveTab("dashboard");
                  setIsMenuOpen(false);
                }}
                className={`flex items-center w-full px-4 py-3 rounded-lg transition-all ${
                  activeTab === "dashboard" 
                    ? "bg-white text-blue-700 font-medium shadow" 
                    : "text-blue-100 hover:bg-white/10"
                }`}
              >
                <HomeIcon className="w-5 h-5 mr-3" />
                Dashboard
              </button>
              
              {}
              {}
            </nav>
            
            <div className="p-4 border-t border-blue-800">
              <button
                onClick={handleSignOut}
                className="flex items-center w-full px-4 py-2 text-blue-100 hover:bg-white/10 rounded-lg transition-all"
              >
                <LogOut className="w-5 h-5 mr-3" />
                Sign Out
              </button>
            </div>
          </aside>
        </div>
      )}
      
      {}
      <main className="flex-1 max-h-screen overflow-y-auto">
        {}
        <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">
            {activeTab === "dashboard" && "Dashboard"}
            {activeTab === "courses" && "Manage Courses"}
            {activeTab === "blog" && "Blog Posts"}
            {activeTab === "inquiries" && "Student Inquiries"}
            {activeTab === "settings" && "Settings"}
          </h1>
          
          <div className="flex items-center space-x-4">
            {}
            <button className="p-2 rounded-full hover:bg-gray-100 relative">
              <Bell className="w-6 h-6 text-gray-600" />
              {notifications > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {notifications}
                </span>
              )}
            </button>
            
            {}
            <div className="flex items-center space-x-2">
              <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold">
                A
              </div>
              <span className="text-gray-700 font-medium hidden sm:inline-block">
                Admin
              </span>
            </div>
          </div>
        </header>
        
        {}
        {activeTab === "dashboard" && (
          <div className="p-6">
            {}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => (
                <div 
                  key={index}
                  className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-300 border-t-4 border-b border-r border-l border-gray-200"
                  style={{ borderTopColor: index === 0 ? '#3B82F6' : index === 1 ? '#10B981' : index === 2 ? '#8B5CF6' : '#F59E0B' }}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-gray-500 text-sm font-medium mb-1">{stat.title}</h3>
                      <div className="text-3xl font-bold text-gray-800">{stat.value}</div>
                      <p className={`text-sm mt-2 ${
                        stat.trend === 'up' ? 'text-green-600' : 
                        stat.trend === 'down' ? 'text-red-600' : 
                        'text-gray-500'
                      }`}>
                        {stat.change}
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-gray-50">
                      {stat.icon}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {}
            <div className="grid md:grid-cols-2 gap-6">
              {}
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 py-4 px-6 flex justify-between items-center">
                  <h2 className="text-white font-bold text-lg">Recent Blog Posts</h2>
                  <Link 
                    href="/admin/blog/create"
                    className="bg-white text-blue-600 px-3 py-1 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors flex items-center"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    New Post
                  </Link>
                </div>
                
                <div>
                  {recentPosts.map((post) => (
                    <div 
                      key={post.id}
                      className="px-6 py-4 border-b last:border-b-0 hover:bg-gray-50 transition-colors flex justify-between items-center"
                    >
                      <div>
                        <div className="flex items-center">
                          <h3 className="font-medium text-gray-800">{post.title}</h3>
                          {post.status === "Draft" && (
                            <span className="ml-2 px-2 py-0.5 bg-amber-100 text-amber-800 text-xs rounded-full">
                              Draft
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">{post.date}</p>
                      </div>
                      
                      <div className="flex space-x-2">
                        <button className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-200 hover:text-gray-700">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-200 hover:text-gray-700">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-200 hover:text-gray-700">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="py-3 px-6 bg-gray-50 text-center">
                  <Link 
                    href="/admin/blog"
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    View All Posts →
                  </Link>
                </div>
              </div>
              
              {}
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 py-4 px-6 flex justify-between items-center">
                  <h2 className="text-white font-bold text-lg">Upcoming Events</h2>
                  <Link 
                    href="/admin/events/create"
                    className="bg-white text-purple-600 px-3 py-1 rounded-lg text-sm font-medium hover:bg-purple-50 transition-colors flex items-center"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Event
                  </Link>
                </div>
                
                <div>
                  {upcomingEvents.map((event) => (
                    <div 
                      key={event.id}
                      className="px-6 py-4 border-b last:border-b-0 hover:bg-gray-50 transition-colors flex justify-between items-center"
                    >
                      <div>
                        <h3 className="font-medium text-gray-800">{event.title}</h3>
                        <p className="text-sm text-gray-500">{event.date} at {event.time}</p>
                      </div>
                      
                      <div className="flex space-x-2">
                        <button className="p-1.5 rounded-full text-purple-500 hover:bg-purple-100">
                          <Calendar className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 rounded-full text-gray-500 hover:bg-gray-200">
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="py-3 px-6 bg-gray-50 text-center">
                  <Link 
                    href="/admin/events"
                    className="text-purple-600 hover:text-purple-800 text-sm font-medium"
                  >
                    View Full Calendar →
                  </Link>
                </div>
              </div>
            </div>
            
            {}
            <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100 shadow-sm">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link 
                  href="/admin/courses/create"
                  className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all flex flex-col items-center text-center"
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                    <BookOpen className="w-6 h-6 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-800">Add New Course</span>
                </Link>
                
                <Link 
                  href="/admin/blog/create"
                  className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all flex flex-col items-center text-center"
                >
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-2">
                    <FileText className="w-6 h-6 text-purple-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-800">Write Blog Post</span>
                </Link>
                
                <Link 
                  href="/admin/inquiries"
                  className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all flex flex-col items-center text-center"
                >
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2">
                    <Mail className="w-6 h-6 text-green-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-800">Check Inquiries</span>
                </Link>
                
                <Link 
                  href="/admin/settings"
                  className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all flex flex-col items-center text-center"
                >
                  <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-2">
                    <Settings className="w-6 h-6 text-amber-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-800">Site Settings</span>
                </Link>
              </div>
            </div>
          </div>
        )}
        
        {}
        {activeTab !== "dashboard" && (
          <div className="p-6">
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {activeTab === "courses" && "Course Management"}
                {activeTab === "blog" && "Blog Post Management"}
                {activeTab === "inquiries" && "Student Inquiries"}
                {activeTab === "settings" && "Site Settings"}
              </h2>
              <p className="text-gray-600 mb-6">
                This section is under development. More features coming soon!
              </p>
              <button 
                onClick={() => setActiveTab("dashboard")}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}