import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Bookmark, Dumbbell, Activity } from "lucide-react";

// 1. Дефинираме типа (Задължително за TSX)
interface Exercise {
  name: string;
  muscleGroup?: string;
  difficulty?: string;
  gif?: string;
  text?: string;
  equipment?: string;
  location?: string;
  steps?: string[];
  _id?: string;
}

const Bookmarks = () => {
  const { user, loading } = useAuth(); 
  
  // 2. Указваме, че това е масив от Exercise
  const [savedExercises, setSavedExercises] = useState<Exercise[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchBookmarks = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/user/bookmarks", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setSavedExercises(data);
        }
      } catch (err) {
        console.error("Failed to fetch bookmarks", err);
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchBookmarks();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#F8FAFC]">
      <Header />
      
      <main className="flex-1 container mx-auto py-12 px-4">
        
        <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
           <div className="w-16 h-16 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-yellow-100">
               <Bookmark size={32} />
           </div>
           <h1 className="text-3xl font-extrabold text-slate-800">Your Saved Collection</h1>
           <p className="text-slate-500 mt-2">
              Welcome back, <span className="text-blue-600 font-bold">{user.email}</span>! Here are your exercises.
           </p>
        </div>

        {isLoadingData ? (
           <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
           </div>
        ) : savedExercises.length === 0 ? (
           <div className="text-center py-12 bg-white rounded-3xl border border-slate-100 shadow-sm max-w-lg mx-auto">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                  <Dumbbell size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">No exercises yet</h3>
              <p className="text-slate-500 mb-6 px-6">
                Go back to the map and click the bookmark icon on any exercise you want to save.
              </p>
              <Link to="/" className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-md shadow-blue-200">
                Explore Exercises
              </Link>
           </div>
        ) : (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedExercises.map((ex, index) => (
                <div key={index} className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all border border-slate-100 group">
                   
                   <div className="aspect-video bg-slate-100 relative overflow-hidden">
                      {ex.gif ? (
                        <img src={ex.gif} alt={ex.name} className="w-full h-full object-cover mix-blend-multiply" />
                      ) : (
                        <div className="flex items-center justify-center h-full text-slate-300">
                           <Dumbbell size={40} />
                        </div>
                      )}
                      
                      {ex.muscleGroup && (
                        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-slate-700 shadow-sm">
                           {ex.muscleGroup}
                        </div>
                      )}
                   </div>

                   <div className="p-5">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-bold text-slate-800 leading-tight">{ex.name}</h3>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-4">
                         <span className={`text-xs font-bold px-2 py-0.5 rounded flex items-center gap-1 ${
                            ex.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' :
                            ex.difficulty === 'Advanced' ? 'bg-red-100 text-red-700' :
                            'bg-yellow-100 text-yellow-700'
                         }`}>
                            <Activity size={12} />
                            {ex.difficulty || "General"}
                         </span>
                      </div>
                      
                      <button className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 font-semibold rounded-lg text-sm transition-colors">
                         View Saved Exercise
                      </button>
                   </div>
                </div>
              ))}
           </div>
        )}

      </main>
      <Footer />
    </div>
  );
};

export default Bookmarks;