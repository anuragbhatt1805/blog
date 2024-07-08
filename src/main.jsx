import { Provider } from 'react-redux'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { Layout } from './Layout.jsx'
import { store } from './redux/Store'
import './index.css'
import { createHashRouter, createRoutesFromElements, RouterProvider, Route } from 'react-router-dom'
import { Blog, fetchBlog } from './components/Blog.jsx'

const router = createHashRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route path="" element={<App />} />
      <Route path="blog" element={<Blog />} loader={({ params }) => fetchBlog(params.id)}/>
      <Route path="blog/:id" element={<Blog />} loader={({ params }) => fetchBlog(params.id)} />
    </Route>
  )
)

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
      <RouterProvider router={router} />
  </Provider>
)
