import { BrowserRouter as Router } from "react-router-dom"
import { Toaster } from "sonner"
import { ErrorBoundary, QueryProvider } from "./providers"
import { Header } from "@/widgets/header"
import { Footer } from "@/widgets/footer"
import { PostsManagerPage } from "@/pages/post-manager"

const App = () => {
  return (
    <ErrorBoundary>
      <QueryProvider>
        <Router>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8">
              <PostsManagerPage />
            </main>
            <Footer />
          </div>
          <Toaster position="top-right" richColors />
        </Router>
      </QueryProvider>
    </ErrorBoundary>
  )
}

export default App
