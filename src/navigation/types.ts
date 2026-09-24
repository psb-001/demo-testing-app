import type { NavigatorScreenParams } from '@react-navigation/native';
import type { AuthRole, WorkerProfile } from '../types';

export type MainTabParamList = {
  Services: undefined;
  Map: undefined;
  AI: undefined;
  Account: undefined;
};

export type PortalRoute =
  | 'CustomerPortal'
  | 'WorkerPortal'
  | 'CooperativePortal'
  | 'FederationPortal';

export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabParamList> | undefined;
  Workers: undefined;
  WorkerDetail: { workerId: string };
  Booking: { workerId: string; emergency?: boolean };
  Emergency: { type?: string };
  Welfare: undefined;
  CustomerPayments: undefined;
  SavedWorkers: undefined;
  Admin: { tab?: 'forecast' | 'societies' | 'fairshare' };
  Auth: { mode?: 'login' | 'signup' };
  CustomerPortal: undefined;
  WorkerPortal: undefined;
  CooperativePortal: undefined;
  FederationPortal: undefined;
};

export function portalRouteForRole(role: AuthRole): PortalRoute {
  switch (role) {
    case 'worker':
      return 'WorkerPortal';
    case 'cooperative':
      return 'CooperativePortal';
    case 'federation':
      return 'FederationPortal';
    case 'customer':
    default:
      return 'CustomerPortal';
  }
}

export function getWorkerById(id: string, list: WorkerProfile[]): WorkerProfile | undefined {
  return list.find((w) => w.id === id);
}
