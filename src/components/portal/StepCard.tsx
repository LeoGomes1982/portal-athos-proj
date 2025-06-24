
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StepCardProps {
  step: {
    id: number;
    title: string;
    icon: string;
    unlocked: boolean;
  };
  isUnlocked: boolean;
  isClickable: boolean;
  onClick: () => void;
}

export const StepCard = ({ step, isUnlocked, isClickable, onClick }: StepCardProps) => {
  return (
    <Card 
      className={`modern-card text-center p-6 transition-all duration-300 ${
        isClickable ? 'cursor-pointer hover:scale-105' : ''
      } ${
        isUnlocked 
          ? 'opacity-100 bg-white border-emerald-200' 
          : 'opacity-50 grayscale bg-gray-50 border-gray-200'
      }`}
      onClick={onClick}
    >
      <CardHeader className="card-header pb-4">
        <div className={`mx-auto w-16 h-16 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 ${
          isUnlocked 
            ? 'bg-emerald-100 text-emerald-600' 
            : 'bg-gray-100 text-gray-400'
        }`}>
          <span className="text-3xl">{step.icon}</span>
        </div>
        <CardTitle className={`subsection-title transition-colors duration-300 ${
          isUnlocked ? 'text-slate-800' : 'text-gray-400'
        }`}>
          {step.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="card-content pt-0">
        {isUnlocked && (
          <div className="w-2 h-2 bg-emerald-500 rounded-full mx-auto animate-pulse" />
        )}
      </CardContent>
    </Card>
  );
};
