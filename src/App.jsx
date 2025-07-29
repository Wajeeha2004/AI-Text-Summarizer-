import { useState } from 'react';

export default function App() {
  const [text, setText] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const summarize = async () => {
    if (!text.trim()) {
      setError("Please enter some text!");
      return;
    }
     if (text.trim().length < 10) {
    setError("Please enter at least 10 characters for a meaningful summary.");
    return;
  }

    setLoading(true);
    setError('');
    setSummary('');

    try {
      const response = await fetch(
        "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
        {
          method: "POST",
          headers: { 
            "Authorization": `Bearer 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`,
            "Content-Type": "application/json" 
          },
          body: JSON.stringify({ inputs: text }),
        }
      );

      const result = await response.json();
      if (result.error) {
        setError(result.error.includes("loading") 
          ? "Model is loading, try again in 20 seconds" 
          : result.error);
      } else {
        setSummary(result[0]?.summary_text || "Failed to generate summary");
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };


 return (
  <div className="min-h-screen p-4 bg-gray-900">
    {/* Enhanced Header */}
  <h1 className="text-3xl font-bold text-center mb-6 relative pb-2">
  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">
    AI Text Summarizer
  </span>
  <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/3 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"></span>
</h1>

    <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
      {/* Input Section */}
      <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
        <h2 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-blue-400">
          📝 Enter Your Text
        </h2>
        <textarea
          className="w-full h-52 p-4 mb-4 bg-gray-700 text-gray-100 rounded-lg border border-gray-600 
                    focus:ring-2 focus:ring-blue-400 focus:border-transparent text-lg leading-relaxed"
          placeholder="Paste your article, essay, or any text here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          onClick={summarize}
          disabled={loading || !text.trim()}
          className={`w-full py-3 px-4 rounded-lg font-semibold transition-all ${
            loading || !text.trim() 
              ? 'bg-gray-600 text-gray-400' 
              : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-md hover:shadow-lg'
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : (
            '🔍 Summarize Text'
          )}
        </button>
        {error && <p className="mt-3 text-red-300 font-medium">{error}</p>}
      </div>

      {/* Summary Section */}
      <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
        <h2 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-green-400">
          📄 AI Summary
        </h2>
        {summary ? (
          <>
            <div className="bg-gray-700 p-4 mb-4 rounded-lg text-gray-100 text-lg leading-relaxed">
              {summary}
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(summary);
                alert('Summary copied to clipboard!');
              }}
              className="w-full py-2 px-4 bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all"
            >
              📋 Copy Summary
            </button>
          </>
        ) : (
          <div className="bg-gray-700/50 p-8 rounded-lg text-center">
            <p className="text-gray-400 italic text-lg">
              Your concise summary will appear here...
            </p>
          </div>
        )}
      </div>
    </div>
  </div>
);
}

