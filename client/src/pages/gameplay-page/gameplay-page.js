import React, { useEffect, useState } from "react";
// import housePng from "../../img/house.png";

import "./gameplay-page.scss";

const GameplayPage = () => {
  // const [houseImg, setHouseImg] = useState(null);
  const [houses, setHouses] = useState([]);

  useEffect(() => {
    // const img = new Image();
    // img.src = housePng;
    // img.onload = () => {
    //   setHouseImg(img);
    // };
    setHouses([
      {
        id: 1,
        type: "TAVERN",
        position: { x: 3, y: 2 },
      },
      {
        id: 2,
        type: "GUILD",
        position: { x: 6, y: 5 },
      },
    ]);
  }, []);

  const clickHandler = (e) => {
    e.preventDefault();
    const id = e.target.getAttribute("id");
    console.log(id);
  };

  return (
    <div className="gameplay">
      <div className="gameplay__world">
        {houses.map((house) => {
          const gridPosition = {
            gridRow: `${house.position.y}`,
            gridColumn: `${house.position.x}`,
          };
          return (
            <div
              className="house"
              style={gridPosition}
              key={house.id}
              onClick={clickHandler}
            >
              <div className="house--img" id={`house__${house.id}`}>
                <div className="house--name">{house.type}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GameplayPage;
