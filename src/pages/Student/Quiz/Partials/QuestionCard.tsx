interface QuestionCardProps {
  id: string;
  index: number;
  text: string;
  type: string;
  options: Array<{ label: string; value: string }>;
  selectedAnswer: string;
  onAnswer: (id: string, val: string) => void;
}

export const QuestionCard = ({
  id,
  index,
  text,
  options,
  selectedAnswer,
  onAnswer,
}: QuestionCardProps) => {
  const safeOptions =
    Array.isArray(options) && options.length > 0
      ? options
      : [
          { label: "Ya", value: "Ya" },
          { label: "Tidak", value: "Tidak" },
        ];

  return (
    <div
      className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-sm scroll-mt-24 transition-colors"
      id={`question-${id}`}
    >
      <div className="flex items-start gap-4">
        <span className="flex items-center justify-center w-7 h-7 rounded-md bg-slate-100 text-slate-700 font-bold text-xs shrink-0 border border-slate-200">
          {index + 1}
        </span>
        <div className="flex-1">
          <h3 className="text-sm sm:text-base font-semibold text-slate-900 mb-4 leading-relaxed">
            {text}
          </h3>

          <div className="flex flex-wrap gap-2.5">
            {safeOptions.map((option) => {
              const isSelected = selectedAnswer === option.value;
              return (
                <label
                  key={option.value}
                  className={`
                    cursor-pointer inline-flex items-center justify-center px-4 py-2.5 rounded-lg border text-xs sm:text-sm font-medium transition-colors select-none flex-1 sm:flex-none min-w-[90px] text-center
                    ${
                      isSelected
                        ? "bg-emerald-700 border-emerald-700 text-white"
                        : "bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                    }
                  `}
                >
                  <input
                    type="radio"
                    name={id}
                    value={option.value}
                    checked={isSelected}
                    onChange={(e) => onAnswer(id, e.target.value)}
                    className="sr-only"
                  />
                  <span>{option.label}</span>
                </label>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
