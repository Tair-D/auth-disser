import React, { useEffect } from 'react';
import useSpeechToText from 'react-hook-speech-to-text';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
// import { SpeechRecognition } from '../SpeechRecognition';
import { userActions } from '../_actions';

function refreshPage() {
  window.location.reload(false);
}

function SpeechRecognition() {
  const {
    error,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
  } = useSpeechToText({
    continuous: true,
    timeout: 10000,
  });
  const users = useSelector((state) => state.users);
  const user = useSelector((state) => state.authentication.user);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(userActions.getAll());
  }, []);

  function handleDeleteUser(id) {
    dispatch(userActions.delete(id));
  }
  if (results == user.lastName)
    return (
      <div className="col-lg-8 offset-lg-2">
        <h1>Hi {user.firstName}!</h1>
        {/* <p>You're logged in with React Hooks!!</p> */}
        <h3>All registered users:</h3>
        {users.loading && <em>Loading users...</em>}
        {users.error && (
          <span className="text-danger">ERROR: {users.error}</span>
        )}
        {users.items && (
          <ul>
            {users.items.map((user, index) => (
              <li key={user.id}>
                {user.firstName + ' ' + user.lastName}
                {user.deleting ? (
                  <em> - Deleting...</em>
                ) : user.deleteError ? (
                  <span className="text-danger">
                    {' '}
                    - ERROR: {user.deleteError}
                  </span>
                ) : (
                  <span>
                    {' '}
                    -{' '}
                    <a
                      onClick={() => handleDeleteUser(user.id)}
                      className="text-primary"
                    >
                      Delete
                    </a>
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
        <p>
          <Link to="/login">Logout</Link>
        </p>
      </div>
      // <HomePage />
    );
  //   else return <p>Fail</p>;

  if (error) return <p>Web Speech API is not available in this browser 🤷‍</p>;

  return (
    <div>
      <h1>Запись: {isRecording.toString()}</h1>
      <button onClick={isRecording ? stopSpeechToText : startSpeechToText}>
        {isRecording ? 'Запись приостановлена' : 'Начата запись'}
      </button>
      <ul>
        {results.map((result, index) => (
          <li key={index}><p>Вы произнесли неверное кодовое слово - {result}</p>
          <button onClick={refreshPage}><br/>Произнести слово заново</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export { SpeechRecognition };
