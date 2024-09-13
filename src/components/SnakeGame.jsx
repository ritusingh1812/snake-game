import React, { useEffect, useRef, useState } from "react";

const GRID_SIZE = 15;
const GAME_GRID = Array.from({ length: GRID_SIZE }, () =>
  new Array(GRID_SIZE).fill("")
);

const generateFood = () => {
  const x = Math.floor(Math.random() * GRID_SIZE);
  const y = Math.floor(Math.random() * GRID_SIZE);
  return [x, y];
};
const INITIAL_SNAKE = [5, 5];

function SnakeGame() {
  const [snakeBody, setSnakeBody] = useState([INITIAL_SNAKE]);
  const [score, setScore] = useState(0);
  const foodRef = useRef(generateFood());
  const isSnakeBodyDiv = (xy, yc) => {
    return snakeBody.some(([x, y]) => {
      return x === xy && y === yc;
    });
  };
  const directionRef = useRef([1, 0]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setSnakeBody((prevSnakeBody) => {
        const copySnakeBody = prevSnakeBody.map((arr) => [...arr]);
        // copySnakeBody.pop(); //remove last tail
        const newHead = [
          prevSnakeBody[0][0] + directionRef.current[0],
          prevSnakeBody[0][1] + directionRef.current[1],
        ];

        if (
          newHead[0] === foodRef.current[0] &&
          newHead[1] === foodRef.current[1]
        ) {
          foodRef.current = generateFood();
        } else {
          copySnakeBody.pop();
        }

        //add new head
        if (
          newHead[0] < 0 ||
          newHead[0] >= GRID_SIZE ||
          newHead[1] < 0 ||
          newHead[1] >= GRID_SIZE ||
          prevSnakeBody.some(([x, y]) => {
            return newHead[0] === x && newHead[1] === y;
          })
        ) {
          directionRef.current = [1, 0];
          return [INITIAL_SNAKE];
        }
        copySnakeBody.unshift(newHead);
        return copySnakeBody;
      });
    }, 250);
    const handleDirection = (e) => {
      const key = e.key;
      console.log(key);
      if (key === "ArrowUp" && directionRef.current[1] != 1) {
        directionRef.current = [0, -1];
      } else if (key === "ArrowLeft" && directionRef.current[0] != 1) {
        directionRef.current = [-1, 0];
      } else if (key === "ArrowRight" && directionRef.current[0] != -1) {
        directionRef.current = [1, 0];
      } else if (key === "ArrowDown" && directionRef.current[1] != -1) {
        directionRef.current = [0, 1];
      }
    };
    window.addEventListener("keydown", handleDirection);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener("keydown", handleDirection);
    };
  }, []);

  return (
    <>
      {/* <h1>{score}</h1> */}
      <h1 style={{ fontFamily: "sans-serif", textAlign: "center" }}>
        SNAKE GAME
      </h1>
      <div className="container">
        {GAME_GRID.map((row, yc) => {
          return row.map((cell, xc) => {
            return (
              <div
                className={`cell ${isSnakeBodyDiv(xc, yc) ? "snake" : ""}
               ${
                 foodRef.current[0] === xc && foodRef.current[1] === yc
                   ? "food"
                   : ""
               }`}
              ></div>
            );
          });
        })}
      </div>
    </>
  );
}

export default SnakeGame;
