import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
  useToast,
} from "@chakra-ui/react";
import {
  Step,
  Field,
  FieldType,
  RepeaterField,
} from "../types/collection.types";
import { useState } from "react";

interface StepFormProps {
  step: Step;
  data: Record<string, any>;
  onDataChange: (fieldId: string, value: any) => void;
  onComplete: () => void;
}

export const StepForm: React.FC<StepFormProps> = ({
  step,
  data,
  onDataChange,
  onComplete,
}) => {
  const toast = useToast();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = (field: Field, value: any): string | null => {
    if (field.required && !value) {
      return "Ce champ est requis";
    }
    if (field.validation) {
      if (field.validation.min && value.length < field.validation.min) {
        return `Minimum ${field.validation.min} caractères requis`;
      }
      if (field.validation.max && value.length > field.validation.max) {
        return `Maximum ${field.validation.max} caractères autorisés`;
      }
    }
    return null;
  };

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    step.fields.forEach((field) => {
      const error = validateField(field, data[field.id]);
      if (error) {
        newErrors[field.id] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);

    if (isValid) {
      onComplete();
    } else {
      toast({
        title: "Erreur de validation",
        description: "Veuillez corriger les erreurs dans le formulaire",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const renderField = (field: Field) => {
    switch (field.type) {
      case FieldType.SHORT_TEXT:
        return (
          <Input
            value={data[field.id] || ""}
            onChange={(e) => onDataChange(field.id, e.target.value)}
            placeholder={field.placeholder}
          />
        );
      case FieldType.LONG_TEXT:
        return (
          <Textarea
            value={data[field.id] || ""}
            onChange={(e) => onDataChange(field.id, e.target.value)}
            placeholder={field.placeholder}
          />
        );
      case FieldType.FILE_UPLOAD:
        return (
          <Input
            type="file"
            onChange={(e) => onDataChange(field.id, e.target.files?.[0])}
            accept={field.accept}
          />
        );
      case FieldType.REPEATER:
        if ("fields" in field) {
          return renderRepeaterField(field as RepeaterField);
        }
        return null;
      default:
        return null;
    }
  };

  const renderRepeaterField = (field: RepeaterField) => {
    const items = data[field.id] || [];
    return (
      <VStack spacing={4} align="stretch">
        {items.map((item: any, index: number) => (
          <Box key={index} p={4} borderWidth={1} borderRadius="md">
            {field.fields.map((subField) => (
              <FormControl key={subField.id} mb={4}>
                <FormLabel>{subField.label}</FormLabel>
                {renderField(subField)}
              </FormControl>
            ))}
            <Button
              size="sm"
              colorScheme="red"
              onClick={() => {
                const newItems = [...items];
                newItems.splice(index, 1);
                onDataChange(field.id, newItems);
              }}
            >
              Supprimer
            </Button>
          </Box>
        ))}
        <Button
          onClick={() => {
            const newItems = [...items, {}];
            onDataChange(field.id, newItems);
          }}
        >
          Ajouter un élément
        </Button>
      </VStack>
    );
  };

  return (
    <VStack spacing={6} align="stretch">
      {step.fields.map((field) => (
        <FormControl key={field.id} isInvalid={!!errors[field.id]}>
          <FormLabel>{field.label}</FormLabel>
          {renderField(field)}
          {errors[field.id] && (
            <Box color="red.500" mt={1}>
              {errors[field.id]}
            </Box>
          )}
        </FormControl>
      ))}
      <Button colorScheme="blue" onClick={handleSubmit}>
        Valider cette étape
      </Button>
    </VStack>
  );
};
