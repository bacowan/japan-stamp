import getRequest from "./get";
import postRequest from "./post";

// setting it to dynamic makes it get a new response each time. Otherwise it caches.
// TODO: Look into how the caching works
//export const dynamic = 'force-dynamic'; // static by default, unless reading the request

/*export const config = {
  api: {
      bodyParser: false, // Disable the default body parser to handle multipart/form-data
  },
};*/

export async function GET(request: Request) {
  return await getRequest(request);
}

export async function POST(request: Request) {
  return await postRequest(request);
}