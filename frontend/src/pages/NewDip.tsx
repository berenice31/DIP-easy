import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Stepper,
  Step,
  StepLabel,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Tooltip,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Alert,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { fr } from "date-fns/locale";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { productService, DipFormData } from "../services/api";
import api from "../services/api";
import { Navigation } from "../components/layout/Navigation";
import { AttachmentUploader } from "../components/common/AttachmentUploader";
import { attachmentService } from "../services/attachmentService";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`dip-tabpanel-${index}`}
      aria-labelledby={`dip-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const steps = [
  "Informations produit",
  "Formule",
  "Physico-chimiques",
  "Microbiologie",
  "Impuretés & emballage",
  "Utilisation normale",
  "Expositions",
  "Profil toxicologique",
  "Effets indésirables",
  "Autres infos & tests",
  "Divers",
];

interface FormData {
  nom_client: string;
  marque: string;
  gamme: string;
  nom_produit: string;
  format: string;
  version: string;
  fournisseur: string;
  nom_commercial: string;
  ref_formule: string;
  ref_produit: string;
  date_mise_marche: Date | null;
  resp_mise_marche: string;
  faconnerie: string;
  ingredients: string | string[];
  ph: string;
  viscosite: string;
  densite: string;
  point_eclair: string;
  germes_aerobies: string;
  levures_moisissures: string;
  e_coli: string;
  staphylocoques: string;
  metaux_lourds: string;
  arsenic: string;
  plomb: string;
  mercure: string;
  type_emballage: string;
  materiau_emballage: string;
  utilisation_normale: string;
  instructions_utilisation: string;
  surface_exposee: string;
  quantite_appliquee: string;
  concentration_air: string;
  volume_respire: string;
  quantite_ingeree: string;
  dl50_orale: string;
  dl50_cutanee: string;
  cl50_inhalation: string;
  dose_sans_effet: string;
  dose_min_effet: string;
  irritation_cutanee: string;
  sensibilisation_cutanee: string;
  irritation_oculaire: string;
  duree_conservation: string;
  conditions_conservation: string;
  resultats_stabilite: string;
  valide_par: string;
  date_validation: Date | null;
}

// Fonction utilitaire pour convertir les dates en string ISO (YYYY-MM-DD)
function toIsoDateString(date: Date | null): string | null {
  if (!date) return null;
  if (typeof date === "string") return date;
  return date.toISOString().slice(0, 10);
}

// Construit le payload à envoyer à l'API en nettoyant les données
function buildPayload(
  formData: FormData,
  status: "DRAFT" | "VALIDATED" = "DRAFT"
) {
  const payload: any = {
    ...formData,
    date_mise_marche: toIsoDateString(formData.date_mise_marche),
    date_validation: toIsoDateString(formData.date_validation),
    status,
  };

  // Le backend attend des listes, on supprime les champs vides (chaînes)
  if (!formData.ingredients) {
    delete payload.ingredients;
  } else if (typeof formData.ingredients === "string") {
    if (formData.ingredients.trim() === "") {
      delete payload.ingredients;
    }
  } else if (Array.isArray(formData.ingredients)) {
    if (formData.ingredients.length === 0) {
      delete payload.ingredients;
    } else {
      // on convertit en chaîne séparée par des retours à la ligne pour le textarea
      payload.ingredients = formData.ingredients.join("\n");
    }
  }

  const percent = (() => {
    const keys = Object.keys(formData);
    const filled = keys.filter((k) => {
      const v: any = (formData as any)[k];
      return v !== null && v !== undefined && v !== "";
    });
    return keys.length ? Math.round((filled.length / keys.length) * 100) : 0;
  })();
  payload.progression = percent;

  // TODO: faire de même pour stability_tests / compatibility_tests si vous les ajoutez plus tard
  return payload;
}

interface NewDipProps {
  initialData?: Partial<FormData>;
  productId?: string;
}

const NewDip: React.FC<NewDipProps> = ({ initialData = {}, productId }) => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState<{ [k: number]: boolean }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [progress, setProgress] = useState(0);
  const [alert, setAlert] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });
  const [formulaAttachmentMode, setFormulaAttachmentMode] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
    trigger,
    formState,
    reset,
    getValues,
    setError,
  } = useForm<FormData>({
    defaultValues: {
      nom_client: "",
      marque: "",
      gamme: "",
      nom_produit: "",
      format: "",
      version: "",
      fournisseur: "",
      nom_commercial: "",
      ref_formule: "",
      ref_produit: "",
      date_mise_marche: null,
      resp_mise_marche: "",
      faconnerie: "",
      ingredients: "",
      ph: "",
      viscosite: "",
      densite: "",
      point_eclair: "",
      germes_aerobies: "",
      levures_moisissures: "",
      e_coli: "",
      staphylocoques: "",
      metaux_lourds: "",
      arsenic: "",
      plomb: "",
      mercure: "",
      type_emballage: "",
      materiau_emballage: "",
      utilisation_normale: "",
      instructions_utilisation: "",
      surface_exposee: "",
      quantite_appliquee: "",
      concentration_air: "",
      volume_respire: "",
      quantite_ingeree: "",
      dl50_orale: "",
      dl50_cutanee: "",
      cl50_inhalation: "",
      dose_sans_effet: "",
      dose_min_effet: "",
      irritation_cutanee: "",
      sensibilisation_cutanee: "",
      irritation_oculaire: "",
      duree_conservation: "",
      conditions_conservation: "",
      resultats_stabilite: "",
      valide_par: "",
      date_validation: null,
    },
    mode: "onChange",
  });

  // Appliquer les données initiales en édition
  useEffect(() => {
    if (Object.keys(initialData).length) {
      reset((prev) => ({ ...prev, ...initialData }));
    }
  }, [initialData, reset]);

  useEffect(() => {
    const initFormulaToggle = async () => {
      if (!productId) return;
      try {
        const attachments = await attachmentService.listByProduct(productId);
        const hasFormulaPdf = attachments.some(
          (att) => att.field_key === "formula"
        );
        if (hasFormulaPdf) setFormulaAttachmentMode(true);
      } catch (err) {
        console.error(err);
      }
    };
    initFormulaToggle();
  }, [productId]);

  const validationRules = {
    nom_client: { required: "Le nom du client est requis" },
    marque: { required: "La marque est requise" },
    gamme: { required: "La gamme est requise" },
    nom_produit: { required: "Le nom du produit est requis" },
    format: { required: "Le format est requis" },
    version: { required: "La version est requise" },
    fournisseur: { required: "Le fournisseur est requis" },
    nom_commercial: { required: "Le nom commercial est requis" },
    ref_formule: { required: "La référence formule est requise" },
    date_mise_marche: {
      // La date n'est plus requise en mode brouillon
      // required: "La date de mise sur le marché est requise"
    },
    resp_mise_marche: {
      required: "Le responsable de la mise sur le marché est requis",
    },
    faconnerie: { required: "Le façonnier est requis" },
    ingredients: { required: "La liste des ingrédients est requise" },
    ph: {
      required: "Le pH est requis",
      pattern: {
        value: /^-?\d*\.?\d+$/,
        message: "Le pH doit être un nombre",
      },
    },
    viscosite: {
      pattern: {
        value: /^\d*\.?\d+$/,
        message: "La viscosité doit être un nombre positif",
      },
    },
    densite: {
      pattern: {
        value: /^\d*\.?\d+$/,
        message: "La densité doit être un nombre positif",
      },
    },
    point_eclair: {
      pattern: {
        value: /^-?\d*\.?\d+$/,
        message: "Le point d'éclair doit être un nombre",
      },
    },
    germes_aerobies: {
      pattern: {
        value: /^\d+$/,
        message: "Le nombre de germes aérobies doit être un entier positif",
      },
    },
    levures_moisissures: {
      pattern: {
        value: /^\d+$/,
        message:
          "Le nombre de levures et moisissures doit être un entier positif",
      },
    },
    e_coli: {
      pattern: {
        value: /^\d+$/,
        message: "Le nombre d'E. coli doit être un entier positif",
      },
    },
    staphylocoques: {
      pattern: {
        value: /^\d+$/,
        message: "Le nombre de staphylocoques doit être un entier positif",
      },
    },
    metaux_lourds: {
      pattern: {
        value: /^\d*\.?\d+$/,
        message:
          "La concentration en métaux lourds doit être un nombre positif",
      },
    },
    arsenic: {
      pattern: {
        value: /^\d*\.?\d+$/,
        message: "La concentration en arsenic doit être un nombre positif",
      },
    },
    plomb: {
      pattern: {
        value: /^\d*\.?\d+$/,
        message: "La concentration en plomb doit être un nombre positif",
      },
    },
    mercure: {
      pattern: {
        value: /^\d*\.?\d+$/,
        message: "La concentration en mercure doit être un nombre positif",
      },
    },
    type_emballage: { required: "Le type d'emballage est requis" },
    materiau_emballage: { required: "Le matériau d'emballage est requis" },
    utilisation_normale: {
      required: "La description de l'utilisation normale est requise",
    },
    instructions_utilisation: {
      required: "Les instructions d'utilisation sont requises",
    },
    surface_exposee: {
      pattern: {
        value: /^\d*\.?\d+$/,
        message: "La surface exposée doit être un nombre positif",
      },
    },
    quantite_appliquee: {
      pattern: {
        value: /^\d*\.?\d+$/,
        message: "La quantité appliquée doit être un nombre positif",
      },
    },
    concentration_air: {
      pattern: {
        value: /^\d*\.?\d+$/,
        message: "La concentration dans l'air doit être un nombre positif",
      },
    },
    volume_respire: {
      pattern: {
        value: /^\d*\.?\d+$/,
        message: "Le volume respiré doit être un nombre positif",
      },
    },
    quantite_ingeree: {
      pattern: {
        value: /^\d*\.?\d+$/,
        message: "La quantité ingérée doit être un nombre positif",
      },
    },
    dl50_orale: {
      pattern: {
        value: /^\d*\.?\d+$/,
        message: "La DL50 orale doit être un nombre positif",
      },
    },
    dl50_cutanee: {
      pattern: {
        value: /^\d*\.?\d+$/,
        message: "La DL50 cutanée doit être un nombre positif",
      },
    },
    cl50_inhalation: {
      pattern: {
        value: /^\d*\.?\d+$/,
        message: "La CL50 inhalation doit être un nombre positif",
      },
    },
    dose_sans_effet: {
      pattern: {
        value: /^\d*\.?\d+$/,
        message: "La dose sans effet doit être un nombre positif",
      },
    },
    dose_min_effet: {
      pattern: {
        value: /^\d*\.?\d+$/,
        message: "La dose minimale avec effet doit être un nombre positif",
      },
    },
    duree_conservation: { required: "La durée de conservation est requise" },
    conditions_conservation: {
      required: "Les conditions de conservation sont requises",
    },
    resultats_stabilite: {
      required: "Les résultats des tests de stabilité sont requis",
    },
    valide_par: { required: "Le validateur est requis" },
    date_validation: { required: "La date de validation est requise" },
  };

  const validateStep = async (step: number) => {
    let fieldsToValidate: (keyof FormData)[] = [];

    switch (step) {
      case 0:
        fieldsToValidate = [
          "nom_client",
          "marque",
          "gamme",
          "nom_produit",
          "format",
          "version",
          "nom_commercial",
          "ref_formule",
          "date_mise_marche",
          "resp_mise_marche",
          "faconnerie",
        ];
        break;
      case 1:
        fieldsToValidate = ["ingredients" as keyof FormData];
        break;
      case 2:
        fieldsToValidate = ["ph", "viscosite", "densite", "point_eclair"];
        break;
      case 3:
        fieldsToValidate = [
          "germes_aerobies",
          "levures_moisissures",
          "e_coli",
          "staphylocoques",
        ];
        break;
      case 4:
        fieldsToValidate = [
          "metaux_lourds",
          "arsenic",
          "plomb",
          "mercure",
          "type_emballage",
          "materiau_emballage",
        ];
        break;
      case 5:
        fieldsToValidate = ["utilisation_normale", "instructions_utilisation"];
        break;
      case 6:
        fieldsToValidate = [
          "surface_exposee",
          "quantite_appliquee",
          "concentration_air",
          "volume_respire",
          "quantite_ingeree",
        ];
        break;
      case 7:
        fieldsToValidate = [
          "dl50_orale",
          "dl50_cutanee",
          "cl50_inhalation",
          "dose_sans_effet",
          "dose_min_effet",
        ];
        break;
      case 8:
        fieldsToValidate = [
          "irritation_cutanee",
          "sensibilisation_cutanee",
          "irritation_oculaire",
        ];
        break;
      case 9:
        fieldsToValidate = [
          "duree_conservation",
          "conditions_conservation",
          "resultats_stabilite",
        ];
        break;
      case 10:
        fieldsToValidate = ["valide_par", "date_validation"];
        break;
    }

    const result = await trigger(fieldsToValidate);
    return result;
  };

  const handleNext = async () => {
    const isValid = await validateStep(activeStep);
    if (isValid) {
      const newCompleted = completed;
      newCompleted[activeStep] = true;
      setCompleted(newCompleted);
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    setCompleted({});
  };

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      const isValid = await validateStep(activeStep);
      if (!isValid) {
        return;
      }
      // Mapping des dates avant envoi
      const payload = buildPayload(data, "VALIDATED");
      const response = productId
        ? await productService.updateProduct(productId, payload)
        : await productService.createProduct(payload);
      console.log("Product created:", response);
      reset();
      setActiveStep(0);
      setCompleted({});
      setAlert({
        open: true,
        message: "Le DIP a été créé avec succès !",
        severity: "success",
      });
    } catch (error: any) {
      console.error("Error creating product:", error);
      if (error.response) {
        console.log("Erreur backend:", error.response.data);
      }
      if (
        error.response &&
        error.response.status === 422 &&
        error.response.data &&
        Array.isArray(error.response.data.detail)
      ) {
        error.response.data.detail.forEach((err: any) => {
          if (err.loc && err.loc.length > 0 && err.loc[err.loc.length - 1]) {
            const field = err.loc[err.loc.length - 1];
            setError(field as keyof FormData, {
              type: "server",
              message: err.msg,
            });
          }
        });
        setAlert({
          open: true,
          message: "Merci de corriger les champs en erreur.",
          severity: "error",
        });
      } else if (error.response && error.response.data) {
        setAlert({
          open: true,
          message:
            typeof error.response.data === "string"
              ? error.response.data
              : JSON.stringify(error.response.data),
          severity: "error",
        });
      } else {
        setAlert({
          open: true,
          message: "Une erreur est survenue lors de la création du DIP.",
          severity: "error",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSubmitting(true);
      const formData = getValues();
      // Mapping des dates avant envoi + ajout du status draft
      const payload = buildPayload(formData, "DRAFT");
      const response = productId
        ? await productService.updateProduct(productId, payload)
        : await productService.createProduct(payload);
      console.log("Product saved:", response);
      setAlert({
        open: true,
        message: "Le DIP a été sauvegardé avec succès !",
        severity: "success",
      });
    } catch (error: any) {
      console.error("Error saving product:", error);
      if (error.response) {
        console.log("Erreur backend:", error.response.data);
      }
      if (
        error.response &&
        error.response.status === 422 &&
        error.response.data &&
        Array.isArray(error.response.data.detail)
      ) {
        error.response.data.detail.forEach((err: any) => {
          if (err.loc && err.loc.length > 0 && err.loc[err.loc.length - 1]) {
            const field = err.loc[err.loc.length - 1];
            setError(field as keyof FormData, {
              type: "server",
              message: err.msg,
            });
          }
        });
        setAlert({
          open: true,
          message: "Merci de corriger les champs en erreur.",
          severity: "error",
        });
      } else if (error.response && error.response.data) {
        setAlert({
          open: true,
          message:
            typeof error.response.data === "string"
              ? error.response.data
              : JSON.stringify(error.response.data),
          severity: "error",
        });
      } else {
        setAlert({
          open: true,
          message: "Une erreur est survenue lors de la sauvegarde du DIP.",
          severity: "error",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculer la progression
  useEffect(() => {
    const values = getValues();
    const keys = Object.keys(values);
    const filled = keys.filter((k) => {
      const v: any = (values as any)[k];
      return v !== null && v !== undefined && v !== "";
    });
    const newProgress = Math.round((filled.length / keys.length) * 100);
    setProgress(newProgress);
  }, [formState.dirtyFields, getValues]);

  // Gérer la navigation
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (Object.keys(formState.dirtyFields).length > 0) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [formState.dirtyFields]);

  const handleExit = () => {
    if (Object.keys(formState.dirtyFields).length > 0) {
      setShowExitDialog(true);
    } else {
      navigate("/products");
    }
  };

  const getStepStatus = (stepIdx: number) => {
    // Champs requis pour chaque étape (à adapter si besoin)
    const stepFields: { [key: number]: (keyof FormData)[] } = {
      0: [
        "nom_client",
        "marque",
        "gamme",
        "nom_produit",
        "format",
        "version",
        "nom_commercial",
        "ref_formule",
        "date_mise_marche",
        "resp_mise_marche",
        "faconnerie",
      ],
      // ... autres étapes ...
    };
    const filled = stepFields[stepIdx]?.filter((f) => getValues(f));
    if (!filled || filled.length === 0) return "none";
    if (filled.length < (stepFields[stepIdx]?.length || 1)) return "partial";
    return "complete";
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Navigation />
      <Box component="main" sx={{ flexGrow: 1, p: 1 }}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Nouveau DIP
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Stepper activeStep={activeStep} sx={{ mb: 2 }}>
              {steps.map((label, index) => {
                const status = getStepStatus(index);
                let color = "inherit";
                if (status === "partial") color = "orange";
                if (status === "complete") color = "green";
                return (
                  <Step key={label} completed={status === "complete"}>
                    <StepLabel
                      onClick={() => setActiveStep(index)}
                      sx={{
                        cursor: "pointer",
                        ".MuiStepIcon-root": {
                          color: color,
                        },
                      }}
                    >
                      {label}
                    </StepLabel>
                  </Step>
                );
              })}
            </Stepper>

            <Box sx={{ width: "100%" }}>
              <TabPanel value={activeStep} index={0}>
                <Typography variant="h6" gutterBottom>
                  Informations produit
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="nom_client"
                      control={control}
                      rules={validationRules.nom_client}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          required
                          label="Nom du client"
                          error={!!errors.nom_client}
                          helperText={errors.nom_client?.message as string}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="marque"
                      control={control}
                      rules={validationRules.marque}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          required
                          label="Marque"
                          error={!!errors.marque}
                          helperText={errors.marque?.message as string}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="gamme"
                      control={control}
                      rules={validationRules.gamme}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          required
                          label="Gamme"
                          error={!!errors.gamme}
                          helperText={errors.gamme?.message as string}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="nom_produit"
                      control={control}
                      rules={validationRules.nom_produit}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          required
                          label="Nom du produit"
                          error={!!errors.nom_produit}
                          helperText={errors.nom_produit?.message as string}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="format"
                      control={control}
                      rules={validationRules.format}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          required
                          label="Format"
                          error={!!errors.format}
                          helperText={errors.format?.message as string}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="version"
                      control={control}
                      rules={validationRules.version}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          required
                          label="Version"
                          error={!!errors.version}
                          helperText={errors.version?.message as string}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="nom_commercial"
                      control={control}
                      rules={validationRules.nom_commercial}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          required
                          label="Nom commercial"
                          error={!!errors.nom_commercial}
                          helperText={errors.nom_commercial?.message as string}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="ref_formule"
                      control={control}
                      rules={validationRules.ref_formule}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          required
                          label="Référence formule"
                          error={!!errors.ref_formule}
                          helperText={errors.ref_formule?.message as string}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="ref_produit"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Référence produit"
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="date_mise_marche"
                      control={control}
                      rules={validationRules.date_mise_marche}
                      render={({ field }) => (
                        <LocalizationProvider
                          dateAdapter={AdapterDateFns}
                          adapterLocale={fr}
                        >
                          <DatePicker
                            {...field}
                            label="Date de mise sur le marché"
                            slotProps={{
                              textField: {
                                fullWidth: true,
                                required: true,
                                error: !!errors.date_mise_marche,
                                helperText: errors.date_mise_marche
                                  ?.message as string,
                              },
                            }}
                          />
                        </LocalizationProvider>
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="resp_mise_marche"
                      control={control}
                      rules={validationRules.resp_mise_marche}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          required
                          label="Responsable de la mise sur le marché"
                          error={!!errors.resp_mise_marche}
                          helperText={
                            errors.resp_mise_marche?.message as string
                          }
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="faconnerie"
                      control={control}
                      rules={validationRules.faconnerie}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          required
                          label="Façonnier"
                          error={!!errors.faconnerie}
                          helperText={errors.faconnerie?.message as string}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="fournisseur"
                      control={control}
                      rules={validationRules.fournisseur}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          required
                          label="Fournisseur"
                          error={!!errors.fournisseur}
                          helperText={errors.fournisseur?.message as string}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </TabPanel>

              <TabPanel value={activeStep} index={1}>
                <Typography variant="h6" gutterBottom>
                  Formule quali-quantitative
                </Typography>
                {productId && (
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formulaAttachmentMode}
                        onChange={(e) =>
                          setFormulaAttachmentMode(e.target.checked)
                        }
                        name="formulaAttachmentMode"
                      />
                    }
                    label="Formule quali-quanti en pièce jointe"
                    sx={{ mb: 2 }}
                  />
                )}
                <Grid container spacing={3}>
                  {!formulaAttachmentMode && (
                    <Grid item xs={12}>
                      <Controller
                        name="ingredients"
                        control={control}
                        rules={validationRules.ingredients}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            required
                            multiline
                            rows={10}
                            label="Liste des ingrédients"
                            error={!!errors.ingredients}
                            helperText={errors.ingredients?.message as string}
                          />
                        )}
                      />
                    </Grid>
                  )}
                  {formulaAttachmentMode && productId && (
                    <Grid item xs={12}>
                      <AttachmentUploader
                        productId={productId}
                        fieldKey="formula"
                      />
                    </Grid>
                  )}
                </Grid>
              </TabPanel>

              <TabPanel value={activeStep} index={2}>
                <Typography variant="h6" gutterBottom>
                  Analyses Physico-chimiques
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      type="number"
                      label="pH"
                      name="ph"
                      InputProps={{ inputProps: { step: "0.1" } }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Viscosité (mPa.s)"
                      name="viscosite"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Densité"
                      name="densite"
                      InputProps={{ inputProps: { step: "0.001" } }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Point d'éclair (°C)"
                      name="point_eclair"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      label="Observations"
                      name="observations_physico"
                    />
                  </Grid>
                </Grid>
              </TabPanel>

              <TabPanel value={activeStep} index={3}>
                <Typography variant="h6" gutterBottom>
                  Analyses Microbiologiques
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Germes aérobies (ufc/g)"
                      name="germes_aerobies"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Levures et moisissures (ufc/g)"
                      name="levures_moisissures"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      type="number"
                      label="E. coli (ufc/g)"
                      name="e_coli"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Staphylocoques (ufc/g)"
                      name="staphylocoques"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      label="Observations"
                      name="observations_microbio"
                    />
                  </Grid>
                </Grid>
              </TabPanel>

              <TabPanel value={activeStep} index={4}>
                <Typography variant="h6" gutterBottom>
                  Impuretés & emballage
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Métaux lourds (ppm)"
                      name="metaux_lourds"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Arsenic (ppm)"
                      name="arsenic"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Plomb (ppm)"
                      name="plomb"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Mercure (ppm)"
                      name="mercure"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" gutterBottom>
                      Emballage
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Type d'emballage"
                      name="type_emballage"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Matériau"
                      name="materiau_emballage"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      label="Observations"
                      name="observations_impuretes"
                    />
                  </Grid>
                </Grid>
              </TabPanel>

              <TabPanel value={activeStep} index={5}>
                <Typography variant="h6" gutterBottom>
                  Utilisation normale
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      label="Description de l'utilisation normale"
                      name="utilisation_normale"
                      required
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Fréquence d'utilisation (par jour)"
                      name="frequence_utilisation"
                      InputProps={{ inputProps: { min: 1 } }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Durée d'utilisation (minutes)"
                      name="duree_utilisation"
                      InputProps={{ inputProps: { min: 1 } }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      label="Instructions d'utilisation"
                      name="instructions_utilisation"
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      label="Précautions d'emploi"
                      name="precautions_emploi"
                    />
                  </Grid>
                </Grid>
              </TabPanel>

              <TabPanel value={activeStep} index={6}>
                <Typography variant="h6" gutterBottom>
                  Expositions
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" gutterBottom>
                      Exposition cutanée
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Surface exposée (cm²)"
                      name="surface_exposee"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Quantité appliquée (mg/cm²)"
                      name="quantite_appliquee"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" gutterBottom>
                      Exposition par inhalation
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Concentration dans l'air (mg/m³)"
                      name="concentration_air"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Volume respiré (m³/jour)"
                      name="volume_respire"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" gutterBottom>
                      Exposition orale
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Quantité ingérée (mg/jour)"
                      name="quantite_ingeree"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      label="Observations"
                      name="observations_expositions"
                    />
                  </Grid>
                </Grid>
              </TabPanel>

              <TabPanel value={activeStep} index={7}>
                <Typography variant="h6" gutterBottom>
                  Profil toxicologique
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" gutterBottom>
                      Toxicité aiguë
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="DL50 orale (mg/kg)"
                      name="dl50_orale"
                      type="number"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="DL50 cutanée (mg/kg)"
                      name="dl50_cutanee"
                      type="number"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="CL50 inhalation (mg/L)"
                      name="cl50_inhalation"
                      type="number"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" gutterBottom>
                      Toxicité chronique
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Dose sans effet (mg/kg/jour)"
                      name="dose_sans_effet"
                      type="number"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Dose minimale avec effet (mg/kg/jour)"
                      name="dose_min_effet"
                      type="number"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" gutterBottom>
                      Autres études
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      label="Études de génotoxicité"
                      name="etudes_genotoxicite"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      label="Études de cancérogénicité"
                      name="etudes_cancerogenicite"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      label="Études de reprotoxicité"
                      name="etudes_reprotoxicite"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      label="Observations"
                      name="observations_toxicologie"
                    />
                  </Grid>
                </Grid>
              </TabPanel>

              <TabPanel value={activeStep} index={8}>
                <Typography variant="h6" gutterBottom>
                  Effets indésirables
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" gutterBottom>
                      Effets cutanés
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      label="Irritation cutanée"
                      name="irritation_cutanee"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      label="Sensibilisation cutanée"
                      name="sensibilisation_cutanee"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" gutterBottom>
                      Effets oculaires
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      label="Irritation oculaire"
                      name="irritation_oculaire"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" gutterBottom>
                      Autres effets
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      label="Effets systémiques"
                      name="effets_systemiques"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      label="Effets respiratoires"
                      name="effets_respiratoires"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      label="Observations"
                      name="observations_effets_indesirables"
                    />
                  </Grid>
                </Grid>
              </TabPanel>

              <TabPanel value={activeStep} index={9}>
                <Typography variant="h6" gutterBottom>
                  Autres infos & tests
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" gutterBottom>
                      Tests de stabilité
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Durée de conservation"
                      name="duree_conservation"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Conditions de conservation"
                      name="conditions_conservation"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      label="Résultats des tests de stabilité"
                      name="resultats_stabilite"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" gutterBottom>
                      Tests de compatibilité
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      label="Tests de compatibilité avec les matériaux"
                      name="tests_compatibilite"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" gutterBottom>
                      Autres informations
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      label="Informations sur la fabrication"
                      name="infos_fabrication"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      label="Informations sur le contrôle qualité"
                      name="infos_controle_qualite"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      label="Observations"
                      name="observations_autres_infos"
                    />
                  </Grid>
                </Grid>
              </TabPanel>

              <TabPanel value={activeStep} index={10}>
                <Typography variant="h6" gutterBottom>
                  Divers
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" gutterBottom>
                      Informations complémentaires
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      label="Références bibliographiques"
                      name="references_bibliographiques"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      label="Notes et commentaires"
                      name="notes_commentaires"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      label="Pièces jointes"
                      name="pieces_jointes"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" gutterBottom>
                      Validation
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField fullWidth label="Validé par" name="valide_par" />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <LocalizationProvider
                      dateAdapter={AdapterDateFns}
                      adapterLocale={fr}
                    >
                      <DatePicker
                        label="Date de validation"
                        slotProps={{ textField: { fullWidth: true } }}
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      label="Observations finales"
                      name="observations_finales"
                    />
                  </Grid>
                </Grid>
              </TabPanel>
            </Box>

            <Box
              sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}
            >
              <Button
                variant="contained"
                color="primary"
                onClick={handleSave}
                disabled={isSubmitting}
                sx={{ mr: 1 }}
              >
                {isSubmitting ? "Sauvegarde..." : "Sauvegarder"}
              </Button>
              <Box>
                <Button
                  disabled={activeStep === 0 || isSubmitting}
                  onClick={handleBack}
                  sx={{ mr: 1 }}
                >
                  Retour
                </Button>
                {activeStep === steps.length - 1 ? (
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Création en cours..." : "Terminer"}
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    disabled={isSubmitting}
                  >
                    Suivant
                  </Button>
                )}
              </Box>
            </Box>

            {/* Barre de progression */}
            <Box sx={{ mt: 4 }}>
              <Typography gutterBottom>Progression : {progress}%</Typography>
              <LinearProgress variant="determinate" value={progress} />
            </Box>
          </form>
        </Paper>

        <Snackbar
          open={alert.open}
          autoHideDuration={6000}
          onClose={() => setAlert({ ...alert, open: false })}
        >
          <Alert
            onClose={() => setAlert({ ...alert, open: false })}
            severity={alert.severity}
          >
            {alert.message}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default NewDip;
