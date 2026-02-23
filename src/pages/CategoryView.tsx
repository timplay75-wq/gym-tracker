import { useLocation, useParams, useNavigate } from 'react-router-dom';

interface Category {
  id: string;
  name: string;
  count: number;
  exercises: string[];
}

export const CategoryView = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const category = location.state?.category as Category;

  // На случай прямого захода по URL
  const defaultCategories: Record<string, Category> = {
    stretching: { 
      id: 'stretching', 
      name: 'Растяжка', 
      count: 3,
      exercises: [
        'Растяжка грудных мышц',
        'Растяжка задней поверхности бедра',
        'Растяжка разгибателей спины'
      ]
    },
    cardio: { 
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
    chest: { 
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
    back: { 
      id: 'back', 
      name: 'Спина', 
      count: 3,
      exercises: [
        'Подтягивания широким хватом',
        'Становая тяга',
        'Тяга нижнего блока'
      ]
    },
    arms: { 
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
    legs: { 
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
    shoulders: { 
      id: 'shoulders', 
      name: 'Плечи', 
      count: 3,
      exercises: [
        'Армейский жим стоя',
        'Жим гантелей сидя',
        'Разведение гантелей в стороны'
      ]
    },
    abs: { 
      id: 'abs', 
      name: 'Пресс', 
      count: 3,
      exercises: [
        'Горизонтальные скручивания',
        'Подъем ног в висе',
        'Скручивания на наклонной скамье'
      ]
    },
  };

  const currentCategory = category || (categoryId ? defaultCategories[categoryId] : null);

  if (!currentCategory) {
    return <div>Категория не найдена</div>;
  }

  return (
    <div className="min-h-screen bg-white pb-24">
      <div className="max-w-[480px] mx-auto px-5">
        {/* Заголовок */}
        <header className="pt-8 pb-4 flex items-center justify-between">
          <h1 className="text-4xl font-bold text-black">{currentCategory.id}</h1>
          <button className="text-[#9333ea] font-semibold">
            Изменить
          </button>
        </header>

        {/* Список упражнений */}
        <div className="divide-y divide-gray-200">
          {currentCategory.exercises.map((exercise, index) => (
            <button
              key={index}
              onClick={() => navigate('/setup-exercise', { 
                state: { 
                  exerciseName: exercise,
                  categoryId: currentCategory.id,
                  categoryName: currentCategory.name
                } 
              })}
              className="w-full py-4 text-left hover:bg-gray-50 transition-colors"
            >
              <span className="font-semibold text-black">{exercise}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
