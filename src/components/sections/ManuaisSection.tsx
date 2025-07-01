
import ManuaisNormasSubsection from "@/components/subsections/ManuaisNormasSubsection";
import NossaDecisaoSubsection from "@/components/subsections/NossaDecisaoSubsection";

const ManuaisSection = () => {
  return (
    <div className="space-y-8 animate-slide-up">
      <ManuaisNormasSubsection />
      <NossaDecisaoSubsection />
    </div>
  );
};

export default ManuaisSection;
