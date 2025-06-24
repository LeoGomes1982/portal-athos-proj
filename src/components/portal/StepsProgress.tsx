
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
  const getStepProgress = (stepIndex: number) => {
    if (isInternalAccess) return 100;
    if (stepIndex < currentStep) return 100;
    if (stepIndex === currentStep) return 50;
    return 0;
  };

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
      <div className="relative">
        {/* Connection Lines - Behind Cards */}
        <div className="absolute top-16 left-0 w-full h-1 z-0 hidden lg:block">
          {/* Background gray line */}
          <div className="w-full h-full bg-gray-300 rounded-full" />
          
          {/* Progress lines */}
          <div className="absolute top-0 left-0 h-full flex">
            {steps.slice(0, -1).map((_, index) => {
              const segmentWidth = 100 / (steps.length - 1);
              const progressPercent = getStepProgress(index + 1);
              
              return (
                <div 
                  key={index} 
                  className="h-full relative"
                  style={{ width: `${segmentWidth}%` }}
                >
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 transition-all duration-500 rounded-full"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Cards */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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
