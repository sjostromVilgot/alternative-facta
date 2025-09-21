"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Heart,
  Share2,
  Flame,
  Trophy,
  Star,
  Zap,
  Target,
  Users,
  TrendingUp,
  Gift,
  Crown,
  Sparkles,
  ArrowLeft,
  Check,
  X,
} from "lucide-react"

const quizQuestions = [
  {
    id: 1,
    question: "Vad färgar flamingos rosa?",
    options: ["Sol", "Gener", "Karotenoider", "Mineraler"],
    correct: 2,
    category: "🦩 Djur",
    explanation: "Karotenoider från räkor och alger ger flamingos deras rosa färg!",
  },
  {
    id: 2,
    question: "Hur många hjärtan har en bläckfisk?",
    options: ["1", "2", "3", "4"],
    correct: 2,
    category: "🐙 Djur",
    explanation: "Bläckfiskar har tre hjärtan - två för gälarna och ett för kroppen!",
  },
  {
    id: 3,
    question: "Vad händer med honung över tid?",
    options: ["Blir surt", "Förstörs aldrig", "Blir giftigt", "Förlorar smak"],
    correct: 1,
    category: "🍯 Mat",
    explanation: "Honung har så låg vattenhalt att bakterier inte kan överleva!",
  },
]

type Screen = "home" | "quiz" | "favorites" | "profile" | "challenge" | "goals"

