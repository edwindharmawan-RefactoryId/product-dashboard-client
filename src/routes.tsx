import {
  Route,
  Routes,
} from "react-router-dom"

import Home from './views/Home'


const routes = [
  {
    path: '/',
    name: 'Home',
    Element: Home
  }
]

const Router = () => {
  return (
    <Routes>
      {routes.map((page, idx) => {
        const Element = page.Element
        return (
          <Route
            key={idx}
            element={<Element/>}
            path={page.path}
          />
        )}
      )}
    </Routes>
  )
}

export default Router
