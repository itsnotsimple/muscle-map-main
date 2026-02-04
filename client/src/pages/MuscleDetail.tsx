import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { ArrowLeft, Dumbbell, MapPin, Clock, Info, Bookmark, Check } from "lucide-react";

const MuscleDetail = () => {
  const { muscleId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Използваме 'any' за данните от базата, за да не усложняваме с дълги интерфейси сега
  const [muscleData, setMuscleData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Стейт за запазените, също масив от 'any'
  const [savedExercises, setSavedExercises] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const muscleRes = await fetch(`http://localhost:5000/api/muscles/${muscleId}`);
        if (!muscleRes.ok) throw new Error("Muscle not found");
        const muscleJson = await muscleRes.json();
        setMuscleData(muscleJson);

        if (user) {
          const bookmarksRes = await fetch("http://localhost:5000/api/user/bookmarks", {
            headers: { "Authorization": `Bearer ${user.token}` }
          });
          if (bookmarksRes.ok) {
            const bookmarksJson = await bookmarksRes.json();
            setSavedExercises(bookmarksJson);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [muscleId, user]);

  const handleBookmark = async (exercise: any) => {
    if (!user) {
      navigate("/login");
      return;
    }

    const isAlreadySaved = savedExercises.some((e) => e.name === exercise.name);
    let newSavedList;
    
    if (isAlreadySaved) {
        newSavedList = savedExercises.filter((e) => e.name !== exercise.name);
    } else {
        newSavedList = [...savedExercises, { ...exercise, muscleGroup: muscleData.title }];
    }
    setSavedExercises(newSavedList);

    try {
      const response = await fetch("http://localhost:5000/api/user/bookmark", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user.token}`
        },
        body: JSON.stringify({ 
            exercise: { ...exercise, muscleGroup: muscleData.title } 
        })
      });

      if (!response.ok) {
        throw new Error("Failed to save");
      }
      
      const updatedList = await response.json();
      setSavedExercises(updatedList);

    } catch (err) {
      console.error("Save error:", err);
    }
  };

  const isSaved = (exerciseName: string) => {
    return savedExercises.some((e) => e.name === exerciseName);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!muscleData) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
          <h2 className="text-2xl font-bold text-slate-800">Muscle Not Found</h2>
          <Link to="/" className="text-blue-600 hover:underline mt-4">Go Back Home</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#F8FAFC]">
      <Header />
      
      <main className="flex-1 container mx-auto py-10 px-4 md:px-6">
        
        <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 mb-6 transition-colors font-medium">
          <ArrowLeft size={20} /> Back to Map
        </Link>

        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 mb-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600">
              <Dumbbell size={32} />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 capitalize">
                {muscleData.title}
              </h1>
              <p className="text-slate-500 font-medium mt-1">
                Complete Training Guide
              </p>
            </div>
          </div>
          
          <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
             <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Target Anatomy</span>
             <div className="flex flex-wrap gap-2">
                {(muscleData.subTitle || "Primary Muscle").split(',').map((part: string, index: number) => (
                  <span key={index} className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-slate-700 text-sm font-semibold shadow-sm">
                    {part.trim()}
                  </span>
                ))}
             </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
           <span className="w-2 h-8 bg-blue-600 rounded-full"></span>
           Exercises & Demonstrations
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {muscleData.exercises.map((ex: any, index: number) => {
            const saved = isSaved(ex.name); 

            return (
                <div key={index} className="bg-white rounded-3xl overflow-hidden shadow-lg border border-slate-100 hover:shadow-xl transition-shadow flex flex-col relative group">
                
                <button 
                    onClick={() => handleBookmark(ex)}
                    className={`absolute top-4 right-4 z-10 p-2.5 rounded-full shadow-md transition-all transform active:scale-90 ${
                    saved 
                        ? "bg-blue-600 text-white hover:bg-blue-700" 
                        : "bg-white text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                    }`}
                    title={saved ? "Remove from saved" : "Save exercise"}
                >
                    {saved ? <Check size={18} strokeWidth={3} /> : <Bookmark size={18} />}
                </button>

                <div className="bg-slate-100 aspect-video flex items-center justify-center relative overflow-hidden group">
                    {ex.gif ? (
                        <img 
                        src={ex.gif} 
                        alt={ex.name} 
                        className="w-full h-full object-cover mix-blend-multiply"
                        />
                    ) : (
                        <div className="text-slate-400 flex flex-col items-center">
                            <Dumbbell size={48} className="opacity-20 mb-2" />
                            <span className="text-sm font-medium opacity-50">No GIF available</span>
                        </div>
                    )}
                    
                    <div className="absolute top-4 left-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
                            ex.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' :
                            ex.difficulty === 'Advanced' ? 'bg-red-100 text-red-700' :
                            'bg-yellow-100 text-yellow-700'
                        }`}>
                            {ex.difficulty || "General"}
                        </span>
                    </div>
                </div>

                <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{ex.name}</h3>
                    <p className="text-slate-500 text-sm mb-4 leading-relaxed border-b border-slate-100 pb-4">
                        {ex.text}
                    </p>

                    <div className="flex flex-wrap gap-4 text-xs text-slate-500 mb-6">
                        {ex.equipment && (
                            <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded">
                                <Clock size={14} /> <span>{ex.equipment}</span>
                            </div>
                        )}
                        {ex.location && (
                            <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded">
                                <MapPin size={14} /> <span className="text-blue-600 font-semibold">{ex.location}</span>
                            </div>
                        )}
                    </div>

                    {ex.steps && ex.steps.length > 0 && (
                        <div className="mt-auto bg-blue-50/50 rounded-xl p-4 border border-blue-50">
                            <div className="flex items-center gap-2 text-xs font-bold text-blue-700 uppercase mb-3">
                                <Info size={14} /> Execution:
                            </div>
                            <ul className="space-y-2">
                                {ex.steps.map((step: string, i: number) => (
                                    <li key={i} className="flex gap-3 text-sm text-slate-700">
                                        <span className="font-bold text-blue-400 min-w-[20px]">{i + 1}.</span>
                                        <span className="leading-snug">{step}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
                </div>
            );
          })}
        </div>

      </main>
      <Footer />
    </div>
  );
};

export default MuscleDetail;