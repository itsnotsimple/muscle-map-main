import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Calculator, RefreshCcw, Info, Activity } from "lucide-react";

const BmiPage = () => {
  // Стейт за входните данни (по подразбиране слагаме средни стойности)
  const [height, setHeight] = useState(175); // см
  const [weight, setWeight] = useState(75);  // кг
  const [bmi, setBmi] = useState(null);
  const [category, setCategory] = useState("");
  const [color, setColor] = useState("text-slate-800");

  // Логиката за смятане
  const calculateBMI = () => {
    if (!height || !weight) return;

    // Формула: кг / (м * м)
    const heightInMeters = height / 100;
    const bmiValue = (weight / (heightInMeters * heightInMeters)).toFixed(1);
    
    setBmi(bmiValue);
    determineCategory(parseFloat(bmiValue));
  };

  // Логика за категорията и цветовете
  const determineCategory = (value) => {
    if (value < 18.5) {
      setCategory("Underweight");
      setColor("text-blue-500"); // Синьо за поднормено
    } else if (value >= 18.5 && value < 24.9) {
      setCategory("Normal Weight");
      setColor("text-green-500"); // Зелено за нормално
    } else if (value >= 25 && value < 29.9) {
      setCategory("Overweight");
      setColor("text-yellow-500"); // Жълто за наднормено
    } else {
      setCategory("Obesity");
      setColor("text-red-500"); // Червено за затлъстяване
    }
  };

  const reset = () => {
    setBmi(null);
    setCategory("");
    setHeight(175);
    setWeight(75);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#F8FAFC]">
      <Header />
      
      <main className="flex-1 container mx-auto py-10 px-4 flex flex-col items-center">
        
        {/* ЗАГЛАВИЕ */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-slate-800 flex items-center justify-center gap-3">
            <Calculator className="text-blue-600" size={32} />
            BMI Calculator
          </h1>
          <p className="text-slate-500 mt-2">
            Calculate your Body Mass Index to analyze your health status.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
          
          {/* ЛЯВО: ВХОДНИ ДАННИ (INPUTS) */}
          <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100 h-fit">
            
            {/* Height Slider */}
            <div className="mb-8">
              <div className="flex justify-between mb-2">
                <label className="text-slate-700 font-bold">Height (cm)</label>
                <span className="text-blue-600 font-bold bg-blue-50 px-3 py-1 rounded-lg">
                    {height} cm
                </span>
              </div>
              <input 
                type="range" 
                min="100" 
                max="220" 
                value={height} 
                onChange={(e) => setHeight(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            {/* Weight Slider */}
            <div className="mb-8">
              <div className="flex justify-between mb-2">
                <label className="text-slate-700 font-bold">Weight (kg)</label>
                <span className="text-blue-600 font-bold bg-blue-50 px-3 py-1 rounded-lg">
                    {weight} kg
                </span>
              </div>
              <input 
                type="range" 
                min="30" 
                max="180" 
                value={weight} 
                onChange={(e) => setWeight(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            {/* БУТОНИ */}
            <div className="flex gap-4 mt-6">
              <button 
                onClick={calculateBMI}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all shadow-md shadow-blue-200 flex justify-center items-center gap-2"
              >
                <Activity size={20} /> Calculate
              </button>
              
              <button 
                onClick={reset}
                className="px-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-colors"
                title="Reset"
              >
                <RefreshCcw size={20} />
              </button>
            </div>
          </div>

          {/* ДЯСНО: РЕЗУЛТАТ */}
          <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100 flex flex-col items-center justify-center min-h-[300px]">
            {!bmi ? (
              // СЪСТОЯНИЕ: ПРЕДИ ДА НАТИСНЕШ БУТОНА
              <div className="text-center opacity-50">
                 <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Activity size={40} className="text-slate-400" />
                 </div>
                 <p className="text-lg font-medium text-slate-500">
                    Enter your details and click calculate
                 </p>
              </div>
            ) : (
              // СЪСТОЯНИЕ: РЕЗУЛТАТ
              <div className="text-center w-full animate-in fade-in zoom-in duration-300">
                 <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-2">
                    Your Result
                 </p>
                 
                 {/* ЧИСЛОТО */}
                 <div className={`text-6xl font-black mb-2 ${color}`}>
                    {bmi}
                 </div>
                 
                 {/* КАТЕГОРИЯТА */}
                 <div className={`text-xl font-bold mb-6 ${color} bg-opacity-10 px-4 py-2 rounded-full inline-block`}>
                    {category}
                 </div>

                 {/* СКАЛА (Visual Bar) */}
                 <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden relative mb-6">
                    {/* Маркер къде си ти */}
                    <div 
                        className="absolute top-0 bottom-0 w-1 bg-slate-800 z-10 transition-all duration-500"
                        style={{ left: `${Math.min(Math.max((bmi / 40) * 100, 0), 100)}%` }} 
                    ></div>
                    
                    {/* Цветовете на скалата */}
                    <div className="w-full h-full flex">
                        <div className="w-[46%] h-full bg-blue-300"></div>   {/* Underweight */}
                        <div className="w-[16%] h-full bg-green-400"></div>  {/* Normal */}
                        <div className="w-[13%] h-full bg-yellow-400"></div> {/* Overweight */}
                        <div className="w-[25%] h-full bg-red-400"></div>    {/* Obese */}
                    </div>
                 </div>

                 {/* ЛЕГЕНДА */}
                 <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                    <span>Underweight</span>
                    <span>Normal</span>
                    <span>Overweight</span>
                    <span>Obesity</span>
                 </div>

                 {/* СЪВЕТ */}
                 <div className="mt-8 bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm text-slate-600 text-left flex gap-3">
                    <Info className="flex-shrink-0 text-blue-500" size={20} />
                    <p>
                      {category === "Normal Weight" 
                        ? "Great job! Keep maintaining your balanced diet and regular exercise." 
                        : "Consider consulting with a fitness trainer or nutritionist to build a plan that fits your goals."}
                    </p>
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

export default BmiPage;