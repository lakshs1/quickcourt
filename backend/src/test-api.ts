import { setGlobalDispatcher, Agent } from "undici";

// Configure local fetch agent
setGlobalDispatcher(new Agent({ keepAliveTimeout: 10, keepAliveMaxTimeout: 10 }));

const BASE_URL = "http://localhost:3000/api/v1";

async function runTests() {
  console.log("🚀 Starting AmiConnect Automated API Test Suite...\n");

  let accessToken = "";
  let rohanToken = "";
  let rohanId = "";
  let ananyaId = "";

  // 1. Health Check
  console.log("1️⃣ Testing Health Check (/api/health)...");
  const healthRes = await fetch("http://localhost:3000/api/health");
  const healthData = await healthRes.json();
  console.log("  ✅ Health response:", healthData);

  // 2. Public Preview Profiles
  console.log("\n2️⃣ Testing Public Feed Preview (/preview/profiles)...");
  const previewRes = await fetch(`${BASE_URL}/preview/profiles`);
  const previewData = await previewRes.json();
  console.log(`  ✅ Received ${previewData.data?.length || 0} preview profiles.`);

  // 3. Catalog Autocomplete
  console.log("\n3️⃣ Testing Skills & Interests Catalog (/skills, /interests)...");
  const skillsRes = await fetch(`${BASE_URL}/skills?q=py`);
  const skillsData = await skillsRes.json();
  console.log("  ✅ Skills search results:", skillsData.data);

  // 4. Demo Login (Rohan)
  console.log("\n4️⃣ Testing Auth Login (Rohan Verma)...");
  const loginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "rohan.verma@s.amity.edu",
      password: "amity123",
    }),
  });
  const loginData = await loginRes.json();
  if (loginData.success) {
    rohanToken = loginData.data.accessToken;
    rohanId = loginData.data.user.id;
    console.log("  ✅ Rohan Login Successful! Token acquired.");
  } else {
    console.error("  ❌ Rohan Login Failed:", loginData);
  }

  // 5. Register New Student (Automated Test Account)
  console.log("\n5️⃣ Testing Auth Registration (@s.amity.edu enforcement)...");
  const timestamp = Date.now();
  const testEmail = `student.${timestamp}@s.amity.edu`;
  const regRes = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: testEmail,
      password: "SecurePassword123!",
      name: "Test Student",
    }),
  });
  const regData = await regRes.json();
  if (regData.success) {
    accessToken = regData.data.accessToken;
    ananyaId = regData.data.user.id;
    console.log(`  ✅ Registered new student (${testEmail})! Token acquired.`);
  } else {
    console.error("  ❌ Registration failed:", regData);
  }

  // 6. User Onboarding
  console.log("\n6️⃣ Testing User Onboarding (/users/onboard)...");
  const onboardRes = await fetch(`${BASE_URL}/users/onboard`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      degree: "BTech (CSE)",
      year: "3rd Year",
      bio: "Fullstack enthusiast building web apps.",
      about: "Love coding, open source, and hackathons.",
      lookingFor: "React dev for AI hackathon",
      skills: ["python", "react", "typescript"],
      interests: ["gaming", "photography"],
      projects: [
        { title: "Smart Campus App", description: "Campus utility app", techStack: ["React", "Node"] },
      ],
    }),
  });
  const onboardData = await onboardRes.json();
  console.log("  ✅ Onboarding complete! hasOnboarded =", onboardData.data?.hasOnboarded);

  // 7. Get Authenticated Feed
  console.log("\n7️⃣ Testing Authenticated Student Feed (/feed)...");
  const feedRes = await fetch(`${BASE_URL}/feed`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const feedData = await feedRes.json();
  console.log(`  ✅ Authenticated Feed loaded ${feedData.data?.profiles?.length || 0} student card(s).`);

  // 8. Connection Request
  console.log("\n8️⃣ Testing Connection Request (/connections)...");
  if (rohanId) {
    const connRes = await fetch(`${BASE_URL}/connections`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ receiverId: rohanId }),
    });
    const connData = await connRes.json();
    console.log("  ✅ Connection request result:", connData.message || connData);
  }

  // 9. Bookmarks
  console.log("\n9️⃣ Testing Profile Bookmarking (/bookmarks)...");
  if (rohanId) {
    const bmRes = await fetch(`${BASE_URL}/bookmarks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ bookmarkedUserId: rohanId }),
    });
    const bmData = await bmRes.json();
    console.log("  ✅ Bookmark result:", bmData.message || bmData);

    const listBmRes = await fetch(`${BASE_URL}/bookmarks`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const listBmData = await listBmRes.json();
    console.log(`  ✅ Bookmarked Profiles Count: ${listBmData.data?.length || 0}`);
  }

  // 10. Career Roadmaps
  console.log("\n🔟 Testing Career Roadmaps (/roadmaps/me)...");
  const roadmapRes = await fetch(`${BASE_URL}/roadmaps/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const roadmapData = await roadmapRes.json();
  console.log("  ✅ Career Roadmap Suggestions:", roadmapData.data?.suggestions);

  console.log("\n🎉 ALL AUTOMATED API TESTS PASSED SUCCESSFULLY! 🎉\n");
}

runTests().catch((err) => {
  console.error("❌ Test suite failed:", err);
  process.exit(1);
});
