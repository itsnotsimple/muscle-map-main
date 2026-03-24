import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Header from "../components/Header";
import Footer from "../components/Footer";
import InteractiveMuscleMap from "../components/InteractiveMuscleMap";
import MuscleInfoCard from "../components/MuscleInfoCard"; // Импортираме новия панел

const Index = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  
  // State за избрания мускул (вместо директна навигация)
  const [selectedMuscle, setSelectedMuscle] = useState<string | null>(null);

  const handleMuscleSelect = (muscle: string) => {
    console.log("Panel opened for:", muscle);
    setSelectedMuscle(muscle); // Само отваря панела, не навигира
  };

  const closePanel = () => {
    setSelectedMuscle(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors overflow-x-hidden">
      <Header />

      <main className="flex-grow relative">
        {/* HERO SECTION */}
        <section className="bg-white dark:bg-slate-900 py-8 shadow-sm transition-colors border-b border-transparent dark:border-slate-800">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-slate-100 mb-2 transition-colors">
              {t('index.title1')} <span className="text-blue-600 dark:text-blue-400">{t('index.title2')}</span>
            </h1>
            <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto mb-6 transition-colors">
              {t('index.subtitle')}
            </p>
            
            {!user && (
              <div className="flex justify-center gap-4">
                <Link to="/register" className="bg-blue-600 text-white px-6 py-2 rounded-full font-bold hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 shadow-md transition-all">
                  {t('index.start')}
                </Link>
                <Link to="/login" className="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 px-6 py-2 rounded-full font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                  {t('index.login')}
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* MAP SECTION */}
        <section className="py-8 container mx-auto px-4 flex justify-center overflow-hidden">
          {/* Картата се измества леко вляво, ако панелът е отворен (на големи екрани) */}
          <div className={`w-full max-w-[900px] transition-all duration-500 ${selectedMuscle ? 'md:mr-[350px]' : 'mx-auto'}`}>
             <div className="bg-white dark:bg-slate-900 p-2 md:p-4 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-800 w-full transition-colors overflow-hidden">
                <InteractiveMuscleMap onMuscleSelect={handleMuscleSelect} />
             </div>
          </div>
        </section>

        {/* СТРАНИЧЕН ПАНЕЛ (SIDE TAB) */}
        {selectedMuscle && (
            <MuscleInfoCard 
                muscleKey={selectedMuscle} 
                onClose={closePanel} 
            />
        )}

      </main>

      <Footer />
    </div>
  );
};

export default Index;