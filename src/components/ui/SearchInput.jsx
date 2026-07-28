import { SearchIcon } from "lucide-react";

import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

export function SearchInput({ value, onChange, placeholder = "Cari data..." }) {
  return (
    <Field className="max-w-sm">
      <InputGroup>
        <InputGroupInput
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
        <InputGroupAddon align="inline-start">
          <SearchIcon className="text-muted-foreground" />
        </InputGroupAddon>
      </InputGroup>
    </Field>
  );
}
