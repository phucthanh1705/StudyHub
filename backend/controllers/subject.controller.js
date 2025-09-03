const Subject = require('../models/subject.model');

// Tạo mới môn học
exports.create = async (req, res) => {
  try {
    const subject = await Subject.createSubject(req.body);
    res.json(subject);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Lấy tất cả môn học
exports.findAll = async (req, res) => {
  try {
    const subjects = await Subject.getAllSubjects();
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Lấy môn học theo ID
exports.findById = async (req, res) => {
  try {
    const subject = await Subject.getSubjectById(req.params.id);
    if (subject) res.json(subject);
    else res.status(404).json({ error: 'Không tìm thấy môn học' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Cập nhật môn học
exports.update = async (req, res) => {
  try {
    const updated = await Subject.updateSubject(req.params.id, req.body);
    if (updated) {
      res.json({ message: "Cập nhật thành công", subject: updated });
    } else {
      res.status(404).json({ message: "Không tìm thấy môn học" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Xóa môn học
exports.delete = async (req, res) => {
  try {
    const result = await Subject.deleteSubject(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
