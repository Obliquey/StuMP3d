import React from 'react';
import LoginForm from '../../FunctionComponents/LoginForm/LoginForm';
import { useHistory } from 'react-router-dom';

function LoginPage() {
  const history = useHistory();

  return (
    <div className='grid grid-cols-1 mt-28'>
      <LoginForm />

      <center className='grid grid-cols-1'>
        <button
          type="button"
          className="text-white underline m-3"
          onClick={() => {
            history.push('/registration');
          }}
        >
          Register
        </button>
        <button
          className='underline'
          onClick={() => {
            history.push('/landing')
          }}
        >
          Back
        </button>
      </center>
    </div>
  );
}

export default LoginPage;
