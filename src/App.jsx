import { useSelector, useDispatch } from "react-redux";
import { login, fetchUser, logout } from "./redux/Slice";


function App() {
  const user = useSelector(state => state.user)
  const dispatch = useDispatch()

  function handleLogin(e) {
    e.preventDefault();
    dispatch(login({ username: 'anurag', password: 'anurag'}));
  }

  function handleUserInfo(e) {
    e.preventDefault();
    dispatch(fetchUser());
  }

  function handleLogout(e) {
    e.preventDefault();
    dispatch(logout());
  }

  return (
    <>
      <h1>App</h1>
      <p className="text-3xl">{user.name}</p>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      onClick={handleLogin}>Login</button>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      onClick={handleUserInfo}>Click me</button>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      onClick={handleLogout}>Logout</button>
      <p>{user?.access_token}</p>
    </>
  )
}

export default App
