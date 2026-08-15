import { z } from "zod";
import { type Education, educationSchema } from "./schema";

export const education: Education[] = z.array(educationSchema).parse([
  {
    degree: "Bachelor of Computer Applications",
    field: "Computer Applications",
    institution: "St. Xavier's College",
    location: "Ahmedabad, India",
    start: "2013",
    end: "2016",
  },
]);
