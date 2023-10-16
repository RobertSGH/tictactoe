import ExistingGames from '@/components/ExistingGames';
import Rankings from '@/components/Rankings';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Login from '@/components/login';
import { logout } from '@/redux/slices/userSlice';
import { initializeState } from '@/redux/slices/userSlice';
import Register from '@/components/Register';

export default function Home() {
  const [activeTab, setActiveTab] = useState('games');
  const [showLogin, setShowLogin] = useState(true);
  const { isAuthenticated, username } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  useEffect(() => {
    dispatch(initializeState());
  });

  return (
    <div className='flex flex-col items-center justify-center min-h-screen'>
      <Head>
        <title>Home</title>
      </Head>
      <div className='w-full max-w-screen-xl p-4 md:p-8'>
        <div className='flex flex-col md:flex-row justify-between items-center bg-gray-600 p-4 rounded-md shadow-md'>
          {isAuthenticated ? (
            <>
              <span className='text-white'>Welcome, {username}!</span>
              <button
                className='bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full'
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <span className='text-white'>
                Please log in or register to proceed
              </span>
              {showLogin ? <Login /> : <Register />}
              <a
                href='#'
                onClick={(e) => {
                  e.preventDefault();
                  setShowLogin(!showLogin);
                }}
                className='ml-5 text-blue-500 hover:underline'
              >
                {showLogin
                  ? "Don't have an account? Register"
                  : 'Already have an account? Log in'}
              </a>
            </>
          )}
        </div>
        {isAuthenticated && (
          <div className='mt-8 bg-gray-600 p-4 text-white rounded-md shadow-md'>
            <div className='flex space-x-4 mb-4 md:mb-0'>
              <button
                className={`py-2 px-4 rounded-full ${
                  activeTab === 'games' ? 'bg-blue-700' : 'bg-gray-700'
                } hover:bg-blue-800 focus:outline-none`}
                onClick={() => setActiveTab('games')}
              >
                Existing Games
              </button>
              <button
                className={`py-2 px-4 rounded-full ${
                  activeTab === 'rankings' ? 'bg-blue-700' : 'bg-gray-700'
                } hover:bg-blue-800 focus:outline-none`}
                onClick={() => setActiveTab('rankings')}
              >
                Rankings
              </button>
            </div>
            {activeTab === 'games' && (
              <div className='p-4'>
                <ExistingGames />
              </div>
            )}
            {activeTab === 'rankings' && (
              <div className='p-4'>
                <Rankings />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
