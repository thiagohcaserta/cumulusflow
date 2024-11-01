import { useAI } from 'cumulusflow/ai';

export default function Home() {
  const { analyzeCode, generateTests } = useAI();
  const [code, setCode] = useState('');
  const [analysis, setAnalysis] = useState(null);

  const handleAnalyze = async () => {
    const result = await analyzeCode(code);
    setAnalysis(result);
  };

  return (
    <div className="container">
      <h1>AI Assistant Example</h1>
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Enter your code here..."
      />
      <button onClick={handleAnalyze}>Analyze Code</button>
      {analysis && (
        <div className="analysis">
          <h2>Analysis Results:</h2>
          <pre>{analysis}</pre>
        </div>
      )}
    </div>
  );
}