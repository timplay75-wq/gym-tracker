import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Category {
  id: string;
  name: string;
  count: number;
  exercises: string[];
}

const categories: Category[] = [
  { 
    id: 'stretching', 
    name: 'Растяжка', 
    count: 3,
    exercises: [
      'Растяжка грудных мышц',
      'Растяжка задней поверхности бедра',
      'Растяжка разгибателей спины'
    ]
  },
  { 
    id: 'cardio', 
    name: 'Кардио', 
    count: 4,
    exercises: [
      'Беговая дорожка',
      'Велотренажер',
      'Степ тренажер',
      'Эллиптический тренажер'
    ]
  },
  { 
    id: 'chest', 
    name: 'Грудь', 
    count: 4,
    exercises: [
      'Жим гантелей на наклонной скамье',
      'Жим штанги лежа',
      'Отжимания',
      'Сведение рук в тренажере'
    ]
  },
  { 
    id: 'back', 
    name: 'Спина', 
    count: 3,
    exercises: [
      'Подтягивания широким хватом',
      'Становая тяга',
      'Тяга нижнего блока'
    ]
  },
  { 
    id: 'arms', 
    name: 'Руки', 
    count: 4,
    exercises: [
      'Концентрированные подъемы на бицепс',
      'Отжимания на брусьях',
      'Подъем штанги на бицепс',
      'Французский жим лежа со штангой'
    ]
  },
  { 
    id: 'legs', 
    name: 'Ноги', 
    count: 4,
    exercises: [
      'Выпады со штангой',
      'Жим ногами в тренажере',
      'Приседания со штангой',
      'Разгибания ног в тренажере'
    ]
  },
  { 
    id: 'shoulders', 
    name: 'Плечи', 
    count: 3,
    exercises: [
      'Армейский жим стоя',
      'Жим гантелей сидя',
      'Разведение гантелей в стороны'
    ]
  },
  { 
    id: 'abs', 
    name: 'Пресс', 
    count: 3,
    exercises: [
      'Горизонтальные скручивания',
      'Подъем ног в висе',
      'Скручивания на наклонной скамье'
    ]
  },
];

export const ExerciseLibrary = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'exercises' | 'programs'>('exercises');

  const handleCategoryClick = (category: Category) => {
    navigate(`/category/${category.id}`, { state: { category } });
  };

  return (
    <div className="min-h-screen bg-white pb-24">
      <div className="max-w-[480px] mx-auto px-5">
        {/* Заголовок */}
        <header className="pt-8 pb-4">
          <h1 className="text-4xl font-bold text-black text-center">Искать</h1>
        </header>

        {/* Переключатель вкладок */}
        <div className="flex justify-center gap-8 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('exercises')}
            className={`pb-3 px-1 font-semibold transition-colors relative ${
              activeTab === 'exercises' 
                ? 'text-[#9333ea]' 
                : 'text-gray-500'
            }`}
          >
            Упражнения
            {activeTab === 'exercises' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#9333ea]" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('programs')}
            className={`pb-3 px-1 font-semibold transition-colors relative ${
              activeTab === 'programs' 
                ? 'text-[#9333ea]' 
                : 'text-gray-500'
            }`}
          >
            Программы
            {activeTab === 'programs' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#9333ea]" />
            )}
          </button>
        </div>

        {/* Контент вкладки */}
        {activeTab === 'exercises' ? (
          <div>
            {/* Кнопка создания упражнения */}
            <button
              onClick={() => navigate('/create-exercise')}
              className="w-full py-4 text-left text-black font-semibold flex items-center justify-between border-b border-gray-200"
            >
              <span>Создать упражнение</span>
              <svg className="w-5 h-5 text-[#9333ea]" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </button>

            {/* Список категорий */}
            <div className="divide-y divide-gray-200">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category)}
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
          </div>
        ) : (
          // Вкладка "Программы"
          <div className="flex items-center justify-center py-20">
            <button
              onClick={() => navigate('/create-program')}
              className="px-8 py-4 border-2 border-[#9333ea] rounded-xl text-[#9333ea] font-semibold hover:bg-[#9333ea] hover:text-white transition-colors"
            >
              Создать программу
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
