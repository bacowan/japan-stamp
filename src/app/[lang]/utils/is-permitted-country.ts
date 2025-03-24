'use server'

import { headers } from "next/headers";
import { forceJpFlag } from "../../../../flags";
import constants from "@/constants";

async function isPermittedCountry() {
  const country = (await headers()).get('x-country');

  return await forceJpFlag() || (country !== null && !constants.excludedCountries.has(country));
}

export default isPermittedCountry;