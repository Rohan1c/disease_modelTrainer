import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Button } from './components/ui/button';
import { Badge } from './components/ui/badge';
import { Separator } from './components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './components/ui/dialog';
import { Upload, Camera, AlertTriangle, Lightbulb, TrendingUp, Droplets, Moon, Sun, X, Clock, ThermometerSun, Wind, Eye, Leaf, Sprout, Shield } from 'lucide-react';
import { ImageWithFallback } from './components/figma/ImageWithFallback';

// Mock ML model response
const mockAnalysisResults = {
  disease: "Late Blight",
  confidence: 87,
  severity: "Moderate",
  isHealthy: false,
  causes: [
    "High humidity levels (>90%)",
    "Cool temperatures (15-20°C)",
    "Poor air circulation",
    "Overhead watering"
  ],
  shortTermTreatment: [
    "Apply copper-based fungicide immediately",
    "Remove affected foliage",
    "Improve drainage around plants",
    "Reduce watering frequency"
  ],
  longTermTreatment: [
    "Plant resistant varieties next season",
    "Implement crop rotation (3-4 year cycle)",
    "Install drip irrigation system",
    "Ensure proper plant spacing"
  ],
  yieldOptimization: [
    "Harvest unaffected tubers early",
    "Store in cool, dry conditions (4-7°C)",
    "Monitor remaining plants daily",
    "Apply preventive treatments to healthy areas"
  ]
};

// Expanded content for modals
const expandedContent = {
  disease: {
    title: "Disease Detection Analysis",
    icon: AlertTriangle,
    details: {
      pathogen: "Phytophthora infestans",
      family: "Oomycetes",
      commonNames: ["Late Blight", "Potato Blight", "Irish Potato Famine"],
      description: "Late blight is one of the most destructive diseases of potato and tomato crops worldwide. It's caused by the water mold Phytophthora infestans and can destroy entire crops within days under favorable conditions.",
      symptoms: [
        "Dark brown to black lesions on leaves",
        "White fuzzy growth on leaf undersides",
        "Brown to black lesions on stems",
        "Rotting of tubers with reddish-brown discoloration"
      ],
      conditions: "Thrives in cool, wet weather (15-20°C) with high humidity",
      historicalNote: "This disease caused the Irish Potato Famine in the 1840s, leading to over one million deaths."
    }
  },
  causes: {
    title: "Environmental Causes & Risk Factors",
    icon: Droplets,
    details: {
      primaryFactors: [
        {
          factor: "High Humidity (>90%)",
          impact: "Critical",
          explanation: "Spores require moisture to germinate and infect plant tissue"
        },
        {
          factor: "Cool Temperatures (15-20°C)",
          impact: "High",
          explanation: "Optimal temperature range for pathogen development"
        },
        {
          factor: "Poor Air Circulation",
          impact: "High",
          explanation: "Stagnant air maintains high humidity around plants"
        },
        {
          factor: "Overhead Watering",
          impact: "Moderate",
          explanation: "Creates wet conditions on foliage, facilitating infection"
        }
      ],
      seasonalRisk: "Highest risk during wet, cool periods in late summer and early fall",
      weatherPatterns: "Rain followed by warm, humid conditions creates ideal infection windows",
      soilFactors: "Poorly drained soils contribute to overall plant stress and susceptibility"
    }
  },
  treatment: {
    title: "Comprehensive Treatment Strategy",
    icon: Lightbulb,
    details: {
      immediateActions: [
        {
          action: "Apply copper-based fungicide",
          timing: "Within 24 hours",
          method: "Foliar spray covering all plant surfaces",
          frequency: "Every 7-10 days until conditions improve"
        },
        {
          action: "Remove affected foliage",
          timing: "Immediately",
          method: "Cut and dispose of infected leaves and stems",
          precaution: "Disinfect tools between plants"
        },
        {
          action: "Improve drainage",
          timing: "Within 48 hours",
          method: "Create furrows, add organic matter",
          benefit: "Reduces soil moisture and root stress"
        }
      ],
      preventativeStrategies: [
        {
          strategy: "Resistant Varieties",
          examples: ["Defender", "Sarpo Mira", "Orla"],
          effectiveness: "80-95% reduction in disease severity"
        },
        {
          strategy: "Crop Rotation",
          cycle: "3-4 year rotation with non-solanaceous crops",
          benefits: "Breaks disease cycle, improves soil health"
        },
        {
          strategy: "Drip Irrigation",
          advantage: "Keeps foliage dry, reduces infection risk",
          installation: "Install before planting season"
        }
      ],
      organicOptions: [
        "Bordeaux mixture (copper sulfate + lime)",
        "Baking soda spray (sodium bicarbonate)",
        "Compost tea applications",
        "Beneficial microorganism inoculants"
      ]
    }
  },
  yield: {
    title: "Yield Optimization & Recovery",
    icon: TrendingUp,
    details: {
      salvageOperations: [
        {
          action: "Early Harvest Assessment",
          timing: "Immediately",
          method: "Check tuber condition by careful digging",
          decision: "Harvest healthy tubers if disease is spreading rapidly"
        },
        {
          action: "Selective Harvesting",
          approach: "Harvest unaffected areas first",
          storage: "Separate potentially affected tubers",
          monitoring: "Check storage conditions weekly"
        }
      ],
      storageOptimization: [
        {
          parameter: "Temperature",
          optimal: "4-7°C (39-45°F)",
          critical: "Maintain consistent temperature"
        },
        {
          parameter: "Humidity",
          optimal: "85-90% relative humidity",
          ventilation: "Ensure adequate air circulation"
        },
        {
          parameter: "Duration",
          shortTerm: "2-3 months for affected crops",
          longTerm: "6-8 months for healthy tubers"
        }
      ],
      yieldRecovery: [
        "Implement intensive monitoring of remaining plants",
        "Apply foliar nutrients to stressed plants",
        "Consider second planting of fast-maturing varieties",
        "Document affected areas for next season planning"
      ],
      economicConsiderations: [
        "Calculate cost-benefit of continued treatment vs. early harvest",
        "Consider insurance claims for significant losses",
        "Plan for replanting or alternative crops",
        "Market timing for salvaged crop"
      ]
    }
  }
};

