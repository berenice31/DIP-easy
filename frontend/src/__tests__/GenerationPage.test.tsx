// @ts-nocheck
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import GenerationPage from "../pages/Generation";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";

// Mock the services used inside the page
vi.mock("../services/templateService", () => ({
  templateService: {
    getTemplates: vi.fn().mockResolvedValue({ items: [] }),
  },
}));

vi.mock("../services/api", () => ({
  productService: {
    getAllProducts: vi.fn().mockResolvedValue([]),
  },
  authService: {
    login: vi.fn(),
    register: vi.fn(),
    getCurrentUser: vi.fn().mockResolvedValue(null),
  },
}));

// Stub Navigation component to avoid useAuth
vi.mock("../components/layout/Navigation", () => ({
  Navigation: () => null,
}));

type Gen = {
  id: string;
  initiated_at: string;
  status: string;
  product_id: string;
  template_id: string;
  drive_file_id?: string | null;
};

const mockGenerations: Gen[] = [];

vi.mock("../services/generationService", () => {
  const list = vi.fn(() => Promise.resolve([...mockGenerations]));
  const generate = vi.fn((_tpl: string, _prod: string) => {
    const newGen: Gen = {
      id: String(Math.random()),
      initiated_at: new Date().toISOString(),
      status: "pending",
      product_id: "p1",
      template_id: "t1",
    };
    mockGenerations.push(newGen);
    return Promise.resolve(newGen);
  });
  const validate = vi.fn(() => new Promise(() => {}));
  return {
    generationService: {
      list,
      generate,
      validate,
      finalize: vi.fn(),
      delete: vi.fn(),
    },
  };
});

describe("GenerationPage", () => {
  it("rafraîchit la liste après génération", async () => {
    render(
      <MemoryRouter>
        <GenerationPage
          initialStep={2}
          initialTemplateId="t1"
          initialProductId="p1"
        />
      </MemoryRouter>
    );

    // Aller au step 2 directement (bypass UI) : simuler sélection IDs via DOM not necessary; appel direct
    const genButton = await screen.findByRole("button", { name: /générer/i });
    await userEvent.click(genButton);

    // La ligne doit apparaître
    await waitFor(() => {
      expect(screen.getAllByRole("row").length).toBeGreaterThan(1);
    });
  });

  it("affiche un loader pendant la validation", async () => {
    render(
      <MemoryRouter>
        <GenerationPage
          initialStep={2}
          initialTemplateId="t1"
          initialProductId="p1"
        />
      </MemoryRouter>
    );

    // Génère d'abord un élément
    const genButton = await screen.findByRole("button", { name: /générer/i });
    await userEvent.click(genButton);

    // attendre que la ligne apparaisse
    await waitFor(() => {
      expect(screen.getAllByRole("row").length).toBeGreaterThan(1);
    });

    // Cliquer sur l'icône nuage (validate) — role button avec name "CloudUploadIcon" n'existe pas; utiliser query by title attribute maybe; on utilise getAllByRole("button")[index]
    const validateSvgs = await screen.findAllByTestId("CloudUploadIcon");
    const validateSvg = validateSvgs[0];
    const validateBtn = validateSvg.closest("button") as HTMLElement;
    await userEvent.click(validateBtn);

    // Attendre apparition du progressbar
    const loader = await screen.findByRole(
      "progressbar",
      {},
      { timeout: 2000 }
    );
    expect(loader).toBeInTheDocument();
  });

  it("affiche une ligne existante au départ", async () => {
    // Préremplir une génération pour afficher la ligne au départ
    mockGenerations.push({
      id: "existing",
      initiated_at: new Date().toISOString(),
      status: "pending",
      product_id: "p1",
      template_id: "t1",
    });

    render(
      <MemoryRouter>
        <GenerationPage initialTemplateId="t1" initialProductId="p1" />
      </MemoryRouter>
    );

    // La ligne doit apparaître
    await waitFor(() => {
      expect(screen.getAllByRole("row").length).toBeGreaterThan(1);
    });
  });
});
