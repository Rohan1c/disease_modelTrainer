import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="text-center py-16">
        <h1 className="text-5xl font-bold text-gray-800 mb-6">
          Welcome to <span className="text-green-600">TuberShield</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Protect your potato crops with AI-powered disease detection, weather monitoring, 
          and personalized farming advice in your regional language.
        </p>
        <Link
          to="/signup"
          className="bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors inline-block"
        >
          Get Started
        </Link>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 py-16">
        <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-blue-500">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
            <span className="text-2xl">🌤️</span>
          </div>
          <h3 className="text-xl font-semibold mb-2">Weather Monitoring</h3>
          <p className="text-gray-600">Real-time weather data for your specific location and soil conditions.</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-red-500">
          <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
            <span className="text-2xl">🔍</span>
          </div>
          <h3 className="text-xl font-semibold mb-2">Disease Detection</h3>
          <p className="text-gray-600">AI-powered image analysis to identify potato diseases early.</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-yellow-500">
          <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <h3 className="text-xl font-semibold mb-2">Risk Assessment</h3>
          <p className="text-gray-600">Risk-o-meter to evaluate potential threats to your crops.</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-purple-500">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
            <span className="text-2xl">🤖</span>
          </div>
          <h3 className="text-xl font-semibold mb-2">AI Assistant</h3>
          <p className="text-gray-600">Personalized advice in your regional language with voice support.</p>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-green-600 text-white rounded-2xl p-12 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Protect Your Crops?</h2>
        <p className="text-xl mb-8 opacity-90">
          Join thousands of farmers using TuberShield to improve their potato yields.
        </p>
        <Link
          to="/signup"
          className="bg-white text-green-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
        >
          Sign Up Now
        </Link>
      </div>
    </div>
  );
}

export default Home;