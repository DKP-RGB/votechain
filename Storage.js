/**
 * FrontendStorage.js
 * Manages user registration & auth in localStorage.
 * Simulates a backend user database entirely on the client.
 */

const USERS_KEY = "evoting_users";
const SESSION_KEY = "evoting_session";

function loadUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function generateId() {
  return "user_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
}

export const Storage = {
  // Register a new voter
  registerUser(userData) {
    const users = loadUsers();
    const exists = users.find(
      (u) => u.username === userData.username || u.aadhar === userData.aadhar
    );
    if (exists) {
      return {
        success: false,
        message: "Username or Aadhar already registered",
      };
    }
    const newUser = {
      id: generateId(),
      username: userData.username,
      password: userData.password,
      firstName: userData.firstName,
      lastName: userData.lastName,
      aadhar: userData.aadhar,
      phone: userData.phone,
      faceDescriptor: userData.faceDescriptor || null,
      registeredAt: new Date().toISOString(),
      hasVoted: false,
    };
    users.push(newUser);
    saveUsers(users);
    return { success: true, user: newUser };
  },

  // Login with username + password
  loginUser(username, password) {
    const users = loadUsers();
    const user = users.find(
      (u) => u.username === username && u.password === password
    );
    if (!user) return { success: false, message: "Invalid credentials" };
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    return { success: true, user };
  },

  // Get face descriptor for user (for matching)
  getUserByFaceDescriptor(descriptor, threshold = 0.6) {
    const users = loadUsers();
    let bestMatch = null;
    let bestDistance = Infinity;
    for (const user of users) {
      if (!user.faceDescriptor) continue;
      const storedDesc = new Float32Array(Object.values(user.faceDescriptor));
      const incomingDesc = new Float32Array(descriptor);
      // Euclidean distance
      let sum = 0;
      for (let i = 0; i < storedDesc.length; i++) {
        const diff = storedDesc[i] - incomingDesc[i];
        sum += diff * diff;
      }
      const distance = Math.sqrt(sum);
      if (distance < bestDistance) {
        bestDistance = distance;
        bestMatch = user;
      }
    }
    if (bestDistance <= threshold) {
      return { success: true, user: bestMatch, distance: bestDistance };
    }
    return { success: false, distance: bestDistance };
  },

  // Get user by username
  getUserByUsername(username) {
    const users = loadUsers();
    return users.find((u) => u.username === username) || null;
  },

  // Get current session
  getSession() {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  // Logout
  logout() {
    localStorage.removeItem(SESSION_KEY);
  },

  // Mark user as voted
  markVoted(userId) {
    const users = loadUsers();
    const idx = users.findIndex((u) => u.id === userId);
    if (idx !== -1) {
      users[idx].hasVoted = true;
      saveUsers(users);
    }
  },

  // Save face descriptor to user
  saveFaceDescriptor(userId, descriptor) {
    const users = loadUsers();
    const idx = users.findIndex((u) => u.id === userId);
    if (idx !== -1) {
      users[idx].faceDescriptor = Array.from(descriptor);
      saveUsers(users);
    }
  },

  getAllUsers() {
    return loadUsers();
  },
};
