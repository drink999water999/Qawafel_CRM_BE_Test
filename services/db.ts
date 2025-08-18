import { VLite } from "@vlcn.io/vlite";
import { VLiteVFS } from "@vlcn.io/vlite-vfs";

// VLiteVFS will automatically detect the Vercel Blob Storage environment
// and use it for persistence.
const vfs = new VLiteVFS();
const db = new VLite("qawafel-crm.db", vfs);

export default db;
