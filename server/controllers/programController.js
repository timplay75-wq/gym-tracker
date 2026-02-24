import Program from '../models/Program.js';

// GET /api/programs
export const getAllPrograms = async (req, res) => {
  try {
    const programs = await Program.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(programs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/programs/:id
export const getProgramById = async (req, res) => {
  try {
    const program = await Program.findOne({ _id: req.params.id, userId: req.user._id });
    if (!program) return res.status(404).json({ message: 'рограмма не найдена' });
    res.json(program);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/programs
export const createProgram = async (req, res) => {
  try {
    const program = await Program.create({ ...req.body, userId: req.user._id, isActive: false });
    res.status(201).json(program);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// PUT /api/programs/:id
export const updateProgram = async (req, res) => {
  try {
    const program = await Program.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!program) return res.status(404).json({ message: 'рограмма не найдена' });
    res.json(program);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE /api/programs/:id
export const deleteProgram = async (req, res) => {
  try {
    const program = await Program.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!program) return res.status(404).json({ message: 'рограмма не найдена' });
    res.json({ message: 'рограмма удалена' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/programs/:id/activate
export const activateProgram = async (req, res) => {
  try {
    await Program.updateMany({ userId: req.user._id }, { isActive: false });
    const program = await Program.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { isActive: true },
      { new: true }
    );
    if (!program) return res.status(404).json({ message: 'рограмма не найдена' });
    res.json({ message: `рограмма "${program.name}" активирована`, program });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
