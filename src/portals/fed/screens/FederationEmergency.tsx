import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  FED_EMERGENCIES,
  FED_EMERGENCY_SUMMARY,
  FED_JOBS,
  workerById,
  type EmergencyTrade,
  type FedEmergency,
} from '../fedData';
import {
  ActBtn,
  Card2,
  Chip,
  CoopDemoTag,
  Drawer,
  FederationKpiCard,
  FedScreen,
  Grid,
  KV,
  RecordCard,
  RecordList,
  Row,
  ScreenHeader,
  SectionTitle,
  StatusBadge,
  StepFlow,
  type BadgeTone,
} from '../fedUI';
import { useFedStore, useFedT } from '../fedStore';
import { colors } from '../../../theme/theme';

/**
 * Emergency Operations — ported from
 * workconnect/src/portals/fed/screens/Emergency.tsx.
 *
 * The master-detail layout became a queue list plus a `Drawer`: on a phone the
 * two-column view left no usable width for either pane. The web screen's
 * hardcoded candidate distances ([1.8, 3.2, 4.6]) are preserved so the same
 * three nearby workers appear per request.
 */

/** Hardcoded nearby-candidate distances, matching the web screen. */
const NEARBY_DISTANCES = [1.8, 3.2, 4.6];

/** Emergency command flow steps, matching the web screen. */
const COMMAND_FLOW = ['Request received', 'Trade matched', 'Nearby workers found', 'Worker dispatched', 'Service confirmed'];

const PRIORITY_TONE: Record<string, BadgeTone> = { Critical: 'red', High: 'amber', Standard: 'blue' };

export const FederationEmergency: React.FC = () => {
  const { go, showToast } = useFedStore();
  const t = useFedT();
  const [tradeFilter, setTradeFilter] = useState<EmergencyTrade | ''>('');
  const [openRequest, setOpenRequest] = useState<FedEmergency | null>(null);
  const [deployed, setDeployed] = useState<Record<string, string>>({});

  const filtered = useMemo(
    () => (tradeFilter ? FED_EMERGENCIES.filter((e) => e.trade === tradeFilter) : FED_EMERGENCIES),
    [tradeFilter],
  );

  const s = FED_EMERGENCY_SUMMARY;
  const under20 = Object.values(deployed).length;

  const deploy = (request: FedEmergency, workerId: string) => {
    setDeployed((prev) => ({ ...prev, [request.id]: workerId }));
    setOpenRequest(null);
    showToast(`${workerById(workerId)?.name ?? 'Worker'} dispatched for ${request.id}.`);
  };

  return (
    <FedScreen>
      <ScreenHeader
        title={t('title_emergency')}
        subtitle="Priority service requests across the federation, with emergency-ready workers on call."
        tag={<CoopDemoTag />}
      />

      <Grid minWidth="31%">
        <FederationKpiCard label="Total requests" value={`${s.total}`} sub="in the emergency queue" tone="red" icon="warning-outline" />
        <FederationKpiCard label="Electrician" value={`${s.Electrician}`} sub="electrical emergencies" tone="amber" icon="flash-outline" />
        <FederationKpiCard label="Plumber" value={`${s.Plumber}`} sub="water emergencies" tone="blue" icon="water-outline" />
        <FederationKpiCard label="Technician" value={`${s.Technician}`} sub="appliance emergencies" tone="slate" icon="construct-outline" />
        <FederationKpiCard label="Still active" value={`${FED_EMERGENCIES.filter((e) => e.status !== 'Assigned').length}`} sub="awaiting dispatch" tone="red" icon="alert-circle-outline" />
        <FederationKpiCard label="Dispatched" value={`${under20}`} sub="this session" tone="green" icon="checkmark-circle-outline" />
      </Grid>

      <Row wrap>
        <Chip active={tradeFilter === ''} onPress={() => setTradeFilter('')}>All trades</Chip>
        <Chip active={tradeFilter === 'Electrician'} onPress={() => setTradeFilter('Electrician')}>Electrician</Chip>
        <Chip active={tradeFilter === 'Plumber'} onPress={() => setTradeFilter('Plumber')}>Plumber</Chip>
        <Chip active={tradeFilter === 'Technician'} onPress={() => setTradeFilter('Technician')}>Technician</Chip>
      </Row>

      <RecordList isEmpty={filtered.length === 0} emptyLabel="No emergency requests for this trade">
        {filtered.map((request) => {
          const dispatchedWorker = deployed[request.id];
          return (
            <RecordCard
              key={request.id}
              title={request.issue}
              subtitle={`${request.id} · ${request.location}`}
              badge={{ label: request.priority, tone: PRIORITY_TONE[request.priority] }}
              onPress={() => setOpenRequest(request)}
              fields={[
                { label: 'Trade', value: request.trade },
                { label: 'Customer', value: request.customerType },
                { label: 'Received', value: request.received },
                {
                  label: 'Status',
                  value: dispatchedWorker
                    ? `Dispatched · ${workerById(dispatchedWorker)?.name ?? ''}`
                    : request.status,
                },
              ]}
              trailing={
                dispatchedWorker ? (
                  <StatusBadge value="Dispatched" tone="green" />
                ) : null
              }
            />
          );
        })}
      </RecordList>

      <Card2 style={{ gap: 12 }}>
        <SectionTitle hint="How a priority request becomes a dispatched worker.">Emergency command flow</SectionTitle>
        <StepFlow steps={COMMAND_FLOW} currentIndex={COMMAND_FLOW.length - 1} />
      </Card2>

      <EmergencyDrawer
        request={openRequest}
        deployedWorkerId={openRequest ? deployed[openRequest.id] : undefined}
        onClose={() => setOpenRequest(null)}
        onDeploy={deploy}
        onOpenAllocation={() => {
          setOpenRequest(null);
          go('allocation');
        }}
      />
    </FedScreen>
  );
};

