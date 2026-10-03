import { useState } from 'react';
import { ShieldCheck, ShieldAlert, Shield, Activity, Info, AlertTriangle, ArrowRight } from 'lucide-react';
import './App.css';

function App() {
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:8000/api/analyze/text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
      
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message || 'Failed to connect to the server.');
    } finally {
      setIsLoading(false);
    }
  };

  const getRiskColor = (label) => {
    if (label === 'high') return 'risk-high';
    if (label === 'medium') return 'risk-medium';
    if (label === 'low') return 'risk-low';
    return 'risk-unknown';
  };

  const getRiskIcon = (label) => {
    if (label === 'high') return <ShieldAlert size={24} />;
    if (label === 'low') return <ShieldCheck size={24} />;
    return <Shield size={24} />;
  };

  const getRiskLabelText = (label) => {
    if (label === 'high') return 'HIGH RISK';
    if (label === 'medium') return 'MEDIUM RISK';
    if (label === 'low') return 'LOW RISK';
    if (label === 'insufficient_text') return 'INSUFFICIENT TEXT';
    return label.toUpperCase();
  };

  return (
    <div className="app-container animate-fade-in">
      <header className="header">
        <h1>Digital Trust Assistant</h1>
        <p>Smart News & Information Verifier Powered by AI</p>
      </header>

      <main>
        <div className="glass-panel input-section">
          <label className="input-label" htmlFor="news-text">
            Paste News Content to Verify
          </label>
          <textarea 
            id="news-text"
            className="text-input" 
            placeholder="Paste the article text, claim, or news report here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          
          {error && (
            <div style={{ color: '#fca5a5', marginBottom: '1rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <AlertTriangle size={18} /> {error}
            </div>
          )}

          <button 
            className="btn-analyze" 
            onClick={handleAnalyze} 
            disabled={isLoading || text.length < 10}
          >
            {isLoading ? (
              <><span className="loader"></span> Analyzing Content...</>
            ) : (
              <>Analyze Risk Score <ArrowRight size={20} /></>
            )}
          </button>
        </div>

        {result && (
          <div className="glass-panel result-section animate-fade-in">
            <div className="result-header">
              <div className="result-title">
                <Activity size={24} color="#3b82f6" /> Analysis Results
              </div>
              <div className={`risk-badge ${getRiskColor(result.risk_label)}`}>
                {getRiskLabelText(result.risk_label)}
              </div>
            </div>

            {result.risk_score !== null ? (
              <div className="score-container">
                <div className="score-circle" data-risk={result.risk_label}>
                  <div className="score-value">{Math.round(result.risk_score * 100)}</div>
                  <div className="score-label">Trust Risk %</div>
                </div>
                <p style={{ color: 'var(--text-muted)' }}>
                  This content shows a <strong>{Math.round(result.risk_score * 100)}%</strong> probability of containing linguistic risk patterns.
                </p>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                No score generated.
              </div>
            )}

            {result.reason && (
              <div className="result-reason">
                <h4>System Observation</h4>
                <p>{result.reason}</p>
              </div>
            )}

            <div className="metadata-box">
              <div className="meta-item">
                <strong>Model Version</strong>
                {result.model_version}
              </div>
              <div className="meta-item">
                <strong>Training Data</strong>
                {result.training_dataset_status.toUpperCase()} (Smoke Test)
              </div>
              <div className="meta-item">
                <strong>Signal Type</strong>
                {result.signal}
              </div>
            </div>

            <div className="notice-banner">
              <Info size={24} style={{ flexShrink: 0 }} />
              <div>
                <strong>Important Notice:</strong> {result.notice}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
