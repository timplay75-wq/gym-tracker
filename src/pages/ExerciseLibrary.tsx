import { useState } from 'react';
import { Card, Button, Modal, Input } from '@/components';
import exercisesData from '@/data/exercises.json';

interface Exercise {
  id: string;
  name: string;
  equipment?: string;
  targetMuscles?: string[];
}

interface Category {
  id: string;
  name: string;
  icon: string;
  exercises: Exercise[];
}

export const ExerciseLibrary = () => {
  const [categories] = useState<Category[]>(exercisesData.categories);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newExerciseName, setNewExerciseName] = useState('');

  const handleCategoryClick = (category: Category) => {
    setSelectedCategory(category);
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
  };

  const handleCreateExercise = () => {
    if (!newExerciseName.trim()) return;
    
    // TODO: Добавить упражнение в выбранную категорию
    console.log('Создание упражнения:', newExerciseName, 'в категории:', selectedCategory?.name);
    
    setNewExerciseName('');
    setShowCreateModal(false);
  };

  // Если выбрана категория - показываем её упражнения
  if (selectedCategory) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 pb-24">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <header className="pt-6 pb-4">
            <button
              onClick={handleBackToCategories}
              className="flex items-center text-primary-500 dark:text-primary-400 hover:text-primary-600 dark:hover:text-primary-300 mb-4 transition-colors"
            >
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Назад к категориям
            </button>

            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl sm:text-5xl font-bold text-light-primary dark:text-white flex items-center gap-3">
                  <span>{selectedCategory.icon}</span>
                  {selectedCategory.name}
                </h1>
                <p className="text-sm text-light-secondary dark:text-gray-400 mt-2">
                  {selectedCategory.exercises.length} упражнений
                </p>
              </div>
              
              <Button
                variant="primary"
                size="sm"
                onClick={() => setShowCreateModal(true)}
              >
                + Создать
              </Button>
            </div>
          </header>

          {/* Список упражнений */}
          <div className="mt-6 space-y-3">
            {selectedCategory.exercises.map((exercise) => (
              <Card key={exercise.id} padding="md" variant="interactive">
                <div>
                  <h3 className="text-lg font-semibold text-light-primary dark:text-white">
                    {exercise.name}
                  </h3>
                  {exercise.equipment && (
                    <p className="text-sm text-light-secondary dark:text-gray-400 mt-1">
                      {exercise.equipment}
                    </p>
                  )}
                  {exercise.targetMuscles && exercise.targetMuscles.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {exercise.targetMuscles.map((muscle, idx) => (
                        <span
                          key={idx}
                          className="text-xs px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-lg"
                        >
                          {muscle}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Modal создания упражнения */}
        <Modal
          isOpen={showCreateModal}
          onClose={() => {
            setShowCreateModal(false);
            setNewExerciseName('');
          }}
          title="Новое упражнение"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-light-primary dark:text-gray-300 mb-2">
                Название упражнения
              </label>
              <Input
                value={newExerciseName}
                onChange={(e) => setNewExerciseName(e.target.value)}
                placeholder="Например: Жим гантелей сидя"
                autoFocus
              />
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-3">
              <p className="text-sm text-light-secondary dark:text-gray-400">
                Категория: <span className="font-semibold text-light-primary dark:text-gray-200">{selectedCategory.name}</span>
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowCreateModal(false);
                  setNewExerciseName('');
                }}
                className="flex-1"
              >
                Отмена
              </Button>
              <Button
                variant="primary"
                onClick={handleCreateExercise}
                disabled={!newExerciseName.trim()}
                className="flex-1"
              >
                Создать
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    );
  }

  // Показываем список категорий
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pb-24">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="pt-6 pb-4">
          <h1 className="text-4xl sm:text-5xl font-bold text-light-primary dark:text-white">
            Библиотека упражнений
          </h1>
          <p className="text-sm text-light-secondary dark:text-gray-400 mt-2">
            Выберите категорию
          </p>
        </header>

        {/* Категории */}
        <div className="mt-6 space-y-3">
          {categories.map((category) => (
            <Card
              key={category.id}
              padding="md"
              variant="interactive"
              onClick={() => handleCategoryClick(category)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{category.icon}</span>
                  <div>
                    <h3 className="text-lg font-semibold text-light-primary dark:text-white">
                      {category.name}
                    </h3>
                    <p className="text-sm text-light-secondary dark:text-gray-400">
                      {category.exercises.length} упражнений
                    </p>
                  </div>
                </div>
                <svg
                  className="w-5 h-5 text-light-secondary dark:text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
