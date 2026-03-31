import { useEffect, useState, useRef, useCallback } from "react";
import {
  Lightbulb,
  TrendingUp,
  AlertTriangle,
  Zap,
  Award,
  Flame,
  Sparkles,
  ArrowRight,
  Target,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  useInsights,
  type Insight,
  type Suggestion,
  type Anomaly,
  type Gamification,
} from "@/lib/hooks/insights/useInsights";

function getInsightIcon(type: string) {
  switch (type) {
    case "PATTERN":
      return "📊";
    case "ACHIEVEMENT":
      return "🎉";
    case "WARNING":
      return "⚠️";
    default:
      return "💡";
  }
}

function getSuggestionDifficultyColor(difficulty: string) {
  switch (difficulty) {
    case "EASY":
      return "bg-green-500/20 text-green-700";
    case "MEDIUM":
      return "bg-amber-500/20 text-amber-700";
    case "HARD":
      return "bg-red-500/20 text-red-700";
    default:
      return "bg-gray-500/20 text-gray-700";
  }
}

function getPriorityColor(priority: string) {
  switch (priority) {
    case "HIGH":
      return "border-l-red-500";
    case "MEDIUM":
      return "border-l-amber-500";
    case "LOW":
      return "border-l-green-500";
    default:
      return "border-l-gray-500";
  }
}

