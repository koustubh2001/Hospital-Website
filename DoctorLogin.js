import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';

function DoctorLogin() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [appointments, setAppointments] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await axios.post('http://localhost:4000/doctor-login', formData);

    if (res.status === 200) {
      setLoggedIn(true);
      const appointments = await axios.get('http://localhost:4000/appointments');
      setAppointments(appointments.data);
    }
  } catch (err) {
    alert('❌ Invalid email or password.');
  }
};

  return (
    <div className="auth-page">
      <div className="auth-container">
        {!loggedIn ? (
          <>
            <h2>Doctor Login</h2>
            <form onSubmit={handleSubmit} className="auth-form">
              <input type="email" name="email" placeholder="Doctor Email" onChange={handleChange} required />
              <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
              <button type="submit" className="auth-button">Login</button>
            </form>
          </>
        ) : (
          <>
            <h2>All Appointments</h2>
            {appointments.length > 0 ? (
              <ul>
                {appointments.map((appt, i) => (
                  <li key={i}>
                    <strong>Name:</strong> {appt.name} | 
                    <strong> Email:</strong> {appt.email} | 
                    <strong> Phone:</strong> {appt.phone} | 
                    <strong> Age:</strong> {appt.Age} <br />
                    <strong>Message:</strong> {appt.message}
                  </li>
                ))}
              </ul>
            ) : <p>No appointments found.</p>}
          </>
        )}
      </div>
    </div>
  );
}

export default DoctorLogin;
