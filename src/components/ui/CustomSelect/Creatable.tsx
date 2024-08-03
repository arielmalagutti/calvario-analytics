// ~~~ Creatable.tsx
// SOURCE: https://gist.github.com/ilkou/7bf2dbd42a7faf70053b43034fc4b5a4
import * as React from "react";
import CreatableSelect from "react-select/creatable";
import type { Props } from "react-select";
import { defaultClassNames, defaultStyles } from "./helper";
import {
  ClearIndicator,
  DropdownIndicator,
  Menu,
  MenuList,
  MultiValueRemove,
  Option,
} from "./ReactSelectCustomComponents";

const Creatable = React.forwardRef<
  React.ElementRef<typeof CreatableSelect>,
  React.ComponentPropsWithoutRef<typeof CreatableSelect>
>((props: Props, ref) => {
  const {
    value,
    onChange,
    options = [],
    styles = defaultStyles,
    classNames = defaultClassNames,
    components = {},
    ...rest
  } = props;

  const id = React.useId();

  return (
    <CreatableSelect
      instanceId={id}
      ref={ref}
      value={value}
      onChange={onChange}
      options={options}
      unstyled
      components={{
        DropdownIndicator,
        ClearIndicator,
        MultiValueRemove,
        Option,
        Menu,
        MenuList,
        ...components,
      }}
      styles={styles}
      classNames={classNames}
      {...rest}
    />
  );
});
Creatable.displayName = "Creatable";
export default Creatable;
