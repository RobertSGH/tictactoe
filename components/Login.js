import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../redux/slices/userSlice';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function Login() {
  const router = useRouter();
  const dispatch = useDispatch();
  const error = useSelector((state) => state.user.error);
  const { isAuthenticated } = useSelector((state) => state.user);

  const handleSubmit = (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;
    dispatch(loginUser({ username, password }));
  };

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated]);

  return (
    <div className='mt-4'>
      <form className='space-y-4' onSubmit={handleSubmit}>
        <input
          className='p-2 w-full rounded border focus:outline-none focus:border-blue-400'
          type='text'
          name='username'
          placeholder='Username'
          required
        />
        <input
          className='p-2 w-full rounded border focus:outline-none focus:border-blue-400'
          type='password'
          name='password'
          placeholder='Password'
          required
        />
        <button
          className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full'
          type='submit'
        >
          Login
        </button>
      </form>
      {error && <p className='mt-4 text-red-500'>{error}</p>}
    </div>
  );
}
