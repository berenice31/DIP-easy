export enum FieldType {
  SHORT_TEXT = "SHORT_TEXT",
  LONG_TEXT = "LONG_TEXT",
  FILE_UPLOAD = "FILE_UPLOAD",
  REPEATER = "REPEATER",
  DATE = "DATE",
  NUMBER = "NUMBER",
}

export interface Field {
  id: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  validation?: {
    min?: number;
    max?: number;
  };
  accept?: string;
}

export interface RepeaterField extends Field {
  type: FieldType.REPEATER;
  fields: Field[];
}

export interface Step {
  id: string;
  title: string;
  description?: string;
  fields: (Field | RepeaterField)[];
}

export interface Collection {
  id: string;
  name: string;
  description?: string;
  steps: Step[];
}

export interface CollectionData {
  id: string;
  name: string;
  description?: string;
  steps: {
    id: string;
    title: string;
    description?: string;
    fields: {
      id: string;
      label: string;
      type: FieldType;
      required?: boolean;
      placeholder?: string;
      validation?: {
        min?: number;
        max?: number;
      };
      accept?: string;
      fields?: {
        id: string;
        label: string;
        type: FieldType;
        required?: boolean;
        placeholder?: string;
        validation?: {
          min?: number;
          max?: number;
        };
        accept?: string;
      }[];
    }[];
  }[];
}

export const defaultCollection: CollectionData = {
  id: "default",
  name: "Nouvelle Collection",
  steps: [
    {
      id: "step1",
      title: "Informations Générales",
      fields: [
        {
          id: "name",
          label: "Nom de la collection",
          type: FieldType.SHORT_TEXT,
          required: true,
          validation: { min: 3, max: 50 },
        },
        {
          id: "description",
          label: "Description",
          type: FieldType.LONG_TEXT,
          required: true,
          validation: { min: 10, max: 500 },
        },
      ],
    },
    {
      id: "step2",
      title: "Images",
      fields: [
        {
          id: "mainImage",
          label: "Image Principale",
          type: FieldType.FILE_UPLOAD,
          required: true,
          accept: "image/*",
        },
        {
          id: "additionalImages",
          label: "Images Supplémentaires",
          type: FieldType.REPEATER,
          fields: [
            {
              id: "image",
              label: "Image",
              type: FieldType.FILE_UPLOAD,
              required: true,
              accept: "image/*",
            },
            {
              id: "caption",
              label: "Légende",
              type: FieldType.SHORT_TEXT,
              required: false,
            },
          ],
        },
      ],
    },
  ],
};

export interface CollectionState {
  currentStep: number;
  steps: Step[];
  data: CollectionData;
  completedSteps: number[];
  validationErrors: {
    [key: string]: string;
  };
}

export const COLLECTION_STEPS: Step[] = [
  {
    id: "informations_produit",
    title: "Informations produit",
    fields: [
      {
        id: "nom_commercial",
        type: FieldType.SHORT_TEXT,
        label: "Nom commercial",
        required: true,
      },
      {
        id: "ref_formule",
        type: FieldType.SHORT_TEXT,
        label: "Référence formule",
        required: true,
      },
      {
        id: "ref_produit",
        type: FieldType.SHORT_TEXT,
        label: "Référence produit",
        required: true,
      },
      {
        id: "date_mise_marche",
        type: FieldType.DATE,
        label: "Date de mise sur le marché",
        required: true,
      },
      {
        id: "resp_mise_marche",
        type: FieldType.SHORT_TEXT,
        label: "Responsable de la mise sur le marché",
        required: true,
      },
      {
        id: "faconnerie",
        type: FieldType.SHORT_TEXT,
        label: "Façonnier",
        required: true,
      },
    ],
  },
  {
    id: "formule",
    title: "Formule quali-quantitative",
    fields: [
      {
        id: "ingredients",
        type: FieldType.REPEATER,
        label: "Ajouter un ingrédient",
        fields: [
          {
            id: "ingr_nom_inci",
            type: FieldType.SHORT_TEXT,
            label: "Nom INCI",
            required: true,
          },
          {
            id: "ingr_fonction",
            type: FieldType.SHORT_TEXT,
            label: "Fonction",
            required: true,
          },
          {
            id: "ingr_pourcent_min",
            type: FieldType.NUMBER,
            label: "% min",
            required: true,
          },
          {
            id: "ingr_pourcent_max",
            type: FieldType.NUMBER,
            label: "% max",
            required: true,
          },
          {
            id: "ingr_cas",
            type: FieldType.SHORT_TEXT,
            label: "N° CAS",
            required: true,
          },
          {
            id: "ingr_provenance",
            type: FieldType.SHORT_TEXT,
            label: "Provenance",
            required: true,
          },
          {
            id: "ingr_specif",
            type: FieldType.SHORT_TEXT,
            label: "Spécification",
            required: true,
          },
        ],
      },
      {
        id: "dossier_fabrication",
        type: FieldType.FILE_UPLOAD,
        label: "Document : Dossier de fabrication",
        required: true,
      },
      {
        id: "mode_operatoire",
        type: FieldType.FILE_UPLOAD,
        label: "Document : Mode opératoire",
        required: true,
      },
    ],
  },
  // ... Autres étapes à implémenter
];
