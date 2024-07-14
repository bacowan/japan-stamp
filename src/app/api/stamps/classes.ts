import { AtLeastOne } from "@/utils/validators/at-least-one";
import { IsNotEmpty, Max, Min, ValidateNested } from "class-validator";


class LangText {
    @AtLeastOne(["english", "japanese"], {
      message: "Either english or japanese is required"
    }) // class level validator
    english?: string;
    japanese?: string;
  }
  
  class Location {
    @Min(-90)
    @Max(90)
    lat!: number;
  
    @Min(-180)
    @Max(180)
    lon!: number;
  }
  
  export class PostBody {
    @ValidateNested()
    name!: LangText;
  
    @ValidateNested()
    location!: Location;
  
    @IsNotEmpty()
    imageBase64!: string;
  
    @ValidateNested()
    description!: LangText;
  }