import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
} from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard'

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
      </Routes>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      

    </Router>
  )
}

export default App
