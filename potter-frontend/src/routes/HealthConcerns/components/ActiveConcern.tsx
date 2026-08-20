import { Button } from "#components/ui/button";
import usePlantIdentityStore from "@/store/PlantIdentificationStore";
import React from "react";
import { useParams } from "react-router-dom";

const ActiveConcern = () => {
  const { plantIdentity } = usePlantIdentityStore();
  const params = useParams();

  console.log(params.concernID);

  return (
    <div>
      <header className="">
        <h1 className="text-2xl font-semibold">Concern</h1>
        <p className="mt-1 text-sm text-gray-500">Active</p>
      </header>
    </div>
  );
};

export default ActiveConcern;
