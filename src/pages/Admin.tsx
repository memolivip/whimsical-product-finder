
import React, { useState, useEffect } from 'react';
import { Question, Option } from '@/lib/data';
import { ArrowLeft, Plus, Save, Trash } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const Admin: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([]);
  
  useEffect(() => {
    // In a real implementation, this would load questions from your backend
    const loadQuestions = async () => {
      try {
        setIsLoading(true);
        // Simulate API call
        const { questions } = await import('@/lib/data');
        setQuestions(questions);
      } catch (error) {
        console.error('Error loading questions:', error);
        toast.error('Soru verileri yüklenemedi');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadQuestions();
  }, []);
  
  const handleSaveQuestions = async () => {
    try {
      // In a real implementation, this would save to your backend
      toast.success('Değişiklikler kaydedildi');
      
      // For demo, we'll just simulate a save
      console.log('Questions to save:', questions);
    } catch (error) {
      console.error('Error saving questions:', error);
      toast.error('Değişiklikler kaydedilemedi');
    }
  };
  
  const addQuestion = () => {
    const newQuestion: Question = {
      id: `question_${Date.now()}`,
      title: 'Yeni Soru',
      description: 'Soru açıklaması',
      options: [{
        id: `option_${Date.now()}`,
        text: 'Yeni Seçenek'
      }]
    };
    
    setQuestions([...questions, newQuestion]);
  };
  
  const deleteQuestion = (questionIndex: number) => {
    const newQuestions = [...questions];
    newQuestions.splice(questionIndex, 1);
    setQuestions(newQuestions);
  };
  
  const updateQuestion = (index: number, field: keyof Question, value: string) => {
    const newQuestions = [...questions];
    newQuestions[index] = {
      ...newQuestions[index],
      [field]: value
    };
    setQuestions(newQuestions);
  };
  
  const addOption = (questionIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options.push({
      id: `option_${Date.now()}`,
      text: 'Yeni Seçenek'
    });
    setQuestions(newQuestions);
  };
  
  const updateOption = (
    questionIndex: number, 
    optionIndex: number, 
    field: keyof Option, 
    value: string
  ) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options[optionIndex] = {
      ...newQuestions[questionIndex].options[optionIndex],
      [field]: value
    };
    setQuestions(newQuestions);
  };
  
  const deleteOption = (questionIndex: number, optionIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options.splice(optionIndex, 1);
    setQuestions(newQuestions);
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-muted border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <button 
              onClick={() => navigate('/')}
              className="btn-icon bg-white shadow-sm hover:bg-gray-50 mr-4"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <h1 className="text-3xl font-bold">Sihirbaz Yönetimi</h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <button 
              onClick={addQuestion}
              className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Yeni Soru</span>
            </button>
            
            <button 
              onClick={handleSaveQuestions}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>Kaydet</span>
            </button>
          </div>
        </div>
        
        {questions.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-muted-foreground mb-4">Henüz hiç soru eklenmemiş.</p>
            <button 
              onClick={addQuestion}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              İlk Soruyu Ekle
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {questions.map((question, questionIndex) => (
              <div key={question.id} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-6 border-b">
                  <div className="flex justify-between items-start mb-4">
                    <div className="space-y-4 flex-1 mr-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Soru Başlığı
                        </label>
                        <input
                          type="text"
                          value={question.title}
                          onChange={(e) => updateQuestion(questionIndex, 'title', e.target.value)}
                          className="w-full p-2 border rounded-md"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Soru Açıklaması
                        </label>
                        <textarea
                          value={question.description}
                          onChange={(e) => updateQuestion(questionIndex, 'description', e.target.value)}
                          className="w-full p-2 border rounded-md"
                          rows={2}
                        />
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => deleteQuestion(questionIndex)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-full"
                    >
                      <Trash className="h-5 w-5" />
                    </button>
                  </div>
                  
                  <div className="mt-6">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">Seçenekler</h3>
                      <button 
                        onClick={() => addOption(questionIndex)}
                        className="text-sm px-3 py-1 bg-secondary/50 text-secondary-foreground rounded hover:bg-secondary/70 transition-colors flex items-center space-x-1"
                      >
                        <Plus className="h-3 w-3" />
                        <span>Ekle</span>
                      </button>
                    </div>
                    
                    <div className="space-y-3">
                      {question.options.map((option, optionIndex) => (
                        <div key={option.id} className="flex items-center border rounded-md p-3">
                          <div className="flex-1">
                            <input
                              type="text"
                              value={option.text}
                              onChange={(e) => updateOption(questionIndex, optionIndex, 'text', e.target.value)}
                              className="w-full p-2 border rounded-md"
                              placeholder="Seçenek metni"
                            />
                          </div>
                          
                          <div className="ml-3">
                            <input
                              type="text"
                              value={option.imageUrl || ''}
                              onChange={(e) => updateOption(questionIndex, optionIndex, 'imageUrl', e.target.value)}
                              className="w-full p-2 border rounded-md"
                              placeholder="Resim URL'si (isteğe bağlı)"
                            />
                          </div>
                          
                          <button 
                            onClick={() => deleteOption(questionIndex, optionIndex)}
                            className="ml-2 p-2 text-red-500 hover:bg-red-50 rounded-full"
                            disabled={question.options.length <= 1}
                          >
                            <Trash className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
