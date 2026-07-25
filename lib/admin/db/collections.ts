export const ADMIN_COLLECTIONS = {
  admins: "admins",
  roles: "roles",
  permissions: "permissions",
  auditLogs: "audit_logs",
  bookingStatusHistory: "booking_status_history",
  dashboardSettings: "dashboard_settings",
  issues: "issues",
  bookings: "bookings",
  customers: "customers",
  consultations: "consultations",
  joinlist: "joinlist",
  images: "images",
  galleryMedia: "gallery_media",
} as const;

/** GridFS bucket for gallery image/video binaries */
export const GALLERY_GRIDFS_BUCKET = "gallery_media_files";
