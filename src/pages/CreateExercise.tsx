import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface Category {
  id: string;
  name: string;
  count: number;
  exercises: string[];
}

const allCategories: Category[] = [
  { id: 'stretching', name: 'Растяжка', count: 3, exercises: [] },
  { id: 'cardio', name: 'Кардио', count: 4, exercises: [] },
  { id: 'chest', name: 'Грудь', count: 4, exercises: [] },
  { id: 'back', name: 'Спина', count: 3, exercises: [] },
  { id: 'arms', name: 'Руки', count: 4, exercises: [] },
  { id: 'legs', name: 'Ноги', count: 4, exercises: [] },
  { id: 'shoulders', name: 'Плечи', count: 3, exercises: [] },
  { id: 'abs', name: 'Пресс', count: 3, exercises: [] },
];

export const CreateExercise = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const preselectedCategory = location.state?.preselectedCategory as Category | undefined;
  const prefilledName = location.state?.prefilledName as string | undefined;
  
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(preselectedCategory || null);
  const [exerciseName, setExerciseName] = useState(prefilledName || '');

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
  };

  const handleSave = () => {
    if (exerciseName.trim() && selectedCategory) {
      // TODO: Сохранить упражнение
      console.log('Создание упражнения:', exerciseName, 'в категории:', selectedCategory.name);
      navigate(-1);
    }
  };

  // Если категория не выбрана - показываем выбор категории
  if (!selectedCategory) {
    return (
      <div className="min-h-screen bg-white pb-24">
        <div className="max-w-[480px] mx-auto px-5">
          {/* Статус бар */}
          <div className="pt-3 pb-2 flex items-center justify-between text-sm text-gray-500">
            <span className="font-light">23:40</span>
            <div className="flex items-center gap-1">
              <span className="text-xs">LTE 21</span>
            </div>
          </div>

          {/* Заголовок */}
          <header className="pt-4 pb-2">
            <h1 className="text-3xl font-bold text-black text-center">Новое упражнение</h1>
            <p className="text-center text-gray-500 mt-2">Выбери категорию</p>
          </header>

          {/* Список категорий */}
          <div className="mt-6 divide-y divide-gray-200">
            {allCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategorySelect(category)}
                className="w-full py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-black">{category.name}</span>
                <div className="flex items-center gap-3">
                  <span className="text-gray-500 text-sm">{category.count}</span>
                  <svg className="w-5 h-5 text-[#9333ea]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            ))}
          </div>

          {/* Виртуальная клавиатура */}
          <div className="fixed bottom-0 left-0 right-0 bg-gray-200 p-2">
            <div className="max-w-[480px] mx-auto">
              {/* Верхний ряд */}
              <div className="grid grid-cols-10 gap-1 mb-1">
                {['й', 'ц', 'у', 'к', 'е', 'н', 'г', 'ш', 'щ', 'з'].map((key) => (
                  <button key={key} className="bg-white rounded py-3 text-sm font-medium">
                    {key.toUpperCase()}
                  </button>
                ))}
              </div>
              {/* Средний ряд */}
              <div className="grid grid-cols-9 gap-1 mb-1 px-2">
                {['ф', 'ы', 'в', 'а', 'п', 'р', 'о', 'л', 'д'].map((key) => (
                  <button key={key} className="bg-white rounded py-3 text-sm font-medium">
                    {key.toUpperCase()}
                  </button>
                ))}
              </div>
              {/* Нижний ряд */}
              <div className="grid grid-cols-9 gap-1 mb-1">
                <button className="bg-white rounded py-3 text-xs">123</button>
                {['я', 'ч', 'с', 'м', 'и', 'т', 'ь'].map((key) => (
                  <button key={key} className="bg-white rounded py-3 text-sm font-medium">
                    {key.toUpperCase()}
                  </button>
                ))}
                <button className="bg-white rounded py-3">⌫</button>
              </div>
              {/* Пробел и Готово */}
              <div className="grid grid-cols-3 gap-1">
                <button className="bg-white rounded py-3 text-sm">123</button>
                <button className="bg-white rounded py-3 text-sm">Пробел</button>
                <button className="bg-[#9333ea] text-white rounded py-3 text-sm font-semibold">
                  Готово
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Если категория выбрана - показываем ввод названия
  return (
    <div className="min-h-screen bg-white pb-64">
      <div className="max-w-[480px] mx-auto px-5">
        {/* Статус бар */}
        <div className="pt-3 pb-2 flex items-center justify-between text-sm text-gray-500">
          <span className="font-light">23:39</span>
          <div className="flex items-center gap-1">
            <span className="text-xs">LTE</span>
          </div>
        </div>

        {/* Заголовок */}
        <header className="pt-4 pb-2">
          <h1 className="text-3xl font-bold text-black text-center">{selectedCategory.name}</h1>
        </header>

        {/* Поле ввода */}
        <div className="mt-12 text-center">
          <h2 className="text-xl text-gray-900 mb-4">Название упражнения</h2>
          <div className="relative">
            <input
              type="text"
              value={exerciseName}
              onChange={(e) => setExerciseName(e.target.value)}
              className="w-full text-center text-lg border-b-2 border-gray-300 focus:border-[#9333ea] outline-none py-2"
              placeholder=""
              autoFocus
            />
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-[#9333ea] animate-pulse" />
          </div>
        </div>
      </div>

      {/* Виртуальная клавиатура */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-200 p-2">
        <div className="max-w-[480px] mx-auto">
          {/* Верхний ряд */}
          <div className="grid grid-cols-10 gap-1 mb-1">
            {['й', 'ц', 'у', 'к', 'е', 'н', 'г', 'ш', 'щ', 'з'].map((key) => (
              <button key={key} className="bg-white rounded py-3 text-sm font-medium">
                {key.toUpperCase()}
              </button>
            ))}
          </div>
          {/* Средний ряд */}
          <div className="grid grid-cols-9 gap-1 mb-1 px-2">
            {['ф', 'ы', 'в', 'а', 'п', 'р', 'о', 'л', 'д'].map((key) => (
              <button key={key} className="bg-white rounded py-3 text-sm font-medium">
                {key.toUpperCase()}
              </button>
            ))}
          </div>
          {/* Нижний ряд */}
          <div className="grid grid-cols-9 gap-1 mb-1">
            <button className="bg-white rounded py-3 text-xs">123</button>
            {['я', 'ч', 'с', 'м', 'и', 'т', 'ь'].map((key) => (
              <button key={key} className="bg-white rounded py-3 text-sm font-medium">
                {key.toUpperCase()}
              </button>
            ))}
            <button className="bg-white rounded py-3">⌫</button>
          </div>
          {/* Пробел и Ввод */}
          <div className="grid grid-cols-3 gap-1">
            <button className="bg-white rounded py-3 text-sm">123</button>
            <button className="bg-white rounded py-3 text-sm">Пробел</button>
            <button 
              onClick={handleSave}
              className="bg-[#9333ea] text-white rounded py-3 text-sm font-semibold"
            >
              Ввод
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
