import { useEffect, useRef, useState } from 'react';
import { Switch } from '../components/ui/switch';
import VesselIcon from './vessel.svg?react';
import VtsIcon from './vts.svg?react';
import ScenarioList from '~/dashboard/scenarios';
import { api } from '~/service/api';
import type { DescriptionsResponse } from '../../../shared/scenarios/api';
import {
  UserRole,
  type ScenarioDescription,
} from '../../../shared/scenarios/model';
import { Spinner } from '~/components/ui/spinner';
import { useNavigate } from 'react-router';
import { useUserRoleStore } from '~/store/state';

export default function Dashboard() {
  const useUserRole = useUserRoleStore();
  const [aScenarios, setAScenarios] = useState<ScenarioDescription[]>([]);
  const [bScenarios, setBScenarios] = useState<ScenarioDescription[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const hasFetched = useRef(false);

  const fetchData = async () => {
    const response = await api.get('/scenarios/descriptions');
    const data = response.data as DescriptionsResponse;
    setAScenarios(data.descriptions[0]);
    setBScenarios(data.descriptions[1]);
    setLoading(false);
  };
  useEffect(() => {
    if (hasFetched.current){
      return;
    }
    hasFetched.current = true;
    fetchData();
    console.log("fetching data")
  }, []);

  const onClickScenario = (id: string) => {
    const route = '/scenario/' + id;
    navigate(route);
  };

  return (
    <div className="flex w-full flex-col items-center justify-center gap-6 p-10">
      <div className="flex w-4/6 flex-col items-center justify-center gap-4">
        <h1 className="text-center text-5xl font-bold sm:text-7xl">
          Maritime Communications Trainer
        </h1>
        <h2 className="w-5/6 text-center text-[15px] font-light text-zinc-500 sm:text-[20px]">
          Practice and master standard maritime radio protocols including
          distress calls, position reports, and weather communications in
          realistic scenarios.
        </h2>
      </div>
      <div className="flex flex-col items-center justify-center gap-2">
        <span className="text-center font-light">
          Select your training role
        </span>
        <div className="flex w-full flex-row items-center justify-center gap-x-4">
          <span
            className={`flex w-[16vw] flex-1 items-center justify-end gap-x-2 ${useUserRole.userRole === UserRole.Vessel ? 'text-blue-500' : 'text-zinc-500'}`}
          >
            <VesselIcon />
            Vessel
          </span>

          <Switch
            checked={useUserRole.userRole === UserRole.VTS}
            onClick={() => useUserRole.switchUseRole()}
            className="mt-1"
          />

          <span
            className={`flex flex-1 items-center justify-start gap-x-2 ${useUserRole.userRole === UserRole.VTS ? 'text-green-500' : 'text-zinc-500'}`}
          >
            <VtsIcon />
            VTS operator
          </span>
        </div>
      </div>

      {loading && <Spinner />}

      {!loading && (
        <div className="m-5 flex flex-wrap justify-center gap-5">
          <ScenarioList
            scenarios={aScenarios}
            headerText="Part A - Operational Aspects"
            headerColor="cyan"
            onClick={onClickScenario}
          />

          <ScenarioList
            scenarios={bScenarios}
            headerText="Part B - Safety Aspects"
            headerColor="red"
            onClick={onClickScenario}
          />
        </div>
      )}
    </div>
  );
}
