import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Tooltip,
  IconButton,
  Chip,
} from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridToolbar,
  GridRowParams,
} from "@mui/x-data-grid";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import { Navigation } from "../components/layout/Navigation";
import { generationService } from "../services/generationService";
import { productService } from "../services/api";
import { templateService } from "../services/templateService";

interface GenerationRow {
  id: string;
  initiated_at: string;
  product_id?: string;
  template_id?: string;
  status: string;
  drive_file_id?: string | null;
  product?: any;
  template?: any;
}

const DIPsPage: React.FC = () => {
  const [rows, setRows] = useState<GenerationRow[]>([]);
  const [loading, setLoading] = useState(false);

  const mergeData = (
    gens: any[],
    products: any[],
    templates: any[]
  ): GenerationRow[] => {
    return gens.map((g: any) => {
      const prod = products.find((p) => p.id === g.product_id);
      const tpl = templates.find((t) => t.id === g.template_id);
      return {
        ...g,
        product: prod ?? g.product ?? {},
        template: tpl ?? g.template ?? {},
      };
    });
  };

  const handleDeleteGeneration = async (id: string) => {
    try {
      await generationService.delete(id);
      setRows((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      try {
        const [gensRaw, prods, tplResp] = await Promise.all([
          generationService.list(),
          productService.getAllProducts(),
          templateService.getTemplates(),
        ]);

        // normalise templates pour avoir name/version comme GenerationPage
        const tplItems: any[] = (tplResp.items ?? tplResp).map((t: any) => ({
          id: t.id,
          name: t.name || t.nom || "Template",
          version: t.version || "1",
          thumbnail_url: t.thumbnail_url || undefined,
        }));

        const merged = mergeData(gensRaw, prods, tplItems);
        const flat = merged.map((g) => ({
          id: g.id,
          initiated_at: g.initiated_at,
          date: new Date(g.initiated_at).toLocaleDateString(),
          client: g.product?.nom_client || "",
          marque: g.product?.marque || "",
          produit: g.product?.nom_produit || "",
          template: g.template?.name || g.template_id,
          status: g.status,
          drive_file_id: g.drive_file_id,
        }));
        // DEBUG
        // @ts-ignore
        window.__DIP_ROWS__ = flat;
        flat.sort(
          (a, b) =>
            new Date(b.initiated_at).getTime() -
            new Date(a.initiated_at).getTime()
        );
        setRows(flat);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadAll();
  }, []);

  const columns: GridColDef[] = [
    { field: "date", headerName: "Date", flex: 0.7 },
    { field: "client", headerName: "Client", flex: 1 },
    { field: "marque", headerName: "Marque", flex: 1 },
    { field: "produit", headerName: "Produit", flex: 1.2 },
    { field: "template", headerName: "Modèle", flex: 1 },
    {
      field: "status",
      headerName: "Statut",
      flex: 0.8,
      renderCell: (params: GridRenderCellParams) =>
        params.value === "success" ? (
          <Chip label="VALIDÉ" color="success" size="small" />
        ) : (
          <Chip label="BROUILLON" color="warning" size="small" />
        ),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.6,
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams) => (
        <>
          {params.row.drive_file_id && (
            <Tooltip title="Voir le document">
              <IconButton
                size="small"
                href={`https://drive.google.com/file/d/${params.row.drive_file_id}/view`}
                target="_blank"
              >
                <VisibilityIcon />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title="Supprimer la génération">
            <IconButton
              size="small"
              onClick={() => handleDeleteGeneration(params.row.id)}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </>
      ),
    },
  ];

  return (
    <Box sx={{ display: "flex" }}>
      <Navigation />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h4" gutterBottom>
            Tous les DIP générés
          </Typography>
          <Box sx={{ height: 600, width: "100%" }}>
            <DataGrid
              rows={rows}
              columns={columns}
              loading={loading}
              getRowId={(row) => row.id}
              slots={{ toolbar: GridToolbar }}
              initialState={{
                pagination: { paginationModel: { pageSize: 10 } },
              }}
              pageSizeOptions={[10, 25, 50]}
              onRowClick={(params: GridRowParams) => {
                if (params.row.drive_file_id) {
                  window.open(
                    `https://drive.google.com/file/d/${params.row.drive_file_id}/view`,
                    "_blank"
                  );
                }
              }}
              sx={{
                "& .MuiDataGrid-row": {
                  cursor: "pointer",
                },
              }}
              slotProps={{
                toolbar: {
                  showQuickFilter: true,
                  quickFilterProps: { debounceMs: 500 },
                },
              }}
            />
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default DIPsPage;