export default function FactaEnhanced() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("home")
  const [currentFact, setCurrentFact] = useState(0)
  const [streak, setStreak] = useState(7)
  const [xp, setXp] = useState(1250)
  const [level, setLevel] = useState(5)
  const [showReward, setShowReward] = useState(false)
  const [savedFacts, setSavedFacts] = useState<number[]>([])
  const [quizStreak, setQuizStreak] = useState(3)

  const [currentQuiz, setCurrentQuiz] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showQuizResult, setShowQuizResult] = useState(false)
  const [quizScore, setQuizScore] = useState(0)
  const [dailyGoals, setDailyGoals] = useState({ facts: 2, quiz: 1, streak: 1 })

  const facts = [
    {
      id: 1,
      category: "🍯 Mat",
      title: "Honung förstörs aldrig",
      content:
        "Arkeologer har hittat krukor med honung från forntiden som fortfarande är ätbar. Honungens låga vattenhalt och sura pH gör det omöjligt för bakterier att överleva.",
      difficulty: "Lätt",
      xpReward: 50,
    },
    {
      id: 2,
      category: "🐙 Djur",
      title: "Bläckfiskar har tre hjärtan",
      content:
        "Två pumpar blod till gälarna och ett till resten av kroppen. Det huvudsakliga hjärtat slutar slå när de simmar, vilket är varför de föredrar att krypa.",
      difficulty: "Medium",
      xpReward: 75,
    },
    {
      id: 3,
      category: "🌌 Rymden",
      title: "En dag på Venus är längre än ett år",
      content:
        "Venus roterar så långsamt att det tar 243 jorddagar att rotera en gång, men bara 225 jorddagar att kretsa runt solen.",
      difficulty: "Svår",
      xpReward: 100,
    },
  ]

  const achievements = [
    { name: "Första fakta", icon: "📖", unlocked: true, description: "Läs din första fakta" },
    { name: "Streak-mästare", icon: "🔥", unlocked: streak >= 7, description: "7 dagars streak" },
    { name: "Kunskapssökare", icon: "🎯", unlocked: xp >= 1000, description: "Samla 1000 XP" },
    { name: "Quiz-champion", icon: "🏆", unlocked: quizStreak >= 3, description: "3 quiz i rad" },
  ]

  const handleQuizAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex)
    setShowQuizResult(true)

    if (answerIndex === quizQuestions[currentQuiz].correct) {
      setQuizScore((prev) => prev + 1)
      setXp((prev) => prev + 100)
      setShowReward(true)
      setTimeout(() => setShowReward(false), 2000)
    }

    setTimeout(() => {
      if (currentQuiz < quizQuestions.length - 1) {
        setCurrentQuiz((prev) => prev + 1)
        setSelectedAnswer(null)
        setShowQuizResult(false)
      } else {
        // Quiz completed
        setQuizStreak((prev) => prev + 1)
        setCurrentScreen("home")
        setCurrentQuiz(0)
        setSelectedAnswer(null)
        setShowQuizResult(false)
      }
    }, 2000)
  }

  const handleSaveFact = (factId: number) => {
    if (!savedFacts.includes(factId)) {
      setSavedFacts([...savedFacts, factId])
      setXp((prev) => prev + facts[currentFact].xpReward)
      setShowReward(true)
      setTimeout(() => setShowReward(false), 2000)
    }
  }

  const nextFact = () => {
    setCurrentFact((prev) => (prev + 1) % facts.length)
  }

  const currentFactData = facts[currentFact]
  const progressToNextLevel = ((xp % 500) / 500) * 100

  const renderScreen = () => {
    switch (currentScreen) {
      case "quiz":
        return renderQuizScreen()
      case "favorites":
        return renderFavoritesScreen()
      case "profile":
        return renderProfileScreen()
      case "challenge":
        return renderChallengeScreen()
      case "goals":
        return renderGoalsScreen()
      default:
        return renderHomeScreen()
    }
  }

  const renderQuizScreen = () => {
    const question = quizQuestions[currentQuiz]

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentScreen("home")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Tillbaka
          </Button>
          <Badge variant="outline">
            Fråga {currentQuiz + 1} av {quizQuestions.length}
          </Badge>
        </div>

        <Card className="p-6 bg-gradient-to-br from-primary/10 to-accent/10">
          <Badge variant="secondary" className="mb-4">
            {question.category}
          </Badge>
          <h2 className="text-xl font-bold mb-6">{question.question}</h2>

          <div className="space-y-3">
            {question.options.map((option, index) => (
              <Button
                key={index}
                variant={
                  showQuizResult
                    ? index === question.correct
                      ? "default"
                      : index === selectedAnswer
                        ? "destructive"
                        : "outline"
                    : "outline"
                }
                className="w-full justify-start text-left h-auto p-4"
                onClick={() => !showQuizResult && handleQuizAnswer(index)}
                disabled={showQuizResult}
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-bold">
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span>{option}</span>
                  {showQuizResult && index === question.correct && <Check className="w-5 h-5 ml-auto text-green-500" />}
                  {showQuizResult && index === selectedAnswer && index !== question.correct && (
                    <X className="w-5 h-5 ml-auto text-red-500" />
                  )}
                </div>
              </Button>
            ))}
          </div>

          {showQuizResult && (
            <div className="mt-6 p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">{question.explanation}</p>
            </div>
          )}
        </Card>
      </div>
    )
  }

  const renderFavoritesScreen = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Sparade fakta</h2>
        <Badge variant="outline">{savedFacts.length} sparade</Badge>
      </div>

      {savedFacts.length === 0 ? (
        <Card className="p-8 text-center">
          <Heart className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="font-semibold mb-2">Inga sparade fakta än</h3>
          <p className="text-muted-foreground mb-4">Börja spara intressanta fakta för att komma åt dem senare</p>
          <Button onClick={() => setCurrentScreen("home")}>Utforska fakta</Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {savedFacts.map((factId) => {
            const fact = facts.find((f) => f.id === factId)
            if (!fact) return null

            return (
              <Card key={factId} className="p-4">
                <Badge variant="secondary" className="mb-2">
                  {fact.category}
                </Badge>
                <h3 className="font-semibold mb-2">{fact.title}</h3>
                <p className="text-sm text-muted-foreground">{fact.content}</p>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )

  const renderProfileScreen = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl font-bold text-white">G</span>
        </div>
        <h2 className="text-2xl font-bold">Gäst</h2>
        <p className="text-muted-foreground">
          Level {level} • {xp} XP
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4 text-center">
          <Flame className="w-8 h-8 mx-auto mb-2 text-orange-500" />
          <div className="text-2xl font-bold">{streak}</div>
          <div className="text-sm text-muted-foreground">Dagars streak</div>
        </Card>

        <Card className="p-4 text-center">
          <Star className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
          <div className="text-2xl font-bold">{savedFacts.length}</div>
          <div className="text-sm text-muted-foreground">Fakta sparade</div>
        </Card>

        <Card className="p-4 text-center">
          <Zap className="w-8 h-8 mx-auto mb-2 text-blue-500" />
          <div className="text-2xl font-bold">{quizScore}%</div>
          <div className="text-sm text-muted-foreground">Quiz-snitt</div>
        </Card>

        <Card className="p-4 text-center">
          <Trophy className="w-8 h-8 mx-auto mb-2 text-purple-500" />
          <div className="text-2xl font-bold">{achievements.filter((a) => a.unlocked).length}</div>
          <div className="text-sm text-muted-foreground">Badges</div>
        </Card>
      </div>

      <Card className="p-4">
        <h3 className="font-semibold mb-4">Prestationer</h3>
        <div className="space-y-3">
          {achievements.map((achievement, index) => (
            <div key={index} className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  achievement.unlocked ? "bg-primary/20" : "bg-muted"
                }`}
              >
                <span className="text-lg">{achievement.icon}</span>
              </div>
              <div className="flex-1">
                <div className="font-medium">{achievement.name}</div>
                <div className="text-sm text-muted-foreground">{achievement.description}</div>
              </div>
              {achievement.unlocked && <Check className="w-5 h-5 text-green-500" />}
            </div>
          ))}
        </div>
      </Card>
    </div>
  )

  const renderChallengeScreen = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Users className="w-16 h-16 mx-auto mb-4 text-accent" />
        <h2 className="text-2xl font-bold">Utmana en vän</h2>
        <p className="text-muted-foreground">Skicka en quiz-utmaning och se vem som vet mest!</p>
      </div>

      <Card className="p-6">
        <h3 className="font-semibold mb-4">Välj quiz-typ</h3>
        <div className="space-y-3">
          <Button variant="outline" className="w-full justify-start bg-transparent">
            <Zap className="w-5 h-5 mr-3" />
            Snabb quiz (5 frågor)
          </Button>
          <Button variant="outline" className="w-full justify-start bg-transparent">
            <Target className="w-5 h-5 mr-3" />
            Kategori-utmaning
          </Button>
          <Button variant="outline" className="w-full justify-start bg-transparent">
            <Crown className="w-5 h-5 mr-3" />
            Mästar-quiz (10 frågor)
          </Button>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="font-semibold mb-4">Aktiva utmaningar</h3>
        <div className="text-center py-8">
          <p className="text-muted-foreground">Inga aktiva utmaningar</p>
          <Button className="mt-4">Skapa första utmaningen</Button>
        </div>
      </Card>
    </div>
  )

  const renderGoalsScreen = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Target className="w-16 h-16 mx-auto mb-4 text-success" />
        <h2 className="text-2xl font-bold">Dagens mål</h2>
        <p className="text-muted-foreground">Slutför dina dagliga mål för extra XP!</p>
      </div>

      <div className="space-y-4">
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium">Läs fakta</span>
            <Badge variant={dailyGoals.facts >= 3 ? "default" : "outline"}>{dailyGoals.facts}/3</Badge>
          </div>
          <Progress value={(dailyGoals.facts / 3) * 100} className="mb-2" />
          <p className="text-sm text-muted-foreground">+50 XP när du är klar</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium">Genomför quiz</span>
            <Badge variant={dailyGoals.quiz >= 1 ? "default" : "outline"}>{dailyGoals.quiz}/1</Badge>
          </div>
          <Progress value={(dailyGoals.quiz / 1) * 100} className="mb-2" />
          <p className="text-sm text-muted-foreground">+100 XP när du är klar</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium">Behåll streak</span>
            <Badge variant={dailyGoals.streak >= 1 ? "default" : "outline"}>{dailyGoals.streak}/1</Badge>
          </div>
          <Progress value={(dailyGoals.streak / 1) * 100} className="mb-2" />
          <p className="text-sm text-muted-foreground">+25 XP när du är klar</p>
        </Card>
      </div>

      <Button className="w-full" onClick={() => setCurrentScreen("home")}>
        Börja med dagens mål
      </Button>
    </div>
  )

  const renderHomeScreen = () => (
    <div className="space-y-6">
      {/* Today's Fact Card - Enhanced */}
      <Card className="p-6 bg-gradient-to-br from-card to-card/50 border-2 border-primary/20 glow slide-up">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="text-xs font-medium">
              {currentFactData.category}
            </Badge>
            <Badge
              variant={
                currentFactData.difficulty === "Lätt"
                  ? "default"
                  : currentFactData.difficulty === "Medium"
                    ? "secondary"
                    : "destructive"
              }
              className="text-xs"
            >
              {currentFactData.difficulty}
            </Badge>
          </div>

          <h2 className="text-xl font-bold text-balance leading-tight">{currentFactData.title}</h2>

          <p className="text-muted-foreground leading-relaxed">{currentFactData.content}</p>

          <div className="flex items-center gap-3 pt-2">
            <Button
              onClick={() => handleSaveFact(currentFactData.id)}
              variant={savedFacts.includes(currentFactData.id) ? "default" : "outline"}
              size="sm"
              className="flex items-center gap-2 transition-all duration-200 hover:scale-105"
            >
              <Heart className={`w-4 h-4 ${savedFacts.includes(currentFactData.id) ? "fill-current" : ""}`} />
              {savedFacts.includes(currentFactData.id) ? "Sparad" : "Spara"}
            </Button>

            <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
              <Share2 className="w-4 h-4" />
              Dela
            </Button>

            <div className="ml-auto flex items-center gap-1 text-sm text-accent font-medium">
              <Star className="w-4 h-4" />+{currentFactData.xpReward}
            </div>
          </div>
        </div>
      </Card>

      {/* Quick Actions - Now clickable */}
      <div className="grid grid-cols-3 gap-3">
        <Card
          className="p-4 text-center hover:scale-105 transition-transform cursor-pointer bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20"
          onClick={() => setCurrentScreen("quiz")}
        >
          <Zap className="w-6 h-6 mx-auto mb-2 text-primary" />
          <div className="text-sm font-medium">Snabb Quiz</div>
          <div className="text-xs text-muted-foreground">2 min</div>
        </Card>

        <Card
          className="p-4 text-center hover:scale-105 transition-transform cursor-pointer bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20"
          onClick={() => setCurrentScreen("challenge")}
        >
          <Users className="w-6 h-6 mx-auto mb-2 text-accent" />
          <div className="text-sm font-medium">Utmana vän</div>
          <div className="text-xs text-muted-foreground">Ny!</div>
        </Card>

        <Card
          className="p-4 text-center hover:scale-105 transition-transform cursor-pointer bg-gradient-to-br from-success/10 to-success/5 border-success/20"
          onClick={() => setCurrentScreen("goals")}
        >
          <Target className="w-6 h-6 mx-auto mb-2 text-success" />
          <div className="text-sm font-medium">Dagsmål</div>
          <div className="text-xs text-muted-foreground">2/3</div>
        </Card>
      </div>

      {/* Achievements Section - Enhanced */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold flex items-center gap-2">
            <Trophy className="w-5 h-5 text-warning" />
            Prestationer
          </h3>
          <Badge variant="outline" className="text-xs">
            {achievements.filter((a) => a.unlocked).length}/{achievements.length}
          </Badge>
        </div>

        <div className="grid grid-cols-4 gap-3">
          {achievements.map((achievement, index) => (
            <div
              key={index}
              className={`text-center p-3 rounded-lg transition-all duration-200 cursor-pointer hover:scale-105 ${
                achievement.unlocked ? "bg-primary/10 border border-primary/20 glow" : "bg-muted/50 opacity-50"
              }`}
              onClick={() => setCurrentScreen("profile")}
            >
              <div className="text-2xl mb-1">{achievement.icon}</div>
              <div className="text-xs font-medium">{achievement.name}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Social Leaderboard - Now clickable */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-info" />
            Veckans topplista
          </h3>
          <Button variant="outline" size="sm">
            Se alla
          </Button>
        </div>

        <div className="space-y-3">
          {[
            { name: "Du", xp: 1250, rank: 3, isUser: true },
            { name: "Anna", xp: 1340, rank: 2 },
            { name: "Erik", xp: 1580, rank: 1 },
          ]
            .sort((a, b) => b.xp - a.xp)
            .map((user, index) => (
              <div
                key={index}
                className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors ${
                  user.isUser ? "bg-primary/10 border border-primary/20" : "bg-muted/30"
                }`}
                onClick={() => setCurrentScreen("challenge")}
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-warning to-warning/70 text-black font-bold text-sm">
                  {user.rank === 1 ? <Crown className="w-4 h-4" /> : user.rank}
                </div>
                <div className="flex-1">
                  <div className="font-medium">{user.name}</div>
                  <div className="text-xs text-muted-foreground">{user.xp} XP</div>
                </div>
                {user.isUser && (
                  <Badge variant="outline" className="text-xs">
                    Du
                  </Badge>
                )}
              </div>
            ))}
        </div>
      </Card>

      {/* Next Fact Button */}
      <Button
        onClick={nextFact}
        className="w-full py-6 text-lg font-semibold bg-gradient-to-r from-primary to-accent hover:scale-105 transition-all duration-200"
      >
        <Gift className="w-5 h-5 mr-2" />
        Nästa fascinerade fakta
      </Button>
    </div>
  )

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header with enhanced stats */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Sparkles className="w-5 h-5 text-accent" />
                <span className="font-bold text-lg">Facta</span>
              </div>
              <Badge className="bg-accent text-accent-foreground font-semibold px-3 py-1">PREMIUM</Badge>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Flame className={`w-5 h-5 ${streak >= 7 ? "text-streak streak-glow" : "text-muted-foreground"}`} />
                <span className="font-bold text-sm">{streak}</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 text-warning" />
                <span className="font-bold text-sm">{xp}</span>
              </div>
            </div>
          </div>

          {/* XP Progress Bar */}
          <div className="mt-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
              <span>Level {level}</span>
              <span>{xp % 500}/500 XP</span>
            </div>
            <Progress value={progressToNextLevel} className="h-2" />
          </div>
        </div>
      </div>

      {/* Reward Animation */}
      {showReward && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="bounce-in bg-reward text-black px-6 py-3 rounded-full font-bold text-lg shadow-lg">
            +{currentScreen === "quiz" ? "100" : currentFactData.xpReward} XP! 🎉
          </div>
        </div>
      )}

      <div className="max-w-md mx-auto px-4 py-6">{renderScreen()}</div>

      {/* Bottom Navigation - Now functional */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/90 backdrop-blur-lg border-t border-border">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center justify-around">
            {[
              { icon: Sparkles, label: "Hem", screen: "home" as Screen, badge: null },
              { icon: Zap, label: "Quiz", screen: "quiz" as Screen, badge: "3" },
              { icon: Heart, label: "Favoriter", screen: "favorites" as Screen, badge: savedFacts.length.toString() },
              { icon: Trophy, label: "Profil", screen: "profile" as Screen, badge: null },
            ].map((item, index) => (
              <button
                key={index}
                onClick={() => setCurrentScreen(item.screen)}
                className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all duration-200 ${
                  currentScreen === item.screen
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <div className="relative">
                  <item.icon className="w-5 h-5" />
                  {item.badge && Number.parseInt(item.badge) > 0 && (
                    <Badge className="absolute -top-2 -right-2 w-5 h-5 p-0 text-xs flex items-center justify-center bg-accent">
                      {item.badge}
                    </Badge>
                  )}
                </div>
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Spacing for fixed bottom nav */}
      <div className="h-20"></div>
    </div>
  )
}