type ModalType = 'disease' | 'causes' | 'treatment' | 'yield' | null;

export default function App() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [analysisResults, setAnalysisResults] = useState<typeof mockAnalysisResults | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  // Initialize dark mode from system preference or localStorage
  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
    const systemDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const shouldBeDark = savedMode ? JSON.parse(savedMode) : systemDarkMode;
    setIsDarkMode(shouldBeDark);
    
    if (shouldBeDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('darkMode', JSON.stringify(newMode));
    
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
        simulateAnalysis();
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
        simulateAnalysis();
      };
      reader.readAsDataURL(file);
    }
  };

  const simulateAnalysis = () => {
    setIsAnalyzing(true);
    setAnalysisResults(null);
    // Simulate ML model processing time
    setTimeout(() => {
      setAnalysisResults(mockAnalysisResults);
      setIsAnalyzing(false);
    }, 2000);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'mild': return 'bg-green-500/20 text-green-700 dark:bg-green-500/20 dark:text-green-300';
      case 'moderate': return 'bg-yellow-500/20 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-300';
      case 'severe': return 'bg-red-500/20 text-red-700 dark:bg-red-500/20 dark:text-red-300';
      default: return 'bg-gray-500/20 text-gray-700 dark:bg-gray-500/20 dark:text-gray-300';
    }
  };

  const openModal = (modalType: ModalType) => {
    if (analysisResults && !isAnalyzing) {
      setActiveModal(modalType);
    }
  };

  const renderExpandedModal = () => {
    if (!activeModal || !analysisResults) return null;

    const content = expandedContent[activeModal];
    const IconComponent = content.icon;

    return (
      <Dialog open={!!activeModal} onOpenChange={() => setActiveModal(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <IconComponent className="h-6 w-6" />
              {content.title}
            </DialogTitle>
            <DialogDescription>
              {activeModal === 'disease' && 'Detailed analysis of the detected potato disease, including pathogen information and symptoms.'}
              {activeModal === 'causes' && 'Environmental factors and conditions that contribute to the development of this disease.'}
              {activeModal === 'treatment' && 'Comprehensive treatment strategies including immediate actions and long-term prevention methods.'}
              {activeModal === 'yield' && 'Strategies to optimize yield recovery and minimize losses from the affected crop.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Disease Detection Modal */}
            {activeModal === 'disease' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Eye className="h-5 w-5" />
                        Current Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <h4 className="mb-2">Detected Disease</h4>
                        <p className="text-lg">{analysisResults.disease}</p>
                        <p className="text-sm text-muted-foreground">
                          Confidence: {analysisResults.confidence}%
                        </p>
                      </div>
                      <div>
                        <h4 className="mb-2">Severity Level</h4>
                        <Badge className={getSeverityColor(analysisResults.severity)}>
                          {analysisResults.severity}
                        </Badge>
                      </div>
                      <div>
                        <h4 className="mb-2">Pathogen</h4>
                        <p className="text-sm italic">{content.details.pathogen}</p>
                        <p className="text-sm text-muted-foreground">Family: {content.details.family}</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Leaf className="h-5 w-5" />
                        Disease Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <h4 className="mb-2">Common Names</h4>
                        <ul className="text-sm space-y-1">
                          {content.details.commonNames.map((name, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <div className="h-1 w-1 bg-primary rounded-full"></div>
                              {name}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="mb-2">Optimal Conditions</h4>
                        <p className="text-sm">{content.details.conditions}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Disease Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">{content.details.description}</p>
                    <div className="bg-yellow-50 dark:bg-yellow-950/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                      <h4 className="mb-2 flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Historical Note
                      </h4>
                      <p className="text-sm">{content.details.historicalNote}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Symptoms to Watch For</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {content.details.symptoms.map((symptom, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="h-1.5 w-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-sm">{symptom}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Causes Modal */}
            {activeModal === 'causes' && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ThermometerSun className="h-5 w-5" />
                      Primary Risk Factors
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {content.details.primaryFactors.map((factor, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4>{factor.factor}</h4>
                            <Badge variant={factor.impact === 'Critical' ? 'destructive' : factor.impact === 'High' ? 'default' : 'secondary'}>
                              {factor.impact} Impact
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{factor.explanation}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Wind className="h-5 w-5" />
                        Environmental Conditions
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <h4 className="mb-2">Seasonal Risk</h4>
                        <p className="text-sm">{content.details.seasonalRisk}</p>
                      </div>
                      <div>
                        <h4 className="mb-2">Weather Patterns</h4>
                        <p className="text-sm">{content.details.weatherPatterns}</p>
                      </div>
                      <div>
                        <h4 className="mb-2">Soil Factors</h4>
                        <p className="text-sm">{content.details.soilFactors}</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Current Detected Causes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {analysisResults.causes.map((cause, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="h-1.5 w-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-sm">{cause}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Treatment Modal */}
            {activeModal === 'treatment' && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Immediate Treatment Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {content.details.immediateActions.map((action, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4>{action.action}</h4>
                            <Badge variant="destructive">{action.timing}</Badge>
                          </div>
                          <p className="text-sm mb-2">{action.method}</p>
                          {action.frequency && (
                            <p className="text-sm text-muted-foreground">Frequency: {action.frequency}</p>
                          )}
                          {action.precaution && (
                            <p className="text-sm text-yellow-600 dark:text-yellow-400">⚠️ {action.precaution}</p>
                          )}
                          {action.benefit && (
                            <p className="text-sm text-green-600 dark:text-green-400">✓ {action.benefit}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Long-term Prevention Strategies</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {content.details.preventativeStrategies.map((strategy, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <h4 className="mb-2">{strategy.strategy}</h4>
                          {strategy.examples && (
                            <p className="text-sm mb-2">Recommended varieties: {strategy.examples.join(', ')}</p>
                          )}
                          {strategy.cycle && (
                            <p className="text-sm mb-2">Cycle: {strategy.cycle}</p>
                          )}
                          {strategy.effectiveness && (
                            <p className="text-sm text-green-600 dark:text-green-400 mb-2">Effectiveness: {strategy.effectiveness}</p>
                          )}
                          {strategy.benefits && (
                            <p className="text-sm text-muted-foreground mb-2">Benefits: {strategy.benefits}</p>
                          )}
                          {strategy.advantage && (
                            <p className="text-sm text-muted-foreground mb-2">Advantage: {strategy.advantage}</p>
                          )}
                          {strategy.installation && (
                            <p className="text-sm text-blue-600 dark:text-blue-400">Installation: {strategy.installation}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Organic Treatment Options</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {content.details.organicOptions.map((option, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="h-1.5 w-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-sm">{option}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Yield Optimization Modal */}
            {activeModal === 'yield' && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sprout className="h-5 w-5" />
                      Salvage Operations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {content.details.salvageOperations.map((operation, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4>{operation.action}</h4>
                            <Badge>{operation.timing}</Badge>
                          </div>
                          <p className="text-sm mb-2">{operation.method}</p>
                          {operation.decision && (
                            <p className="text-sm text-orange-600 dark:text-orange-400">Decision Point: {operation.decision}</p>
                          )}
                          {operation.approach && (
                            <p className="text-sm text-blue-600 dark:text-blue-400">Approach: {operation.approach}</p>
                          )}
                          {operation.storage && (
                            <p className="text-sm text-purple-600 dark:text-purple-400">Storage: {operation.storage}</p>
                          )}
                          {operation.monitoring && (
                            <p className="text-sm text-green-600 dark:text-green-400">Monitoring: {operation.monitoring}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Storage Optimization</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {content.details.storageOptimization.map((param, index) => (
                        <div key={index} className="border rounded-lg p-4 text-center">
                          <h4 className="mb-2">{param.parameter}</h4>
                          <p className="text-lg mb-2">{param.optimal}</p>
                          <p className="text-sm text-muted-foreground">
                            {param.critical || param.ventilation || param.shortTerm}
                          </p>
                          {param.longTerm && (
                            <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                              Long-term: {param.longTerm}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Yield Recovery Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {content.details.yieldRecovery.map((action, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="h-1.5 w-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-sm">{action}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Economic Considerations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {content.details.economicConsiderations.map((consideration, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="h-1.5 w-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-sm">{consideration}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-start mb-8">
          <div className="text-center flex-1">
            <h1 className="mb-4">Potato Disease Analysis System</h1>
            <p className="text-muted-foreground">Upload a potato image for AI-powered disease detection and treatment recommendations</p>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={toggleDarkMode}
            className="ml-4"
          >
            {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </div>

        {!uploadedImage ? (
          <div className="max-w-md mx-auto">
            <Card>
              <CardContent className="p-8">
                <div
                  className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="mb-2">Upload Potato Image</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Drag and drop your potato image here or click to browse
                  </p>
                  <Button>
                    <Camera className="h-4 w-4 mr-2" />
                    Choose Image
                  </Button>
                </div>
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Disease Info & Causes */}
            <div className="space-y-6">
              <Card 
                className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
                onClick={() => openModal('disease')}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Disease Detection
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isAnalyzing ? (
                    <div className="space-y-3">
                      <div className="h-4 bg-muted animate-pulse rounded"></div>
                      <div className="h-4 bg-muted animate-pulse rounded w-3/4"></div>
                      <div className="h-4 bg-muted animate-pulse rounded w-1/2"></div>
                    </div>
                  ) : analysisResults ? (
                    <div className="space-y-4">
                      <div>
                        <h4 className="mb-2">Detected Disease</h4>
                        <p className="text-lg">{analysisResults.disease}</p>
                        <p className="text-sm text-muted-foreground">
                          Confidence: {analysisResults.confidence}%
                        </p>
                      </div>
                      <div>
                        <h4 className="mb-2">Severity Level</h4>
                        <Badge className={getSeverityColor(analysisResults.severity)}>
                          {analysisResults.severity}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-3">Click to view detailed analysis</p>
                    </div>
                  ) : null}
                </CardContent>
              </Card>

              <Card 
                className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
                onClick={() => openModal('causes')}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Droplets className="h-5 w-5" />
                    Common Causes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isAnalyzing ? (
                    <div className="space-y-2">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-3 bg-muted animate-pulse rounded"></div>
                      ))}
                    </div>
                  ) : analysisResults ? (
                    <div>
                      <ul className="space-y-2">
                        {analysisResults.causes.map((cause, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="h-1.5 w-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-sm">{cause}</span>
                          </li>
                        ))}
                      </ul>
                      <p className="text-xs text-muted-foreground mt-3">Click to view detailed risk factors</p>
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            </div>

            {/* Center Column - Image */}
            <div className="flex flex-col items-center">
              <Card className="w-full max-w-md">
                <CardContent className="p-4">
                  <div className="aspect-square relative overflow-hidden rounded-lg bg-muted">
                    <img
                      src={uploadedImage}
                      alt="Uploaded potato"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </CardContent>
              </Card>
              
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => {
                  setUploadedImage(null);
                  setAnalysisResults(null);
                  setIsAnalyzing(false);
                }}
              >
                Upload New Image
              </Button>
            </div>

            {/* Right Column - Treatments & Yield */}
            <div className="space-y-6">
              <Card 
                className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
                onClick={() => openModal('treatment')}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5" />
                    Treatment Options
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isAnalyzing ? (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="h-4 bg-muted animate-pulse rounded w-1/2"></div>
                        {[1, 2].map((i) => (
                          <div key={i} className="h-3 bg-muted animate-pulse rounded"></div>
                        ))}
                      </div>
                      <div className="space-y-2">
                        <div className="h-4 bg-muted animate-pulse rounded w-1/2"></div>
                        {[1, 2].map((i) => (
                          <div key={i} className="h-3 bg-muted animate-pulse rounded"></div>
                        ))}
                      </div>
                    </div>
                  ) : analysisResults ? (
                    <div className="space-y-4">
                      <div>
                        <h4 className="mb-3">Short-term Actions</h4>
                        <ul className="space-y-2">
                          {analysisResults.shortTermTreatment.slice(0, 2).map((treatment, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <div className="h-1.5 w-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                              <span className="text-sm">{treatment}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h4 className="mb-3">Long-term Prevention</h4>
                        <ul className="space-y-2">
                          {analysisResults.longTermTreatment.slice(0, 2).map((treatment, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <div className="h-1.5 w-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                              <span className="text-sm">{treatment}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <p className="text-xs text-muted-foreground mt-3">Click to view comprehensive treatment guide</p>
                    </div>
                  ) : null}
                </CardContent>
              </Card>

              <Card 
                className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
                onClick={() => openModal('yield')}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Yield Optimization
                  </CardTitle>
                  <CardDescription>
                    Maximize harvest from current batch
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isAnalyzing ? (
                    <div className="space-y-2">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-3 bg-muted animate-pulse rounded"></div>
                      ))}
                    </div>
                  ) : analysisResults ? (
                    <div>
                      <ul className="space-y-2">
                        {analysisResults.yieldOptimization.slice(0, 3).map((tip, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="h-1.5 w-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-sm">{tip}</span>
                          </li>
                        ))}
                      </ul>
                      <p className="text-xs text-muted-foreground mt-3">Click to view optimization strategies</p>
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {renderExpandedModal()}
      </div>
    </div>
  );
}