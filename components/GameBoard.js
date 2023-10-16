import React, { useEffect, useState } from 'react';
import { makeMove, fetchGameDetails } from '@/redux/slices/gameSlice';
import { useSelector, useDispatch } from 'react-redux';

const GameBoard = ({ board }) => {
  const dispatch = useDispatch();
  const { currentGame, error } = useSelector((state) => state.game);
  const { username } = useSelector((state) => state.user);
  const [localError, setLocalError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let intervalId;
    if (currentGame && currentGame.status !== 'finished') {
      intervalId = setInterval(() => {
        dispatch(fetchGameDetails(currentGame.id));
      }, 5000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [currentGame, dispatch]);

  const handleCellClick = (row, col) => {
    const isParticipant =
      currentGame.first_player.username === username ||
      (currentGame.second_player &&
        currentGame.second_player.username === username);

    if (!isParticipant) {
      setLocalError(
        "You can't make a move in a game you are not participating in."
      );
    }

    if (board[row][col] === null && currentGame.status === 'progress') {
      setIsLoading(true);
      dispatch(makeMove({ id: currentGame.id, row, col })).then(() => {
        dispatch(fetchGameDetails(currentGame.id))
          .then(() => {
            setIsLoading(false);
          })
          .catch((err) => {
            console.error(err);
            setLocalError(err.message);
            setIsLoading(false);
          });
      });
    }
  };

  useEffect(() => {
    if (error) {
      setLocalError(error);
      const timer = setTimeout(() => {
        setLocalError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const isWaitingForSecondPlayer = !currentGame.second_player;
  const whoseTurn =
    currentGame.board.flat().filter(Boolean).length % 2 === 0
      ? currentGame.first_player.username
      : currentGame.second_player.username;
  const isMyTurn = whoseTurn === username;

  console.log(currentGame);

  return (
    <div className='game-board'>
      {isWaitingForSecondPlayer ? (
        <div className='waiting'>Waiting for a second player to join...</div>
      ) : (
        <>
          {currentGame.status === 'finished' ? (
            <div className='player-info'></div>
          ) : (
            <div className='player-info'>
              <div>
                First player: {currentGame.first_player.username} (ID:{' '}
                {currentGame.first_player.id})
              </div>
              <div>
                Second player: {currentGame.second_player.username} (ID:{' '}
                {currentGame.second_player.id})
              </div>
              <div>
                {isMyTurn ? "It's your turn!" : `It's ${whoseTurn}'s turn`}
              </div>
              {localError && <div className='text-red-500'> {localError}</div>}
            </div>
          )}
        </>
      )}
      {isLoading && <div>Loading, please wait.</div>}

      {board.map((row, rowIndex) => (
        <div key={rowIndex} className='board-row'>
          {row.map((cell, colIndex) => (
            <div
              key={colIndex}
              className='board-cell'
              onClick={() => handleCellClick(rowIndex, colIndex)}
            >
              {cell !== null ? cell : '-'}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default GameBoard;
