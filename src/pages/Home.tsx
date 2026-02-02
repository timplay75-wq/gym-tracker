export const Home = () => {
  return (
    <div className="space-y-6">
      <section className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">Добро пожаловать!</h2>
        <p className="text-gray-600">
          Отслеживайте свои тренировки и прогресс в зале
        </p>
      </section>

      <section className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold mb-3">Быстрый старт</h3>
        <ul className="space-y-2 text-gray-600">
          <li>📝 Создайте свою первую тренировку</li>
          <li>💪 Добавьте упражнения и подходы</li>
          <li>📊 Следите за прогрессом</li>
          <li>🎯 Достигайте своих целей!</li>
        </ul>
      </section>
    </div>
  );
};
