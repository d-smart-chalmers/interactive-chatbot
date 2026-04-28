import { useEffect, useRef, useState } from 'react';
import { Switch } from '../components/ui/switch';
import VesselIcon from './vessel.svg?react';
import VtsIcon from './vts.svg?react';
import ScenarioList from '~/dashboard/scenarios';
import { api } from '~/service/api';
import type { DescriptionsResponse } from '../../../shared/scenarios/api';
import {
  UserRole,
  type ScenarioDescriptionList,
} from '../../../shared/scenarios/model';
import { Spinner } from '~/components/ui/spinner';
import { useNavigate } from 'react-router';
import { useHasHydrated, useUserRoleStore } from '~/store/state';

export default function Dashboard() {
  const useUserRole = useUserRoleStore();
  const hasHydrated = useHasHydrated();
  const [scenarioList, setScenarioList] = useState<ScenarioDescriptionList[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const hasFetched = useRef(false);

  const fetchData = async () => {
    const response = await api.get('/scenarios/descriptions');
    const data = response.data as DescriptionsResponse;
    setScenarioList(data.scenarioDescriptionLists);
    setLoading(false);
  };
  useEffect(() => {
    if (!hasHydrated) {
      return;
    }
    if (hasFetched.current) {
      return;
    }
    hasFetched.current = true;
    fetchData();
  }, [hasHydrated]);

  const onClickScenario = (id: string) => {
    const route = '/scenario/' + id;
    navigate(route);
  };
  if (!hasHydrated) {
    return null;
  }
  return (
    <div className="flex w-full flex-col items-center justify-center gap-6 pt-10 pr-5 pl-5">
      <div className="flex w-5/6 flex-col items-center justify-center gap-4">
        <h1 className="text-center text-4xl font-bold sm:text-6xl">
          Digital Standard Maritime Radio Communication Training
        </h1>
        <h2 className="w-5/6 text-center text-[12px] font-light text-zinc-500 sm:w-4/6 sm:text-[20px]">
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
          {scenarioList.map((list, index) => (
            <ScenarioList
              key={index}
              scenarios={list.scenarios}
              headerText={list.headerText}
              headerColor={list.headerColor}
              onClick={onClickScenario}
            />
          ))}
        </div>
      )}
    </div>
  );
}
