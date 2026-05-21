import { Link } from 'react-router-dom'
import { Home, Search } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-dark-500 flex items-center justify-center px-6">
      <div className="text-center">
        <div className="text-8xl font-extrabold text-gradient mb-4">404</div>
        <h1 className="text-2xl font-bold mb-2">Page Not Found</h1>
        <p className="text-gray-400 mb-8 max-w-md">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex gap-3 justify-center">
          <Link to="/" className="btn-primary">
            <Home size={15} /> Go Home
          </Link>
          <Link to="/dashboard" className="btn-ghost">
            <Search size={15} /> Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
