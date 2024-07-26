// ~~~ useFormatters.tsx
// SOURCE: https://gist.github.com/ilkou/7bf2dbd42a7faf70053b43034fc4b5a4

import { type CreatableAdditionalProps } from "node_modules/react-select/dist/declarations/src/useCreatable";
import { type GroupBase } from "react-select";

/**
 * This hook could be added to your select component if needed:
 *   const formatters = useFormatters()
 *   <Select
 *     // other props
 *     {...formatters}
 *   />
 */
export const useFormatters = () => {
  // useful for CreatableSelect
  const formatCreateLabel: CreatableAdditionalProps<
    unknown,
    GroupBase<unknown>
  >["formatCreateLabel"] = (label) => (
    <span className={"text-sm"}>
      Add
      <span className={"font-semibold"}>{` "${label}"`}</span>
    </span>
  );

  // useful for GroupedOptions
  const formatGroupLabel: (group: GroupBase<unknown>) => React.ReactNode = (
    data,
  ) => (
    <div className={"flex items-center justify-between"}>
      <span>{data.label}</span>
      <span
        className={
          "rounded-md bg-secondary px-1 text-xs font-normal text-secondary-foreground shadow-sm"
        }
      >
        {data.options.length}
      </span>
    </div>
  );
  return {
    formatCreateLabel,
    formatGroupLabel,
  };
};
