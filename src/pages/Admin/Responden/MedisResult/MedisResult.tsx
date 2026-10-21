import { useNavigate, useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { AlertCircle, ArrowLeft, CheckCircle2, FileText, User } from 'lucide-react';
import { Button, Card, Empty, Table, Tag } from 'antd';
import {
  getMedisResultColumns,
  type QuestionResult,
} from '../columns/MedisResultColumn';
import { adminMedisService } from '../../../../service/adminMedisService';
import type { SubmissionDetailResponse } from '../../../../types/adminMedisService';
import QuestionnaireScoreSummary from '../../../../components/QuestionnaireScoreSummary';
import { getQuestionnaireResultLabel } from '../../../../utils/questionnaireDisplay';

export default function MedisResult() {
  const navigate = useNavigate();

  const params = useParams<{ submissionId: string }>();
  const rawId = params?.submissionId || "";
  const submissionId = rawId.includes("=") ? rawId.split("=")[1] : rawId;

  const [loading, setLoading] = useState(true);
  const [detailData, setDetailData] = useState<SubmissionDetailResponse | null>(null);
  const [mappedQuestions, setMappedQuestions] = useState<QuestionResult[]>([]);
  const [userName, setUserName] = useState<string>('-');

  useEffect(() => {
    if (submissionId) {
      fetchData(submissionId);
    }
  }, [submissionId]);

  const fetchData = async (id: string) => {
    setLoading(true);
    try {
      const detailRes = await adminMedisService.getSubmissionDetail(id);
      setDetailData(detailRes);
      setUserName(detailRes?.user?.fullname || '-');

      if (detailRes.questionnaireAnswer && detailRes.questionnaireAnswer.length > 0) {
        const sortedAnswers = [...detailRes.questionnaireAnswer].sort(
          (a, b) => (a.questionnaireQuestion?.order || 0) - (b.questionnaireQuestion?.order || 0)
        );

        const questions: QuestionResult[] = sortedAnswers.map((item) => ({
          no: item.questionnaireQuestion?.order || 0,
          question: item.questionnaireQuestion?.questionText || "-",
          answer: `${item.answerLabel || (item.answerValue === 'true' ? 'Ya' : item.answerValue === 'false' ? 'Tidak' : item.answerValue)}${item.score == null ? '' : ` (${item.score} poin)`}`,
        }));

        setMappedQuestions(questions);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const columns = getMedisResultColumns();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh] flex-col gap-3">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#00A651]"></div>
        <p className="text-gray-500 text-sm">Memuat rincian hasil skrining...</p>
      </div>
    );
  }

  if (!detailData) {
    return (
      <div className="h-[70vh] flex items-center justify-center flex-col gap-4">
        <Empty description="Data Hasil Jawaban Tidak Ditemukan" />
        <Button onClick={() => navigate(-1)}>Kembali</Button>
      </div>
    );
  }

  const isRisk = detailData.isMentalUnstable;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <Button
        type="default"
        onClick={() => navigate(-1)}
        className="flex items-center shadow-sm border-gray-200 hover:bg-gray-100"
      >
        <ArrowLeft size={16} className="mr-2" />
        Kembali
      </Button>

      {/* Header Info */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-gray-500 text-xs font-semibold uppercase tracking-wider">
            <User size={14} className="text-[#00A651]" />
            <span>Hasil Skrining Siswa</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{userName}</h1>
          <p className="text-gray-500 text-sm">
            Tanggal Pengisian: {new Date(detailData.createdAt).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })} WIB
          </p>
        </div>

        <Tag
          color={isRisk ? 'error' : 'success'}
          className="text-sm font-semibold px-4 py-1.5 rounded-full"
        >
          {getQuestionnaireResultLabel(
            detailData.resultLabel || (isRisk ? 'Butuh Perhatian' : 'Kondisi Normal / Stabil')
          )}
        </Tag>
      </div>

      {/* Ringkasan Skor & Evaluasi */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="rounded-xl border-gray-200 shadow-sm md:col-span-1">
          <div className="flex flex-col items-center text-center p-2 space-y-3">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center ${isRisk ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-600'}`}>
              {isRisk ? <AlertCircle size={28} /> : <CheckCircle2 size={28} />}
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase font-semibold">Skor Total</p>
              <p className="text-4xl font-extrabold text-gray-900 mt-1">{detailData.score}</p>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed max-w-xs">
              {isRisk
                ? 'Siswa terindikasi membutuhkan perhatian dan pendampingan konseling dari Guru BK.'
                : 'Siswa berada dalam ambang batas kondisi mental yang stabil dan normal.'}
            </p>
          </div>
        </Card>

        <Card className="rounded-xl border-gray-200 shadow-sm md:col-span-2">
          {detailData.scoringResult ? (
            <QuestionnaireScoreSummary result={detailData.scoringResult} />
          ) : (
            <div className="flex flex-col justify-center h-full space-y-2">
              <h3 className="font-semibold text-gray-800 text-sm">Ringkasan Evaluasi Kuesioner</h3>
              <p className="text-xs text-gray-500">
                Total Jawaban Terisi: {detailData.answeredCount} butir pertanyaan.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-3">
                <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-3">
                  <span className="text-xs text-emerald-700 font-medium">Jawaban Ya / Indikasi Positif</span>
                  <p className="text-xl font-bold text-emerald-800">{detailData.trueCount}</p>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                  <span className="text-xs text-gray-600 font-medium">Jawaban Tidak / Negatif</span>
                  <p className="text-xl font-bold text-gray-800">{detailData.falseCount}</p>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Tabel Rincian Butir Pertanyaan */}
      <Card
        className="rounded-xl border-gray-200 shadow-sm overflow-hidden !p-0"
        styles={{ body: { padding: 0 } }}
        title={
          <div className="flex items-center gap-2 py-4">
            <FileText size={18} className="text-[#00A651]" />
            <span className="font-bold text-gray-800 text-base">Rincian Jawaban Siswa per Butir Pertanyaan</span>
          </div>
        }
      >
        <Table
          columns={columns}
          dataSource={mappedQuestions}
          rowKey="no"
          pagination={false}
          scroll={{ x: 600 }}
          rowClassName="hover:bg-gray-50 transition-colors"
        />
      </Card>
    </div>
  );
}
