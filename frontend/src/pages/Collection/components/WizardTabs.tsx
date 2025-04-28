import { Box, Flex, Text, useColorModeValue } from "@chakra-ui/react";
import { Step } from "../types/collection.types";

interface WizardTabsProps {
  steps: Step[];
  currentStep: number;
  completedSteps: number[];
  onStepClick: (stepIndex: number) => void;
}

export const WizardTabs: React.FC<WizardTabsProps> = ({
  steps,
  currentStep,
  completedSteps,
  onStepClick,
}) => {
  const activeBg = useColorModeValue("brand.500", "brand.200");
  const completedBg = useColorModeValue("green.500", "green.200");
  const inactiveBg = useColorModeValue("gray.200", "gray.600");

  const getStepStatus = (index: number) => {
    if (index === currentStep) return "active";
    if (completedSteps.includes(index)) return "completed";
    return "inactive";
  };

  const getStepColor = (status: string) => {
    switch (status) {
      case "active":
        return activeBg;
      case "completed":
        return completedBg;
      default:
        return inactiveBg;
    }
  };

  return (
    <Flex direction="column" gap={4} p={4}>
      {steps.map((step, index) => {
        const status = getStepStatus(index);
        const color = getStepColor(status);

        return (
          <Box
            key={step.id}
            p={4}
            borderRadius="md"
            bg={color}
            cursor={status !== "inactive" ? "pointer" : "not-allowed"}
            onClick={() => status !== "inactive" && onStepClick(index)}
            transition="all 0.2s"
            _hover={{
              transform: status !== "inactive" ? "translateX(4px)" : "none",
            }}
          >
            <Text fontWeight="bold" color="white">
              {index + 1}. {step.title}
            </Text>
          </Box>
        );
      })}
    </Flex>
  );
};
