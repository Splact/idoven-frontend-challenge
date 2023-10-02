import { Provider as ECGDataProvider } from "../../contexts/ECGDataContext";
import ECGView from "../ECGView";
import Header from "../Header";

const App = () => {
  return (
    <ECGDataProvider>
      <Header />

      <ECGView />
    </ECGDataProvider>
  );
};

export default App;
