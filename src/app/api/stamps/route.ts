import getRequest from "./get";
import postRequest from "./post";

export async function GET(request: Request) {
  return await getRequest(request);
}

export async function POST(request: Request) {
  return await postRequest(request);
}