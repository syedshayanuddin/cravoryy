import React, { useState, useEffect } from "react";
import {
  Search,
  Clock,
  Heart,
  Shuffle,
  ChefHat,
  Star,
  BookOpen,
  Filter,
  X,
  Play,
  Globe,
  Tag,
  Users,
  Timer,
} from "lucide-react";

interface Meal {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCategory?: string;
  strArea?: string;
  strInstructions?: string;
  strYoutube?: string;
  strIngredient1?: string;
  strIngredient2?: string;
  strIngredient3?: string;
  strIngredient4?: string;
  strIngredient5?: string;
  strIngredient6?: string;
  strIngredient7?: string;
  strIngredient8?: string;
  strIngredient9?: string;
  strIngredient10?: string;
  strMeasure1?: string;
  strMeasure2?: string;
  strMeasure3?: string;
  strMeasure4?: string;
  strMeasure5?: string;
  strMeasure6?: string;
  strMeasure7?: string;
  strMeasure8?: string;
  strMeasure9?: string;
  strMeasure10?: string;
}

interface MoodOption {
  name: string;
  ingredients: string[];
  icon: string;
  color: string;
  gradient: string;
}

const App: React.FC = () => {
  const [recipes, setRecipes] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(false);
  const [ingredient, setIngredient] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedMood, setSelectedMood] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("ingredient");
  const [randomMeal, setRandomMeal] = useState<Meal | null>(null);
  const [error, setError] = useState("");
  const [searchResults, setSearchResults] = useState<{ [key: string]: Meal[] }>(
    {
      ingredient: [],
      mood: [],
      random: [],
    }
  );
  const [hasSearched, setHasSearched] = useState<{ [key: string]: boolean }>({
    ingredient: false,
    mood: false,
    random: false,
  });
  const [showModal, setShowModal] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Meal | null>(null);
  const [isLanding, setIsLanding] = useState(true);

  const moodOptions: MoodOption[] = [
    {
      name: "Comfort Food",
      ingredients: ["chicken", "pasta", "cheese"],
      icon: "🍲",
      color: "text-orange-700",
      gradient: "from-orange-400 to-amber-500",
    },
    {
      name: "Healthy & Fresh",
      ingredients: ["salmon", "avocado", "spinach"],
      icon: "🥗",
      color: "text-green-700",
      gradient: "from-green-400 to-emerald-500",
    },
    {
      name: "Spicy Adventure",
      ingredients: ["chili", "curry", "pepper"],
      icon: "🌶️",
      color: "text-red-700",
      gradient: "from-red-400 to-rose-500",
    },
    {
      name: "Sweet Treats",
      ingredients: ["chocolate", "vanilla", "strawberry"],
      icon: "🍰",
      color: "text-pink-700",
      gradient: "from-pink-400 to-rose-500",
    },
    {
      name: "International",
      ingredients: ["beef", "rice", "tomato"],
      icon: "🌍",
      color: "text-blue-700",
      gradient: "from-blue-400 to-indigo-500",
    },
    {
      name: "Light & Quick",
      ingredients: ["egg", "bread", "lettuce"],
      icon: "⚡",
      color: "text-yellow-700",
      gradient: "from-yellow-400 to-amber-500",
    },
  ];

  const timeOptions = [
    { value: "15", label: "15 minutes - Quick bites" },
    { value: "30", label: "30 minutes - Balanced meal" },
    { value: "60", label: "1 hour - Elaborate cooking" },
    { value: "any", label: "Any time - I have all day!" },
  ];

  useEffect(() => {
    // Pan animation effect
    const interval = setInterval(() => {
      const pan = document.getElementById("animated-pan");
      if (pan) {
        pan.style.transform = `rotate(${Math.sin(Date.now() / 1000) * 10}deg)`;
      }
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const searchByIngredient = async (searchIngredient: string) => {
    if (!searchIngredient.trim()) return;

    setLoading(true);
    setError("");
    setIsLanding(false);

    try {
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchIngredient}`
      );
      const data = await response.json();

      if (data.meals) {
        const detailedMeals = await Promise.all(
          data.meals.slice(0, 12).map(async (meal: Meal) => {
            try {
              const detailResponse = await fetch(
                `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`
              );
              const detailData = await detailResponse.json();
              return detailData.meals ? detailData.meals[0] : meal;
            } catch {
              return meal;
            }
          })
        );
        setSearchResults((prev) => ({ ...prev, ingredient: detailedMeals }));
        setHasSearched((prev) => ({ ...prev, ingredient: true }));
        setRecipes(detailedMeals);
      } else {
        setSearchResults((prev) => ({ ...prev, ingredient: [] }));
        setHasSearched((prev) => ({ ...prev, ingredient: true }));
        setRecipes([]);
        setError("No recipes found for this ingredient. Try something else!");
      }
    } catch (error) {
      setError("Failed to fetch recipes. Please try again.");
      setSearchResults((prev) => ({ ...prev, ingredient: [] }));
      setHasSearched((prev) => ({ ...prev, ingredient: true }));
      setRecipes([]);
    }
    setLoading(false);
  };

  const searchByMood = async (mood: MoodOption) => {
    const randomIngredient =
      mood.ingredients[Math.floor(Math.random() * mood.ingredients.length)];
    setLoading(true);
    setError("");
    setIsLanding(false);

    try {
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/filter.php?i=${randomIngredient}`
      );
      const data = await response.json();

      if (data.meals) {
        const detailedMeals = await Promise.all(
          data.meals.slice(0, 12).map(async (meal: Meal) => {
            try {
              const detailResponse = await fetch(
                `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`
              );
              const detailData = await detailResponse.json();
              return detailData.meals ? detailData.meals[0] : meal;
            } catch {
              return meal;
            }
          })
        );
        setSearchResults((prev) => ({ ...prev, mood: detailedMeals }));
        setHasSearched((prev) => ({ ...prev, mood: true }));
        setRecipes(detailedMeals);
        setSelectedMood(mood.name);
      } else {
        setSearchResults((prev) => ({ ...prev, mood: [] }));
        setHasSearched((prev) => ({ ...prev, mood: true }));
        setRecipes([]);
        setSelectedMood(mood.name);
        setError("No recipes found for this mood. Try another one!");
      }
    } catch (error) {
      setError("Failed to fetch recipes. Please try again.");
      setSearchResults((prev) => ({ ...prev, mood: [] }));
      setHasSearched((prev) => ({ ...prev, mood: true }));
      setRecipes([]);
      setSelectedMood(mood.name);
    }
    setLoading(false);
  };

  const getRandomMeal = async () => {
    setLoading(true);
    setError("");
    setIsLanding(false);

    try {
      const response = await fetch(
        "https://www.themealdb.com/api/json/v1/1/random.php"
      );
      const data = await response.json();
      if (data.meals && data.meals[0]) {
        setRandomMeal(data.meals[0]);
        const randomMealArray = [data.meals[0]];
        setSearchResults((prev) => ({ ...prev, random: randomMealArray }));
        setHasSearched((prev) => ({ ...prev, random: true }));
        setRecipes(randomMealArray);
      }
    } catch (error) {
      setError("Failed to get random recipe. Please try again.");
      setSearchResults((prev) => ({ ...prev, random: [] }));
      setHasSearched((prev) => ({ ...prev, random: true }));
      setRecipes([]);
    }
    setLoading(false);
  };

  const toggleFavorite = (mealId: string) => {
    setFavorites((prev) =>
      prev.includes(mealId)
        ? prev.filter((id) => id !== mealId)
        : [...prev, mealId]
    );
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setError("");

    if (hasSearched[tabId as keyof typeof hasSearched]) {
      setRecipes(searchResults[tabId as keyof typeof searchResults]);
    } else {
      setRecipes([]);
    }

    if (tabId !== "mood") {
      setSelectedMood("");
    }
  };

  const filterByTime = (meals: Meal[]) => {
    if (!selectedTime || selectedTime === "any") return meals;

    const timeLimit = parseInt(selectedTime);
    return meals.filter((meal) => {
      if (!meal.strInstructions) return true;
      const instructionLength = meal.strInstructions.length;
      const estimatedTime = Math.min(instructionLength / 20, 120);
      return estimatedTime <= timeLimit;
    });
  };

  const handleSearch = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.preventDefault();
    if (activeTab === "ingredient") {
      searchByIngredient(ingredient);
    }
  };

  const handleFullRecipe = (meal: Meal) => {
    setSelectedRecipe(meal);
    setShowModal(true);
  };

  const getIngredients = (meal: Meal) => {
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}` as keyof Meal];
      const measure = meal[`strMeasure${i}` as keyof Meal];
      if (ingredient && ingredient.trim()) {
        ingredients.push({ ingredient, measure });
      }
    }
    return ingredients;
  };

  const displayedRecipes = filterByTime(recipes);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div
          className="absolute top-40 right-10 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-20 left-1/2 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      {/* Header */}
      <div
        className={`backdrop-blur-md bg-white/10 border-b border-white/20 transition-all duration-700 ${
          isLanding
            ? "opacity-0 -translate-y-full"
            : "opacity-100 translate-y-0"
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 shadow-lg">
                <ChefHat className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-white">Cravory</h1>
            </div>

            {/* Modern Tab Navigation */}
            <div className="flex gap-1 p-1 bg-white/10 rounded-full backdrop-blur-sm">
              {[
                { id: "ingredient", label: "Ingredient", icon: Search },
                { id: "mood", label: "Mood", icon: Heart },
                { id: "random", label: "Random", icon: Shuffle },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
                      activeTab === tab.id
                        ? "bg-white text-gray-900 shadow-lg scale-105"
                        : "text-white/80 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Landing Section */}
      {isLanding && (
        <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
          <div className="text-center max-w-4xl mx-auto">
            {/* Animated Pan */}
            <div className="mb-8 relative">
              <div
                id="animated-pan"
                className="text-8xl mb-4 inline-block transform transition-transform duration-100"
                style={{ transformOrigin: "center bottom" }}
              >
                🍳
              </div>
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="flex space-x-1">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce opacity-60"
                      style={{ animationDelay: `${i * 0.2}s` }}
                    ></div>
                  ))}
                </div>
              </div>
            </div>

            <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
              Cravory
            </h1>
            <p className="text-xl md:text-2xl text-white/80 mb-12 leading-relaxed">
              Discover amazing recipes based on what you have,
              <br />
              how you feel, or let us surprise you!
            </p>

            {/* Centered Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur opacity-25 group-hover:opacity-75 transition duration-300"></div>
                <div className="relative flex items-center bg-white/10 backdrop-blur-md rounded-full p-2 border border-white/20">
                  <Search className="w-6 h-6 text-white/60 ml-4" />
                  <input
                    type="text"
                    value={ingredient}
                    onChange={(e) => setIngredient(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSearch(e)}
                    placeholder="What ingredients do you have? (e.g., chicken, pasta, tomato)"
                    className="flex-1 px-6 py-4 bg-transparent text-white placeholder-white/50 border-none outline-none text-lg"
                  />
                  <button
                    onClick={handleSearch}
                    disabled={loading || !ingredient.trim()}
                    className="mr-2 px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-semibold"
                  >
                    Search
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-16 flex flex-wrap justify-center gap-4">
              <button
                onClick={() => {
                  setActiveTab("mood");
                  setIsLanding(false);
                }}
                className="group px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full text-white/80 hover:text-white hover:bg-white/20 transition-all duration-300 border border-white/20"
              >
                <Heart className="w-5 h-5 inline mr-2 group-hover:text-pink-400 transition-colors" />
                Browse by Mood
              </button>
              <button
                onClick={getRandomMeal}
                className="group px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full text-white/80 hover:text-white hover:bg-white/20 transition-all duration-300 border border-white/20"
              >
                <Shuffle className="w-5 h-5 inline mr-2 group-hover:text-purple-400 transition-colors" />
                Surprise Me!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      {!isLanding && (
        <div className="relative z-10 max-w-6xl mx-auto px-4 py-6">
          {/* Search Section */}
          <div className="backdrop-blur-md bg-white/10 rounded-2xl border border-white/20 p-6 mb-6 shadow-2xl">
            {activeTab === "ingredient" && (
              <div>
                <h2 className="text-lg font-semibold text-white mb-4">
                  What's in your kitchen?
                </h2>
                <div className="flex gap-3 mb-4">
                  <div className="flex-1 relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg blur opacity-25 group-focus-within:opacity-75 transition duration-300"></div>
                    <div className="relative">
                      <Search className="w-5 h-5 text-white/60 absolute left-3 top-1/2 transform -translate-y-1/2" />
                      <input
                        type="text"
                        value={ingredient}
                        onChange={(e) => setIngredient(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleSearch(e)}
                        placeholder="Enter an ingredient (e.g., chicken, pasta, tomato)"
                        className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-sm text-white placeholder-white/50 border border-white/20 rounded-lg focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 outline-none"
                      />
                    </div>
                  </div>
                  <button
                    onClick={handleSearch}
                    disabled={loading || !ingredient.trim()}
                    className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-semibold"
                  >
                    Search
                  </button>
                </div>
              </div>
            )}

            {activeTab === "mood" && (
              <div>
                <h2 className="text-lg font-semibold text-white mb-4">
                  What are you in the mood for?
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {moodOptions.map((mood) => (
                    <button
                      key={mood.name}
                      onClick={() => searchByMood(mood)}
                      disabled={loading}
                      className="group relative overflow-hidden p-6 rounded-xl border border-white/20 hover:border-white/40 transition-all duration-300 disabled:opacity-50 bg-white/5 backdrop-blur-sm hover:bg-white/10"
                    >
                      <div
                        className={`absolute inset-0 bg-gradient-to-r ${mood.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                      ></div>
                      <div className="relative flex items-center gap-4">
                        <span className="text-3xl">{mood.icon}</span>
                        <div className="text-left">
                          <div
                            className={`font-semibold text-white group-hover:${mood.color} transition-colors`}
                          >
                            {mood.name}
                          </div>
                          <div className="text-sm text-white/60">
                            {mood.ingredients.join(", ")}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "random" && (
              <div className="text-center">
                <h2 className="text-lg font-semibold text-white mb-4">
                  Feeling indecisive?
                </h2>
                <p className="text-white/80 mb-6">
                  Let us pick something amazing for you!
                </p>
                <button
                  onClick={getRandomMeal}
                  disabled={loading}
                  className="group px-8 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white rounded-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
                >
                  <Shuffle className="w-5 h-5 inline mr-2 group-hover:rotate-12 transition-transform duration-300" />
                  <span className="font-semibold">Surprise Me!</span>
                </button>
              </div>
            )}

            {/* Time Filter */}
            {recipes.length > 0 &&
              hasSearched[activeTab as keyof typeof hasSearched] && (
                <div className="mt-6 pt-6 border-t border-white/20">
                  <div className="flex items-center gap-4">
                    <Clock className="w-5 h-5 text-white/60" />
                    <span className="text-sm font-medium text-white/80">
                      Time available:
                    </span>
                    <select
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      className="px-3 py-2 bg-white/10 backdrop-blur-sm text-white border border-white/20 rounded-lg focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 outline-none"
                    >
                      <option value="" className="bg-gray-800">
                        Any time
                      </option>
                      {timeOptions.map((option) => (
                        <option
                          key={option.value}
                          value={option.value}
                          className="bg-gray-800"
                        >
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="relative">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
                <div className="absolute inset-0 inline-block animate-ping rounded-full h-12 w-12 border border-purple-400 opacity-20"></div>
              </div>
              <p className="mt-4 text-white/80 font-medium">
                Finding delicious recipes for you...
              </p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="backdrop-blur-md bg-red-500/20 border border-red-400/30 rounded-xl p-4 mb-6">
              <p className="text-red-200">{error}</p>
            </div>
          )}

          {/* Results */}
          {!loading &&
            displayedRecipes.length > 0 &&
            hasSearched[activeTab as keyof typeof hasSearched] && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">
                    {activeTab === "random"
                      ? "Your Random Pick"
                      : selectedMood
                      ? `${selectedMood} Recipes`
                      : `Recipes with "${ingredient}"`}
                  </h2>
                  <span className="text-sm text-white/60 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full">
                    {displayedRecipes.length} recipe
                    {displayedRecipes.length !== 1 ? "s" : ""}
                    {selectedTime &&
                      selectedTime !== "any" &&
                      ` (≤${selectedTime} min)`}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {displayedRecipes.map((meal) => (
                    <div key={meal.idMeal} className="group relative">
                      {/* Card Glow Effect */}
                      <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/50 via-pink-500/50 to-orange-500/50 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-all duration-500"></div>

                      <div className="relative backdrop-blur-md bg-white/10 rounded-2xl border border-white/20 overflow-hidden hover:bg-white/15 transition-all duration-300 shadow-xl group-hover:shadow-2xl group-hover:scale-[1.02]">
                        <div className="relative overflow-hidden">
                          <img
                            src={meal.strMealThumb}
                            alt={meal.strMeal}
                            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          {/* Overlay Gradient */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                          {/* Favorite Button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(meal.idMeal);
                            }}
                            className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-all duration-300 ${
                              favorites.includes(meal.idMeal)
                                ? "bg-red-500 text-white scale-110"
                                : "bg-white/20 text-white hover:bg-red-500 hover:scale-110"
                            }`}
                          >
                            <Star
                              className={`w-4 h-4 ${
                                favorites.includes(meal.idMeal)
                                  ? "fill-current"
                                  : ""
                              }`}
                            />
                          </button>

                          {/* Quick Action Buttons */}
                          <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                            <div className="flex gap-2">
                              {meal.strYoutube && (
                                <a
                                  href={meal.strYoutube}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex-1 flex items-center justify-center px-3 py-2 bg-red-600/90 backdrop-blur-sm text-white text-sm rounded-lg hover:bg-red-500 transition-colors"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <Play className="w-4 h-4 mr-1" />
                                  Video
                                </a>
                              )}
                              <button
                                onClick={() => handleFullRecipe(meal)}
                                className="flex-1 flex items-center justify-center px-3 py-2 bg-purple-600/90 backdrop-blur-sm text-white text-sm rounded-lg hover:bg-purple-500 transition-colors"
                              >
                                <BookOpen className="w-4 h-4 mr-1" />
                                Recipe
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="p-4">
                          <h3 className="font-bold text-white mb-2 line-clamp-2 group-hover:text-purple-200 transition-colors">
                            {meal.strMeal}
                          </h3>

                          {/* Badges */}
                          <div className="flex items-center gap-2 mb-3 flex-wrap">
                            {meal.strCategory && (
                              <span className="px-2 py-1 bg-white/10 text-white text-xs rounded-full">
                                {meal.strCategory}
                              </span>
                            )}
                            {meal.strArea && (
                              <span className="px-2 py-1 bg-white/10 text-white text-xs rounded-full">
                                {meal.strArea}
                              </span>
                            )}
                          </div>

                          {/* Ingredients Preview */}
                          <div className="text-sm text-white/70">
                            {getIngredients(meal)
                              .slice(0, 3)
                              .map((ing, idx) => (
                                <span key={idx} className="inline-block mr-2">
                                  {ing.measure} {ing.ingredient}
                                </span>
                              ))}
                            {getIngredients(meal).length > 3 && (
                              <span className="text-white/50">…</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* No results state */}
          {!loading &&
            recipes.length === 0 &&
            hasSearched[activeTab as keyof typeof hasSearched] && (
              <div className="text-center py-12 text-white/80">
                No recipes found. Try a different ingredient, mood, or random
                search!
              </div>
            )}
        </div>
      )}

      {/* Modal for full recipe */}
      {showModal && selectedRecipe && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-auto">
          <div className="bg-slate-900 rounded-2xl max-w-3xl w-full p-6 relative max-h-[90vh] overflow-auto">
            {/* Close button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-white/80 hover:text-white z-50"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-bold text-white mb-4">
              {selectedRecipe.strMeal}
            </h2>
            {selectedRecipe.strMealThumb && (
              <img
                src={selectedRecipe.strMealThumb}
                alt={selectedRecipe.strMeal}
                className="w-full h-64 object-cover rounded-lg mb-4"
              />
            )}

            <div className="mb-4">
              <h3 className="text-lg font-semibold text-white mb-2">
                Ingredients:
              </h3>
              <ul className="list-disc list-inside text-white/80">
                {getIngredients(selectedRecipe).map((ing, idx) => (
                  <li key={idx}>
                    {ing.measure} {ing.ingredient}
                  </li>
                ))}
              </ul>
            </div>

            {selectedRecipe.strInstructions && (
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-white mb-2">
                  Instructions:
                </h3>
                <p className="text-white/80 whitespace-pre-line">
                  {selectedRecipe.strInstructions}
                </p>
              </div>
            )}

            {selectedRecipe.strYoutube && (
              <a
                href={selectedRecipe.strYoutube}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-4 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-500 transition-colors"
              >
                Watch Video
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
