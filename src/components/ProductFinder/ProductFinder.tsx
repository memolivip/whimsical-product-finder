
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { questions } from '@/lib/data';
import WizardStep from './WizardStep';
import ProgressIndicator from './ProgressIndicator';
import { ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'sonner';

const ProductFinder: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
  
  const currentQuestion = questions[currentStep];
  const isLastStep = currentStep === questions.length - 1;
  const selectedOption = selections[currentQuestion.id] || null;
  
  const handleSelectOption = (optionId: string) => {
    setSelections((prev) => ({
      ...prev,
      [currentQuestion.id]: optionId,
    }));
    
    if (isLastStep) {
      setTimeout(() => {
        navigate('/results', { state: { selections } });
      }, 500);
    } else {
      setTimeout(() => {
        handleNext();
      }, 500);
    }
  };
  
  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setDirection('forward');
      setCurrentStep((prev) => prev + 1);
    }
  };
  
  const handlePrevious = () => {
    if (currentStep > 0) {
      setDirection('backward');
      setCurrentStep((prev) => prev - 1);
    }
  };
  
  const handleReset = () => {
    setSelections({});
    setCurrentStep(0);
    toast.success('Sihirbaz yeniden başlatıldı.');
  };
  
  const containerVariants = {
    enter: (direction: string) => ({
      x: direction === 'forward' ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: string) => ({
      x: direction === 'forward' ? -100 : 100,
      opacity: 0,
    }),
  };
  
  return (
    <div className="wizard-container">
      <ProgressIndicator steps={questions.length} currentStep={currentStep} />
      
      <div className="relative overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentStep}
            custom={direction}
            variants={containerVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <WizardStep
              question={currentQuestion}
              selectedOption={selectedOption}
              onSelectOption={handleSelectOption}
            />
          </motion.div>
        </AnimatePresence>
      </div>
      
      <div className="flex items-center justify-between p-4 border-t bg-background/50 backdrop-blur-sm">
        <div>
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className={`btn-icon ${
              currentStep === 0
                ? 'bg-muted text-muted-foreground cursor-not-allowed'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          
          <button
            onClick={handleReset}
            className="btn-icon bg-secondary text-secondary-foreground hover:bg-secondary/80 ml-2"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
        
        <div className="text-sm text-muted-foreground">
          {currentStep + 1} / {questions.length}
        </div>
        
        <button
          onClick={handleNext}
          disabled={!selectedOption || isLastStep}
          className={`btn-icon ${
            !selectedOption || isLastStep
              ? 'bg-muted text-muted-foreground cursor-not-allowed'
              : 'bg-primary text-primary-foreground hover:bg-primary/90'
          }`}
        >
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default ProductFinder;
