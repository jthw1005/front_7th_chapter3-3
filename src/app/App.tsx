import { BrowserRouter as Router } from "react-router-dom"
import Header from "@/widgets/header/ui/Header"
import Footer from "@/widgets/footer/ui/Footer"
import PostsManagerPage from "@/pages/post-manager/ui/PostsManagerPage"

const App = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <PostsManagerPage />
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
