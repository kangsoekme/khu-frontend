import React from "react";

import { SearchInput } from "../../components/ui/SearchInput.jsx";
import HalaqohCard from "../../components/halaqoh/HalaqohCard.jsx";

function TahsinManagement() {
  return (
    <>
      <div className="flex flex-col gap-5">
        <SearchInput />
        <div className="grid w-full xl:grid-cols-4 gap-5"></div>
      </div>
    </>
  );
}

export default TahsinManagement;
