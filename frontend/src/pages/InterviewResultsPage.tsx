import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { InterviewReport } from '../types';
import {
  Award, Download, RefreshCw, ArrowLeft, CheckCircle2,
  AlertTriangle, FileText, ChevronDown, ChevronUp, Bot, Quote
} from 'lucide-react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid
} from 'recharts';

export const InterviewResultsPage: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [report, setReport] = useState<InterviewReport | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);

  useEffect(() => {
    const fetchReport = async () => {
      if (!sessionId) return;
      try {
        const data = await api.getReport(sessionId);
        setReport(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-ink-soft text-sm">
        <Bot className="h-10 w-10 text-sage-600 animate-pulse mb-3" />
        Generating evidence-based performance report...
      </div>
    );
  }

  if (!report) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <AlertTriangle className="h-10 w-10 text-peach-700 mx-auto" />
        <h2 className="text-xl font-bold text-ink">Report Not Found</h2>
        <p className="text-sm text-ink-soft">The evaluation report could not be retrieved.</p>
        <Link to="/dashboard" className="inline-block px-5 py-2.5 rounded-xl bg-sage-600 text-white text-xs font-semibold">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const chartData = [
    { name: 'Technical', score: report.dimension_scores.technical },
    { name: 'Relevance', score: report.dimension_scores.relevance },
    { name: 'Completeness', score: report.dimension_scores.completeness },
    { name: 'Problem Solving', score: report.dimension_scores.problem_solving },
    { name: 'Communication', score: report.dimension_scores.communication },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-xs text-ink-soft hover:text-ink mb-2">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Dashboard
          </Link>
          <h1 className="text-2xl sm:text-3xl font-semibold text-ink">Interview Performance Report</h1>
          <p className="text-ink-soft text-sm mt-0.5">Target Track: {report.target_role}</p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={`/api/v1/interviews/${report.session_id}/report/pdf`}
            download
            className="px-4 py-2.5 rounded-xl bg-sage-600 hover:bg-sage-700 text-white text-xs font-semibold flex items-center gap-2 shadow-soft transition"
          >
            <Download className="h-4 w-4" /> Download PDF Report
          </a>
        </div>
      </div>

      {/* Overall Score Banner & Dimension Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Score Card */}
        <div className="p-8 rounded-2xl bg-paper border border-line flex flex-col justify-between">
          <div>
            <span className="text-ink-soft text-xs font-bold uppercase tracking-wider">Overall Performance Score</span>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-5xl font-semibold text-sage-700">
                {report.overall_score}%
              </span>
              <span className="text-ink-soft text-xs">/ 100</span>
            </div>
            <p className="text-xs text-ink-soft mt-4 leading-relaxed">{report.summary}</p>
          </div>

          <div className="mt-6 pt-4 border-t border-line">
            <span className="text-[10px] text-mute uppercase tracking-wider block">Assessment Model</span>
            <span className="text-xs font-semibold text-ink-soft">Adaptive Evaluator Agent v1.2</span>
          </div>
        </div>

        {/* 5-Dimension Competency Chart */}
        <div className="lg:col-span-2 p-8 rounded-2xl bg-paper border border-line">
          <h3 className="font-bold text-ink text-base mb-1">Competency Dimensions Breakdown</h3>
          <p className="text-ink-soft text-xs mb-4">Evaluated on a strict 0 to 5.0 integer & fractional evidence scale</p>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ebe5da" />
                <XAxis dataKey="name" stroke="#6d6d76" tick={{ fill: '#6d6d76', fontSize: 11 }} />
                <YAxis domain={[0, 5]} stroke="#6d6d76" tick={{ fill: '#6d6d76', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fffefb', borderColor: '#ddd5c7', borderRadius: '8px' }}
                  itemStyle={{ color: '#44654f' }}
                />
                <Bar dataKey="score" fill="#7fa08c" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Strengths & Weaknesses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-paper border border-line space-y-4">
          <h3 className="font-bold text-sage-700 text-base flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5" /> Demonstrated Strengths
          </h3>
          <ul className="space-y-2">
            {report.strengths.map((str, idx) => (
              <li key={idx} className="p-3 rounded-xl bg-sage-100 border border-sage-300 text-sage-700 text-xs leading-relaxed">
                • {str}
              </li>
            ))}
          </ul>
        </div>

        <div className="p-6 rounded-2xl bg-paper border border-line space-y-4">
          <h3 className="font-bold text-peach-700 text-base flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" /> Areas For Improvement
          </h3>
          <ul className="space-y-2">
            {report.weaknesses.map((wk, idx) => (
              <li key={idx} className="p-3 rounded-xl bg-peach-100 border border-peach-200 text-peach-700 text-xs leading-relaxed">
                • {wk}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Question-By-Question Analysis */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-ink">Question-by-Question Evidence Analysis</h3>
        <p className="text-ink-soft text-xs">
          Inspect transcript evidence quotes, missing expected concepts, and individual rubric scores.
        </p>

        <div className="space-y-3">
          {report.questions.map((q) => {
            const isExpanded = expandedQuestion === q.question_id;
            return (
              <div key={q.question_id} className="rounded-2xl bg-paper border border-line overflow-hidden">
                <div
                  onClick={() => setExpandedQuestion(isExpanded ? null : q.question_id)}
                  className="p-5 cursor-pointer flex items-center justify-between hover:bg-sand transition"
                >
                  <div className="flex items-center gap-3 pr-4">
                    <span className="px-2.5 py-1 rounded bg-sage-100 text-sage-700 text-xs font-semibold uppercase">
                      {q.round_type}
                    </span>
                    <h4 className="text-sm font-semibold text-ink">{q.question_text}</h4>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs font-bold text-ink-soft">
                      Difficulty: Level {q.difficulty}
                    </span>
                    {isExpanded ? <ChevronUp className="h-4 w-4 text-ink-soft" /> : <ChevronDown className="h-4 w-4 text-ink-soft" />}
                  </div>
                </div>

                {isExpanded && (
                  <div className="p-6 pt-0 space-y-5 border-t border-line">
                    {/* Transcript Quote */}
                    <div className="p-4 rounded-xl bg-sand border border-line-strong space-y-1.5">
                      <span className="text-xs font-semibold text-ink-soft uppercase tracking-wider flex items-center gap-1.5">
                        <Quote className="h-3.5 w-3.5 text-sage-700" /> Candidate Spoken Transcript
                      </span>
                      <p className="text-xs text-ink italic">
                        "{q.transcript || 'No transcript recorded.'}"
                      </p>
                    </div>

                    {/* Scores row */}
                    {q.scores && (
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                        {Object.entries(q.scores).map(([dim, score]) => (
                          <div key={dim} className="p-3 rounded-xl bg-sand text-center border border-line">
                            <span className="text-[10px] text-ink-soft uppercase tracking-wider block">{dim}</span>
                            <span className="text-sm font-bold text-sage-700 mt-1 block">{score} / 5</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Missing Concepts */}
                    {q.missing_concepts.length > 0 && (
                      <div className="space-y-1.5">
                        <span className="text-xs font-semibold text-peach-700 uppercase tracking-wider">
                          Missing Expected Concepts
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {q.missing_concepts.map((mc, idx) => (
                            <span key={idx} className="text-xs px-2.5 py-1 rounded bg-peach-100 border border-peach-200 text-peach-700">
                              {mc}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Evidence Quotes */}
                    {q.evidence_quotes.length > 0 && (
                      <div className="space-y-1.5">
                        <span className="text-xs font-semibold text-sage-700 uppercase tracking-wider">
                          Transcript Evidence Citations
                        </span>
                        <div className="space-y-1">
                          {q.evidence_quotes.map((quote, idx) => (
                            <p key={idx} className="text-xs text-ink-soft bg-sand p-2 rounded border border-line">
                              "{quote}"
                            </p>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Practice Retry Action */}
                    <div className="pt-2 flex justify-end">
                      <Link
                        to={`/practice?question_id=${q.question_id}`}
                        className="px-4 py-2 rounded-xl bg-sand hover:bg-line text-ink text-xs font-semibold flex items-center gap-1.5 transition"
                      >
                        <RefreshCw className="h-3.5 w-3.5" /> Practice / Retry This Question
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Ethical Disclaimer */}
      <div className="p-4 rounded-2xl bg-paper border border-line text-center">
        <p className="text-xs text-mute italic">{report.disclaimer}</p>
      </div>
    </div>
  );
};
