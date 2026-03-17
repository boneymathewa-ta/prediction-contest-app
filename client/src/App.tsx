import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AddTournament from './admin/addtournament'
import ViewTournament from './admin/viewtournament'
import ContestDetails from './contest-details'

function App() {

  return (
    <><ul>
      <li><a href="/admin/create-tournament">Create Tournament</a></li>
      <li><a href="/admin/view-tournaments">View Tournaments</a></li>
    </ul>

      <BrowserRouter>
        <Routes>
          <Route path="/admin/create-tournament" element={<AddTournament />} />
          <Route path="/admin/view-tournaments" element={<ViewTournament />} />
          <Route path="/contest/:id" element={<ContestDetails />} />
        </Routes>
      </BrowserRouter>
      {/* <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p> */}
    </>
  )
}

export default App
