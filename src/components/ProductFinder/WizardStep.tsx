
import React from 'react';
import { Question, Option } from '@/lib/data';
import OptionCard from './OptionCard';
import { motion } from 'framer-motion';

interface WizardStepProps {
  question: Question;
  selectedOption: string | null;
  onSelectOption: (optionId: string) => void;
}

const WizardStep: React.FC<WizardStepProps> = ({
  question,
  selectedOption,
  onSelectOption,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="py-8 px-4 md:px-8"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-3">{question.title}</h2>
        <p className="text-muted-foreground max-w-xl mx-auto">{question.description}</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {question.options.map((option) => (
          <OptionCard
            key={option.id}
            id={option.id}
            text={option.text}
            imageUrl={option.imageUrl}
            isSelected={selectedOption === option.id}
            onClick={() => onSelectOption(option.id)}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default WizardStep;
