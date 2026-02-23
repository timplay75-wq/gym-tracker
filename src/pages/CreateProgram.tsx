import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const CreateProgram = () => {
  const navigate = useNavigate();
  
  const [programName, setProgramName] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState(4); // недели
  
  const daysOfWeek = [
    { id: 'monday', label: 'Понедельник' },
    { id: 'tuesday', label: 'Вторник' },
    { id: 'wednesday', label: 'Среда' },
    { id: 'thursday', label: 'Четверг' },
    { id: 'friday', label: 'Пятница' },
    { id: 'saturday', label: 'Суббота' },
    { id: 'sunday', label: 'Воскресенье' },
  ];

  const [schedule, setSchedule] = useState<Record<string, string>>({
    monday: '',
    tuesday: '',
    wednesday: '',
    thursday: '',
    friday: '',
    saturday: '',
    sunday: '',
  });

  const updateSchedule = (day: string, workoutName: string) => {
    setSchedule({ ...schedule, [day]: workoutName });
  };

  const handleSave = () => {
    if (!programName.trim()) {
      alert('Введите название программы');
      return;
    }

    const program = {
      id: Date.now().toString(),
      name: programName,
      description,
      duration,
      schedule,
      createdAt: new Date(),
      isActive: false
    };

    console.log('Сохранение программы:', program);
    // TODO: Сохранить в localStorage или backend
    navigate('/exercises');
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
          <h1 className="text-2xl font-bold text-black">Новая программа</h1>
          <div className="w-6" />
        </header>

        {/* Название программы */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Название программы *
          </label>
          <input
            type="text"
            value={programName}
            onChange={(e) => setProgramName(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#9333ea] focus:outline-none text-base"
            placeholder="Например: Push/Pull/Legs"
          />
        </div>

        {/* Описание */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Описание (необязательно)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#9333ea] focus:outline-none text-base resize-none"
            placeholder="Описание программы..."
            rows={3}
          />
        </div>

        {/* Длительность программы */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Длительность программы (недель)
          </label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(parseInt(e.target.value) || 0)}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#9333ea] focus:outline-none text-base"
            min="1"
            max="52"
          />
        </div>

        {/* Расписание по дням */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-black mb-4">Расписание тренировок</h2>
          <div className="space-y-3">
            {daysOfWeek.map((day) => (
              <div key={day.id} className="bg-gray-50 rounded-xl p-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {day.label}
                </label>
                <input
                  type="text"
                  value={schedule[day.id]}
                  onChange={(e) => updateSchedule(day.id, e.target.value)}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-[#9333ea] focus:outline-none text-sm"
                  placeholder="Название тренировки или Отдых"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Подсказка */}
        <div className="mb-6 p-4 bg-blue-50 rounded-xl">
          <p className="text-sm text-gray-700">
            💡 <strong>Совет:</strong> Оставьте поле пустым для дней отдыха. Можно указать например: 
            "Грудь + Трицепс", "Спина + Бицепс", "Ноги", "Плечи", "Отдых"
          </p>
        </div>

        {/* Кнопки действий */}
        <div className="flex gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex-1 py-4 border-2 border-[#9333ea] text-[#9333ea] rounded-xl font-semibold text-lg hover:bg-[#f3e8ff] transition-colors"
          >
            Отмена
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-4 bg-[#9333ea] text-white rounded-xl font-semibold text-lg hover:bg-[#7c3aed] transition-colors"
          >
            Создать
          </button>
        </div>
      </div>
    </div>
  );
};
