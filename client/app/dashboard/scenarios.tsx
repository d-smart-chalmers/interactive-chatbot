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
    blue: 'from-blue-800 to-blue-400 dark:from-blue-500 dark:to-blue-900',
    red: 'from-red-800 to-red-400 dark:from-red-500 dark:to-red-900',
    green: 'from-green-800 to-green-400 dark:from-green-500 dark:to-green-900',
    orange: 'from-orange-800 to-orange-400 dark:from-orange-500 dark:to-orange-900',
    zinc: 'from-zinc-800 to-zinc-400 dark:from-zinc-500 dark:to-zinc-900',
    olive: 'from-olive-800 to-olive-400 dark:from-olive-500 dark:to-olive-900',
    cyan: 'from-cyan-800 to-cyan-400 dark:from-cyan-500 dark:to-cyan-900',
  };

  const hoverMap = {
    blue: 'hover:outline-blue-400 hover:bg-blue-50 hover:text-blue-400 dark:hover:outline-blue-800 dark:hover:bg-blue-500 dark:hover:text-blue-900',
    red: 'hover:outline-red-400 hover:bg-red-50 hover:text-red-400 dark:hover:outline-red-800 dark:hover:bg-red-500 dark:hover:text-black',
    green: 'hover:outline-green-400 hover:bg-green-50 hover:text-green-400 dark:hover:outline-green-800 dark:hover:bg-green-500 dark:hover:text-black',
    orange: 'hover:outline-orange-400 hover:bg-orange-50 hover:text-orange-400 dark:hover:outline-orange-800 dark:hover:bg-orange-500 dark:hover:text-black',
    zinc: 'hover:outline-zinc-400 hover:bg-zinc-50 hover:text-zinc-400 dark:hover:outline-zinc-800 dark:hover:bg-zinc-500 dark:hover:text-black',
    olive: 'hover:outline-olive-400 hover:bg-olive-50 hover:text-olive-400 dark:hover:outline-olive-800 dark:hover:bg-olive-500 dark:hover:text-black',
    cyan: 'hover:outline-cyan-400 hover:bg-cyan-50 hover:text-cyan-400 dark:hover:outline-cyan-800 dark:hover:bg-cyan-500 dark:hover:text-black',
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
            className={`m-2 flex rounded-xl p-5 outline ${hoverClass} transition bg-card delay-50 duration-200 ease-in-out hover:-translate-0.5 hover:cursor-pointer hover:shadow-2xl hover:outline-2`}
          >
            <span>{s.description}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
