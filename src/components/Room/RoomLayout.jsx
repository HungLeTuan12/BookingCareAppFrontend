import { useEffect, useState } from "react";
import axios from "axios";

export default function RoomLayout() {
  const [floors, setFloors] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/floors")
      .then((response) => setFloors(response.data))
      .catch((error) => console.error("Error fetching floors:", error));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Quản lý phòng trọ</h1>
      {floors.map((floor) => (
        <div key={floor.id} className="mb-6">
          <h2 className="text-lg font-semibold mb-2">
            Tầng {floor.floorNumber}
          </h2>
          <div className="flex gap-3">
            {floor.rooms.map((room) => (
              <div
                key={room.id}
                className={`w-16 h-16 flex items-center justify-center text-white font-bold rounded-lg shadow-md cursor-pointer transition
                ${
                  room.status === "occupied"
                    ? "bg-red-500"
                    : "bg-green-500 hover:bg-green-600"
                }`}
              >
                {room.title}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
