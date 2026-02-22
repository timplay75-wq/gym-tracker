import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface Set {
  id: string;
  reps: number;
  weight: number;
}

export const SetupExercise = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const exerciseName = location.state?.exerciseName as string || '';
  const categoryId = location.state?.categoryId as string || '';
  const categoryName = location.state?.categoryName as string || '';
  
  const [name, setName] = useState(exerciseName);
  const [sets, setSets] = useState<Set[]>([
    { id: '1', reps: 10, weight: 0 }
  ]);

  const addSet = () => {
    const lastSet = sets[sets.length - 1];
    setSets([...sets, {
      id: Date.now().toString(),
      reps: lastSet?.reps || 10,
      weight: lastSet?.weight || 0
    }]);
  };

  const removeSet = (id: string) => {
    if (sets.length > 1) {
      setSets(sets.filter(s => s.id !== id));
    }
  };

  const updateSet = (id: string, field: 'reps' | 'weight', value: number) => {
    setSets(sets.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const handleSave = () => {
    // TODO: Сохранить упражнение в тренировку
    const exercise = {
      name,
      categoryId,
      categoryName,
      sets: sets.map(s => ({ reps: s.reps, weight: s.weight }))
    };
    console.log('Сохранение упражнения:', exercise);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-white pb-24">
      <div className="max-w-[480px] mx-auto px-5">
        {/* Заголовок */}
        <header className="pt-8 pb-4 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="text-[#9333ea]">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-2xl font-bold text-black">{categoryName}</h1>
          <div className="w-6" />
        </header>

        {/* Название упражнения */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Название упражнения
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#9333ea] focus:outline-none text-base"
            placeholder="Введите название"
          />
        </div>

        {/* Подходы */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-black">Подходы</h2>
            <button
              onClick={addSet}
              className="text-[#9333ea] font-semibold flex items-center gap-1"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Добавить подход
            </button>
          </div>

          <div className="space-y-3">
            {sets.map((set, index) => (
              <div key={set.id} className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold text-black">Подход {index + 1}</span>
                  {sets.length > 1 && (
                    <button
                      onClick={() => removeSet(set.id)}
                      className="text-red-600 text-sm"
                    >
                      Удалить
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Повторения */}
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">
                      Повторения
                    </label>
                    <input
                      type="number"
                      value={set.reps}
                      onChange={(e) => updateSet(set.id, 'reps', parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-[#9333ea] focus:outline-none text-center text-lg font-semibold"
                      min="0"
                    />
                  </div>

                  {/* Вес */}
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">
                      Вес (кг)
                    </label>
                    <input
                      type="number"
                      value={set.weight}
                      onChange={(e) => updateSet(set.id, 'weight', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-[#9333ea] focus:outline-none text-center text-lg font-semibold"
                      min="0"
                      step="0.5"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Кнопка сохранения */}
        <button
          onClick={handleSave}
          className="w-full py-4 bg-[#9333ea] text-white rounded-xl font-semibold text-lg hover:bg-[#7c3aed] transition-colors"
        >
          Добавить в тренировку
        </button>
      </div>
    </div>
  );
};
