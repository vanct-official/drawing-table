import React, { useState } from "react";
import * as XLSX from "xlsx";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function LeaguePhase() {
  const [teams, setTeams] = useState([]); // full list
  const [pots, setPots] = useState([[], [], [], []]);
  const [matchSchedule, setMatchSchedule] = useState({});
  const [isDrawing, setIsDrawing] = useState(false);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = new Uint8Array(evt.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      const [, ...rows] = jsonData; // skip header

      const loadedTeams = rows.map(([name, pot, country]) => ({
        name,
        pot: Number(pot) - 1,
        country
      })).filter(t => t.name && !isNaN(t.pot));

      const newPots = [[], [], [], []];
      loadedTeams.forEach(team => newPots[team.pot].push(team));
      setTeams(loadedTeams);
      setPots(newPots);
      setMatchSchedule({});
    };
    reader.readAsArrayBuffer(file);
  };

  const drawMatches = () => {
    if (teams.length !== 36) {
      alert("Cần đúng 36 đội chia đều thành 4 nhóm hạt giống (9 đội mỗi nhóm)");
      return;
    }

    setIsDrawing(true);
    const schedule = {};
    const allTeams = [...teams];

    for (const team of allTeams) {
      schedule[team.name] = [];
      const selectedOpponents = new Set();

      for (let potIndex = 0; potIndex < 4; potIndex++) {
        if (potIndex === team.pot) continue;
        let count = 0;
        const candidates = pots[potIndex].filter(
          opp => opp.name !== team.name && opp.country !== team.country && !schedule[team.name].includes(opp.name)
        );

        while (count < 2 && candidates.length > 0) {
          const idx = Math.floor(Math.random() * candidates.length);
          const opponent = candidates.splice(idx, 1)[0];

          if (!selectedOpponents.has(opponent.name)) {
            schedule[team.name].push(opponent.name);
            selectedOpponents.add(opponent.name);
            count++;
          }
        }
      }
    }

    setMatchSchedule(schedule);
    setIsDrawing(false);
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Bốc thăm UEFA Champions League (League Phase)</h1>

      <div className="mb-3">
        <label className="form-label">Chọn file Excel (gồm Tên đội, Pot (1-4), Quốc gia):</label>
        <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} className="form-control" />
      </div>

      <button className="btn btn-primary mb-3" onClick={drawMatches} disabled={isDrawing || teams.length !== 36}>
        {isDrawing ? "Đang tạo lịch..." : "Bốc thăm theo League Phase"}
      </button>

      {Object.keys(matchSchedule).length > 0 && (
        <div className="mt-4">
          <h4>Lịch thi đấu (8 trận mỗi đội):</h4>
          {Object.entries(matchSchedule).map(([team, opponents]) => (
            <div key={team} className="card mb-2">
              <div className="card-header fw-bold">{team}</div>
              <ul className="list-group list-group-flush">
                {opponents.map((opponent, i) => (
                  <li key={i} className="list-group-item">vs {opponent}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
