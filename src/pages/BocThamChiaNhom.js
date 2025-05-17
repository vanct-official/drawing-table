import React, { useState } from "react";
import * as XLSX from "xlsx";
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from "../components/Header";

export default function GroupDrawApp() {
  const [members, setMembers] = useState([]);
  const [groupSize, setGroupSize] = useState(5);
  const [groups, setGroups] = useState([]);
  const [drawing, setDrawing] = useState(false);

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
      setGroups([]);
    };
    reader.readAsArrayBuffer(file);
  };

  const shuffleArray = (array) => {
    const newArr = [...array];
    for (let i = newArr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
  };

  const handleDrawGroups = () => {
    if (members.length === 0 || groupSize < 1) return;
    setDrawing(true);
    setTimeout(() => {
      const shuffled = shuffleArray(members);
      const totalGroups = Math.ceil(members.length / groupSize);
      const baseSize = Math.floor(members.length / totalGroups);
      let remainder = members.length % totalGroups;

      const result = [];
      let index = 0;
      for (let i = 0; i < totalGroups; i++) {
        const currentSize = baseSize + (remainder > 0 ? 1 : 0);
        result.push(shuffled.slice(index, index + currentSize));
        index += currentSize;
        if (remainder > 0) remainder--;
      }

      setGroups(result);
      setDrawing(false);
    }, 10000); // 10 giây
  };

  return (
    <>
    
    <Header/>
    <div className="container mt-5">
      <h1 className="text-center mb-4">Bốc thăm chia bảng</h1>

      <div className="mb-3">
        <label className="form-label">Chọn file Excel:</label>
        <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} className="form-control" />
      </div>

      <div className="mb-3">
        <label className="form-label">Số lượng mỗi bảng:</label>
        <input
          type="number"
          min="1"
          value={groupSize}
          onChange={(e) => setGroupSize(Number(e.target.value))}
          className="form-control w-auto"
        />
      </div>

      <button
        onClick={handleDrawGroups}
        className="btn btn-primary mb-4"
        disabled={drawing || members.length === 0}
      >
        {drawing ? "Đang bốc thăm..." : "Bắt đầu bốc thăm"}
      </button>

      {groups.length > 0 && (
        <div className="mt-4">
          <h2 className="mb-3">Kết quả chia bảng:</h2>
          <div className="row">
            {groups.map((group, i) => (
              <div key={i} className="col-md-4 mb-4">
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
      )}
    </div>
    </>
  );
}
