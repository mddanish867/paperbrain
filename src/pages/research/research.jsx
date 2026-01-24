import React, { useState } from 'react';
import { 
  ChevronDownIcon, 
  DocumentTextIcon, 
  ChartBarIcon, 
  ClockIcon, 
  CheckCircleIcon, 
  ExclamationTriangleIcon,
  ArrowDownTrayIcon,
  ShareIcon,
  PrinterIcon,
  MagnifyingGlassIcon,
  SparklesIcon,
  BoltIcon,
  GlobeAltIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { generateResearchReportApi, generateQuickAnalysisApi } from '../../api/research';
import Home from '../home/home';

const ResearchReportGenerator = () => {
  const [query, setQuery] = useState('');
  const [priority, setPriority] = useState('standard');
  const [focusAreas, setFocusAreas] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [error, setError] = useState(null);
  const [analysisType, setAnalysisType] = useState('comprehensive'); // 'comprehensive' or 'quick'

  const priorityOptions = [
    { value: 'urgent', label: 'Urgent', color: 'text-red-600', bgColor: 'bg-red-50 border-red-200' },
    { value: 'standard', label: 'Standard', color: 'text-blue-600', bgColor: 'bg-blue-50 border-blue-200' },
    { value: 'comprehensive', label: 'Comprehensive', color: 'text-purple-600', bgColor: 'bg-purple-50 border-purple-200' }
  ];

  const focusAreaOptions = [
    'Market Analysis', 'Financial Impact', 'Technology Trends', 'Competitive Landscape',
    'Risk Assessment', 'Regulatory Environment', 'Consumer Behavior', 'Innovation Opportunities'
  ];

  const handleGenerateReport = async () => {
    if (!query.trim()) {
      setError('Please enter a research topic');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setReportData(null);

    try {
      const apiCall = analysisType === 'comprehensive' ? generateResearchReportApi : generateQuickAnalysisApi;
      const data = await apiCall({
        query: query.trim(),
        priority,
        focus_areas: focusAreas
      });
      
      setReportData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFocusAreaToggle = (area) => {
    setFocusAreas(prev => 
      prev.includes(area) 
        ? prev.filter(a => a !== area)
        : [...prev, area]
    );
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.8) return 'text-green-600 bg-green-50';
    if (confidence >= 0.6) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getQualityBadge = (confidence) => {
    if (confidence >= 0.8) return { text: 'High Quality', color: 'bg-green-100 text-green-800' };
    if (confidence >= 0.6) return { text: 'Good Quality', color: 'bg-yellow-100 text-yellow-800' };
    return { text: 'Developing', color: 'bg-red-100 text-red-800' };
  };

  const formatReportContent = (content) => {
    // Convert markdown-style content to JSX
    const lines = content.split('\n');
    const elements = [];
    let currentSection = '';

    lines.forEach((line, index) => {
      if (line.startsWith('# ')) {
        elements.push(
          <h1 key={index} className="text-3xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">
            {line.replace('# ', '')}
          </h1>
        );
      } else if (line.startsWith('## ')) {
        elements.push(
          <h2 key={index} className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
            {line.replace('## ', '')}
          </h2>
        );
      } else if (line.startsWith('### ')) {
        elements.push(
          <h3 key={index} className="text-xl font-semibold text-gray-700 mt-6 mb-3">
            {line.replace('### ', '')}
          </h3>
        );
      } else if (line.startsWith('**') && line.endsWith('**')) {
        elements.push(
          <p key={index} className="font-semibold text-gray-800 mt-3 mb-2">
            {line.replace(/\*\*/g, '')}
          </p>
        );
      } else if (line.startsWith('• ') || line.startsWith('- ')) {
        elements.push(
          <li key={index} className="ml-4 mb-2 text-gray-700">
            {line.replace(/^[•-] /, '')}
          </li>
        );
      } else if (line.trim()) {
        elements.push(
          <p key={index} className="text-gray-700 mb-3 leading-relaxed">
            {line}
          </p>
        );
      }
    });

    return elements;
  };

  return (
    <>
    <Home/>
    <div className="max-w-7xl mx-auto p-6  min-h-screen">      
      {/* Header */}
      <div className="bg-white  p-4 mb-4 border border-gray-200">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
              <SparklesIcon className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            AI Research Intelligence
          </h1>
          <p className="text-xl text-gray-600">
            Generate comprehensive strategic reports powered by multi-agent AI
          </p>
        </div>

        {/* Analysis Type Toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-100 p-1 rounded-lg flex">
            <button
              onClick={() => setAnalysisType('comprehensive')}
              className={`px-6 py-3 rounded-md font-medium transition-all ${
                analysisType === 'comprehensive'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <DocumentTextIcon className="w-5 h-5 inline-block mr-2" />
              Comprehensive Report
            </button>
            <button
              onClick={() => setAnalysisType('quick')}
              className={`px-6 py-3 rounded-md font-medium transition-all ${
                analysisType === 'quick'
                  ? 'bg-white text-purple-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <BoltIcon className="w-5 h-5 inline-block mr-2" />
              Quick Analysis
            </button>
          </div>
        </div>

        {/* Research Query Input */}
        <div className="mb-6">
          <label className="block text-lg font-semibold text-gray-700 mb-3">
            Research Topic
          </label>
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter your research question or topic (e.g., 'Impact of AI on healthcare industry', 'Future of renewable energy markets')"
              className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none h-32 text-gray-900 placeholder-gray-500"
              disabled={isGenerating}
            />
          </div>
        </div>

        {/* Priority Selection */}
        <div className="mb-6">
          <label className="block text-lg font-semibold text-gray-700 mb-3">
            Priority Level
          </label>
          <div className="grid grid-cols-3 gap-4">
            {priorityOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setPriority(option.value)}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  priority === option.value
                    ? `${option.bgColor} ${option.color} border-current`
                    : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                }`}
                disabled={isGenerating}
              >
                <div className="font-semibold">{option.label}</div>
                <div className="text-sm opacity-75">
                  {option.value === 'urgent' && 'Fast turnaround, key insights'}
                  {option.value === 'standard' && 'Balanced depth and speed'}
                  {option.value === 'comprehensive' && 'Deep analysis, detailed research'}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Focus Areas */}
        <div className="mb-8">
          <label className="block text-lg font-semibold text-gray-700 mb-3">
            Focus Areas (Optional)
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {focusAreaOptions.map((area) => (
              <button
                key={area}
                onClick={() => handleFocusAreaToggle(area)}
                className={`p-3 rounded-lg text-sm font-medium transition-all ${
                  focusAreas.includes(area)
                    ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
                    : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-gray-300'
                }`}
                disabled={isGenerating}
              >
                {area}
              </button>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <div className="text-center">
          <button
            onClick={handleGenerateReport}
            disabled={isGenerating || !query.trim()}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {isGenerating ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                Generating {analysisType === 'comprehensive' ? 'Report' : 'Analysis'}...
              </div>
            ) : (
              <div className="flex items-center">
                <SparklesIcon className="w-5 h-5 mr-2" />
                Generate {analysisType === 'comprehensive' ? 'Report' : 'Analysis'}
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="w-5 h-5 text-red-500 mr-3" />
            <span className="text-red-700">{error}</span>
          </div>
        </div>
      )}

      {/* Report Results */}
      {reportData && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200">
          {/* Report Header */}
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="p-2 bg-white rounded-lg shadow-sm mr-4">
                  <DocumentTextIcon className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {analysisType === 'comprehensive' ? 'Strategic Research Report' : 'Quick Analysis'}
                  </h2>
                  <p className="text-gray-600">Generated on {new Date(reportData.timestamp).toLocaleString()}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded-lg transition-all">
                  <ShareIcon className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded-lg transition-all">
                  <ArrowDownTrayIcon className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded-lg transition-all">
                  <PrinterIcon className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Quality Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className={`p-3 rounded-lg ${getConfidenceColor(reportData.confidence)}`}>
                <div className="flex items-center">
                  <ShieldCheckIcon className="w-5 h-5 mr-2" />
                  <div>
                    <div className="text-sm font-medium">Confidence</div>
                    <div className="text-lg font-bold">{Math.round(reportData.confidence * 100)}%</div>
                  </div>
                </div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <GlobeAltIcon className="w-5 h-5 mr-2 text-gray-600" />
                  <div>
                    <div className="text-sm font-medium text-gray-600">Sources</div>
                    <div className="text-lg font-bold text-gray-900">{reportData.sources?.length || 0}</div>
                  </div>
                </div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <ChartBarIcon className="w-5 h-5 mr-2 text-gray-600" />
                  <div>
                    <div className="text-sm font-medium text-gray-600">Visuals</div>
                    <div className="text-lg font-bold text-gray-900">{reportData.visuals?.length || 0}</div>
                  </div>
                </div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <ClockIcon className="w-5 h-5 mr-2 text-gray-600" />
                  <div>
                    <div className="text-sm font-medium text-gray-600">Gen Time</div>
                    <div className="text-lg font-bold text-gray-900">{reportData.generation_time}s</div>
                  </div>
                </div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getQualityBadge(reportData.confidence).color}`}>
                  {getQualityBadge(reportData.confidence).text}
                </div>
              </div>
            </div>
          </div>

          {/* Executive Summary */}
          {reportData.executive_summary && (
            <div className="p-6 border-b border-gray-200 bg-blue-50">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <SparklesIcon className="w-5 h-5 mr-2 text-blue-600" />
                Executive Summary
              </h3>
              <p className="text-gray-700 leading-relaxed text-lg">
                {reportData.executive_summary}
              </p>
            </div>
          )}

          {/* Visualizations */}
          {reportData.visuals && reportData.visuals.length > 0 && (
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <ChartBarIcon className="w-5 h-5 mr-2 text-green-600" />
                Data Visualizations
              </h3>
              <div className="grid gap-6">
                {reportData.visuals.map((visual, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">{visual.title}</h4>
                    {visual.description && (
                      <p className="text-gray-600 mb-4">{visual.description}</p>
                    )}
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <img
                        src={`data:image/png;base64,${visual.base64}`}
                        alt={visual.title}
                        className="w-full h-auto"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Main Report Content */}
          <div className="p-6">
            <div className="prose max-w-none">
              {analysisType === 'comprehensive' && reportData.report ? 
                formatReportContent(reportData.report) :
                (
                  <div>
                    {reportData.research_findings && (
                      <div className="mb-8">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Research Findings</h3>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <pre className="whitespace-pre-wrap text-gray-700">{reportData.research_findings}</pre>
                        </div>
                      </div>
                    )}
                    {reportData.strategic_analysis && (
                      <div className="mb-8">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Strategic Analysis</h3>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <pre className="whitespace-pre-wrap text-gray-700">{reportData.strategic_analysis}</pre>
                        </div>
                      </div>
                    )}
                  </div>
                )
              }
            </div>
          </div>

          {/* Sources Section */}
          {reportData.sources && reportData.sources.length > 0 && (
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <GlobeAltIcon className="w-5 h-5 mr-2 text-gray-600" />
                Sources & References
              </h3>
              <div className="grid gap-4">
                {reportData.sources.slice(0, 10).map((source, index) => (
                  <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900">
                        Source {index + 1}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        source.credibility === 'High' ? 'bg-green-100 text-green-800' :
                        source.credibility === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {source.credibility} Credibility
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{source.url}</p>
                    <p className="text-sm text-gray-700">{source.snippet}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
    </>
    
  );
};

export default ResearchReportGenerator;