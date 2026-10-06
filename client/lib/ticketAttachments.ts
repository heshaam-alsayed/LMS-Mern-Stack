export type PendingTicketFile = {
  name: string;
  type: string;
  size: number;
  dataUrl: string;
};

export type SocketTicketFile = {
  name: string;
  type: string;
  size: number;
  data: Uint8Array;
};

export const MAX_TICKET_FILES = 5;
export const MAX_TICKET_FILE_SIZE = 4 * 1024 * 1024; // 4 MB

export const toSocketTicketFiles = async (
  files: File[],
): Promise<SocketTicketFile[]> =>
  Promise.all(
    files.map(async (file) => ({
      name: file.name,
      type: file.type,
      size: file.size,
      data: new Uint8Array(await file.arrayBuffer()),
    })),
  );

export const formatPendingSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;

  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const fileToDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(reader.result as string);

    reader.onerror = () => reject(reader.error);

    reader.readAsDataURL(file);
  });

export const toPendingTicketFile = async (
  file: File,
): Promise<PendingTicketFile> => ({
  name: file.name,
  type: file.type,
  size: file.size,
  dataUrl: await fileToDataUrl(file),
});