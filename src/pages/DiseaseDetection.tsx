import { useState } from "react";

function DiseaseDetection() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  // Mock analysis results for different disease types
  const mockResults = {
    healthy: {
      status: "healthy",
      confidence: 95,
      disease: null,
      severity: null,
      warning: null,
      recommendations: [
        "Continue current care practices",
        "Monitor regularly for any changes",
        "Maintain proper watering schedule",
        "Ensure adequate sunlight exposure"
      ]
    },
    earlyBlight: {
      status: "diseased",
      confidence: 87,
      disease: "Early Blight",
      severity: "Moderate",
      warning: "Early intervention required to prevent spread",
      recommendations: [
        "Remove affected leaves immediately",
        "Apply copper-based fungicide spray",
        "Improve air circulation around plants",
        "Avoid overhead watering",
        "Apply preventive fungicide every 7-14 days"
      ]
    },
    lateBlight: {
      status: "diseased",
      confidence: 92,
      disease: "Late Blight",
      severity: "Severe",
      warning: "Immediate action required - highly contagious disease",
      recommendations: [
        "Destroy infected plants immediately",
        "Apply systemic fungicide treatment",
        "Increase plant spacing for better airflow",
        "Monitor neighboring plants closely",
        "Consider resistant potato varieties for next season"
      ]
    },
    bacterial: {
      status: "diseased",
      confidence: 78,
      disease: "Bacterial Infection",
      severity: "Moderate",
      warning: "Bacterial disease detected - prevent water splash",
      recommendations: [
        "Remove infected plant parts",
        "Apply copper bactericide",
        "Improve drainage in the field",
        "Avoid working with wet plants",
        "Sanitize tools between plants"
      ]
    },
    virus: {
      status: "diseased",
      confidence: 85,
      disease: "Viral Infection",
      severity: "High",
      warning: "Viral infection - control insect vectors",
      recommendations: [
        "Remove infected plants to prevent spread",
        "Control aphids and other insect vectors",
        "Use virus-free seed potatoes",
        "Implement strict sanitation practices",
        "Consider replanting with resistant varieties"
      ]
    },
    pest: {
      status: "pest",
      confidence: 90,
      disease: "Pest Damage",
      severity: "Moderate",
      warning: "Pest activity detected - monitor for population growth",
      recommendations: [
        "Identify specific pest species",
        "Apply targeted insecticide treatment",
        "Use beneficial insects for biological control",
        "Remove heavily damaged leaves",
        "Monitor weekly for pest population changes"
      ]
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        setAnalysisResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = () => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis with random result
    setTimeout(() => {
      const results = Object.values(mockResults);
      const randomResult = results[Math.floor(Math.random() * results.length)];
      setAnalysisResult(randomResult);
      setIsAnalyzing(false);
    }, 3000);
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy": return "text-green-600";
      case "diseased": return "text-red-600";
      case "pest": return "text-orange-600";
      default: return "text-gray-600";
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case "healthy": return "bg-green-50 border-green-200";
      case "diseased": return "bg-red-50 border-red-200";
      case "pest": return "bg-orange-50 border-orange-200";
      default: return "bg-gray-50 border-gray-200";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case "low": return "text-yellow-600";
      case "moderate": return "text-orange-600";
      case "high": case "severe": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Disease Detection</h1>
        <p className="text-gray-600">Upload an image of your potato plant leaf for AI-powered analysis</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Image Upload Section */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Upload Leaf Image</h2>
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            {selectedImage ? (
              <div className="space-y-4">
                <img 
                  src={selectedImage} 
                  alt="Uploaded leaf" 
                  className="max-w-full h-64 object-contain mx-auto rounded-lg"
                />
                <div className="space-y-2">
                  <button
                    onClick={analyzeImage}
                    disabled={isAnalyzing}
                    className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isAnalyzing ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Analyzing...</span>
                      </div>
                    ) : (
                      "Analyze Image"
                    )}
                  </button>
                  <div>
                    <label className="cursor-pointer text-green-600 hover:text-green-700 text-sm">
                      Choose Different Image
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-6xl text-gray-300">🌿</div>
                <div>
                  <label className="cursor-pointer bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors inline-block">
                    Select Image
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                <p className="text-gray-500 text-sm">
                  Upload a clear image of a potato plant leaf for analysis
                </p>
              </div>
            )}
          </div>

          {/* Sample Images */}
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Or try with sample images:</h3>
            <div className="grid grid-cols-3 gap-2">
              {[
                { name: "Healthy Leaf", url: "https://images.pexels.com/photos/1459505/pexels-photo-1459505.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop" },
                { name: "Diseased Leaf", url: "https://images.pexels.com/photos/4750270/pexels-photo-4750270.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop" },
                { name: "Pest Damage", url: "https://images.pexels.com/photos/6129507/pexels-photo-6129507.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop" }
              ].map((sample, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSelectedImage(sample.url);
                    setAnalysisResult(null);
                  }}
                  className="relative group"
                >
                  <img 
                    src={sample.url} 
                    alt={sample.name}
                    className="w-full h-16 object-cover rounded-lg group-hover:opacity-80 transition-opacity"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg transition-all"></div>
                  <p className="text-xs text-gray-600 mt-1">{sample.name}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Analysis Results Section */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Analysis Results</h2>
          
          {!analysisResult && !isAnalyzing && (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-4">🔍</div>
              <p className="mb-6">Upload an image and click "Analyze" to see results</p>
              
              {/* Placeholder Steps */}
              <div className="text-left max-w-md mx-auto space-y-4">
                <h4 className="font-medium text-gray-700 text-center mb-4">What you'll get:</h4>
                
                <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs text-green-600">1</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Disease Identification</p>
                    <p className="text-xs text-gray-500">AI will analyze and identify any diseases present</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs text-blue-600">2</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Severity Assessment</p>
                    <p className="text-xs text-gray-500">Get severity level and confidence score</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs text-yellow-600">3</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Warning Alerts</p>
                    <p className="text-xs text-gray-500">Receive important warnings with voice playback</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs text-purple-600">4</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Treatment Steps</p>
                    <p className="text-xs text-gray-500">Get detailed recommendations to treat the issue</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {isAnalyzing && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-600">AI is analyzing your image...</p>
            </div>
          )}

          {analysisResult && (
            <div className="space-y-6">
              {/* Status */}
              <div className={`p-4 rounded-lg border-2 ${getStatusBgColor(analysisResult.status)}`}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className={`text-lg font-semibold ${getStatusColor(analysisResult.status)}`}>
                    {analysisResult.status === "healthy" ? "✅ Healthy Plant" : 
                     analysisResult.status === "diseased" ? "🦠 Disease Detected" : 
                     "🐛 Pest Activity Detected"}
                  </h3>
                  <button
                    onClick={() => speakText(
                      analysisResult.status === "healthy" 
                        ? "Plant appears healthy" 
                        : `${analysisResult.disease} detected with ${analysisResult.severity} severity`
                    )}
                    className="p-2 bg-blue-100 hover:bg-blue-200 rounded-full transition-colors"
                    title="Listen to result"
                  >
                    🔊
                  </button>
                </div>
                
                {analysisResult.disease && (
                  <div className="space-y-2">
                    <p className="font-medium">Disease: {analysisResult.disease}</p>
                    <p className={`font-medium ${getSeverityColor(analysisResult.severity)}`}>
                      Severity: {analysisResult.severity}
                    </p>
                  </div>
                )}
                
                <p className="text-sm opacity-75">
                  Confidence: {analysisResult.confidence}%
                </p>
              </div>

              {/* Warning */}
              {analysisResult.warning && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-yellow-400 mr-2">⚠️</span>
                      <p className="text-yellow-800 font-medium">{analysisResult.warning}</p>
                    </div>
                    <button
                      onClick={() => speakText(analysisResult.warning)}
                      className="p-1 bg-yellow-100 hover:bg-yellow-200 rounded-full transition-colors"
                      title="Listen to warning"
                    >
                      🔊
                    </button>
                  </div>
                </div>
              )}

              {/* Recommendations */}
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-blue-800">Recommended Actions:</h4>
                  <button
                    onClick={() => speakText(`Recommended actions: ${analysisResult.recommendations.join('. ')}`)}
                    className="p-2 bg-blue-100 hover:bg-blue-200 rounded-full transition-colors"
                    title="Listen to recommendations"
                  >
                    🔊
                  </button>
                </div>
                <ul className="space-y-2">
                  {analysisResult.recommendations.map((rec: string, index: number) => (
                    <li key={index} className="flex items-start space-x-2 text-blue-700">
                      <span className="text-blue-400 mt-1">•</span>
                      <span className="text-sm">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={() => window.print()}
                  className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  📄 Save Report
                </button>
                <button
                  onClick={() => {
                    setSelectedImage(null);
                    setAnalysisResult(null);
                  }}
                  className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                >
                  🔄 New Analysis
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tips Section */}
      <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Tips for Better Results</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="flex items-start space-x-3">
            <span className="text-2xl">📸</span>
            <div>
              <h4 className="font-medium">Clear Images</h4>
              <p className="text-sm text-gray-600">Take photos in good lighting with the leaf filling most of the frame</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <span className="text-2xl">🌿</span>
            <div>
              <h4 className="font-medium">Single Leaf</h4>
              <p className="text-sm text-gray-600">Focus on one leaf at a time for more accurate analysis</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <span className="text-2xl">🔍</span>
            <div>
              <h4 className="font-medium">Show Symptoms</h4>
              <p className="text-sm text-gray-600">Include any visible spots, discoloration, or damage in the image</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DiseaseDetection;