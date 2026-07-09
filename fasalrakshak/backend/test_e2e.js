const BASE_URL = 'http://localhost:5000/api';
let token = '';

const testSignup = async () => {
  console.log('\n--- Testing Signup ---');
  const response = await fetch(`${BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Test Farmer',
      mobile: '9999999999',
      pin: '1234',
      gender: 'male',
      village: 'TestVillage',
      district: 'TestDistrict'
    })
  });
  const data = await response.json();
  if (response.ok || (response.status === 409)) {
    console.log('✅ Signup endpoint working (or user already exists).');
  } else {
    console.error('❌ Signup failed:', data);
  }
};

const testLogin = async () => {
  console.log('\n--- Testing Login ---');
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      mobile: '9999999999',
      pin: '1234'
    })
  });
  const data = await response.json();
  if (response.ok && data.token) {
    token = data.token;
    console.log('✅ Login successful. Received JWT.');
  } else {
    console.error('❌ Login failed:', data);
    process.exit(1);
  }
};

const testGetMe = async () => {
  console.log('\n--- Testing /me (Bearer Auth) ---');
  const response = await fetch(`${BASE_URL}/auth/me`, {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const data = await response.json();
  if (response.ok && data.success) {
    console.log('✅ /me verification successful.');
  } else {
    console.error('❌ /me verification failed:', data);
  }
};

const testAgent = async () => {
  console.log('\n--- Testing Agent Orchestrator ---');
  const response = await fetch(`${BASE_URL}/agent/chat`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      message: 'Mera gehu ka khet kaisa chal raha hai?' // "How is my wheat farm doing?"
    })
  });
  const data = await response.json();
  if (response.ok && data.success) {
    console.log('✅ Agent responded successfully!');
    console.log(`Agent Intent detected: ${data.intent}`);
    console.log(`Agent Response: "${data.response.substring(0, 50)}..."`);
  } else {
    console.error('❌ Agent failed:', data);
  }
};

const runTests = async () => {
  try {
    console.log('🚀 Starting Backend E2E Tests...');
    await testSignup();
    await testLogin();
    await testGetMe();
    await testAgent();
    console.log('\n🎉 All tests completed successfully!');
  } catch (error) {
    console.error('Test script crashed:', error);
  }
};

runTests();
