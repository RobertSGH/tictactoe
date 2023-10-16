import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchGames,
  setGamePagination,
  setGameFilter,
  fetchGameDetails,
  joinGame,
  createGame,
} from '../redux/slices/gameSlice';
import GameBoard from './GameBoard';

export default function ExistingGames() {
  const dispatch = useDispatch();
  const { games, error, pagination, filter, currentGame } = useSelector(
    (state) => state.game
  );
  const { limit, offset } = pagination;
  const [selectedGame, setSelectedGame] = useState(null);
  const { username } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchGames({ limit, offset, status: filter }));
  }, [limit, offset, filter, dispatch]);

  const handlePageChange = (direction) => {
    const currentPage = offset / limit + 1;
    let newPage;

    if (direction === 'prev') {
      newPage = Math.max(1, currentPage - 1);
    } else {
      newPage = currentPage + 1;
    }

    const newOffset = (newPage - 1) * limit;
    dispatch(setGamePagination({ ...pagination, offset: newOffset }));
  };

  const handleFilterChange = (e) => {
    dispatch(setGameFilter(e.target.value));
  };

  const handleGameClick = (gameId) => {
    setSelectedGame(gameId);
    dispatch(fetchGameDetails(gameId));
  };

  const handleCloseGame = () => {
    setSelectedGame(null);
    dispatch(fetchGames({ limit, offset, status: filter }));
  };

  const handleCreateGame = () => {
    dispatch(createGame())
      .then((response) => {
        const newGameId = response.payload.id;
        setSelectedGame(newGameId);
        dispatch(fetchGameDetails(newGameId));
      })
      .catch((error) => {
        console.error('Error while creating game:', error);
      });
  };

  const handleJoinGame = () => {
    if (selectedGame && currentGame) {
      dispatch(joinGame(selectedGame))
        .then(() => {
          dispatch(fetchGameDetails(selectedGame));
        })
        .catch(() => {
          console.error(error);
        });
    }
  };

  useEffect(() => {
    if (selectedGame) {
      dispatch(fetchGameDetails(selectedGame));
    }
  }, [selectedGame, dispatch]);

  return (
    <div className='space-y-4'>
      {selectedGame ? (
        <div className='text-white'>
          <h2 className='text-2xl font-semibold'>Game ID: {selectedGame}</h2>
          {currentGame && currentGame.board ? (
            <>
              <GameBoard board={currentGame.board} />
              {currentGame?.status === 'finished' && (
                <div className='winner-info text-lg mt-4'>
                  <div>
                    Winner:{' '}
                    {currentGame.winner ? currentGame.winner.username : 'Draw'}
                  </div>
                  <div>First Player: {currentGame.first_player.username}</div>
                  <div>
                    Second Player:{' '}
                    {currentGame.second_player
                      ? currentGame.second_player.username
                      : 'None'}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className='text-lg mt-4'>Loading board...</div>
          )}
          <button
            className='mt-2 py-1 px-1 bg-red-600 text-white rounded-full hover:bg-red-700 focus:outline-none'
            onClick={handleCloseGame}
          >
            Close Game
          </button>
          {currentGame?.status !== 'finished' && (
            <button
              className='mt-2 ml-2 py-1 px-1 bg-blue-600 text-white rounded-full hover:bg-blue-700 focus:outline-none'
              onClick={handleJoinGame}
            >
              Join Game
            </button>
          )}
          {error && <div className='mt-4 text-red-600'>Error: {error}</div>}
        </div>
      ) : (
        <>
          <button
            className='mb-4 py-2 px-4 bg-green-600 text-white rounded-full hover:bg-green-700 focus:outline-none'
            onClick={handleCreateGame}
          >
            Create New Game
          </button>
          <div className='flex items-center space-x-2'>
            <span className='text-lg'>Filter:</span>
            <select
              className='bg-gray-500 p-2 rounded border'
              value={filter}
              onChange={handleFilterChange}
            >
              <option value='All'>All</option>
              <option value='open'>Open</option>
              <option value='progress'>In Progress</option>
              <option value='finished'>Completed</option>
            </select>
          </div>
          <div className='game-list'>
            {Array.isArray(games) &&
              games.map((game, index) => {
                const isParticipant =
                  game.first_player.username === username ||
                  (game.second_player &&
                    game.second_player.username === username);
                return (
                  <div
                    key={index}
                    className={`game-card ${
                      isParticipant ? 'participant' : ''
                    }`}
                    onClick={() => handleGameClick(game.id)}
                  >
                    <div className='game-id'>ID: {game.id}</div>
                    <div className='game-status'>Status: {game.status}</div>
                    <div
                      className={`game-player ${
                        game.first_player.username === username ? 'is-user' : ''
                      }`}
                    >
                      First Player: {game.first_player.username}
                    </div>
                    <div
                      className={`game-player ${
                        game.second_player &&
                        game.second_player.username === username
                          ? 'is-user'
                          : ''
                      }`}
                    >
                      Second Player:{' '}
                      {game.second_player
                        ? game.second_player.username
                        : 'Open'}
                    </div>
                  </div>
                );
              })}
          </div>
          <div className='bg-gray-700 text-white p-4 rounded flex justify-between items-center'>
            <button
              className='py-2 px-5 bg-gray-600 text-white rounded-full hover:bg-gray-700 focus:outline-none'
              disabled={offset === 0}
              onClick={() => handlePageChange('prev')}
            >
              Previous
            </button>
            <button
              className='py-2 px-7 bg-gray-600 text-white rounded-full hover:bg-gray-700 focus:outline-none'
              disabled={games.length < limit}
              onClick={() => handlePageChange('next')}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
