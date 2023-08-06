import React, { useState,useEffect } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import axios from 'axios';

const isStrongPassword = (password) => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?!.*(.)\1\1).{6,20}$/;
  return regex.test(password);
};

const getMinimumSteps = (password) => {
  const n = password.length;
  let totalSteps = n >= 6 ? 0 : 6 - n;
  return totalSteps;
};

function App() {

  const [password, setPassword] = useState('');
  const [strength, setStrength] = useState(0);
  const [isStrong, setIsStrong] = useState(false);
  const [blockSubmit, setBlockSubmit] = useState(true);

  useEffect(() => {
    const steps = getMinimumSteps(password);
    setStrength(steps);
    setIsStrong(isStrongPassword(password));
    if(!isStrong){
      setBlockSubmit(true)
    }
    else{
      setBlockSubmit(false);
    }
  }, [password,isStrong]);

  const onSubmit = (event) => {
    event.preventDefault();
      if(blockSubmit){
        alert ('Form submission blocked')
        return false;
      }
      else{
        let formData = {
          "password" : password
        }
        axios.post('http://localhost:8080/storepasswords', formData)
        .then((res) => {
          alert (res.message);
        })
        .catch((err) => {
          alert (err.message);
        });
      }
  }

  return (
    <div className='container'>
      <Card className='card'>
      <Form>
        <Form.Group className="mb-3" controlId="formGroupPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Password" 
          defaultValue = {password}
          onChange={(e)=>setPassword(e.target.value)}
          />
        </Form.Group>
        <p>Minimum steps to make password strong: {strength}</p>
        {isStrong ? ( <p>Your password is already strong! </p>) :( <ListGroup>
            <ListGroup.Item variant="danger">
              <p>1.Password should be at least 6 characters and at most 20 characters.</p>
              <p>2.Password should contains at least one lowercase letter, at least one
uppercase letter, and at least one digit.</p>
              <p>3.It does not contain three repeating characters in a row
(i.e. &quot;Baaabb0&quot; is weak, but &quot;Baaba0&quot; is strong).</p>
            </ListGroup.Item>
          </ListGroup> )}

          <Button variant="success" onClick={onSubmit}>Submit</Button>
      </Form>
      </Card>
    </div>
  );
}

export default App;