export function InsightsPage() {
  const {
    loading,
    getInsights,
    getSuggestions,
    getAnomalies,
    getGamification,
  } = useInsights();
  const [insights, setInsights] = useState<Insight[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [gamification, setGamification] = useState<Gamification | null>(null);
  const [activeTab, setActiveTab] = useState<
    "insights" | "suggestions" | "anomalies" | "gamification"
  >("insights");
  const hasInitialized = useRef(false);

  const fetchAllData = useCallback(async () => {
    const [insightsData, suggestionsData, anomaliesData, gamificationData] =
      await Promise.all([
        getInsights(),
        getSuggestions(),
        getAnomalies(),
        getGamification(),
      ]);

    setInsights(insightsData);
    setSuggestions(suggestionsData);
    setAnomalies(anomaliesData);
    setGamification(gamificationData);
  }, [getInsights, getSuggestions, getAnomalies, getGamification]);

  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      fetchAllData();
    }
  }, [fetchAllData]);

  return (
    <div className="flex flex-col gap-8">
      {/* HEADER */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">
          💡 Insights & Suggestions
        </h1>
        <p className="text-muted-foreground">
          Smart recommendations to optimize your finances and reach your goals
          faster
        </p>
      </div>

      {/* GAMIFICATION CARD */}
      {gamification && (
        <Card className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-indigo-200 dark:border-indigo-800">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              Your Achievement Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Level Progress */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    Level {gamification.level}
                  </span>
                  <Award className="w-5 h-5 text-indigo-600" />
                </div>
                <Progress
                  value={gamification.levelProgressPercentage}
                  className="h-2"
                />
                <p className="text-xs text-muted-foreground">
                  {gamification.pointsToNextLevel} points to next level
                </p>
              </div>

              {/* Points */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Total Points</span>
                  <Zap className="w-5 h-5 text-amber-600" />
                </div>
                <p className="text-2xl font-bold">
                  ⭐ {gamification.pointsFormatted}
                </p>
              </div>

              {/* Streak */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Current Streak</span>
                  <Flame className="w-5 h-5 text-red-600" />
                </div>
                <p className="text-2xl font-bold">
                  🔥 {gamification.currentStreak}
                </p>
                <p className="text-xs text-muted-foreground">
                  {gamification.streakMessage}
                </p>
              </div>
            </div>

            {/* Badges */}
            {gamification.badges && gamification.badges.length > 0 && (
              <div className="mt-6 space-y-3">
                <p className="text-sm font-medium">Unlocked Badges</p>
                <div className="flex flex-wrap gap-2">
                  {gamification.badges.map((badge) => (
                    <div
                      key={badge.id}
                      className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-full px-3 py-2 border"
                    >
                      <span className="text-lg">{badge.icon}</span>
                      <span className="text-xs font-medium">{badge.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* TAB BUTTONS */}
      <div className="flex gap-2 border-b">
        <button
          onClick={() => setActiveTab("insights")}
          className={`pb-3 px-4 font-medium text-sm border-b-2 transition ${
            activeTab === "insights"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Lightbulb className="w-4 h-4 inline mr-2" />
          Insights ({insights.length})
        </button>
        <button
          onClick={() => setActiveTab("suggestions")}
          className={`pb-3 px-4 font-medium text-sm border-b-2 transition ${
            activeTab === "suggestions"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Sparkles className="w-4 h-4 inline mr-2" />
          Suggestions ({suggestions.length})
        </button>
        <button
          onClick={() => setActiveTab("anomalies")}
          className={`pb-3 px-4 font-medium text-sm border-b-2 transition ${
            activeTab === "anomalies"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <AlertTriangle className="w-4 h-4 inline mr-2" />
          Anomalies ({anomalies.length})
        </button>
      </div>

      {/* CONTENT */}
      <div className="space-y-4">
        {/* INSIGHTS TAB */}
        {activeTab === "insights" && (
          <>
            {insights.length > 0 ? (
              insights.map((insight) => (
                <Card
                  key={insight.id}
                  className={`border-l-4 ${getPriorityColor(insight.priority)}`}
                >
                  <CardContent className="pt-5">
                    <div className="flex items-start gap-4">
                      <div className="text-3xl">{insight.typeIcon}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{insight.title}</h3>
                          <Badge
                            className={
                              insight.priority === "HIGH"
                                ? "bg-red-500/20 text-red-700"
                                : insight.priority === "MEDIUM"
                                  ? "bg-amber-500/20 text-amber-700"
                                  : "bg-green-500/20 text-green-700"
                            }
                          >
                            {insight.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {insight.description}
                        </p>
                        <div className="mt-3 flex items-center justify-between">
                          {insight.actionable && (
                            <Button size="sm" variant="outline">
                              Take Action
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                          )}
                          <span className="text-xs text-muted-foreground">
                            <Clock className="w-3 h-3 inline mr-1" />
                            {insight.timestamp}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="text-center py-12">
                <Lightbulb className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  No insights available yet
                </p>
              </Card>
            )}
          </>
        )}

        {/* SUGGESTIONS TAB */}
        {activeTab === "suggestions" && (
          <>
            {suggestions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {suggestions.map((suggestion) => (
                  <Card
                    key={suggestion.id}
                    className="hover:shadow-lg transition-shadow"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-base">
                          {suggestion.title}
                        </CardTitle>
                        <span className="text-2xl">
                          {suggestion.impactIcon}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-muted-foreground">
                        {suggestion.description}
                      </p>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium">
                            Difficulty
                          </span>
                          <Badge
                            className={getSuggestionDifficultyColor(
                              suggestion.difficulty,
                            )}
                          >
                            {suggestion.difficulty}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium">Impact</span>
                          <Badge variant="outline">{suggestion.impact}</Badge>
                        </div>
                      </div>

                      <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-2 border border-blue-200 dark:border-blue-800">
                        <p className="text-xs text-blue-900 dark:text-blue-100">
                          <Target className="w-3 h-3 inline mr-1" />
                          {suggestion.estimatedResult}
                        </p>
                      </div>

                      <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
                        Learn More
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="text-center py-12">
                <Sparkles className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  No suggestions available yet
                </p>
              </Card>
            )}
          </>
        )}

        {/* ANOMALIES TAB */}
        {activeTab === "anomalies" && (
          <>
            {anomalies.length > 0 ? (
              <div className="space-y-4">
                {anomalies.map((anomaly) => (
                  <Card
                    key={anomaly.id}
                    className={`border-l-4 ${
                      anomaly.severity === "HIGH"
                        ? "border-l-red-500"
                        : anomaly.severity === "MEDIUM"
                          ? "border-l-amber-500"
                          : "border-l-blue-500"
                    }`}
                  >
                    <CardContent className="pt-5">
                      <div className="flex items-start gap-4">
                        <div className="text-3xl">
                          {anomaly.severity === "HIGH" ? "🚨" : "⚠️"}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">{anomaly.message}</h3>
                            <Badge
                              className={
                                anomaly.severity === "HIGH"
                                  ? "bg-red-500/20 text-red-700"
                                  : anomaly.severity === "MEDIUM"
                                    ? "bg-amber-500/20 text-amber-700"
                                    : "bg-blue-500/20 text-blue-700"
                              }
                            >
                              {anomaly.severity}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {anomaly.details}
                          </p>
                          <div className="bg-indigo-50 dark:bg-indigo-950/30 rounded-lg p-2 border border-indigo-200 dark:border-indigo-800">
                            <p className="text-xs text-indigo-900 dark:text-indigo-100">
                              💡 {anomaly.suggestedAction}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="text-center py-12">
                <AlertTriangle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  No anomalies detected! Great job! 🎉
                </p>
              </Card>
            )}
          </>
        )}
      </div>

      {/* EMPTY STATE */}
      {!insights.length && !suggestions.length && !anomalies.length && (
        <Card className="text-center py-16">
          <Sparkles className="w-16 h-16 mx-auto text-muted-foreground mb-4 opacity-50" />
          <h3 className="text-xl font-semibold mb-2">No Data Available Yet</h3>
          <p className="text-muted-foreground mb-6">
            Start by creating budgets and transactions to get personalized
            insights
          </p>
          <Button className="bg-indigo-600 hover:bg-indigo-700">
            Create Your First Budget
          </Button>
        </Card>
      )}
    </div>
  );
}
