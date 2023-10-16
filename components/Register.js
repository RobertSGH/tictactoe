import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../redux/slices/userSlice';
import { useState, useEffect } from 'react';

const Register = () => {
  const dispatch = useDispatch();
  const error = useSelector((state) => state.user.error);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;
    setSuccess(false);

    try {
      const action = await dispatch(registerUser({ username, password }));

      if (registerUser.fulfilled.match(action)) {
        setSuccess(true);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (!error && success) {
      setSuccess(true);
    }
  }, [error]);

  return (
    <div className='mt-4'>
      <form className='space-y-4' onSubmit={handleSubmit}>
        <div className='flex flex-col'>
          <input
            className='p-2 rounded border focus:outline-none focus:border-blue-400'
            type='text'
            name='username'
            placeholder='Username'
            required
          />
        </div>
        <div className='flex flex-col'>
          <input
            className='p-2 rounded border focus:outline-none focus:border-blue-400'
            type='password'
            name='password'
            placeholder='Password'
            required
          />
        </div>
        <button
          className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full'
          type='submit'
        >
          Register
        </button>
      </form>

      {success && !error && (
        <p className='mt-4 text-green-500'>
          Registration successful! Please proceed to login.
        </p>
      )}
      {error && <p className='mt-4 text-red-500'>Error: {error}</p>}
    </div>
  );
};

export default Register;
