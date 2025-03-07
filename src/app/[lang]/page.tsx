import { stampListPageFlag, forceJpFlag } from "../../../flags";
import { headers } from "next/headers";
import { StampResultsWithLocation } from "./components/stamp-results-with-location";
import { StampResults } from "./components/stamp-results";
import StampDto, { StampMongoToDto } from "@/database/dtos/stampDto";
import Stamp from "@/database/database_types/stamp";
import mongodb_client from "@/database/mongodb_client";
import { Filter, Sort } from "mongodb";
import parseLatLonUrl from "./utils/parse-lat-lon-url";

interface HomeParams {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

function firstParam(param: string | string[] | undefined): string {
  if (param === undefined) {
    return "";
  }
  else if (Array.isArray(param)) {
    return param[0];
  }
  else {
    return param;
  }
}

export default async function Home({ searchParams }: HomeParams) {
  if (!await stampListPageFlag()) {
    return <div>Coming soon</div>
  }

  if (!mongodb_client) {
    throw "Could not connect to database";
  }

  const resolvedSearchParams = await searchParams;

  const page = parseInt(firstParam(resolvedSearchParams.page));
  const maxStampsPerPage = parseInt(process.env.MAX_STAMPS_PER_PAGE || "");
  const sort = firstParam(resolvedSearchParams.sort);
  let pageOffset = 0;
  
  if (!isNaN(page) && !isNaN(maxStampsPerPage)) {
    pageOffset = page * maxStampsPerPage;
  }

  const sortObj: Sort = {}
  const findObj: Filter<Stamp> = {};
  if (sort === null || sort === "date") {
    sortObj.date = 1;
  }
  else {
    const latLon = parseLatLonUrl(sort);
    if (latLon) {
      findObj.location = {
        $near: {
          $geometry: { type: "Point",  coordinates: [ latLon.lon, latLon.lat ] }
        }
      };
    }
  }
  
  const database = mongodb_client.db('JapanStamp');
  const collection = database.collection<Stamp>('Stamps');
  const stampsArray = await collection.find(findObj)
    .sort(sortObj)
    .skip(pageOffset)
    .limit(maxStampsPerPage)
    .toArray();
  const stampCards = stampsArray
    .map<StampDto>(s => StampMongoToDto(s));
  
  const country = (await headers()).get('x-country') || 'unknown';

  if (country === 'JP' || await forceJpFlag()) {
    return <StampResultsWithLocation stamps={stampCards}/>
  }
  else {
    return <StampResults stamps={stampCards}/>
  }
}
