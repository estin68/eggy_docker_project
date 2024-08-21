import React, { useState, useEffect } from 'react';

function App() {
  const [email, setEmail] = useState('');
  const [emails, setEmails] = useState([]);
  const [message, setMessage] = useState('');

  const fetchEmails = async () => {
    try {
      const response = await fetch('http://localhost:8000/emails');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      setEmails(result.emails);
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  };

  const submitEmails = async () => {
    if (!email) {
      setMessage('Please enter an email address.');
      return;
    }

    const formData = new FormData();
    formData.append('email', email);

    try {
      const response = await fetch('http://localhost:8000/submit', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      setMessage(result.message);

      if (response.ok) {
        setEmail(''); // Clear the input field only if the email was saved
        fetchEmails(); // Fetch emails after submitting a new one
      }
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  };

  const deleteEmail = async () => {
    if (!email) {
      setMessage('Please enter an email address to delete.');
      return;
    }

    const formData = new FormData();
    formData.append('email', email);

    try {
      const response = await fetch('http://localhost:8000/delete-single', {
        method: 'DELETE',
        body: formData
      });

      const result = await response.json();
      setMessage(result.message);

      if (response.ok) {
        setEmail(''); // Clear the input field only if the email was saved
        fetchEmails(); // Fetch emails after deletion
      }

      if (!response.ok) {
        setMessage(result.detail); // Set the error message in state
      }
    } catch (error) {
      setMessage(error.message); // Set the error message in state
    }
  };

  const deleteEmails = async () => {
    try {
      const response = await fetch('http://localhost:8000/delete', {
        method: 'DELETE',
      });

      const result = await response.json();
      setMessage(result.message);

      if (response.ok) {
        setEmail(''); // Clear the input field only if the email was saved
        fetchEmails(); // Fetch emails after deletion
      }
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    
    // Get the button that was clicked
    const buttonClicked = e.nativeEvent.submitter;

    if (buttonClicked.name === 'submit') {
      await submitEmails();
    } else if (buttonClicked.name === 'deleteEmail') {
      await deleteEmail();
    } else if (buttonClicked.name === 'deleteAll') {
      await deleteEmails();
    }
  };

  useEffect(() => {
    fetchEmails();
  }, []);

  return (
    <div style={styles.container}>
      <h1>Email Submission Form</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <label style={styles.label}>
          Email: 
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
          />
        </label>
        <div style={{
          display: 'flex',
          gap: '4px'
        }}>
          <button type="submit" name="submit" style={styles.button}>Submit</button>
          <button type="submit" name="deleteEmail" style={styles.button}>Delete</button>
          <button type="submit" name="deleteAll" style={styles.button}>Delete All</button>
        </div>
      </form>
      <h2 style={styles.heading}>Submitted Emails:</h2>
      <ul style={styles.list}>
        {emails.map((email, index) => (
          <li key={index} style={styles.listItem}>{email}</li>
        ))}
      </ul>
      {message && <p>{message}</p>}
    </div>
  );
}

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    backgroundColor: '#f9f9f9',
    minHeight: '100vh',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '20px',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '10px',
    backgroundColor: '#fff',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  label: {
    marginBottom: '10px',
    fontSize: '18px',
  },
  input: {
    padding: '10px',
    fontSize: '16px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    marginBottom: '10px',
    width: '90%',
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    color: '#fff',
    backgroundColor: '#007BFF',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  buttonHover: {
    backgroundColor: '#0056b3',
  },
  heading: {
    fontSize: '24px',
    marginBottom: '10px',
  },
  list: {
    listStyleType: 'none',
    padding: '0',
  },
  listItem: {
    padding: '10px',
    fontSize: '18px',
    borderBottom: '1px solid #ccc',
  },
};

export default App;
