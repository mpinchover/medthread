const meds = {
  resourceType: "Bundle",
  id: "df12b61c97d24f159cedb2d66e59ed28",
  meta: {
    lastUpdated: "2022-07-28T17:50:03.2438032+00:00",
  },
  type: "searchset",
  link: [
    {
      relation: "self",
      url: "https://fhir.humana.com/sandbox/api/MedicationRequest?patient=74532b683658335246434e495a53425462476c5741673d3d",
    },
  ],
  entry: [
    {
      fullUrl:
        "https://fhir.humana.com/sandbox/api/MedicationRequest/7c5ef9f39623d84415fa89845cb966b925a5a1112edfb43bc9ea3f4d3f8f59b1",
      resource: {
        resourceType: "MedicationRequest",
        id: "7c5ef9f39623d84415fa89845cb966b925a5a1112edfb43bc9ea3f4d3f8f59b1",
        meta: {
          versionId: "222",
          lastUpdated: "2022-07-17T07:34:21.887+00:00",
          source:
            "https://fhir.humana.com/documentation/glossary/HumanaDataSource",
          tag: [
            {
              system: "https://www.hl7.org/fhir/patient.html",
              code: "Patient/74532b683658335246434e495a53425462476c5741673d3d",
            },
            {
              system:
                "https://fhir.humana.com/documentation/glossary/lastRefreshedOn",
              code: "2022-07-17T07:34:21.396Z",
            },
          ],
        },
        status: "active",
        intent: "order",
        medicationCodeableConcept: {
          coding: [
            {
              system: "http://hl7.org/fhir/sid/ndc",
              code: "53451010101",
              display: "Horizant ER 600 mg tablet,extended release",
            },
          ],
        },
        subject: {
          reference: "Patient/74532b683658335246434e495a53425462476c5741673d3d",
        },
        authoredOn: "2020-06-15",
        requester: {
          identifier: {
            system: "http://hl7.org/fhir/sid/us-npi",
            value: "1639172406",
          },
          display: "DR. CHRISTOPHER WIETING, DPM",
        },
        dosageInstruction: [
          {
            text: "TABLET, EXTENDED RELEASE",
            route: {
              text: "Topical",
            },
            doseAndRate: [
              {
                doseQuantity: {
                  value: 600,
                  unit: "EA",
                },
              },
            ],
          },
        ],
        dispenseRequest: {
          quantity: {
            value: 30,
          },
        },
      },
      search: {
        mode: "match",
      },
    },
    {
      fullUrl:
        "https://fhir.humana.com/sandbox/api/MedicationRequest/690f33ee53976733128824bbf855dd1c01dfaceba7f7b917349ff38ac40a4169",
      resource: {
        resourceType: "MedicationRequest",
        id: "690f33ee53976733128824bbf855dd1c01dfaceba7f7b917349ff38ac40a4169",
        meta: {
          versionId: "222",
          lastUpdated: "2022-07-17T07:34:21.831+00:00",
          source:
            "https://fhir.humana.com/documentation/glossary/HumanaDataSource",
          tag: [
            {
              system: "https://www.hl7.org/fhir/patient.html",
              code: "Patient/74532b683658335246434e495a53425462476c5741673d3d",
            },
            {
              system:
                "https://fhir.humana.com/documentation/glossary/lastRefreshedOn",
              code: "2022-07-17T07:34:21.396Z",
            },
          ],
        },
        status: "active",
        intent: "order",
        medicationCodeableConcept: {
          coding: [
            {
              system: "http://hl7.org/fhir/sid/ndc",
              code: "53451010101",
              display: "Horizant ER 600 mg tablet,extended release",
            },
          ],
        },
        subject: {
          reference: "Patient/74532b683658335246434e495a53425462476c5741673d3d",
        },
        authoredOn: "2020-05-28",
        requester: {
          identifier: {
            system: "http://hl7.org/fhir/sid/us-npi",
            value: "1588667786",
          },
          display: "DR. KATHLEEN HUDSON, MD",
        },
        dosageInstruction: [
          {
            text: "TABLET, EXTENDED RELEASE",
            route: {
              text: "Topical",
            },
            doseAndRate: [
              {
                doseQuantity: {
                  value: 600,
                  unit: "EA",
                },
              },
            ],
          },
        ],
        dispenseRequest: {
          quantity: {
            value: 30,
          },
        },
      },
      search: {
        mode: "match",
      },
    },
  ],
};

export default {
  meds,
};
