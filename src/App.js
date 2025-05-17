import { BrowserRouter as Router, Routes, Route, BrowserRouter } from "react-router-dom";
import BocThamChiaNhom from "./pages/BocThamChiaNhom";
import BocThamChiaBang from "./pages/BocThamChiaBang";

function App() {
  return (
    <div className="App">
      <BrowserRouter basename="/drawing-table">
        <Routes>
        <Route path="/" element={<BocThamChiaBang />} />
          <Route path="/boc-tham-chia-nhom" element={<BocThamChiaNhom />} />
          <Route path="/boc-tham-chia-bang" element={<BocThamChiaBang />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
