import api from './api';

const lmsService = {
  getChapters: async () => {
    try {
      const response = await api.get('/lms/chapters');
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getUnit: async (unitId) => {
    try {
      const response = await api.get(`/lms/units/${unitId}`);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getQuiz: async (chapterId) => {
    try {
      const response = await api.get(`/lms/chapters/${chapterId}/take-quiz`);
      return response.data; // Note this returns {success, chapter, questions} object
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  submitQuiz: async (chapterId, answersPayload) => {
    try {
      const response = await api.post(`/lms/chapters/${chapterId}/submit-quiz`, { answers: answersPayload });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Admin Functions
  saveChapter: async (chapterData) => {
    try {
      const response = await api.post('/lms/chapters', chapterData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateChapter: async (id, chapterData) => {
    try {
      const response = await api.put(`/lms/chapters/${id}`, chapterData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  deleteChapter: async (id) => {
    try {
      const response = await api.delete(`/lms/chapters/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  saveUnit: async (chapterId, unitData) => {
    try {
      const response = await api.post('/lms/units', { ...unitData, chapter_id: chapterId });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  saveUnitContent: async (unitId, blocks) => {
    try {
      const response = await api.post(`/lms/units/${unitId}/content`, { blocks });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getAdminQuizzes: async (chapterId) => {
    try {
      const response = await api.get(`/lms/quizzes/chapter/${chapterId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  saveQuizQuestion: async (questionData) => {
    try {
      const response = await api.post('/lms/quizzes', questionData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateQuizQuestion: async (quizId, questionData) => {
    try {
      const response = await api.put(`/lms/quizzes/${quizId}`, questionData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  deleteQuizQuestion: async (quizId) => {
    try {
      const response = await api.delete(`/lms/quizzes/${quizId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default lmsService;
