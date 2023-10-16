import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRankings, setPagination } from '../redux/slices/userSlice';

export default function Rankings() {
  const dispatch = useDispatch();
  const { rankings, error, pagination } = useSelector((state) => state.user);
  const { limit, offset } = pagination;

  useEffect(() => {
    dispatch(fetchRankings());
  }, [limit, offset, dispatch]);

  const handlePageChange = (direction) => {
    const currentPage = offset / limit + 1;
    let newPage;

    if (direction === 'prev') {
      newPage = Math.max(1, currentPage - 1);
    } else {
      newPage = currentPage + 1;
    }
    const newOffset = (newPage - 1) * limit;

    dispatch(setPagination({ ...pagination, offset: newOffset }));
  };

  return (
    <div className='space-y-4'>
      <table className='min-w-full rounded-md shadow-md'>
        <thead>
          <tr className='bg-gray-900 text-white uppercase text-sm'>
            <th className='py-2 px-4'>Username</th>
            <th className='py-2 px-4'>Games Played</th>
            <th className='py-2 px-4'>Win %</th>
          </tr>
        </thead>
        <tbody className='text-gray-700'>
          {Array.isArray(rankings.results) &&
            rankings.results.map((user, index) => (
              <tr key={index} className='border-t text-white'>
                <td className='py-2 px-4 text-center flex justify-center items-center'>
                  {user.username}
                </td>
                <td className='py-2 px-4 text-center justify-center items-center'>
                  {user.game_count}
                </td>
                <td className='py-2 px-4 text-center justify-center items-center'>
                  {parseFloat(user.win_rate).toFixed(2)}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      {error && <div>Error: {error}</div>}
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
          disabled={rankings.results?.length < limit}
          onClick={() => handlePageChange('next')}
        >
          Next
        </button>
      </div>
    </div>
  );
}
