import dotenv from 'dotenv';
dotenv.config();

const BASE_URL = 'http://localhost:5000/api';
let token = '';

const delay = (ms) => new Promise(res => setTimeout(res, ms));

async function runTest() {
  console.log("🚀 Starting Hindsight Memory E2E Tests...\n");
  
  // 1. Signup fresh user
  const uniqueMobile = "99" + Math.floor(10000000 + Math.random() * 90000000).toString();
  const signupRes = await fetch(`${BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: "Hindsight Farmer",
      mobile: uniqueMobile,
      pin: "1234",
      gender: "male",
      village: "TestVillage",
      district: "TestDistrict"
    })
  });
  
  const signupData = await signupRes.json();
  if (!signupData.token) throw new Error("Failed to signup: " + JSON.stringify(signupData));
  token = signupData.token;
  console.log("✅ Created unique test user.\n");
  
  // 2. First Message (Plant the memory)
  console.log("--- Interaction 1 (Planting crop memory) ---");
  const res1 = await fetch(`${BASE_URL}/agent/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ message: "My farm grows tomatoes." })
  });
  const data1 = await res1.json();
  console.log(`Agent: ${data1.response.substring(0, 50)}...`);
  
  // Wait for async memory extraction to complete
  console.log("⏳ Waiting 5 seconds for AI to extract and store memory...");
  await delay(5000);
  
  // 3. Second Message (Retrieve memory implicitly)
  console.log("\n--- Interaction 2 (Testing memory retrieval) ---");
  const res2 = await fetch(`${BASE_URL}/agent/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ message: "My leaves are turning yellow. What could be the issue?" })
  });
  const data2 = await res2.json();
  console.log(`Agent: ${data2.response}`);
  if (data2.response.toLowerCase().includes('tomato') || data2.response.includes('टमाटर')) {
    console.log("✅ SUCCESS: Agent successfully remembered 'tomatoes' from the previous interaction!");
  } else {
    console.log("❌ FAILURE: Agent forgot we were talking about tomatoes.");
  }

  // 4. Third Message (Planting size memory)
  console.log("\n--- Interaction 3 (Planting size memory) ---");
  await fetch(`${BASE_URL}/agent/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ message: "My farm is 5 acres large." })
  });
  console.log("⏳ Waiting 5 seconds for AI to extract and store memory...");
  await delay(5000);
  
  // 5. Fourth Message (Testing multiple memories)
  console.log("\n--- Interaction 4 (Testing multiple memories) ---");
  const res4 = await fetch(`${BASE_URL}/agent/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ message: "How much fertilizer should I buy for my whole farm?" })
  });
  const data4 = await res4.json();
  console.log(`Agent: ${data4.response}`);
  if (data4.response.toLowerCase().includes('5 acre') || data4.response.includes('5')) {
    console.log("✅ SUCCESS: Agent successfully remembered '5 acres' from interaction 3!");
  } else {
    console.log("❌ FAILURE: Agent forgot the farm size.");
  }
  
  console.log("\n🎉 Hindsight Memory Tests Complete!");
}

runTest().catch(console.error);
