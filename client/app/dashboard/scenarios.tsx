import type { ScenarioDescription } from '../../../shared/scenarios/model';

interface ScenarioListProps {
  scenarios: ScenarioDescription[];
  headerText: string;
  headerColor: 'blue' | 'red' | 'green' | 'orange' | 'zinc' | 'olive' | 'cyan';
  onClick: (id: string) => void;
}

export default function ScenarioList({
  scenarios,
  headerText,
  headerColor,
  onClick,
}: ScenarioListProps) {
  const gradientMap = {
    blue: 'from-blue-800 to-blue-400',
    red: 'from-red-800 to-red-400',
    green: 'from-green-800 to-green-400',
    orange: 'from-orange-800 to-orange-400',
    zinc: 'from-zinc-800 to-zinc-400',
    olive: 'from-olive-800 to-olive-400',
    cyan: 'from-cyan-800 to-cyan-400',
  };

  const hoverMap = {
    blue: 'hover:outline-blue-400 hover:bg-blue-50 hover:text-blue-400',
    red: 'hover:outline-red-400 hover:bg-red-50 hover:text-red-400',
    green: 'hover:outline-green-400 hover:bg-green-50 hover:text-green-400',
    orange: 'hover:outline-orange-400 hover:bg-orange-50 hover:text-orange-400',
    zinc: 'hover:outline-zinc-400 hover:bg-zinc-50 hover:text-zinc-400',
    olive: 'hover:outline-olive-400 hover:bg-olive-50 hover:text-olive-400',
    cyan: 'hover:outline-cyan-400 hover:bg-cyan-50 hover:text-cyan-400',
  };
  const hoverClass = hoverMap[headerColor];
  const gradientClass = gradientMap[headerColor];

  function handleScenario(
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ): void {
    onClick(event.currentTarget.id);
  }

  return (
    <div
      className={`flex h-125 max-w-175 min-w-80 flex-1 flex-col overflow-hidden rounded-2xl shadow-xl outline`}
    >
      <div
        className={`bg-linear-to-br ${gradientClass} text-bold z-2 flex flex-col items-start gap-y-1 p-5 text-2xl text-white shadow-xl outline-2`}
      >
        <span>{headerText}</span>
        <span className="text-xl font-extralight">
          {scenarios.length} scenarios available
        </span>
      </div>
      <div className="z-1 flex-1 overflow-scroll">
        {scenarios.map((s) => (
          <div
            onClick={handleScenario}
            key={s.id}
            id={s.id.toString()}
            className={`m-2 flex rounded-xl p-5 outline ${hoverClass} transition delay-50 duration-200 ease-in-out hover:-translate-0.5 hover:cursor-pointer hover:shadow-2xl hover:outline-2`}
          >
            <span>{s.description}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