const EmergencyDrawer: React.FC<{
  request: FedEmergency | null;
  deployedWorkerId?: string;
  onClose: () => void;
  onDeploy: (request: FedEmergency, workerId: string) => void;
  onOpenAllocation: () => void;
}> = ({ request, deployedWorkerId, onClose, onDeploy, onOpenAllocation }) => {
  if (!request) return null;
  const dispatched = deployedWorkerId ?? request.candidateIds[0];
  const dispatchedWorker = workerById(dispatched);
  const nearby = request.candidateIds
    .map((id) => ({ worker: workerById(id), distance: NEARBY_DISTANCES[request.candidateIds.indexOf(id)] }))
    .filter((x): x is { worker: NonNullable<ReturnType<typeof workerById>>; distance: number } => !!x.worker);
  const job = FED_JOBS.find((j) => j.emergency && j.trade === request.trade);

  return (
    <Drawer
      title={request.issue}
      subtitle={`${request.id} · ${request.location}`}
      open
      onClose={onClose}
      footer={
        <>
          <ActBtn label="Open AI allocation" tone="ghost" onPress={onOpenAllocation} style={{ flex: 1 }} />
          <ActBtn
            label={job ? 'View job operations' : 'No job record'}
            disabled={!job}
            tone="primary"
            onPress={() => { /* job operations live in the Jobs tab */ }}
            style={{ flex: 1 }}
          />
        </>
      }
    >
      <Row wrap>
        <StatusBadge value={request.priority} tone={PRIORITY_TONE[request.priority]} />
        <StatusBadge value={request.status} />
        <StatusBadge value={request.trade} tone="blue" />
        {deployedWorkerId ? <StatusBadge value="Dispatched" tone="green" /> : null}
      </Row>

      <Grid minWidth="30%">
        <KV k="Trade" v={request.trade} />
        <KV k="Customer type" v={request.customerType} />
        <KV k="Received" v={request.received} />
        <KV k="Location" v={request.location} />
      </Grid>

      {dispatchedWorker ? (
        <Card2 style={{ gap: 4 }}>
          <SectionTitle>{deployedWorkerId ? 'Dispatched worker' : 'Primary candidate'}</SectionTitle>
          <Row>
            <View style={{ flex: 1 }}>
              <Text style={styles.workerName}>{dispatchedWorker.name}</Text>
              <Text style={styles.workerMeta}>{dispatchedWorker.trade} · {dispatchedWorker.location}</Text>
            </View>
            <StatusBadge value={dispatchedWorker.availability} />
          </Row>
          <KV k="Rating" v={`${dispatchedWorker.rating}/5`} />
          <KV k="Service radius" v={`${dispatchedWorker.serviceRadiusKm} km`} mono />
          <KV k="Verification" v={dispatchedWorker.verification} />
          <KV k="Emergency ready" v={dispatchedWorker.emergencyReady ? 'Yes' : 'No'} />
        </Card2>
      ) : null}

      <View>
        <SectionTitle hint="Emergency-ready workers nearest to the request location.">Nearby available workforce</SectionTitle>
        <View style={{ gap: 8 }}>
          {nearby.map(({ worker, distance }) => (
            <Card2 key={worker.id} style={{ gap: 8 }}>
              <Row>
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text style={styles.workerName} numberOfLines={1}>{worker.name}</Text>
                  <Text style={styles.workerMeta} numberOfLines={1}>
                    {worker.trade} · {worker.location} · {distance} km
                  </Text>
                </View>
                <StatusBadge value={worker.availability} />
              </Row>
              <Row>
                <StatusBadge value={`${worker.rating} ★`} tone="blue" />
                <StatusBadge value={worker.verification} />
                <View style={{ flex: 1 }} />
                <ActBtn
                  label="Deploy"
                  icon="send"
                  disabled={!!deployedWorkerId}
                  onPress={() => onDeploy(request, worker.id)}
                />
              </Row>
            </Card2>
          ))}
        </View>
      </View>

      {job ? (
        <Card2 style={{ gap: 4 }}>
          <SectionTitle>Linked job record</SectionTitle>
          <KV k="Job ID" v={job.id} mono />
          <KV k="Service" v={job.service} />
          <KV k="Status" v={<StatusBadge value={job.status} />} />
          <KV k="Amount" v={`₹${job.amount.toLocaleString('en-IN')}`} mono />
        </Card2>
      ) : null}
    </Drawer>
  );
};

const styles = StyleSheet.create({
  workerName: { color: colors.ink, fontSize: 13, fontWeight: '900' },
  workerMeta: { color: colors.sage, fontSize: 10, marginTop: 2 },
});