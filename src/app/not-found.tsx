import Navbar from "@/components/navbar";
import { getTranslations } from "@/utils/translation/translate";

export default async function NotFound() {

    const translations = await getTranslations("en-US");

    return (
          <div style={{
            "display": "flex",
            "flexDirection": "column",
            "height": "100vh"
          }}>
            <Navbar translations={translations.navbar} lang={"en-US"}/>
            <p className="text-center relative top-[33%]">Not found :(</p>
          </div>
    );
}