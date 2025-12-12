import { BrowserRouter as Router } from "react-router-dom"
import { QueryProvider } from "./providers"
import { Header } from "@/widgets/header"
import { Footer } from "@/widgets/footer"
import { PostsManagerPage } from "@/pages/post-manager"

const App = () => {
  return (
    <QueryProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow container mx-auto px-4 py-8">
            <PostsManagerPage />
          </main>
          <Footer />
        </div>
      </Router>
    </QueryProvider>
  )
}

export default App
