export const Profile = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Профиль</h2>
      
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Статистика</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-100 p-4 rounded">
              <p className="text-gray-600 text-sm">Всего тренировок</p>
              <p className="text-2xl font-bold">0</p>
            </div>
            <div className="bg-gray-100 p-4 rounded">
              <p className="text-gray-600 text-sm">Упражнений</p>
              <p className="text-2xl font-bold">0</p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Настройки</h3>
          <button className="text-red-500 hover:text-red-700">
            Очистить все данные
          </button>
        </div>
      </div>
    </div>
  );
};
