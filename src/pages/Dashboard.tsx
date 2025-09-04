import { Link } from "react-router-dom";
import WeatherWidget from "../components/WeatherWidget";
import RiskMeter from "../components/RiskMeter";

function Dashboard() {
  // Mock user data
  const userData = {
    name: "Rajesh Kumar",
    location: "Punjab, India",
    soilType: "Loamy",
    farmSize: "5 acres"
  };

  const riskFactors = [
    "High humidity levels",
    "Temperature fluctuations",
    "Recent rainfall patterns"
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Welcome back, {userData.name}! 👋
        </h1>
        <p className="text-gray-600">
          Here's your farm overview for {userData.location}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Farm Size</p>
              <p className="text-2xl font-bold text-gray-800">{userData.farmSize}</p>
            </div>
            <div className="text-3xl">🌾</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Soil Type</p>
              <p className="text-2xl font-bold text-gray-800">{userData.soilType}</p>
            </div>
            <div className="text-3xl">🌱</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Crops Monitored</p>
              <p className="text-2xl font-bold text-gray-800">3</p>
            </div>
            <div className="text-3xl">📊</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Health Score</p>
              <p className="text-2xl font-bold text-green-600">85%</p>
            </div>
            <div className="text-3xl">💚</div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Weather Widget */}
          <WeatherWidget location={userData.location} />

          {/* Quick Actions */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <Link
                to="/disease-detection"
                className="flex items-center space-x-3 p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
              >
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <span className="text-xl">🔍</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">Disease Detection</h4>
                  <p className="text-sm text-gray-600">Scan your crops</p>
                </div>
              </Link>

              <Link
                to="/ai-assistant"
                className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
              >
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-xl">🤖</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">AI Assistant</h4>
                  <p className="text-sm text-gray-600">Get advice</p>
                </div>
              </Link>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-sm">✓</span>
                </div>
                <div>
                  <p className="text-sm font-medium">Disease scan completed</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm">💬</span>
                </div>
                <div>
                  <p className="text-sm font-medium">AI consultation session</p>
                  <p className="text-xs text-gray-500">1 day ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Risk Meter */}
          <RiskMeter riskLevel={45} factors={riskFactors} />

          {/* Tips */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Today's Tips</h3>
            <div className="space-y-3">
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-green-800">
                  💡 Perfect weather for field inspection today!
                </p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg">
                <p className="text-sm text-yellow-800">
                  ⚠️ Monitor for early blight symptoms this week.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;