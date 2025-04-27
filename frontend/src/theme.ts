import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  colors: {
    brand: {
      50: "#f0f9ff",
      100: "#e0f2fe",
      200: "#bae6fd",
      300: "#7dd3fc",
      400: "#38bdf8",
      500: "#0ea5e9",
      600: "#0284c7",
      700: "#0369a1",
      800: "#075985",
      900: "#0c4a6e",
    },
    custom: {
      sidebar: "#2A3E50",
      active: "#0284c7",
      background: "#F5F7FA",
      cardBackground: "#cecece",
    },
  },
  fonts: {
    heading: '"Montserrat", sans-serif',
    body: '"Roboto", sans-serif',
  },
  styles: {
    global: {
      body: {
        bg: "#F5F7FA",
        color: "gray.800",
        fontFamily: '"Roboto", sans-serif',
      },
      h1: {
        fontFamily: '"Montserrat", sans-serif',
      },
      h2: {
        fontFamily: '"Montserrat", sans-serif',
      },
      h3: {
        fontFamily: '"Montserrat", sans-serif',
      },
      h4: {
        fontFamily: '"Montserrat", sans-serif',
      },
      h5: {
        fontFamily: '"Montserrat", sans-serif',
      },
      h6: {
        fontFamily: '"Montserrat", sans-serif',
      },
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: "semibold",
        borderRadius: "md",
      },
      variants: {
        solid: {
          bg: "brand.500",
          color: "white",
          _hover: {
            bg: "brand.600",
          },
        },
      },
    },
    Card: {
      baseStyle: {
        container: {
          bg: "custom.cardBackground",
          borderRadius: "xl",
          boxShadow:
            "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          transition: "all 0.2s",
          _hover: {
            transform: "translateY(-2px)",
            boxShadow:
              "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
          },
        },
        header: {
          px: 6,
          py: 4,
          borderBottom: "1px solid",
          borderColor: "gray.100",
        },
        body: {
          px: 6,
          py: 4,
        },
        footer: {
          px: 6,
          py: 4,
          borderTop: "1px solid",
          borderColor: "gray.100",
        },
      },
    },
    Table: {
      baseStyle: {
        table: {
          borderCollapse: "separate",
          borderSpacing: 0,
        },
        th: {
          color: "blue.800",
          fontWeight: "bold",
          textTransform: "none",
          letterSpacing: "normal",
          borderBottom: "2px solid",
          borderColor: "gray.200",
          py: 3,
          px: 4,
        },
        td: {
          borderBottom: "1px solid",
          borderColor: "gray.100",
          py: 3,
          px: 4,
        },
        tr: {
          _hover: {
            bg: "#0284c7",
          },
        },
      },
    },
  },
});

export default theme;
