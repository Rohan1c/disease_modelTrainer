interface RiskMeterProps {
  riskLevel: number; // 0-100
  factors: string[];
}

function RiskMeter({ riskLevel, factors }: RiskMeterProps) {
  const getRiskColor = (level: number) => {
    if (level <= 30) return "text-green-600";
    if (level <= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getRiskBgColor = (level: number) => {
    if (level <= 30) return "bg-green-500";
    if (level <= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getRiskLabel = (level: number) => {
    if (level <= 30) return "Low Risk";
    if (level <= 60) return "Medium Risk";
    return "High Risk";
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Risk-O-Meter</h3>
        <div className="text-2xl">⚠️</div>
      </div>

      <div className="text-center mb-6">
        <div className={`text-4xl font-bold mb-2 ${getRiskColor(riskLevel)}`}>
          {riskLevel}%
        </div>
        <div className={`text-lg font-medium ${getRiskColor(riskLevel)}`}>
          {getRiskLabel(riskLevel)}
        </div>
      </div>

      {/* Risk Meter Visual */}
      <div className="relative mb-6">
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div 
            className={`h-4 rounded-full transition-all duration-500 ${getRiskBgColor(riskLevel)}`}
            style={{ width: `${riskLevel}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      </div>

      {/* Risk Factors */}
      <div>
        <h4 className="font-medium text-gray-700 mb-3">Risk Factors:</h4>
        <div className="space-y-2">
          {factors.map((factor, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
              <span className="text-sm text-gray-600">{factor}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <h4 className="font-medium text-blue-800 mb-2">Recommendations:</h4>
        <p className="text-sm text-blue-700">
          {riskLevel <= 30 
            ? "Continue current practices. Monitor regularly."
            : riskLevel <= 60
            ? "Consider preventive measures. Increase monitoring frequency."
            : "Take immediate action. Consult with agricultural experts."
          }
        </p>
      </div>
    </div>
  );
}

export default RiskMeter;