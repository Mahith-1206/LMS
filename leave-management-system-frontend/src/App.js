import "./App.css";
import AdminPage from "./AdminPage";
import Header from "./Header";

function App() {
  return (
    <div className="App">
      <Header />

      {/* <Routes>
  <Route path="/" exact component={AdminPage} />
  <Route path="/add-user" component={AddUserForm} />
</Routes> */}

      <AdminPage />
    </div>
  );
}

export default App;
