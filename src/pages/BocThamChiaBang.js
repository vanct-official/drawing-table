import React, { useState } from "react";
import * as XLSX from "xlsx";
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from "../components/Header";

export default function FootballDrawApp() {
  const [members, setMembers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(0);
  const [drawnMembers, setDrawnMembers] = useState([]);
  const [currentDraw, setCurrentDraw] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showGroupSelect, setShowGroupSelect] = useState(false);
  const [pendingDraw, setPendingDraw] = useState(null);
  const [numGroups, setNumGroups] = useState(4);
  const [warning, setWarning] = useState("");

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = new Uint8Array(evt.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      const flatData = jsonData.slice(1).flat().filter((item) => item);
      setMembers(flatData);
      setGroups(Array.from({ length: numGroups }, () => []));
      setDrawnMembers([]);
      setCurrentDraw(null);
      setPendingDraw(null);
      setShowGroupSelect(false);
      setWarning("");
    };
    reader.readAsArrayBuffer(file);
  };

  const handleDrawOne = () => {
    if (members.length === 0 || isDrawing) return;
    setIsDrawing(true);
    setCurrentDraw(null);
    const index = Math.floor(Math.random() * members.length);
    const picked = members[index];
    setPendingDraw(picked);
    setTimeout(() => {
      setCurrentDraw(picked);
      setIsDrawing(false);
      setShowGroupSelect(true);
    }, 5000);
  };

  const handleAssignGroup = () => {
    if (!currentDraw) return;
    const newGroups = [...groups];
    if (newGroups[selectedGroup].length >= Math.ceil(members.length / numGroups) + 1) {
      setWarning(`Bảng ${selectedGroup + 1} đã vượt quá số lượng hợp lý!`);
      return;
    }
    setWarning("");
    const remaining = members.filter(m => m !== currentDraw);
    newGroups[selectedGroup].push(currentDraw);
    setMembers(remaining);
    setGroups(newGroups);
    setDrawnMembers([...drawnMembers, currentDraw]);
    setCurrentDraw(null);
    setPendingDraw(null);
    setShowGroupSelect(false);
  };

  const handleGroupCountChange = (e) => {
    const count = parseInt(e.target.value, 10);
    if (!isNaN(count) && count > 0) {
      setNumGroups(count);
      setGroups(Array.from({ length: count }, () => []));
      setSelectedGroup(0);
    }
  };

  return (
    <>
    <Header />
    <div className="container mt-5">
      <h1 className="text-center mb-4">Bốc thăm chia bảng bóng đá</h1>

      <div className="mb-3">
        <label className="form-label">Số lượng bảng:</label>
        <input
          type="number"
          className="form-control"
          min="1"
          value={numGroups}
          onChange={handleGroupCountChange}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Chọn file Excel:</label>
        <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} className="form-control" />
      </div>

      <button
        onClick={handleDrawOne}
        className="btn btn-warning mb-3"
        disabled={members.length === 0 || isDrawing || currentDraw !== null}
      >
        {isDrawing ? "Đang bốc thăm..." : "Hiển thị tên ngẫu nhiên (5s)"}
      </button>

      {currentDraw && (
        <div className="alert alert-info text-center fs-4">{currentDraw}</div>
      )}

      {showGroupSelect && (
        <div className="mb-4">
          <label className="form-label">Chọn bảng để đưa vào:</label>
          <div className="d-flex align-items-center">
            <select className="form-select w-auto me-2" onChange={(e) => setSelectedGroup(Number(e.target.value))} value={selectedGroup}>
              {groups.map((_, i) => (
                <option key={i} value={i}>Bảng {i + 1}</option>
              ))}
            </select>
            <button className="btn btn-success" onClick={handleAssignGroup}>Xác nhận</button>
          </div>
          {warning && <div className="text-danger mt-2">{warning}</div>}
        </div>
      )}

      <div className="mb-4">
        <h5>Còn lại: {members.length} người chưa được chọn</h5>
      </div>

      <div className="row">
        {groups.map((group, i) => (
          <div key={i} className="col-md-3 mb-4">
            <div className="card">
              <div className="card-header fw-bold">Bảng {i + 1}</div>
              <ul className="list-group list-group-flush">
                {group.map((member, j) => (
                  <li key={j} className="list-group-item">{member}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
    </>
  );
}
