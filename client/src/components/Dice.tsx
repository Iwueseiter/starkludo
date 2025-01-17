import React, { useState, useContext, useRef } from "react";
import { useGame } from "../hooks/game-hook";
import { Row, Col } from "react-simple-flex-grid";
import "../styles/Dice.scss";
import { GameContext } from "../context/game-context";
import diceSound from "../assets/audio/shaking-dice-25620.mp3";
import { DiceContext } from "../context/dice-context";

const Dice = () => {
  const { moveValidator } = useGame();
  const [diceClass, setDiceClass] = useState("");
  const { options, setGameOptions } = useContext(GameContext);
  const { img} = useContext(DiceContext);
  const audioRef = useRef(new Audio(diceSound));

  // cc = center-center; tl = top-left; br = bottom-right; etc.
  const combinations: { [key: number]: string[] }[] = [
    { 1: ["cc"] },
    { 2: ["tl", "br"] },
    { 3: ["tl", "cc", "br"] },
    { 4: ["tl", "tr", "bl", "br"] },
    { 5: ["tl", "tr", "cc", "bl", "br"] },
    { 6: ["tl", "tr", "cl", "cr", "bl", "br"] },
  ];

  // Function to play the dice rolling sound
  const playDiceSound = () => {
    audioRef.current.play();
  };

  // Function to stop the dice rolling sound
  const stopDiceSound = () => {
    audioRef.current.pause();
    audioRef.current.currentTime = 0; // Reset the audio to the start
  };

  const eraseDots = async (number: number) => {
    // iterate over combinations array to remove numbers
    combinations[number - 1][number].forEach((set) => {
      // add class 'show'
      document.getElementById(`${set}`)?.classList.remove("show");
    });
  };

  const makeDots = async (number: number) => {
    // Spin animation
    // dicebody.classList.add("spin-die");
    setDiceClass((d) => (d === "spin-die" ? d : d + "spin-die"));
    // iterate over combinations array to show numbers
    combinations[number - 1][number].forEach((set) => {
      // add class 'show'
      document.getElementById(`${set}`)?.classList.add("show");
    });
  };

  // The is the argument for the rollDie function
  const randomRollAmount = () => {

    return Math.floor(Math.random() * 30 + 15);
  };

  // The end result is simply a random number picked between 1 and 6
  const randomRollResult = async () => {
    let rollResult = 6;

    rollResult = Math.floor(Math.random() * 6 + 1);

    moveValidator(rollResult);
    return rollResult;
  };

  // This adds a setInterval to make the dots on the die

  const rollDie = async (numberOfRolls: number) => {
    let counter = 1;
    let number = 1;
    const rollState = async () => {
      // when to stop the roll
      if (counter >= numberOfRolls) {
        clearInterval(rolling);
        // The result on die
        const x = await randomRollResult();
        makeDots(x);
        stopDiceSound();
        moveValidator(x); // Validate move after rolling
        // remove CSS animation spin effect
        setDiceClass((d) => d.replace("spin-die", ""));
      } else {
        // rolls the die by quickly displaying then hiding them
        makeDots(number);
        setTimeout(eraseDots, 80, number);
        // incrementer values for setInterval
        counter += 1;
        // which dots to show on die for 1 to 6
        number += 1;
        // Keep looping the values from 1 to 6
        if (number > 6) {
          number = 1;
        }
      }
    };
    playDiceSound();
    const rolling = setInterval(rollState, 125);
  };

  const roller = async () => {
    if (!options.hasThrownDice) {
      setGameOptions({ hasThrownDice: true });
      await rollDie(randomRollAmount());
    }
  };

  return (
    <React.Fragment>
      {options.gameIsOngoing && (
        <Row gutter={0} className="dice-container">
          <Col xs={options.hasThrownDice ? 12 : 6}>
            {/* <div id="dice-body" className={`${diceClass}`}>
              <div id="tl" className="dot" />
              <div id="tc" className="dot" />
              <div id="tr" className="dot" />
              <div id="cl" className="dot" />
              <div id="cc" className="dot show" />
              <div id="cr" className="dot" />
              <div id="bl" className="dot" />
              <div id="bc" className="dot" />
              <div id="br" className="dot" />
            </div> */}
              <img id="dice-img" className={`${diceClass}`} src={img} alt="dice" />
          </Col>

          {!options.hasThrownDice && (
            <Col xs={6}>
              <div>
                <button className="roll-btn" onClick={roller}>
                  Roll
                </button>
              </div>
            </Col>
          )}
        </Row>
      )}
    </React.Fragment>
  );
};

export default Dice;
