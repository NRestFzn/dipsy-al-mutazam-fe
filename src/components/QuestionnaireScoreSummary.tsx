import { Tag } from "antd";
import type { QuestionnaireScoringResult } from "../types/Questionnaire/questionnaireTypes";
import { getQuestionnaireResultLabel } from "../utils/questionnaireDisplay";

interface QuestionnaireScoreSummaryProps {
    result: QuestionnaireScoringResult;
}

const getResultTagProps = (label?: string | null, isRisk?: boolean) => {
    const normalized = (label || "").trim().toLowerCase();
    if (normalized === "borderline") {
        return {
            color: undefined,
            style: { backgroundColor: "#FFF7ED", color: "#F58220", borderColor: "#FED7AA", fontWeight: 600 },
        };
    }
    return {
        color: isRisk ? "error" : "success",
    };
};

export default function QuestionnaireScoreSummary({ result }: QuestionnaireScoreSummaryProps) {
    const mainTagProps = getResultTagProps(result.resultLabel, result.isRisk);

    return (
        <div className="w-full space-y-4">
            <div className="flex items-end justify-between gap-4 border-b border-gray-200 pb-4">
                <div>
                    <p className="text-sm text-gray-500 font-medium">Skor Akhir</p>
                    <p className="text-4xl font-bold text-gray-800">{result.score}</p>
                </div>
                <Tag {...mainTagProps} className="!m-0 text-xs px-2.5 py-0.5 rounded-full font-semibold">
                    {getQuestionnaireResultLabel(result.resultLabel)}
                </Tag>
            </div>

            {result.categories.length > 0 && (
                <div className="space-y-2">
                    {result.categories.map((category) => {
                        const tagProps = category.outcome
                            ? getResultTagProps(category.outcome.label, category.outcome.isRisk)
                            : undefined;

                        return (
                            <div
                                key={category.key}
                                className="flex items-center justify-between gap-3 border-b border-gray-100 py-2.5 last:border-b-0"
                            >
                                <div className="min-w-0">
                                    <p className="font-medium text-gray-700 truncate text-sm">{category.label}</p>
                                    <p className="text-xs text-gray-400">
                                        {category.includeInTotal ? "Dihitung ke Skor Akhir" : "Tidak Dihitung ke Skor Akhir"}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    <span className="font-semibold text-gray-800 text-sm">{category.score}</span>
                                    {category.outcome && (
                                        <Tag {...tagProps} className="!m-0 text-xs px-2 py-0.5 rounded-md">
                                            {getQuestionnaireResultLabel(category.outcome.label)}
                                        </Tag>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
