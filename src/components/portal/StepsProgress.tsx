
import { Progress } from "@/components/ui/progress";
import { StepCard } from "./StepCard";

interface Step {
  id: number;
  title: string;
  icon: string;
  unlocked: boolean;
}

interface StepsProgressProps {
  steps: Step[];
  currentStep: number;
  isInternalAccess: boolean;
  onStepClick: (stepId: number) => void;
}

export const StepsProgress = ({ 
  steps, 
  currentStep, 
  isInternalAccess, 
  onStepClick 
}: StepsProgressProps) => {
  const isStepUnlocked = (stepId: number) => {
    return isInternalAccess || stepId <= currentStep;
  };

  const handleStepClick = (stepId: number) => {
    if (isInternalAccess || stepId <= currentStep) {
      onStepClick(stepId);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {steps.map((step) => {
          const isUnlocked = isStepUnlocked(step.id);
          const isClickable = step.id === 1 && isUnlocked;
          
          return (
            <StepCard
              key={step.id}
              step={step}
              isUnlocked={isUnlocked}
              isClickable={isClickable}
              onClick={() => handleStepClick(step.id)}
            />
          );
        })}
      </div>

      {/* Progress Indicator */}
      <div className="mt-12 max-w-2xl mx-auto">
        <div className="text-center mb-4">
          <span className="text-sm text-slate-600">
            Progresso: {isInternalAccess ? '100' : Math.round((currentStep / (steps.length - 1)) * 100)}%
          </span>
        </div>
        <Progress 
          value={isInternalAccess ? 100 : (currentStep / (steps.length - 1)) * 100} 
          className="h-2"
        />
      </div>
    </div>
  );
};
