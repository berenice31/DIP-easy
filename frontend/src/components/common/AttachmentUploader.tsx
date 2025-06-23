import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
  CircularProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { Attachment } from "../../types";
import { attachmentService } from "../../services/attachmentService";

interface AttachmentUploaderProps {
  productId: string;
  fieldKey: string; // ex: "formula"
  onChange?: (attachments: Attachment[]) => void;
}

export const AttachmentUploader: React.FC<AttachmentUploaderProps> = ({
  productId,
  fieldKey,
  onChange,
}) => {
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [uploading, setUploading] = useState<boolean>(false);

  const refresh = async () => {
    const items = await attachmentService.listByProduct(productId);
    setAttachments(items);
    onChange?.(items);
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const file = e.target.files[0];
    setUploading(true);
    try {
      await attachmentService.upload(productId, fieldKey, file);
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    await attachmentService.delete(id);
    await refresh();
  };

  return (
    <Box>
      <Typography variant="subtitle1" gutterBottom>
        Pièces jointes ({fieldKey})
      </Typography>
      <Box display="flex" alignItems="center" gap={2} mb={2}>
        <Button
          variant="contained"
          component="label"
          startIcon={
            uploading ? <CircularProgress size={18} /> : <CloudUploadIcon />
          }
          disabled={uploading}
        >
          Télécharger
          <input type="file" hidden onChange={handleFileChange} />
        </Button>
      </Box>
      <List dense>
        {attachments
          .filter((a) => a.field_key === fieldKey)
          .map((att) => (
            <ListItem
              key={att.id}
              secondaryAction={
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => handleDelete(att.id)}
                >
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemText
                primary={att.file_name}
                secondary={att.alias || att.mime_type}
              />
            </ListItem>
          ))}
      </List>
    </Box>
  );
};
