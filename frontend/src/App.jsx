import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import WelcomePage from "./Components/WelcomePage"
import OnboardingPage from "./Components/OnboardingPage"
import { ThemeProvider } from "./Components/ThemeProvider"
import ExplorePage from "./Components/ExplorePage"
import ProfilePage from "./Components/ProfilePage"

const App = () => {
  return (
    <ThemeProvider defaultTheme="light" storageKey="fashionology-theme">
      <Router>
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App
