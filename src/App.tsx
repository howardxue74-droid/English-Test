import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  CheckCircle2, 
  XCircle, 
  ChevronRight, 
  ChevronLeft, 
  RotateCcw, 
  BookOpen, 
  Trophy,
  Filter,
  Info
} from "lucide-react";
import { questions } from "./data/questions";
import { Question, Difficulty, GrammarPoint, UserAnswer } from "./types";

export default function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string | null>>({});
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [filterDifficulty, setFilterDifficulty] = useState<Difficulty | "All">("All");
  const [filterCategory, setFilterCategory] = useState<GrammarPoint | "All">("All");

  const filteredQuestions = useMemo(() => {
    return questions.filter(q => {
      const difficultyMatch = filterDifficulty === "All" || q.difficulty === filterDifficulty;
      const categoryMatch = filterCategory === "All" || q.category === filterCategory;
      return difficultyMatch && categoryMatch;
    });
  }, [filterDifficulty, filterCategory]);

  const currentQuestion = filteredQuestions[currentIndex];

  const handleSelectOption = (optionId: string) => {
    if (submitted[currentQuestion.id]) return;
    setUserAnswers(prev => ({ ...prev, [currentQuestion.id]: optionId }));
  };

  const handleSubmit = () => {
    if (!userAnswers[currentQuestion.id]) return;
    setSubmitted(prev => ({ ...prev, [currentQuestion.id]: true }));
    setShowExplanation(true);
  };

  const handleNext = () => {
    if (currentIndex < filteredQuestions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setShowExplanation(false);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setShowExplanation(false);
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setUserAnswers({});
    setSubmitted({});
    setShowExplanation(false);
  };

  const score = useMemo(() => {
    return filteredQuestions.reduce((acc, q) => {
      if (submitted[q.id] && userAnswers[q.id] === q.correctOptionId) {
        return acc + 1;
      }
      return acc;
    }, 0);
  }, [submitted, userAnswers, filteredQuestions]);

  const isFinished = Object.keys(submitted).length === filteredQuestions.length && filteredQuestions.length > 0;

  const getEncouragement = (score: number, total: number) => {
    const ratio = score / total;
    if (ratio === 1) return "太棒了！你是语法大师！🌟";
    if (ratio >= 0.8) return "非常出色！继续保持！💪";
    if (ratio >= 0.6) return "做得不错，再接再厉！👍";
    return "加油，多练习一定会进步的！✨";
  };

  if (filteredQuestions.length === 0) {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center p-6 font-sans">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-200 text-center max-w-md">
          <Filter className="w-12 h-12 text-stone-300 mx-auto mb-4" />
          <h2 className="text-xl font-medium text-stone-800 mb-2">没有找到匹配的题目</h2>
          <p className="text-stone-500 mb-6">请尝试更改筛选条件或重置过滤器。</p>
          <button 
            onClick={() => { setFilterDifficulty("All"); setFilterCategory("All"); }}
            className="px-6 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors"
          >
            重置过滤器
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans selection:bg-emerald-100">
      {/* Header */}
      <header className="bg-white border-bottom border-stone-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold">G</div>
            <h1 className="text-lg font-semibold tracking-tight">GrammarMaster</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-sm text-stone-500">
              <Trophy className="w-4 h-4 text-amber-500" />
              <span>得分: {score}/{filteredQuestions.length}</span>
            </div>
            <button 
              onClick={handleReset}
              className="p-2 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-lg transition-all"
              title="重置练习"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 pb-24">
        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8 bg-white p-4 rounded-2xl border border-stone-200 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-400">难度:</span>
            <select 
              value={filterDifficulty} 
              onChange={(e) => { setFilterDifficulty(e.target.value as any); setCurrentIndex(0); }}
              className="text-sm bg-stone-50 border-none rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-emerald-500 outline-none cursor-pointer"
            >
              <option value="All">全部难度</option>
              {Object.values(Difficulty).map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-400">知识点:</span>
            <select 
              value={filterCategory} 
              onChange={(e) => { setFilterCategory(e.target.value as any); setCurrentIndex(0); }}
              className="text-sm bg-stone-50 border-none rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-emerald-500 outline-none cursor-pointer"
            >
              <option value="All">全部知识点</option>
              {Object.values(GrammarPoint).map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-xs font-medium text-stone-400 mb-2 uppercase tracking-widest">
            <span>进度</span>
            <span>{currentIndex + 1} / {filteredQuestions.length}</span>
          </div>
          <div className="h-1.5 w-full bg-stone-200 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-emerald-500"
              initial={{ width: 0 }}
              animate={{ width: `${((currentIndex + 1) / filteredQuestions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden"
          >
            <div className="p-6 sm:p-10">
              <div className="flex items-center gap-3 mb-6">
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  currentQuestion.difficulty === Difficulty.Beginner ? "bg-emerald-100 text-emerald-700" :
                  currentQuestion.difficulty === Difficulty.Intermediate ? "bg-amber-100 text-amber-700" :
                  "bg-rose-100 text-rose-700"
                }`}>
                  {currentQuestion.difficulty}
                </span>
                <span className="px-2.5 py-1 rounded-full bg-stone-100 text-stone-600 text-[10px] font-bold uppercase tracking-wider">
                  {currentQuestion.category}
                </span>
              </div>

              {/* Sentence */}
              <div className="text-2xl sm:text-3xl font-serif leading-relaxed text-stone-800 mb-12">
                {currentQuestion.sentenceParts[0]}
                <span className={`inline-block min-w-[120px] border-b-2 mx-2 text-center transition-all ${
                  submitted[currentQuestion.id] 
                    ? (userAnswers[currentQuestion.id] === currentQuestion.correctOptionId ? "border-emerald-500 text-emerald-600" : "border-rose-500 text-rose-600")
                    : "border-stone-300 text-emerald-600"
                }`}>
                  {userAnswers[currentQuestion.id] 
                    ? currentQuestion.options.find(o => o.id === userAnswers[currentQuestion.id])?.text 
                    : "______"}
                </span>
                {currentQuestion.sentenceParts[1]}
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {currentQuestion.options.map((option) => {
                  const isSelected = userAnswers[currentQuestion.id] === option.id;
                  const isCorrect = option.id === currentQuestion.correctOptionId;
                  const isSubmitted = submitted[currentQuestion.id];

                  let buttonClass = "p-4 rounded-2xl border-2 text-left transition-all flex items-center justify-between group ";
                  if (isSubmitted) {
                    if (isCorrect) buttonClass += "border-emerald-500 bg-emerald-50 text-emerald-700";
                    else if (isSelected) buttonClass += "border-rose-500 bg-rose-50 text-rose-700";
                    else buttonClass += "border-stone-100 text-stone-400 opacity-50";
                  } else {
                    buttonClass += isSelected 
                      ? "border-emerald-600 bg-emerald-50 text-emerald-700" 
                      : "border-stone-100 hover:border-stone-300 text-stone-600 hover:bg-stone-50";
                  }

                  return (
                    <button
                      key={option.id}
                      onClick={() => handleSelectOption(option.id)}
                      disabled={isSubmitted}
                      className={buttonClass}
                    >
                      <span className="text-lg font-medium">{option.text}</span>
                      {isSubmitted && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                      {isSubmitted && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-rose-500" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Action Bar */}
            <div className="bg-stone-50 px-6 py-4 flex items-center justify-between border-t border-stone-200">
              <div className="flex gap-2">
                <button 
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                  className="p-2 rounded-xl border border-stone-200 bg-white text-stone-600 disabled:opacity-30 hover:bg-stone-50 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button 
                  onClick={handleNext}
                  disabled={currentIndex === filteredQuestions.length - 1}
                  className="p-2 rounded-xl border border-stone-200 bg-white text-stone-600 disabled:opacity-30 hover:bg-stone-50 transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {!submitted[currentQuestion.id] ? (
                <button
                  onClick={handleSubmit}
                  disabled={!userAnswers[currentQuestion.id]}
                  className="px-8 py-2.5 bg-emerald-600 text-white font-semibold rounded-xl disabled:opacity-50 hover:bg-emerald-700 transition-all shadow-sm shadow-emerald-200"
                >
                  提交答案
                </button>
              ) : (
                <button
                  onClick={() => setShowExplanation(!showExplanation)}
                  className="flex items-center gap-2 px-6 py-2.5 bg-white border border-stone-200 text-stone-700 font-semibold rounded-xl hover:bg-stone-100 transition-all"
                >
                  <BookOpen className="w-4 h-4" />
                  {showExplanation ? "隐藏详解" : "查看详解"}
                </button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Explanation Card */}
        <AnimatePresence>
          {showExplanation && submitted[currentQuestion.id] && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 overflow-hidden"
            >
              <div className="bg-emerald-50 rounded-3xl p-6 sm:p-8 border border-emerald-100">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-emerald-100 rounded-lg shrink-0">
                    <Info className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-bold text-emerald-800 uppercase tracking-widest mb-2">正确答案</h3>
                      <p className="text-xl font-serif text-emerald-900">{currentQuestion.explanation.correctAnswer}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-emerald-800 uppercase tracking-widest mb-2">语法规则</h3>
                      <p className="text-stone-700 leading-relaxed">{currentQuestion.explanation.rule}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-emerald-800 uppercase tracking-widest mb-2">经典例句</h3>
                      <p className="text-stone-700 italic border-l-4 border-emerald-200 pl-4 py-1">
                        "{currentQuestion.explanation.example}"
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-rose-800 uppercase tracking-widest mb-2">常见错误辨析</h3>
                      <p className="text-stone-700">{currentQuestion.explanation.commonMistake}</p>
                    </div>
                    <div className="pt-4">
                      <a 
                        href={`https://www.google.com/search?q=English+grammar+${currentQuestion.category}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-emerald-600 font-medium hover:underline flex items-center gap-1"
                      >
                        复习相关知识点 <ChevronRight className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Final Score Modal */}
        <AnimatePresence>
          {isFinished && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm"
            >
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white rounded-[40px] p-10 max-w-md w-full text-center shadow-2xl"
              >
                <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Trophy className="w-12 h-12 text-amber-500" />
                </div>
                <h2 className="text-3xl font-bold text-stone-800 mb-2">练习完成！</h2>
                <p className="text-stone-500 mb-8 text-lg">{getEncouragement(score, filteredQuestions.length)}</p>
                
                <div className="bg-stone-50 rounded-3xl p-6 mb-8 flex justify-around items-center">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-emerald-600">{score}</div>
                    <div className="text-xs font-bold text-stone-400 uppercase tracking-widest">正确</div>
                  </div>
                  <div className="w-px h-10 bg-stone-200" />
                  <div className="text-center">
                    <div className="text-4xl font-bold text-stone-800">{filteredQuestions.length}</div>
                    <div className="text-xs font-bold text-stone-400 uppercase tracking-widest">总计</div>
                  </div>
                  <div className="w-px h-10 bg-stone-200" />
                  <div className="text-center">
                    <div className="text-4xl font-bold text-amber-500">{Math.round((score / filteredQuestions.length) * 100)}%</div>
                    <div className="text-xs font-bold text-stone-400 uppercase tracking-widest">准确率</div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button 
                    onClick={handleReset}
                    className="flex-1 py-4 bg-stone-100 text-stone-700 font-bold rounded-2xl hover:bg-stone-200 transition-all"
                  >
                    重新开始
                  </button>
                  <button 
                    onClick={() => { setFilterDifficulty("All"); setFilterCategory("All"); handleReset(); }}
                    className="flex-1 py-4 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200"
                  >
                    更多题目
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer / Mobile Score */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-stone-200 sm:hidden">
        <div className="px-6 py-4 flex justify-between items-center">
          <span className="text-sm font-bold text-stone-500 tracking-widest uppercase">当前得分</span>
          <span className="text-lg font-bold text-emerald-600">{score} / {filteredQuestions.length}</span>
        </div>
      </footer>
    </div>
  );
}
