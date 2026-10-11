import AsyncStorage from '@react-native-async-storage/async-storage';
import type { AuthRole, AuthUser } from '../types';

const USERS_KEY = 'rozgar.auth.users.v1';
const SESSION_KEY = 'rozgar.auth.session.v1';

export const DEMO_OTP = '1234';

async function readUsers(): Promise<AuthUser[]> {
  try {
    const raw = await AsyncStorage.getItem(USERS_KEY);
    return raw ? (JSON.parse(raw) as AuthUser[]) : [];
  } catch {
    return [];
  }
}

async function writeUsers(users: AuthUser[]): Promise<void> {
  await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export async function findUserByPhone(phone: string): Promise<AuthUser | null> {
  const digits = phone.replace(/\D/g, '').slice(-10);
  const users = await readUsers();
  return users.find((u) => u.phone.replace(/\D/g, '').slice(-10) === digits) || null;
}

export async function findUserByEmail(email: string): Promise<AuthUser | null> {
  const e = email.trim().toLowerCase();
  const users = await readUsers();
  return users.find((u) => (u.email || '').toLowerCase() === e) || null;
}

export async function loginWithPassword(identifier: string, password: string): Promise<AuthUser | null> {
  const user = identifier.includes('@')
    ? await findUserByEmail(identifier)
    : await findUserByPhone(identifier);
  if (!user || !user.password || user.password !== password) return null;
  return user;
}

export async function createUser(data: Omit<AuthUser, 'id' | 'createdAt'>): Promise<AuthUser> {
  const users = await readUsers();
  const user: AuthUser = {
    ...data,
    id: `user-${Date.now().toString(36)}`,
    createdAt: new Date().toISOString(),
  };
  await writeUsers([...users, user]);
  return user;
}

export async function updateUser(id: string, patch: Partial<AuthUser>): Promise<AuthUser | null> {
  const users = await readUsers();
  const idx = users.findIndex((u) => u.id === id);
  if (idx === -1) return null;
  users[idx] = { ...users[idx], ...patch };
  await writeUsers(users);
  return users[idx];
}

export async function loginWithOtp(phone: string, otp: string): Promise<AuthUser | null> {
  if (otp !== DEMO_OTP) return null;
  return findUserByPhone(phone);
}

export async function ensureDemoAccount(role: AuthRole): Promise<AuthUser> {
  const seeds: Record<AuthRole, Omit<AuthUser, 'id' | 'createdAt'>> = {
    customer: {
      name: 'Amit Deshmukh', phone: '+91 98220 91823', role: 'customer',
      language: 'en', city: 'Pune', area: 'Kothrud',
      address: 'Flat 402, Rohan Viti, Kothrud, Pune - 411038',
    },
    worker: {
      name: 'Suresh Pawar', phone: '+91 98231 44019', role: 'worker',
      language: 'mr', city: 'Pune', area: 'Baner',
      trade: 'electrician', tradeLabel: 'Electrician',
      cooperativeName: 'Pune Electricians Cooperative Society Ltd.',
      experienceYears: 8,
      skills: ['Ceiling fan installation', 'Switchboard wiring', 'MCB repair'],
      availableToday: true, serviceRadiusKm: 8,
      verificationStatus: 'Cooperative Verified',
    },
    cooperative: {
      name: 'Meera Kulkarni', phone: '+91 98500 12345', role: 'cooperative',
      language: 'en', city: 'Pune',
      orgName: 'Pune Electricians Cooperative Society Ltd.',
      orgType: 'cooperative', regNo: 'MH/PUN/COOP/2018/EL-04',
      verificationStatus: 'Verified',
    },
    federation: {
      name: 'Rajesh Patil', phone: '+91 98500 67890', role: 'federation',
      language: 'en', city: 'Pune',
      orgName: 'Labour Cooperative Federation of India',
      orgType: 'federation', regNo: 'MH/FED/2016/01',
      verificationStatus: 'Verified',
    },
  };
  const existing = await findUserByPhone(seeds[role].phone);
  if (existing && existing.role === role) return existing;
  if (existing) {
    const updated = await updateUser(existing.id, { ...seeds[role] });
    if (updated) return updated;
  }
  return createUser(seeds[role]);
}

export async function getSession(): Promise<AuthUser | null> {
  try {
    const raw = await AsyncStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AuthUser;
    const users = await readUsers();
    return users.find((u) => u.id === parsed.id) || null;
  } catch {
    return null;
  }
}

export async function setSession(user: AuthUser | null): Promise<void> {
  if (user) await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(user));
  else await AsyncStorage.removeItem(SESSION_KEY);
}

export async function clearSession(): Promise<void> {
  await AsyncStorage.removeItem(SESSION_KEY);
}
