import { useState } from "react";
import { Link } from "react-router-dom";
import { ExternalLink, Clock, MapPin, Info, Dumbbell } from "lucide-react"; 
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { InteractiveMuscleMap } from "@/components/InteractiveMuscleMap";

interface Exercise {
  name: string;
  text: string;
  difficulty?: string; 
  equipment?: string;
  location?: string; 
  steps?: string[]; 
  gif?: string;
}

interface MuscleData {
  key: string;
  title: string;
  subTitle?: string;
  exercises: Exercise[];
}

const Index = () => {
  const [muscleData, setMuscleData] = useState<MuscleData | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeKey, setActiveKey] = useState<string | null>(null);

  const handleMuscleSelect = async (muscleName: string) => {
    // 1. Взимаме името от картата
   let key = muscleName.toLowerCase();
    console.log("Map clicked:", key); 

    switch (key) {
      // ------------------------------------------
      // 1. ОПРАВЯМЕ ПРЕДНОТО БЕДРО (Quads)
      // ------------------------------------------
      case 'quads':
      case 'quadriceps':
        // ГРЕШКАТА БЕШЕ ТУК: Преди пишеше 'legs', а в базата ти е 'quads' (ред 11)
        key = 'quads'; 
        break;

      // ------------------------------------------
      // 2. ОПРАВЯМЕ СРЕДАТА НА ГЪРБА (Traps)
      // ------------------------------------------
      case 'traps':
      case 'trapezius':
      case 'upper-back':     
      case 'middle-back':    // <--- ЕТО ТОВА ЛИПСВАШЕ! (Средата на гърба)
      case 'rhomboids':      // <--- И това (Ромбоиди)
      case 'neck':
        key = 'traps';       // В базата данни ги записваме като 'traps' (ред 9)
        break;

      // ------------------------------------------
      // ОСТАНАЛИТЕ (които си работят)
      // ------------------------------------------
      case 'lower-back':
      case 'lower_back':
      case 'lower back':
        key = 'lower_back'; // Ред 7 в базата
        break;

      case 'forearm':
      case 'forearms':
        key = 'forearms'; // Ред 6 в базата
        break;

      case 'obliques':
      case 'external oblique':
        key = 'obliques'; // Ред 5 в базата
        break;

      case 'lats':
      case 'latissimus':
      case 'back':
        key = 'lats'; // Ред 8 в базата
        break;

      case 'delts':
      case 'deltoids':
      case 'shoulder': // картата понякога праща singular
        key = 'shoulders';
        break;
        
      case 'hamstrings':
        key = 'hamstrings';
        break;
        
      case 'calves':
        key = 'calves';
        break;

      case 'glutes':
        key = 'glutes';
        break;
        
      case 'rectus abdominis': 
      case 'abs':
        key = 'abs';
        break;
        
       case 'chest':
       case 'pectorals':
         key = 'chest';
         break;
         
       case 'biceps':
         key = 'biceps';
         break;
         
       case 'triceps':
         key = 'triceps';
         break;
    }

    console.log("Searching DB for:", key);

    setActiveKey(key);
    setLoading(true);
    setMuscleData(null); 
    
    try {
      const response = await fetch(`http://localhost:5000/api/muscles/${key}`);
      if (!response.ok) throw new Error("Not found");
      const data = await response.json();
      setMuscleData(data);
    } catch (err) {
      console.error("Error loading muscle:", err);
      // Тук не правим нищо, за да остане празно или може да покажем грешка
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#F8FAFC]">
      <Header />
      
      <main className="flex-1 container mx-auto py-8 px-4 md:px-6">
        <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
          
          {/* --- ЛЯВО: КАРТАТА --- */}
          <div className="w-full lg:w-[750px] flex-shrink-0 sticky top-8">
            <div className="bg-white rounded-[2rem] shadow-xl border border-slate-100 p-6 relative">
               <h2 className="text-center text-slate-400 text-xs font-bold uppercase tracking-widest mb-6">
                 Select Muscle Group
               </h2>
               <div className="flex justify-center">
                 <InteractiveMuscleMap onMuscleSelect={handleMuscleSelect} />
               </div>
            </div>
          </div>

          {/* --- ДЯСНО: ПАНЕЛ С ДАННИ --- */}
          <div className="flex-1 w-full max-w-2xl">
            
            {loading && (
              <div className="bg-white rounded-2xl p-10 shadow-sm border border-slate-200 min-h-[600px] flex flex-col items-center justify-center">
                 <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                 <p className="text-slate-500 font-medium">Loading training data...</p>
              </div>
            )}

            {!loading && !muscleData && (
               <div className="bg-white rounded-2xl border-2 border-dashed border-slate-200 p-10 min-h-[600px] flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mb-4">
                    <Dumbbell size={28} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-700">Category Training</h3>
                  <p className="text-slate-400 text-sm mt-2 max-w-xs">
                    Select a muscle group from the map to view detailed exercises and instructions.
                  </p>
               </div>
            )}

            {!loading && muscleData && (
              <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-right-4 duration-500">
                
                {/* ЗАГЛАВИЕ */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                      <Dumbbell size={20} />
                    </div>
                    <h2 className="text-lg font-bold text-slate-800">Category Training</h2>
                  </div>
                  <Link to={`/muscle/${muscleData.key}`} className="text-sm font-semibold text-white bg-[#8B5CF6] hover:bg-[#7c3aed] px-4 py-2 rounded-lg transition-colors flex items-center gap-1">
                    <ExternalLink size={14} /> Expand
                  </Link>
                </div>

                {/* ПОДЗАГЛАВИЕ */}
                <div className="bg-blue-50/80 border border-blue-100 rounded-xl p-5">
                  <h3 className="text-blue-700 font-bold text-sm mb-2">
                    {muscleData.title} Muscle Group:
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {(muscleData.subTitle || "Primary muscle group").split(',').map((part, i) => (
                      <span key={i} className="flex items-center gap-1.5 text-blue-600/90 text-sm font-medium bg-white/60 px-2 py-1 rounded-md">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                        {part.trim()}
                      </span>
                    ))}
                  </div>
                </div>

                {/* СПИСЪК */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-slate-800 font-bold px-1 mt-2">
                    <Dumbbell size={18} className="text-slate-400" />
                    Recommended Exercises
                  </div>

                  {muscleData.exercises.map((ex, index) => (
                    <div key={index} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
                      
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-bold text-slate-800">{ex.name}</h3>
                        {ex.difficulty && (
                          <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                            ex.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' : 
                            ex.difficulty === 'Advanced' ? 'bg-red-100 text-red-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {ex.difficulty}
                          </span>
                        )}
                      </div>

                      <p className="text-slate-500 text-sm mb-4">{ex.text}</p>

                      <div className="flex flex-wrap gap-4 text-xs text-slate-500 mb-5 pb-4 border-b border-slate-100">
                        {ex.equipment && (
                          <div className="flex items-center gap-1.5">
                            <Clock size={14} />
                            <span>Equipment: <span className="text-slate-700 font-medium">{ex.equipment}</span></span>
                          </div>
                        )}
                        {ex.location && (
                          <div className="flex items-center gap-1.5">
                            <MapPin size={14} />
                            <span className="text-blue-600 font-medium">{ex.location}</span>
                          </div>
                        )}
                      </div>

                      {ex.steps && ex.steps.length > 0 && (
                        <div className="bg-slate-50 rounded-lg p-4">
                          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase mb-3">
                            <Info size={14} /> How to Perform:
                          </div>
                          <ul className="space-y-2">
                            {ex.steps.slice(0, 3).map((step, stepIndex) => (
                              <li key={stepIndex} className="text-sm text-slate-600 flex gap-2">
                                <span className="font-bold text-slate-400 min-w-[15px]">{stepIndex + 1}.</span>
                                <span className="leading-relaxed">{step}</span>
                              </li>
                            ))}
                          </ul>
                          {ex.steps.length > 3 && (
                             <p className="text-xs text-slate-400 mt-2 pl-6 italic">... click expand to see more</p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                  
                  <div className="text-center pt-2 pb-4">
                    <Link to={`/muscle/${muscleData.key}`} className="text-blue-600 text-sm font-semibold hover:underline">
                      View full guide & details...
                    </Link>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-xl p-4 text-xs text-blue-800 leading-relaxed border border-blue-100 mt-2">
                  <span className="font-bold">Category Training:</span> These exercises target the entire muscle group and are great for building overall strength and size. For more specific isolation exercises, switch to Individual view mode.
                </div>

              </div>
            )}

          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;