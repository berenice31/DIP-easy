import api from "./api";

class DriveService {
  async getConfig() {
    const response = await api.get("/drive/");
    return response.data;
  }

  async uploadCredentials(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post("/drive/credentials", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  }

  async setFolder(folderId: string) {
    const response = await api.post("/drive/folder", {
      folder_id: folderId,
    });
    return response.data;
  }
}

export const driveService = new DriveService();
