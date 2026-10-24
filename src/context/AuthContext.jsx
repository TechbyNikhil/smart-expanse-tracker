import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const DEFAULT_USERS = [
  {
    id: 'user-1',
    name: 'Nikhil Pathak',
    email: 'nikhil@spendwise.app',
    password: 'password123',
    role: 'Senior Software Engineer',
  },
  {
    id: 'user-demo',
    name: 'Alex Morgan',
    email: 'demo@spendwise.app',
    password: 'password123',
    role: 'Product Designer',
  },
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('spendwise_auth_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [registeredUsers, setRegisteredUsers] = useState(() => {
    try {
      const stored = localStorage.getItem('spendwise_users');
      return stored ? JSON.parse(stored) : DEFAULT_USERS;
    } catch {
      return DEFAULT_USERS;
    }
  });

  const [loading, setLoading] = useState(false);

  // Sync registered users to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('spendwise_users', JSON.stringify(registeredUsers));
    } catch (e) {
      console.error('Failed to save users', e);
    }
  }, [registeredUsers]);

  const login = async (email, password, rememberMe = true) => {
    setLoading(true);
    // Simulate brief network latency for realism
    await new Promise((resolve) => setTimeout(resolve, 500));

    const cleanEmail = email.trim().toLowerCase();
    const existing = registeredUsers.find(
      (u) => u.email.toLowerCase() === cleanEmail
    );

    if (existing) {
      if (existing.password === password) {
        const sessionUser = {
          id: existing.id,
          name: existing.name,
          email: existing.email,
          role: existing.role || 'Member',
        };
        setUser(sessionUser);
        if (rememberMe) {
          localStorage.setItem('spendwise_auth_user', JSON.stringify(sessionUser));
        } else {
          sessionStorage.setItem('spendwise_auth_user', JSON.stringify(sessionUser));
        }
        setLoading(false);
        return { success: true, user: sessionUser };
      } else {
        setLoading(false);
        return { success: false, message: 'Invalid password. Please check and try again.' };
      }
    } else {
      // If user is not found, offer friendly login or auto-guest login
      setLoading(false);
      return {
        success: false,
        message: 'No account found with this email. Please check the email or create a new account.',
      };
    }
  };

  const loginWithDemo = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 400));
    const demoUser = registeredUsers[0] || DEFAULT_USERS[0];
    const sessionUser = {
      id: demoUser.id,
      name: demoUser.name,
      email: demoUser.email,
      role: demoUser.role,
    };
    setUser(sessionUser);
    localStorage.setItem('spendwise_auth_user', JSON.stringify(sessionUser));
    setLoading(false);
    return { success: true, user: sessionUser };
  };

  const loginWithProvider = async (providerName) => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    const sessionUser = {
      id: `social-${Date.now()}`,
      name: providerName === 'google' ? 'Google User' : 'GitHub User',
      email: providerName === 'google' ? 'user@gmail.com' : 'user@github.com',
      role: 'Pro Member',
    };
    setUser(sessionUser);
    localStorage.setItem('spendwise_auth_user', JSON.stringify(sessionUser));
    setLoading(false);
    return { success: true, user: sessionUser };
  };

  const signup = async (name, email, password) => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 600));

    const cleanEmail = email.trim().toLowerCase();
    const existing = registeredUsers.find(
      (u) => u.email.toLowerCase() === cleanEmail
    );

    if (existing) {
      setLoading(false);
      return { success: false, message: 'An account with this email already exists.' };
    }

    const newUser = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      email: cleanEmail,
      password,
      role: 'Member',
    };

    const nextUsers = [...registeredUsers, newUser];
    setRegisteredUsers(nextUsers);

    const sessionUser = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    };
    setUser(sessionUser);
    localStorage.setItem('spendwise_auth_user', JSON.stringify(sessionUser));
    setLoading(false);
    return { success: true, user: sessionUser };
  };

  const resetPassword = async (email, newPassword) => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    const cleanEmail = email.trim().toLowerCase();
    const idx = registeredUsers.findIndex((u) => u.email.toLowerCase() === cleanEmail);

    if (idx === -1) {
      setLoading(false);
      return { success: false, message: 'Email address not found in our records.' };
    }

    const updated = [...registeredUsers];
    updated[idx] = { ...updated[idx], password: newPassword };
    setRegisteredUsers(updated);
    setLoading(false);
    return { success: true, message: 'Password updated successfully! You can now log in.' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('spendwise_auth_user');
    sessionStorage.removeItem('spendwise_auth_user');
  };

  const value = {
    user,
    isAuthenticated: Boolean(user),
    loading,
    login,
    loginWithDemo,
    loginWithProvider,
    signup,
    resetPassword,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
